'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, Search, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { useState, useEffect } from 'react';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const getLinkClass = (path: string) => {
    return `text-base font-medium transition-colors ${isActive(path) ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`;
  };

  return (
    <header className="w-full bg-background relative">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link href="/" className="text-primary text-2xl font-bold z-20">
          <Logo width={100} height={100} />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={getLinkClass('/')}>
            Home
          </Link>
          <Link href="/mint" className={getLinkClass('/mint')}>
            Mint
          </Link>
          <Link href="/gallery" className={getLinkClass('/gallery')}>
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
          <ConnectButton
            chainStatus={{
              smallScreen: 'none',
              largeScreen: 'full',
            }}
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
            showBalance={{
              smallScreen: false,
              largeScreen: false,
            }}
          />

          <button className="md:hidden z-50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 md:hidden flex flex-col">
          <div className="flex-1 pt-20 px-4 overflow-y-auto">
            <div className="flex flex-col items-center gap-8 py-8">
              <Link href="/" className={`text-xl ${getLinkClass('/')}`} onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/mint" className={`text-xl ${getLinkClass('/mint')}`} onClick={() => setMobileMenuOpen(false)}>
                Mint
              </Link>
              <Link href="/gallery" className={`text-xl ${getLinkClass('/gallery')}`} onClick={() => setMobileMenuOpen(false)}>
                Gallery
              </Link>

              <div className="w-full max-w-md mt-4">
                <div className="flex items-center rounded-full border border-input bg-background px-4 py-3">
                  <input type="text" placeholder="Search" className="w-full bg-transparent outline-none text-base text-foreground placeholder-muted-foreground" />
                  <Search className="ml-2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-border w-full"></div>
    </header>
  );
}
