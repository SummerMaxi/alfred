'use client';

import { useNftContracts } from '@/hooks/use-nft-contracts';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, FileText, Hash, Network } from 'lucide-react';
import { useAccount } from 'wagmi';
import Link from 'next/link';

export function NftContracts() {
  const { isConnected } = useAccount();
  const { data, isLoading, error } = useNftContracts();

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground">Connect Your Wallet</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Connect your wallet to view the NFT contracts you&apos;ve deployed
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive text-sm mb-2">Error loading deployed contracts</div>
        <p className="text-muted-foreground text-sm">{error.message}</p>
      </div>
    );
  }

  if (!data?.contracts || data.contracts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground">No Deployed Contracts Found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          You haven&apos;t deployed any NFT contracts yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Your Deployed NFT Contracts</h2>
        <p className="text-muted-foreground">
          {data.totalCount} contract{data.totalCount !== 1 ? 's' : ''} deployed by your address
        </p>
      </div>

      <div className="space-y-3">
        {data.contracts.map((contract) => (
          <div
            key={contract.address}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">
                      {contract.opensea?.collectionName || contract.name || 'Unnamed Contract'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Hash className="h-3 w-3" />
                      <code className="text-xs font-mono">{contract.address}</code>
                      <Link
                        href={`${contract.explorer || 'https://etherscan.io'}/address/${contract.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                  
                  {/* Token type and symbol moved to left */}
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {contract.tokenType}
                    </Badge>
                    {contract.symbol && (
                      <Badge variant="outline" className="text-xs font-mono">
                        {contract.symbol}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* NFT count and network moved to right */}
                <div className="text-right space-y-2 ml-4">
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <FileText className="h-3 w-3" />
                      <span>
                        {parseInt(contract.totalSupply || '0').toLocaleString()} NFTs
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Network className="h-3 w-3" />
                      <span>{contract.chain}</span>
                    </div>
                  </div>
                </div>
              </div>

              {contract.opensea?.floorPrice && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>Floor: {contract.opensea.floorPrice} ETH</span>
                </div>
              )}

              {contract.opensea?.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {contract.opensea.description}
                </p>
              )}

              {contract.opensea?.externalUrl && (
                <div className="mt-2">
                  <Link
                    href={contract.opensea.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View Collection →
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}