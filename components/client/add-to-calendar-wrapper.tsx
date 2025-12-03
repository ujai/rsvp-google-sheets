'use client';

import dynamic from 'next/dynamic';

const AddToCalendar = dynamic(
  () => import('@/components/client/add-to-calendar').then((mod) => ({ default: mod.AddToCalendar })),
  { ssr: false }
);

export function AddToCalendarWrapper() {
  return <AddToCalendar />;
}
