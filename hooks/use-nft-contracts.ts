'use client';

import { config } from '@/lib/config';
import { useQuery } from '@tanstack/react-query';
import { useEffectiveAddress } from './use-effective-address';
import { Contract } from '@/types/contract';

interface AlchemyResponse {
  contracts: Contract[];
  totalCount: number;
  pageKey?: string;
}

const SUPPORTED_CHAINS = [
  { name: 'Ethereum', endpoint: 'eth-mainnet.g.alchemy.com', chainId: 1, explorer: 'https://etherscan.io' },
  { name: 'Base', endpoint: 'base-mainnet.g.alchemy.com', chainId: 8453, explorer: 'https://basescan.org' },
  { name: 'Shape', endpoint: 'shape-mainnet.g.alchemy.com', chainId: 360, explorer: 'https://shapescan.xyz' },
];

// Helper function to get total editions/supply for ERC1155 contracts
async function getERC1155TotalSupply(contractAddress: string, chainEndpoint: string, alchemyKey: string): Promise<number> {
  try {
    const url = `https://${chainEndpoint}/nft/v3/${alchemyKey}/getNFTsForContract`;
    let totalSupply = 0;
    let pageKey: string | undefined;
    let hasMore = true;

    // Paginate through all NFTs to sum up their individual supplies
    while (hasMore) {
      const searchParams = new URLSearchParams({
        contractAddress,
        withMetadata: 'true',
        limit: '100'
      });

      if (pageKey) {
        searchParams.append('pageKey', pageKey);
      }

      const response = await fetch(`${url}?${searchParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // For ERC1155, sum up the supply of each token ID
        if (data.nfts) {
          for (const nft of data.nfts) {
            // ERC1155 NFTs have a supply field indicating how many editions of this token ID exist
            const supply = parseInt(nft.supply || nft.balance || '1');
            totalSupply += supply;
          }
        }

        pageKey = data.pageKey;
        hasMore = !!pageKey;
      } else {
        break;
      }
    }

    return totalSupply;
  } catch (error) {
    console.warn('Failed to get ERC1155 total supply:', error);
    return 0;
  }
}

export function useNftContracts() {
  const { address, isConnected } = useEffectiveAddress();

  return useQuery({
    queryKey: ['nft-contracts', address],
    queryFn: async (): Promise<AlchemyResponse> => {
      if (!address || !config.alchemyKey) {
        throw new Error('No address or Alchemy key available');
      }

      const allContracts: Contract[] = [];

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
            const deployedContracts = data.contracts.filter((contract: any) => 
              contract.contractDeployer && 
              contract.contractDeployer.toLowerCase() === address.toLowerCase()
            );

            // For each deployed contract, get the actual NFT count if it's ERC1155
            for (const contract of deployedContracts) {
              let actualTotalSupply = contract.totalSupply;
              
              if (contract.tokenType === 'ERC1155') {
                // Get total supply across all token IDs for ERC1155 contracts
                const actualSupply = await getERC1155TotalSupply(contract.address, chain.endpoint, config.alchemyKey);
                actualTotalSupply = actualSupply > 0 ? actualSupply.toString() : contract.totalSupply || '0';
              }
              
              allContracts.push({
                ...contract,
                chain: chain.name,
                chainId: chain.chainId,
                explorer: chain.explorer,
                totalSupply: actualTotalSupply
              });
            }
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