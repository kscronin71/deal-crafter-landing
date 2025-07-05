# SendGrid Setup Guide for Deal Crafter AI

## 🚀 Quick Setup (5 minutes)

### 1. Create SendGrid Account
1. Go to [SendGrid.com](https://sendgrid.com)
2. Sign up for a free account (100 emails/day free)
3. Verify your email address

### 2. Get Your API Key
1. In SendGrid dashboard, go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name it "Deal Crafter AI"
4. Select **Full Access** or **Restricted Access** with **Mail Send** permissions
5. Copy the API key (starts with `SG.`)

### 3. Verify Your Sender Email
1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Add your domain or email (e.g., `noreply@yourdomain.com`)
4. Follow the verification steps

### 4. Update Environment Variables
Add these to your `.env.local` file:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Optional: Test email address
TEST_EMAIL=your-email@example.com
```

### 5. Test the Integration
```bash
npm run test-email
```

If successful, you'll see:
```
✅ Test email sent successfully!
🎉 SendGrid integration is working correctly.
```

## 📧 Email Automation Features

### Automatic Email Sequences

#### Early Access Users
- **Welcome Email**: Sent immediately when they sign up
- **Follow-up Email**: Sent 3 days later with launch updates

#### Paid Users  
- **Welcome Email**: Sent immediately after payment
- **Onboarding Reminder**: Sent 7 days later if they haven't logged in

### Email Templates

All emails are professionally written and include:
- Clear value propositions
- Next steps and calls-to-action
- Support contact information
- Brand-consistent messaging

## 🔧 Manual Testing

### Test Individual Email Types
```bash
# Test welcome email
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","type":"welcome"}'

# Test follow-up email  
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","type":"follow-up"}'
```

### Check Email Queue
```bash
# See what emails need to be sent
curl http://localhost:3000/api/send-email
```

## 🤖 Automation Setup

### Run Manually
```bash
npm run send-emails
```

### Schedule with Cron (Recommended)
```bash
# Edit crontab
crontab -e

# Add these lines:
# Every hour
0 * * * * cd /path/to/dealcrafter-landing && npm run send-emails

# Daily at 9 AM
0 9 * * * cd /path/to/dealcrafter-landing && npm run send-emails
```

### Using GitHub Actions (Alternative)
Create `.github/workflows/email-automation.yml`:

```yaml
name: Email Automation
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:     # Manual trigger

jobs:
  send-emails:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run send-emails
        env:
          SENDGRID_API_KEY: ${{ secrets.SENDGRID_API_KEY }}
          SENDGRID_FROM_EMAIL: ${{ secrets.SENDGRID_FROM_EMAIL }}
```

## 📊 Monitoring & Analytics

### Admin Dashboard
Visit `/admin` to see:
- Total signups and conversion rates
- Email sequence status for each user
- Manual email sending controls
- Export functionality

### SendGrid Analytics
In SendGrid dashboard, monitor:
- **Activity**: Email delivery, opens, clicks
- **Bounces**: Failed deliveries
- **Spam Reports**: User complaints
- **Unsubscribes**: Opt-outs

## 🔍 Troubleshooting

### Common Issues

#### "API Key Invalid"
- Verify your API key is correct
- Check that your SendGrid account is active
- Ensure you have sufficient credits

#### "Sender Not Verified"
- Complete sender authentication in SendGrid
- Use a verified domain or email address
- Wait for verification to complete (can take 24 hours)

#### "Emails Not Sending"
- Check server logs for errors
- Verify environment variables are loaded
- Test with the test script first

#### "Duplicate Emails"
- The system prevents duplicates automatically
- Check email sequence tracking in admin dashboard
- Verify user status is correct

### Debug Mode
Enable detailed logging:
```bash
DEBUG_EMAILS=true npm run send-emails
```

### Check Logs
```bash
# View recent email activity
tail -f logs/email-automation.log

# Check for errors
grep "ERROR" logs/email-automation.log
```

## 📈 Best Practices

### Email Content
- Keep subject lines under 50 characters
- Use clear, actionable language
- Include unsubscribe links
- Test emails before sending

### Timing
- Welcome emails: Within 5 minutes of signup
- Follow-ups: 3-7 days after signup
- Onboarding: 7-14 days after payment

### Compliance
- Include physical address in emails
- Honor unsubscribe requests immediately
- Follow GDPR and CAN-SPAM regulations
- Monitor spam complaints

## 💰 Cost Optimization

### SendGrid Pricing
- **Free Tier**: 100 emails/day
- **Essentials**: $15/month for 50k emails
- **Pro**: $89/month for 100k emails

### Tips to Reduce Costs
- Clean your email list regularly
- Remove bounced emails immediately
- Use segmentation to avoid unnecessary sends
- Monitor your sending volume

## 🎯 Next Steps

1. **Test the integration** with `npm run test-email`
2. **Set up automation** with cron or GitHub Actions
3. **Monitor performance** in SendGrid dashboard
4. **Customize email templates** for your brand
5. **Set up webhooks** for real-time analytics

## 📞 Support

If you need help:
1. Check the troubleshooting section above
2. Review SendGrid documentation
3. Check server logs for specific errors
4. Test with the provided test script

Your email automation system is now ready to convert more users and increase revenue! 🚀 