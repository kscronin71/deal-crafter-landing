import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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
  const data = await fs.readFile(signupsFile, 'utf-8');
  return JSON.parse(data);
}

async function writeSignups(signups: Signup[]): Promise<void> {
  await fs.writeFile(signupsFile, JSON.stringify(signups, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json();

    if (!email || !source) {
      return NextResponse.json({ error: 'Email and source are required' }, { status: 400 });
    }

    const signups = await readSignups();
    const existingSignupIndex = signups.findIndex(s => s.email === email);

    if (existingSignupIndex !== -1) {
      // Update existing signup
      const existingSignup = signups[existingSignupIndex];
      const updatedSignup: Signup = {
        ...existingSignup,
        lastUpdated: new Date().toISOString(),
        source: source, // Update source if different
        emailSequence: existingSignup.emailSequence || {
          welcomeSent: false,
          followUpSent: false,
          onboardingSent: false
        }
      };

      signups[existingSignupIndex] = updatedSignup;
      await writeSignups(signups);

      console.log('Updated existing signup:', updatedSignup);
      return NextResponse.json({ 
        message: 'Signup updated successfully', 
        updated: true,
        signup: updatedSignup
      });
    } else {
      // Create new signup
      const newSignup: Signup = {
        email,
        source,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
        status: 'early-access',
        emailSequence: {
          welcomeSent: false,
          followUpSent: false,
          onboardingSent: false
        }
      };

      signups.push(newSignup);
      await writeSignups(signups);

      console.log('New signup:', newSignup);
      return NextResponse.json({ 
        message: 'Signup created successfully', 
        updated: false,
        signup: newSignup
      });
    }
  } catch {
    console.error('Error handling signup');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const signups = await readSignups();
    
    // Add analytics
    const analytics = {
      total: signups.length,
      earlyAccess: signups.filter(s => s.status === 'early-access').length,
      paid: signups.filter(s => s.status === 'paid').length,
      bySource: signups.reduce((acc, signup) => {
        acc[signup.source] = (acc[signup.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentSignups: signups
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10)
    };

    return NextResponse.json({ signups, analytics });
  } catch {
    console.error('Error reading signups');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 