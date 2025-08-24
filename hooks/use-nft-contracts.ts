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

      const searchParams = new URLSearchParams({
        owner: address,
        withMetadata: 'true',
        pageSize: '100',
      });
      
      const url = `https://eth-mainnet.g.alchemy.com/nft/v3/${config.alchemyKey}/getContractsForOwner?${searchParams}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Filter contracts to only show those deployed by the connected address
      const deployedContracts = data.contracts.filter((contract: NftContract) => 
        contract.contractDeployer && 
        contract.contractDeployer.toLowerCase() === address.toLowerCase()
      );
      
      return {
        ...data,
        contracts: deployedContracts,
        totalCount: deployedContracts.length
      };
    },
    enabled: isConnected && !!address && !!config.alchemyKey,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}