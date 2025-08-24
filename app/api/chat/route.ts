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

    // Summarize the data to avoid token limits
    const deployedContractsSummary = userData?.deployedContracts?.slice(0, 5)?.map(c => ({
      name: c.name,
      symbol: c.symbol,
      address: c.contractAddress?.slice(0, 10) + '...',
      totalSupply: c.totalSupply
    })) || [];

    const topOwners = userData?.allOwners?.slice(0, 15)?.map(owner => ({
      address: owner.ownerAddress,
      totalNfts: owner.totalNfts,
      contracts: owner.contractsOwned?.length || 0
    })) || [];

    const systemPrompt = `You are Alfred Pennyworth, ${userName}'s distinguished personal NFT connoisseur and blockchain butler. You are sophisticated, well-mannered, and possess an expert eye for digital art and NFT collections.

IMPORTANT: You have access to ${userName}'s complete NFT ecosystem data:

DEPLOYED CONTRACTS (${userName}'s artwork): ${deployedContractsSummary.length} contracts including ${JSON.stringify(deployedContractsSummary)}
OWNED COLLECTIONS: ${userData?.stats?.totalOwnedContracts || 0} collections  
TOP COLLECTORS (ranked by total NFTs owned): ${JSON.stringify(topOwners)}
STATISTICS: Deployed ${userData?.stats?.totalDeployedContracts || 0} contracts, ${userData?.stats?.totalUniqueOwners || 0} unique collectors

When asked for "top 10 collectors" or "top 9 collectors", provide a clear ranked list from the TOP COLLECTORS data. Show FULL wallet addresses, total NFT count (totalNfts), and number of different contracts they own from.

For questions outside NFT/blockchain data (like general questions, weather, news, etc.), politely redirect with wit: "I'm afraid such matters fall under Master Robin's jurisdiction, ${userName}. My expertise lies in your secret NFT affairs from the public. How may I assist with your JPEGs instead?"

Always respond in Alfred's characteristic voice - polite, formal, knowledgeable about digital art, and subtly witty. Use "Very good, ${userName}", "Indeed, ${userName}", "Allow me to assist", etc.

As a personal NFT connoisseur, provide insightful commentary on collecting patterns, market dynamics, and the artistic merit of collections when relevant.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022', // Updated to correct model name
      max_tokens: 8000,
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
  } catch (error: any) {
    console.error('Chat API error:', error);
    console.error('Error details:', {
      status: error.status,
      message: error.message,
      stack: error.stack
    });
    
    // Handle rate limiting specifically
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'I apologize, Master, but I am currently experiencing high demand. The API rate limit has been reached. Please try again in a moment or configure your own Anthropic API key.' },
        { status: 429 }
      );
    }
    
    // Handle authentication errors
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'I regret to inform you, Master, that the API key is not properly configured. Please add your Anthropic API key to the environment variables.' },
        { status: 401 }
      );
    }

    // Handle invalid model errors
    if (error.status === 400 && error.message?.includes('model')) {
      return NextResponse.json(
        { error: 'I apologize, Master, but there appears to be an issue with the AI model configuration. Please check the API settings.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'I encountered a technical difficulty, Master. Please ensure your API key is configured properly and try again.' },
      { status: 500 }
    );
  }
}