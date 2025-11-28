"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editRsvpSchema, type EditRSVPFormData } from "@/lib/validations";
import { updateRSVP } from "@/app/actions/rsvp";
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

interface EditRSVPFormProps {
  token: string;
  initialData: EditRSVPFormData;
  onSuccess: () => void;
}

export function EditRSVPForm({ token, initialData, onSuccess }: EditRSVPFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<EditRSVPFormData>({
    resolver: zodResolver(editRsvpSchema),
    defaultValues: initialData,
  });

  const onSubmit = (data: EditRSVPFormData) => {
    startTransition(async () => {
      const result = await updateRSVP(token, data);

      if (result.success) {
        toast.success(result.message);
        onSuccess();
      } else {
        toast.error(result.message || "Ralat tidak dijangka berlaku.");

        // Set field errors if available
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) => {
            if (message) {
              form.setError(field as keyof EditRSVPFormData, {
                type: "manual",
                message,
              });
            }
          });
        }
      }
    });
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

        {/* Number of People Field */}
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-baby-blue hover:bg-baby-blue-dark text-white font-medium py-6 rounded-lg transition-colors"
        >
          {isPending ? "Mengemaskini..." : "Kemaskini RSVP"}
        </Button>

        {/* Required Fields Note */}
        <p className="text-xs text-baby-blue-dark text-center">
          * Wajib Diisi
        </p>
      </form>
    </Form>
  );
}
