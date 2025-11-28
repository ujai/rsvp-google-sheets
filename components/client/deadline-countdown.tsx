"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface DeadlineCountdownProps {
  hideWhenSubmitted?: boolean;
}

export function DeadlineCountdown({ hideWhenSubmitted = false }: DeadlineCountdownProps = {}) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    // Calculate days until deadline
    const calculateDaysLeft = () => {
      const deadline = new Date(process.env.NEXT_PUBLIC_RSVP_DEADLINE || '2026-01-10T23:59:59+08:00');
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    };

    // Set initial value
    setDaysLeft(calculateDaysLeft());

    // Update countdown every hour
    const interval = setInterval(() => {
      setDaysLeft(calculateDaysLeft());
    }, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(interval);
  }, []);

  if (daysLeft === null || daysLeft <= 0 || hideWhenSubmitted) {
    return null; // Don't show countdown if deadline has passed, loading, or hidden when submitted
  }

  return (
    <Card className="border-warning/30 bg-warning/5 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-center space-x-3">
          <Clock className="w-5 h-5 text-warning" />
          <p className="text-sm md:text-base text-baby-blue-dark">
            <span className="font-semibold">Tarikh tutup RSVP:</span>{" "}
            {daysLeft === 1 ? (
              <span className="text-warning font-bold">Esok!</span>
            ) : daysLeft <= 3 ? (
              <span className="text-warning font-bold">{daysLeft} hari lagi</span>
            ) : (
              <span className="font-semibold">{daysLeft} hari lagi</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
