'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAccount } from 'wagmi';
import { useENSName } from '@/hooks/use-ens-name';
import { useNftContracts } from '@/hooks/use-nft-contracts';
import { useOwnedNftContracts } from '@/hooks/use-owned-nft-contracts';
import { useAllNftOwners } from '@/hooks/use-all-nft-owners';
import { useDeployersLeaderboard } from '@/hooks/use-deployers-leaderboard';
import { Send, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AutonomousInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { address } = useAccount();
  const { ensName } = useENSName(address || '');
  const { data: deployedContracts } = useNftContracts();
  const { data: ownedContracts } = useOwnedNftContracts();
  const { data: allOwners } = useAllNftOwners();
  const { data: deployers } = useDeployersLeaderboard();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add initial greeting message
    if (messages.length === 0) {
      const userName = ensName ? ensName.replace('.eth', '').split('.')[0] : 'Master';
      const greeting = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: `Good day, ${userName.charAt(0).toUpperCase() + userName.slice(1)}. I am Alfred, your personal blockchain assistant. I have access to all your NFT data and can help you analyze your contracts, collections, and leaderboards. How may I assist you today?`,
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, [ensName, messages.length]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare user data context
      const userData = {
        address,
        ensName,
        deployedContracts: deployedContracts?.contracts || [],
        ownedContracts: ownedContracts?.contracts || [],
        allOwners: allOwners?.owners || [],
        deployers: deployers?.deployers || [],
        stats: {
          totalDeployedContracts: deployedContracts?.totalCount || 0,
          totalOwnedContracts: ownedContracts?.totalCount || 0,
          totalUniqueOwners: allOwners?.totalUniqueOwners || 0,
          totalUniqueDeployers: deployers?.totalUniqueDeployers || 0
        }
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          userData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered a technical difficulty. Please ensure your API key is configured and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto">
      <div className="text-center py-6 border-b">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Bot className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Alfred AI Assistant</h1>
        </div>
        <p className="text-muted-foreground">
          Your personal blockchain butler, ready to assist with NFT data analysis
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 max-w-[80%]",
              message.role === 'user' ? 'ml-auto' : 'mr-auto'
            )}
          >
            <Card className={cn(
              "p-4",
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            )}>
              <div className="whitespace-pre-wrap text-sm">
                {message.content}
              </div>
              <div className={cn(
                "text-xs mt-2 opacity-70",
                message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
              )}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </Card>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <Card className="p-4 bg-muted">
              <div className="text-sm">Alfred is thinking...</div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Alfred about your NFT data..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Press Enter to send • Alfred has access to all your NFT contracts and leaderboard data
        </div>
      </div>
    </div>
  );
}