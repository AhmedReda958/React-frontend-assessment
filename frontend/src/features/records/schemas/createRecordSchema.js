import { z } from "zod";

const PATIENT_ID_REGEX = /^P\d+$/;

export const STATUS_OPTIONS = ["Active", "Discharged", "Pending", "Cancelled"];

function parseDateValue(value) {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return new Date(timestamp);
}

export const createRecordSchema = z
  .object({
    patientId: z
      .string()
      .trim()
      .min(1, "Patient ID is required.")
      .refine((value) => PATIENT_ID_REGEX.test(value.toUpperCase()), {
        message: "Patient ID must be in format P### (example: P007).",
      }),
    patientName: z.string().trim().min(2, "Patient name must be at least 2 characters."),
    dateOfBirth: z.string().min(1, "Date of birth is required."),
    diagnosis: z.string().trim().min(2, "Diagnosis must be at least 2 characters."),
    admissionDate: z.string().min(1, "Admission date is required."),
    dischargeDate: z.string().optional().or(z.literal("")),
    status: z
      .string()
      .min(1, "Status is required.")
      .refine((value) => STATUS_OPTIONS.includes(value), {
        message: "Please select a valid status.",
      }),
    department: z.string().trim().min(2, "Department must be at least 2 characters."),
  })
  .superRefine((values, ctx) => {
    const dob = parseDateValue(values.dateOfBirth);
    const admission = parseDateValue(values.admissionDate);
    const discharge = parseDateValue(values.dischargeDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!dob) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dateOfBirth"],
        message: "Please enter a valid date of birth.",
      });
    } else if (dob >= today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dateOfBirth"],
        message: "Date of birth must be in the past.",
      });
    }

    if (!admission) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["admissionDate"],
        message: "Please enter a valid admission date.",
      });
    }

    if (values.dischargeDate && !discharge) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dischargeDate"],
        message: "Please enter a valid discharge date.",
      });
    }

    if (admission && discharge && discharge < admission) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dischargeDate"],
        message: "Discharge date must be after or equal to admission date.",
      });
    }
  });

export const createRecordDefaultValues = {
  patientId: "",
  patientName: "",
  dateOfBirth: "",
  diagnosis: "",
  admissionDate: "",
  dischargeDate: "",
  status: "Active",
  department: "",
};
