import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EVENT_DETAILS } from "@/lib/constants";
import { Calendar, Clock, MapPin } from "lucide-react";

export function EventDetails() {
  return (
    <Card className="border-baby-blue-light shadow-md">
      <CardHeader className="border-b border-baby-blue-light/30 bg-baby-blue/5">
        <CardTitle className="text-2xl font-semibold text-baby-blue-dark text-center">
          Butiran Majlis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
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

        {/* Map Links */}
        <div className="pt-4 border-t border-baby-blue-light/30">
          <div className="flex flex-col sm:flex-row gap-3">
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
  );
}
