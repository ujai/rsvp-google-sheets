#!/usr/bin/env tsx

/**
 * Google Sheets Credentials Validation Script
 *
 * This script performs comprehensive validation of Google Sheets API credentials
 * and diagnoses configuration issues to help developers troubleshoot setup problems.
 *
 * Usage:
 *   npm run validate-sheets
 *
 * The script performs 6 validation steps:
 *   1. Check environment variables are loaded
 *   2. Initialize Google Sheets API client
 *   3. Test authentication with Google
 *   4. Check if RSVPs sheet exists
 *   5. Test read access permissions
 *   6. Test write access permissions
 *
 * Exit codes:
 *   0 - All validation checks passed
 *   1 - One or more validation checks failed
 *
 * Features:
 *   - Clear console output with success/failure indicators
 *   - Specific error messages for each failure type
 *   - Resolution hints for common issues
 *   - Appends test row to sheet (can be deleted manually)
 *
 * Security:
 *   - Does not expose full credentials in output
 *   - Logs only necessary diagnostic information
 *   - Truncates sensitive values in console output
 */

import { google } from "googleapis";
import { env } from "../lib/env";

/**
 * Main validation function
 * Runs all 6 validation steps sequentially
 */
async function validateCredentials() {
  console.log("\n" + "=".repeat(70));
  console.log("Google Sheets Credentials Validation");
  console.log("=".repeat(70) + "\n");

  let exitCode = 0;

  // Step 1: Check environment variables are loaded
  console.log("Step 1: Checking environment variables...");
  try {
    // Attempt to access validated environment variables
    const sheetIdPreview = env.GOOGLE_SHEET_ID.substring(0, 10) + "...";
    const emailPreview = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const keyLength = env.GOOGLE_PRIVATE_KEY.length;

    console.log(`  ✅ GOOGLE_SHEET_ID: ${sheetIdPreview}`);
    console.log(`  ✅ GOOGLE_SERVICE_ACCOUNT_EMAIL: ${emailPreview}`);
    console.log(`  ✅ GOOGLE_PRIVATE_KEY: [${keyLength} characters]`);
  } catch (error) {
    console.error("  ❌ Environment validation failed");
    console.error("     Resolution: Check .env.local exists and contains all required variables");
    console.error("     See: docs/google-sheets-setup.md");
    exitCode = 1;
    process.exit(exitCode);
  }

  // Step 2: Initialize Google Sheets API client
  console.log("\nStep 2: Initializing Google Sheets API client...");
  let sheets;
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    sheets = google.sheets({
      version: "v4",
      auth,
      timeout: 10000, // 10-second timeout
    });

    console.log("  ✅ API client initialized successfully");
  } catch (error: any) {
    console.error("  ❌ Failed to initialize API client");
    console.error(`     Error: ${error.message}`);
    console.error("     Resolution: Check credentials format in .env.local");
    exitCode = 1;
    process.exit(exitCode);
  }

  // Step 3: Test authentication
  console.log("\nStep 3: Testing authentication...");
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      fields: "spreadsheetId,properties.title",
    });

    console.log("  ✅ Authentication successful");
    console.log(`  📄 Spreadsheet: "${response.data.properties?.title}"`);
    console.log(`  🆔 Sheet ID: ${response.data.spreadsheetId}`);
  } catch (error: any) {
    console.error("  ❌ Authentication failed");

    if (error.code === 404) {
      console.error("     Reason: Sheet not found");
      console.error("     Resolution: Verify GOOGLE_SHEET_ID is correct");
      console.error("     Check the URL: https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit");
    } else if (error.code === 403) {
      console.error("     Reason: Permission denied");
      console.error("     Resolution: Share sheet with service account:");
      console.error(`     ${env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
      console.error("     Give 'Editor' permission in Google Sheets Share settings");
    } else if (error.code === 401) {
      console.error("     Reason: Invalid credentials");
      console.error("     Resolution: Check service account credentials are correct");
      console.error("     Verify GOOGLE_PRIVATE_KEY contains BEGIN/END markers");
    } else if (error.code === "ETIMEDOUT" || error.message?.includes("timeout")) {
      console.error("     Reason: Request timed out");
      console.error("     Resolution: Check internet connection and try again");
    } else {
      console.error(`     Error: ${error.message}`);
      console.error("     Resolution: See docs/troubleshooting.md for more help");
    }

    exitCode = 1;
    process.exit(exitCode);
  }

  // Step 4: Check RSVPs sheet exists
  console.log("\nStep 4: Checking for RSVPs sheet...");
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      fields: "sheets.properties",
    });

    const rsvsSheet = response.data.sheets?.find(
      (sheet) => sheet.properties?.title === "RSVPs"
    );

    if (rsvsSheet) {
      console.log('  ✅ "RSVPs" sheet found');
    } else {
      console.log('  ⚠️  "RSVPs" sheet not found');
      console.log("     Action required: Initialize the sheet");
      console.log("     Run: npm run init-sheet");
      exitCode = 1;
    }
  } catch (error: any) {
    console.error("  ❌ Failed to check sheets");
    console.error(`     Error: ${error.message}`);
    exitCode = 1;
  }

  // If RSVPs sheet check failed, stop here
  if (exitCode !== 0) {
    console.log("\n" + "=".repeat(70));
    console.log("❌ Validation incomplete - please address the issues above");
    console.log("=".repeat(70) + "\n");
    process.exit(exitCode);
  }

  // Step 5: Test read access
  console.log("\nStep 5: Testing read access...");
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      range: "RSVPs!A1:E1",
    });

    const headers = response.data.values?.[0];

    if (headers && headers.length === 5) {
      console.log("  ✅ Read access confirmed");
      console.log(`  📊 Headers: ${headers.join(", ")}`);
    } else {
      console.log("  ⚠️  Headers not properly set");
      console.log("     Expected: Timestamp, Nama, Status Kehadiran, Bilangan Orang, Edit Link");
      console.log("     Action required: Run: npm run init-sheet");
      exitCode = 1;
    }
  } catch (error: any) {
    console.error("  ❌ Read access failed");
    console.error(`     Error: ${error.message}`);
    console.error("     Resolution: Verify service account has 'Editor' permission");
    exitCode = 1;
  }

  // If read access check failed, stop here
  if (exitCode !== 0) {
    console.log("\n" + "=".repeat(70));
    console.log("❌ Validation incomplete - please address the issues above");
    console.log("=".repeat(70) + "\n");
    process.exit(exitCode);
  }

  // Step 6: Test write access
  console.log("\nStep 6: Testing write access...");
  try {
    const testTimestamp = new Date().toISOString();
    const testRow = [
      testTimestamp,
      "[TEST] Validation Script",
      "Tidak Hadir",
      "",
      "[TEST]",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      range: "RSVPs!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [testRow],
      },
    });

    console.log("  ✅ Write access confirmed");
    console.log("  ℹ️  Test row appended to sheet (can be manually deleted)");
    console.log(`  🕐 Timestamp: ${testTimestamp}`);
  } catch (error: any) {
    console.error("  ❌ Write access failed");

    if (error.code === 403) {
      console.error("     Reason: Permission denied");
      console.error("     Resolution: Verify service account has 'Editor' permission");
      console.error("     (Not 'Viewer' or 'Commenter')");
    } else {
      console.error(`     Error: ${error.message}`);
    }

    exitCode = 1;
  }

  // Final summary
  console.log("\n" + "=".repeat(70));
  if (exitCode === 0) {
    console.log("✅ All validation checks passed!");
    console.log("=".repeat(70));
    console.log("\nYour Google Sheets setup is working correctly.");
    console.log("You can now run: npm run dev\n");
  } else {
    console.log("❌ Validation failed - please address the issues above");
    console.log("=".repeat(70));
    console.log("\nFor troubleshooting help, see:");
    console.log("  - docs/google-sheets-setup.md");
    console.log("  - docs/troubleshooting.md\n");
  }

  process.exit(exitCode);
}

// Run validation with error handling
validateCredentials().catch((error) => {
  console.error("\n❌ Unexpected validation error:", error.message);
  console.error("\nFor troubleshooting help, see: docs/troubleshooting.md\n");
  process.exit(1);
});
