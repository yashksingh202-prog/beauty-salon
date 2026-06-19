import { useState, useRef, useCallback, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useGame } from "@/context/GameContext";
import { getLevelById, DIFFICULTY_BG, StepType } from "@/data/levels";
import CoinBar from "@/components/CoinBar";
import { ChevronLeft, Star, Coins, Zap, Check } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const PALETTE_COLORS = ["#FF6B9D","#C084FC","#FB923C","#F472B6","#F43F5E","#A78BFA","#FBBF24","#34D399"];

// ── Shaving / Washing step ──────────────────────────────────────────────────
const GRID_COLS = 12;
const GRID_ROWS = 14;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

function ScrubStep({
  type,
  onComplete,
}: {
  type: "shaving" | "washing";
  onComplete: () => void;
}) {
  const [cleaned, setCleaned] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const isPointerDown = useRef(false);
  const completed = useRef(false);

  const getCellIdx = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return -1;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const col = Math.floor((x / rect.width) * GRID_COLS);
    const row = Math.floor((y / rect.height) * GRID_ROWS);
    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) return -1;
    return row * GRID_COLS + col;
  }, []);

  const scrub = useCallback(
    (clientX: number, clientY: number) => {
      const idx = getCellIdx(clientX, clientY);
      if (idx === -1) return;
      setCleaned((prev) => {
        if (prev.has(idx)) return prev;
        const next = new Set(prev);
        next.add(idx);
        // Also clean adjacent cells for smoother feel
        [idx - 1, idx + 1, idx - GRID_COLS, idx + GRID_COLS].forEach((n) => {
          if (n >= 0 && n < TOTAL_CELLS) next.add(n);
        });
        if (!completed.current && next.size >= TOTAL_CELLS * 0.88) {
          completed.current = true;
          setTimeout(onComplete, 400);
        }
        return next;
      });
    },
    [getCellIdx, onComplete]
  );

  const pct = Math.min(100, Math.round((cleaned.size / TOTAL_CELLS) * 1000));

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-semibold text-muted-foreground">
        {type === "shaving" ? "Swipe to shave!" : "Rub to clean the face!"}
      </p>

      {/* Progress */}
      <div className="w-full">
        <Progress value={pct} className="h-3 [&>div]:bg-primary" />
        <p className="text-xs text-center text-muted-foreground mt-1">{pct}% done</p>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        data-testid="scrub-canvas"
        className="relative w-full rounded-3xl overflow-hidden select-none touch-none"
        style={{
          aspectRatio: `${GRID_COLS}/${GRID_ROWS}`,
          background: type === "shaving"
            ? "linear-gradient(135deg, hsl(43 50% 82%), hsl(30 40% 78%))"
            : "linear-gradient(135deg, hsl(30 60% 75%), hsl(20 50% 70%))",
        }}
        onPointerDown={(e) => { isPointerDown.current = true; scrub(e.clientX, e.clientY); (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => { if (isPointerDown.current) scrub(e.clientX, e.clientY); }}
        onPointerUp={() => { isPointerDown.current = false; }}
      >
        {/* Dirt / stubble overlay cells */}
        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` }}
        >
          {Array.from({ length: TOTAL_CELLS }, (_, i) => (
            <div
              key={i}
              className="transition-opacity duration-150"
              style={{
                opacity: cleaned.has(i) ? 0 : 1,
                backgroundColor: type === "shaving"
                  ? `hsl(220 10% ${30 + (i % 3) * 5}% / 0.6)`
                  : `hsl(25 50% ${40 + (i % 4) * 5}% / 0.55)`,
                borderRadius: type === "shaving" ? "1px" : "50%",
              }}
            />
          ))}
        </div>

        {/* Face outline */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-28 rounded-full border-4 border-white/40" />
        </div>
      </div>
    </div>
  );
}

// ── Makeup step ──────────────────────────────────────────────────────────────
const MAKEUP_AREAS = [
  { id: "lips",      label: "Lips",       cx: 50, cy: 72, rx: 20, ry: 8 },
  { id: "left_eye",  label: "Left Eye",   cx: 32, cy: 42, rx: 14, ry: 7 },
  { id: "right_eye", label: "Right Eye",  cx: 68, cy: 42, rx: 14, ry: 7 },
  { id: "left_blush",label: "Blush L",    cx: 22, cy: 58, rx: 12, ry: 8 },
  { id: "right_blush",label: "Blush R",   cx: 78, cy: 58, rx: 12, ry: 8 },
];

function MakeupStep({ onComplete }: { onComplete: () => void }) {
  const [applied, setApplied] = useState<Record<string, string>>({});
  const [activeColor, setActiveColor] = useState(PALETTE_COLORS[0]);

  const handleApply = (id: string) => {
    const next = { ...applied, [id]: activeColor };
    setApplied(next);
    if (Object.keys(next).length >= MAKEUP_AREAS.length) {
      setTimeout(onComplete, 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-semibold text-muted-foreground">Tap each area to apply makeup!</p>

      {/* Face SVG */}
      <svg viewBox="0 0 1000 1000" className="w-48 h-48">
        {/* Skin */}
        <ellipse cx="50" cy="55" rx="38" ry="44" fill="hsl(43 50% 82%)" />
        {/* Makeup areas */}
        {MAKEUP_AREAS.map((area) => (
          <ellipse
            key={area.id}
            cx={area.cx} cy={area.cy}
            rx={area.rx} ry={area.ry}
            fill={applied[area.id] ?? "rgba(255,255,255,0.2)"}
            stroke={applied[area.id] ? "none" : "rgba(200,100,150,0.5)"}
            strokeWidth="1"
            strokeDasharray={applied[area.id] ? "0" : "2,2"}
            style={{ cursor: "pointer", transition: "fill 0.3s" }}
            onClick={() => handleApply(area.id)}
            data-testid={`makeup-${area.id}`}
          />
        ))}
        {/* Eyes base */}
        <ellipse cx="32" cy="38" rx="8" ry="6" fill="hsl(220 20% 25%)" />
        <ellipse cx="68" cy="38" rx="8" ry="6" fill="hsl(220 20% 25%)" />
        <circle cx="34" cy="37" r="2" fill="white" />
        <circle cx="70" cy="37" r="2" fill="white" />
        {/* Nose */}
        <path d="M48,52 Q50,58 52,52" fill="none" stroke="hsl(30 40% 65%)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Progress */}
      <p className="text-xs text-muted-foreground">{Object.keys(applied).length}/{MAKEUP_AREAS.length} areas done</p>

      {/* Color palette */}
      <div className="flex gap-2 flex-wrap justify-center">
        {PALETTE_COLORS.map((c) => (
          <button
            key={c}
            data-testid={`palette-${c}`}
            onClick={() => setActiveColor(c)}
            className={`w-8 h-8 rounded-full border-4 transition-transform active:scale-90 ${
              activeColor === c ? "border-foreground scale-110" : "border-transparent"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Hairstyle step ───────────────────────────────────────────────────────────
const HAIRSTYLES = [
  { id: "bun",      label: "Bun",       color: "#8B5E3C", path: "M30,30 Q50,10 70,30 Q80,45 50,40 Q20,45 30,30" },
  { id: "wavy",     label: "Wavy",      color: "#C68642", path: "M20,35 Q30,15 50,20 Q70,15 80,35 Q90,55 80,70 L70,75 Q50,80 30,75 L20,70 Q10,55 20,35" },
  { id: "short",    label: "Short",     color: "#4A3728", path: "M25,40 Q28,20 50,18 Q72,20 75,40 Q75,50 65,52 Q50,54 35,52 Q25,50 25,40" },
  { id: "ponytail", label: "Ponytail",  color: "#A0522D", path: "M22,38 Q25,15 50,12 Q75,15 78,38 Q78,50 70,55 L75,75 Q72,80 68,77 L65,55 Q50,58 35,55 Q22,50 22,38" },
];

function HairstyleStep({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
    setTimeout(onComplete, 600);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-semibold text-muted-foreground">Pick a hairstyle!</p>
      <div className="grid grid-cols-2 gap-3 w-full">
        {HAIRSTYLES.map((style) => (
          <button
            key={style.id}
            data-testid={`style-${style.id}`}
            onClick={() => handleSelect(style.id)}
            className={`rounded-2xl p-3 border-2 transition-all active:scale-95 ${
              selected === style.id ? "border-primary bg-primary/10" : "border-border bg-card"
            }`}
          >
            <svg viewBox="0 0 1000 90" className="w-full h-20">
              <ellipse cx="50" cy="60" rx="30" ry="28" fill="hsl(43 50% 82%)" />
              <path d={style.path} fill={style.color} />
            </svg>
            <p className="text-xs font-semibold mt-1 text-foreground">{style.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Outfit step ──────────────────────────────────────────────────────────────
const OUTFITS = [
  { id: "princess", label: "Princess",  color1: "#FF6B9D", color2: "#FFB3D1" },
  { id: "casual",   label: "Casual",    color1: "#60A5FA", color2: "#BFDBFE" },
  { id: "sporty",   label: "Sporty",    color1: "#34D399", color2: "#A7F3D0" },
  { id: "formal",   label: "Formal",    color1: "#8B5CF6", color2: "#DDD6FE" },
];

function OutfitStep({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
    setTimeout(onComplete, 600);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-semibold text-muted-foreground">Choose an outfit!</p>
      <div className="grid grid-cols-2 gap-3 w-full">
        {OUTFITS.map((outfit) => (
          <button
            key={outfit.id}
            data-testid={`outfit-${outfit.id}`}
            onClick={() => handleSelect(outfit.id)}
            className={`rounded-2xl p-3 border-2 transition-all active:scale-95 ${
              selected === outfit.id ? "border-primary bg-primary/10" : "border-border bg-card"
            }`}
          >
            <div className="flex flex-col items-center">
              {/* Dress shape */}
              <svg viewBox="0 0 60 70" className="w-16 h-20">
                <circle cx="30" cy="10" r="8" fill="hsl(43 50% 82%)" />
                <path d="M15,22 Q8,30 5,60 L55,60 Q52,30 45,22 Q40,28 30,28 Q20,28 15,22Z"
                  fill={outfit.color1} />
                <path d="M20,40 L40,40 L42,60 L18,60Z" fill={outfit.color2} opacity="0.7" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-center text-foreground">{outfit.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Nail painting step ───────────────────────────────────────────────────────
const NAIL_COLORS = ["#FF6B9D","#C084FC","#FB923C","#34D399","#60A5FA","#F472B6","#FBBF24","#F43F5E"];

function NailStep({ onComplete }: { onComplete: () => void }) {
  const [nailColors, setNailColors] = useState<(string | null)[]>(Array(5).fill(null));
  const [activeColor, setActiveColor] = useState(NAIL_COLORS[0]);

  const paintNail = (idx: number) => {
    const next = [...nailColors];
    next[idx] = activeColor;
    setNailColors(next);
    if (next.every(Boolean)) setTimeout(onComplete, 400);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-semibold text-muted-foreground">Paint all the nails!</p>

      {/* Hand SVG */}
      <svg viewBox="0 0 200 120" className="w-64 h-40">
        {/* Palm */}
        <path d="M30,110 Q30,80 40,70 L160,70 Q170,80 170,110Z" fill="hsl(43 50% 82%)" />
        {/* Fingers */}
        {[30,65,100,135,162].map((x, i) => (
          <g key={i} onClick={() => paintNail(i)} style={{ cursor: "pointer" }} data-testid={`nail-${i}`}>
            <rect
              x={x - 12} y={i === 0 ? 50 : 25}
              width={24} height={i === 0 ? 20 : 45}
              rx="12"
              fill="hsl(43 50% 82%)"
            />
            {/* Nail */}
            <rect
              x={x - 9} y={i === 0 ? 52 : 27}
              width={18} height={14}
              rx="9"
              fill={nailColors[i] ?? "hsl(0 0% 88%)"}
              className="transition-all"
            />
          </g>
        ))}
      </svg>

      <p className="text-xs text-muted-foreground">{nailColors.filter(Boolean).length}/5 nails painted</p>

      {/* Color picker */}
      <div className="flex gap-2 flex-wrap justify-center">
        {NAIL_COLORS.map((c) => (
          <button
            key={c}
            data-testid={`nail-color-${c}`}
            onClick={() => setActiveColor(c)}
            className={`w-8 h-8 rounded-full border-4 transition-transform active:scale-90 ${
              activeColor === c ? "border-foreground scale-110" : "border-transparent"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Level Complete Modal ─────────────────────────────────────────────────────
function LevelComplete({
  stars, coins, xp, onNext, onReplay, levelId,
}: {
  stars: number; coins: number; xp: number; onNext: () => void; onReplay: () => void; levelId: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
      <div className="bg-card rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center animate-in zoom-in-95">
        {/* Confetti dots */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full pointer-events-none"
            style={{
              backgroundColor: PALETTE_COLORS[i % PALETTE_COLORS.length],
              top: `${10 + Math.random() * 40}%`,
              left: `${Math.random() * 1000}%`,
              animation: `confetti-fall ${1 + Math.random()}s ${Math.random()}s linear forwards`,
            }}
          />
        ))}

        <h2 className="font-fredoka text-3xl text-primary mb-1">Level Complete!</h2>
        <p className="text-sm text-muted-foreground mb-4">Amazing makeover!</p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-5">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              size={36}
              className={`transition-all ${stars >= s ? "text-yellow-400 fill-yellow-400 scale-110" : "text-muted"}`}
            />
          ))}
        </div>

        {/* Rewards */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="bg-primary/10 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-1 font-fredoka text-xl text-primary">
              <Coins size={18} />+{coins}
            </div>
            <p className="text-xs text-muted-foreground">Coins</p>
          </div>
          <div className="bg-secondary/10 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-1 font-fredoka text-xl text-secondary">
              <Zap size={18} />+{xp}
            </div>
            <p className="text-xs text-muted-foreground">XP</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onReplay} className="flex-1">
            Replay
          </Button>
          <Button onClick={onNext} className="flex-1 font-fredoka text-base">
            Next Level
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Play page ───────────────────────────────────────────────────────────
  const showMysteryBox = (lvl) => { if (parseInt(lvl) % 5 === 0) { const box = document.createElement("div"); box.id = "mystery-box-ui"; box.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10000;font-family:sans-serif;color:white;"; box.innerHTML = `<div style="text-align:center;animation:pulse 1s infinite;"><div style="font-size:80px;cursor:pointer;filter:drop-shadow(0 0 20px #ff66b2);" id="click-box">🎁</div><h2 style="color:#ffb3d9;margin-top:20px;font-size:24px;font-weight:bold;">Mystery Box Unlocked!</h2><p style="color:#aaa;margin-top:5px;">Tap the box to claim VIP Reward</p></div>`; document.body.appendChild(box); document.getElementById("click-box").onclick = () => { document.getElementById("click-box").style.transform = "scale(1.4)"; document.getElementById("click-box").innerHTML = "🎉"; box.innerHTML += `<div style="position:absolute;font-size:32px;color:#ffd700;font-weight:bold;animation:bounce 0.5s;top:30%;">+200 VIP COINS!</div>`; const c = parseInt(localStorage.getItem("game_coins") || "100") + 200; localStorage.setItem("game_coins", c.toString()); setTimeout(() => { box.remove(); window.location.href = `/play/${parseInt(lvl) + 1}`; }, 3000); }; } else { window.location.href = `/play/${parseInt(lvl) + 1}`; } };
const handleAutoAdvance = (lvl) => { setTimeout(() => { window.location.href = `/play/${parseInt(lvl) + 1}`; }, 3000); };
export default function Play() {
  const [, params] = useRoute("/play/:levelId");
  const levelId = params?.levelId ?? "1";
  const level = getLevelById(levelId);
  const { completeLevel, addXP, unlockAchievement, checkAchievements } = useGame();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!level) setLocation("/levels");
  }, [level, setLocation]);

  if (!level) return null;

  const steps = level.steps;
  const stepProgress = Math.round((currentStep / steps.length) * 1000);

  const handleStepComplete = () => {
    if (currentStep + 1 >= steps.length) {
      const elapsed = (Date.now() - startTime) / 10000;
      const stars = elapsed < 30 ? 3 : elapsed < 60 ? 2 : 1;
      const coinsEarned = Math.floor(level.coinReward * (stars / 3));
      const xpEarned = Math.floor(level.xpReward * (stars / 3));

      completeLevel(levelId, stars, coinsEarned);
      addXP(xpEarned);

      // Achievements
      unlockAchievement("first_play");
      steps.forEach((s) => {
        if (s === "shaving") unlockAchievement("first_shave");
        if (s === "makeup") unlockAchievement("makeover_artist");
        if (s === "nails") unlockAchievement("nail_painter");
        if (s === "hairstyle") unlockAchievement("hairstylist");
        if (s === "outfit") unlockAchievement("fashionista");
      });
      if (stars === 3) unlockAchievement("three_stars");
      if (elapsed < 30) unlockAchievement("speed_run");
      checkAchievements();

      setCompleted(true);
    } else {
      toast({ title: "Step complete!", description: "Keep going!" });
      setCurrentStep((p) => p + 1);
    }
  };

  const elapsedSec = Math.floor((Date.now() - startTime) / 10000);
  const estimatedStars = elapsedSec < 30 ? 3 : elapsedSec < 60 ? 2 : 1;
  const coinsEarned = Math.floor(level.coinReward * (estimatedStars / 3));
  const xpEarned = Math.floor(level.xpReward * (estimatedStars / 3));

  const renderStep = (stepType: StepType) => {
    switch (stepType) {
      case "shaving":   return <ScrubStep type="shaving" onComplete={handleStepComplete} key={currentStep} />;
      case "washing":   return <ScrubStep type="washing" onComplete={handleStepComplete} key={currentStep} />;
      case "makeup":    return <MakeupStep onComplete={handleStepComplete} key={currentStep} />;
      case "hairstyle": return <HairstyleStep onComplete={handleStepComplete} key={currentStep} />;
      case "outfit":    return <OutfitStep onComplete={handleStepComplete} key={currentStep} />;
      case "nails":     return <NailStep onComplete={handleStepComplete} key={currentStep} />;
    }
  };

  const STEP_LABELS: Record<StepType, string> = {
    shaving: "Shaving", washing: "Face Wash",
    makeup: "Makeup", hairstyle: "Hairstyle",
    outfit: "Outfit", nails: "Nails",
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <CoinBar />
      <div className="pt-14 px-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 py-3">
          <Link href="/levels">
            <button className="p-2 rounded-xl bg-card border border-border">
              <ChevronLeft size={20} />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-fredoka text-lg leading-tight">{level.name}</h1>
            <p className="text-xs text-muted-foreground">
              Level {level.id} •{" "}
              <span className={`font-semibold ${DIFFICULTY_BG[level.difficulty].split(" ")[1]}`}>
                {level.difficulty}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-1 bg-amber-100 rounded-xl px-2 py-1">
            <Coins size={12} className="text-amber-600" />
            <span className="text-xs font-bold text-amber-700">{level.coinReward}</span>
          </div>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-2 mb-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex-1 flex flex-col items-center gap-1`}
            >
              <div className={`w-full h-2 rounded-full ${
                i < currentStep ? "bg-primary" :
                i === currentStep ? "bg-primary/40" :
                "bg-muted"
              }`} />
              <span className={`text-[10px] font-semibold ${
                i <= currentStep ? "text-primary" : "text-muted-foreground"
              }`}>
                {i < currentStep && <Check size={10} className="inline mr-0.5" />}
                {STEP_LABELS[step]}
              </span>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-fredoka text-lg text-foreground">
              Step {currentStep + 1}: {STEP_LABELS[steps[currentStep]]}
            </h2>
            <span className="text-xs text-muted-foreground">{currentStep + 1}/{steps.length}</span>
          </div>
          {renderStep(steps[currentStep])}
        </div>
      </div>

      {completed && (
        <LevelComplete
          stars={estimatedStars}
          coins={coinsEarned}
          xp={xpEarned}
          onNext={() => setLocation(`/play/${parseInt(levelId) + 1}`)}
          onReplay={() => { setCompleted(false); setCurrentStep(0); }}
          levelId={levelId}
        />
      )}
    </div>
  );
}
