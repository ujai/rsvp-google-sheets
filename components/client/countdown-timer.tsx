'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface CountdownTimerProps {
  targetDate: string; // ISO 8601 format
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = +new Date(targetDate) - +new Date();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-baby-blue-light to-baby-blue/20 rounded-xl shadow-md">
            <div className="text-4xl font-bold text-baby-blue-dark">--</div>
            <div className="text-sm text-baby-blue-dark mt-1">Loading</div>
          </div>
        ))}
      </div>
    );
  }

  const isEventStarted = Object.values(timeLeft).every(val => val === 0);

  if (isEventStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-center py-8 ${className}`}
      >
        <h2 className="text-3xl font-bold text-baby-blue-dark">
          Majlis Telah Bermula!
        </h2>
      </motion.div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'Hari', singular: 'Hari' },
    { value: timeLeft.hours, label: 'Jam', singular: 'Jam' },
    { value: timeLeft.minutes, label: 'Minit', singular: 'Minit' },
    { value: timeLeft.seconds, label: 'Saat', singular: 'Saat' },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto ${className}`}
      role="timer"
      aria-live="polite"
      aria-label="Countdown to event"
    >
      {timeUnits.map((unit) => (
        <motion.div
          key={unit.label}
          variants={fadeInUp}
          className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-baby-blue-light to-baby-blue/20 rounded-xl shadow-md border border-baby-blue-light/50"
        >
          <div className="text-4xl md:text-5xl font-bold text-baby-blue-dark tabular-nums">
            {String(unit.value).padStart(2, '0')}
          </div>
          <div className="text-sm md:text-base text-baby-blue-dark mt-2 font-medium">
            {unit.value === 1 ? unit.singular : unit.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
