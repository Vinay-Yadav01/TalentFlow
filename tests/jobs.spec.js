import { test, expect } from "@playwright/test";

test.describe("TalentFlow Jobs Board E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the jobs page
    await page.goto("/jobs");
  });

  test("displays jobs list and basic functionality", async ({ page }) => {
    // Wait for jobs to load
    await expect(page.locator("text=Frontend Developer")).toBeVisible();

    // Check page title
    await expect(page).toHaveTitle(/TalentFlow/);

    // Check header
    await expect(page.locator('h1:has-text("TalentFlow")')).toBeVisible();
    await expect(page.locator("text=Jobs Board")).toBeVisible();
  });

  test("search functionality works", async ({ page }) => {
    // Wait for jobs to load
    await expect(page.locator("text=Senior Frontend Developer")).toBeVisible();

    // Search for specific job
    const searchInput = page.locator('input[placeholder*="Search jobs"]');
    await searchInput.fill("Frontend");

    // Should show matching jobs
    await expect(page.locator("text=Senior Frontend Developer")).toBeVisible();

    // Should hide non-matching jobs
    await expect(page.locator("text=Backend Engineer")).not.toBeVisible();

    // Clear search
    await searchInput.clear();
    await expect(page.locator("text=Backend Engineer")).toBeVisible();
  });

  test("status filter works", async ({ page }) => {
    // Wait for jobs to load
    await expect(page.locator("text=Senior Frontend Developer")).toBeVisible();

    // Filter by active jobs
    await page.selectOption("select", "active");
    await expect(page.locator("text=Senior Frontend Developer")).toBeVisible();

    // Filter by archived jobs
    await page.selectOption("select", "archived");
    // Should show only archived jobs or "No jobs found" if none

    // Back to all jobs
    await page.selectOption("select", "all");
    await expect(page.locator("text=Senior Frontend Developer")).toBeVisible();
  });

  test("job creation workflow", async ({ page }) => {
    // Click create job button
    await page.click('button:has-text("Create Job")');

    // Modal should open
    await expect(page.locator("text=Create New Job")).toBeVisible();

    // Fill out the form
    await page.fill('input[name="title"]', "QA Engineer");
    await page.fill('input[name="location"]', "San Francisco");
    await page.selectOption('select[name="type"]', "Full-time");
    await page.fill('input[name="salary"]', "$70,000 - $90,000");
    await page.fill(
      'textarea[name="description"]',
      "We are looking for a QA engineer to ensure quality."
    );

    // Add tags
    const tagInput = page.locator('input[placeholder*="skill"]');
    await tagInput.fill("Testing");
    await tagInput.press("Enter");
    await tagInput.fill("Selenium");
    await tagInput.press("Enter");

    // Submit form
    await page.click('button:has-text("Create Job")');

    // Modal should close and job should appear
    await expect(page.locator("text=Create New Job")).not.toBeVisible();
    await expect(page.locator("text=QA Engineer")).toBeVisible();
  });

  test("job editing workflow", async ({ page }) => {
    // Wait for jobs to load
    await expect(page.locator("text=Senior Frontend Developer")).toBeVisible();

    // Click edit button for first job
    await page.click('[title="Edit job"]', { first: true });

    // Modal should open with existing data
    await expect(page.locator("text=Edit Job")).toBeVisible();

    // Update title
    const titleInput = page.locator('input[name="title"]');
    await titleInput.clear();
    await titleInput.fill("Lead Frontend Developer");

    // Save changes
    await page.click('button:has-text("Update Job")');

    // Modal should close and updated job should appear
    await expect(page.locator("text=Edit Job")).not.toBeVisible();
    await expect(page.locator("text=Lead Frontend Developer")).toBeVisible();
  });

  test("job archiving workflow", async ({ page }) => {
    // Wait for jobs to load
    await expect(page.locator("text=Senior Frontend Developer")).toBeVisible();

    // Click archive button for first job
    await page.click('[title="Archive job"]', { first: true });

    // Job status should change to archived
    const jobCard = page
      .locator("text=Senior Frontend Developer")
      .locator("..");
    await expect(jobCard.locator("text=Archived")).toBeVisible();

    // Click restore button
    await page.click('[title="Restore job"]', { first: true });

    // Job status should change back to active
    await expect(jobCard.locator("text=Active")).toBeVisible();
  });

  test("job detail page navigation", async ({ page }) => {
    // Wait for jobs to load
    await expect(page.locator("text=Senior Frontend Developer")).toBeVisible();

    // Click on job title to navigate to detail page
    await page.click("text=Senior Frontend Developer");

    // Should navigate to job detail page
    await expect(page).toHaveURL(/\/jobs\/senior-frontend-developer/);
    await expect(
      page.locator('h1:has-text("Senior Frontend Developer")')
    ).toBeVisible();

    // Should show job details
    await expect(page.locator("text=Job Description")).toBeVisible();

    // Back button should work
    await page.click("text=Back to Jobs");
    await expect(page).toHaveURL(/\/jobs$/);
  });

  test("pagination works when there are many jobs", async ({ page }) => {
    // This test assumes we have more than 8 jobs to trigger pagination
    // For now, we'll just check that pagination elements exist if needed
    const paginationExists =
      (await page.locator('[data-testid="pagination"]').count()) > 0;

    if (paginationExists) {
      // Test pagination navigation
      await page.click('button[aria-label="Next page"]');
      // Check URL or content changes
    }
  });

  test("drag and drop reordering (basic interaction)", async ({ page }) => {
    // Wait for jobs to load
    await expect(page.locator("text=Senior Frontend Developer")).toBeVisible();

    // Check if drag handles are visible on hover
    const firstJobCard = page.locator('[data-testid="job-card"]').first();
    await firstJobCard.hover();

    // The drag handle should become visible
    const dragHandle = firstJobCard.locator('[data-testid="drag-handle"]');
    if ((await dragHandle.count()) > 0) {
      await expect(dragHandle).toBeVisible();
    }

    // Note: Full drag and drop testing requires more complex setup
    // This is a basic interaction test
  });

  test("form validation works", async ({ page }) => {
    // Open create modal
    await page.click('button:has-text("Create Job")');

    // Try to submit without required fields
    await page.click('button:has-text("Create Job")');

    // Should show validation errors
    await expect(page.locator("text=Title is required")).toBeVisible();

    // Fill title but use invalid slug
    await page.fill('input[name="title"]', "Test Job");
    await page.fill('input[name="slug"]', "Invalid Slug!");
    await page.click('button:has-text("Create Job")');

    // Should show slug validation error
    await expect(page.locator("text=Slug can only contain")).toBeVisible();
  });

  test("responsive design works", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Jobs should still be visible
    await expect(page.locator("text=Senior Frontend Developer")).toBeVisible();

    // Create button should be visible
    await expect(page.locator('button:has-text("Create Job")')).toBeVisible();

    // Modal should work on mobile
    await page.click('button:has-text("Create Job")');
    await expect(page.locator("text=Create New Job")).toBeVisible();
  });
});
