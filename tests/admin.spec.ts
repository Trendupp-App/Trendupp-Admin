import { test, expect } from "@playwright/test";

test.describe("Admin Panel Navigation", () => {
  test("should load admin dashboard and navigate to Paid campaigns", async ({
    page,
  }) => {
    // Navigate to admin base URL
    await page.goto("/admin/dashboard");
    await expect(page.locator("h2").first()).toContainText("Dashboard");

    // Click on sidebar campaigns link
    await page.click("text=Paid");
    await expect(page).toHaveURL(/\/admin\/campaigns/);
  });
});
