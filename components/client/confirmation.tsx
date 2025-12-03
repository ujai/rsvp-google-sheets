"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { fadeInUp, scaleIn } from "@/lib/animations";
import { CountdownTimer } from "@/components/client/countdown-timer";
import { AddToCalendar } from "@/components/client/add-to-calendar";

interface ConfirmationProps {
  editLink: string;
  onNewRSVP: () => void;
}

export function Confirmation({ editLink, onNewRSVP }: ConfirmationProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Skip confetti for reduced motion users
      return;
    }

    // Confetti animation
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#a4c8e1', '#d4af37', '#c8dcea'];

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Start confetti after a short delay to allow mount animation
    const timeout = setTimeout(() => {
      frame();
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

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
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="w-full"
    >
      <Card className="border-baby-blue-light shadow-xl">
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Animated Success Icon */}
          <motion.div
            variants={scaleIn}
            initial="initial"
            animate="animate"
            className="text-center space-y-4 pb-4 border-b border-baby-blue-light/30"
          >
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 md:w-20 md:h-20 text-success" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-baby-blue-dark">
              Terima Kasih!
            </h2>
            <p className="text-base md:text-lg text-baby-blue-dark">
              RSVP anda telah berjaya dihantar.
            </p>
          </motion.div>

          {/* Event Countdown Section */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-semibold text-baby-blue-dark mb-2">
                Menanti Hari Majlis
              </h3>
              <p className="text-sm md:text-base text-muted mb-4">
                17 Januari 2026 | 10:30 AM
              </p>
            </div>
            <CountdownTimer targetDate="2026-01-17T10:30:00+08:00" />

            {/* Add to Calendar Button */}
            <div className="flex justify-center pt-4">
              <AddToCalendar />
            </div>
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
    </motion.div>
  );
}
