'use client';

import { config } from '@/lib/config';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

interface OwnedContract {
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

interface OwnedContractsResponse {
  contracts: OwnedContract[];
  totalCount: number;
  pageKey?: string;
}

const SUPPORTED_CHAINS = [
  { name: 'Ethereum', endpoint: 'eth-mainnet.g.alchemy.com', chainId: 1, explorer: 'https://etherscan.io' },
  { name: 'Base', endpoint: 'base-mainnet.g.alchemy.com', chainId: 8453, explorer: 'https://basescan.org' },
  { name: 'Shape', endpoint: 'shape-mainnet.g.alchemy.com', chainId: 360, explorer: 'https://shapescan.xyz' },
];

export function useOwnedNftContracts() {
  const { address, isConnected } = useAccount();

  return useQuery({
    queryKey: ['owned-nft-contracts', address],
    queryFn: async (): Promise<OwnedContractsResponse> => {
      if (!address || !config.alchemyKey) {
        throw new Error('No address or Alchemy key available');
      }

      const allContracts: OwnedContract[] = [];

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
            
            // Filter contracts to EXCLUDE those deployed by the connected address
            // (i.e., only show contracts where user owns NFTs but didn't deploy the contract)
            const ownedContracts = data.contracts
              .filter((contract: any) => 
                contract.contractDeployer && 
                contract.contractDeployer.toLowerCase() !== address.toLowerCase()
              )
              .map((contract: any) => ({
                ...contract,
                chain: chain.name,
                chainId: chain.chainId,
                explorer: chain.explorer,
                totalSupply: contract.totalSupply || '0'
              }));

            allContracts.push(...ownedContracts);
          }
        } catch (error) {
          console.warn(`Failed to fetch owned contracts from ${chain.name}:`, error);
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