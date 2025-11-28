import { HomeClient } from "@/components/client/home-client";
import { EventDetails } from "@/components/server/event-details";
import { isDeadlinePassed } from "@/lib/helpers";
import { checkGoogleSheetsHealth } from "@/lib/google-sheets-health";

/**
 * Homepage - Server Component
 *
 * This component handles the main RSVP application page with graceful degradation.
 *
 * Architecture:
 * - Server Component for initial render and API health check
 * - Checks Google Sheets API health before rendering
 * - Always shows event details (hero, event info) regardless of API status
 * - Conditionally renders RSVP form or unavailability message based on API health
 * - Respects RSVP deadline
 *
 * Error Handling:
 * - If API is healthy: Show RSVP form (normal operation)
 * - If API is unhealthy: Show unavailability message (graceful degradation)
 * - If deadline passed: Show deadline message
 * - Event details always visible in all scenarios
 *
 * Performance:
 * - Health check uses lightweight API call (metadata only)
 * - Health check has 5-second timeout
 * - Results cached for 2 minutes to reduce API calls
 */
export default async function Home() {
  // Check if RSVP deadline has passed
  const deadlinePassed = isDeadlinePassed();

  // Check Google Sheets API health
  // This is a lightweight check that won't block rendering for long
  // If it fails, we gracefully degrade by showing unavailability message
  const isAPIHealthy = await checkGoogleSheetsHealth();

  return (
    <div className="min-h-screen bg-cream">
      <HomeClient deadlinePassed={deadlinePassed} isAPIHealthy={isAPIHealthy}>
        {/* Event Details - Always shown regardless of API status */}
        <EventDetails />
      </HomeClient>

      {/* Footer - Always shown */}
      <footer className="bg-baby-blue/10 border-t border-baby-blue-light/30 mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-baby-blue-dark">
            © 2026 - Dzorif Don Zulkarnain Bin Azmi & Dr Nur Hidayah Binti Hamidin
          </p>
        </div>
      </footer>
    </div>
  );
}
