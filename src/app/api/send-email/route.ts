import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface Signup {
  email: string;
  source: string;
  timestamp: string;
  id: string;
  lastUpdated?: string;
  status: 'early-access' | 'paid';
  paidAt?: string;
  emailSequence?: {
    welcomeSent: boolean;
    welcomeSentAt?: string;
    followUpSent: boolean;
    followUpSentAt?: string;
    onboardingSent: boolean;
    onboardingSentAt?: string;
  };
}

const signupsFile = path.join(process.cwd(), 'signups.json');

async function readSignups(): Promise<Signup[]> {
  try {
    const data = await fs.readFile(signupsFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeSignups(signups: Signup[]): Promise<void> {
  await fs.writeFile(signupsFile, JSON.stringify(signups, null, 2));
}

// Email templates
const emailTemplates = {
  earlyAccessWelcome: {
    subject: "Welcome to Deal Crafter AI - You're on the Early Access List! 🚀",
    body: `
Hi there!

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

P.S. Have questions? Just reply to this email - we'd love to hear from you!
    `.trim()
  },
  
  paidUserWelcome: {
    subject: "Welcome to Deal Crafter AI - Let's Get You Started! 🎉",
    body: `
Hi there!

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

P.S. We'll notify you as soon as the full platform is ready!
    `.trim()
  },
  
  earlyAccessFollowUp: {
    subject: "Deal Crafter AI Update - Launching Soon! ⚡",
    body: `
Hi there!

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

P.S. Questions about the launch? Just reply to this email!
    `.trim()
  },
  
  onboardingReminder: {
    subject: "Your Deal Crafter AI Account is Ready - Let's Get You Started! 🎯",
    body: `
Hi there!

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

P.S. Most users see their first results within 24 hours of setup.
    `.trim()
  }
};

async function sendEmailWithSendGrid(email: string, template: { subject: string; body: string }) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('SendGrid API key not configured, logging email instead:');
    console.log(`To: ${email}`);
    console.log(`Subject: ${template.subject}`);
    console.log(`Body: ${template.body.substring(0, 100)}...`);
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
    console.error('❌ SendGrid error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();

    if (!email || !type) {
      return NextResponse.json({ error: 'Email and type are required' }, { status: 400 });
    }

    const signups = await readSignups();
    const signupIndex = signups.findIndex(s => s.email === email);

    if (signupIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const signup = signups[signupIndex];
    let emailTemplate;
    let emailSequenceKey = '';

    // Determine which email to send based on type and user status
    switch (type) {
      case 'welcome':
        if (signup.status === 'paid') {
          emailTemplate = emailTemplates.paidUserWelcome;
          emailSequenceKey = 'welcomeSent';
        } else {
          emailTemplate = emailTemplates.earlyAccessWelcome;
          emailSequenceKey = 'welcomeSent';
        }
        break;
      
      case 'follow-up':
        if (signup.status === 'early-access') {
          emailTemplate = emailTemplates.earlyAccessFollowUp;
          emailSequenceKey = 'followUpSent';
        } else {
          emailTemplate = emailTemplates.onboardingReminder;
          emailSequenceKey = 'followUpSent';
        }
        break;
      
      case 'onboarding':
        emailTemplate = emailTemplates.onboardingReminder;
        emailSequenceKey = 'onboardingSent';
        break;
      
      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    // Check if email was already sent
    if (signup.emailSequence?.[emailSequenceKey as keyof typeof signup.emailSequence]) {
      return NextResponse.json({ 
        message: 'Email already sent',
        alreadySent: true 
      });
    }

    // Send the email using SendGrid
    const emailSent = await sendEmailWithSendGrid(email, emailTemplate);

    if (!emailSent) {
      return NextResponse.json({ 
        error: 'Failed to send email' 
      }, { status: 500 });
    }

    // Update the signup to mark email as sent
    const updatedSignup: Signup = {
      ...signup,
      lastUpdated: new Date().toISOString(),
      emailSequence: {
        welcomeSent: signup.emailSequence?.welcomeSent || false,
        welcomeSentAt: signup.emailSequence?.welcomeSentAt,
        followUpSent: signup.emailSequence?.followUpSent || false,
        followUpSentAt: signup.emailSequence?.followUpSentAt,
        onboardingSent: signup.emailSequence?.onboardingSent || false,
        onboardingSentAt: signup.emailSequence?.onboardingSentAt,
        [emailSequenceKey]: true,
        [`${emailSequenceKey}At`]: new Date().toISOString()
      }
    };

    signups[signupIndex] = updatedSignup;
    await writeSignups(signups);

    return NextResponse.json({ 
      message: 'Email sent successfully',
      emailType: type,
      userStatus: signup.status
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Endpoint to send automated emails to all users who need them
export async function GET() {
  try {
    const signups = await readSignups();
    const now = new Date();
    const emailsToSend = [];

    for (const signup of signups) {
      const signupDate = new Date(signup.timestamp);
      const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24));

      // Send welcome email immediately for new signups
      if (!signup.emailSequence?.welcomeSent && daysSinceSignup === 0) {
        emailsToSend.push({
          email: signup.email,
          type: 'welcome',
          reason: 'New signup'
        });
      }

      // Send follow-up email after 3 days for early access users
      if (signup.status === 'early-access' && 
          !signup.emailSequence?.followUpSent && 
          daysSinceSignup >= 3) {
        emailsToSend.push({
          email: signup.email,
          type: 'follow-up',
          reason: '3-day follow-up'
        });
      }

      // Send onboarding reminder after 7 days for paid users
      if (signup.status === 'paid' && 
          !signup.emailSequence?.onboardingSent && 
          daysSinceSignup >= 7) {
        emailsToSend.push({
          email: signup.email,
          type: 'onboarding',
          reason: '7-day onboarding reminder'
        });
      }
    }

    return NextResponse.json({ 
      emailsToSend,
      total: emailsToSend.length
    });

  } catch (error) {
    console.error('Error checking for emails to send:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 