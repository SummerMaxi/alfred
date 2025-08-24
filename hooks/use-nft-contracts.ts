'use client';

import { config } from '@/lib/config';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

interface NftContract {
  address: string;
  name: string;
  symbol: string;
  totalSupply: string;
  tokenType: string;
  contractDeployer: string;
  deployedBlockNumber: number;
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

interface AlchemyResponse {
  contracts: NftContract[];
  totalCount: number;
  pageKey?: string;
}

export function useNftContracts() {
  const { address, isConnected } = useAccount();

  return useQuery({
    queryKey: ['nft-contracts', address],
    queryFn: async (): Promise<AlchemyResponse> => {
      if (!address || !config.alchemyKey) {
        throw new Error('No address or Alchemy key available');
      }

      const url = `https://eth-mainnet.g.alchemy.com/nft/v3/${config.alchemyKey}/getContractsForOwner`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: address,
          withMetadata: true,
          pageSize: 100,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    },
    enabled: isConnected && !!address && !!config.alchemyKey,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}