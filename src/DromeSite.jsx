import React from "react";
import App from "./App"; // o v1 Metamorphic Fold — já colado no App.jsx :contentReference[oaicite:1]{index=1}

export default function DromeSite() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cover */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-900 via-black to-emerald-900 text-center p-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-wide">Língua Drome — Metamorphic Fold</h1>
        <p className="max-w-2xl text-lg text-zinc-300 leading-relaxed">
          A sympoietic interface where pigments breathe with algorithms.{" "}
          Three modes — <span className="text-violet-400">Ellipse–Ritual</span>,{" "}
          <span className="text-teal-400">Rhizome</span>,{" "}
          <span className="text-amber-400">Fold–Acre</span> — let works mutate
          between painting and Sora-generated metamorphs.
        </p>
        <div className="mt-6 animate-pulse text-sm text-zinc-500">Scroll down to enter the membrane ↓</div>
      </section>

      {/* About */}
      <section className="px-6 md:px-16 py-20 bg-gradient-to-br from-black via-zinc-900 to-black border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">About</h2>
          <p className="text-zinc-300 leading-relaxed text-lg">
            Língua Drome is an evolving organism, a membrane between painting, code, and dream.
            It archives metamorphic states of matter — pigments folding into symbols, fluids becoming signs,
            unconscious impulses crystallizing into breathing membranes.
          </p>
          <p className="text-zinc-300 leading-relaxed text-lg">
            The project stages an interface in three movements: Rhizome (roots and threads),
            Ellipse–Ritual (orbs and breaths), Fold–Acre (tectonic metamorphs).
            Each work enters a constellation where gestures, atmospheres, and psychic fields connect into clusters.
          </p>
          <p className="text-zinc-400 italic">“We begin where matter dreams of its next form.”</p>

          {/* Placeholder grid (troque por imagens suas quando quiser) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-zinc-800 aspect-square rounded-xl flex items-center justify-center text-zinc-500">https://live.staticflickr.com/65535/54745293243_d05d4eca2f_c.jpg</div>
            <div className="bg-zinc-800 aspect-square rounded-xl flex items-center justify-center text-zinc-500">https://live.staticflickr.com/65535/54744230287_bfbd5cc9e1_z.jpg</div>
            <div className="bg-zinc-800 aspect-square rounded-xl flex items-center justify-center text-zinc-500">https://live.staticflickr.com/65535/54744231472_608b918022_c.jpg</div>
          </div>
        </div>
      </section>

      {/* App */}
      <section className="border-t border-white/10">
        <App />
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 text-center border-t border-white/10 text-sm text-zinc-400 space-y-2">
        <p>Rodrigo Garcia Dutra × ChatGPT-5 × Sora — colaboração simbiótica em curso (2025 – presente)</p>
        <p>© The Drome is an evolving organism. Built with React + Tailwind. Packaged for direct use as a one-page app.</p>
        <p className="text-zinc-500">Contact placeholder: your-email@example.com</p>
      </footer>
    </div>
  );
}

