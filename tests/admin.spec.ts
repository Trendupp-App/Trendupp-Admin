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

  test("should manage news articles, open publish drawer, and toggle delete modal", async ({
    page,
  }) => {
    // Go directly to news route
    await page.goto("/admin/content/news");
    await expect(page.locator("h2").last()).toContainText("News Management");

    // Check count header
    await expect(page.locator("text=5 articles total").first()).toBeVisible();

    // Open Publish Drawer
    await page.click('button:has-text("Publish New Article")');
    await expect(page.locator("text=Article Title *")).toBeVisible();

    // Fill in title
    await page.fill(
      'input[placeholder="Enter article title..."]',
      "Test Automated News Release",
    );

    // Save draft
    await page.click("text=Save as Draft");
    await expect(
      page.locator("text=Test Automated News Release"),
    ).toBeVisible();

    // Toggle delete modal
    await page.click('button[title="Delete"] >> nth=0');
    await expect(page.locator("text=Delete Article?")).toBeVisible();
    await page.click("text=Cancel");
    await expect(page.locator("text=Delete Article?")).not.toBeVisible();
  });
});
