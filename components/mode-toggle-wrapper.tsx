'use client';

import { ModeToggle } from './mode-toggle';
import { useMode } from '@/contexts/mode-context';

export function ModeToggleWrapper() {
  const { mode, setMode } = useMode();

  return <ModeToggle mode={mode} onModeChange={setMode} />;
}