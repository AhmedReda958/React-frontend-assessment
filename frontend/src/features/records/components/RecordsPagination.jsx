import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";

export function RecordsPagination({ pagination, onPageChange }) {
  if (!pagination) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Page {pagination.page} of {Math.max(pagination.totalPages, 1)} ({pagination.total} total)
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={!pagination.hasPrev}
        >
          <ChevronLeft className="mr-1 size-4" />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!pagination.hasNext}
        >
          Next
          <ChevronRight className="ml-1 size-4" />
        </Button>
      </div>
    </div>
  );
}
