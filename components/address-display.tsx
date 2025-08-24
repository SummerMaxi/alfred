'use client';

import { useENSName } from '@/hooks/use-ens-name';
import { Skeleton } from '@/components/ui/skeleton';

interface AddressDisplayProps {
  address: string;
  className?: string;
  showFullAddress?: boolean;
}

export function AddressDisplay({ address, className, showFullAddress = false }: AddressDisplayProps) {
  const { ensName, isLoading } = useENSName(address);

  if (isLoading) {
    return <Skeleton className={`h-4 w-24 ${className}`} />;
  }

  if (ensName) {
    return <span className={className}>{ensName}</span>;
  }

  if (showFullAddress) {
    return <code className={`font-mono ${className}`}>{address}</code>;
  }

  return (
    <code className={`font-mono ${className}`}>
      {address.slice(0, 6)}...{address.slice(-4)}
    </code>
  );
}