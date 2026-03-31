import Image from 'next/image';
import { Hexagon } from 'lucide-react';

export function Workflow() {
  const steps = [
    { num: '01', title: 'Orchestration', desc: 'Validators generate tasks from on-chain challenges. Subsets of miners are selected via decentralized hashing protocols.' },
    { num: '02', title: 'Execution', desc: 'Miners execute invariant checks on forked state in isolated VMs, verifying logic and detecting anomalies instantly.' },
    { num: '03', title: 'Consensus', desc: 'Tasks require a 66% threshold for validation. Malicious actors are slashed; successful miners earn Bittensor incentives.' },
    { num: '04', title: 'Defense Action', desc: 'Upon consensus, automated defense protocols trigger protocol pauses or front-running prevention to secure funds.' }
  ];

  return (
    <section className="bg-[#181818] border-y border-white/5">
      <div className="px-6 py-24 md:px-12 max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-16 items-center">

        {/* Left Column: Text & Steps */}
        <div className="lg:col-span-5">
          {/* <div className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase mb-4">Architecture</div> */}
          <h2 className="text-4xl md:text-5xl font-black leading-[0.9] tracking-[-0.02em] uppercase mb-6">
            How It Works
          </h2>
          <p className="text-neutral-400 mb-12 leading-relaxed">
            BitDefense operates as an autonomous security layer. Our decentralized intelligence flow ensures zero latency and absolute reliability.
          </p>

          <div className="space-y-2">
            {steps.map((step, i) => (
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
        <div className="lg:col-span-7">
          <div className="w-full relative aspect-[3999/2133] overflow-hidden rounded-2xl border border-white/5 bg-[#131313] shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image 
              src="/workflow.png" 
              alt="BitDefense Workflow Architecture"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
