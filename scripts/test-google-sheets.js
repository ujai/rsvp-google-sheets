#!/usr/bin/env node
/**
 * Test Google Sheets API connection
 * Run this to diagnose connection issues
 */

require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

async function testConnection() {
  console.log('Testing Google Sheets API connection...\n');

  // Check environment variables
  console.log('1. Checking environment variables:');
  const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
  const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

  console.log('   ✓ GOOGLE_SHEET_ID:', GOOGLE_SHEET_ID ? 'Present' : '❌ MISSING');
  console.log('   ✓ GOOGLE_SERVICE_ACCOUNT_EMAIL:', GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Present' : '❌ MISSING');
  console.log('   ✓ GOOGLE_PRIVATE_KEY:', GOOGLE_PRIVATE_KEY ? 'Present' : '❌ MISSING');

  if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    console.error('\n❌ Missing required environment variables!');
    process.exit(1);
  }

  // Test API connection
  console.log('\n2. Testing API connection...');
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth, timeout: 10000 });

    console.log('   Attempting to connect to sheet...');
    const response = await sheets.spreadsheets.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      fields: 'spreadsheetId,properties.title',
    });

    console.log('   ✓ Connection successful!');
    console.log('   ✓ Sheet title:', response.data.properties?.title);
    console.log('   ✓ Sheet ID:', response.data.spreadsheetId);

    // Test read permissions
    console.log('\n3. Testing read permissions...');
    const readResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'RSVPs!A1:E1',
    });

    console.log('   ✓ Read successful!');
    console.log('   ✓ Headers:', readResponse.data.values?.[0] || 'No headers found');

    console.log('\n✅ All tests passed! Google Sheets API is working correctly.');
  } catch (error) {
    console.error('\n❌ API connection failed:');
    console.error('   Error:', error.message);
    if (error.code) console.error('   Code:', error.code);
    if (error.status) console.error('   Status:', error.status);

    console.log('\nPossible solutions:');
    console.log('1. Check that the service account email has access to the sheet');
    console.log('   Share the sheet with:', GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('2. Verify the GOOGLE_PRIVATE_KEY format (should have \\n characters)');
    console.log('3. Ensure the sheet has a tab named "RSVPs"');
    process.exit(1);
  }
}

testConnection();
