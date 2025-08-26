/*
LÍNGUA DROME — v1.0 “Metamorphic Fold”
App principal em React (JS) — sem TypeScript.
Três modos (Rhizome / Ellipse–Ritual / Fold–Acre), drag & drop local,
Drome Console (prompt Sora), Export Catalog.md, Save/Load JSON, créditos.
Com feedback visual (toast) e exibição do prompt por asset.
*/

import React, { useEffect, useMemo, useRef, useState } from "react";

// ---------- Constantes ----------
const PHASES = [
  { key: "rhizome", label: "Rhizome / Root" },
  { key: "ellipse", label: "Ellipse / Ritual" },
  { key: "fold", label: "Fold / Acre" },
];

const DEFAULT_TOKENS = {
  material: ["mineral pigments", "wet soil + acrylic", "paint-splattered surface", "wooden panel", "dry oil crust"],
  colors: ["violet, turquoise, gold, emerald", "pastel blues + prismatic light", "ochres + ultramarine"],
  gesture: ["mesh of threads", "elliptical breathing", "rhizome expansion", "specular brightness", "ritual dust"],
  atmosphere: ["dreamlike, alchemical", "minimal, meditative, suspended", "organic + digital, translucent membranes"],
  psychic: ["unconscious", "desire", "erotic", "trance", "melancholic joy"],
};

const CREDIT_EN =
  "Rodrigo Garcia Dutra in collaboration with Multimodal Large Language Model ChatGPT-5 through prompts, conversations and dreams.";
const CREDIT_PT =
  "Rodrigo Garcia Dutra em colaboração com Largo Modelo de Linguagem Multimodal ChatGPT-5 através de prompts, conversas e sonhos.";

// ---------- Helpers ----------
const uid = () => Math.random().toString(36).slice(2);
const classNames = (...xs) => xs.filter(Boolean).join(" ");
function downloadFile(filename, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------- App ----------
export default function App() {
  const [phase, setPhase] = useState("ellipse");
  const [assets, setAssets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const selected = useMemo(() => assets.find((a) => a.id === selectedId) || null, [assets, selectedId]);

  const [tokens, setTokens] = useState(DEFAULT_TOKENS);
  const [customLine, setCustomLine] = useState("— between geology and the psychology of the unconscious; breathing, pulsating transitions");
  const [composed, setComposed] = useState("");

  // --- Toast (feedback visual) ---
  const [toast, setToast] = useState({ open: false, text: "" });
  function showToast(text) {
    setToast({ open: true, text });
    setTimeout(() => setToast({ open: false, text: "" }), 1600);
  }

  // Persistência local
  useEffect(() => {
    const saved = localStorage.getItem("drome_project_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.assets) setAssets(parsed.assets);
        if (parsed.tokens) setTokens(parsed.tokens);
      } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("drome_project_v1", JSON.stringify({ assets, tokens }));
  }, [assets, tokens]);

  // Foco inicial via URL hash: #phase=fold|ellipse|rhizome
  useEffect(() => {
    try {
      const h = (typeof window !== "undefined" && window.location.hash) || "";
      const m = h.match(/phase=(rhizome|ellipse|fold)/i);
      if (m && m[1]) setPhase(m[1].toLowerCase());
    } catch {}
  }, []);

  // Ouvinte global: DromeSite pode disparar "drome:setPhase"
  useEffect(() => {
    const handler = (ev) => {
      const p = ev?.detail;
      if (p === "rhizome" || p === "ellipse" || p === "fold") {
        setPhase(p);
        // atualiza o hash (compartilhável)
        try {
          const url = new URL(window.location.href);
          url.hash = `phase=${p}`;
          window.history.replaceState(null, "", url.toString());
        } catch {}
      }
    };
    window.addEventListener("drome:setPhase", handler);
    return () => window.removeEventListener("drome:setPhase", handler);
  }, []);

  // Dropzone
  const onFiles = (files) => {
    if (!files) return;
    const next = [];
    for (const f of Array.from(files)) {
      const url = URL.createObjectURL(f);
      const type = f.type.startsWith("video") ? "video" : "image";
      next.push({
        id: uid(),
        name: f.name,
        type,
        url,
        phase,
        tags: {},
      });
    }
    setAssets((prev) => [...next, ...prev]);
    if (!selectedId && next[0]) setSelectedId(next[0].id);
  };

  // Prompt composer
  const [picks, setPicks] = useState({ material: [], colors: [], gesture: [], atmosphere: [], psychic: [] });
  const composePrompt = () => {
    const parts = [];
    if (phase === "rhizome") parts.push("Scene — Rhizome Expansion: a living surface of paint and soil; roots as fluorescent threads of light.");
    if (phase === "ellipse") parts.push("Scene — Elliptical Breathing: translucent ellipses expand and contract like cosmic lungs.");
    if (phase === "fold") parts.push("Scene — The Metamorphic Fold (Acre): pigments erode, drip, dissolve into new forms; membranes vibrate like liquid DNA.");

    const pushIf = (k, label) => {
      if (picks[k] && picks[k].length) parts.push(`${label}: ${picks[k].join(", ")}.`);
    };
    pushIf("material", "Textures");
    pushIf("colors", "Colors");
    pushIf("gesture", "Gesture");
    pushIf("atmosphere", "Atmosphere");
    pushIf("psychic", "Psychic field");

    if (customLine.trim()) parts.push(customLine.trim());

    const finale = parts.join(" ");
    setComposed(finale);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(finale).catch(() => {});
    }
    showToast("Prompt composto");
  };

  // Aplicar prompt ao asset (com feedback)
  const applyPromptToAsset = () => {
    if (!selected) return;
    if (!composed.trim()) {
      showToast("Compose a prompt first");
      return;
    }
    setAssets((prev) =>
      prev.map((a) => (a.id === selected.id ? { ...a, prompt: composed.trim() } : a))
    );
    showToast("Prompt aplicado!");
  };

  // Exportar catálogo
  const exportCatalog = () => {
    const lines = [];
    lines.push(`# Língua Drome — Metamorphic Fold (v1.0)\n`);
    lines.push(`**Phase:** ${phase.toUpperCase()} — total assets: ${assets.length}`);
    lines.push("");
    assets.forEach((a, i) => {
      lines.push(`## ${i + 1}. ${a.name}`);
      lines.push(`- Type: ${a.type}`);
      lines.push(`- Phase: ${a.phase}`);
      const t = a.tags || {};
      if (t.material && t.material.length) lines.push(`- Material: ${t.material.join(", ")}`);
      if (t.colors && t.colors.length) lines.push(`- Colors: ${t.colors.join(", ")}`);
      if (t.gesture && t.gesture.length) lines.push(`- Gesture: ${t.gesture.join(", ")}`);
      if (t.atmosphere && t.atmosphere.length) lines.push(`- Atmosphere: ${t.atmosphere.join(", ")}`);
      if (t.psychic && t.psychic.length) lines.push(`- Psychic: ${t.psychic.join(", ")}`);
      if (a.timecode != null) lines.push(`- Timecode: ${a.timecode}s`);
      if (a.notes) lines.push(`- Notes: ${a.notes}`);
      if (a.prompt) lines.push(`- Prompt: ${a.prompt}`);
      lines.push("");
    });
    lines.push("---\n" + CREDIT_EN + "\n" + CREDIT_PT + "\n");
    downloadFile("Lingua_Drome_Catalog_v1.md", lines.join("\n"), "text/markdown");
    showToast("Catalog.md exportado");
  };

  // Save / Load projeto JSON
  const saveJSON = () => {
    downloadFile("Lingua_Drome_Project_v1.json", JSON.stringify({ assets, tokens }, null, 2), "application/json");
    showToast("Projeto salvo (.json)");
  };
  const loadRef = useRef(null);
  const loadJSON = (file) => {
    const f = file || (loadRef.current && loadRef.current.files && loadRef.current.files[0]);
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed.assets)) setAssets(parsed.assets);
        if (parsed.tokens) setTokens(parsed.tokens);
        showToast("Projeto carregado");
      } catch (e) {
        alert("Invalid JSON");
      }
    };
    reader.readAsText(f);
  };

  // Atualizar metadados do selecionado
  const updateSelected = (patch) => {
    if (!selected) return;
    setAssets((prev) => prev.map((a) => (a.id === selected.id ? { ...a, ...patch } : a)));
  };

  // Subcomponente: TokenPicker
  const TokenPicker = ({ k }) => {
    const values = tokens[k] || [];
    const sel = new Set(picks[k] || []);
    return (
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wider text-zinc-400">{k}</div>
        <div className="flex flex-wrap gap-2">
          {values.map((v) => (
            <button
              key={v}
              onClick={() => {
                const next = new Set(picks[k] || []);
                if (next.has(v)) next.delete(v);
                else next.add(v);
                setPicks((prev) => ({ ...prev, [k]: Array.from(next) }));
              }}
              className={classNames(
                "px-2 py-1 rounded-full text-xs",
                sel.has(v) ? "bg-violet-500/80 text-white" : "bg-zinc-800/60 text-zinc-200 hover:bg-zinc-700"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Micro-componente: Toast
  function Toast({ open, children }) {
    return (
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg border text-sm
                    transition-all duration-300
                    ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
                    bg-emerald-500 text-black border-emerald-400/60 shadow`}
        style={{ zIndex: 60 }}
      >
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-zinc-100">
      {/* Toast */}
      <Toast open={toast.open}>{toast.text}</Toast>

      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 sticky top-0 bg-black/70 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-500 to-cyan-400 animate-pulse" />
          <h1 className="text-sm sm:text-base md:text-lg font-semibold tracking-wide">Língua Drome — v1.0 “Metamorphic Fold”</h1>
        </div>
        <div className="flex items-center gap-2">
          {PHASES.map((p) => (
            <button
              key={p.key}
              onClick={() => setPhase(p.key)}
              className={classNames(
                "px-3 py-1.5 rounded-xl text-xs md:text-sm border",
                phase === p.key ? "bg-white text-black border-white" : "border-white/20 hover:border-white/40"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button onClick={exportCatalog} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-medium">
            Export Catalog
          </button>
          <button onClick={saveJSON} className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10">
            Save JSON
          </button>
          <label className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10 cursor-pointer">
            Load JSON
            <input
              ref={loadRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => loadJSON()}
            />
          </label>
        </div>
      </header>

      {/* Body */}
      <div className="grid md:grid-cols-12 gap-4 p-4 md:p-6">
        {/* Left: Gallery */}
        <section className="md:col-span-3 space-y-3">
          <div className="text-xs uppercase tracking-wider text-zinc-400">Constellation</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {assets.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className={classNames(
                  "relative rounded-xl overflow-hidden border",
                  selectedId === a.id ? "border-violet-400" : "border-white/10 hover:border-white/30"
                )}
              >
                {a.type === "video" ? (
                  <video src={a.url} className="w-full h-28 object-cover" muted playsInline />
                ) : (
                  <img src={a.url} className="w-full h-28 object-cover" />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[10px] px-1 py-1 truncate">
                  {a.name}
                </div>
              </button>
            ))}
          </div>

          {/* Dropzone */}
          <label className="block border border-dashed border-white/20 rounded-xl p-4 text-center text-sm hover:border-white/40 cursor-pointer">
            <input type="file" multiple accept="video/*,image/*" className="hidden" onChange={(e) => onFiles(e.target.files)} />
            <div className="text-zinc-300">Drop videos/images here or click to add</div>
            <div className="text-[11px] text-zinc-500">(local only • fast • private)</div>
          </label>
        </section>

        {/* Center: Player */}
        <section className="md:col-span-6 space-y-3">
          <div className="text-xs uppercase tracking-wider text-zinc-400 flex items-center justify-between">
            <span>Stage</span>
            {selected && <span className="text-[11px] text-zinc-500">{selected.type.toUpperCase()} • {selected.name}</span>}
          </div>

          <div className="aspect-video w/full rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center">
            {selected ? (
              selected.type === "video" ? (
                <video key={selected.url} src={selected.url} className="w-full h-full object-contain" controls />
              ) : (
                <img src={selected.url} className="w-full h-full object-contain" />
              )
            ) : (
              <div className="text-zinc-400 text-sm">
                Select a tile to preview…
                <div className="text-[11px] text-zinc-500 mt-1">“We begin where matter dreams of its next form.”</div>
              </div>
            )}
          </div>

          {selected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Asset meta */}
              <div className="rounded-xl border border-white/10 p-3 space-y-2">
                <div className="text-xs uppercase tracking-wider text-zinc-400">Asset meta</div>

                <div className="flex gap-2 text-xs">
                  <label className="flex items-center gap-2">
                    <span className="text-zinc-400">Phase</span>
                    <select
                      value={selected.phase}
                      onChange={(e) => updateSelected({ phase: e.target.value })}
                      className="bg-black border border-white/10 rounded-lg px-2 py-1"
                    >
                      {PHASES.map((p) => (
                        <option key={p.key} value={p.key}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="text-zinc-400">Timecode</span>
                    <input
                      type="number"
                      step="0.1"
                      value={selected.timecode ?? ""}
                      onChange={(e) => updateSelected({ timecode: Number(e.target.value) })}
                      className="w-24 bg-black border border-white/10 rounded-lg px-2 py-1"
                      placeholder="s"
                    />
                  </label>
                </div>

                {["material", "colors", "gesture", "atmosphere", "psychic"].map((k) => (
                  <div key={k} className="text-xs">
                    <div className="text-zinc-400 capitalize">{k}</div>
                    <input
                      type="text"
                      value={(selected.tags[k]?.join(", ") ?? "")}
                      onChange={(e) => {
                        const vals = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                        updateSelected({ tags: { ...selected.tags, [k]: vals } });
                      }}
                      placeholder="comma separated…"
                      className="mt-1 w-full bg-black border border-white/10 rounded-lg px-2 py-1"
                    />
                  </div>
                ))}

                <div className="text-xs text-zinc-400">Notes</div>
                <textarea
                  value={selected.notes ?? ""}
                  onChange={(e) => updateSelected({ notes: e.target.value })}
                  className="w-full h-20 bg-black border border-white/10 rounded-lg p-2 text-sm"
                  placeholder="field notes, intuition, ritual cues…"
                />

                {/* Prompt atual do asset (somente leitura, com copiar) */}
                <div className="mt-2">
                  <div className="text-xs text-zinc-400 mb-1">Prompt (vinculado ao asset)</div>
                  <div className="relative">
                    <textarea
                      readOnly
                      value={selected.prompt ?? ""}
                      placeholder="Ainda sem prompt aplicado. Use o Drome Console → Compose → Apply to Asset."
                      className="w-full h-24 bg-black border border-white/10 rounded-lg p-2 text-sm pr-16"
                    />
                    <button
                      onClick={() => {
                        if (selected.prompt) {
                          navigator.clipboard?.writeText(selected.prompt);
                          showToast("Prompt copiado");
                        }
                      }}
                      className="absolute right-2 bottom-2 px-2 py-1 text-xs rounded bg-zinc-800 border border-white/10"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {/* Prompt Composer */}
              <div className="rounded-xl border border-white/10 p-3 space-y-3">
                <div className="text-xs uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                  <span>Drome Console — Prompt Builder</span>
                  <button
                    onClick={() => {
                      setPicks({ material: [], colors: [], gesture: [], atmosphere: [], psychic: [] });
                      setComposed("");
                    }}
                    className="text-[11px] text-zinc-400 hover:text-white"
                  >
                    Clear
                  </button>
                </div>

                <TokenPicker k="material" />
                <TokenPicker k="colors" />
                <TokenPicker k="gesture" />
                <TokenPicker k="atmosphere" />
                <TokenPicker k="psychic" />

                <div className="text-xs text-zinc-400">Custom line</div>
                <input
                  value={customLine}
                  onChange={(e) => setCustomLine(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-sm"
                />

                <div className="flex flex-wrap gap-2">
                  <button onClick={composePrompt} className="px-3 py-1.5 rounded-lg bg-violet-500 text-black font-medium">
                    Compose Prompt
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(composed || "");
                      showToast("Prompt copiado");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10"
                  >
                    Copy
                  </button>
                  <button onClick={applyPromptToAsset} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black">
                    Apply to Asset
                  </button>
                </div>
                <textarea
                  value={composed}
                  onChange={(e) => setComposed(e.target.value)}
                  className="w-full h-24 bg-black border border-white/10 rounded-lg p-2 text-sm"
                  placeholder="composed prompt appears here…"
                />
              </div>
            </div>
          )}
        </section>

        {/* Right: Theory / Actions */}
        <aside className="md:col-span-3 space-y-3">
          <div className="rounded-2xl border border-white/10 p-4 space-y-3">
            <div className="text-xs uppercase tracking-wider text-zinc-400">Field brief</div>
            <p className="text-sm leading-relaxed text-zinc-200">
              The interface is an epistemic membrane. We let pigments argue with algorithms;
              we listen where matter folds into symbol. Three modes orchestrate the drift:
              <span className="text-zinc-400"> Rhizome</span> (networking threads),
              <span className="text-zinc-400"> Ellipse–Ritual</span> (breathing orbs),
              <span className="text-zinc-400"> Fold–Acre</span> (tectonic metamorphs).
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <button onClick={() => setPhase("rhizome")} className="px-3 py-1 rounded-lg bg-teal-500/30 border border-teal-400/30">Focus: Rhizome</button>
              <button onClick={() => setPhase("ellipse")} className="px-3 py-1 rounded-lg bg-fuchsia-500/30 border border-fuchsia-400/30">Focus: Ellipse</button>
              <button onClick={() => setPhase("fold")} className="px-3 py-1 rounded-lg bg-amber-500/30 border border-amber-400/30">Focus: Fold</button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 p-4 space-y-3">
            <div className="text-xs uppercase tracking-wider text-zinc-400">Export & Credits</div>
            <button onClick={exportCatalog} className="w-full px-3 py-2 rounded-lg bg-emerald-500 text-black font-medium">Export Catalog.md</button>
            <button
              onClick={() => setComposed((prev) => (prev ? prev + " " : "") + CREDIT_EN + " " + CREDIT_PT)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-white/10"
            >
              Append Credits to Prompt
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 p-4 space-y-3">
            <div className="text-xs uppercase tracking-wider text-zinc-400">Project</div>
            <button onClick={saveJSON} className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-white/10">Save .json</button>
            <label className="w-full block px-3 py-2 rounded-lg bg-zinc-800 border border-white/10 cursor-pointer text-center">
              Load .json
              <input type="file" accept="application/json" className="hidden" onChange={(e) => loadJSON(e.target.files && e.target.files[0])} />
            </label>
          </div>

          <div className="rounded-2xl border border-white/10 p-4 space-y-2 text-[11px] text-zinc-400 leading-relaxed">
            <div className="uppercase tracking-wider">Sora handoff</div>
            <p>Use “Compose Prompt” → “Copy” to paste directly in Sora. For multi-scene videos, create several assets (one per scene) and paste sequentially into Sora’s storyboard. Keep tokens, change the phase to shift the ontology.</p>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="px-6 py-6 text-[11px] text-zinc-500 border-t border-white/10">
        <div>© The Drome is a sympoietic interface — Haraway would call it a practice of making-with. Clark’s organic line breathes in the gaps. The fold remembers Acre.</div>
      </footer>
    </div>
  );
}
