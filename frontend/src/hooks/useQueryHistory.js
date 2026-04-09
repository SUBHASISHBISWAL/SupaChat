import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook to interact with the backend history API.
 * @returns {{ entries: Array, selectEntry: (entry: object) => void, clearHistory: () => Promise<void>, isLoading: boolean }}
 */
export function useQueryHistory(onSelectPastQuery) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await fetch('/api/history', { method: 'DELETE' });
      setEntries([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  }, []);

  // Use this to auto-fetch when mounted
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const selectEntry = useCallback((entry) => {
    if (onSelectPastQuery) {
      onSelectPastQuery(entry.original_message);
    }
  }, [onSelectPastQuery]);

  return {
    entries,
    selectEntry,
    clearHistory,
    isLoading,
    refreshHistory: fetchHistory
  };
}
