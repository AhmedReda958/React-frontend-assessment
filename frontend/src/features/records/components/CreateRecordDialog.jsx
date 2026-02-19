import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../../../hooks/use-toast";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { createRecord } from "../api/recordsApi";
import {
  createRecordDefaultValues,
  createRecordSchema,
  STATUS_OPTIONS,
} from "../schemas/createRecordSchema";

function mapValuesToPayload(values) {
  return {
    ...values,
    patientId: values.patientId.trim().toUpperCase(),
    patientName: values.patientName.trim(),
    diagnosis: values.diagnosis.trim(),
    department: values.department.trim(),
    dischargeDate: values.dischargeDate ? values.dischargeDate : null,
  };
}

export function CreateRecordDialog({ onRecordCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(createRecordSchema),
    defaultValues: createRecordDefaultValues,
  });

  async function handleSubmit(values) {
    try {
      await createRecord(mapValuesToPayload(values));
      toast({
        title: "Record created",
        description: "Clinical record has been added successfully.",
      });
      onRecordCreated();
      form.reset(createRecordDefaultValues);
      setIsOpen(false);
    } catch (error) {
      if (error.status === 409) {
        form.setError("patientId", {
          type: "server",
          message: "Patient ID already exists. Please use a unique value.",
        });
      }

      if (error.status === 400) {
        form.setError("root", {
          type: "server",
          message: error.message || "Please review the form values and try again.",
        });
      }

      toast({
        title: "Unable to create record",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  }

  function handleOpenChange(nextOpen) {
    setIsOpen(nextOpen);

    if (!nextOpen) {
      form.reset(createRecordDefaultValues);
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 size-4" />
          Add Record
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Clinical Record</DialogTitle>
          <DialogDescription>
            Fill in the patient details below. Discharge date is optional.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient ID</FormLabel>
                  <FormControl>
                    <Input placeholder="P007" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Alice Johnson" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnosis</FormLabel>
                  <FormControl>
                    <Input placeholder="Fever" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="admissionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admission Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dischargeDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discharge Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="General Medicine" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="col-span-full">
              {form.formState.errors.root?.message ? (
                <p className="mb-2 text-sm text-destructive sm:mb-0 sm:mr-auto">
                  {form.formState.errors.root.message}
                </p>
              ) : null}
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                {isSubmitting ? "Creating..." : "Create Record"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
