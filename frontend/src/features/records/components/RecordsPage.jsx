import { useEffect, useMemo, useState } from "react";
import { RecordsCards } from "./RecordsCards";
import { CreateRecordDialog } from "./CreateRecordDialog";
import { RecordsFilters } from "./RecordsFilters";
import { RecordsPagination } from "./RecordsPagination";
import {
  RecordsEmptyState,
  RecordsErrorState,
  RecordsLoadingState,
  RecordsRefreshingHint,
} from "./RecordsStates";
import { RecordsStats } from "./RecordsStats";
import { RecordsTable } from "./RecordsTable";
import { useRecordsData } from "../hooks/useRecordsData";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useRecordsStats } from "../hooks/useRecordsStats";
import {
  createUrlSearchFromFilters,
  getDefaultFilters,
  readFiltersFromUrl,
} from "../utils/urlFilters";

export function RecordsPage() {
  const [filters, setFilters] = useState(() => readFiltersFromUrl(window.location.search));
  const [retrySeed, setRetrySeed] = useState(0);
  const debouncedSearch = useDebouncedValue(filters.search, 350);

  const appliedFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [filters, debouncedSearch]
  );

  const data = useRecordsData({ ...appliedFilters, retrySeed });
  const statsData = useRecordsStats(retrySeed);

  useEffect(() => {
    const nextSearch = createUrlSearchFromFilters(appliedFilters);
    const currentSearch = window.location.search.replace("?", "");

    if (nextSearch === currentSearch) {
      return;
    }

    const nextUrl = `${window.location.pathname}${
      nextSearch ? `?${nextSearch}` : ""
    }${window.location.hash}`;
    window.history.replaceState(null, "", nextUrl);
  }, [appliedFilters]);

  useEffect(() => {
    function handlePopState() {
      setFilters(readFiltersFromUrl(window.location.search));
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!data.pagination) {
      return;
    }

    if (data.pagination.totalPages > 0 && filters.page > data.pagination.totalPages) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        page: data.pagination.totalPages,
      }));
    }
  }, [data.pagination, filters.page]);

  const totalText = useMemo(() => {
    const count = data.pagination?.total ?? data.records.length;
    return `${count} record${count === 1 ? "" : "s"} found`;
  }, [data.pagination?.total, data.records.length]);

  function handleFilterChange(field, value) {
    setFilters((prevFilters) => {
      const shouldResetPage = field !== "page";

      return {
        ...prevFilters,
        [field]: value,
        ...(shouldResetPage ? { page: 1 } : {}),
      };
    });
  }

  function handleResetFilters() {
    setFilters(getDefaultFilters());
  }

  function handleRetry() {
    setRetrySeed((value) => value + 1);
  }

  function handleRecordCreated() {
    setRetrySeed((value) => value + 1);
  }

  function handleRecordUpdated() {
    setRetrySeed((value) => value + 1);
  }

  function handleRecordDeleted() {
    setRetrySeed((value) => value + 1);
  }

  function handleSortChange(field) {
    setFilters((prevFilters) => {
      const isCurrentField = prevFilters.sortBy === field;
      const nextSortOrder =
        isCurrentField && prevFilters.sortOrder === "asc" ? "desc" : "asc";

      return {
        ...prevFilters,
        sortBy: field,
        sortOrder: nextSortOrder,
        page: 1,
      };
    });
  }

  function handlePageChange(nextPage) {
    if (!data.pagination) {
      return;
    }

    if (nextPage < 1 || nextPage > data.pagination.totalPages) {
      return;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      page: nextPage,
    }));
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <header className="space-y-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Clinical Records</h1>
            <p className="text-sm text-muted-foreground">
              Browse patient records and filter by status, department, or search terms.
            </p>
          </div>
          <CreateRecordDialog onRecordCreated={handleRecordCreated} />
        </div>
      </header>

      <RecordsStats
        stats={statsData.stats}
        isLoading={statsData.isLoading}
        error={statsData.error}
      />

      <RecordsFilters
        filters={filters}
        departments={data.departments}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {data.isRefreshing && !data.isLoading ? <RecordsRefreshingHint /> : null}

      {data.isLoading ? <RecordsLoadingState /> : null}

      {!data.isLoading && data.error ? (
        <RecordsErrorState message={data.error} onRetry={handleRetry} />
      ) : null}

      {!data.isLoading && !data.error && data.records.length === 0 ? <RecordsEmptyState /> : null}

      {!data.isLoading && !data.error && data.records.length > 0 ? (
        <section className="space-y-3">
          <p className="text-sm text-muted-foreground">{totalText}</p>
          <RecordsTable
            records={data.records}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortChange={handleSortChange}
            onRecordUpdated={handleRecordUpdated}
            onRecordDeleted={handleRecordDeleted}
          />
          <RecordsCards
            records={data.records}
            onRecordUpdated={handleRecordUpdated}
            onRecordDeleted={handleRecordDeleted}
          />
          <RecordsPagination pagination={data.pagination} onPageChange={handlePageChange} />
        </section>
      ) : null}
    </main>
  );
}
