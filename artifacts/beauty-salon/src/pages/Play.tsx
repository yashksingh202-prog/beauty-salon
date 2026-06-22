import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useGame } from "@/context/GameContext";
import { generateLevel, ServiceType } from "@/data/levels";
import { Customer } from "@/data/customers";

// ── Service data ─────────────────────────────────────────────────────────────

const FOUNDATION_FINISHES = [
  { id: "natural", emoji: "✨", label: "Natural", desc: "Everyday radiance" },
  { id: "matte",   emoji: "🖤", label: "Matte",   desc: "Flawless & smooth" },
  { id: "dewy",    emoji: "💧", label: "Dewy",    desc: "Fresh & hydrated" },
  { id: "glowy",   emoji: "🌟", label: "Glowy",   desc: "Luminous shimmer" },
];

const EYE_STYLES = [
  { id: "natural",  emoji: "🌸", label: "Natural",  desc: "Soft & subtle" },
  { id: "smoky",    emoji: "🖤", label: "Smoky",    desc: "Dark & intense" },
  { id: "colorful", emoji: "🌈", label: "Colorful", desc: "Bold & bright" },
  { id: "dramatic", emoji: "✨", label: "Dramatic", desc: "Striking impact" },
];

const LIP_STYLES = [
  { id: "natural", emoji: "🌸", label: "Natural", desc: "Barely-there" },
  { id: "matte",   emoji: "🖤", label: "Matte",   desc: "Velvety bold" },
  { id: "glossy",  emoji: "💋", label: "Glossy",  desc: "Luscious shine" },
  { id: "bold",    emoji: "🔴", label: "Bold",    desc: "Statement lip" },
];

const HAIR_STYLES = [
  { id: "straight", emoji: "💇", label: "Straight", desc: "Sleek & polished" },
  { id: "waves",    emoji: "🌊", label: "Waves",    desc: "Effortless chic" },
  { id: "curls",    emoji: "💫", label: "Curls",    desc: "Romantic bouncy" },
  { id: "updo",     emoji: "👑", label: "Updo",     desc: "Elegant formal" },
  { id: "bob",      emoji: "✂️", label: "Bob",      desc: "Modern fresh" },
  { id: "braided",  emoji: "🎀", label: "Braided",  desc: "Artistic unique" },
];

const NAIL_DESIGNS = [
  { id: "plain",    emoji: "💅", label: "Plain",    desc: "Clean & simple" },
  { id: "french",   emoji: "✨", label: "French",   desc: "Classic elegance" },
  { id: "gradient", emoji: "🌅", label: "Gradient", desc: "Ombré fade" },
  { id: "art",      emoji: "🎨", label: "Nail Art", desc: "Unique & creative" },
];

const OUTFIT_OPTIONS = [
  { id: "casual_chic",  emoji: "👗", label: "Casual Chic",  desc: "Effortless style" },
  { id: "power_suit",   emoji: "💼", label: "Power Suit",   desc: "Bold authority" },
  { id: "evening_gown", emoji: "🥂", label: "Evening Gown", desc: "Red carpet glam" },
  { id: "bohemian",     emoji: "🌸", label: "Bohemian",     desc: "Free-spirited" },
];

const ACCESSORY_OPTIONS = [
  { id: "tiara",        emoji: "👸", label: "Tiara",         desc: "Royal princess" },
  { id: "veil",         emoji: "💍", label: "Veil",          desc: "Traditional bridal" },
  { id: "flower_crown", emoji: "🌸", label: "Flower Crown",  desc: "Garden romance" },
  { id: "minimalist",   emoji: "✨", label: "Minimalist",    desc: "Simple elegance" },
];

const COLOR_SWATCHES: Record<ServiceType, { id: string; hex: string; label: string }[]> = {
  foundation: [
    { id: "fair",   hex: "#FFE4CC", label: "Fair"   },
    { id: "light",  hex: "#FFD1A8", label: "Light"  },
    { id: "medium", hex: "#D4956A", label: "Medium" },
    { id: "tan",    hex: "#B87049", label: "Tan"    },
    { id: "deep",   hex: "#8B4513", label: "Deep"   },
    { id: "rich",   hex: "#5C2D0A", label: "Rich"   },
  ],
  eyes: [
    { id: "brown",  hex: "#8B4513", label: "Brown"  },
    { id: "black",  hex: "#2C2C2C", label: "Black"  },
    { id: "gold",   hex: "#FFD700", label: "Gold"   },
    { id: "pink",   hex: "#FF69B4", label: "Pink"   },
    { id: "purple", hex: "#9370DB", label: "Purple" },
    { id: "blue",   hex: "#4169E1", label: "Blue"   },
    { id: "green",  hex: "#3CB371", label: "Green"  },
    { id: "silver", hex: "#C0C0C0", label: "Silver" },
  ],
  lips: [
    { id: "nude",   hex: "#C09280", label: "Nude"   },
    { id: "pink",   hex: "#FF69B4", label: "Pink"   },
    { id: "red",    hex: "#DC143C", label: "Red"    },
    { id: "coral",  hex: "#FF7F50", label: "Coral"  },
    { id: "berry",  hex: "#9B2335", label: "Berry"  },
    { id: "peach",  hex: "#FFCBA4", label: "Peach"  },
    { id: "plum",   hex: "#9A4EAE", label: "Plum"   },
    { id: "rose",   hex: "#FF007F", label: "Rose"   },
  ],
  hair: [
    { id: "black",    hex: "#1a1a1a", label: "Black"    },
    { id: "brunette", hex: "#5C4033", label: "Brunette" },
    { id: "chestnut", hex: "#954535", label: "Chestnut" },
    { id: "auburn",   hex: "#A52A2A", label: "Auburn"   },
    { id: "golden",   hex: "#FFD700", label: "Golden"   },
    { id: "ash",      hex: "#B0A0B0", label: "Ash"      },
    { id: "silver",   hex: "#C0C0C0", label: "Silver"   },
    { id: "pink",     hex: "#FF69B4", label: "Pink"     },
  ],
  nails: [
    { id: "nude",   hex: "#C09280", label: "Nude"   },
    { id: "pink",   hex: "#FF69B4", label: "Pink"   },
    { id: "red",    hex: "#DC143C", label: "Red"    },
    { id: "purple", hex: "#9370DB", label: "Purple" },
    { id: "blue",   hex: "#4169E1", label: "Blue"   },
    { id: "gold",   hex: "#FFD700", label: "Gold"   },
    { id: "black",  hex: "#2C2C2C", label: "Black"  },
    { id: "white",  hex: "#F0F0F0", label: "White"  },
  ],
  outfit:      [],
  accessories: [],
};

const SERVICE_META: Record<ServiceType, { label: string; emoji: string; hint: string }> = {
  foundation:  { label: "Foundation",   emoji: "✨", hint: "skin prep" },
  eyes:        { label: "Eye Makeup",   emoji: "👁️", hint: "eye style" },
  lips:        { label: "Lip Color",    emoji: "💋", hint: "lip look" },
  hair:        { label: "Hair Styling", emoji: "💇", hint: "hair style" },
  nails:       { label: "Nail Art",     emoji: "💅", hint: "nail design" },
  outfit:      { label: "Outfit",       emoji: "👗", hint: "fashion choice" },
  accessories: { label: "Accessories",  emoji: "💍", hint: "bridal extras" },
};

// ── Scoring ───────────────────────────────────────────────────────────────────

function scoreService(service: ServiceType, customer: Customer, style: string): number {
  const prefs: Partial<Record<ServiceType, string>> = {
    foundation: customer.preferredFoundation,
    eyes:       customer.preferredEyeStyle,
    lips:       customer.preferredLipStyle,
    hair:       customer.preferredHairStyle,
    nails:      customer.preferredNailDesign,
  };
  const pref = prefs[service];
  if (!pref) return 65 + Math.floor(Math.random() * 30);

  if (style === pref) return 88 + Math.floor(Math.random() * 12);

  const adjacentMap: Record<string, string[]> = {
    natural: ["dewy","glossy"],  dewy: ["natural","glowy"],  glowy: ["dewy"],  matte: ["natural"],
    smoky: ["dramatic"], dramatic: ["smoky","colorful"], colorful: ["dramatic"],
    glossy: ["natural","bold"], bold: ["matte","glossy"],
    waves: ["curls","straight"], curls: ["waves"], straight: ["waves","bob"], updo: ["curls"], bob: ["straight"],
    french: ["plain"], gradient: ["art"], art: ["gradient"], plain: ["french"],
  };
  const adjacent = adjacentMap[pref] ?? [];
  if (adjacent.includes(style)) return 62 + Math.floor(Math.random() * 18);

  return 25 + Math.floor(Math.random() * 25);
}

// ── Confetti ──────────────────────────────────────────────────────────────────

function Confetti() {
  const COLORS = ["#FF4D94","#C084FC","#FFD700","#FF6B35","#34D399","#60A5FA"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="absolute animate-confetti rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            width:  `${6 + Math.random() * 8}px`,
            height: `${8 + Math.random() * 12}px`,
            background: COLORS[i % COLORS.length],
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }} />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Phase = "intro" | "playing" | "transition" | "results";

export default function Play() {
  const [, params] = useRoute("/play/:levelId");
  const [, setLocation] = useLocation();
  const { completeLevel, checkAchievements, getQualityBonus } = useGame();

  const levelId = parseInt(params?.levelId ?? "1", 10);
  const level = generateLevel(levelId);
  const { customer, services, coinReward, gemReward, xpReward, starThresholds } = level;

  const [phase, setPhase] = useState<Phase>("intro");
  const [serviceIdx, setServiceIdx] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [serviceScores, setServiceScores] = useState<number[]>([]);
  const [showTransition, setShowTransition] = useState(false);
  const [starsRevealed, setStarsRevealed] = useState(0);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  const currentService = services[serviceIdx];
  const totalScore = serviceScores.length > 0
    ? Math.round(serviceScores.reduce((a, b) => a + b, 0) / serviceScores.length + getQualityBonus() * 0.1)
    : 0;
  const stars = totalScore >= starThresholds.three ? 3 : totalScore >= starThresholds.two ? 2 : totalScore >= starThresholds.one ? 1 : 0;
  const earnedCoins = Math.round(coinReward * (totalScore / 100));
  const earnedGems = stars === 3 ? gemReward : stars === 2 ? Math.floor(gemReward / 2) : 0;

  useEffect(() => {
    if (phase !== "results") return;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setStarsRevealed(i);
      if (i >= stars) clearInterval(t);
    }, 400);
    return () => clearInterval(t);
  }, [phase, stars]);

  function handleStartService() {
    setPhase("playing");
    setSelectedStyle(null);
    setSelectedColor(null);
  }

  function handleConfirmChoice() {
    if (!selectedStyle) return;
    const score = scoreService(currentService, customer, selectedStyle);
    const newScores = [...serviceScores, score];
    setServiceScores(newScores);
    setShowTransition(true);
    setTimeout(() => {
      setShowTransition(false);
      if (serviceIdx + 1 < services.length) {
        setServiceIdx(serviceIdx + 1);
        setSelectedStyle(null);
        setSelectedColor(null);
      } else {
        setPhase("results");
        const finalScore = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);
        const finalStars = finalScore >= starThresholds.three ? 3 : finalScore >= starThresholds.two ? 2 : finalScore >= starThresholds.one ? 1 : 0;
        const coins = Math.round(coinReward * (finalScore / 100));
        const gems  = finalStars === 3 ? gemReward : finalStars === 2 ? Math.floor(gemReward / 2) : 0;
        completeLevel(levelId, finalStars, finalScore, level.challengeType, customer.isVIP, coins, gems, xpReward);
        const unlocked = checkAchievements();
        if (unlocked.length > 0) setNewAchievements(unlocked);
      }
    }, 600);
  }

  function getStyleOptions() {
    switch (currentService) {
      case "foundation":  return FOUNDATION_FINISHES;
      case "eyes":        return EYE_STYLES;
      case "lips":        return LIP_STYLES;
      case "hair":        return HAIR_STYLES;
      case "nails":       return NAIL_DESIGNS;
      case "outfit":      return OUTFIT_OPTIONS;
      case "accessories": return ACCESSORY_OPTIONS;
      default:            return [];
    }
  }

  function getHint() {
    const hints: Partial<Record<ServiceType, string>> = {
      foundation:  `Prefers: ${customer.preferredFoundation} finish`,
      eyes:        `Prefers: ${customer.preferredEyeStyle} eyes`,
      lips:        `Prefers: ${customer.preferredLipStyle} lips`,
      hair:        `Prefers: ${customer.preferredHairStyle} hair`,
      nails:       `Prefers: ${customer.preferredNailDesign} nails`,
      outfit:      `Personality: ${customer.personality}`,
      accessories: `Challenge: ${level.challengeType}`,
    };
    return hints[currentService] ?? "";
  }

  const bgStyle = { background: "linear-gradient(160deg,hsl(285 45% 8%),hsl(330 40% 11%),hsl(310 35% 9%))" };

  // ── INTRO PHASE ──────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-screen flex flex-col" style={bgStyle}>
        <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
          {/* Customer big portrait */}
          <div className="relative mb-6">
            <div className="text-8xl animate-float" style={{ filter: "drop-shadow(0 0 30px rgba(255,80,150,0.5))" }}>
              {customer.emoji}
            </div>
            {/* Emotion badge */}
            <div className="absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-xs font-bold"
              style={{ background: "linear-gradient(135deg,#ff4d94,#c084fc)" }}>
              {({
                excited: "😍 Excited",  nervous: "😰 Nervous",
                impatient: "😤 Rushed", happy: "😊 Happy",
                demanding: "👑 Demanding", sweet: "🌸 Sweet", dramatic: "🎭 Dramatic"
              } as Record<string,string>)[customer.emotion] ?? `✨ ${customer.emotion}`}
            </div>
          </div>

          {/* Customer info card */}
          <div className="w-full max-w-xs rounded-3xl p-5 mb-6 glass-card-pink animate-slide-up">
            <div className="font-fredoka text-white text-2xl mb-1">{customer.name}</div>
            <div className="text-pink-300 text-xs font-bold uppercase tracking-widest mb-3">{customer.title}</div>
            <p className="text-white/70 text-sm leading-relaxed mb-3">"{customer.dialogues.arrival}"</p>
            <p className="text-white/40 text-xs leading-relaxed">{customer.backstory}</p>
          </div>

          {/* Services needed */}
          <div className="mb-6">
            <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Services Needed</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {services.map(s => (
                <span key={s} className="chip glass-card text-white/80 border border-white/10">
                  {SERVICE_META[s].emoji} {SERVICE_META[s].label}
                </span>
              ))}
            </div>
          </div>

          {/* Rewards preview */}
          <div className="flex gap-4 mb-8 text-sm font-bold">
            <span className="text-yellow-300">🪙 up to {coinReward.toLocaleString()}</span>
            {gemReward > 0 && <span className="text-purple-300">💎 +{gemReward}</span>}
            <span className="text-green-300">⭐ {xpReward} XP</span>
          </div>

          {/* Start button */}
          <button onClick={handleStartService}
            className="w-full max-w-xs py-5 rounded-2xl font-fredoka text-2xl text-white shadow-2xl animate-pulse-glow tap-scale"
            style={{ background: "linear-gradient(135deg,#ff4d94,#c084fc)" }}>
            Begin Makeover ✨
          </button>

          <button onClick={() => setLocation("/hub")} className="mt-4 text-white/30 text-sm tap-scale">
            ← Back to Salon
          </button>
        </div>
      </div>
    );
  }

  // ── TRANSITION ───────────────────────────────────────────────────────────────
  if (showTransition) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
        <div className="text-center animate-bounce-in">
          <div className="text-6xl mb-4">✨</div>
          <div className="font-fredoka text-white text-2xl">Service Complete!</div>
          <div className="text-white/50 mt-1">Score: {serviceScores[serviceScores.length - 1] ?? 0}/100</div>
        </div>
      </div>
    );
  }

  // ── PLAYING PHASE ────────────────────────────────────────────────────────────
  if (phase === "playing") {
    const styleOptions = getStyleOptions();
    const colors = COLOR_SWATCHES[currentService] ?? [];
    const meta = SERVICE_META[currentService];
    const needsColor = colors.length > 0;

    return (
      <div className="min-h-screen flex flex-col" style={bgStyle}>
        {/* Progress header */}
        <div className="px-4 pt-10 pb-4"
          style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)" }}>
          <div className="flex items-center gap-2 mb-3">
            <button onClick={() => setLocation("/hub")} className="text-white/40 text-sm">←</button>
            <div className="flex gap-1.5 flex-1 justify-center">
              {services.map((s, i) => (
                <div key={s} className="h-1.5 rounded-full flex-1 max-w-8 transition-all duration-300"
                  style={{
                    background: i < serviceIdx ? "#ff4d94" : i === serviceIdx ? "#c084fc" : "rgba(255,255,255,0.12)",
                    boxShadow: i === serviceIdx ? "0 0 8px #c084fc" : undefined,
                  }} />
              ))}
            </div>
            <span className="text-white/40 text-xs font-bold">{serviceIdx + 1}/{services.length}</span>
          </div>

          {/* Customer mini */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">{customer.emoji}</span>
            <div>
              <div className="font-fredoka text-white text-sm">{customer.name}</div>
              <div className="text-pink-300/80 text-xs italic">{getHint()}</div>
            </div>
            <div className="ml-auto">
              <div className="text-white/50 text-xs font-bold mb-0.5">{meta.emoji} {meta.label}</div>
            </div>
          </div>
        </div>

        {/* Service choice area */}
        <div className="flex-1 px-4 py-4 overflow-y-auto no-scrollbar">

          {/* Customer dialogue */}
          <div className="rounded-2xl p-3 mb-4 glass-card border border-white/10">
            <p className="text-white/70 text-sm italic text-center">
              "{customer.dialogues.excited}"
            </p>
          </div>

          {/* Style options */}
          <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Choose Style</div>
          <div className={`grid gap-2 mb-4 ${styleOptions.length <= 4 ? "grid-cols-2" : "grid-cols-3"}`}>
            {styleOptions.map(opt => {
              const sel = selectedStyle === opt.id;
              return (
                <button key={opt.id} onClick={() => setSelectedStyle(opt.id)}
                  className="flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl tap-scale transition-all duration-200"
                  style={{
                    background: sel ? "linear-gradient(135deg,rgba(255,80,150,0.3),rgba(180,80,255,0.2))" : "rgba(255,255,255,0.05)",
                    border: sel ? "2px solid #ff4d94" : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: sel ? "0 0 16px rgba(255,80,150,0.4)" : undefined,
                    transform: sel ? "scale(1.04)" : undefined,
                  }}>
                  <span className="text-3xl">{opt.emoji}</span>
                  <span className="text-white text-xs font-bold">{opt.label}</span>
                  <span className="text-white/40 text-[10px] text-center">{opt.desc}</span>
                  {sel && <div className="text-pink-400 text-sm">✓</div>}
                </button>
              );
            })}
          </div>

          {/* Color palette (if applicable) */}
          {needsColor && (
            <>
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Choose Color</div>
              <div className="flex flex-wrap gap-2.5 mb-4">
                {colors.map(c => {
                  const sel = selectedColor === c.id;
                  return (
                    <button key={c.id} onClick={() => setSelectedColor(c.id)}
                      className="flex flex-col items-center gap-1 tap-scale"
                      title={c.label}>
                      <div className="w-9 h-9 rounded-full transition-all duration-200"
                        style={{
                          background: c.hex,
                          border: sel ? "3px solid white" : "2px solid rgba(255,255,255,0.2)",
                          boxShadow: sel ? `0 0 12px ${c.hex}, 0 0 24px ${c.hex}60` : undefined,
                          transform: sel ? "scale(1.2)" : undefined,
                        }} />
                      <span className="text-white/40 text-[9px] font-bold">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Score preview */}
          {selectedStyle && (
            <div className="rounded-2xl p-3 mb-4 animate-slide-up glass-card border border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/60 text-xs font-bold">Preview Score</span>
                <span className="text-pink-300 text-xs font-bold">
                  {selectedStyle === (
                    ({ foundation: customer.preferredFoundation, eyes: customer.preferredEyeStyle,
                      lips: customer.preferredLipStyle, hair: customer.preferredHairStyle,
                      nails: customer.preferredNailDesign } as Record<string, string | undefined>)[currentService]
                  ) ? "✨ Perfect Match!" : "Good choice"}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-full rounded-full transition-all duration-500 progress-glow"
                  style={{
                    width: selectedStyle === (
                      ({ foundation: customer.preferredFoundation, eyes: customer.preferredEyeStyle,
                        lips: customer.preferredLipStyle, hair: customer.preferredHairStyle,
                        nails: customer.preferredNailDesign } as Record<string, string | undefined>)[currentService]
                    ) ? "90%" : "55%",
                    background: "linear-gradient(90deg,#ff4d94,#c084fc)",
                  }} />
              </div>
            </div>
          )}
        </div>

        {/* Confirm button */}
        <div className="px-4 pb-8 pt-2" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)" }}>
          <button
            onClick={handleConfirmChoice}
            disabled={!selectedStyle}
            className="w-full py-4 rounded-2xl font-fredoka text-xl text-white transition-all duration-200 tap-scale"
            style={{
              background: selectedStyle ? "linear-gradient(135deg,#ff4d94,#c084fc)" : "rgba(255,255,255,0.1)",
              opacity: selectedStyle ? 1 : 0.5,
              boxShadow: selectedStyle ? "0 0 20px rgba(255,80,150,0.5)" : undefined,
            }}>
            {serviceIdx + 1 < services.length ? `Next: ${SERVICE_META[services[serviceIdx + 1]].label} →` : "Finish Makeover ✨"}
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTS PHASE ─────────────────────────────────────────────────────────────
  const reaction = totalScore >= 85 ? customer.dialogues.happy
    : totalScore >= 60 ? customer.dialogues.neutral
    : customer.dialogues.disappointed;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center" style={bgStyle}>
      {stars === 3 && <Confetti />}

      <div className="w-full max-w-sm">
        {/* Customer reaction */}
        <div className="text-7xl mb-4 animate-bounce-in"
          style={{ filter: `drop-shadow(0 0 30px rgba(255,${stars === 3 ? "200,60" : "80,150"},0.6))` }}>
          {customer.emoji}
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-3 mb-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="text-5xl transition-all duration-300"
              style={{
                opacity: starsRevealed >= n ? 1 : 0.15,
                transform: starsRevealed >= n ? "scale(1)" : "scale(0.5)",
                filter: starsRevealed >= n ? "drop-shadow(0 0 12px #FFD700)" : undefined,
                animationDelay: `${n * 0.4}s`,
              }}>
              {n <= stars ? "⭐" : "☆"}
            </div>
          ))}
        </div>

        {/* Score */}
        <div className="font-fredoka text-white text-5xl mb-1 animate-slide-up">{totalScore}%</div>
        <div className="text-white/50 text-sm mb-4">
          {totalScore >= 85 ? "Flawless!" : totalScore >= 65 ? "Great Job!" : totalScore >= 45 ? "Not Bad!" : "Keep Practicing!"}
        </div>

        {/* Customer dialogue */}
        <div className="rounded-2xl p-4 mb-5 glass-card-pink animate-slide-up">
          <p className="text-white text-sm italic">"{reaction}"</p>
          <p className="text-pink-300/60 text-xs mt-2 font-semibold">— {customer.name}</p>
        </div>

        {/* Achievement unlocks */}
        {newAchievements.length > 0 && (
          <div className="rounded-2xl p-3 mb-4 animate-bounce-in text-center"
            style={{ background: "linear-gradient(135deg,rgba(255,200,60,0.25),rgba(255,150,0,0.15))", border: "1px solid rgba(255,200,60,0.4)" }}>
            <div className="font-fredoka text-yellow-300 text-sm mb-1">🏆 Achievement Unlocked!</div>
            {newAchievements.map(id => (
              <div key={id} className="text-white/80 text-xs">✨ {id.replace(/_/g," ")}</div>
            ))}
          </div>
        )}

        {/* Rewards */}
        <div className="flex justify-center gap-4 mb-6 animate-slide-up">
          <div className="rounded-2xl px-4 py-3 text-center glass-card-gold">
            <div className="text-2xl font-fredoka text-yellow-300">+{earnedCoins.toLocaleString()}</div>
            <div className="text-yellow-200/60 text-xs font-bold">COINS 🪙</div>
          </div>
          {earnedGems > 0 && (
            <div className="rounded-2xl px-4 py-3 text-center glass-card">
              <div className="text-2xl font-fredoka text-purple-300">+{earnedGems}</div>
              <div className="text-purple-200/60 text-xs font-bold">GEMS 💎</div>
            </div>
          )}
          <div className="rounded-2xl px-4 py-3 text-center glass-card">
            <div className="text-2xl font-fredoka text-green-300">+{xpReward}</div>
            <div className="text-green-200/60 text-xs font-bold">XP ⭐</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button onClick={() => setLocation(`/play/${levelId + 1}`)}
            className="w-full py-4 rounded-2xl font-fredoka text-xl text-white tap-scale animate-pulse-glow"
            style={{ background: "linear-gradient(135deg,#ff4d94,#c084fc)" }}>
            Next Client ✨
          </button>
          <div className="flex gap-3">
            <button onClick={() => {
              setPhase("intro");
              setServiceIdx(0);
              setSelectedStyle(null);
              setSelectedColor(null);
              setServiceScores([]);
              setStarsRevealed(0);
            }}
              className="flex-1 py-3 rounded-2xl font-semibold text-white/70 glass-card tap-scale">
              ↻ Retry
            </button>
            <button onClick={() => setLocation("/hub")}
              className="flex-1 py-3 rounded-2xl font-semibold text-white/70 glass-card tap-scale">
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
