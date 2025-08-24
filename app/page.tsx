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
import { InterfaceModeToggle } from '@/components/interface-mode-toggle';
import { ModeToggleWrapper } from '@/components/mode-toggle-wrapper';
import { Trophy, Users, Hammer } from 'lucide-react';
import { Contract } from '@/types/contract';
import { exportCollectorsToCSV, exportContractsToCSV, exportDetailedCollectorsToCSV } from '@/lib/csv-export';
import { Download } from 'lucide-react';

export default function Home() {
  const [selectedDeployedContract, setSelectedDeployedContract] = useState<Contract | null>(null);
  const [selectedOwnedContract, setSelectedOwnedContract] = useState<Contract | null>(null);
  const { mode } = useMode();
  const { interfaceMode } = useInterfaceMode();
  const { data: ownersData } = useAllNftOwners();
  const { data: deployersData } = useDeployersLeaderboard();

  const isArtistMode = mode === 'artist';

  const handleExportCollectors = () => {
    if (ownersData?.owners) {
      exportCollectorsToCSV(ownersData.owners, 'top-collectors.csv');
    }
  };

  const handleExportDetailedCollectors = () => {
    if (ownersData?.owners) {
      exportDetailedCollectorsToCSV(ownersData.owners, 'detailed-collectors.csv');
    }
  };

  const handleExportContracts = () => {
    const contracts = isArtistMode ? deployedContracts?.contracts : ownedContracts?.contracts;
    if (contracts) {
      exportContractsToCSV(contracts, `${isArtistMode ? 'deployed' : 'owned'}-contracts.csv`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Interface Mode Toggle - Always visible at top center */}
      <div className="flex justify-center py-4 border-b">
        <InterfaceModeToggle />
      </div>

      {/* Show Alfred interface if that mode is selected */}
      {interfaceMode === 'alfred' ? (
        <div className="flex-1">
          <AutonomousInterface />
        </div>
      ) : (
        <div className="flex-1 p-4">
          {/* Artist/Collector Toggle and Export Options - Only visible in Manual mode */}
          <div className="flex flex-col items-center mb-6 space-y-4">
            <ModeToggleWrapper />
            
            {/* Export and Manual Address Options */}
            <div className="flex flex-wrap gap-3 items-center">
              <Button 
                onClick={handleExportCollectors}
                variant="outline" 
                size="sm"
                disabled={!ownersData?.owners?.length}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Collectors CSV
              </Button>
              <Button 
                onClick={handleExportContracts}
                variant="outline" 
                size="sm"
                disabled={!((isArtistMode ? deployedContracts?.contracts : ownedContracts?.contracts)?.length)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Contracts CSV
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{height: 'calc(100vh - 16rem)'}}>
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
      )}
    </div>
  );
}
