import { useEffect, useMemo, useRef, useState } from "react";
import { fetchDepartments, fetchRecords } from "../api/recordsApi";

const DEFAULT_FILTERS = {
  search: "",
  status: "all",
  department: "all",
  page: 1,
  limit: 5,
  sortBy: "id",
  sortOrder: "asc",
};

export function useRecordsData({
  search,
  status,
  department,
  page,
  limit,
  sortBy,
  sortOrder,
  retrySeed = 0,
}) {
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const hasLoadedRef = useRef(false);

  const requestFilters = useMemo(
    () => ({
      ...DEFAULT_FILTERS,
      search: search || DEFAULT_FILTERS.search,
      status: status || DEFAULT_FILTERS.status,
      department: department || DEFAULT_FILTERS.department,
      page: page || DEFAULT_FILTERS.page,
      limit: limit || DEFAULT_FILTERS.limit,
      sortBy: sortBy || DEFAULT_FILTERS.sortBy,
      sortOrder: sortOrder || DEFAULT_FILTERS.sortOrder,
      retrySeed,
    }),
    [search, status, department, page, limit, sortBy, sortOrder, retrySeed]
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadDepartments() {
      try {
        const departmentsResult = await fetchDepartments(controller.signal);

        if (!isMounted || !Array.isArray(departmentsResult)) {
          return;
        }

        setDepartments(departmentsResult);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(requestError.message || "Unable to load filter options.");
      }
    }

    loadDepartments();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const firstLoad = !hasLoadedRef.current;

    async function loadRecords() {
      if (firstLoad) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setError("");

      try {
        const recordsResult = await fetchRecords(requestFilters, controller.signal);

        if (!isMounted || recordsResult === null) {
          return;
        }

        setRecords(recordsResult.data || []);
        setPagination(recordsResult.pagination || null);
        hasLoadedRef.current = true;
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(requestError.message || "Something went wrong.");
      } finally {
        if (!isMounted) {
          return;
        }

        setIsLoading(false);
        setIsRefreshing(false);
      }
    }

    loadRecords();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [requestFilters]);

  return {
    records,
    pagination,
    departments,
    isLoading,
    isRefreshing,
    error,
  };
}
