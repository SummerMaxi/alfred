'use client';

import { useState } from 'react';
import { ContractList } from '@/components/contract-list';
import { AggregatedLeaderboard } from '@/components/aggregated-leaderboard';
import { OwnedContractsList } from '@/components/owned-contracts-list';
import { DeployersLeaderboard } from '@/components/deployers-leaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAllNftOwners } from '@/hooks/use-all-nft-owners';
import { useDeployersLeaderboard } from '@/hooks/use-deployers-leaderboard';
import { useMode } from '@/contexts/mode-context';
import { Trophy, Users, Hammer, Palette, User } from 'lucide-react';

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

export default function Home() {
  const [selectedDeployedContract, setSelectedDeployedContract] = useState<Contract | null>(null);
  const [selectedOwnedContract, setSelectedOwnedContract] = useState<Contract | null>(null);
  const { mode } = useMode();
  const { data: ownersData } = useAllNftOwners();
  const { data: deployersData } = useDeployersLeaderboard();

  const isArtistMode = mode === 'artist';

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Alfred</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          {isArtistMode 
            ? "Your NFT contract deployment dashboard. Connect your wallet to view and manage the NFT contracts you've deployed."
            : "Your NFT collection dashboard. Connect your wallet to view NFT collections you own and their deployers."
          }
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          {isArtistMode ? (
            <Palette className="h-6 w-6" />
          ) : (
            <User className="h-6 w-6" />
          )}
          <h2 className="text-2xl font-bold tracking-tight">
            {isArtistMode ? "Your Deployed NFT Contracts" : "NFT Collections You Own"}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[600px]">
          {/* Left Column - Contract Lists */}
          <Card className="flex flex-col h-full">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-lg flex items-center gap-2">
                {isArtistMode ? (
                  <>
                    <Users className="h-5 w-5" />
                    Deployed Contracts
                  </>
                ) : (
                  <>
                    <Trophy className="h-5 w-5" />
                    Owned Collections
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {isArtistMode ? (
                <ContractList 
                  selectedContract={selectedDeployedContract}
                  onContractSelect={setSelectedDeployedContract}
                />
              ) : (
                <OwnedContractsList 
                  selectedContract={selectedOwnedContract}
                  onContractSelect={setSelectedOwnedContract}
                />
              )}
            </CardContent>
          </Card>

          {/* Right Column - Leaderboards */}
          <Card className="flex flex-col h-full">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isArtistMode ? (
                    <>
                      <Trophy className="h-5 w-5" />
                      NFT Owners Leaderboard
                    </>
                  ) : (
                    <>
                      <Hammer className="h-5 w-5" />
                      Contract Owners Leaderboard
                    </>
                  )}
                </div>
                {isArtistMode ? (
                  ownersData && (
                    <div className="text-sm font-normal text-muted-foreground">
                      {ownersData.totalUniqueOwners} unique owners
                    </div>
                  )
                ) : (
                  deployersData && (
                    <div className="text-sm font-normal text-muted-foreground">
                      {deployersData.totalUniqueDeployers} unique deployers
                    </div>
                  )
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {isArtistMode ? (
                <AggregatedLeaderboard />
              ) : (
                <DeployersLeaderboard />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
