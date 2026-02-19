import { useMemo, useState } from "react";
import { RecordsCards } from "./RecordsCards";
import { RecordsFilters } from "./RecordsFilters";
import {
  RecordsEmptyState,
  RecordsErrorState,
  RecordsLoadingState,
  RecordsRefreshingHint,
} from "./RecordsStates";
import { RecordsTable } from "./RecordsTable";
import { useRecordsData } from "../hooks/useRecordsData";

const INITIAL_FILTERS = {
  search: "",
  status: "all",
  department: "all",
};

export function RecordsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [retrySeed, setRetrySeed] = useState(0);
  const data = useRecordsData({ ...filters, retrySeed });

  const totalText = useMemo(() => {
    const count = data.records.length;
    return `${count} record${count === 1 ? "" : "s"} found`;
  }, [data.records.length]);

  function handleFilterChange(field, value) {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  }

  function handleResetFilters() {
    setFilters(INITIAL_FILTERS);
  }

  function handleRetry() {
    setRetrySeed((value) => value + 1);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Clinical Records</h1>
        <p className="text-sm text-muted-foreground">
          Browse patient records and filter by status, department, or search terms.
        </p>
      </header>

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
          <RecordsTable records={data.records} />
          <RecordsCards records={data.records} />
        </section>
      ) : null}
    </main>
  );
}
