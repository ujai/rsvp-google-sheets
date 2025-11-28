"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rsvpSchema, type RSVPFormData } from "@/lib/validations";
import { submitRSVP } from "@/app/actions/rsvp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

interface RSVPFormProps {
  onSuccess: (editLink: string) => void;
}

export function RSVPForm({ onSuccess }: RSVPFormProps) {
  const [isPending, startTransition] = useTransition();
  const [attendanceStatus, setAttendanceStatus] = useState<"hadir" | "tidak_hadir" | null>(null);

  const form = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      nama: "",
      statusKehadiran: undefined,
      bilanganOrang: undefined,
    },
  });

  const onSubmit = (data: RSVPFormData) => {
    startTransition(async () => {
      const result = await submitRSVP(data);

      if (result.success && result.data) {
        toast.success(result.message);
        onSuccess(result.data.editLink);
        form.reset();
        setAttendanceStatus(null);
      } else {
        toast.error(result.message || "Ralat tidak dijangka berlaku.");

        // Set field errors if available
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            if (message) {
              form.setError(field as keyof RSVPFormData, {
                type: "manual",
                message,
              });
            }
          });
        }
      }
    });
  };

  const handleStatusChange = (status: "hadir" | "tidak_hadir") => {
    // Mutually exclusive checkbox behavior
    if (attendanceStatus === status) {
      // Uncheck if clicking the same checkbox
      setAttendanceStatus(null);
      form.setValue("statusKehadiran", "" as "hadir" | "tidak_hadir");
      form.setValue("bilanganOrang", undefined);
    } else {
      // Check the new status and uncheck the other
      setAttendanceStatus(status);
      form.setValue("statusKehadiran", status);

      // Clear bilanganOrang if "tidak_hadir" is selected
      if (status === "tidak_hadir") {
        form.setValue("bilanganOrang", undefined);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium text-baby-blue-dark">
                Nama Penuh *
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Masukkan nama penuh anda"
                  disabled={isPending}
                  className="border-baby-blue-light focus:border-baby-blue focus:ring-baby-blue"
                />
              </FormControl>
              <FormMessage className="text-error" />
            </FormItem>
          )}
        />

        {/* Attendance Status Checkboxes */}
        <FormField
          control={form.control}
          name="statusKehadiran"
          render={({ field: _field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium text-baby-blue-dark">
                Status Kehadiran *
              </FormLabel>
              <div className="space-y-3 mt-2">
                {/* Hadir Checkbox */}
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="hadir"
                    checked={attendanceStatus === "hadir"}
                    onCheckedChange={() => handleStatusChange("hadir")}
                    disabled={isPending}
                    className="border-baby-blue data-[state=checked]:bg-baby-blue data-[state=checked]:border-baby-blue"
                  />
                  <label
                    htmlFor="hadir"
                    className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Hadir
                  </label>
                </div>

                {/* Tidak Hadir Checkbox */}
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="tidak_hadir"
                    checked={attendanceStatus === "tidak_hadir"}
                    onCheckedChange={() => handleStatusChange("tidak_hadir")}
                    disabled={isPending}
                    className="border-baby-blue data-[state=checked]:bg-baby-blue data-[state=checked]:border-baby-blue"
                  />
                  <label
                    htmlFor="tidak_hadir"
                    className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Tidak Hadir
                  </label>
                </div>
              </div>
              <FormMessage className="text-error" />
            </FormItem>
          )}
        />

        {/* Conditional Number of People Field */}
        {attendanceStatus === "hadir" && (
          <FormField
            control={form.control}
            name="bilanganOrang"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium text-baby-blue-dark">
                  Bilangan Orang (termasuk anda) *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    placeholder="Contoh: 4"
                    disabled={isPending}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : parseInt(value, 10));
                    }}
                    className="border-baby-blue-light focus:border-baby-blue focus:ring-baby-blue"
                  />
                </FormControl>
                <p className="text-xs text-baby-blue-dark mt-1">
                  Sila nyatakan jumlah keseluruhan orang yang akan hadir (termasuk diri anda)
                </p>
                <FormMessage className="text-error" />
              </FormItem>
            )}
          />
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-baby-blue hover:bg-baby-blue-dark text-white font-medium py-6 rounded-lg transition-colors"
        >
          {isPending ? "Menghantar..." : "Hantar RSVP"}
        </Button>

        {/* Required Fields Note */}
        <p className="text-xs text-baby-blue-dark text-center">
          * Wajib Diisi
        </p>
      </form>
    </Form>
  );
}
