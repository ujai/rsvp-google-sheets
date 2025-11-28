import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

/**
 * RSVP Unavailable Message Component
 *
 * Displayed when Google Sheets API is unavailable or experiencing issues.
 * This component ensures graceful degradation - users can still see event details
 * even when the RSVP system is temporarily down.
 *
 * Features:
 * - User-friendly message in Malay
 * - Clear visual indication of unavailability
 * - Suggests alternative method (contact organizer)
 * - Matches application design language
 *
 * Usage:
 * ```tsx
 * const isHealthy = await checkGoogleSheetsHealth();
 * if (!isHealthy) {
 *   return <RSVPUnavailableMessage />;
 * }
 * ```
 */
export function RSVPUnavailableMessage() {
  return (
    <Card className="border-baby-blue-light shadow-lg">
      <CardHeader className="border-b border-baby-blue-light/30 bg-yellow-50">
        <div className="flex items-center justify-center gap-3">
          <AlertCircle className="h-6 w-6 text-yellow-600" />
          <CardTitle className="text-2xl font-semibold text-baby-blue-dark text-center">
            Sistem RSVP Tidak Tersedia
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
          <p className="text-center text-baby-blue-dark font-medium">
            Sistem RSVP tidak tersedia buat masa ini.
          </p>
          <p className="text-center text-baby-blue-dark text-sm">
            Kami sedang mengalami masalah teknikal dengan sistem pendaftaran kehadiran.
          </p>
        </div>

        <div className="border-t border-baby-blue-light/30 pt-4">
          <p className="text-center text-baby-blue-dark text-sm">
            Untuk mengesahkan kehadiran anda, sila hubungi penganjur secara terus.
          </p>
        </div>

        <div className="text-center text-xs text-baby-blue-dark/70">
          Kami mohon maaf atas kesulitan ini. Sila cuba sebentar lagi.
        </div>
      </CardContent>
    </Card>
  );
}
