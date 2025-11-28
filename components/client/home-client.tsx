"use client";

import { useState } from "react";
import { HeroSection } from "@/components/server/hero-section";
import { RSVPSection } from "@/components/client/rsvp-section";
import { RSVPUnavailableMessage } from "@/components/server/rsvp-unavailable-message";
import { DeadlineCountdown } from "@/components/client/deadline-countdown";

/**
 * Home Client Component
 * Manages the confirmation state and conditionally hides hero text
 */
interface HomeClientProps {
  deadlinePassed: boolean;
  isAPIHealthy: boolean;
  children: React.ReactNode;
}

export function HomeClient({ deadlinePassed, isAPIHealthy, children }: HomeClientProps) {
  const [showingConfirmation, setShowingConfirmation] = useState(false);

  return (
    <>
      {/* Hero Section - Hide text when showing confirmation */}
      <HeroSection hideText={showingConfirmation} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Event Details */}
          {children}

          {/* Deadline Countdown - Hide when showing confirmation or deadline passed */}
          {!showingConfirmation && !deadlinePassed && <DeadlineCountdown />}

          {/* RSVP Form Section - Conditional rendering based on API health */}
          {isAPIHealthy ? (
            <RSVPSection
              deadlinePassed={deadlinePassed}
              onConfirmationChange={setShowingConfirmation}
            />
          ) : (
            <RSVPUnavailableMessage />
          )}
        </div>
      </main>
    </>
  );
}
