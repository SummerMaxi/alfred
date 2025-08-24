'use client';

import { useState } from 'react';
import { useDeployersLeaderboard } from '@/hooks/use-deployers-leaderboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, Copy, Code, Hammer } from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 20;

export function DeployersLeaderboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useDeployersLeaderboard();

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-destructive text-sm mb-2">Error loading deployers</div>
        <p className="text-muted-foreground text-sm">{error.message}</p>
      </div>
    );
  }

  if (!data?.deployers || data.deployers.length === 0) {
    return (
      <div className="text-center py-8">
        <Hammer className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground">No Deployers Found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          You don't own NFTs from any collections yet
        </p>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(data.deployers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDeployers = data.deployers.slice(startIndex, endIndex);

  return (
    <div className="space-y-3">
      {/* Deployers List */}
      <div className="space-y-2">
        {currentDeployers.map((deployer, index) => {
          const rank = startIndex + index + 1;
          const getRankIcon = () => {
            if (rank === 1) return '🥇';
            if (rank === 2) return '🥈';
            if (rank === 3) return '🥉';
            return `#${rank}`;
          };

          return (
            <Card key={deployer.deployerAddress} className="p-3 hover:bg-muted/30 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 text-sm font-bold">
                      {getRankIcon()}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono">
                          {deployer.deployerAddress.slice(0, 6)}...{deployer.deployerAddress.slice(-4)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyAddress(deployer.deployerAddress)}
                          className="h-5 w-5 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {deployer.totalSupplyAcrossContracts.toLocaleString()} total NFTs across collections
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="secondary" className="font-mono text-sm">
                      {deployer.totalContracts} contracts
                    </Badge>
                  </div>
                </div>

                {/* Show deployed contracts */}
                <div className="ml-9 space-y-1">
                  {deployer.contractsDeployed.slice(0, 3).map((contract) => (
                    <div key={contract.contractAddress} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Code className="h-3 w-3" />
                        <span className="truncate max-w-[200px]">{contract.contractName}</span>
                        <Badge variant="outline" className="text-xs">{contract.tokenType}</Badge>
                      </div>
                      <div className="text-muted-foreground">
                        {parseInt(contract.totalSupply).toLocaleString()} supply
                      </div>
                    </div>
                  ))}
                  {deployer.contractsDeployed.length > 3 && (
                    <div className="text-xs text-muted-foreground ml-5">
                      +{deployer.contractsDeployed.length - 3} more contracts...
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, data.deployers.length)} of {data.deployers.length}
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