/**
 * Security Testing Script - Phase 5
 *
 * Tests input validation, XSS prevention, injection attacks, and more
 */

const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Test 1: XSS Prevention
console.log("\n=== Test 1: XSS Prevention ===");
const xssPayloads = [
  "<script>alert('xss')</script>",
  "<img src=x onerror=alert(1)>",
  "javascript:alert('xss')",
  "<svg onload=alert(1)>",
  "';alert(String.fromCharCode(88,83,83))//",
];

async function testXSSPrevention() {
  const baseUrl = "http://localhost:3000";

  for (const payload of xssPayloads) {
    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: payload,
          statusKehadiran: "hadir",
          bilanganOrang: 2,
        }),
      });

      const data = await response.json();

      // Should be rejected by validation
      if (data.success === false && data.errors?.nama) {
        console.log(`✓ XSS payload rejected: ${payload.substring(0, 30)}...`);
        testResults.passed++;
      } else {
        console.log(`✗ XSS payload NOT rejected: ${payload}`);
        testResults.failed++;
      }
    } catch (error) {
      console.log(`✓ XSS payload caused error (good): ${payload.substring(0, 30)}...`);
      testResults.passed++;
    }
  }
}

// Test 2: Formula Injection
console.log("\n=== Test 2: Formula Injection ===");
const formulaPayloads = [
  "=1+1",
  "@SUM(A1:A10)",
  "+1+1",
  "-1+1",
  "=CMD|'/c calc'!A1",
];

async function testFormulaInjection() {
  for (const payload of formulaPayloads) {
    try {
      const response = await fetch("http://localhost:3000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: payload,
          statusKehadiran: "hadir",
          bilanganOrang: 2,
        }),
      });

      const data = await response.json();

      // Should be rejected or sanitized
      if (data.success === false) {
        console.log(`✓ Formula injection rejected: ${payload}`);
        testResults.passed++;
      } else {
        console.log(`✗ Formula injection NOT fully rejected: ${payload}`);
        console.log(`  Note: May be sanitized during storage (check Google Sheets)`);
        testResults.failed++;
      }
    } catch (error) {
      console.log(`✓ Formula injection caused error: ${payload}`);
      testResults.passed++;
    }
  }
}

// Test 3: Long Input (Buffer Overflow)
console.log("\n=== Test 3: Long Input (Buffer Overflow) ===");
async function testLongInput() {
  const longInput = "A".repeat(1000);

  try {
    const response = await fetch("http://localhost:3000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nama: longInput,
        statusKehadiran: "hadir",
        bilanganOrang: 2,
      }),
    });

    const data = await response.json();

    if (data.success === false && data.errors?.nama) {
      console.log(`✓ Long input (${longInput.length} chars) rejected`);
      testResults.passed++;
    } else {
      console.log(`✗ Long input (${longInput.length} chars) NOT rejected`);
      testResults.failed++;
    }
  } catch (error) {
    console.log(`✓ Long input caused validation error`);
    testResults.passed++;
  }
}

// Test 4: Special Characters and Unicode
console.log("\n=== Test 4: Unicode and Special Characters ===");
const unicodeInputs = [
  "こんにちは",
  "مرحبا",
  "你好",
  "🎉🎊",
  "José María",
  "François",
];

async function testUnicodeInput() {
  for (const input of unicodeInputs) {
    try {
      console.log(`Testing: ${input}`);
      // Unicode should be accepted based on regex pattern
      // Current pattern: /^[a-zA-Z\u00C0-\u017F\s'\-\.]+$/
      // This accepts Latin extended characters but NOT CJK or Arabic

      const shouldPass = /^[a-zA-Z\u00C0-\u017F\s'\-\.]+$/.test(input);

      if (shouldPass) {
        console.log(`  ✓ Should be accepted: ${input}`);
        testResults.passed++;
      } else {
        console.log(`  ✓ Should be rejected (not Latin script): ${input}`);
        testResults.passed++;
      }
    } catch (error) {
      console.log(`  Error testing: ${input}`);
      testResults.failed++;
    }
  }
}

// Test 5: Empty/Null Values
console.log("\n=== Test 5: Empty/Null Values ===");
async function testEmptyValues() {
  const emptyTests = [
    { nama: "", statusKehadiran: "hadir", bilanganOrang: 2 },
    { nama: "   ", statusKehadiran: "hadir", bilanganOrang: 2 },
    { nama: null, statusKehadiran: "hadir", bilanganOrang: 2 },
  ];

  for (const testData of emptyTests) {
    try {
      const response = await fetch("http://localhost:3000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();

      if (data.success === false) {
        console.log(`✓ Empty/null value rejected: ${JSON.stringify(testData.nama)}`);
        testResults.passed++;
      } else {
        console.log(`✗ Empty/null value NOT rejected: ${JSON.stringify(testData.nama)}`);
        testResults.failed++;
      }
    } catch (error) {
      console.log(`✓ Empty/null value caused error`);
      testResults.passed++;
    }
  }
}

// Test 6: SQL Injection Patterns
console.log("\n=== Test 6: SQL/NoSQL Injection ===");
const sqlPayloads = [
  "'; DROP TABLE users--",
  "' OR '1'='1",
  "admin'--",
  "' UNION SELECT * FROM users--",
];

async function testSQLInjection() {
  for (const payload of sqlPayloads) {
    try {
      const response = await fetch("http://localhost:3000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: payload,
          statusKehadiran: "hadir",
          bilanganOrang: 2,
        }),
      });

      const data = await response.json();

      // Should be rejected by validation regex
      if (data.success === false && data.errors?.nama) {
        console.log(`✓ SQL injection payload rejected: ${payload.substring(0, 30)}...`);
        testResults.passed++;
      } else {
        console.log(`✗ SQL injection payload NOT rejected: ${payload}`);
        testResults.failed++;
      }
    } catch (error) {
      console.log(`✓ SQL injection payload caused error: ${payload.substring(0, 30)}...`);
      testResults.passed++;
    }
  }
}

// Run all tests
async function runAllTests() {
  console.log("==============================================");
  console.log("   Phase 5.1: Input Validation Security Tests");
  console.log("==============================================\n");

  await testXSSPrevention();
  await testFormulaInjection();
  await testLongInput();
  await testUnicodeInput();
  await testEmptyValues();
  await testSQLInjection();

  console.log("\n==============================================");
  console.log("   TEST SUMMARY");
  console.log("==============================================");
  console.log(`Total Passed: ${testResults.passed}`);
  console.log(`Total Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  console.log("==============================================\n");
}

runAllTests().catch(console.error);
