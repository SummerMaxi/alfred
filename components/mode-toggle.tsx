'use client';

import { cn } from '@/lib/utils';
import { Palette, User } from 'lucide-react';

interface ModeToggleProps {
  mode: 'artist' | 'collector';
  onModeChange: (mode: 'artist' | 'collector') => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="relative flex items-center bg-muted rounded-full p-1 w-44 h-9">
      {/* Sliding background */}
      <div
        className={cn(
          "absolute top-1 bottom-1 w-20 bg-primary rounded-full transition-transform duration-200 ease-in-out",
          mode === 'artist' ? 'translate-x-0' : 'translate-x-20'
        )}
      />
      
      {/* Artist Button */}
      <button
        onClick={() => onModeChange('artist')}
        className={cn(
          "relative z-10 flex items-center justify-center gap-1.5 w-20 h-7 rounded-full transition-colors duration-200",
          mode === 'artist' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Palette className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Artist</span>
      </button>
      
      {/* Collector Button */}
      <button
        onClick={() => onModeChange('collector')}
        className={cn(
          "relative z-10 flex items-center justify-center gap-1.5 w-20 h-7 rounded-full transition-colors duration-200",
          mode === 'collector' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <User className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Collector</span>
      </button>
    </div>
  );
}