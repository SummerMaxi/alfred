'use client';

import { useState } from 'react';
import { ContractList } from '@/components/contract-list';
import { NftOwners } from '@/components/nft-owners';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Alfred</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Your NFT contract deployment dashboard. Connect your wallet to view and manage the NFT contracts you've deployed.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Your Deployed NFT Contracts</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Contract List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deployed Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <ContractList 
                selectedContract={selectedContract}
                onContractSelect={setSelectedContract}
              />
            </CardContent>
          </Card>

          {/* Right Column - NFT Owners */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">NFT Owners</CardTitle>
            </CardHeader>
            <CardContent>
              <NftOwners 
                contractAddress={selectedContract?.address || ''}
                contractName={selectedContract?.opensea?.collectionName || selectedContract?.name || 'Contract'}
                chainName={selectedContract?.chain || ''}
                explorerUrl={selectedContract?.explorer || 'https://etherscan.io'}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
