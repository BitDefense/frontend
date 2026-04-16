export function VideoDemo() {
  return (
    <section className="px-6 py-24 md:px-12 max-w-[1600px] mx-auto border-t border-white/5">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-black leading-[0.9] tracking-[-0.02em] uppercase mb-12">
          How to setup Defense Workflow<br />
          <span className="text-neutral-500">within 5 minutes for Your DeFi project</span>
        </h2>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-[#181818] shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/m14GNGTmO7E?si=2Jag0l1v-BoRI4Hl"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
