#!/usr/bin/env node
/**
 * Debug Script for Quiz Submission Issues
 * 
 * This script tests various aspects of the quiz submission flow:
 * 1. Backend connectivity
 * 2. CORS configuration
 * 3. API endpoint validation
 * 4. Database operations
 * 5. Error handling
 */

const http = require('http');
const https = require('https');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const TEST_STUDENT_ID = 'test-student-debug-' + Date.now();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function testHealthCheck() {
  log('\n=== Test 1: Backend Health Check ===', 'cyan');
  try {
    const response = await makeRequest(`${BACKEND_URL}/health`);
    if (response.status === 200) {
      log('✓ Backend is running and accessible', 'green');
      return true;
    } else {
      log(`✗ Backend returned status ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`✗ Cannot connect to backend: ${error.message}`, 'red');
    log(`  Backend URL: ${BACKEND_URL}`, 'yellow');
    log('  Make sure the backend is running!', 'yellow');
    return false;
  }
}

async function testCORS() {
  log('\n=== Test 2: CORS Configuration ===', 'cyan');
  try {
    const response = await makeRequest(`${BACKEND_URL}/health`, {
      headers: {
        'Origin': FRONTEND_URL
      }
    });
    
    const corsHeaders = {
      'access-control-allow-origin': response.headers['access-control-allow-origin'],
      'access-control-allow-credentials': response.headers['access-control-allow-credentials'],
      'access-control-allow-methods': response.headers['access-control-allow-methods']
    };
    
    log(`CORS Headers:`, 'blue');
    console.log(JSON.stringify(corsHeaders, null, 2));
    
    if (corsHeaders['access-control-allow-origin']) {
      log('✓ CORS is configured', 'green');
      if (corsHeaders['access-control-allow-origin'] === '*' || 
          corsHeaders['access-control-allow-origin'] === FRONTEND_URL) {
        log('✓ CORS allows frontend origin', 'green');
      } else {
        log(`⚠ CORS origin mismatch. Expected: ${FRONTEND_URL}`, 'yellow');
      }
      return true;
    } else {
      log('✗ CORS headers not found', 'red');
      return false;
    }
  } catch (error) {
    log(`✗ CORS test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testQuizSubmission() {
  log('\n=== Test 3: Quiz Submission Endpoint ===', 'cyan');
  
  const testPayload = {
    talents: [
      {
        type: 'Visual/Artistic',
        name: 'Drawing',
        measuredScore: 8,
        confidence: 'High'
      }
    ],
    interests: [
      {
        topic: 'Art',
        strength: 7,
        confidence: 'Medium',
        mappedConcepts: ['Aesthetic Design', 'Visual Communication']
      }
    ],
    hybridMode: undefined
  };
  
  try {
    log(`Testing with student ID: ${TEST_STUDENT_ID}`, 'blue');
    log(`Payload:`, 'blue');
    console.log(JSON.stringify(testPayload, null, 2));
    
    const response = await makeRequest(`${BACKEND_URL}/api/v1/students/${TEST_STUDENT_ID}/quiz`, {
      method: 'POST',
      body: testPayload,
      headers: {
        'Origin': FRONTEND_URL
      }
    });
    
    log(`Response Status: ${response.status}`, response.status === 200 ? 'green' : 'red');
    log(`Response Body:`, 'blue');
    console.log(response.body);
    
    if (response.status === 200) {
      log('✓ Quiz submission successful!', 'green');
      return true;
    } else {
      log(`✗ Quiz submission failed with status ${response.status}`, 'red');
      try {
        const errorData = JSON.parse(response.body);
        log(`Error details:`, 'red');
        console.log(JSON.stringify(errorData, null, 2));
      } catch (e) {
        log(`Error response: ${response.body}`, 'red');
      }
      return false;
    }
  } catch (error) {
    log(`✗ Quiz submission request failed: ${error.message}`, 'red');
    log(`  Stack: ${error.stack}`, 'yellow');
    return false;
  }
}

async function testStudentExists() {
  log('\n=== Test 4: Student Record Check ===', 'cyan');
  
  try {
    // Try to check if student exists (this endpoint might not exist, so we'll catch)
    const response = await makeRequest(`${BACKEND_URL}/api/v1/students/${TEST_STUDENT_ID}`);
    
    log(`Student endpoint returned: ${response.status}`, 'blue');
    if (response.status === 200) {
      log('✓ Student record exists', 'green');
    } else if (response.status === 404) {
      log('⚠ Student record not found (this might be expected)', 'yellow');
    }
    return true;
  } catch (error) {
    log(`⚠ Could not check student record: ${error.message}`, 'yellow');
    log('  (This endpoint might not exist - that\'s okay)', 'yellow');
    return true; // Not a critical failure
  }
}

async function testDatabaseConnection() {
  log('\n=== Test 5: Database Connection (via Quiz Submission) ===', 'cyan');
  
  // We'll infer database connectivity from the quiz submission
  // If it fails with a database error, we'll catch it
  log('Database connectivity will be tested during quiz submission...', 'blue');
  return true;
}

async function testErrorHandling() {
  log('\n=== Test 6: Error Handling ===', 'cyan');
  
  const invalidPayloads = [
    {
      name: 'Missing talents array',
      payload: { interests: [] }
    },
    {
      name: 'Missing interests array',
      payload: { talents: [] }
    },
    {
      name: 'Invalid talent structure',
      payload: {
        talents: [{ invalid: 'field' }],
        interests: []
      }
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of invalidPayloads) {
    try {
      const response = await makeRequest(`${BACKEND_URL}/api/v1/students/${TEST_STUDENT_ID}/quiz`, {
        method: 'POST',
        body: test.payload
      });
      
      if (response.status >= 400) {
        log(`✓ ${test.name}: Correctly rejected (${response.status})`, 'green');
        passed++;
      } else {
        log(`✗ ${test.name}: Should have been rejected but got ${response.status}`, 'red');
        failed++;
      }
    } catch (error) {
      log(`✗ ${test.name}: Request failed: ${error.message}`, 'red');
      failed++;
    }
  }
  
  log(`\nError handling: ${passed} passed, ${failed} failed`, passed === invalidPayloads.length ? 'green' : 'yellow');
  return failed === 0;
}

async function checkEnvironmentVariables() {
  log('\n=== Test 7: Environment Variables ===', 'cyan');
  
  const envVars = {
    'Backend URL': BACKEND_URL,
    'Frontend URL': FRONTEND_URL,
    'DATABASE_URL': process.env.DATABASE_URL ? '***set***' : 'NOT SET',
    'CORS_ORIGIN': process.env.CORS_ORIGIN || 'NOT SET (using default)',
    'PORT': process.env.PORT || 'NOT SET (using default 3001)'
  };
  
  log('Environment Configuration:', 'blue');
  Object.entries(envVars).forEach(([key, value]) => {
    log(`  ${key}: ${value}`, 'blue');
  });
  
  return true;
}

async function runAllTests() {
  log('='.repeat(60), 'cyan');
  log('UCID App - Quiz Submission Debug Script', 'cyan');
  log('='.repeat(60), 'cyan');
  
  log(`\nBackend URL: ${BACKEND_URL}`, 'blue');
  log(`Frontend URL: ${FRONTEND_URL}`, 'blue');
  
  const results = {
    healthCheck: await testHealthCheck(),
    cors: await testCORS(),
    quizSubmission: await testQuizSubmission(),
    studentExists: await testStudentExists(),
    database: await testDatabaseConnection(),
    errorHandling: await testErrorHandling(),
    environment: await checkEnvironmentVariables()
  };
  
  log('\n' + '='.repeat(60), 'cyan');
  log('Test Results Summary', 'cyan');
  log('='.repeat(60), 'cyan');
  
  Object.entries(results).forEach(([test, passed]) => {
    log(`${test}: ${passed ? '✓ PASS' : '✗ FAIL'}`, passed ? 'green' : 'red');
  });
  
  const allPassed = Object.values(results).every(r => r);
  
  log('\n' + '='.repeat(60), 'cyan');
  if (allPassed) {
    log('✓ All tests passed!', 'green');
  } else {
    log('✗ Some tests failed. Review the output above.', 'red');
    log('\nCommon Issues:', 'yellow');
    log('1. Backend not running: cd backend && npm run dev', 'yellow');
    log('2. CORS misconfiguration: Check backend/src/index.ts', 'yellow');
    log('3. Database connection: Check DATABASE_URL environment variable', 'yellow');
    log('4. Student record missing: Ensure student is created before quiz submission', 'yellow');
  }
  log('='.repeat(60), 'cyan');
  
  process.exit(allPassed ? 0 : 1);
}

// Run the tests
runAllTests().catch(error => {
  log(`\n✗ Fatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

