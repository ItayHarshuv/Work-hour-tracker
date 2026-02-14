import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../lib/api";

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/jobs");
      setJobs(data);
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshJobs();
  }, [refreshJobs]);

  const createJob = useCallback(
    async (payload) => {
      const { data } = await api.post("/jobs", payload);
      await refreshJobs();
      return data;
    },
    [refreshJobs]
  );

  const deleteJob = useCallback(
    async (jobId) => {
      await api.delete(`/jobs/${jobId}`);
      await refreshJobs();
    },
    [refreshJobs]
  );

  const clockIn = useCallback(
    async (jobId) => {
      await api.post(`/jobs/${jobId}/clock-in`);
      await refreshJobs();
    },
    [refreshJobs]
  );

  const clockOut = useCallback(
    async (jobId) => {
      await api.post(`/jobs/${jobId}/clock-out`);
      await refreshJobs();
    },
    [refreshJobs]
  );

  const activeJobsCount = useMemo(() => jobs.filter((job) => job.activeEntry).length, [jobs]);

  return {
    jobs,
    loading,
    error,
    activeJobsCount,
    refreshJobs,
    createJob,
    deleteJob,
    clockIn,
    clockOut,
  };
}
