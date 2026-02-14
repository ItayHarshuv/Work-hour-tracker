import { useCallback, useEffect, useState } from "react";
import api from "../lib/api";

export function useEntries(jobId) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshEntries = useCallback(async () => {
    if (!jobId) {
      setEntries([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const { data } = await api.get(`/jobs/${jobId}/entries`);
      setEntries(data);
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to load entries");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    refreshEntries();
  }, [refreshEntries]);

  const addEntry = useCallback(
    async (payload) => {
      const { data } = await api.post(`/jobs/${jobId}/entries`, payload);
      await refreshEntries();
      return data;
    },
    [jobId, refreshEntries]
  );

  const updateEntryComment = useCallback(
    async (entryId, comment) => {
      const { data } = await api.patch(`/entries/${entryId}`, { comment });
      await refreshEntries();
      return data;
    },
    [refreshEntries]
  );

  const deleteEntry = useCallback(
    async (entryId) => {
      await api.delete(`/entries/${entryId}`);
      await refreshEntries();
    },
    [refreshEntries]
  );

  return {
    entries,
    loading,
    error,
    refreshEntries,
    addEntry,
    updateEntryComment,
    deleteEntry,
  };
}
