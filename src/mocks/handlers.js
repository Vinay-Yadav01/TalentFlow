import { http, HttpResponse } from "msw";
import { jobsService } from "./jobsService";

export const handlers = [
  // Get jobs with pagination, search, and filters
  http.get("/api/jobs", async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const pageSize = parseInt(url.searchParams.get("pageSize")) || 8;
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "all";

    try {
      const result = await jobsService.getJobs({
        page,
        pageSize,
        search,
        status,
      });
      return HttpResponse.json(result);
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 500 });
    }
  }),

  // Get single job
  http.get("/api/jobs/:jobId", async ({ params }) => {
    try {
      const job = await jobsService.getJobById(params.jobId);
      if (!job) {
        return HttpResponse.json({ error: "Job not found" }, { status: 404 });
      }
      return HttpResponse.json(job);
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 500 });
    }
  }),

  // Create job
  http.post("/api/jobs", async ({ request }) => {
    try {
      const jobData = await request.json();
      const job = await jobsService.createJob(jobData);
      return HttpResponse.json(job, { status: 201 });
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 400 });
    }
  }),

  // Update job
  http.put("/api/jobs/:jobId", async ({ params, request }) => {
    try {
      const jobData = await request.json();
      const job = await jobsService.updateJob(params.jobId, jobData);
      return HttpResponse.json(job);
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 400 });
    }
  }),

  // Archive/Unarchive job
  http.patch("/api/jobs/:jobId/status", async ({ params, request }) => {
    try {
      const { status } = await request.json();
      const job = await jobsService.updateJobStatus(params.jobId, status);
      return HttpResponse.json(job);
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 400 });
    }
  }),

  // Reorder jobs
  http.post("/api/jobs/reorder", async ({ request }) => {
    try {
      const { jobIds } = await request.json();

      // Simulate potential failure for testing rollback
      if (process.env.NODE_ENV === "test" && Math.random() < 0.3) {
        return HttpResponse.json({ error: "Reorder failed" }, { status: 500 });
      }

      const jobs = await jobsService.reorderJobs(jobIds);
      return HttpResponse.json(jobs);
    } catch (error) {
      return HttpResponse.json({ error: error.message }, { status: 500 });
    }
  }),
];
