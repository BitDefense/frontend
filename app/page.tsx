import React from 'react';
import { Sora, JetBrains_Mono } from 'next/font/google';
import { Navigation } from '@/components/navigation';
import { Hero } from '@/components/hero';
import { Workflow } from '@/components/workflow';
import { Protocols } from '@/components/protocols';
import { Footer } from '@/components/footer';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// Hoist static elements
const Pulse = () => (
  <div className="fixed top-8 right-8 w-1.5 h-1.5 bg-white animate-pulse z-50" aria-hidden="true" />
);

export default function TacticalSecurityLanding() {
  return (
    <div className={`${sora.variable} ${mono.variable} font-sans bg-[#131313] text-white min-h-screen selection:bg-white selection:text-black overflow-x-hidden`}>
      <Pulse />
      <Navigation />
      <Hero />
      <Workflow />
      <Protocols />
      <Footer />
    </div>
  );
}
