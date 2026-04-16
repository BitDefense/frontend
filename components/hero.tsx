export function Hero() {
  return (
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
          <button 
            disabled 
            className="inline-block bg-neutral-800 text-neutral-500 px-8 py-4 text-sm font-bold uppercase tracking-widest cursor-not-allowed group relative overflow-hidden min-w-[200px]"
          >
            <span className="group-hover:opacity-0 transition-opacity">Launch Dashboard</span>
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">Soon</span>
          </button>
          <a 
            href="https://bitdefense.notion.site/BitDefense-3020a3843e7c8040ad5eeb195f9f6c79"
            className="border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white/5 transition-colors inline-block"
          >
            View Docs
          </a>
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
  );
}
