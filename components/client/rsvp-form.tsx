"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rsvpSchema, type RSVPFormData } from "@/lib/validations";
import { submitRSVP } from "@/app/actions/rsvp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const form = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      nama: "",
      statusKehadiran: undefined,
      bilanganOrang: undefined,
    },
  });

  const watchedStatus = form.watch("statusKehadiran");

  const onSubmit = (data: RSVPFormData) => {
    startTransition(async () => {
      try {
        console.log("[RSVPForm] Submitting RSVP:", data);
        const result = await submitRSVP(data);
        console.log("[RSVPForm] Server response:", result);

        if (result.success && result.data) {
          toast.success(result.message);
          onSuccess(result.data.editLink);
          form.reset();
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
      } catch (error) {
        console.error("[RSVPForm] Submission error:", error);
        toast.error("Ralat tidak dijangka berlaku. Sila cuba lagi.");
      }
    });
  };

  const handleStatusChange = (status: "hadir" | "tidak_hadir", onChange: (value: any) => void) => {
    console.log("[RSVPForm] Status changed to:", status);
    // Call field.onChange to properly update react-hook-form state
    onChange(status);
    // Clear bilanganOrang if "tidak_hadir" is selected
    if (status === "tidak_hadir") {
      form.setValue("bilanganOrang", undefined);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("[RSVPForm] Form submit event triggered");
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-6">
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

        {/* Attendance Status Radio Buttons */}
        <FormField
          control={form.control}
          name="statusKehadiran"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium text-baby-blue-dark">
                Status Kehadiran *
              </FormLabel>
              <FormControl>
                <div className="space-y-3 mt-2">
                  {/* Hadir Radio */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="hadir"
                      value="hadir"
                      checked={field.value === "hadir"}
                      onChange={() => handleStatusChange("hadir", field.onChange)}
                      onBlur={field.onBlur}
                      disabled={isPending}
                      className="h-4 w-4 border-baby-blue text-baby-blue focus:ring-baby-blue focus:ring-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <label
                      htmlFor="hadir"
                      className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Hadir
                    </label>
                  </div>

                  {/* Tidak Hadir Radio */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="tidak_hadir"
                      value="tidak_hadir"
                      checked={field.value === "tidak_hadir"}
                      onChange={() => handleStatusChange("tidak_hadir", field.onChange)}
                      onBlur={field.onBlur}
                      disabled={isPending}
                      className="h-4 w-4 border-baby-blue text-baby-blue focus:ring-baby-blue focus:ring-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <label
                      htmlFor="tidak_hadir"
                      className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Tidak Hadir
                    </label>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-error" />
            </FormItem>
          )}
        />

        {/* Conditional Number of People Field */}
        {watchedStatus === "hadir" && (
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
