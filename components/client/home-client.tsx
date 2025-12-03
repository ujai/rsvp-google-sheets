"use client";

import { useState } from "react";
import { HeroSection } from "@/components/client/hero-section";
import { RSVPSection } from "@/components/client/rsvp-section";
import { RSVPUnavailableMessage } from "@/components/server/rsvp-unavailable-message";

/**
 * Home Client Component
 * Manages the main page layout and content
 */
interface HomeClientProps {
  deadlinePassed: boolean;
  isAPIHealthy: boolean;
  children: React.ReactNode;
}

export function HomeClient({ deadlinePassed, isAPIHealthy, children }: HomeClientProps) {
  const [showingConfirmation, setShowingConfirmation] = useState(false);

  const handleConfirmationChange = (showing: boolean) => {
    setShowingConfirmation(showing);
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection hideCountdown={showingConfirmation} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Event Details */}
          {children}

          {/* RSVP Form Section - Conditional rendering based on API health */}
          {isAPIHealthy ? (
            <RSVPSection
              deadlinePassed={deadlinePassed}
              onConfirmationChange={handleConfirmationChange}
            />
          ) : (
            <RSVPUnavailableMessage />
          )}
        </div>
      </main>
    </>
  );
}
