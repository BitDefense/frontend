'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Search, Radio, Terminal, ZoomIn, ZoomOut, Maximize, Play } from 'lucide-react';
import { Sora, JetBrains_Mono } from 'next/font/google';
import { api } from '@/lib/api';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

// Dynamic import for the heavy FlowCanvas component
const FlowCanvas = dynamic(() => import('@/components/flow-canvas').then(mod => mod.FlowCanvas), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#131313] flex items-center justify-center font-mono text-[10px] tracking-widest text-white/20 uppercase">Initializing_Protocol...</div>
});

// Hoist static sub-components
const DashboardHeader = () => (
  <header className="fixed top-0 left-0 right-0 z-50 p-8 pointer-events-none flex justify-between items-start">
    <div className="pointer-events-auto flex flex-col gap-1">
      <Link href="/" className="text-2xl font-bold tracking-tighter text-white uppercase">BITDEFENSE*</Link>
    </div>
    <div className="flex items-center gap-6 pointer-events-auto">
      <div className="flex items-center bg-[#1b1b1b]/80 backdrop-blur-md border border-white/10 px-4 py-2 gap-3">
        <Search className="w-4 h-4 text-[#919191]" />
        <input className="bg-transparent border-none focus:outline-none focus:ring-0 text-[10px] font-mono uppercase tracking-[0.2em] w-40 placeholder:text-gray-600 p-0 text-white" placeholder="QUERY_SYSTEM..." type="text" />
      </div>
      <div className="flex items-center gap-1">
        <button className="w-10 h-10 flex items-center justify-center bg-[#1b1b1b]/80 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
          <Radio className="w-4 h-4 text-white" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center bg-[#1b1b1b]/80 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
          <Terminal className="w-4 h-4 text-white" />
        </button>
        <div className="w-10 h-10 bg-[#1b1b1b]/80 backdrop-blur-md border border-white/10 p-1 relative">
          <Image
            alt="Security Operator"
            fill
            className="object-cover grayscale"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF0lvmAkNSJGbFMg09zSc_G0lUNcdw7Gv5I_YPUwLcksTXtjV7-xWTPiRvGZqNqnsF2CfcZPBCtpEkIlzE-XKYGKmYyw9WuGpsyxtDhv5bfssMBxcqDKSh0u3P_p8bmpia8wqq5B_Sx_7-KCicykpsX8orS11FrEjRI_hkK_0JyW7uOWdl42OdbLNQjl6waatLwpkBz2shvY3VJiTK_Etbyi5DlNRV47Q1Uo6A4O-ManJDGYseQalD-lUzzTQx0KFnrD9shpX3OPAG"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  </header>
);

const DashboardFooter = () => (
  <div className="fixed bottom-0 left-0 right-0 z-50 p-8 flex justify-between items-end pointer-events-none">
    <div className="flex items-center gap-2 pointer-events-auto">
      <div className="bg-[#1b1b1b]/80 backdrop-blur-md border border-white/10 p-1 flex items-center">
        <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ZoomIn className="w-4 h-4 text-white" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ZoomOut className="w-4 h-4 text-white" />
        </button>
        <div className="w-px h-6 bg-white/10 mx-2" />
        <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <Maximize className="w-4 h-4 text-white" />
        </button>
      </div>
      {/* <button className="pointer-events-auto bg-white text-black h-12 px-8 flex items-center gap-3 hover:bg-white/90 active:scale-95 transition-all">
        <Play className="w-3 h-3 fill-black" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Execute Flow</span>
      </button> */}
    </div>
    {/* <div className="flex flex-col items-end gap-2 pointer-events-auto text-[10px] uppercase tracking-[0.2em]">
      <div className="flex items-center gap-6 text-gray-400">
        <span>© 2024 TACTICAL_VAULT_SECURITY_PROTOCOL</span>
        <span className="text-white">V2.0.4-LATEST</span>
      </div>
      <div className="flex items-center gap-3 text-[#919191]">
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        Status: <span className="text-white">Encrypted</span>
      </div>
    </div> */}
  </div>
);

export default function Dashboard() {
  useEffect(() => {
    async function init() {
      try {
        await api.getDashboard(1);
        console.log('Dashboard 1 loaded');
      } catch (e: any) {
        if (e.message === 'NOT_FOUND') {
          try {
            await api.createDashboard({ name: 'Default Dashboard' });
            console.log('Dashboard 1 created');
          } catch (createError) {
            console.error('Failed to create dashboard:', createError);
          }
        } else {
          console.error('Failed to load dashboard:', e);
        }
      }
    }
    init();
  }, []);

  return (
    <div className={`${sora.variable} ${mono.variable} font-sans bg-[#131313] text-[#e2e2e2] h-screen w-full overflow-hidden selection:bg-white selection:text-black`}>
      <FlowCanvas />
      <DashboardHeader />
      <DashboardFooter />
    </div>
  );
}
