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

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const signups = await readSignups();
    const existingSignupIndex = signups.findIndex(s => s.email === email);

    if (existingSignupIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user to paid status
    const existingSignup = signups[existingSignupIndex];
    const updatedSignup: Signup = {
      ...existingSignup,
      status: 'paid',
      paidAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      emailSequence: {
        ...existingSignup.emailSequence,
        welcomeSent: false, // Reset for paid user welcome sequence
        followUpSent: false,
        onboardingSent: false
      }
    };

    signups[existingSignupIndex] = updatedSignup;
    await writeSignups(signups);

    console.log('User marked as paid:', updatedSignup);

    // Here you would typically trigger a paid user welcome email
    // For now, we'll just return success
    return NextResponse.json({ 
      message: 'User marked as paid successfully',
      signup: updatedSignup
    });

  } catch (error) {
    console.error('Error marking user as paid:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 