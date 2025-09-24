import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import JobDetailPage from "../pages/JobDetailPage";
import { jobsService } from "../mocks/jobsService";

describe("JobDetailPage", () => {
  beforeEach(async () => {
    await jobsService.reset();
    await jobsService.seed([
      {
        id: "1",
        title: "Frontend Developer",
        tags: ["React", "JavaScript"],
        status: "active",
        slug: "frontend-developer",
        description: "Build amazing user interfaces with React",
        location: "Remote",
        type: "Full-time",
        salary: "$80,000 - $120,000",
        order: 1,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    ]);
  });

  it("displays job details by slug", async () => {
    render(
      <MemoryRouter initialEntries={["/jobs/frontend-developer"]}>
        <JobDetailPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      expect(
        screen.getByText("Build amazing user interfaces with React")
      ).toBeInTheDocument();
      expect(screen.getByText("Remote")).toBeInTheDocument();
      expect(screen.getByText("Full-time")).toBeInTheDocument();
      expect(screen.getByText("$80,000 - $120,000")).toBeInTheDocument();
    });

    // Check tags
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();

    // Check status
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("displays job details by ID", async () => {
    render(
      <MemoryRouter initialEntries={["/jobs/1"]}>
        <JobDetailPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    });
  });

  it("shows error for non-existent job", async () => {
    render(
      <MemoryRouter initialEntries={["/jobs/nonexistent"]}>
        <JobDetailPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/job not found/i)).toBeInTheDocument();
      expect(screen.getByText("Back to Jobs")).toBeInTheDocument();
    });
  });

  it("updates document title", async () => {
    render(
      <MemoryRouter initialEntries={["/jobs/frontend-developer"]}>
        <JobDetailPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(document.title).toBe("Frontend Developer - TalentFlow");
    });
  });
});
