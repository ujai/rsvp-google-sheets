import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EVENT_DETAILS } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";

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
            <p className="text-center text-baby-blue-dark">
              Terima kasih! Maklumat RSVP anda telah berjaya dikemaskini.
            </p>

            {/* Event Details */}
            <div className="bg-baby-blue/10 rounded-lg p-6 space-y-3">
              <h3 className="font-semibold text-baby-blue-dark text-lg mb-4">
                Butiran Majlis
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-baby-blue-dark font-medium">Tarikh:</span>
                  <span className="text-baby-blue-dark">{EVENT_DETAILS.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-baby-blue-dark font-medium">Masa:</span>
                  <span className="text-baby-blue-dark">{EVENT_DETAILS.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-baby-blue-dark font-medium">Tempat:</span>
                  <span className="text-baby-blue-dark text-right">{EVENT_DETAILS.venue}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-baby-blue-light/30">
                <p className="text-xs text-baby-blue-dark mb-2">Alamat:</p>
                <p className="text-sm text-baby-blue-dark">{EVENT_DETAILS.address}</p>
              </div>

              {/* Map Links */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
