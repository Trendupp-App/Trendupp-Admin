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
    const mockUsers = [
      {
        id: "STF-1001",
        firstName: "Adaeze",
        lastName: "Okonkwo",
        email: "adaeze@trendupp.com",
        role: "support_agent",
        isEmailVerified: true,
        createdAt: "2026-01-15T00:00:00.000Z",
      },
    ];

    // Mock the list sub-admins API with query filtering
    await page.route("**/admin/users", (route) => {
      const url = new URL(route.request().url());
      const search = url.searchParams.get("q") || "";
      const role = url.searchParams.get("role") || "";
      const isActiveParam = url.searchParams.get("isActive");

      let filtered = [...mockUsers];

      if (search) {
        filtered = filtered.filter(
          (u) =>
            `${u.firstName} ${u.lastName}`
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()),
        );
      }

      if (role && role !== "all") {
        filtered = filtered.filter((u) => u.role === role);
      }

      if (isActiveParam !== null && isActiveParam !== undefined) {
        const isVerified = isActiveParam === "true";
        filtered = filtered.filter((u) => u.isEmailVerified === isVerified);
      }

      route.fulfill({
        status: 200,
        body: JSON.stringify(filtered),
        contentType: "application/json",
      });
    });

    // Mock the invite API and append to the mock list so the subsequent refetch shows it
    await page.route("**/admin/users/invite", (route) => {
      mockUsers.push({
        id: "STF-1004",
        firstName: "Test Team",
        lastName: "Member",
        email: "testmember@trendupp.com",
        role: "support_agent",
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
      });
      route.fulfill({
        status: 201,
        body: JSON.stringify({
          message:
            "Admin user invited successfully. A 7-day activation link has been emailed.",
          code: "902954",
          admin: {
            id: "STF-1004",
            email: "testmember@trendupp.com",
            firstName: "Test Team",
            lastName: "Member",
            role: "support_agent",
            isActive: true,
          },
        }),
        contentType: "application/json",
      });
    });

    // Mock PATCH and DELETE for single sub-admin updates
    await page.route(/\/admin\/users\/(?!invite$)[^/]+$/, async (route) => {
      const method = route.request().method();
      const urlParts = route.request().url().split("/");
      const id = urlParts[urlParts.length - 1];

      if (method === "PATCH") {
        const payload = route.request().postDataJSON();
        const user = mockUsers.find((u) => u.id === id);
        if (user && payload?.role) {
          user.role = payload.role;
        }
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
          contentType: "application/json",
        });
      } else if (method === "DELETE") {
        const index = mockUsers.findIndex((u) => u.id === id);
        if (index !== -1) {
          mockUsers.splice(index, 1);
        }
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
          contentType: "application/json",
        });
      } else {
        await route.continue();
      }
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
    await page.waitForLoadState("load");

    // Verify page heading
    await expect(page.locator("h2").first()).toContainText("Team & Access");

    // Verify stats cards are present
    await expect(page.locator("text=Total Staff").first()).toBeVisible();
    await expect(page.locator("text=Roles Available").first()).toBeVisible();

    // Verify initial mock staff list
    await expect(page.locator("text=Adaeze Okonkwo")).toBeVisible();

    // Open Invite Staff Member modal (only visible for owner / super_admin)
    await page.click('button:has-text("Invite Staff Member")');
    await expect(page.locator("text=Invite Staff Member").last()).toBeVisible();

    // Fill the invitation form
    await page.fill('input[placeholder="e.g. Adaeze"]', "Test Team");
    await page.fill('input[placeholder="e.g. Okonkwo"]', "Member");
    await page.fill(
      'input[placeholder="staff@trendupp.com"]',
      "testmember@trendupp.com",
    );
    await page.click("text=Send Invitation");

    // Close the Copy Invite dialog
    await page.click('button:has-text("Done")');

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
    await page.waitForTimeout(400);
    await expect(
      page.locator("tbody").locator("text=Adaeze Okonkwo"),
    ).not.toBeVisible();
    await expect(
      page.locator("tbody").locator("text=Test Team Member"),
    ).toBeVisible();

    // Clear search
    await page.fill('input[placeholder="Search name or email..."]', "");
    await page.waitForTimeout(400);

    // Open Edit role modal
    await page.click('button:has-text("Edit") >> nth=0');
    await expect(page.locator("text=Edit — Adaeze Okonkwo")).toBeVisible();
    await page.click("text=Save Changes");

    // Open Remove staff modal
    await page.click('button:has-text("Remove") >> nth=0');
    await expect(page.locator("text=Remove Adaeze Okonkwo?")).toBeVisible();
    await page.click("text=Yes, Remove");
    await expect(
      page.locator("tbody").locator("text=Adaeze Okonkwo"),
    ).not.toBeVisible();
  });
});
