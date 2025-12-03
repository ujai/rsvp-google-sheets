"use client";

import Image from "next/image";
import { CountdownTimer } from "@/components/client/countdown-timer";

/**
 * HeroSection - Displays the event hero image and information card
 *
 * Structure:
 * - Full circular teddy bear image with baby blue letterboxing
 * - Gold decorative border
 * - Countdown timer section
 * - Event details in a cream card below (can be hidden)
 */
export function HeroSection() {
  return (
    <section className="relative w-full">
      {/* Hero Image Container */}
      <div className="relative w-full bg-baby-blue-light flex items-center justify-center">
        <Image
          src="/images/RAHMAT_DON_ZULKARNAIN.png"
          alt="Majlis Aqiqah & Kesyukuran untuk Rahmat Don Zulkarnain"
          width={750}
          height={1050}
          priority
          className="w-full h-auto max-w-[750px]"
          sizes="(max-width: 768px) 100vw, 750px"
        />
      </div>

      {/* Islamic Decorative Border */}
      <div className="w-full h-2 bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* RSVP Deadline Countdown */}
      <div className="container mx-auto px-4 py-8">
        <CountdownTimer targetDate={process.env.NEXT_PUBLIC_RSVP_DEADLINE || "2026-01-17T23:59:59+08:00"} />
      </div>

      {/* Text Content Card - Hidden to avoid duplication with image */}
    </section>
  );
}
