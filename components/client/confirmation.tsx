"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ConfirmationProps {
  editLink: string;
  onNewRSVP: () => void;
}

export function Confirmation({ editLink, onNewRSVP }: ConfirmationProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(editLink);
      setCopied(true);
      toast.success("Pautan edit telah disalin!");

      // Reset copied state after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast.error("Gagal menyalin pautan. Sila cuba lagi.");
    }
  };

  return (
    <Card className="border-baby-blue-light shadow-lg">
      <CardContent className="p-6 space-y-6">
        {/* Success Message */}
        <div className="text-center space-y-4 pb-4 border-b border-baby-blue-light/30">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-success" />
          </div>
          <h2 className="text-2xl font-semibold text-baby-blue-dark">
            Terima Kasih!
          </h2>
          <p className="text-baby-blue-dark">
            RSVP anda telah berjaya dihantar.
          </p>
        </div>
        {/* Edit Link Section */}
        <div className="bg-baby-blue/10 rounded-lg p-6 space-y-3">
          <h3 className="font-semibold text-baby-blue-dark text-lg">
            Pautan Edit RSVP
          </h3>
          <p className="text-sm text-baby-blue-dark">
            Simpan pautan ini untuk mengemaskini RSVP anda kemudian hari:
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 bg-white border border-baby-blue-light rounded-lg p-3 overflow-hidden">
              <p className="text-xs text-baby-blue-dark break-all font-mono">
                {editLink}
              </p>
            </div>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="border-baby-blue text-baby-blue hover:bg-baby-blue hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Disalin
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Salin
                </>
              )}
            </Button>
          </div>
        </div>

        {/* New RSVP Button */}
        <div className="text-center pt-4">
          <Button
            onClick={onNewRSVP}
            variant="outline"
            className="border-baby-blue text-baby-blue hover:bg-baby-blue hover:text-white transition-colors"
          >
            Hantar RSVP Baru
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
