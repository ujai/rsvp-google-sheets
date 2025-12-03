import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EVENT_DETAILS } from "@/lib/constants";
import { env } from "@/lib/env";
import { CheckCircle2, Calendar, Clock, MapPin } from "lucide-react";

interface EditSuccessPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function EditSuccessPage({ params: _params }: EditSuccessPageProps) {
  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-baby-blue-dark mb-2">
            {EVENT_DETAILS.title}
          </h1>
          <p className="text-lg text-baby-blue-dark">
            Untuk {EVENT_DETAILS.babyName}
          </p>
        </div>

        {/* Success Card */}
        <Card className="border-baby-blue-light shadow-lg">
          <CardHeader className="border-b border-baby-blue-light/30 bg-baby-blue/5">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-success" />
            </div>
            <CardTitle className="text-2xl font-semibold text-baby-blue-dark text-center">
              RSVP Berjaya Dikemaskini!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <p className="text-center text-baby-blue-dark text-lg">
              Terima kasih! Maklumat RSVP anda telah berjaya dikemaskini.
            </p>

            {/* Event Details Section */}
            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-semibold text-baby-blue-dark text-center mb-6">
                Butiran Majlis
              </h3>

              {/* Date */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-baby-blue/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-baby-blue-dark" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-baby-blue-dark uppercase mb-1">
                    Tarikh
                  </h4>
                  <p className="text-lg text-baby-blue-dark">{EVENT_DETAILS.date}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-baby-blue/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-baby-blue-dark" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-baby-blue-dark uppercase mb-1">
                    Masa
                  </h4>
                  <p className="text-lg text-baby-blue-dark">{EVENT_DETAILS.time}</p>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-baby-blue/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-baby-blue-dark" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-baby-blue-dark uppercase mb-1">
                    Tempat
                  </h4>
                  <p className="text-lg font-semibold text-baby-blue-dark mb-2">
                    {EVENT_DETAILS.venue}
                  </p>
                  <p className="text-sm text-baby-blue-dark leading-relaxed">
                    {EVENT_DETAILS.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            {env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-baby-blue-dark mb-3">
                  Lokasi di Peta
                </h4>
                <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border-2 border-baby-blue-light shadow-md">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(EVENT_DETAILS.venue + ', ' + EVENT_DETAILS.address)}&center=${EVENT_DETAILS.coordinates.lat},${EVENT_DETAILS.coordinates.lng}&zoom=16`}
                    allowFullScreen
                    loading="lazy"
                    title="Peta menunjukkan lokasi majlis di Ruang Acara Nadi Rafanda"
                  />
                </div>
              </div>
            )}

            {/* Map Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={EVENT_DETAILS.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-baby-blue hover:bg-baby-blue-dark text-white text-center py-3 rounded-lg font-medium transition-colors"
              >
                Google Maps
              </a>
              <a
                href={EVENT_DETAILS.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-baby-blue hover:bg-baby-blue-dark text-white text-center py-3 rounded-lg font-medium transition-colors"
              >
                Waze
              </a>
            </div>

            {/* Edit Link Notice */}
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
              <p className="text-sm text-baby-blue-dark">
                <span className="font-semibold">Nota:</span> Jika anda perlu mengemaskini RSVP anda semula,
                sila gunakan pautan edit yang sama yang anda gunakan sebelum ini.
              </p>
            </div>

            {/* Back Link */}
            <div className="text-center pt-4">
              <a
                href="/"
                className="text-baby-blue hover:text-baby-blue-dark underline font-medium"
              >
                Kembali ke halaman utama
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
