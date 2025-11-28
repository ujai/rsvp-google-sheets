/**
 * Script to initialize Google Sheet with headers
 *
 * Usage: npx tsx scripts/init-sheet.ts
 *
 * This script should be run once to set up the Google Sheet
 * with the correct headers before the application goes live.
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { initializeSheet } from "../lib/google-sheets";

async function main() {
  try {
    console.log("Initializing Google Sheet...");
    await initializeSheet();
    console.log("✅ Google Sheet initialized successfully!");
    console.log("\nHeaders added:");
    console.log("- Column A: Timestamp");
    console.log("- Column B: Nama");
    console.log("- Column C: Status Kehadiran");
    console.log("- Column D: Bilangan Orang");
    console.log("- Column E: Edit Link");
  } catch (error) {
    console.error("❌ Error initializing Google Sheet:", error);
    process.exit(1);
  }
}

main();
