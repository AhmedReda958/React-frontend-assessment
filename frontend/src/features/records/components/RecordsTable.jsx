import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { formatDate } from "../utils/date";
import { StatusBadge } from "./StatusBadge";

export function RecordsTable({ records }) {
  return (
    <div className="hidden rounded-lg border bg-card lg:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Admission Date</TableHead>
            <TableHead>Discharge Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Department</TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
