'use client';

import { useQuery } from '@tanstack/react-query';
import { useOwnedNftContracts } from './use-owned-nft-contracts';

interface DeployerInfo {
  deployerAddress: string;
  contractsDeployed: {
    contractAddress: string;
    contractName: string;
    chain: string;
    totalSupply: string;
    tokenType: string;
  }[];
  totalContracts: number;
  totalSupplyAcrossContracts: number;
}

interface DeployersResponse {
  deployers: DeployerInfo[];
  totalUniqueDeployers: number;
}

export function useDeployersLeaderboard() {
  const { data: ownedContractsData } = useOwnedNftContracts();

  return useQuery({
    queryKey: ['deployers-leaderboard', ownedContractsData?.contracts?.map(c => c.address).join(',')],
    queryFn: async (): Promise<DeployersResponse> => {
      if (!ownedContractsData?.contracts || ownedContractsData.contracts.length === 0) {
        return { deployers: [], totalUniqueDeployers: 0 };
      }

      // Group contracts by deployer
      const deployerMap = new Map<string, DeployerInfo>();

      ownedContractsData.contracts.forEach(contract => {
        if (!deployerMap.has(contract.contractDeployer)) {
          deployerMap.set(contract.contractDeployer, {
            deployerAddress: contract.contractDeployer,
            contractsDeployed: [],
            totalContracts: 0,
            totalSupplyAcrossContracts: 0
          });
        }

        const deployer = deployerMap.get(contract.contractDeployer)!;
        deployer.contractsDeployed.push({
          contractAddress: contract.address,
          contractName: contract.opensea?.collectionName || contract.name || 'Unknown',
          chain: contract.chain,
          totalSupply: contract.totalSupply,
          tokenType: contract.tokenType
        });
        deployer.totalContracts += 1;
        deployer.totalSupplyAcrossContracts += parseInt(contract.totalSupply || '0');
      });

      // Sort deployers by number of contracts deployed (that you own from)
      const sortedDeployers = Array.from(deployerMap.values())
        .sort((a, b) => {
          // Primary sort: number of contracts
          if (b.totalContracts !== a.totalContracts) {
            return b.totalContracts - a.totalContracts;
          }
          // Secondary sort: total supply across contracts
          return b.totalSupplyAcrossContracts - a.totalSupplyAcrossContracts;
        });

      return {
        deployers: sortedDeployers,
        totalUniqueDeployers: sortedDeployers.length
      };
    },
    enabled: !!ownedContractsData?.contracts && ownedContractsData.contracts.length > 0,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}