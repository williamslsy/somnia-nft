'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 100, height = 100, className }: LogoProps) {
  return <Image src="/assets/somnialogo.svg" alt="Somnia logo" width={width} height={height} className={cn('', className)} />;
}
