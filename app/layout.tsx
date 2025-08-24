import { Providers } from '@/components/providers';
import { ThemeToggle } from '@/components/theme-toggle';
import { WalletConnect } from '@/components/wallet-connect';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'MintShare.fun - NFT Analytics & Marketplace',
    template: '%s | MintShare.fun',
  },
  description:
    'MintShare.fun - Your personal NFT marketplace and analytics platform powered by Alfred AI. Analyze collections, discover artists, and share mint opportunities across multiple chains.',
  keywords: [
    'web3',
    'blockchain',
    'dapp',
    'decentralized applications',
    'shape network',
    'ethereum',
    'wagmi',
    'nft',
    'rainbowkit',
    'nextjs',
    'typescript',
    'tailwind',
    'dashboard',
    'collection',
    'smart contracts',
    'wallet connect',
  ],
  metadataBase: new URL('https://mintshare.fun'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mintshare.fun',
    title: 'MintShare.fun - NFT Analytics & Marketplace',
    description:
      'MintShare.fun - Your personal NFT marketplace and analytics platform powered by Alfred AI. Analyze collections, discover artists, and share mint opportunities across multiple chains.',
    siteName: 'MintShare.fun',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MintShare.fun - NFT Analytics & Marketplace',
    description:
      'Your personal NFT marketplace and analytics platform powered by Alfred AI. Analyze collections, discover artists, and share mint opportunities.',
    site: '@Shape_L2',
    creator: '@Shape_L2',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="bg-background min-h-screen font-[family-name:var(--font-geist-sans)]">
            <header className="border-b">
              <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center">
                  <h1 className="text-2xl font-bold">MintShare</h1>
                </Link>
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <WalletConnect />
                </div>
              </div>
            </header>

            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
