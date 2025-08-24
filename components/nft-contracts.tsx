'use client';

import { useNftContracts } from '@/hooks/use-nft-contracts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, ImageIcon, Users } from 'lucide-react';
import { useAccount } from 'wagmi';
import Link from 'next/link';

export function NftContracts() {
  const { isConnected } = useAccount();
  const { data, isLoading, error } = useNftContracts();

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground">Connect Your Wallet</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Connect your wallet to view your NFT collections
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-muted">
              <Skeleton className="w-full h-full" />
            </div>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive text-sm mb-2">Error loading NFT contracts</div>
        <p className="text-muted-foreground text-sm">{error.message}</p>
      </div>
    );
  }

  if (!data?.contracts || data.contracts.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground">No NFT Collections Found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          This wallet doesn't own any NFT collections yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your NFT Collections</h2>
          <p className="text-muted-foreground">
            {data.totalCount} collection{data.totalCount !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.contracts.map((contract) => (
          <Card key={contract.address} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-muted relative overflow-hidden">
              {contract.opensea?.imageUrl ? (
                <img
                  src={contract.opensea.imageUrl}
                  alt={contract.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className="hidden absolute inset-0 flex items-center justify-center bg-muted">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              {contract.opensea?.bannerImageUrl && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              )}
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg leading-6">
                    {contract.opensea?.collectionName || contract.name || 'Unnamed Collection'}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {contract.symbol} • {contract.tokenType}
                  </CardDescription>
                </div>
                {contract.opensea?.externalUrl && (
                  <Link
                    href={contract.opensea.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
              </div>
              
              {contract.opensea?.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {contract.opensea.description}
                </p>
              )}
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{parseInt(contract.totalSupply).toLocaleString()} items</span>
                </div>
                {contract.opensea?.floorPrice && (
                  <Badge variant="secondary" className="text-xs">
                    Floor: {contract.opensea.floorPrice} ETH
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {contract.opensea?.safelistRequestStatus || 'Unknown'}
                </Badge>
                <Link
                  href={`https://etherscan.io/address/${contract.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                >
                  View Contract
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}