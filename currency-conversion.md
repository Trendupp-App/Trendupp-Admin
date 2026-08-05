# Currency Conversion — How It Works (for Admin)

This documents how Trendupp's creator-facing frontend (`trendupp-fe`) shows Nigerian
creators money in Naira even when a campaign or fee is denominated in USD. It's
written so the same pattern can be reproduced in the Admin app — e.g. showing a
creator's fee request in their local currency alongside (or instead of) the raw
campaign currency.

## The problem it solves

Campaigns/budgets/fees are stored in whatever currency the brand set (`USD` or
`NGN`). Nigerian creators expect to see Naira everywhere, not the campaign's raw
currency. Rather than converting on the backend, the frontend converts **for
display only**, at render time, using a live FX rate — the stored amounts never
change.

## The three pieces

### 1. Decide *who* gets converted amounts — `useDisplayCurrency()`

`hooks/useExchangeRate.ts`

```ts
export function useDisplayCurrency() {
  const user = useAuthStore((s) => s.user);
  const displayInNgn = user?.country?.name?.toLowerCase() === 'nigeria';
  const { data: usdToNgnRate, isLoading: isLoadingRate } = useUsdToNgnRate(displayInNgn);
  return { displayInNgn, usdToNgnRate, isLoadingRate };
}
```

This is the single source of truth for "should this user see NGN instead of the
raw currency." Today it's gated on **the logged-in user's own country** being
Nigeria. For Admin, there is no "logged-in creator" — you'd gate it on **the
creator being viewed** instead, e.g. `creator.country?.name?.toLowerCase() === 'nigeria'`.

### 2. Fetch the live rate — `useUsdToNgnRate()`

Same file. Pulls from a free, keyless third-party API and caches it for an hour
(rates don't move fast enough to justify refetching more often):

```ts
const USD_RATES_URL = 'https://open.er-api.com/v6/latest/USD';

async function fetchUsdToNgnRate(): Promise<number> {
  const res = await fetch(USD_RATES_URL);
  if (!res.ok) throw new Error('Failed to fetch exchange rate');
  const data = await res.json();
  const rate = data?.rates?.NGN;
  if (typeof rate !== 'number') throw new Error('NGN rate missing from exchange rate response');
  return rate;
}

export function useUsdToNgnRate(enabled: boolean = true) {
  return useQuery({
    queryKey: ['exchange-rate', 'USD', 'NGN'],
    queryFn: fetchUsdToNgnRate,
    enabled,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2,
    retry: 1,
  });
}
```

Notes for reuse:
- This deliberately bypasses the app's normal `apiClient` (which points at our
  own backend with our own auth headers) and uses a bare `fetch` instead, since
  it's a third-party host.
- No API key needed. `enabled` is wired to `displayInNgn` so the request only
  fires for users who actually need it.
- `retry: 1` — if the third-party API is down/blocked, it gives up after one
  retry rather than hammering it. See **Pitfall #2** below for why that matters.

### 3. Do the actual conversion/formatting — `utils/Utilities.ts`

```ts
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  NGN: '₦',
  GBP: '£',
  EUR: '€',
};

export function getCurrencySymbol(currency = 'USD'): string {
  return CURRENCY_SYMBOLS[currency.toUpperCase()] ?? `${currency.toUpperCase()} `;
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Pure math, no fetching — easy to unit test independent of the rate query.
export function convertUsdToNgn(amountUsd: number, usdToNgnRate: number): number {
  return Math.round(amountUsd * usdToNgnRate);
}

// General-purpose helper for arbitrary money values (payout balances,
// transactions, escrow, fee requests — anywhere an amount shows up that isn't
// already routed through a campaign mapper).
export function convertForDisplay(
  amount: number,
  sourceCurrency: string,
  opts: { displayInNgn?: boolean; usdToNgnRate?: number },
): { amount: number; currency: string } {
  const normalized = (sourceCurrency || 'NGN').toUpperCase();
  if (opts.displayInNgn && normalized === 'USD' && opts.usdToNgnRate) {
    return { amount: convertUsdToNgn(amount, opts.usdToNgnRate), currency: 'NGN' };
  }
  return { amount, currency: opts.displayInNgn ? 'NGN' : normalized };
}
```

**This is the function to reuse for a creator's fee request in Admin**:

```ts
const { amount, currency } = convertForDisplay(
  feeRequest.amount,
  feeRequest.currency, // whatever currency it was submitted in
  { displayInNgn: creator.country?.name?.toLowerCase() === 'nigeria', usdToNgnRate },
);
// render: formatCurrency(amount, currency)
```

## How a page wires it together (real example)

`app/(creator)/creator/dashboard/page.tsx`:

```ts
const { displayInNgn, usdToNgnRate } = useDisplayCurrency();

const mappedCampaigns = liveCampaigns.map((c) => {
  const campaignCurrency = (c.currency ?? 'NGN').toUpperCase();
  const displayCurrency = displayInNgn ? 'NGN' : campaignCurrency;
  let totalBudget = c.totalBudget;
  if (displayInNgn && campaignCurrency === 'USD' && usdToNgnRate) {
    totalBudget = convertUsdToNgn(totalBudget, usdToNgnRate);
  }
  return {
    ...c,
    budget: formatCurrency(totalBudget, displayCurrency),
    currency: displayCurrency,
  };
});
```

The pattern is always the same 3 steps: get `{ displayInNgn, usdToNgnRate }` →
convert the raw amount if needed → format with the resulting currency.

## One special case: creator-tier budget ranges

`lib/campaignMappers.ts` → `getCampaignBudgetRange()`

Creator tiers (Nano/Micro/Mid/etc.) already store **both** a Naira minimum
cost and a USD minimum cost as separate columns (`minCostCreateNaira` /
`minCostCreateUsd`, and the "Amplify" goal equivalents). So for a tier-based
budget range, no live FX rate is needed at all — it's just a matter of reading
the Naira column instead of the USD column when `displayInNgn` is true. A live
rate is only needed for the **fallback** case where a campaign has no tiers and
you're stuck converting its raw `totalBudget`.

If Admin has similar dual-currency columns anywhere (e.g. a creator tier's
fee floor), prefer reading the matching column over converting — it's exact,
free, and doesn't depend on the third-party API being up.

## Pitfalls to avoid (found and fixed in trendupp-fe)

1. **Don't hardcode a currency symbol.** The "Fee Request" input on the apply
   sheet had `₦` hardcoded in both the label and input prefix, so it never
   changed for USD campaigns. Always derive the symbol from the resolved
   currency via `getCurrencySymbol(currency)`.

2. **Don't set the currency label before the rate has loaded.** Both
   `convertForDisplay()` and `getCampaignBudgetRange()` compute the **label**
   from `displayInNgn` alone, but only convert the **amount** if
   `usdToNgnRate` is actually available yet. If the rate query is still
   loading (or fails and exhausts its retry), you get a `₦` symbol on an
   **unconverted** USD number — silently wrong, not a clean fallback. Guard
   both the label and the amount on the same condition, or show a loading
   state until the rate resolves.

3. **It's per-context, not global.** `displayInNgn` is derived from whichever
   person's country you're checking — do this per creator/brand being
   displayed, not once globally, if Admin ever shows a list of people from
   different countries.

## Where this currently lives (creator side only)

`useDisplayCurrency()` is wired into:
- `app/(creator)/creator/dashboard/page.tsx`
- `app/(creator)/creator/my-work/page.tsx`
- `app/(creator)/creator/payout/page.tsx`
- `app/(creator)/creator/explore/page.tsx`
- `components/creator-dashboard/CampaignDetailsDrawer.tsx` (the apply sheet)
- `lib/campaignMappers.ts` (shared mapper, used by several of the above)

It is **not** implemented anywhere on the brand side of `trendupp-fe`, and
obviously doesn't exist in the Admin codebase at all yet — this doc is the
starting point for that.
