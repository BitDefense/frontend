import Link from 'next/link';

export function Navigation() {
  return (
    <nav className="flex items-center justify-between px-6 py-8 md:px-12 max-w-[1600px] mx-auto">
      <Link href="/" className="text-xl font-black tracking-tighter uppercase">
        BITDEFENSE*
      </Link>
      <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-[0.1em] uppercase text-neutral-400">
        <a href="https://github.com/BitDefense/subnet" className="hover:text-white transition-colors pb-1">Github</a>
        <a href="https://bitdefense.notion.site/BitDefense-3020a3843e7c8040ad5eeb195f9f6c79" className="hover:text-white transition-colors pb-1">Whitepaper</a>
      </div>
      <button 
        disabled 
        className="bg-neutral-800 text-neutral-500 px-6 py-2.5 text-xs font-bold uppercase tracking-widest cursor-not-allowed group relative overflow-hidden"
      >
        <span className="group-hover:opacity-0 transition-opacity">Dashboard</span>
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">Soon</span>
      </button>
    </nav>
  );
}
