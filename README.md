# Deal Crafter AI Landing Page

A modern, high-converting landing page for Deal Crafter AI built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Hero Section**: Compelling headline with email signup
- **Features Section**: Three key value propositions with icons
- **Interactive Demo**: AI-powered message generation (ready for OpenAI integration)
- **Call-to-Action**: Final conversion section
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenAI API Key (for message generation)
OPENAI_API_KEY=your_openai_api_key_here

# Stripe Keys (for billing - to be added later)
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## API Integration

### OpenAI Integration

The demo section currently uses a mock response. To enable real AI message generation:

1. Add your OpenAI API key to `.env.local`
2. Uncomment the OpenAI code in `src/app/api/generate-message/route.ts`
3. The API will generate personalized outreach messages based on industry and location

### Email Collection

Email signup forms currently log to console. To wire up email collection:

1. Update the `handleSubmit` functions in `HeroSection.tsx` and `CTASection.tsx`
2. Integrate with your preferred email service (Mailchimp, ConvertKit, etc.)

### Stripe Integration

For billing integration:

1. Add Stripe keys to environment variables
2. Create Stripe checkout sessions
3. Handle webhook events for subscription management

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate-message/
│   │       └── route.ts          # OpenAI API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main landing page
└── components/
    ├── HeroSection.tsx           # Hero with email signup
    ├── FeaturesSection.tsx       # Three feature cards
    ├── DemoSection.tsx           # Interactive AI demo
    └── CTASection.tsx            # Final call-to-action
```

## Customization

### Colors
The primary color scheme uses blue (`blue-600`) as the main brand color. Update Tailwind classes throughout components to match your brand.

### Content
- Update headlines, descriptions, and copy in each component
- Replace placeholder text with your actual value propositions
- Add your logo and branding elements

### Styling
All styling is done with Tailwind CSS classes. Modify classes in components to adjust:
- Spacing and layout
- Typography and colors
- Responsive behavior
- Animations and transitions

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Performance

- Optimized for Core Web Vitals
- Responsive images and lazy loading
- Minimal JavaScript bundle
- Fast page loads with Next.js optimizations

## SEO

- Meta tags configured in `layout.tsx`
- Semantic HTML structure
- Open Graph tags ready for social sharing
- Structured data ready for rich snippets

## Analytics

To add analytics:
1. Install Google Analytics or other tracking
2. Add tracking code to `layout.tsx`
3. Set up conversion tracking for email signups

## Support

For questions or issues:
1. Check the Next.js documentation
2. Review Tailwind CSS documentation
3. Contact the development team

## License

This project is proprietary software for Deal Crafter AI.
