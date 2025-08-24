'use client';

import { config } from '@/lib/config';
import { useQuery } from '@tanstack/react-query';
import { useNftContracts } from './use-nft-contracts';

interface AggregatedOwner {
  ownerAddress: string;
  totalNfts: number;
  contractsOwned: {
    contractAddress: string;
    contractName: string;
    nftCount: number;
    chain: string;
  }[];
}

interface AggregatedOwnersResponse {
  owners: AggregatedOwner[];
  totalUniqueOwners: number;
  totalContracts: number;
}

const SUPPORTED_CHAINS = [
  { name: 'Ethereum', endpoint: 'eth-mainnet.g.alchemy.com', chainId: 1 },
  { name: 'Base', endpoint: 'base-mainnet.g.alchemy.com', chainId: 8453 },
  { name: 'Shape', endpoint: 'shape-mainnet.g.alchemy.com', chainId: 360 },
];

async function fetchContractOwners(contractAddress: string, chainName: string, contractName: string) {
  const chain = SUPPORTED_CHAINS.find(c => c.name === chainName);
  if (!chain || !config.alchemyKey) return [];

  try {
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

    if (!response.ok) return [];

    const data = await response.json();
    
    return (data.owners || []).map((owner: any) => ({
      ownerAddress: owner.ownerAddress,
      contractAddress,
      contractName,
      chain: chainName,
      nftCount: owner.tokenBalances?.reduce((sum: number, tb: any) => 
        sum + parseInt(tb.balance || '0'), 0) || 0
    }));
  } catch (error) {
    console.warn(`Failed to fetch owners for ${contractAddress}:`, error);
    return [];
  }
}

export function useAllNftOwners() {
  const { data: contractsData } = useNftContracts();

  return useQuery({
    queryKey: ['all-nft-owners', contractsData?.contracts?.map(c => c.address).join(',')],
    queryFn: async (): Promise<AggregatedOwnersResponse> => {
      if (!contractsData?.contracts || contractsData.contracts.length === 0) {
        return { owners: [], totalUniqueOwners: 0, totalContracts: 0 };
      }

      // Fetch owners for all contracts
      const allOwnerPromises = contractsData.contracts.map(contract =>
        fetchContractOwners(
          contract.address,
          contract.chain,
          contract.opensea?.collectionName || contract.name || 'Unknown'
        )
      );

      const allOwnerResults = await Promise.all(allOwnerPromises);
      const allOwners = allOwnerResults.flat();

      // Aggregate owners by address
      const ownerMap = new Map<string, AggregatedOwner>();

      allOwners.forEach(owner => {
        if (!ownerMap.has(owner.ownerAddress)) {
          ownerMap.set(owner.ownerAddress, {
            ownerAddress: owner.ownerAddress,
            totalNfts: 0,
            contractsOwned: []
          });
        }

        const aggregatedOwner = ownerMap.get(owner.ownerAddress)!;
        aggregatedOwner.totalNfts += owner.nftCount;
        aggregatedOwner.contractsOwned.push({
          contractAddress: owner.contractAddress,
          contractName: owner.contractName,
          nftCount: owner.nftCount,
          chain: owner.chain
        });
      });

      // Sort by total NFTs owned
      const sortedOwners = Array.from(ownerMap.values())
        .sort((a, b) => b.totalNfts - a.totalNfts);

      return {
        owners: sortedOwners,
        totalUniqueOwners: sortedOwners.length,
        totalContracts: contractsData.contracts.length
      };
    },
    enabled: !!contractsData?.contracts && contractsData.contracts.length > 0,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}