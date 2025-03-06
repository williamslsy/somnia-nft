'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';

export function Header() {
  return (
    <header className="w-full bg-background">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link href="/" className="text-primary text-2xl font-bold">
          <Logo width={100} height={100} />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground text-base font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/mint" className="text-foreground text-base font-medium hover:text-primary transition-colors">
            Mint
          </Link>
          <Link href="/gallery" className="text-foreground text-base font-medium hover:text-primary transition-colors">
            Gallery
          </Link>
        </div>

        <div className="relative hidden md:block">
          <div className="flex items-center rounded-full border border-input bg-background px-4 py-2">
            <input type="text" placeholder="Search" className="w-64 bg-transparent outline-none text-base text-foreground placeholder-muted-foreground" />
            <Search className="ml-2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ConnectButton />
        </div>
      </div>
      <div className="border-b border-border w-full"></div>
    </header>
  );
}
