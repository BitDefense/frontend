import Link from 'next/link';

export function Navigation() {
  return (
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
  );
}
