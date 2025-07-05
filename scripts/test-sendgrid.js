#!/usr/bin/env node

/**
 * Test SendGrid Integration
 * 
 * This script tests the SendGrid integration by sending a test email.
 * Run this before setting up the full automation to ensure everything works.
 */

require('dotenv').config({ path: '.env.local' });
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ SENDGRID_API_KEY not found in environment variables');
  console.log('Please add your SendGrid API key to .env.local');
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function testSendGrid() {
  console.log('🧪 Testing SendGrid integration...');
  
  const testEmail = process.env.TEST_EMAIL || 'test@example.com';
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@dealcrafter.ai';
  
  console.log(`📧 Sending test email to: ${testEmail}`);
  console.log(`📧 From: ${fromEmail}`);
  
  const msg = {
    to: testEmail,
    from: fromEmail,
    subject: '🧪 Deal Crafter AI - SendGrid Test Email',
    text: `Hi there!

This is a test email to verify that SendGrid integration is working correctly for Deal Crafter AI.

If you received this email, congratulations! Your email automation system is ready to go.

Best regards,
The Deal Crafter AI Team

---
This is a test email sent at ${new Date().toISOString()}`,
    html: `<p>Hi there!</p>

<p>This is a test email to verify that SendGrid integration is working correctly for Deal Crafter AI.</p>

<p>If you received this email, congratulations! Your email automation system is ready to go.</p>

<p>Best regards,<br>
The Deal Crafter AI Team</p>

<hr>
<p><em>This is a test email sent at ${new Date().toISOString()}</em></p>`,
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Test email sent successfully!');
    console.log('🎉 SendGrid integration is working correctly.');
    
    console.log('\n📋 Next steps:');
    console.log('1. Check your email inbox for the test message');
    console.log('2. If you received it, your setup is complete');
    console.log('3. You can now run the full automation script');
    console.log('4. Set up cron jobs for automated email sending');
    
  } catch (error) {
    console.error('❌ SendGrid test failed:', error);
    
    if (error.response) {
      console.error('Error details:', error.response.body);
    }
    
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Verify your SENDGRID_API_KEY is correct');
    console.log('2. Check that your SendGrid account is active');
    console.log('3. Verify your SENDGRID_FROM_EMAIL is verified in SendGrid');
    console.log('4. Make sure you have sufficient SendGrid credits');
    
    process.exit(1);
  }
}

// Run the test
testSendGrid()
  .then(() => {
    console.log('\n✨ Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
  }); 