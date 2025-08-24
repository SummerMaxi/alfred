'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

    const currentInput = input;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentInput,
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
          message: currentInput,
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
    <div className="flex items-center justify-center p-6 min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-4xl h-[600px] border rounded-lg shadow-lg bg-background flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4 items-start",
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <Avatar className="h-8 w-8 shrink-0 mt-1">
                  <AvatarFallback className={cn(
                    "text-xs font-semibold",
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {message.role === 'user' ? 'U' : 'A'}
                  </AvatarFallback>
                </Avatar>
                
                <div className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : 'bg-muted mr-auto'
                )}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={cn(
                    "text-xs mt-2 opacity-60 font-medium",
                    message.role === 'user' 
                      ? 'text-primary-foreground/60 text-right' 
                      : 'text-muted-foreground'
                  )}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 items-start">
                <Avatar className="h-8 w-8 shrink-0 mt-1">
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                    A
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-muted shadow-sm mr-auto">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" 
                           style={{animationDelay: '0ms'}} />
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" 
                           style={{animationDelay: '150ms'}} />
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" 
                           style={{animationDelay: '300ms'}} />
                    </div>
                    Alfred is thinking...
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-background p-4">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Alfred about your NFT collections, collectors, or digital art insights..."
              disabled={isLoading}
              className="flex-1 h-12 rounded-2xl border-2 focus:border-primary/50 px-4"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isLoading}
              size="lg"
              className="h-12 px-6 rounded-2xl"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            Press <Badge variant="outline" className="px-1 py-0 text-xs">Enter</Badge> to send • 
            Your personal NFT connoisseur
          </div>
        </div>
      </div>
    </div>
  );
}