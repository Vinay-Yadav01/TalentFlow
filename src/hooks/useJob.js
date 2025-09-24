import { useState, useEffect } from "react";

export function useJob(jobId) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    const fetchJob = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/jobs/${jobId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setData(null);
            setError(new Error("Job not found"));
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch job");
          }
        } else {
          const job = await response.json();
          setData(job);
        }
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  return {
    data,
    isLoading,
    error,
  };
}
