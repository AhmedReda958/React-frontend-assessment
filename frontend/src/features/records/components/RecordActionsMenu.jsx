import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { DeleteRecordDialog } from "./DeleteRecordDialog";
import { EditRecordDialog } from "./EditRecordDialog";

export function RecordActionsMenu({ record, onRecordUpdated, onRecordDeleted }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label="Record actions">
            <EllipsisVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setIsDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditRecordDialog
        record={record}
        onRecordUpdated={onRecordUpdated}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        hideTrigger
      />
      <DeleteRecordDialog
        record={record}
        onRecordDeleted={onRecordDeleted}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        hideTrigger
      />
    </>
  );
}
