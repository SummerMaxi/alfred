'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, User } from 'lucide-react';

export function ModeToggle() {
  const [mode, setMode] = useState<'artist' | 'collector'>('artist');

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={mode === 'artist' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setMode('artist')}
        className="flex items-center gap-2"
      >
        <Palette className="h-4 w-4" />
        Artist
      </Button>
      <Button
        variant={mode === 'collector' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setMode('collector')}
        className="flex items-center gap-2"
      >
        <User className="h-4 w-4" />
        Collector
      </Button>
    </div>
  );
}

export function useModeToggle() {
  const [mode, setMode] = useState<'artist' | 'collector'>('artist');
  
  return { mode, setMode };
}