'use client';

import { useQuery } from '@tanstack/react-query';
import { config } from '@/lib/config';

const ENS_CONTRACT_ADDRESS = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85';

interface ENSNameResult {
  ensName: string | null;
  isLoading: boolean;
}

export function useENSName(address: string): ENSNameResult {
  const { data, isLoading } = useQuery({
    queryKey: ['ens-name', address],
    queryFn: async (): Promise<string | null> => {
      if (!address || !config.alchemyKey) {
        return null;
      }

      try {
        const searchParams = new URLSearchParams({
          owner: address,
          'contractAddresses[]': ENS_CONTRACT_ADDRESS,
          withMetadata: 'true',
          pageSize: '10',
        });
        
        const url = `https://eth-mainnet.g.alchemy.com/nft/v3/${config.alchemyKey}/getNFTsForOwner?${searchParams}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        
        // Look for ENS domains specifically - they have .eth in the title
        if (data.ownedNfts && data.ownedNfts.length > 0) {
          for (const nft of data.ownedNfts) {
            const title = nft.title || nft.name;
            // ENS domains should end with .eth and have "an ENS name" in description
            if (title && title.includes('.eth') && nft.description && nft.description.includes('an ENS name')) {
              return title;
            }
          }
        }
        
        return null;
      } catch (error) {
        console.warn('Failed to resolve ENS name:', error);
        return null;
      }
    },
    enabled: !!address && !!config.alchemyKey,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    ensName: data || null,
    isLoading,
  };
}