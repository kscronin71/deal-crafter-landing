#!/usr/bin/env node

/**
 * Debug Email Script for Deal Crafter AI
 * 
 * This script helps debug email delivery issues by showing environment variables
 * and testing email sending with different configurations.
 */

require('dotenv').config({ path: '.env.local' });
const sgMail = require('@sendgrid/mail');

console.log('🔍 Email Debug Script for Deal Crafter AI\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log(`SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Not set'}`);
console.log(`SENDGRID_FROM_EMAIL: ${process.env.SENDGRID_FROM_EMAIL || '❌ Not set (will use default)'}`);
console.log(`Default FROM email: noreply@dealcrafter.ai\n`);

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid API key loaded');
} else {
  console.log('❌ SendGrid API key not found');
  process.exit(1);
}

// Test email configuration
async function testEmail(toEmail) {
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@dealcrafter.ai';
  
  console.log(`📧 Testing email configuration:`);
  console.log(`From: ${fromEmail}`);
  console.log(`To: ${toEmail}`);
  console.log(`Subject: Test email from Deal Crafter AI`);
  
  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: 'Test email from Deal Crafter AI',
    text: 'This is a test email to verify SendGrid configuration.',
    html: '<p>This is a test email to verify SendGrid configuration.</p>',
  };

  try {
    console.log('\n🚀 Sending test email...');
    await sgMail.send(msg);
    console.log('✅ Email sent successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    if (error.response) {
      console.error('SendGrid response:', error.response.body);
    }
    return false;
  }
}

// Test multiple email addresses
async function runTests() {
  const testEmails = [
    'kevin@leadcrafter.ai',
    'kscronin71@gmail.com', // Your Gmail
    'test@example.com' // This will likely bounce, but helps us see the difference
  ];

  console.log('🧪 Testing multiple email addresses...\n');

  for (const email of testEmails) {
    console.log(`\n--- Testing: ${email} ---`);
    const success = await testEmail(email);
    if (success) {
      console.log(`✅ Sent to ${email} - Check your SendGrid Activity Feed`);
    } else {
      console.log(`❌ Failed to send to ${email}`);
    }
    console.log('---');
  }

  console.log('\n📋 Next steps:');
  console.log('1. Check SendGrid Activity Feed for delivery status of each email');
  console.log('2. Look for any bounces, blocks, or delivery issues');
  console.log('3. Check your inbox/spam for the emails that were sent successfully');
  console.log('4. If Gmail works but leadcrafter.ai doesn\'t, it might be a domain-specific issue');
}

// Run the tests
runTests(); 