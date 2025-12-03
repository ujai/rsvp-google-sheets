'use client';

import { Calendar } from 'lucide-react';

export function AddToCalendar() {
  const handleClick = () => {
    // Create Google Calendar link
    const event = {
      text: 'Majlis Aqiqah Rahmat Don Zulkarnain',
      dates: '20260117T023000Z/20260117T063000Z', // UTC time
      details: 'Jemputan ke Majlis Aqiqah & Kesyukuran anak lelaki kami, Rahmat Don Zulkarnain',
      location: 'Ruang Acara Nadi Rafanda, No. 1 Jalan Meteor P U16/P, Elmina East, 40160 Shah Alam, Selangor'
    };

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&dates=${event.dates}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`;

    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 bg-baby-blue hover:bg-baby-blue-dark text-white font-medium px-6 py-3 rounded-lg transition-colors"
    >
      <Calendar className="w-5 h-5" />
      Tambah ke Kalendar Google
    </button>
  );
}
