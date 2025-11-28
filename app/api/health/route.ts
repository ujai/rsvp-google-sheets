import { checkGoogleSheetsHealth } from "@/lib/google-sheets-health";
import { NextResponse } from "next/server";

/**
 * Health Check API Endpoint
 *
 * Returns the overall health status of the application
 */
export async function GET() {
  try {
    const isHealthy = await checkGoogleSheetsHealth();

    return NextResponse.json({
      healthy: isHealthy,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        healthy: false,
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 503 }
    );
  }
}
