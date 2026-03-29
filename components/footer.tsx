export function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-8 md:px-12 max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 font-mono text-[10px] tracking-[0.15em] text-neutral-500 uppercase">
      <div className="text-white font-bold">KINETIC_VAULT</div>
      <div className="flex gap-8">
        <a href="#" className="hover:text-white transition-colors">Security</a>
        <a href="#" className="hover:text-white transition-colors">Status</a>
        <a href="#" className="hover:text-white transition-colors">Terms</a>
      </div>
      <div>© 2024 KINETIC_VAULT. PROTOCOL_ACTIVE_</div>
    </footer>
  );
}
