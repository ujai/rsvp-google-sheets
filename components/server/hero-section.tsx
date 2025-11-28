import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { EVENT_DETAILS } from "@/lib/constants";

/**
 * HeroSection - Displays the event hero image and information card
 *
 * Structure:
 * - Full circular teddy bear image with baby blue letterboxing
 * - Gold decorative border
 * - Event details in a cream card below (can be hidden)
 *
 * @param hideText - Whether to hide the title and baby name text
 */
interface HeroSectionProps {
  hideText?: boolean;
}

export function HeroSection({ hideText = false }: HeroSectionProps) {
  return (
    <section className="relative w-full">
      {/* Hero Image Container */}
      <div className="relative w-full bg-baby-blue-light flex items-center justify-center">
        <Image
          src="/images/2ada8ca4-7cb1-461c-acfd-af5b3808018d (1).jpeg"
          alt={`${EVENT_DETAILS.title} untuk ${EVENT_DETAILS.babyName}`}
          width={860}
          height={886}
          priority
          className="w-full h-auto max-w-[860px]"
          sizes="(max-width: 768px) 100vw, 860px"
        />
      </div>

      {/* Islamic Decorative Border */}
      <div className="w-full h-2 bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Spacing */}
      <div className="mb-8" />

      {/* Text Content Card - Hidden to avoid duplication with image */}
    </section>
  );
}
