import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { formatDate } from "../utils/date";
import { StatusBadge } from "./StatusBadge";

function RecordMetaItem({ label, value }) {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export function RecordsCards({ records }) {
  return (
    <div className="grid gap-3 lg:hidden">
      {records.map((record) => (
        <Card key={record.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-base">{record.patientName}</CardTitle>
              <StatusBadge status={record.status} />
            </div>
            <p className="text-sm text-muted-foreground">{record.patientId}</p>
          </CardHeader>
          <CardContent className="space-y-2">
            <RecordMetaItem label="DOB" value={formatDate(record.dateOfBirth)} />
            <RecordMetaItem label="Diagnosis" value={record.diagnosis} />
            <RecordMetaItem label="Admission" value={formatDate(record.admissionDate)} />
            <RecordMetaItem label="Discharge" value={formatDate(record.dischargeDate)} />
            <RecordMetaItem label="Department" value={record.department} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
