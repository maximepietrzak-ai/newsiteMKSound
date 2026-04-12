import { useState, useEffect, useRef } from "react";

const EVENT_TYPES = ["Mariage", "Anniversaire", "Soirée privée", "Entreprise", "Autre"];

function scrollToForm() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

/* ─────────────── SCROLL REVEAL ────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${delay ? `reveal-delay-${delay}` : ""} ${className}`}>{children}</div>;
}

/* ─────────────── ANIMATED COUNTER ─────────────────────── */
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

/* ─────────────────────── LOGO ─────────────────────────── */
function MKLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <defs>
        <linearGradient id="mkg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00F5A0" />
          <stop offset="1" stopColor="#00D9F5" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="48" fill="url(#mkg)" />
      <path d="M42 148V62h8l30 48 30-48h8v86h-14V88l-24 38h-2l-24-38v60H42z" fill="#2D2D2D" />
      <path d="M134 148V62h14v38l32-38h18l-34 40 36 46h-18l-28-36-6 7v29h-14z" fill="#2D2D2D" />
    </svg>
  );
}

/* ──────────────── GRADIENT BUTTON ──────────────────────── */
function GradientButton({ children, onClick, className = "", type = "button" }) {
  return (
    <button type={type} onClick={onClick} className={`relative group overflow-hidden px-8 py-4 rounded-2xl font-bold text-[#2D2D2D] text-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${className}`}>
      <span className="absolute inset-0 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] animate-gradient" />
      <span className="absolute -inset-3 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-500 animate-glow rounded-3xl" />
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
}

/* ───────────────────────── NAV ─────────────────────────── */
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: "Offres", href: "#offres" },
    { label: "Avis", href: "#avis" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#2D2D2D]/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <MKLogo size={36} />
          </div>
          <span className="font-bold text-white text-[15px] tracking-tight">MK Évènementiel</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-neutral-400 hover:text-white transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#00F5A0] after:to-[#00D9F5] after:transition-all hover:after:w-full">
              {l.label}
            </a>
          ))}
          <button onClick={scrollToForm} className="px-5 py-2.5 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-[#2D2D2D] font-semibold rounded-xl text-sm hover:shadow-lg hover:shadow-[#00F5A0]/20 hover:scale-105 active:scale-95 transition-all">
            Disponibilité
          </button>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-neutral-400" aria-label="Menu">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#2D2D2D]/95 backdrop-blur-xl border-t border-white/5 px-6 pb-5 pt-3 space-y-3">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm text-neutral-300 font-medium py-2">{l.label}</a>
          ))}
          <button onClick={() => { setOpen(false); scrollToForm(); }} className="w-full py-3 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-[#2D2D2D] font-semibold rounded-xl text-sm">
            Vérifier la disponibilité
          </button>
        </div>
      )}
    </nav>
  );
}

/* ───────────────────────── HERO ───────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center pt-16 overflow-hidden bg-[#2D2D2D]">
      {/* Floating gradient blobs */}
      <div className="absolute top-20 left-[5%] w-[500px] h-[500px] bg-[#00F5A0]/10 rounded-full blur-[120px] animate-float-1" />
      <div className="absolute top-40 right-[5%] w-[600px] h-[600px] bg-[#00D9F5]/8 rounded-full blur-[140px] animate-float-2" />
      <div className="absolute bottom-10 left-[40%] w-[400px] h-[400px] bg-[#00F5A0]/5 rounded-full blur-[100px] animate-float-3" />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #00F5A0 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 text-xs font-semibold tracking-wide uppercase rounded-full bg-white/5 text-[#00F5A0] border border-[#00F5A0]/20 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5A0] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F5A0]" />
            </span>
            DJ événementiel — Pas-de-Calais
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="mb-8">
            <MKLogo size={80} />
          </div>
        </Reveal>

        <Reveal delay={2}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-white mb-6">
            L'ambiance de vos événements,
            <br />
            <span className="text-gradient-animated">c'est notre métier</span>
          </h1>
        </Reveal>

        <Reveal delay={3}>
          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Mariages, anniversaires, soirées privées — <span className="text-white font-medium">MK Évènementiel</span> crée
            l'ambiance qui vous ressemble dans le Pas-de-Calais et les Hauts-de-France.
          </p>
        </Reveal>

        <Reveal delay={4}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GradientButton onClick={scrollToForm}>
              Vérifier la disponibilité
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </GradientButton>
            <a href="#offres" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-2xl text-lg hover:bg-white/10 hover:border-[#00F5A0]/30 transition-all duration-300 text-center backdrop-blur-sm">
              Voir les formules
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────── PREUVE SOCIALE ──────────────────── */
function SocialProof() {
  return (
    <section className="bg-[#242424] border-y border-white/5">
      <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
        <Reveal>
          <p className="text-5xl font-extrabold text-white mb-1"><Counter end={50} suffix="+" /></p>
          <p className="text-neutral-500 text-sm uppercase tracking-wide font-medium">Événements animés</p>
        </Reveal>
        <Reveal delay={1}>
          <p className="text-5xl font-extrabold text-white mb-1"><Counter end={100} suffix="%" /></p>
          <p className="text-neutral-500 text-sm uppercase tracking-wide font-medium">Clients satisfaits</p>
        </Reveal>
        <Reveal delay={2}>
          <p className="text-5xl font-extrabold text-gradient mb-1">5/5</p>
          <p className="text-[#00F5A0] text-sm mb-0.5">★★★★★</p>
          <p className="text-neutral-500 text-sm uppercase tracking-wide font-medium">Note Google</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── VIDÉO ──────────────────────── */
function Video() {
  return (
    <section className="bg-[#2D2D2D] py-24">
      <div className="max-w-4xl mx-auto px-6">
        <Reveal>
          <p className="text-sm font-semibold text-[#00F5A0] uppercase tracking-wider text-center mb-3">Aperçu</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">L'ambiance MK en vidéo</h2>
          <p className="text-neutral-500 text-center mb-12 max-w-xl mx-auto">Un aperçu de ce qu'on fait sur le terrain.</p>
        </Reveal>
        <Reveal delay={1}>
          <div className="relative w-full max-w-xs mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] rounded-[2rem] opacity-20 blur-2xl animate-glow" />
            <div className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-[#242424] shadow-2xl ring-1 ring-white/10">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/__PGkM1oaX0"
                title="MK Évènementiel — Aperçu"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── OFFRES ─────────────────────── */
function Offres() {
  const packs = [
    { name: "Essentiel", price: "À partir de 690€", target: "Petites soirées & anniversaires", features: ["DJ professionnel", "Sonorisation adaptée", "Éclairage d'ambiance", "Échange préalable sur vos goûts"], highlighted: false },
    { name: "Mariage", price: "990€ à 1 290€", target: "Votre jour J, parfaitement orchestré", features: ["DJ + système lumières complet", "Gestion des moments clés", "Préparation musicale sur-mesure", "Coordination avec vos prestataires", "Micro pour discours & animations"], highlighted: true, badge: "Le plus demandé" },
    { name: "Sur-Mesure", price: "À partir de 1 490€", target: "L'expérience complète & immersive", features: ["Tout le pack Mariage inclus", "Son & lumières haut de gamme", "Effets scéniques (fumée, LED, laser)", "DJ set prolongé", "Installation & démontage complets"], highlighted: false },
  ];

  return (
    <section id="offres" className="bg-[#242424] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <p className="text-sm font-semibold text-[#00F5A0] uppercase tracking-wider text-center mb-3">Formules</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">Une offre adaptée à chaque événement</h2>
          <p className="text-neutral-500 text-center mb-14 max-w-xl mx-auto">Choisissez la formule qui vous correspond.</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {packs.map((pack, i) => (
            <Reveal key={pack.name} delay={i + 1}>
              <div className={`relative rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 ${
                pack.highlighted
                  ? "bg-gradient-to-br from-[#00F5A0] to-[#00D9F5] text-[#2D2D2D] shadow-2xl shadow-[#00F5A0]/20 md:-my-4 animate-gradient"
                  : "bg-[#353535] text-white border border-white/5 card-glow hover:shadow-xl hover:shadow-[#00F5A0]/5"
              }`}>
                {pack.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold uppercase tracking-wider bg-[#2D2D2D] text-[#00F5A0] rounded-full whitespace-nowrap shadow-lg border border-[#00F5A0]/20">
                    {pack.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold mb-1 mt-2">Pack {pack.name}</h3>
                <p className={`text-sm mb-5 ${pack.highlighted ? "text-[#2D2D2D]/70" : "text-neutral-500"}`}>{pack.target}</p>
                <p className="text-3xl font-extrabold mb-1">{pack.price}</p>
                <p className={`text-xs mb-7 ${pack.highlighted ? "text-[#2D2D2D]/60" : "text-neutral-600"}`}>Tarif ajusté selon votre événement</p>
                <ul className="space-y-3 mb-8">
                  {pack.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${pack.highlighted ? "text-[#2D2D2D]" : "text-[#00F5A0]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={scrollToForm} className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${
                  pack.highlighted
                    ? "bg-[#2D2D2D] text-[#00F5A0] hover:bg-[#242424] shadow-lg"
                    : "bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-[#2D2D2D] hover:shadow-lg hover:shadow-[#00F5A0]/20"
                }`}>
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

/* ─────────────────── DIFFÉRENCIATION ──────────────────── */
function Differenciation() {
  const points = [
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />, title: "Playlist sur-mesure", text: "On prépare ensemble la musique qui vous ressemble." },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />, title: "Ponctualité & rigueur", text: "Installation en avance, gestion du timing, zéro stress." },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />, title: "Un seul interlocuteur", text: "Un contact unique, réactif, impliqué de A à Z." },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />, title: "Matériel professionnel", text: "Son puissant, jeux de lumières, rendu soigné." },
  ];

  return (
    <section className="bg-[#2D2D2D] py-24">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <p className="text-sm font-semibold text-[#00F5A0] uppercase tracking-wider text-center mb-3">Pourquoi nous</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-14">Ce qui fait la différence</h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i + 1}>
              <div className="flex gap-5 p-6 rounded-2xl bg-[#353535] border border-white/5 card-glow hover:shadow-xl hover:shadow-[#00F5A0]/5 transition-all duration-300 group hover:-translate-y-1">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-[#00F5A0]/10 group-hover:bg-gradient-to-br group-hover:from-[#00F5A0] group-hover:to-[#00D9F5] transition-all duration-300">
                  <svg className="w-6 h-6 text-[#00F5A0] group-hover:text-[#2D2D2D] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">{p.icon}</svg>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{p.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{p.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── AVIS CLIENTS ────────────────────── */
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
    <section id="avis" className="bg-[#242424] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm font-semibold text-neutral-300">5/5 sur Google — 6 avis</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ils nous ont fait confiance</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {temoignages.map((t, i) => (
            <Reveal key={t.name} delay={Math.min(i + 1, 5)}>
              <div className="p-6 rounded-2xl bg-[#353535] border border-white/5 card-glow hover:shadow-xl hover:shadow-[#00F5A0]/5 transition-all duration-300 hover:-translate-y-1">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-[#00F5A0]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-neutral-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <p className="font-semibold text-white text-sm">{t.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── PROCESSUS ──────────────────────── */
function Process() {
  const steps = [
    { num: "1", title: "Demande", text: "Remplissez le formulaire avec les détails de votre événement.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> },
    { num: "2", title: "Disponibilité", text: "On vérifie le planning et on revient vers vous sous 24h.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
    { num: "3", title: "Échange", text: "On discute de vos envies, de l'ambiance, du déroulé.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> },
    { num: "4", title: "Proposition", text: "Devis clair, détaillé, sans engagement.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  ];

  return (
    <section className="bg-[#2D2D2D] py-24">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <p className="text-sm font-semibold text-[#00F5A0] uppercase tracking-wider text-center mb-3">Processus</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-14">Comment ça fonctionne</h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i + 1}>
              <div className="relative p-6 rounded-2xl bg-[#353535] border border-white/5 text-center group card-glow hover:shadow-xl hover:shadow-[#00F5A0]/5 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-xl bg-[#00F5A0]/10 group-hover:bg-gradient-to-br group-hover:from-[#00F5A0] group-hover:to-[#00D9F5] transition-all duration-300">
                  <svg className="w-6 h-6 text-[#00F5A0] group-hover:text-[#2D2D2D] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">{s.icon}</svg>
                </div>
                <span className="text-xs font-bold text-[#00F5A0] uppercase tracking-wider">Étape {s.num}</span>
                <h3 className="font-bold text-white mt-1 mb-2">{s.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── URGENCE ─────────────────────────── */
function Urgence() {
  return (
    <section className="bg-[#242424] py-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <Reveal>
          <div className="relative p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-[#00F5A0] to-[#00D9F5] text-[#2D2D2D] overflow-hidden animate-gradient">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-float-1" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-float-2" />
            <div className="relative z-10">
              <svg className="w-10 h-10 mx-auto mb-5 text-[#2D2D2D]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xl sm:text-2xl font-bold mb-3">Certaines dates sont réservées plusieurs semaines à l'avance</p>
              <p className="text-[#2D2D2D]/70 mb-8 max-w-md mx-auto">Plus tôt vous nous contactez, plus on pourra personnaliser votre prestation.</p>
              <button onClick={scrollToForm} className="px-8 py-4 bg-[#2D2D2D] text-[#00F5A0] font-bold rounded-2xl text-lg hover:bg-[#242424] transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-xl">
                Vérifier la disponibilité
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────── FORMULAIRE ──────────────────────── */
function Formulaire() {
  const [form, setForm] = useState({ nom: "", telephone: "", email: "", date: "", type: "", personnes: "" });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); console.log("Formulaire soumis :", form); setSubmitted(true); };

  if (submitted) {
    return (
      <section id="contact" className="bg-[#2D2D2D] py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="p-12 rounded-2xl bg-[#353535] border border-white/5">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#00F5A0]/10">
              <svg className="w-8 h-8 text-[#00F5A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Demande envoyée !</h2>
            <p className="text-neutral-400">On revient vers vous sous 24h pour vérifier la disponibilité de votre date.</p>
          </div>
        </div>
      </section>
    );
  }

  const inputClass = "w-full px-4 py-3.5 rounded-xl bg-[#2D2D2D] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#00F5A0]/50 focus:ring-2 focus:ring-[#00F5A0]/10 transition-all text-sm";

  return (
    <section id="contact" className="bg-[#2D2D2D] py-24">
      <div className="max-w-2xl mx-auto px-6">
        <Reveal>
          <p className="text-sm font-semibold text-[#00F5A0] uppercase tracking-wider text-center mb-3">Contact</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">Vérifier la disponibilité</h2>
          <p className="text-neutral-500 text-center mb-10 max-w-xl mx-auto">Remplissez ce formulaire, on vous répond sous 24h.</p>
        </Reveal>
        <Reveal delay={1}>
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-2xl bg-[#353535] border border-white/5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input type="text" name="nom" placeholder="Votre nom" required value={form.nom} onChange={handleChange} className={inputClass} />
              <input type="tel" name="telephone" placeholder="Téléphone" required value={form.telephone} onChange={handleChange} className={inputClass} />
            </div>
            <input type="email" name="email" placeholder="Adresse email" required value={form.email} onChange={handleChange} className={inputClass} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input type="date" name="date" required value={form.date} onChange={handleChange} className={inputClass} />
              <select name="type" required value={form.type} onChange={handleChange} className={inputClass}>
                <option value="" disabled>Type d'événement</option>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <input type="number" name="personnes" placeholder="Nombre de personnes estimé" min="1" required value={form.personnes} onChange={handleChange} className={inputClass} />
            <GradientButton type="submit" className="w-full">Envoyer ma demande</GradientButton>
            <p className="text-neutral-600 text-xs text-center">Sans engagement. Réponse garantie sous 24h.</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────── FOOTER ──────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[#242424] border-t border-white/5 py-12">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <MKLogo size={30} />
          <span className="font-bold text-white text-lg tracking-tight">MK Évènementiel</span>
        </div>
        <p className="text-neutral-500 text-sm">DJ & animation événementielle — Pas-de-Calais & Hauts-de-France</p>
        <p className="text-neutral-700 text-xs mt-6">© {new Date().getFullYear()} MK Évènementiel. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

/* ──────────────── BOUTON STICKY MOBILE ────────────────── */
function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-[#2D2D2D] via-[#2D2D2D]/95 to-transparent md:hidden">
      <button onClick={scrollToForm} className="w-full py-4 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-[#2D2D2D] font-bold rounded-2xl text-lg shadow-xl shadow-[#00F5A0]/20 active:scale-[0.98] transition-transform">
        Vérifier la disponibilité
      </button>
    </div>
  );
}

/* ──────────────────────── APP ──────────────────────────── */
export default function App() {
  return (
    <div className="bg-[#2D2D2D] min-h-screen">
      <Nav />
      <Hero />
      <SocialProof />
      <Video />
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
