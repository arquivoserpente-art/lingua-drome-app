// src/App.jsx
export default function App() {
  const works = [
    {
      id: "acr",
      title: "Affective Cartography Rituals",
      caption:
        "Ellipse / Ritual — violet & gold — constellation — unconscious / trance.",
      src: "/media/affective-cartography.mp4",
    },
    {
      id: "frn",
      title: "Fluorescent Roots Network",
      caption:
        "Rhizome — soil & roots — subterranean signals — luminous threads.",
      src: "/media/fluorescent-roots.mp4",
    },
  ];

  const page = {
    wrap: {
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#e7e7e7",
      fontFamily:
        "system-ui,-apple-system,Segoe UI,Roboto,Inter,Ubuntu,Arial,sans-serif",
    },
    container: {
      maxWidth: 1100,
      margin: "0 auto",
      padding: "28px 16px 56px",
    },
    header: {
      marginBottom: 20,
      borderBottom: "1px solid #2a2a2a",
      paddingBottom: 16,
    },
    pill: {
      display: "inline-block",
      marginRight: 8,
      fontSize: 12,
      color: "#a1a1aa",
      border: "1px solid #333",
      borderRadius: 999,
      padding: "4px 8px",
    },
    h1: { margin: "8px 0 6px", fontSize: 26, fontWeight: 800 },
    h2: { margin: "18px 0 10px", fontSize: 18, color: "#a1a1aa" },
    grid: {
      display: "grid",
      gap: 16,
      gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
    },
    card: {
      background: "#101010",
      border: "1px solid #2a2a2a",
      borderRadius: 12,
      padding: 12,
      boxShadow: "0 0 0 1px rgba(0,0,0,.2) inset",
    },
    title: { margin: "10px 0 4px", fontSize: 16, fontWeight: 700 },
    caption: { margin: 0, color: "#a1a1aa", fontSize: 13, lineHeight: 1.5 },
    video: {
      width: "100%",
      borderRadius: 10,
      outline: "none",
      display: "block",
      background: "#000",
    },
    footer: {
      marginTop: 28,
      fontSize: 12,
      color: "#a1a1aa",
      borderTop: "1px solid #2a2a2a",
      paddingTop: 16,
    },
    link: { color: "#a78bfa", textDecoration: "none", fontWeight: 700 },
  };

  return (
    <div style={page.wrap}>
      <main style={page.container}>
        <header style={page.header}>
          <div>
            <span style={page.pill}>Língua Drome</span>
            <span style={page.pill}>v1.0</span>
            <span style={page.pill}>Metamorphic Fold</span>
          </div>
          <h1 style={page.h1}>Metamorphic membranes between painting & machine</h1>
          <p style={page.h2}>
            A living catalog. Drop your videos in <code>/public/media</code> and they appear below.
          </p>
        </header>

        <section style={page.grid}>
          {works.map((w) => (
            <article key={w.id} style={page.card}>
              <video
                style={page.video}
                src={w.src}
                controls
                preload="metadata"
                playsInline
              />
              <h3 style={page.title}>{w.title}</h3>
              <p style={page.caption}>{w.caption}</p>
            </article>
          ))}
        </section>

        <section style={page.footer}>
          <p>
            If a video won’t play, confirm the file exists at{" "}
            <code>/public/media/&lt;name&gt;.mp4</code>. On Vercel it becomes{" "}
            <code>/media/&lt;name&gt;.mp4</code>.
          </p>
          <p>
            Credits — Rodrigo Garcia Dutra × ChatGPT-5 (multimodal) — prompts, conversations, dreams.
          </p>
        </section>
      </main>
    </div>
  );
}
