import { useGame } from "@/context/GameContext";
import CoinBar from "@/components/CoinBar";
import NavBar from "@/components/NavBar";
import { ChevronLeft, Sparkles, Scissors, Star, Trophy, Crown, Flame, Coins, Gem, RefreshCw, Zap, Palette, Wind, Shirt, CalendarCheck, ShoppingBag, Users } from "lucide-react";
import { Link } from "wouter";
import { ACHIEVEMENTS } from "@/data/achievements";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Sparkles, Scissors, Star, Trophy, Crown, Flame, Coins, Gem,
  RefreshCw, Zap, Palette, Wind, Shirt, CalendarCheck, ShoppingBag, Users,
};

export default function Achievements() {
  const { user } = useGame();
  if (!user) return null;

  const unlocked = user.achievements;
  const unlockedCount = unlocked.length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <CoinBar />
      <div className="pt-14 px-4 max-w-md mx-auto">
        <div className="flex items-center gap-3 py-3">
          <Link href="/hub">
            <button className="p-2 rounded-xl bg-card border border-border">
              <ChevronLeft size={20} />
            </button>
          </Link>
          <h1 className="font-fredoka text-2xl">Achievements</h1>
          <span className="ml-auto font-fredoka text-base text-muted-foreground">
            {unlockedCount}/{ACHIEVEMENTS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold">Collection Progress</span>
            <span className="text-primary font-fredoka">{Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
              style={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Achievement grid */}
        <div className="grid grid-cols-3 gap-3">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            const IconComp = ICON_MAP[ach.icon] ?? Star;
            return (
              <div
                key={ach.id}
                data-testid={`achievement-${ach.id}`}
                className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                  isUnlocked
                    ? "bg-primary/10 border-primary/40"
                    : "bg-muted/50 border-transparent opacity-50"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                  isUnlocked
                    ? "bg-gradient-to-br from-primary to-secondary"
                    : "bg-muted"
                }`}>
                  <IconComp
                    size={22}
                    className={isUnlocked ? "text-white" : "text-muted-foreground"}
                  />
                </div>
                <p className="text-[11px] font-semibold text-center leading-tight text-foreground">{ach.name}</p>
                <p className="text-[9px] text-center text-muted-foreground mt-0.5 leading-tight">{ach.description}</p>
                {isUnlocked && (
                  <div className="mt-1 bg-primary/20 rounded-full px-2 py-0.5">
                    <span className="text-[9px] text-primary font-bold">Unlocked!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <NavBar />
    </div>
  );
}
