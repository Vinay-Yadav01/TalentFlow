import { useState, useEffect, useCallback } from "react";

export function useJobs({
  page = 1,
  pageSize = 8,
  search = "",
  status = "all",
} = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search,
        status,
      });

      const response = await fetch(`/api/jobs?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch jobs");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, status]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const createJob = useCallback(
    async (jobData) => {
      try {
        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create job");
        }

        // Refetch jobs after creating
        await fetchJobs();
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [fetchJobs]
  );

  const updateJob = useCallback(
    async (jobId, jobData) => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update job");
        }

        // Refetch jobs after updating
        await fetchJobs();
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [fetchJobs]
  );

  const toggleJobStatus = useCallback(
    async (jobId, status) => {
      try {
        const response = await fetch(`/api/jobs/${jobId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update job status");
        }

        // Refetch jobs after status change
        await fetchJobs();
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [fetchJobs]
  );

  const reorderJobs = useCallback(
    async (jobIds) => {
      // Optimistic update
      const previousData = data;
      if (data && data.jobs) {
        const reorderedJobs = jobIds
          .map((id) => data.jobs.find((job) => job.id === id))
          .filter(Boolean);
        setData({ ...data, jobs: reorderedJobs });
      }

      try {
        const response = await fetch("/api/jobs/reorder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobIds }),
        });

        if (!response.ok) {
          // Rollback on failure
          setData(previousData);
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to reorder jobs");
        }

        // Refetch to ensure consistency
        await fetchJobs();
      } catch (err) {
        // Rollback on failure
        setData(previousData);
        setError(err);
        throw err;
      }
    },
    [data, fetchJobs]
  );

  return {
    data,
    isLoading,
    error,
    createJob,
    updateJob,
    toggleJobStatus,
    reorderJobs,
    refetch: fetchJobs,
  };
}
