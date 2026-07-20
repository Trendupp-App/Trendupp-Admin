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

  test("should load team management page, search, invite, edit and remove staff member", async ({
    page,
  }) => {
    // Mock the invite API so we don't need a live backend
    await page.route("**/admin/users/invite", (route) => {
      route.fulfill({
        status: 201,
        body: "{}",
        contentType: "application/json",
      });
    });

    // Seed localStorage so canInvite resolves to true (owner role)
    await page.goto("/admin/team");
    await page.evaluate(() => {
      const authState = {
        state: {
          accessToken: "mock-token",
          user: {
            id: "mock-id",
            email: "owner@trendupp.com",
            firstName: "Admin",
            lastName: "Owner",
            role: "owner",
            isEmailVerified: true,
            onboardingPercentage: 100,
            onboardingStepsCompleted: {},
            socialsConnected: {
              instagram: false,
              tiktok: false,
              youtube: false,
              twitter: false,
            },
            username: null,
            niches: [],
            industries: [],
            assignedTier: null,
            bio: null,
            avatarUrl: null,
            bankName: null,
            bankAccountNumber: null,
            bankAccountName: null,
            brandRepresentative: null,
          },
        },
        version: 0,
      };
      localStorage.setItem("trendupp-auth", JSON.stringify(authState));
    });
    // Reload so Zustand hydrates the mocked session
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Verify page heading
    await expect(page.locator("h2").first()).toContainText("Team & Access");

    // Verify stats cards are present
    await expect(page.locator("text=Total Staff")).toBeVisible();
    await expect(page.locator("text=Roles Available")).toBeVisible();

    // Verify initial mock staff list
    await expect(page.locator("text=Adaeze Okonkwo")).toBeVisible();

    // Open Invite Staff Member modal (only visible for owner / super_admin)
    await page.click('button:has-text("Invite Staff Member")');
    await expect(page.locator("text=Invite Staff Member").last()).toBeVisible();

    // Fill the invitation form
    await page.fill(
      'input[placeholder="e.g. Adaeze Okonkwo"]',
      "Test Team Member",
    );
    await page.fill(
      'input[placeholder="staff@trendupp.com"]',
      "testmember@trendupp.com",
    );
    await page.click("text=Send Invitation");

    // Confirm new member was added in Pending Setup status
    await expect(
      page.locator("tbody").locator("text=Test Team Member"),
    ).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=testmember@trendupp.com")).toBeVisible();

    // Search for the new member
    await page.fill(
      'input[placeholder="Search name or email..."]',
      "Test Team",
    );
    await expect(page.locator("text=Adaeze Okonkwo")).not.toBeVisible();
    await expect(
      page.locator("tbody").locator("text=Test Team Member"),
    ).toBeVisible();

    // Clear search
    await page.fill('input[placeholder="Search name or email..."]', "");

    // Open Edit role modal
    await page.click('button:has-text("Edit") >> nth=0');
    await expect(page.locator("text=Edit — Adaeze Okonkwo")).toBeVisible();
    await page.click("text=Save Changes");

    // Open Remove staff modal
    await page.click('button:has-text("Remove") >> nth=0');
    await expect(page.locator("text=Remove Adaeze Okonkwo?")).toBeVisible();
    await page.click("text=Yes, Remove");
    await expect(page.locator("text=Adaeze Okonkwo")).not.toBeVisible();
  });
});
