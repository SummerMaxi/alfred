import { NftContracts } from '@/components/nft-contracts';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Alfred</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Your NFT contract deployment dashboard. Connect your wallet to view and manage the NFT contracts you've deployed.
        </p>
      </div>

      <NftContracts />
    </div>
  );
}
