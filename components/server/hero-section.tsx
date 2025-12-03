import Image from "next/image";
import { EVENT_DETAILS } from "@/lib/constants";
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
          alt={`${EVENT_DETAILS.title} untuk ${EVENT_DETAILS.babyName}`}
          width={750}
          height={1050}
          priority
          className="w-full h-auto max-w-[750px]"
          sizes="(max-width: 768px) 100vw, 750px"
        />
      </div>

      {/* Islamic Decorative Border */}
      <div className="w-full h-2 bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Countdown Timer */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-baby-blue-dark mb-2">
            Hitung Hari Menuju Majlis
          </h2>
          <p className="text-sm md:text-base text-muted">
            17 Januari 2026 | 10:30 AM
          </p>
        </div>
        <CountdownTimer targetDate="2026-01-17T10:30:00+08:00" />
      </div>

      {/* Text Content Card - Hidden to avoid duplication with image */}
    </section>
  );
}
