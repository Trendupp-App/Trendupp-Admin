# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel Navigation >> should load admin dashboard and navigate to Paid campaigns
- Location: tests/admin.spec.ts:4:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1')
Expected substring: "Super Admin Dashboard"
Received string:    "Dashboard"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h1')
    14 × locator resolved to <h1>Dashboard</h1>
       - unexpected value "Dashboard"

```

```yaml
- heading "Dashboard" [level=1]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Admin Panel Navigation", () => {
  4  |   test("should load admin dashboard and navigate to Paid campaigns", async ({ page }) => {
  5  |     // Navigate to admin base URL
  6  |     await page.goto("/admin/dashboard");
> 7  |     await expect(page.locator("h1")).toContainText("Super Admin Dashboard");
     |                                      ^ Error: expect(locator).toContainText(expected) failed
  8  | 
  9  |     // Click on sidebar campaigns link
  10 |     await page.click("text=Paid");
  11 |     await expect(page).toHaveURL(/\/admin\/campaigns/);
  12 |   });
  13 | });
  14 | 
```