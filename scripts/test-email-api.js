#!/usr/bin/env node

/**
 * Test Email API Route
 * 
 * This script tests the email API route directly to see if it's working correctly.
 */

require('dotenv').config({ path: '.env.local' });

console.log('🧪 Testing Email API Route\n');

async function testEmailAPI() {
  const testEmail = 'test@leadcrafter.ai';
  
  console.log(`📧 Testing email API with: ${testEmail}`);
  
  try {
    // First, make sure the user exists in signups
    const signupResponse = await fetch('http://localhost:3000/api/signups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: testEmail, 
        source: 'test-script' 
      }),
    });

    if (!signupResponse.ok) {
      console.log('❌ Failed to create signup');
      return;
    }

    console.log('✅ Signup created/updated');

    // Now test the email API
    const emailResponse = await fetch('http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: testEmail, 
        type: 'welcome' 
      }),
    });

    const emailData = await emailResponse.json();
    
    if (emailResponse.ok) {
      console.log('✅ Email API response:', emailData);
      console.log('\n📋 Check your email inbox and spam folder!');
    } else {
      console.log('❌ Email API error:', emailData);
    }

  } catch (error) {
    console.error('❌ Error testing email API:', error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/signups');
    if (response.ok) {
      console.log('✅ Server is running');
      await testEmailAPI();
    } else {
      console.log('❌ Server is not responding correctly');
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start the dev server with: npm run dev');
  }
}

checkServer(); 