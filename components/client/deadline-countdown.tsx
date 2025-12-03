"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface DeadlineCountdownProps {
  hideWhenSubmitted?: boolean;
}

export function DeadlineCountdown({ hideWhenSubmitted = false }: DeadlineCountdownProps = {}) {
  const [isDeadlinePassed, setIsDeadlinePassed] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    // Check if deadline has passed
    const checkDeadline = () => {
      const deadline = new Date(process.env.NEXT_PUBLIC_RSVP_DEADLINE || '2026-01-10T23:59:59+08:00');
      const now = new Date();
      return now > deadline;
    };

    setIsDeadlinePassed(checkDeadline());

    // Update check every hour
    const interval = setInterval(() => {
      setIsDeadlinePassed(checkDeadline());
    }, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(interval);
  }, []);

  if (!mounted || isDeadlinePassed || hideWhenSubmitted) {
    return null; // Don't show if deadline has passed, loading, or hidden when submitted
  }

  return (
    <Card className="border-warning/30 bg-warning/5 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-center space-x-3">
          <Clock className="w-5 h-5 text-warning" />
          <p className="text-sm md:text-base text-baby-blue-dark">
            <span className="font-semibold">Tarikh tutup RSVP:</span>{" "}
            <span className="font-bold text-warning">10 Januari 2026</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
