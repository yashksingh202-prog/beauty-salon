import { Link } from "wouter";
import { useGame } from "@/context/GameContext";
import CoinBar from "@/components/CoinBar";
import NavBar from "@/components/NavBar";
import { LEVELS } from "@/data/levels";
import { Star, Lock, ChevronLeft } from "lucide-react";
import { useState } from "react";

type Filter = "all" | "easy" | "medium" | "hard" | "expert";

export default function LevelSelect() {
  const { progress, user } = useGame();
  const [filter, setFilter] = useState<Filter>("all");

  const completedLevels = user?.completedLevels ?? {};
  const shown = filter === "all" ? LEVELS : LEVELS.filter(l => l.difficulty === filter);

  return (
    <div className="min-h-screen bg-background pb-24">
      <CoinBar />
      {/* Header */}
      <div className="pt-14 px-4 max-w-md mx-auto">
        <div className="flex items-center gap-3 py-3">
          <Link href="/hub">
            <button className="p-2 rounded-xl bg-card border border-border">
              <ChevronLeft size={20} />
            </button>
          </Link>
          <h1 className="font-fredoka text-2xl text-foreground">Select Level</h1>
          <span className="ml-auto text-sm text-muted-foreground">
            {Object.keys(completedLevels).length}/1000
          </span>
        </div>

        {/* Difficulty filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(["all","easy","medium","hard","expert"] as Filter[]).map(f => (
            <button
              key={f}
              data-testid={`filter-${f}`}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-primary text-white shadow"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-5 gap-2 mt-3">
          {shown.map(level => {
            const unlocked = progress.unlockedLevels.includes(level.id);
            const completedData = completedLevels[level.id];
            const completed = !!completedData;
            const stars = completedData?.stars ?? 0;

            return (
              <Link key={level.id} href={unlocked ? `/play/${level.id}` : "#"}>
                <div
                  data-testid={`level-${level.id}`}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all active:scale-90 cursor-pointer ${
                    completed
                      ? "bg-primary text-white shadow-md"
                      : unlocked
                      ? "bg-card border-2 border-primary/40 text-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {!unlocked ? (
                    <Lock size={14} />
                  ) : (
                    <>
                      <span className="font-fredoka text-sm leading-none">{level.id}</span>
                      {completed && (
                        <div className="flex gap-0.5 mt-0.5">
                          {[1,2,3].map(s => (
                            <Star
                              key={s}
                              size={6}
                              className={stars >= s ? "text-yellow-300 fill-yellow-300" : "text-white/40"}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {/* Difficulty dot */}
                  <div className={`absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${
                    level.difficulty === "easy" ? "bg-emerald-400" :
                    level.difficulty === "medium" ? "bg-amber-400" :
                    level.difficulty === "hard" ? "bg-orange-400" : "bg-rose-400"
                  }`} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          {[
            { label: "Easy",   cls: "bg-emerald-400" },
            { label: "Medium", cls: "bg-amber-400" },
            { label: "Hard",   cls: "bg-orange-400" },
            { label: "Expert", cls: "bg-rose-400" },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1 text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${l.cls}`} />
              {l.label}
            </div>
          ))}
        </div>
      </div>
      <NavBar />
    </div>
  );
}
