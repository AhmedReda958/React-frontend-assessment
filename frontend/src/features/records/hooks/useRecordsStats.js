import { useEffect, useState } from "react";
import { fetchRecordsStats } from "../api/recordsApi";

export function useRecordsStats(refreshSeed = 0) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadStats() {
      setError("");
      setIsLoading(true);

      try {
        const response = await fetchRecordsStats(controller.signal);

        if (!isMounted || !response) {
          return;
        }

        setStats(response);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(requestError.message || "Unable to load records statistics.");
      } finally {
        if (!isMounted) {
          return;
        }

        setIsLoading(false);
      }
    }

    loadStats();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [refreshSeed]);

  return {
    stats,
    isLoading,
    error,
  };
}
