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
  chain: string;
  chainId: number;
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

const SUPPORTED_CHAINS = [
  { name: 'Ethereum', endpoint: 'eth-mainnet.g.alchemy.com', chainId: 1, explorer: 'https://etherscan.io' },
  { name: 'Base', endpoint: 'base-mainnet.g.alchemy.com', chainId: 8453, explorer: 'https://basescan.org' },
  { name: 'Shape', endpoint: 'shape-mainnet.g.alchemy.com', chainId: 360, explorer: 'https://shapescan.xyz' },
];

export function useNftContracts() {
  const { address, isConnected } = useAccount();

  return useQuery({
    queryKey: ['nft-contracts', address],
    queryFn: async (): Promise<AlchemyResponse> => {
      if (!address || !config.alchemyKey) {
        throw new Error('No address or Alchemy key available');
      }

      const allContracts: NftContract[] = [];

      // Query each supported chain
      for (const chain of SUPPORTED_CHAINS) {
        try {
          const searchParams = new URLSearchParams({
            owner: address,
            withMetadata: 'true',
            pageSize: '100',
          });
          
          const url = `https://${chain.endpoint}/nft/v3/${config.alchemyKey}/getContractsForOwner?${searchParams}`;
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            
            // Filter contracts to only show those deployed by the connected address
            const deployedContracts = data.contracts
              .filter((contract: any) => 
                contract.contractDeployer && 
                contract.contractDeployer.toLowerCase() === address.toLowerCase()
              )
              .map((contract: any) => ({
                ...contract,
                chain: chain.name,
                chainId: chain.chainId,
                explorer: chain.explorer,
                // Handle ERC1155 total supply - for ERC1155, totalSupply might be undefined or 0
                totalSupply: contract.tokenType === 'ERC1155' 
                  ? (contract.totalSupply || 'Multiple') 
                  : contract.totalSupply
              }));

            allContracts.push(...deployedContracts);
          }
        } catch (error) {
          console.warn(`Failed to fetch contracts from ${chain.name}:`, error);
          // Continue with other chains even if one fails
        }
      }
      
      return {
        contracts: allContracts,
        totalCount: allContracts.length
      };
    },
    enabled: isConnected && !!address && !!config.alchemyKey,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}