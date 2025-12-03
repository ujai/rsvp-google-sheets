"use client";

import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NumberInput } from "@/components/ui/number-input";
import { Loader2 } from "lucide-react";
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

  // Use useWatch hook for better performance and reactivity
  const watchedStatus = useWatch({
    control: form.control,
    name: "statusKehadiran",
  });

  // Debug log to see what value we're getting
  console.log("[RSVPForm] Watched status value:", watchedStatus);

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
                <RadioGroup
                  value={field.value}
                  onValueChange={(value) => {
                    console.log("[RSVPForm] Radio changed to:", value);
                    field.onChange(value);
                    if (value === "tidak_hadir") {
                      form.setValue("bilanganOrang", undefined);
                    }
                  }}
                  disabled={isPending}
                  className="space-y-3 mt-2"
                >
                  <div className="flex items-center space-x-3 p-4 min-h-[44px] border border-baby-blue-light rounded-lg hover:bg-baby-blue/5 transition-colors cursor-pointer">
                    <RadioGroupItem value="hadir" id="hadir" />
                    <label
                      htmlFor="hadir"
                      className="text-sm font-medium cursor-pointer flex-1"
                    >
                      Hadir
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 min-h-[44px] border border-baby-blue-light rounded-lg hover:bg-baby-blue/5 transition-colors cursor-pointer">
                    <RadioGroupItem value="tidak_hadir" id="tidak_hadir" />
                    <label
                      htmlFor="tidak_hadir"
                      className="text-sm font-medium cursor-pointer flex-1"
                    >
                      Tidak Hadir
                    </label>
                  </div>
                </RadioGroup>
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
                  <NumberInput
                    value={field.value}
                    onChange={field.onChange}
                    min={1}
                    max={20}
                    disabled={isPending}
                    className="justify-center"
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
          className="w-full bg-baby-blue hover:bg-baby-blue-dark text-white font-medium py-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menghantar...
            </>
          ) : (
            "Hantar RSVP"
          )}
        </Button>

        {/* Required Fields Note */}
        <p className="text-xs text-baby-blue-dark text-center">
          * Wajib Diisi
        </p>
      </form>
    </Form>
  );
}
