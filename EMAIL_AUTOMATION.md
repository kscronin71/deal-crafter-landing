# Deal Crafter AI - Email Automation System

## Overview

The Deal Crafter AI landing page includes a comprehensive email automation system that distinguishes between early access signups and paid users, sending targeted email sequences to maximize engagement and conversion.

## User Status Types

### 1. Early Access Users
- **Status**: `early-access`
- **Source**: Users who sign up for the waitlist but haven't paid yet
- **Email Sequence**:
  - Welcome email (immediate)
  - Follow-up email (3 days later)
  - Launch announcement (when ready)

### 2. Paid Users
- **Status**: `paid`
- **Source**: Users who complete Stripe checkout
- **Email Sequence**:
  - Welcome email (immediate)
  - Onboarding reminder (7 days later)
  - Account activation instructions

## Email Templates

### Early Access Welcome Email
- **Subject**: "Welcome to Deal Crafter AI - You're on the Early Access List! 🚀"
- **Content**: Early access benefits, pricing guarantee, what to expect
- **Timing**: Sent immediately when user signs up

### Paid User Welcome Email
- **Subject**: "Welcome to Deal Crafter AI - Let's Get You Started! 🎉"
- **Content**: Next steps, account setup, first campaign guidance
- **Timing**: Sent immediately when user completes payment

### Early Access Follow-up
- **Subject**: "Deal Crafter AI Update - Launch Date Announced! ⚡"
- **Content**: Launch details, pricing reminder, social proof
- **Timing**: Sent 3 days after signup

### Onboarding Reminder
- **Subject**: "Your Deal Crafter AI Account is Ready - Let's Get Started! 🎯"
- **Content**: Setup instructions, what they're missing, support offer
- **Timing**: Sent 7 days after payment for users who haven't logged in

## API Endpoints

### `/api/signups`
- **POST**: Create or update user signup
- **GET**: Retrieve all signups with analytics

### `/api/mark-paid`
- **POST**: Mark user as paid (called from success page)

### `/api/send-email`
- **POST**: Send specific email type to user
- **GET**: Check for emails that need to be sent automatically

## Admin Dashboard Features

### Analytics Dashboard
- Total signups count
- Early access vs paid user breakdown
- Conversion rate calculation
- Signups by source (hero-section, cta-section, etc.)

### User Management
- Filter by status (all, early-access, paid)
- Email sequence tracking
- Manual email sending
- Export to CSV

### Email Sequence Tracking
- Welcome email status
- Follow-up email status
- Onboarding email status
- Timestamps for each email sent

## Automation Script

### `scripts/send-automated-emails.js`
A Node.js script that can be run manually or scheduled to send automated emails:

```bash
# Run manually
node scripts/send-automated-emails.js

# Schedule with cron (every hour)
0 * * * * node /path/to/dealcrafter-landing/scripts/send-automated-emails.js

# Schedule with cron (daily at 9 AM)
0 9 * * * node /path/to/dealcrafter-landing/scripts/send-automated-emails.js
```

## Integration with Email Services

### Current Implementation
The system currently logs emails to the console. To integrate with real email services:

### SendGrid Integration
```javascript
// In scripts/send-automated-emails.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(email, template) {
  const msg = {
    to: email,
    from: 'noreply@dealcrafter.ai',
    subject: template.subject,
    text: template.body,
    html: template.body.replace(/\n/g, '<br>')
  };
  
  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('SendGrid error:', error);
    return false;
  }
}
```

### Mailgun Integration
```javascript
// In scripts/send-automated-emails.js
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});

async function sendEmail(email, template) {
  const data = {
    from: 'Deal Crafter AI <noreply@dealcrafter.ai>',
    to: email,
    subject: template.subject,
    text: template.body
  };
  
  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
    return true;
  } catch (error) {
    console.error('Mailgun error:', error);
    return false;
  }
}
```

## Environment Variables

Add these to your `.env.local`:

```bash
# Email Service (choose one)
SENDGRID_API_KEY=your_sendgrid_api_key
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Data Structure

### Signup Object
```json
{
  "email": "user@example.com",
  "source": "hero-section",
  "timestamp": "2025-01-05T12:00:00.000Z",
  "id": "1704456000000",
  "status": "early-access",
  "paidAt": null,
  "emailSequence": {
    "welcomeSent": true,
    "welcomeSentAt": "2025-01-05T12:00:00.000Z",
    "followUpSent": false,
    "followUpSentAt": null,
    "onboardingSent": false,
    "onboardingSentAt": null
  }
}
```

## Best Practices

### 1. Email Timing
- Welcome emails: Immediate (within 5 minutes)
- Follow-up emails: 3-7 days after signup
- Onboarding reminders: 7-14 days after payment

### 2. Content Strategy
- Keep emails concise and actionable
- Include clear next steps
- Use social proof and testimonials
- Provide support contact information

### 3. Segmentation
- Different content for early access vs paid users
- Track engagement and adjust sequences
- A/B test subject lines and content

### 4. Compliance
- Include unsubscribe links
- Respect email frequency preferences
- Follow GDPR and CAN-SPAM regulations

## Monitoring and Analytics

### Key Metrics to Track
- Email open rates
- Click-through rates
- Conversion rates (early access → paid)
- Time to first login (paid users)
- Support ticket volume

### Dashboard Features
- Real-time signup tracking
- Email sequence status
- Conversion funnel analysis
- User engagement metrics

## Troubleshooting

### Common Issues
1. **Emails not sending**: Check API keys and service configuration
2. **Duplicate emails**: System prevents duplicate sends via tracking
3. **Missing user data**: Ensure signup API is working correctly
4. **Scheduling issues**: Verify cron job configuration

### Debug Mode
Enable debug logging by setting:
```bash
DEBUG_EMAILS=true
```

This will log all email operations to the console for troubleshooting. 