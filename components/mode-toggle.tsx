'use client';

import { Button } from '@/components/ui/button';
import { Palette, User } from 'lucide-react';

interface ModeToggleProps {
  mode: 'artist' | 'collector';
  onModeChange: (mode: 'artist' | 'collector') => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={mode === 'artist' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('artist')}
        className="flex items-center gap-2"
      >
        <Palette className="h-4 w-4" />
        Artist
      </Button>
      <Button
        variant={mode === 'collector' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('collector')}
        className="flex items-center gap-2"
      >
        <User className="h-4 w-4" />
        Collector
      </Button>
    </div>
  );
}