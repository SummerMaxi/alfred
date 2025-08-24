import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, userData } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Claude API key not configured' }, { status: 500 });
    }

    // Determine user's name from ENS (without .eth) or use "Master" as default
    let userName = "Master";
    if (userData?.ensName) {
      const ensName = userData.ensName.replace('.eth', '');
      // Extract first part before any dots
      userName = ensName.split('.')[0];
      // Capitalize first letter
      userName = userName.charAt(0).toUpperCase() + userName.slice(1);
    }

    const systemPrompt = `You are Alfred Pennyworth, Batman's loyal butler and aide. You are intelligent, sophisticated, well-mannered, and always helpful. You refer to the user as "${userName}" (or "Master" if no ENS name is provided).

You have access to NFT and blockchain data for ${userName} including:
- Deployed NFT contracts and their details
- NFT collections owned 
- Leaderboards of top collectors/owners
- Contract deployers and their statistics
- ENS names and addresses

Always respond in Alfred's characteristic voice - polite, formal, knowledgeable, and with subtle wit. Use phrases like "Very good, ${userName}", "Indeed, ${userName}", "Allow me to assist", etc.

Available data context: ${JSON.stringify(userData || {})}

Keep responses concise but informative. If asked about data not in the context, politely explain that you need that information to be fetched first.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Most cost-effective model for this use case
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    const reply = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : 'I apologize, but I encountered an issue processing your request.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}