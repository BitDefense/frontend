import { Hexagon } from 'lucide-react';

export function Workflow() {
  const steps = [
    { num: '01', title: 'Task Generation', desc: 'Validator initiates transaction challenges to the network.' },
    { num: '02', title: 'Miner Subset', desc: 'A random subset of miners is selected to fork and analyze the state.' },
    { num: '03', title: 'Invariant Check', desc: 'Execution of deep security checks to identify anomalies.' }
  ];

  return (
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
  );
}
