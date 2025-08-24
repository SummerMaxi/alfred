export interface NFTCollector {
  ownerAddress: string;
  totalNfts: number;
  contractsOwned: {
    contractAddress: string;
    contractName: string;
    nftCount: number;
    chain: string;
  }[];
}

export interface NFTContract {
  address: string;
  name: string;
  symbol: string;
  chain: string;
  totalSupply?: number;
  opensea?: {
    collectionName?: string;
    description?: string;
    imageUrl?: string;
  };
}

export function exportCollectorsToCSV(collectors: NFTCollector[], filename: string = 'nft-collectors.csv') {
  const csvRows = [
    // Header
    'Rank,Owner Address,Total NFTs,Contracts Owned,Contract Names,Chains'
  ];

  collectors.forEach((collector, index) => {
    const contractNames = collector.contractsOwned.map(c => c.contractName).join(';');
    const chains = collector.contractsOwned.map(c => c.chain).join(';');
    
    csvRows.push(`${index + 1},"${collector.ownerAddress}",${collector.totalNfts},${collector.contractsOwned.length},"${contractNames}","${chains}"`);
  });

  downloadCSV(csvRows.join('\n'), filename);
}

export function exportContractsToCSV(contracts: Array<{
  address: string;
  name: string;
  symbol: string;
  chain: string;
  totalSupply?: string | number;
  opensea?: {
    collectionName?: string;
    description?: string;
  };
}>, filename: string = 'nft-contracts.csv') {
  const csvRows = [
    // Header
    'Contract Address,Name,Symbol,Chain,Total Supply,Collection Name,Description'
  ];

  contracts.forEach((contract) => {
    const collectionName = contract.opensea?.collectionName || '';
    const description = contract.opensea?.description || '';
    const totalSupply = typeof contract.totalSupply === 'number' 
      ? contract.totalSupply 
      : parseInt(contract.totalSupply || '0') || 0;
    
    csvRows.push(`"${contract.address}","${contract.name}","${contract.symbol}","${contract.chain}",${totalSupply},"${collectionName}","${description.replace(/"/g, '""')}"`);
  });

  downloadCSV(csvRows.join('\n'), filename);
}

export function exportDetailedCollectorsToCSV(collectors: NFTCollector[], filename: string = 'detailed-collectors.csv') {
  const csvRows = [
    // Header
    'Owner Address,Contract Address,Contract Name,Chain,NFTs Owned,Total NFTs,Rank'
  ];

  collectors.forEach((collector, collectorIndex) => {
    collector.contractsOwned.forEach((contract) => {
      csvRows.push(`"${collector.ownerAddress}","${contract.contractAddress}","${contract.contractName}","${contract.chain}",${contract.nftCount},${collector.totalNfts},${collectorIndex + 1}`);
    });
  });

  downloadCSV(csvRows.join('\n'), filename);
}

function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}