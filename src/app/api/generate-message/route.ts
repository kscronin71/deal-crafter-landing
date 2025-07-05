import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { targetIndustry, location } = await request.json();

    if (!targetIndustry || !location) {
      return NextResponse.json(
        { error: 'Target industry and location are required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a sales expert who writes personalized cold outreach messages that get high reply rates. Keep messages concise, professional, and focused on value proposition."
        },
        {
          role: "user",
          content: `Write a personalized cold outreach message for prospects in the ${targetIndustry} industry located in ${location}. The message should be professional, personalized, and designed to get a response. Include specific details about the industry and location to make it feel authentic.`
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const generatedMessage = completion.choices[0]?.message?.content || 'Unable to generate message';

    return NextResponse.json({ message: generatedMessage });
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    );
  }
} 