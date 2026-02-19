import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "../../../hooks/use-toast";
import { Button } from "../../../components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { deleteRecord } from "../api/recordsApi";

export function DeleteRecordDialog({
  record,
  onRecordDeleted,
  trigger,
  open,
  onOpenChange,
  hideTrigger = false,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof open === "boolean";
  const isOpen = isControlled ? open : internalOpen;

  function setIsOpen(nextOpen) {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    if (onOpenChange) {
      onOpenChange(nextOpen);
    }
  }

  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await deleteRecord(record.id);
      toast({
        title: "Record deleted",
        description: `${record.patientName} has been removed.`,
      });
      onRecordDeleted();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Unable to delete record",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {!hideTrigger ? (
        <AlertDialogTrigger asChild>
          {trigger || (
            <Button type="button" size="sm" variant="destructive">
              <Trash2 className="mr-1 size-4" />
              Delete
            </Button>
          )}
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this record?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The record for {record.patientName} ({record.patientId})
            will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
