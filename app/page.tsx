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
import { useInterfaceMode } from '@/contexts/interface-mode-context';
import { AutonomousInterface } from '@/components/autonomous-interface';
import { Trophy, Users, Hammer } from 'lucide-react';
import { Contract } from '@/types/contract';

export default function Home() {
  const [selectedDeployedContract, setSelectedDeployedContract] = useState<Contract | null>(null);
  const [selectedOwnedContract, setSelectedOwnedContract] = useState<Contract | null>(null);
  const { mode } = useMode();
  const { interfaceMode } = useInterfaceMode();
  const { data: ownersData } = useAllNftOwners();
  const { data: deployersData } = useDeployersLeaderboard();

  const isArtistMode = mode === 'artist';

  // Show autonomous interface if that mode is selected
  if (interfaceMode === 'autonomous') {
    return <AutonomousInterface />;
  }

  return (
    <div className="space-y-8">

      <div className="space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[500px]">
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
