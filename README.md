# MintShare.fun

Your distinguished personal NFT marketplace and analytics platform. Powered by Alfred, your AI NFT connoisseur and blockchain butler, MintShare.fun provides detailed insights for both collectors and artists across multiple blockchain networks.

🎬 **Watch Demo**: [MintShare.fun Screen Recording](https://www.youtube.com/watch?v=0tvpxF7sjMQ)

See deployed website: [mintshare.fun](https://mintshare.fun)

## ✨ Features

### 🤖 Alfred AI Chat Assistant
- **Personal NFT Connoisseur**: Powered by Claude AI with Alfred Pennyworth persona
- **Intelligent Analytics**: Get insights about your NFT collections, market trends, and collector patterns
- **Natural Language Queries**: Ask questions like "Show me my top 10 collectors" or "Analyze my deployment history"
- **Contextual Responses**: Alfred knows your complete NFT ecosystem and provides personalized insights

### 🎨 Dual Interface Modes
- **Alfred Mode**: AI-powered chat interface for intelligent NFT analysis
- **Manual Mode**: Traditional dashboard with detailed tables and export options

### 🌐 Multi-Chain Support
- **Ethereum**: Full NFT contract deployment and ownership data
- **Base**: Complete NFT analytics and leaderboards
- **Shape Network**: NFT ownership tracking (deployment data limited by API)

### 📊 Comprehensive NFT Analytics
- **Artist Dashboard**: View contracts you've deployed across all supported chains
- **Collector Dashboard**: See NFT contracts where you own tokens
- **Leaderboards**: Top collectors and contract deployers
- **Export Options**: Download data as CSV (collectors, detailed collectors, contracts)

### 🔗 Advanced Features
- **Manual Address Analysis**: Analyze any wallet address without connecting
- **ENS Name Resolution**: Personalized experience with ENS names
- **Real-time Data**: Live NFT data from Alchemy API
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/SummerMaxi/alfred.git
   cd alfred
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file with the following variables:

   ```bash
   # Required: Alchemy API Key for NFT data
   NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_api_key

   # Required: WalletConnect Project ID
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id

   # Required: Claude AI API Key for Alfred chat
   ANTHROPIC_API_KEY=your_anthropic_api_key

   # Optional: Chain ID (360 for Shape Mainnet, 11011 for Shape Testnet)
   NEXT_PUBLIC_CHAIN_ID=360
   ```

4. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Technical Stack

- **Next.js 15** with App Router and React 19
- **TypeScript** for type safety
- **Tailwind CSS** with dark mode support
- **Shadcn/ui** for beautiful, accessible components
- **Wagmi v2** and **RainbowKit** for Web3 integration
- **React Query** for efficient data fetching
- **Claude AI (Anthropic)** for intelligent NFT analysis
- **Alchemy SDK** for blockchain data

## 📋 API Limitations & Known Issues

### Shape Network Limitations
⚠️ **Important Note**: Shape Network contracts may not appear in the Artist Dashboard due to Alchemy API limitations.

- **Issue**: Alchemy's `getContractsForOwner` API returns `null` for the `contractDeployer` field on Shape Network
- **Impact**: Cannot filter contracts deployed by specific addresses on Shape
- **Status**: This is an API limitation, not a bug in Alfred
- **Workaround**: Ethereum and Base networks work perfectly for deployed contract tracking

## 🎯 How Alfred Works

### 1. Connect Your Wallet or Enter Manual Address
- Connect using any wallet supported by RainbowKit
- Or enter any wallet address manually for analysis

### 2. Choose Your Mode
- **Alfred Mode**: Chat with your AI NFT butler for insights and analysis
- **Manual Mode**: Browse traditional dashboard with tables and export options

### 3. Toggle Artist/Collector View
- **Artist Mode**: Focus on contracts you've deployed
- **Collector Mode**: Focus on NFTs you own and collect

### 4. Get Insights
- Ask Alfred questions about your NFT portfolio
- Export detailed analytics as CSV files
- View leaderboards and market insights

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🗂️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/
│   │   └── chat/          # Alfred AI chat endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main dashboard
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── autonomous-interface.tsx    # Alfred chat interface
│   ├── contract-list.tsx          # Artist contracts display
│   ├── owned-contracts-list.tsx   # Collector NFTs display
│   ├── aggregated-leaderboard.tsx # Top collectors
│   ├── deployers-leaderboard.tsx  # Top deployers
│   └── ...               # Other components
├── hooks/                 # Custom React hooks
│   ├── use-nft-contracts.ts      # Deployed contracts data
│   ├── use-owned-nft-contracts.ts # Owned NFTs data
│   ├── use-all-nft-owners.ts     # Collector analytics
│   ├── use-effective-address.ts  # Manual address support
│   └── ...               # Other hooks
├── contexts/             # React contexts
│   ├── mode-context.tsx           # Artist/Collector toggle
│   ├── interface-mode-context.tsx # Alfred/Manual toggle
│   └── manual-address-context.tsx # Manual address handling
├── lib/                  # Utilities
│   ├── csv-export.ts     # CSV export functionality
│   └── ...              # Other utilities
└── types/               # TypeScript type definitions
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_ALCHEMY_KEY`
   - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
   - `ANTHROPIC_API_KEY`
4. Deploy!

## 🔮 Future Roadmap

MintShare.fun is continuously evolving to become the ultimate NFT ecosystem platform. Here's what's coming next:

### 🎨 NFT Mint Sharing Platform
- **Collaborative Minting**: Enable collectors and artists to co-create and mint NFTs
- **Data-Driven Collections**: Use MintShare's analytics to inform new NFT collection strategies
- **Community Curation**: Leverage collector insights to guide artistic direction

### 🔍 AI-Powered Artist Discovery
- **Talent Scouting**: Use MintShare's vast collector and market data to identify emerging artists
- **Predictive Analytics**: Forecast which artists and styles are gaining traction
- **Collector-Artist Matching**: Connect collectors with artists based on preference patterns
- **Market Opportunity Identification**: Spot undervalued artists before they break out

### 📈 Trending Analytics Platform
- **Trending Collectors**: Track and showcase collectors who are actively acquiring specific NFT types
- **Trending Artists**: Identify artists gaining momentum across different NFT categories
- **NFT Type Trends**: Analyze trends for various NFT types (Art, PFPs, Gaming, Music, Photography, etc.)
- **Real-time Trend Detection**: Monitor emerging trends across all supported blockchain networks

### 📈 Advanced Analytics & Insights
- **Market Trend Prediction**: Anticipate NFT market movements using historical data
- **Portfolio Optimization**: Suggest collection improvements for both artists and collectors
- **Investment Scoring**: Rate NFT investments based on artist performance and collector behavior

### 🤝 Marketplace Integration
- **Direct Trading**: Enable NFT transactions within the MintShare platform
- **Smart Contracts**: Automated royalty distribution and revenue sharing
- **Cross-Chain Bridging**: Seamless NFT transfers between supported networks

Stay tuned as MintShare.fun transforms from analytics platform to complete NFT ecosystem orchestrator!

## 👥 Team

### SummerMaxi - Founder & Lead Developer
- **Discord**: `summermaxi`
- **Twitter**: [@summermaxis](https://twitter.com/summermaxis)
- Visionary behind MintShare.fun and Alfred AI integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/SummerMaxi/alfred/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SummerMaxi/alfred/discussions)
- **Shape Discord**: [discord.com/invite/shape-l2](http://discord.com/invite/shape-l2)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shape Network** for blockchain infrastructure
- **Alchemy** for NFT API services
- **Anthropic** for Claude AI capabilities
- **Vercel** for hosting and deployment
- **Open source community** for amazing tools and libraries

---

*"Good day, Master. I am Alfred, your personal blockchain assistant. How may I assist with your NFT empire today?"* 🎩