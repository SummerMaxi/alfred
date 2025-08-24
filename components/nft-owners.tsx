'use client';

import { useState } from 'react';
import { useNftOwners } from '@/hooks/use-nft-owners';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, Copy, ExternalLink, Users } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface NftOwnersProps {
  contractAddress: string;
  contractName: string;
  chainName: string;
  explorerUrl: string;
}

const ITEMS_PER_PAGE = 10;

export function NftOwners({ contractAddress, contractName, chainName, explorerUrl }: NftOwnersProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useNftOwners(contractAddress, chainName);

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard');
  };

  if (!contractAddress) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground">Select a Contract</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Choose a contract from the left to view its NFT owners
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
        </Card>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive text-sm mb-2">Error loading NFT owners</div>
        <p className="text-muted-foreground text-sm">{error.message}</p>
      </div>
    );
  }

  if (!data?.owners || data.owners.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground">No Owners Found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          This contract doesn't have any NFT owners yet
        </p>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(data.owners.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOwners = data.owners.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            NFT Owners - {contractName}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{data.totalCount} unique owners</span>
            <Badge variant="outline" className="text-xs">
              {chainName}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-3">
        {currentOwners.map((owner, index) => {
          const rank = startIndex + index + 1;
          return (
            <Card key={owner.ownerAddress} className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      #{rank}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono">
                          {owner.ownerAddress.slice(0, 6)}...{owner.ownerAddress.slice(-4)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyAddress(owner.ownerAddress)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Link
                          href={`${explorerUrl}/address/${owner.ownerAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                      {owner.tokenBalances.length > 1 && (
                        <div className="text-xs text-muted-foreground">
                          Owns {owner.tokenBalances.length} different token IDs
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    {owner.totalBalance} NFTs
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, data.owners.length)} of {data.owners.length} owners
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}