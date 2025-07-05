#!/usr/bin/env node

/**
 * Automated Email Sender for Deal Crafter AI
 * 
 * This script sends automated emails to users based on their status and timing.
 * Run manually or schedule with cron:
 * 
 * Every hour: 0 * * * * node scripts/send-automated-emails.js
 * Daily at 9 AM: 0 9 * * * node scripts/send-automated-emails.js
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs').promises;
const path = require('path');
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Email templates (same as in the API)
const emailTemplates = {
  earlyAccessWelcome: {
    subject: "Welcome to Deal Crafter AI - You're on the Early Access List! 🚀",
    body: `Hi there!

Thank you for joining the Deal Crafter AI early access list! We're incredibly grateful that you've chosen us to help transform your sales process.

Here's why this will be one of the best decisions you've made for your business:

🎯 **Early Access Benefits:**
• Guaranteed $20/month pricing forever
• Priority access when we launch
• Exclusive onboarding support
• Early feature access

📈 **What Deal Crafter AI Does:**
• Sends up to 5,000 personalized emails per day
• Generates emails that get 3x higher reply rates
• Automates your entire sales process
• Tracks everything in real-time

💡 **Why This Will Pay Off:**
Most founders spend $80k+ annually on sales teams that barely hit quota. Deal Crafter AI replaces that entire cost with AI that actually closes deals. You'll see ROI within your first month.

🔒 **30-Day Money-Back Guarantee:**
We're so confident you'll love the results that we offer a full 30-day money-back guarantee. No questions asked.

We're currently in final testing and will be launching soon. You'll be the first to know when we're ready!

In the meantime, check out our demo to see how it works.

Best regards,
The Deal Crafter AI Team

P.S. Have questions? Just reply to this email - we'd love to hear from you!`
  },
  
  paidUserWelcome: {
    subject: "Welcome to Deal Crafter AI - Let's Get You Started! 🎉",
    body: `Hi there!

Welcome to Deal Crafter AI! We're incredibly grateful that you've chosen us to help transform your sales process. You're now part of an exclusive group of founders who are replacing expensive sales teams with AI that actually closes deals.

Here's why this investment will pay off big time:

🚀 **What You Get:**
• Send up to 5,000 personalized emails per day
• AI-generated personalized messages
• Real-time analytics and optimization
• Automated follow-ups and scheduling

💡 **Why This Will Pay Off:**
Most founders spend $80k+ annually on sales teams that barely hit quota. Deal Crafter AI replaces that entire cost with AI that actually closes deals. You'll see ROI within your first month.

🔒 **30-Day Money-Back Guarantee:**
We're so confident you'll love the results that we offer a full 30-day money-back guarantee. No questions asked.

📞 **Need Help?**
We're here to support you every step of the way. Just reply to this email or schedule a quick onboarding call.

Your success is our success!

Best regards,
The Deal Crafter AI Team

P.S. We'll notify you as soon as the full platform is ready!`
  },
  
  earlyAccessFollowUp: {
    subject: "Deal Crafter AI Update - Launching Soon! ⚡",
    body: `Hi there!

Great news! Deal Crafter AI is launching soon, and you're guaranteed early access pricing.

🔥 **Launch Details:**
• Launch Date: Coming Soon
• Your Price: $20/month forever
• Early Access Benefits: Priority support and exclusive features

💡 **What Our Early Users Are Saying:**
"Deal Crafter AI helped us close 3x more deals in our first month. We went from 2 sales to 6 deals worth $45k."

🚀 **Ready to Get Started?**
When we launch, you'll get:
• Instant access to send up to 5,000 emails per day
• Personalized email generation
• Real-time analytics dashboard
• Priority support

💡 **Why This Will Pay Off:**
Most founders spend $80k+ annually on sales teams that barely hit quota. Deal Crafter AI replaces that entire cost with AI that actually closes deals. You'll see ROI within your first month.

🔒 **30-Day Money-Back Guarantee:**
We're so confident you'll love the results that we offer a full 30-day money-back guarantee. No questions asked.

We'll send you your login credentials as soon as we go live!

Best regards,
The Deal Crafter AI Team

P.S. Questions about the launch? Just reply to this email!`
  },
  
  onboardingReminder: {
    subject: "Your Deal Crafter AI Account is Ready - Let's Get You Started! 🎯",
    body: `Hi there!

Your Deal Crafter AI account is ready and waiting for you! We noticed you haven't logged in yet, and we want to make sure you get the most out of your investment.

We're incredibly grateful that you've chosen us, and we want to help you see results fast.

🎯 **What You're Missing:**
• Up to 5,000 personalized emails per day
• AI-generated personalized emails
• Real-time analytics and optimization
• Potential meetings and deals

💡 **Why This Will Pay Off:**
Most founders spend $80k+ annually on sales teams that barely hit quota. Deal Crafter AI replaces that entire cost with AI that actually closes deals. You'll see ROI within your first month.

🔒 **30-Day Money-Back Guarantee:**
We're so confident you'll love the results that we offer a full 30-day money-back guarantee. No questions asked.

💡 **Need Help?**
We offer free onboarding calls to get you set up and seeing results fast. Just reply to this email to schedule yours.

Your success is our priority!

Best regards,
The Deal Crafter AI Team

P.S. Most users see their first results within 24 hours of setup.`
  }
};

async function readSignups() {
  try {
    const signupsFile = path.join(process.cwd(), 'signups.json');
    const data = await fs.readFile(signupsFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading signups:', error);
    return [];
  }
}

async function writeSignups(signups) {
  try {
    const signupsFile = path.join(process.cwd(), 'signups.json');
    await fs.writeFile(signupsFile, JSON.stringify(signups, null, 2));
  } catch (error) {
    console.error('Error writing signups:', error);
  }
}

async function sendEmail(email, template) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log(`📧 SendGrid not configured - logging email to ${email}:`);
    console.log(`   Subject: ${template.subject}`);
    console.log(`   Body: ${template.body.substring(0, 100)}...`);
    return true;
  }

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@dealcrafter.ai',
    subject: template.subject,
    text: template.body,
    html: template.body.replace(/\n/g, '<br>'),
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ SendGrid error for ${email}:`, error);
    return false;
  }
}

async function sendAutomatedEmails() {
  console.log('🚀 Starting automated email sequence...');
  
  const signups = await readSignups();
  const now = new Date();
  let emailsSent = 0;
  let errors = 0;

  for (const signup of signups) {
    try {
      const signupDate = new Date(signup.timestamp);
      const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24));

      // Send welcome email immediately for new signups (same day)
      if (!signup.emailSequence?.welcomeSent && daysSinceSignup === 0) {
        const template = signup.status === 'paid' 
          ? emailTemplates.paidUserWelcome 
          : emailTemplates.earlyAccessWelcome;
        
        const success = await sendEmail(signup.email, template);
        if (success) {
          signup.emailSequence = {
            ...signup.emailSequence,
            welcomeSent: true,
            welcomeSentAt: new Date().toISOString()
          };
          emailsSent++;
          console.log(`✅ Welcome email sent to ${signup.email} (${signup.status})`);
        } else {
          errors++;
        }
      }

      // Send follow-up email after 3 days for early access users
      if (signup.status === 'early-access' && 
          !signup.emailSequence?.followUpSent && 
          daysSinceSignup >= 3) {
        
        const success = await sendEmail(signup.email, emailTemplates.earlyAccessFollowUp);
        if (success) {
          signup.emailSequence = {
            ...signup.emailSequence,
            followUpSent: true,
            followUpSentAt: new Date().toISOString()
          };
          emailsSent++;
          console.log(`✅ Follow-up email sent to ${signup.email} (early access)`);
        } else {
          errors++;
        }
      }

      // Send onboarding reminder after 7 days for paid users
      if (signup.status === 'paid' && 
          !signup.emailSequence?.onboardingSent && 
          daysSinceSignup >= 7) {
        
        const success = await sendEmail(signup.email, emailTemplates.onboardingReminder);
        if (success) {
          signup.emailSequence = {
            ...signup.emailSequence,
            onboardingSent: true,
            onboardingSentAt: new Date().toISOString()
          };
          emailsSent++;
          console.log(`✅ Onboarding reminder sent to ${signup.email} (paid user)`);
        } else {
          errors++;
        }
      }

    } catch (error) {
      console.error(`❌ Error processing ${signup.email}:`, error);
      errors++;
    }
  }

  // Save updated signups
  await writeSignups(signups);

  console.log(`\n📊 Email automation complete:`);
  console.log(`   ✅ Emails sent: ${emailsSent}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📅 Date: ${now.toISOString()}`);
}

// Run the script
if (require.main === module) {
  sendAutomatedEmails()
    .then(() => {
      console.log('🎉 Automated email sequence finished successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Automated email sequence failed:', error);
      process.exit(1);
    });
}

module.exports = { sendAutomatedEmails }; 