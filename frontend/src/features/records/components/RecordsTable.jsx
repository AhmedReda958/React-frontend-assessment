import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { formatDate } from "../utils/date";
import { RecordActionsMenu } from "./RecordActionsMenu";
import { StatusBadge } from "./StatusBadge";

function SortableHeader({ children, field, sortBy, sortOrder, onSortChange }) {
  const isActive = sortBy === field;

  return (
    <Button
      type="button"
      variant="ghost"
      className="-ml-3 h-8 px-3"
      onClick={() => onSortChange(field)}
    >
      {children}
      {isActive ? (
        sortOrder === "asc" ? (
          <ArrowUp className="ml-1 size-4" />
        ) : (
          <ArrowDown className="ml-1 size-4" />
        )
      ) : (
        <ArrowUpDown className="ml-1 size-4 text-muted-foreground" />
      )}
    </Button>
  );
}

export function RecordsTable({
  records,
  sortBy,
  sortOrder,
  onSortChange,
  onRecordUpdated,
  onRecordDeleted,
}) {
  return (
    <div className="hidden rounded-lg border bg-card lg:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortableHeader
                field="patientId"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
              >
                Patient ID
              </SortableHeader>
            </TableHead>
            <TableHead>
              <SortableHeader
                field="patientName"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
              >
                Name
              </SortableHeader>
            </TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>
              <SortableHeader
                field="diagnosis"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
              >
                Diagnosis
              </SortableHeader>
            </TableHead>
            <TableHead>
              <SortableHeader
                field="admissionDate"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
              >
                Admission Date
              </SortableHeader>
            </TableHead>
            <TableHead>Discharge Date</TableHead>
            <TableHead>
              <SortableHeader
                field="status"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
              >
                Status
              </SortableHeader>
            </TableHead>
            <TableHead>
              <SortableHeader
                field="department"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
              >
                Department
              </SortableHeader>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.patientId}</TableCell>
              <TableCell>{record.patientName}</TableCell>
              <TableCell>{formatDate(record.dateOfBirth)}</TableCell>
              <TableCell>{record.diagnosis}</TableCell>
              <TableCell>{formatDate(record.admissionDate)}</TableCell>
              <TableCell>{formatDate(record.dischargeDate)}</TableCell>
              <TableCell>
                <StatusBadge status={record.status} />
              </TableCell>
              <TableCell>{record.department}</TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <RecordActionsMenu
                    record={record}
                    onRecordUpdated={onRecordUpdated}
                    onRecordDeleted={onRecordDeleted}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
