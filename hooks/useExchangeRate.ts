import { useQuery } from "@tanstack/react-query";

const USD_RATES_URL = "https://open.er-api.com/v6/latest/USD";

async function fetchUsdToNgnRate(): Promise<number> {
  const res = await fetch(USD_RATES_URL);
  if (!res.ok) throw new Error("Failed to fetch exchange rate");
  const data = await res.json();
  const rate = data?.rates?.NGN;
  if (typeof rate !== "number") {
    throw new Error("NGN rate missing from exchange rate response");
  }
  return rate;
}

export function useUsdToNgnRate(enabled: boolean = true) {
  return useQuery({
    queryKey: ["exchange-rate", "USD", "NGN"],
    queryFn: fetchUsdToNgnRate,
    enabled,
    staleTime: 1000 * 60 * 60, // 1 hour — rates don't move fast enough to refetch more often
    gcTime: 1000 * 60 * 60 * 2,
    retry: 1,
  });
}
