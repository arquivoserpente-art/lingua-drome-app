import React from "react";
import App from "./App";

// dispara um evento global p/ o App mudar de fase e rola até o App
function jumpToAppAndSetPhase(phase) {
  try {
    window.dispatchEvent(new CustomEvent("drome:setPhase", { detail: phase }));
    const el = document.getElementById("drome-app-anchor");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch {}
}

export default function DromeSite() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cover */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-900/40 via-black to-emerald-900/40 text-center p-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-wide">
          Língua Drome — Metamorphic Fold
        </h1>
        <p className="max-w-2xl text-lg text-zinc-300 leading-relaxed">
          A sympoietic interface where pigments breathe with algorithms. Three modes —{" "}
          <span className="text-teal-300">Rhizome</span>,{" "}
          <span className="text-violet-300">Ellipse–Ritual</span>,{" "}
          <span className="text-amber-300">Fold–Acre</span> — let works mutate
          between painting and Sora-generated metamorphs.
        </p>
        <div className="mt-6 animate-pulse text-sm text-zinc-500">
          Scroll down to enter the membrane ↓
        </div>
      </section>

      {/* About */}
      <section className="px-6 md:px-16 py-20 bg-gradient-to-br from-black via-zinc-900 to-black border-t border-white/10">
        <div className="max-w-5xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">About</h2>
          <p className="text-zinc-300 leading-relaxed text-lg">
            Língua Drome is an evolving organism, a membrane between painting, code, and dream.
            It archives metamorphic states of matter — pigments folding into symbols, fluids becoming signs,
            unconscious impulses crystallizing into breathing membranes.
          </p>
          <p className="text-zinc-300 leading-relaxed text-lg">
            The project stages an interface in three movements: Rhizome (roots and threads),
            Ellipse–Ritual (orbs and breaths), Fold–Acre (tectonic metamorphs). Each work enters a constellation
            where gestures, atmospheres, and psychic fields connect into clusters.
          </p>
          <p className="text-zinc-400 italic">
            “We begin where matter dreams of its next form.”
          </p>

          {/* Tríptico — PORTAIS CLICÁVEIS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <button onClick={() => jumpToAppAndSetPhase("rhizome")} className="group relative rounded-xl overflow-hidden">
              <img
                src="https://arquivoserpente.wordpress.com/wp-content/uploads/2025/08/fase_dobra_acre.png"  /* troque para sua URL ou /cover1.jpg */
                alt="Língua Drome — Rhizome / Root"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
              <span className="absolute bottom-2 right-2 text-[12px] px-2 py-1 rounded bg-black/60">Rhizome</span>
            </button>

            <button onClick={() => jumpToAppAndSetPhase("ellipse")} className="group relative rounded-xl overflow-hidden">
              <img
                src="https://arquivoserpente.wordpress.com/wp-content/uploads/2025/08/dobra_acre.png"  /* troque para sua URL ou /cover2.jpg */
                alt="Língua Drome — Ellipse / Ritual"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
              <span className="absolute bottom-2 right-2 text-[12px] px-2 py-1 rounded bg-black/60">Ellipse–Ritual</span>
            </button>

            <button onClick={() => jumpToAppAndSetPhase("fold")} className="group relative rounded-xl overflow-hidden">
              <img
                src="https://arquivoserpente.wordpress.com/wp-content/uploads/2025/08/captura-de-ecra-1915.png"  /* troque para sua URL ou /cover3.jpg */
                alt="Língua Drome — Fold / Acre"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
              <span className="absolute bottom-2 right-2 text-[12px] px-2 py-1 rounded bg-black/60">Fold–Acre</span>
            </button>
          </div>
        </div>
      </section>

      {/* App */}
      <section id="drome-app-anchor" className="border-t border-white/10">
        <App />
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 text-center border-t border-white/10 text-sm text-zinc-400 space-y-2">
        <p>Rodrigo Garcia Dutra × ChatGPT-5 × Sora — colaboração simbiótica em curso (2025 – presente)</p>
        <p>© The Drome is an evolving organism. Built with React + Tailwind. Packaged as a one-page app.</p>
      </footer>
    </div>
  );
}
