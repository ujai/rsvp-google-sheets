import { Card, CardContent } from "@/components/ui/card";
import { EVENT_DETAILS } from "@/lib/constants";
import { env } from "@/lib/env";
import { Calendar, Clock, MapPin } from "lucide-react";

export function EventDetails() {
  return (
    <section className="py-12 px-4 bg-cream">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-baby-blue-dark text-center mb-8">
          Butiran Majlis
        </h2>
        <Card className="rounded-2xl shadow-xl border border-baby-blue-light">
          <CardContent className="p-6 md:p-8 space-y-8">
            {/* Event Details Section */}
            <div className="space-y-6">
              {/* Date */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-baby-blue/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-baby-blue-dark" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-baby-blue-dark uppercase mb-1">
                    Tarikh
                  </h3>
                  <p className="text-lg text-baby-blue-dark">{EVENT_DETAILS.date}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-baby-blue/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-baby-blue-dark" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-baby-blue-dark uppercase mb-1">
                    Masa
                  </h3>
                  <p className="text-lg text-baby-blue-dark">{EVENT_DETAILS.time}</p>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-baby-blue/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-baby-blue-dark" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-baby-blue-dark uppercase mb-1">
                    Tempat
                  </h3>
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
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-baby-blue-dark mb-3">
                  Lokasi di Peta
                </h3>
                <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border-2 border-baby-blue-light shadow-md">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=place_id:ChIJR73efQBPzDERJUvQSAYq9us&zoom=15`}
                    allowFullScreen
                    loading="lazy"
                    title="Peta menunjukkan lokasi majlis di Ruang Acara Nadi Rafanda"
                  />
                </div>
              </div>
            )}

            {/* Map Links */}
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href={EVENT_DETAILS.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-baby-blue hover:bg-baby-blue-dark text-white text-center py-3 rounded-lg font-medium transition-colors"
                >
                  Google Maps
                </a>
                <a
                  href={`https://waze.com/ul?ll=${EVENT_DETAILS.mapUrl.match(/ll=([^&]+)/)?.[1]}&navigate=yes`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-baby-blue hover:bg-baby-blue-dark text-white text-center py-3 rounded-lg font-medium transition-colors"
                >
                  Waze
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
