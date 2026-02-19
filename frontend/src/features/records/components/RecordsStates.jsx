import { AlertCircle, Inbox } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import { Skeleton } from "../../../components/ui/skeleton";

export function RecordsLoadingState() {
  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  );
}

export function RecordsRefreshingHint() {
  return <p className="text-sm text-muted-foreground">Refreshing records...</p>;
}

export function RecordsErrorState({ message, onRetry }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Failed to load records</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{message}</p>
        <Button type="button" variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export function RecordsEmptyState() {
  return (
    <div className="rounded-lg border border-dashed bg-card px-6 py-10 text-center">
      <Inbox className="mx-auto mb-3 size-10 text-muted-foreground" />
      <h3 className="text-lg font-semibold">No clinical records found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Adjust the current filters or search term and try again.
      </p>
    </div>
  );
}
