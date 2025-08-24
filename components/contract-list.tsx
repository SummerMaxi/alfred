'use client';

import { useState } from 'react';
import { useNftContracts } from '@/hooks/use-nft-contracts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Hash, Network, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAccount } from 'wagmi';
import { cn } from '@/lib/utils';

interface Contract {
  address: string;
  name: string;
  symbol: string;
  totalSupply: string;
  tokenType: string;
  contractDeployer: string;
  deployedBlockNumber: number;
  chain: string;
  chainId: number;
  explorer: string;
  opensea?: {
    floorPrice: number;
    collectionName: string;
    safelistRequestStatus: string;
    imageUrl: string;
    description: string;
    externalUrl: string;
    twitterUsername: string;
    discordUrl: string;
    bannerImageUrl: string;
    lastIngestedAt: string;
  };
}

interface ContractListProps {
  selectedContract: Contract | null;
  onContractSelect: (contract: Contract) => void;
}

const ITEMS_PER_PAGE = 6;

export function ContractList({ selectedContract, onContractSelect }: ContractListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { isConnected } = useAccount();
  const { data, isLoading, error } = useNftContracts();

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground">Connect Your Wallet</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Connect your wallet to view your deployed contracts
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive text-sm mb-2">Error loading contracts</div>
        <p className="text-muted-foreground text-sm">{error.message}</p>
      </div>
    );
  }

  if (!data?.contracts || data.contracts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground">No Contracts Found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          You haven&apos;t deployed any NFT contracts yet
        </p>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(data.contracts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentContracts = data.contracts.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-3 overflow-auto">
        {currentContracts.map((contract) => (
          <div
            key={contract.address}
            onClick={() => onContractSelect(contract)}
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-colors",
              selectedContract?.address === contract.address
                ? "bg-primary/10 border-primary"
                : "hover:bg-muted/50"
            )}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="font-semibold text-base leading-tight">
                  {contract.opensea?.collectionName || contract.name || 'Unnamed Contract'}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Hash className="h-3 w-3" />
                  <code className="font-mono">
                    {contract.address.slice(0, 6)}...{contract.address.slice(-4)}
                  </code>
                </div>
              </div>
              
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

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  <span>{parseInt(contract.totalSupply || '0').toLocaleString()} NFTs</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Network className="h-3 w-3" />
                  <span>{contract.chain}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 mt-auto border-t flex-shrink-0">
          <div className="text-sm text-muted-foreground">
            {startIndex + 1}-{Math.min(endIndex, data.contracts.length)} of {data.contracts.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}