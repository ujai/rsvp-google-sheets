import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EVENT_DETAILS } from "@/lib/constants";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-baby-blue-dark mb-2">
            {EVENT_DETAILS.title}
          </h1>
          <p className="text-lg text-baby-blue-dark">
            Untuk {EVENT_DETAILS.babyName}
          </p>
        </div>

        {/* Error Card */}
        <Card className="border-error/30 shadow-lg">
          <CardHeader className="border-b border-error/20 bg-error/5">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-error" />
            </div>
            <CardTitle className="text-2xl font-semibold text-baby-blue-dark text-center">
              Pautan Tidak Sah
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-center text-baby-blue-dark">
              Pautan edit yang anda gunakan tidak sah atau telah tamat tempoh.
            </p>
            <p className="text-sm text-center text-baby-blue-dark">
              Sila pastikan anda menggunakan pautan edit yang betul dari emel atau mesej
              pengesahan RSVP anda.
            </p>
            <div className="text-center pt-4">
              <a
                href="/"
                className="inline-block bg-baby-blue hover:bg-baby-blue-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
