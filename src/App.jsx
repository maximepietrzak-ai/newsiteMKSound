import { useState, useEffect, useRef } from "react";

const EVENT_TYPES = ["Mariage", "Anniversaire", "Soirée privée", "Entreprise", "Autre"];
function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

/* ── SCROLL REVEAL ─────────────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
function Reveal({ children, className = "", delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal${delay ? ` reveal-delay-${delay}` : ""} ${className}`}>
      {children}
    </div>
  );
}

/* ── ANIMATED COUNTER ──────────────────────────────────────────────────────── */
function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1);
          setCount(Math.round((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── LOGO ──────────────────────────────────────────────────────────────────── */
// viewBox crops to actual content bounds (x:10-270, y:10-110) so SOUND is visible at nav size
function Logo({ small = false }) {
  const w = small ? 110 : 160;
  const h = small ? 42 : 62;
  return (
    <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="10 10 260 100" width={w} height={h} style={{ display: "block", overflow: "visible" }}>
        <rect width="420" height="120" rx="18" fill="none" />
        <rect x="20" y="72" width="12" height="28" rx="4" fill="#5B21B6" opacity="0.55" />
        <rect x="36" y="52" width="12" height="48" rx="4" fill="#7C3AED" opacity="0.75" />
        <rect x="52" y="26" width="12" height="74" rx="4" fill="#9B5CF6" />
        <rect x="68" y="40" width="12" height="60" rx="4" fill="#8B5CF6" opacity="0.88" />
        <rect x="84" y="58" width="12" height="42" rx="4" fill="#7C3AED" opacity="0.70" />
        <rect x="100" y="76" width="12" height="24" rx="4" fill="#6D28D9" opacity="0.50" />
        <circle cx="58" cy="20" r="5" fill="#C4B5FD" />
        <line x1="132" y1="20" x2="132" y2="100" stroke="#2D1F5E" strokeWidth="1.2" />
        <text x="152" y="82" fontFamily="'Helvetica Neue',Arial Black,sans-serif" fontWeight="900" fontSize="66" letterSpacing="-2" fill="#FFFFFF">MK</text>
        <text x="155" y="103" fontFamily="'Helvetica Neue',Arial,sans-serif" fontWeight="300" fontSize="15" letterSpacing="9" fill="#9B5CF6">SOUND</text>
      </svg>
    </a>
  );
}

/* ── NAV ───────────────────────────────────────────────────────────────────── */
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: "Offres", href: "#offres" },
    { label: "Avis", href: "#avis" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      transition: "background 0.3s, border-color 0.3s",
      background: scrolled ? "rgba(6,7,15,0.88)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.06)" : "transparent"}`,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <Logo />

        {/* Desktop */}
        <div className="nav-desktop">
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {links.map(l => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}
            <button onClick={scrollToContact} className="btn-primary" style={{ padding: "8px 18px", fontSize: 14 }}>
              Disponibilité
            </button>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="nav-mobile-btn" aria-label="Menu">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="nav-mobile-menu">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="nav-mobile-link">{l.label}</a>
          ))}
          <button onClick={() => { setOpen(false); scrollToContact(); }} className="btn-primary" style={{ width: "100%", padding: "13px", fontSize: 15, marginTop: 8 }}>
            Vérifier la disponibilité
          </button>
        </div>
      )}
    </nav>
  );
}

/* ── VIDEO HERO ────────────────────────────────────────────────────────────── */
function VideoHero() {
  return (
    <section id="video-hero" style={{
      background: "#111218",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
      paddingTop: 72,
    }}>
      {/* Grid texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />
      {/* Glow */}
      <div style={{
        position: "absolute", right: "-80px", top: "50%", transform: "translateY(-50%)",
        width: 700, height: 700, pointerEvents: "none",
        background: "radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 65%)",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%", position: "relative", zIndex: 1 }}>
        <div className="hero-layout">

          {/* Left: copy */}
          <div style={{ minWidth: 0, overflow: "hidden" }}>
            <Reveal>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "5px 14px", borderRadius: 100,
                border: "1px solid rgba(155,92,246,0.25)",
                background: "rgba(124,58,237,0.07)",
                marginBottom: 32,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#9B5CF6", display: "block", flexShrink: 0 }} />
                <span style={{ color: "#A78BFA", fontSize: 12, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  DJ événementiel — Pas-de-Calais
                </span>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h1 style={{
                fontSize: "clamp(44px, 5.5vw, 76px)",
                fontWeight: 800,
                color: "#EBEBEF",
                letterSpacing: "-0.03em",
                lineHeight: 1.0,
                marginBottom: 24,
                textShadow: "0 0 80px rgba(255,255,255,0.08)",
              }}>
                L'ambiance de vos événements,{" "}
                <span style={{ color: "#9B5CF6" }}>c'est notre métier</span>
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p style={{ fontSize: 17, color: "#525252", lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
                Mariages, anniversaires, soirées privées —{" "}
                <span style={{ color: "#A1A1AA" }}>MK Évènementiel</span>{" "}
                crée l'ambiance qui vous ressemble dans le Pas-de-Calais et les Hauts-de-France.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={scrollToContact} className="btn-primary" style={{ padding: "13px 28px", fontSize: 15 }}>
                  Vérifier la disponibilité
                </button>
                <a href="#offres" className="btn-ghost" style={{ padding: "13px 28px", fontSize: 15 }}>
                  Voir les formules
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right: phone */}
          <div style={{ display: "flex", justifyContent: "center", minWidth: 0, alignSelf: "start", marginTop: 0 }}>
            <Reveal delay={2}>
              <div style={{ position: "relative", width: 440, maxWidth: "100%" }}>
                <div style={{
                  position: "absolute", inset: -50, pointerEvents: "none",
                  background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)",
                }} />
                <div style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "9 / 16",
                  borderRadius: 28,
                  overflow: "hidden",
                  background: "#0D1020",
                  border: "1px solid rgba(155,92,246,0.18)",
                  boxShadow: "0 48px 96px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
                }}>
                  <iframe
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                    src="https://www.youtube.com/embed/__PGkM1oaX0"
                    title="MK Évènementiel — Aperçu"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>

      {/* Scroll dot */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }}>
        <div style={{
          width: 24, height: 40,
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 100,
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          paddingTop: 6,
        }}>
          <div style={{ width: 3, height: 6, background: "#7C3AED", borderRadius: 100, animation: "scrollDown 2s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}

/* ── MARQUEE ───────────────────────────────────────────────────────────────── */
const MARQUEE_TEXT = "DJ ÉVÉNEMENTIEL · MARIAGES · ANNIVERSAIRES · SOIRÉES PRIVÉES · BALS PUBLICS · PAS-DE-CALAIS · ";

function Marquee() {
  const repeated = MARQUEE_TEXT.repeat(4);
  return (
    <div style={{
      borderTop: "1px solid rgba(255,255,255,0.06)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      overflow: "hidden",
      padding: "14px 0",
    }}>
      <div style={{ display: "flex", whiteSpace: "nowrap" }}>
        <span className="marquee-track"
          style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)" }}>
          {repeated}
        </span>
        <span className="marquee-track" aria-hidden="true"
          style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)" }}>
          {repeated}
        </span>
      </div>
    </div>
  );
}

/* ── SOCIAL PROOF ──────────────────────────────────────────────────────────── */
function SocialProof() {
  const stats = [
    { val: 50, suffix: "+", label: "Événements animés" },
    { val: 100, suffix: "%", label: "Clients satisfaits" },
    { custom: "5 / 5", stars: true, label: "Note Google" },
  ];
  return (
    <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: "36px 24px",
              textAlign: "center",
              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <div style={{ fontSize: 80, fontWeight: 900, color: "#EBEBEF", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 4, animation: "pulse 3s ease-in-out infinite" }}>
                {s.custom ?? <Counter end={s.val} suffix={s.suffix} />}
              </div>
              {s.stars && (
                <div style={{ fontSize: 11, color: "#7C3AED", letterSpacing: "2px", marginBottom: 4 }}>★★★★★</div>
              )}
              <div style={{ fontSize: 11, color: "#3F3F46", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── OFFRES ────────────────────────────────────────────────────────────────── */
function Offres() {
  const packs = [
    {
      name: "Essentiel",
      target: "Petites soirées & anniversaires",
      features: ["DJ professionnel", "Sonorisation adaptée", "Éclairage d'ambiance", "Échange préalable sur vos goûts"],
    },
    {
      name: "Mariage",
      target: "Votre jour J, parfaitement orchestré",
      features: ["DJ + système lumières complet", "Gestion des moments clés", "Préparation musicale sur-mesure", "Coordination avec vos prestataires", "Micro pour discours & animations"],
      highlighted: true,
      badge: "Le plus demandé",
    },
    {
      name: "Sur-Mesure",
      target: "L'expérience complète & immersive",
      features: ["Tout le pack Mariage inclus", "Son & lumières haut de gamme", "Effets scéniques (fumée, LED, laser)", "DJ set prolongé", "Installation & démontage complets"],
    },
  ];

  return (
    <section id="offres" style={{ padding: "120px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <Reveal>
          <div style={{ marginBottom: 64 }}>
            <p className="section-label">Formules</p>
            <h2 className="section-title">Une offre adaptée<br />à chaque événement</h2>
          </div>
        </Reveal>

        <div className="pricing-grid">
          {packs.map((pack, i) => (
            <Reveal key={pack.name} delay={i + 1}>
              <div className={`pricing-card${pack.highlighted ? " pricing-card--featured" : ""}`}
                style={pack.highlighted ? {
                  border: "1px solid #7C3AED",
                  boxShadow: "0 0 60px rgba(124,58,237,0.25), inset 0 0 60px rgba(124,58,237,0.05)",
                } : {}}>
                {pack.highlighted && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: "linear-gradient(90deg, #7C3AED, #9B5CF6)",
                  }} />
                )}
                {pack.badge && (
                  <div style={{
                    position: "absolute", top: 18, right: 18,
                    padding: "3px 10px", borderRadius: 100,
                    background: "rgba(124,58,237,0.15)",
                    border: "1px solid rgba(155,92,246,0.25)",
                    fontSize: 11, fontWeight: 600, color: "#C4B5FD", letterSpacing: "0.3px",
                  }}>
                    {pack.badge}
                  </div>
                )}
                <p style={{ fontSize: 11, fontWeight: 600, color: pack.highlighted ? "#9B5CF6" : "#3F3F46", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>
                  Pack {pack.name}
                </p>
                <p style={{ fontSize: 13, color: "#3F3F46", marginBottom: 24, lineHeight: 1.5 }}>{pack.target}</p>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 11, flex: 1 }}>
                  {pack.features.map(f => (
                    <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#71717A" }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                        <path d="M3 8l3.5 3.5L13 5" stroke={pack.highlighted ? "#9B5CF6" : "#3F3F46"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button onClick={scrollToContact} className={pack.highlighted ? "btn-primary" : "btn-outline"} style={{ width: "100%", padding: "11px", fontSize: 14 }}>
                  Demander un devis
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── DIFFÉRENCIATION ───────────────────────────────────────────────────────── */
function Differenciation() {
  const points = [
    {
      title: "Playlist sur-mesure",
      text: "On prépare ensemble la musique qui vous ressemble.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />,
    },
    {
      title: "Ponctualité & rigueur",
      text: "Installation en avance, gestion du timing, zéro stress.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      title: "Un seul interlocuteur",
      text: "Un contact unique, réactif, impliqué de A à Z.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    },
    {
      title: "Matériel professionnel",
      text: "Son puissant, jeux de lumières, rendu soigné.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
    },
  ];

  return (
    <section style={{ padding: "120px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <Reveal>
          <div style={{ marginBottom: 64 }}>
            <p className="section-label">Pourquoi nous</p>
            <h2 className="section-title">Ce qui fait<br /><span style={{ color: "#9B5CF6" }}>la différence.</span></h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i + 1}>
              <div className="feature-cell">
                <div style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: "rgba(124,58,237,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20, color: "#9B5CF6", flexShrink: 0,
                }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">{p.icon}</svg>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#EBEBEF", marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: "#525252", lineHeight: 1.6 }}>{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── AVIS ──────────────────────────────────────────────────────────────────── */
function Avis() {
  const temoignages = [
    { name: "Malena E.", text: "Un immense merci à notre DJ Max pour cette soirée absolument mémorable ! L'ambiance était parfaite du début à la fin. Il a su lire la foule à la perfection et créer une énergie incroyable." },
    { name: "Alyson D.", text: "Très bon DJ, très professionnel ! À la hauteur de nos attentes. Nous avons passé une super soirée ! À l'écoute, soucieux de bien faire ! Vous pouvez foncer les yeux fermés." },
    { name: "Laurent L.", text: "Une très belle prestation conforme à nos attentes, le travail est préparé pour être personnalisé. La gentillesse et la disponibilité sont des atouts qui s'ajoutent au professionnalisme." },
    { name: "Sandrine L.", text: "Musique au top, soirée avec 130 personnes qui ont tous foulé la piste. DJ qui s'adapte à la demande." },
    { name: "Françoise B.", text: "Superbe animation, très disponible. Une très bonne ambiance générale au top grâce à son professionnalisme." },
    { name: "Corinne S.", text: "Un DJ très professionnel, très bonne prestation, à la hauteur de notre attente. À refaire avec grand plaisir." },
  ];

  return (
    <section id="avis" style={{ padding: "120px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 64 }}>
            <div>
              <p className="section-label">Témoignages</p>
              <h2 className="section-title">Ils nous ont fait confiance</h2>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 14px",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span style={{ fontSize: 13, color: "#52525B", fontWeight: 500 }}>5/5 · 6 avis Google</span>
            </div>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
          {temoignages.map((t, i) => (
            <Reveal key={t.name} delay={Math.min(i + 1, 4)}>
              <div className="review-cell">
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="13" height="13" fill="#7C3AED" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize: 22, color: "#FFFFFF", lineHeight: 1.5, marginBottom: 20, fontWeight: 700 }}>
                  "{t.text}"
                </p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{t.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PROCESSUS ─────────────────────────────────────────────────────────────── */
function Process() {
  const steps = [
    { num: "01", title: "Demande", text: "Remplissez le formulaire avec les détails de votre événement." },
    { num: "02", title: "Disponibilité", text: "On vérifie le planning et on revient vers vous sous 24h." },
    { num: "03", title: "Échange", text: "On discute de vos envies, de l'ambiance, du déroulé." },
    { num: "04", title: "Proposition", text: "Devis clair, détaillé, sans engagement." },
  ];

  return (
    <section style={{ padding: "120px 0 60px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <Reveal>
          <div style={{ marginBottom: 64 }}>
            <p className="section-label">Processus</p>
            <h2 className="section-title">Comment ça fonctionne</h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i + 1}>
              <div className="process-step" data-first={i === 0 ? "true" : "false"}>
                <p style={{ fontSize: 28, fontWeight: 800, color: "rgba(255,255,255,0.15)", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 16, userSelect: "none" }}>
                  {s.num}
                </p>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#EBEBEF", marginBottom: 8 }}>{s.title}</p>
                <p style={{ fontSize: 13, color: "#525252", lineHeight: 1.6 }}>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── URGENCE ───────────────────────────────────────────────────────────────── */
function Urgence() {
  return (
    <section style={{ padding: "120px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <Reveal>
          <div style={{
            padding: "64px 48px",
            border: "1px solid rgba(124,58,237,0.18)",
            borderRadius: 16,
            background: "rgba(124,58,237,0.04)",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.1) 0%, transparent 60%)",
            }} />
            <div style={{ position: "relative" }}>
              <p className="section-label" style={{ textAlign: "center" }}>Disponibilités</p>
              <h2 style={{
                fontSize: "clamp(22px, 3.5vw, 34px)",
                fontWeight: 800, color: "#EBEBEF",
                letterSpacing: "-0.03em", lineHeight: 1.2,
                marginBottom: 12,
              }}>
                Certaines dates sont réservées<br />plusieurs semaines à l'avance
              </h2>
              <p style={{ fontSize: 15, color: "#525252", marginBottom: 36, maxWidth: 400, margin: "0 auto 36px" }}>
                Plus tôt vous nous contactez, plus on pourra personnaliser votre prestation.
              </p>
              <button onClick={scrollToContact} className="btn-primary" style={{ padding: "13px 32px", fontSize: 15 }}>
                Vérifier la disponibilité
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── FORMULAIRE ────────────────────────────────────────────────────────────── */
function Formulaire() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", event_type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("https://formspree.io/f/xdayabev", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ ...form, _subject: "Nouvelle demande de devis — MK Sound" }),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      // silent fail
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="contact" style={{ padding: "120px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ padding: "64px 48px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16 }}>
            <div style={{
              width: 44, height: 44, background: "rgba(124,58,237,0.12)", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#9B5CF6" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p style={{ fontSize: 20, color: "#FFFFFF", textAlign: "center", padding: 40 }}>&#10003; Votre demande a bien été envoyée ! Nous vous répondons sous 24h.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" style={{ padding: "120px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
        <Reveal>
          <div style={{ marginBottom: 48 }}>
            <p className="section-label">Contact</p>
            <h2 className="section-title">Vérifier la disponibilité</h2>
            <p style={{ fontSize: 15, color: "#525252", marginTop: 12 }}>Remplissez ce formulaire, on vous répond sous 24h.</p>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input type="hidden" name="_subject" value="Nouvelle demande de devis — MK Sound" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <input type="text" name="name" placeholder="Votre nom" required value={form.name} onChange={handleChange} className="form-input" />
              <input type="tel" name="phone" placeholder="Téléphone" required value={form.phone} onChange={handleChange} className="form-input" />
            </div>
            <input type="email" name="email" placeholder="Adresse email" required value={form.email} onChange={handleChange} className="form-input" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <input type="date" name="date" required value={form.date} onChange={handleChange} className="form-input" style={{ colorScheme: "dark" }} />
              <select name="event_type" required value={form.event_type} onChange={handleChange} className="form-input form-select" style={{ color: form.event_type ? "#EBEBEF" : "#525252" }}>
                <option value="" disabled style={{ background: "#0D1020" }}>Type d'événement</option>
                {EVENT_TYPES.map(t => <option key={t} value={t} style={{ background: "#0D1020" }}>{t}</option>)}
              </select>
            </div>
            <textarea name="message" placeholder="Détails sur votre événement (lieu, nombre de personnes, ambiance souhaitée...)" rows={4} value={form.message} onChange={handleChange} className="form-input" style={{ resize: "vertical" }} />
            <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: "13px", fontSize: 15, marginTop: 6, width: "100%", border: "none", borderRadius: 8, cursor: "pointer", opacity: submitting ? 0.6 : 1 }}>
              {submitting ? "Envoi en cours…" : "Envoyer ma demande"}
            </button>
            <p style={{ fontSize: 12, color: "#27272A", textAlign: "center" }}>Sans engagement. Réponse garantie sous 24h.</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ── FOOTER ────────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "40px 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <Logo small />
        <p style={{ fontSize: 13, color: "#3F3F46" }}>DJ & animation événementielle — Pas-de-Calais & Hauts-de-France</p>
        <p style={{ fontSize: 12, color: "#27272A" }}>© {new Date().getFullYear()} MK Évènementiel</p>
      </div>
    </footer>
  );
}

/* ── STICKY MOBILE CTA ─────────────────────────────────────────────────────── */
function StickyMobileCTA() {
  return (
    <div className="sticky-cta">
      <button onClick={scrollToContact} className="btn-primary" style={{ width: "100%", padding: 14, fontSize: 15, border: "none", borderRadius: 10, cursor: "pointer" }}>
        Vérifier la disponibilité
      </button>
    </div>
  );
}

/* ── APP ───────────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <div style={{ background: "#111218", minHeight: "100vh" }}>
      <Nav />
      <VideoHero />
      <Marquee />
      <SocialProof />
      <Offres />
      <Differenciation />
      <Avis />
      <Process />
      <Urgence />
      <Formulaire />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
