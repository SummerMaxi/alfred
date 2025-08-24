'use client';

import { cn } from '@/lib/utils';
import { Bot, Settings } from 'lucide-react';
import { useInterfaceMode } from '@/contexts/interface-mode-context';

export function InterfaceModeToggle() {
  const { interfaceMode, setInterfaceMode } = useInterfaceMode();

  return (
    <div className="relative flex items-center bg-muted rounded-full p-1 w-44 h-9">
      {/* Sliding background */}
      <div
        className={cn(
          "absolute top-1 bottom-1 w-20 bg-primary rounded-full transition-transform duration-200 ease-in-out",
          interfaceMode === 'alfred' ? 'translate-x-0' : 'translate-x-20'
        )}
      />
      
      {/* Alfred Button */}
      <button
        onClick={() => setInterfaceMode('alfred')}
        className={cn(
          "relative z-10 flex items-center justify-center gap-1.5 w-20 h-7 rounded-full transition-colors duration-200",
          interfaceMode === 'alfred' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Bot className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Alfred</span>
      </button>
      
      {/* Manual Button */}
      <button
        onClick={() => setInterfaceMode('manual')}
        className={cn(
          "relative z-10 flex items-center justify-center gap-1.5 w-20 h-7 rounded-full transition-colors duration-200",
          interfaceMode === 'manual' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Settings className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Manual</span>
      </button>
    </div>
  );
}