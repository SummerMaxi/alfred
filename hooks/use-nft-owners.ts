'use client';

import { config } from '@/lib/config';
import { useQuery } from '@tanstack/react-query';

interface Owner {
  ownerAddress: string;
  tokenBalances: {
    tokenId: string;
    balance: number;
  }[];
  totalBalance: number;
}

interface OwnersResponse {
  owners: Owner[];
  totalCount: number;
  pageKey?: string;
}

const SUPPORTED_CHAINS = [
  { name: 'Ethereum', endpoint: 'eth-mainnet.g.alchemy.com', chainId: 1 },
  { name: 'Base', endpoint: 'base-mainnet.g.alchemy.com', chainId: 8453 },
  { name: 'Shape', endpoint: 'shape-mainnet.g.alchemy.com', chainId: 360 },
];

export function useNftOwners(contractAddress: string, chainName: string) {
  return useQuery({
    queryKey: ['nft-owners', contractAddress, chainName],
    queryFn: async (): Promise<OwnersResponse> => {
      if (!contractAddress || !config.alchemyKey) {
        throw new Error('No contract address or Alchemy key available');
      }

      const chain = SUPPORTED_CHAINS.find(c => c.name === chainName);
      if (!chain) {
        throw new Error(`Unsupported chain: ${chainName}`);
      }

      const url = `https://${chain.endpoint}/nft/v3/${config.alchemyKey}/getOwnersForContract`;
      const searchParams = new URLSearchParams({
        contractAddress,
        withTokenBalances: 'true',
        pageSize: '100'
      });

      const response = await fetch(`${url}?${searchParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform and sort owners by total balance
      const owners = (data.owners || [])
        .map((owner: any) => {
          const totalBalance = owner.tokenBalances?.reduce((sum: number, tb: any) => 
            sum + parseInt(tb.balance || '0'), 0) || 0;
          
          return {
            ownerAddress: owner.ownerAddress,
            tokenBalances: owner.tokenBalances || [],
            totalBalance
          };
        })
        .sort((a: Owner, b: Owner) => b.totalBalance - a.totalBalance);

      return {
        owners,
        totalCount: owners.length,
        pageKey: data.pageKey
      };
    },
    enabled: !!contractAddress && !!chainName && !!config.alchemyKey,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}