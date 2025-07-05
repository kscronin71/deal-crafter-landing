#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const sgMail = require('@sendgrid/mail');

console.log('🧪 Simple Email Test\n');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const msg = {
  to: 'kscronin71@gmail.com',
  from: process.env.SENDGRID_FROM_EMAIL || 'noreply@dealcrafter.ai',
  subject: 'Simple Test',
  text: 'Hello, this is a simple test email.',
  html: '<p>Hello, this is a simple test email.</p>',
};

async function sendSimpleTest() {
  try {
    console.log('Sending simple test email...');
    await sgMail.send(msg);
    console.log('✅ Simple test email sent!');
    console.log('Check your Gmail inbox and spam folder.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

sendSimpleTest(); 