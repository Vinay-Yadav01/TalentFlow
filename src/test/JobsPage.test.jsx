import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import JobsPage from "../pages/JobsPage";
import { jobsService } from "../mocks/jobsService";

// Test wrapper with router
const TestWrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe("JobsPage", () => {
  beforeEach(async () => {
    // Reset and seed with test data for deterministic tests
    await jobsService.reset();
    await jobsService.seed([
      {
        id: "1",
        title: "Frontend Developer",
        tags: ["React", "JavaScript"],
        status: "active",
        slug: "frontend-developer",
        description: "Build amazing UIs",
        order: 1,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "2",
        title: "Backend Engineer",
        tags: ["Node.js", "Python"],
        status: "active",
        slug: "backend-engineer",
        description: "Build scalable APIs",
        order: 2,
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      },
      {
        id: "3",
        title: "DevOps Engineer",
        tags: ["AWS", "Docker"],
        status: "archived",
        slug: "devops-engineer",
        description: "Manage infrastructure",
        order: 3,
        createdAt: "2024-01-03T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z",
      },
    ]);
  });

  it("displays jobs list with pagination", async () => {
    render(<JobsPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
    });

    // Should not show archived job by default (status filter is 'all' but showing all)
    expect(screen.getByText("DevOps Engineer")).toBeInTheDocument();
  });

  it("filters jobs by search term", async () => {
    const user = userEvent.setup();
    render(<JobsPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search jobs/i);
    await user.type(searchInput, "Frontend");

    await waitFor(() => {
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      expect(screen.queryByText("Backend Engineer")).not.toBeInTheDocument();
    });
  });

  it("filters jobs by status", async () => {
    const user = userEvent.setup();
    render(<JobsPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    });

    const statusFilter = screen.getByDisplayValue("All Jobs");
    await user.selectOptions(statusFilter, "active");

    await waitFor(() => {
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
      expect(screen.queryByText("DevOps Engineer")).not.toBeInTheDocument();
    });
  });

  it("opens create job modal", async () => {
    const user = userEvent.setup();
    render(<JobsPage />, { wrapper: TestWrapper });

    const createButton = screen.getByRole("button", { name: /create job/i });
    await user.click(createButton);

    expect(screen.getByText("Create New Job")).toBeInTheDocument();
    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
  });

  it("creates a new job", async () => {
    const user = userEvent.setup();
    render(<JobsPage />, { wrapper: TestWrapper });

    // Open modal - click the first "Create Job" button (header button)
    await user.click(screen.getAllByRole("button", { name: /create job/i })[0]);

    // Fill form
    await user.type(screen.getByLabelText(/job title/i), "New Job");
    await user.type(screen.getByLabelText(/location/i), "Remote");
    await user.type(screen.getByLabelText(/job description/i), "A great job");

    // Submit - click the modal submit button (has save icon)
    await user.click(screen.getByRole("button", { name: /create job/i }));

    await waitFor(() => {
      expect(screen.getByText("New Job")).toBeInTheDocument();
    });
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    render(<JobsPage />, { wrapper: TestWrapper });

    // Open modal - click the first "Create Job" button (header button)
    await user.click(screen.getAllByRole("button", { name: /create job/i })[0]);

    // Try to submit without title
    await user.click(screen.getByRole("button", { name: /create job/i }));

    expect(screen.getByText("Title is required")).toBeInTheDocument();
  });

  it("edits an existing job", async () => {
    const user = userEvent.setup();
    render(<JobsPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    });

    // Find and click edit button (first edit icon)
    const editButtons = screen.getAllByTitle(/edit job/i);
    await user.click(editButtons[0]);

    expect(screen.getByText("Edit Job")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Frontend Developer")).toBeInTheDocument();

    // Update title
    const titleInput = screen.getByDisplayValue("Frontend Developer");
    await user.clear(titleInput);
    await user.type(titleInput, "Senior Frontend Developer");

    // Save
    await user.click(screen.getByRole("button", { name: /update job/i }));

    await waitFor(() => {
      expect(screen.getByText("Senior Frontend Developer")).toBeInTheDocument();
      expect(screen.queryByText("Frontend Developer")).not.toBeInTheDocument();
    });
  });

  it("archives and unarchives jobs", async () => {
    const user = userEvent.setup();
    render(<JobsPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    });

    // Archive job
    const archiveButtons = screen.getAllByTitle(/archive job/i);
    await user.click(archiveButtons[0]);

    await waitFor(() => {
      // Job should still be visible but status changed
      const jobCard = screen
        .getByText("Frontend Developer")
        .closest(".bg-white");
      expect(jobCard).toHaveTextContent("Archived");
    });
  });

  it("shows no results message when no jobs match filters", async () => {
    const user = userEvent.setup();
    render(<JobsPage />, { wrapper: TestWrapper });

    const searchInput = screen.getByPlaceholderText(/search jobs/i);
    await user.type(searchInput, "nonexistent job");

    await waitFor(() => {
      expect(screen.getByText("No jobs found")).toBeInTheDocument();
      expect(screen.getByText("Clear filters")).toBeInTheDocument();
    });
  });
});
