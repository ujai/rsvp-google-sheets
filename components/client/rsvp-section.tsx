"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { RSVPForm } from "@/components/client/rsvp-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ERROR_MESSAGES } from "@/lib/constants";

// Dynamic import for Confirmation to reduce initial bundle
// Confetti doesn't need SSR, so we disable it
const Confirmation = dynamic(
  () => import("@/components/client/confirmation").then((mod) => ({ default: mod.Confirmation })),
  {
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse space-y-4 w-full max-w-md mx-auto">
          <div className="h-20 bg-baby-blue-light rounded-full w-20 mx-auto"></div>
          <div className="h-8 bg-baby-blue-light rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-baby-blue-light rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    ),
    ssr: false, // Confetti doesn't need SSR
  }
);

/**
 * RSVP Section Component (Client Component)
 *
 * This component handles the interactive RSVP form and confirmation states.
 * It's a client component because it uses useState for form submission flow.
 *
 * Flow:
 * 1. Show RSVP form initially
 * 2. On successful submission, show confirmation with edit link
 * 3. User can submit another RSVP from confirmation screen
 *
 * @param deadlinePassed - Whether the RSVP deadline has passed
 * @param onConfirmationChange - Callback to notify parent when confirmation state changes
 */
interface RSVPSectionProps {
  deadlinePassed: boolean;
  onConfirmationChange?: (showing: boolean) => void;
}

export function RSVPSection({ deadlinePassed, onConfirmationChange }: RSVPSectionProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [editLink, setEditLink] = useState("");

  const handleRSVPSuccess = (link: string) => {
    setEditLink(link);
    setShowConfirmation(true);
    onConfirmationChange?.(true);
    // Scroll to top to show confirmation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewRSVP = () => {
    setShowConfirmation(false);
    setEditLink("");
    onConfirmationChange?.(false);
  };

  // Deadline passed - show deadline message
  if (deadlinePassed) {
    return (
      <Card className="border-baby-blue-light shadow-lg">
        <CardHeader className="border-b border-baby-blue-light/30 bg-baby-blue/5">
          <CardTitle className="text-2xl font-semibold text-baby-blue-dark text-center">
            RSVP Telah Ditutup
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-center text-baby-blue-dark">
            {ERROR_MESSAGES.DEADLINE_PASSED}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show confirmation after successful submission
  if (showConfirmation) {
    return <Confirmation editLink={editLink} onNewRSVP={handleNewRSVP} />;
  }

  // Show RSVP form
  return (
    <Card className="border-baby-blue-light shadow-lg">
      <CardHeader className="border-b border-baby-blue-light/30 bg-baby-blue/5">
        <CardTitle className="text-2xl font-semibold text-baby-blue-dark text-center">
          RSVP
        </CardTitle>
        <p className="text-sm text-baby-blue-dark text-center mt-2">
          Sila sahkan kehadiran anda
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <RSVPForm onSuccess={handleRSVPSuccess} />
      </CardContent>
    </Card>
  );
}
