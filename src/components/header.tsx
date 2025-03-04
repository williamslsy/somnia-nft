'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Search } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="w-full bg-background">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link href="/" className="text-primary text-2xl font-bold">
          somnia
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/marketplace" className="text-foreground text-base font-medium hover:text-primary transition-colors">
            Marketplace
          </Link>
          <Link href="/resource" className="text-foreground text-base font-medium hover:text-primary transition-colors">
            Resource
          </Link>
          <Link href="/about" className="text-foreground text-base font-medium hover:text-primary transition-colors">
            About
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
