import { Link } from "wouter";
import { useEffect, useState } from "react";

const FLOAT_ICONS = ["💄","💅","👑","💎","✨","🌸","💋","🪞","💍","🌟","🎀","🧴"];

function FloatingIcon({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <div className="absolute text-2xl pointer-events-none select-none opacity-30"
      style={{
        animationName: "float",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        ...style,
      }}>
      {emoji}
    </div>
  );
}

function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: "4px", height: "4px",
        background: "radial-gradient(circle, #FFD700, #FF69B4)",
        boxShadow: "0 0 6px #FFD700",
        animationName: "float-slow",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        ...style,
      }}
    />
  );
}

export default function Splash() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const floaters = FLOAT_ICONS.map((emoji, i) => ({
    emoji,
    style: {
      top: `${8 + (i * 7.5) % 82}%`,
      left: `${(i * 13 + 5) % 90}%`,
      fontSize: `${1.2 + (i % 3) * 0.6}rem`,
      animationDelay: `${i * 0.4}s`,
      animationDuration: `${3 + (i % 3)}s`,
    } as React.CSSProperties,
  }));

  const particles = Array.from({ length: 20 }).map((_, i) => ({
    style: {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${i * 0.3}s`,
      opacity: 0.4 + Math.random() * 0.4,
    } as React.CSSProperties,
  }));

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, hsl(285 45% 8%) 0%, hsl(330 40% 12%) 40%, hsl(310 35% 10%) 100%)" }}
    >
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, hsl(330 90% 60%), transparent)", filter: "blur(40px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, hsl(270 80% 60%), transparent)", filter: "blur(40px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(43 92% 60%), transparent)", filter: "blur(60px)" }} />
      </div>

      {/* Floating emojis */}
      {floaters.map((f, i) => <FloatingIcon key={i} emoji={f.emoji} style={f.style} />)}

      {/* Sparkle particles */}
      {particles.map((p, i) => <Particle key={i} style={p.style} />)}

      {/* Main content */}
      <div className={`relative z-10 flex flex-col items-center px-6 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Crown icon */}
        <div className="text-7xl mb-4 animate-float" style={{ animationDuration: "3s", filter: "drop-shadow(0 0 20px rgba(255,215,0,0.6))" }}>
          👑
        </div>

        {/* Title */}
        <div className="mb-2">
          <p className="text-white/60 text-sm font-sans font-bold tracking-[0.3em] uppercase mb-1">Beauty Salon</p>
          <h1 className="font-fredoka text-shimmer leading-none" style={{ fontSize: "clamp(2.5rem, 10vw, 4rem)" }}>
            GLAM EMPIRE
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-white/50 text-sm font-semibold mt-2 mb-8 tracking-wide">
          Build Your Beauty Empire ✨
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-10 max-w-xs">
          {["10,000+ Levels", "VIP Customers", "Salon Upgrades", "Daily Rewards"].map(f => (
            <span key={f} className="chip glass-card text-white/70 border border-white/10">{f}</span>
          ))}
        </div>

        {/* Play button */}
        <Link href="/hub">
          <button
            className="relative w-64 py-5 rounded-2xl font-fredoka text-2xl text-white shadow-2xl animate-pulse-gold tap-scale overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsl(43 95% 55%), hsl(38 90% 65%))", color: "#1a0a00" }}
          >
            <span className="relative z-10">✨ Play Now ✨</span>
            <div className="absolute inset-0 opacity-30"
              style={{ background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)", backgroundSize: "200% 100%", animation: "shimmer-bg 2s infinite" }} />
          </button>
        </Link>

        {/* Stats bar */}
        <div className="flex gap-8 mt-10">
          {[
            { label: "Levels", value: "10,000+" },
            { label: "Customers", value: "20+" },
            { label: "Upgrades", value: "25+" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-fredoka text-gold">{s.value}</div>
              <div className="text-xs text-white/40 font-semibold uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin link */}
      <Link href="/admin">
        <button className="absolute bottom-6 right-6 text-white/20 text-xs font-semibold hover:text-white/40 transition-colors">
          Admin
        </button>
      </Link>
    </div>
  );
}
