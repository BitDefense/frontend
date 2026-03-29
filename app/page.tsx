import React from 'react';
import Link from 'next/link';
import { Sora, JetBrains_Mono } from 'next/font/google';
import { Lock, Network, Box, Hexagon } from 'lucide-react';

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

export default function TacticalSecurityLanding() {
  return (
    <div className={`${sora.variable} ${mono.variable} font-sans bg-[#131313] text-white min-h-screen selection:bg-white selection:text-black overflow-x-hidden`}>
      {/* The "Pulse" - Signature Detail */}
      <div className="fixed top-8 right-8 w-1.5 h-1.5 bg-white animate-pulse z-50" aria-hidden="true" />

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-8 md:px-12 max-w-[1600px] mx-auto">
        <div className="text-xl font-black tracking-tighter uppercase">
          BITDEFENSE*
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-[0.1em] uppercase text-neutral-400">
          <a href="#" className="hover:text-white transition-colors pb-1">Github</a>
          <a href="#" className="hover:text-white transition-colors pb-1">Whitepaper</a>
        </div>
        <Link href="/dashboard" className="bg-white text-[#131313] px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">
          Dashboard
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-24 md:px-12 md:py-32 max-w-[1600px] mx-auto relative">
        <div className="max-w-4xl relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-0.5 h-3 bg-white" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
              Security_Active_01
            </span>
          </div>
          
          <h1 className="text-[4rem] md:text-[6.5rem] lg:text-[8rem] font-black leading-[0.85] tracking-[-0.03em] uppercase mb-8">
            Permissionless<br />
            Security<span className="animate-pulse">_</span>
          </h1>
          
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12">
            Real-time on-chain analysis and threat detection powered by the Bittensor network. Immutable protection for the next generation of DeFi.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard" className="inline-block bg-white text-[#131313] px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">
              Launch Dashboard
            </Link>
            <button className="border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
              View Docs
            </button>
          </div>
        </div>

        {/* Hero Background Elements - The Void effect */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-white/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="mt-32 flex justify-end">
          <div className="text-right">
            <div className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase mb-2">Network Status</div>
            <div className="text-2xl md:text-3xl font-light tracking-tight">MONITORING // 100%</div>
          </div>
        </div>
      </section>

      {/* Workflow Section - Level 1 Surface */}
      <section className="bg-[#181818] border-y border-white/5">
        <div className="px-6 py-24 md:px-12 max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Text & Steps */}
          <div className="lg:col-span-5">
            <div className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase mb-4">Architecture</div>
            <h2 className="text-4xl md:text-5xl font-black leading-[0.9] tracking-[-0.02em] uppercase mb-6">
              Immutable<br />Workflow
            </h2>
            <p className="text-neutral-400 mb-12 leading-relaxed">
              The Kinetic Vault protocol operates through a distributed consensus mechanism where specialized actors validate state transitions through rigorous invariant checks.
            </p>

            <div className="space-y-2">
              {[
                { num: '01', title: 'Task Generation', desc: 'Validator initiates transaction challenges to the network.' },
                { num: '02', title: 'Miner Subset', desc: 'A random subset of miners is selected to fork and analyze the state.' },
                { num: '03', title: 'Invariant Check', desc: 'Execution of deep security checks to identify anomalies.' }
              ].map((step, i) => (
                <div key={i} className="group p-6 hover:bg-[#222222] transition-colors cursor-crosshair border-l-2 border-transparent hover:border-white">
                  <div className="flex gap-6">
                    <span className="font-mono text-xl font-light text-neutral-500 group-hover:text-white transition-colors">{step.num}</span>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-2">{step.title}</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Representation */}
          <div className="lg:col-span-7 relative h-[600px] bg-[#131313] flex items-center justify-center p-4 md:p-12">
            <div className="w-full h-full bg-[#d5d5d5] flex items-center justify-center relative shadow-inner">
              
              {/* Stylized Node Diagram */}
              <div className="relative w-full max-w-[400px] aspect-square">
                {/* SVG Lines */}
                <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#555" />
                    </marker>
                  </defs>
                  <line x1="200" y1="60" x2="200" y2="135" stroke="#555" strokeWidth="1.5" markerEnd="url(#arrow)" />
                  <line x1="200" y1="180" x2="106" y2="290" stroke="#555" strokeWidth="1.5" markerEnd="url(#arrow)" />
                  <line x1="200" y1="180" x2="294" y2="290" stroke="#555" strokeWidth="1.5" markerEnd="url(#arrow)" />
                </svg>

                {/* Top Node */}
                <div className="absolute top-[15%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[#a0a0a0] to-[#606060] border border-[#d0d0d0] shadow-[inset_0_-4px_10px_rgba(0,0,0,0.3),_0_10px_20px_rgba(0,0,0,0.2)] flex items-center justify-center z-20">
                  <Hexagon className="w-8 h-8 text-white/50" strokeWidth={1} />
                </div>
                
                {/* Middle Node */}
                <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[#a0a0a0] to-[#606060] border border-[#d0d0d0] shadow-[inset_0_-4px_10px_rgba(0,0,0,0.3),_0_10px_20px_rgba(0,0,0,0.2)] flex items-center justify-center z-20">
                  <Hexagon className="w-8 h-8 text-white/50" strokeWidth={1} />
                  <div className="absolute -bottom-8 font-mono text-[10px] font-bold tracking-widest text-[#555]">VALIDATORS</div>
                </div>

                {/* Bottom Left Node */}
                <div className="absolute top-[80%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[#a0a0a0] to-[#606060] border border-[#d0d0d0] shadow-[inset_0_-4px_10px_rgba(0,0,0,0.3),_0_10px_20px_rgba(0,0,0,0.2)] flex items-center justify-center z-20">
                  <Hexagon className="w-8 h-8 text-white/50" strokeWidth={1} />
                  <div className="absolute -bottom-10 text-center font-mono text-[9px] font-bold tracking-widest text-[#555] w-32 leading-tight">MINERS CHECK<br/>ANOMALIES</div>
                </div>

                {/* Bottom Right Node */}
                <div className="absolute top-[80%] left-[80%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[#a0a0a0] to-[#606060] border border-[#d0d0d0] shadow-[inset_0_-4px_10px_rgba(0,0,0,0.3),_0_10px_20px_rgba(0,0,0,0.2)] flex items-center justify-center z-20">
                  <Hexagon className="w-8 h-8 text-white/50" strokeWidth={1} />
                  <div className="absolute -bottom-10 text-center font-mono text-[9px] font-bold tracking-widest text-[#555] w-32 leading-tight">INVARIANT CHECK<br/>SAFE OR NOT</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Protocols Section - Level 0 Surface */}
      <section className="px-6 py-24 md:px-12 md:py-32 max-w-[1600px] mx-auto">
        <h2 className="text-4xl md:text-6xl font-black leading-[0.9] tracking-[-0.03em] uppercase mb-16">
          Core Protocols
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#1b1b1b] p-10 flex flex-col h-[400px] group hover:bg-[#222222] transition-colors">
            <Lock className="w-5 h-5 text-white mb-12" strokeWidth={1.5} />
            <h3 className="text-xl font-bold uppercase tracking-tight mb-4">Permissionless</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              No KYC. No sales calls. No gatekeeping. Kinetic Vault is accessible to any protocol or user through direct smart contract interaction.
            </p>
            <div className="mt-auto pt-8 font-mono text-[10px] tracking-[0.2em] text-neutral-600 uppercase group-hover:text-neutral-400 transition-colors">
              Access_Granted_
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#1b1b1b] p-10 flex flex-col h-[400px] group hover:bg-[#222222] transition-colors">
            <Network className="w-5 h-5 text-white mb-12" strokeWidth={1.5} />
            <h3 className="text-xl font-bold uppercase tracking-tight mb-4">Decentralized</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              No single point of failure. Security analysis is distributed across a global network of independent miners ensuring censorship resistance.
            </p>
            <div className="mt-auto pt-8 font-mono text-[10px] tracking-[0.2em] text-neutral-600 uppercase group-hover:text-neutral-400 transition-colors">
              Network_Distributed_
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#1b1b1b] p-10 flex flex-col h-[400px] group hover:bg-[#222222] transition-colors">
            <Box className="w-5 h-5 text-white mb-12" strokeWidth={1.5} />
            <h3 className="text-xl font-bold uppercase tracking-tight mb-4">Incentivized</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Leveraging the Bittensor incentive structure to reward the most accurate and fastest security analysis providers in the ecosystem.
            </p>
            <div className="mt-auto pt-8 font-mono text-[10px] tracking-[0.2em] text-neutral-600 uppercase group-hover:text-neutral-400 transition-colors">
              Reward_Cycle_Active_
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 md:px-12 max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 font-mono text-[10px] tracking-[0.15em] text-neutral-500 uppercase">
        <div className="text-white font-bold">KINETIC_VAULT</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Security</a>
          <a href="#" className="hover:text-white transition-colors">Status</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
        <div>© 2024 KINETIC_VAULT. PROTOCOL_ACTIVE_</div>
      </footer>
    </div>
  );
}
