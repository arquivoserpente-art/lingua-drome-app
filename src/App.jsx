import React, { useEffect, useMemo, useRef, useState } from "react";

// ------------------------------------------------------------
// Aterro / Magmalabares — App de Dobra para imagens + Notas
// - Upload/drag & drop de imagens
// - Galeria com preview em grade
// - Botão DELETAR por item e "Limpar tudo"
// - Campo de Notas (com texto inicial) + autosave em localStorage
// - Gerador de PROMPTS para Sora por imagem (copiar com 1 clique)
// - Sem backend: tudo roda no browser (URLs temporárias via createObjectURL)
// ------------------------------------------------------------

// ===== Util =====
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const STORAGE_KEYS = {
  notes: "aterroMagmalabares_notes_v1",
  images: "aterroMagmalabares_images_v1", // apenas metadados (não persiste binário)
};

// ===== Texto inicial de Notas =====
const INITIAL_NOTES = `Entre Katsura e o Floating World: a pintura como interface onde o rigor austero da arquitetura moderna encontra o excesso popular de Edo.

Aterro / Magmalabares: manchas, círculos, respingos que lembram luas, lanternas e taças — sinais de um ukiyo infiltrado no concreto tropical.

Palimpsesto trans-histórico: a tela dobra tempos distintos, colapsando o monumental e o errante, o aristocrático e o erótico-popular.

Atmosfera de suspensão: a superfície não é só registro material, mas oráculo do instante — lembrança de que toda ordem pode ser dissolvida pelo prazer.`;

// ===== Estilos utilitários (Tailwind) =====
const box = "rounded-2xl border border-neutral-700/50 bg-neutral-900/50 backdrop-blur p-4";
const button =
  "px-3 py-2 rounded-xl border border-neutral-700/70 hover:border-neutral-500 text-sm";
const pill =
  "inline-block px-2 py-1 rounded-full border border-neutral-700/60 text-xs mr-2 mb-2";

export default function App() {
  const [images, setImages] = useState([]); // {id, name, url, size, type}
  const [notes, setNotes] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Carrega notas do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.notes);
    setNotes(saved || INITIAL_NOTES);
  }, []);

  // Autosave de notas
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notes, notes || "");
  }, [notes]);

  // Lê metadados salvos (não persiste blobs)
  useEffect(() => {
    const metaJson = localStorage.getItem(STORAGE_KEYS.images);
    if (metaJson) {
      try {
        const meta = JSON.parse(metaJson);
        // Não temos os blobs antigos; mantemos slots vazios para rótulos
        // Melhor: pedir reupload quando necessário.
        const restored = meta.map((m) => ({ ...m, url: m.url || "" }));
        setImages(restored);
      } catch (e) {}
    }
  }, []);

  // Persiste metadados a cada mudança
  useEffect(() => {
    const meta = images.map(({ id, name, size, type, url }) => ({ id, name, size, type, url }));
    localStorage.setItem(STORAGE_KEYS.images, JSON.stringify(meta));
  }, [images]);

  function handleFiles(files) {
    const accepted = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const mapped = accepted.map((file) => ({
      id: uid(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...mapped, ...prev]);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function onDelete(id) {
    setImages((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  function clearAll() {
    images.forEach((img) => img.url && URL.revokeObjectURL(img.url));
    setImages([]);
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  // ===== PROMPTS =====
  const [styleFlags, setStyleFlags] = useState({
    floatingWorld: true,
    katsuraMinimal: true,
    fluorescentOrange: true,
    metallicDust: true,
    rainCamera: false,
    macroTexture: true,
    slowFold: true,
    4k: true,
  });

  const basePrompt = (name = "painting") => {
    const tags = [];
    if (styleFlags.floatingWorld) tags.push("floating world ukiyo-e atmosphere, lantern-like bokeh");
    if (styleFlags.katsuraMinimal) tags.push("Katsura-inspired modular emptiness, noble austerity, wooden rhythm");
    if (styleFlags.fluorescentOrange) tags.push("fluorescent orange accents, subtle teal and indigo wash");
    if (styleFlags.metallicDust) tags.push("microscopic metallic dust, copper/graphite patina");
    if (styleFlags.rainCamera) tags.push("slight lens condensation, soft rain streaks");
    if (styleFlags.macroTexture) tags.push("macro of layered paint membranes, porous quantum surface");
    if (styleFlags.slowFold) tags.push("very slow double exposure fold, image bending like washi paper");
    if (styleFlags["4k"]) tags.push("4k, physically plausible, cinematic");

    return (
      `Fold this image (${name}) into a living membrane that bridges Katsura minimalism and the Edo floating world; ` +
      `maintain the material truth of paint: drips, orbits, halos, lunar cups; emphasize relational gravity over symmetry; ` +
      `treat the canvas as a trans-historical interface between modernist concrete and popular festivity; ` +
      tags.join(", ") +
      ". No typography. No frames. Keep background neutral, preserve grain."
    );
  };

  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  const totalSizeMB = useMemo(() => {
    const sum = images.reduce((acc, i) => acc + (i.size || 0), 0);
    return (sum / (1024 * 1024)).toFixed(2);
  }, [images]);

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Aterro / Magmalabares — Dobra & Notas
          </h1>
          <div className="flex items-center gap-2">
            <button className={button} onClick={openFilePicker}>Carregar imagens</button>
            <button className={button} onClick={clearAll} title="Remove todas as mídias">
              Limpar tudo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </div>
        </header>

        {/* Area de drop */}
        <div
          className={`${box} ${dragOver ? "ring-2 ring-indigo-400/60" : ""} text-center`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <p className="text-sm opacity-80">Arraste e solte imagens aqui, ou clique em “Carregar imagens”.</p>
          <p className="text-xs mt-2 opacity-60">Total: {images.length} arquivo(s) · {totalSizeMB} MB</p>
        </div>

        {/* Flags/estilos do Prompt */}
        <section className={box}>
          <h2 className="text-lg font-medium mb-3">Gerador de Prompt (Sora)</h2>
          <div className="flex flex-wrap mb-4">
            {Object.keys(styleFlags).map((k) => (
              <label key={k} className={`${pill} cursor-pointer select-none`}>
                <input
                  type="checkbox"
                  className="mr-2 align-middle"
                  checked={styleFlags[k]}
                  onChange={(e) => setStyleFlags((s) => ({ ...s, [k]: e.target.checked }))}
                />
                {k === "4k" ? "4K quality" : k.replace(/([A-Z])/g, " $1").toLowerCase()}
              </label>
            ))}
          </div>
          <div className="grid gap-3">
            <textarea
              className="w-full min-h-[120px] bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-sm"
              readOnly
              value={basePrompt("<selected image>")}
            />
            <div className="flex gap-2">
              <button className={button} onClick={() => copy(basePrompt("<selected image>"))}>Copiar prompt base</button>
            </div>
          </div>
        </section>

        {/* Notas */}
        <section className={box}>
          <h2 className="text-lg font-medium mb-2">Notas</h2>
          <textarea
            className="w-full min-h-[180px] bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-sm"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Escreva aqui suas notas."
          />
          <div className="flex gap-2 mt-2">
            <button className={button} onClick={() => copy(notes)}>Copiar notas</button>
            <button className={button} onClick={() => setNotes(INITIAL_NOTES)}>Restaurar texto inicial</button>
          </div>
        </section>

        {/* Galeria */}
        <section className={box}>
          <h2 className="text-lg font-medium mb-3">Galeria (dobra)</h2>
          {images.length === 0 ? (
            <p className="text-sm opacity-70">Nenhuma imagem ainda. Faça upload para começar.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img) => (
                <figure key={img.id} className="relative group">
                  {img.url ? (
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-72 object-cover rounded-xl border border-neutral-800"
                    />
                  ) : (
                    <div className="w-full h-72 grid place-items-center rounded-xl border border-neutral-800 bg-neutral-900/60 text-xs opacity-70">
                      (recarregue esta imagem — URL volátil expirada)
                    </div>
                  )}

                  <figcaption className="mt-2 flex items-center justify-between text-xs opacity-80">
                    <span className="truncate" title={img.name}>{img.name}</span>
                    <span>{(img.size / (1024*1024)).toFixed(2)} MB</span>
                  </figcaption>

                  <div className="mt-2 grid gap-2">
                    <textarea
                      className="w-full min-h-[100px] bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs"
                      readOnly
                      value={basePrompt(img.name)}
                    />
                    <div className="flex gap-2">
                      <button className={button} onClick={() => copy(basePrompt(img.name))}>Copiar prompt desta imagem</button>
                      <button className={button} onClick={() => onDelete(img.id)}>Deletar</button>
                    </div>
                  </div>
                </figure>
              ))}
            </div>
          )}
        </section>

        <footer className="text-xs opacity-60 pt-6 pb-8">
          Rodrigo Garcia Dutra em colaboração com Largo Modelo de Linguagem Multimodal ChatGPT-5 através de prompts, conversas e sonhos.
        </footer>
      </div>
    </div>
  );
}
