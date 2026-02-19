export function mapFormValuesToRecordPayload(values) {
  return {
    ...values,
    patientId: values.patientId.trim().toUpperCase(),
    patientName: values.patientName.trim(),
    diagnosis: values.diagnosis.trim(),
    department: values.department.trim(),
    dischargeDate: values.dischargeDate ? values.dischargeDate : null,
  };
}

export function mapRecordToFormValues(record) {
  return {
    patientId: record.patientId || "",
    patientName: record.patientName || "",
    dateOfBirth: record.dateOfBirth || "",
    diagnosis: record.diagnosis || "",
    admissionDate: record.admissionDate || "",
    dischargeDate: record.dischargeDate || "",
    status: record.status || "Active",
    department: record.department || "",
  };
}
