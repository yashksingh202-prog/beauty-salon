import { Link } from "wouter";
import { useGame } from "@/context/GameContext";
import CoinBar from "@/components/CoinBar";
import NavBar from "@/components/NavBar";
import { AVATAR_COLORS } from "@/hooks/useGameStore";
import { LayoutGrid, Trophy, Gift, ShoppingBag, Award, Shield, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const MENU_ITEMS = [
  { href: "/levels",       icon: LayoutGrid, label: "Play Levels",   color: "from-pink-400 to-rose-500",      desc: "100 glamour levels!" },
  { href: "/rewards",      icon: Gift,       label: "Daily Rewards",  color: "from-violet-400 to-purple-500",  desc: "Claim & spin!" },
  { href: "/leaderboard",  icon: Trophy,     label: "Leaderboard",    color: "from-amber-400 to-orange-500",   desc: "Top stylists" },
  { href: "/shop",         icon: ShoppingBag,label: "Shop",           color: "from-emerald-400 to-teal-500",   desc: "Tools & themes" },
  { href: "/achievements", icon: Award,      label: "Achievements",   color: "from-sky-400 to-blue-500",       desc: "Unlock badges" },
];

export default function Hub() {
  const { user, progress } = useGame();
  if (!user) return null;

  const xpPerLevel = user.level * 100;
  const xpPct = Math.min(100, (user.xp / xpPerLevel) * 100);
  const completedCount = Object.keys(user.completedLevels).length;
  const announcement = localStorage.getItem("glamstar_admin_settings")
    ? JSON.parse(localStorage.getItem("glamstar_admin_settings")!).announcement
    : "";

  return (
    <div className="min-h-screen bg-background pb-20">
      <CoinBar />
      <div className="pt-14 px-4 max-w-md mx-auto">
        {/* Announcement banner */}
        {announcement && (
          <div className="mt-3 mb-1 bg-accent/20 border border-accent/40 rounded-xl px-4 py-2 text-sm text-accent-foreground font-semibold flex items-center gap-2">
            <Sparkles size={14} className="text-accent" />
            {announcement}
          </div>
        )}

        {/* Profile card */}
        <div className="mt-4 rounded-3xl p-5 text-white shadow-xl"
          style={{ background: "linear-gradient(135deg, hsl(330 80% 60%), hsl(270 55% 65%))" }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl border-3 border-white/50 flex items-center justify-center text-white font-fredoka text-2xl shadow-md"
              style={{ backgroundColor: AVATAR_COLORS[user.avatar] ?? "#FF6B9D" }}>
              {user.avatar.replace("avatar", "")}
            </div>
            <div className="flex-1">
              <h2 className="font-fredoka text-2xl leading-tight">{user.username}</h2>
              <p className="text-white/80 text-sm">Level {user.level} Stylist • {user.streak} day streak</p>
              <div className="mt-1">
                <div className="flex justify-between text-xs text-white/70 mb-0.5">
                  <span>XP</span>
                  <span>{user.xp} / {xpPerLevel}</span>
                </div>
                <Progress value={xpPct} className="h-2 bg-white/30 [&>div]:bg-yellow-300" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: "Levels Done", value: completedCount },
              { label: "Unlocked",    value: progress.unlockedLevels.length },
              { label: "Games Played",value: user.gamesPlayed },
            ].map(s => (
              <div key={s.label} className="bg-white/20 rounded-xl py-2 text-center">
                <div className="font-fredoka text-xl">{s.value}</div>
                <div className="text-white/70 text-[10px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {MENU_ITEMS.map(item => (
            <Link key={item.href} href={item.href}>
              <div
                data-testid={`menu-${item.label.toLowerCase().replace(/ /g, "-")}`}
                className={`rounded-2xl p-4 text-white bg-gradient-to-br ${item.color} shadow-md active:scale-95 transition-transform cursor-pointer`}
              >
                <item.icon size={28} className="mb-2 opacity-90" />
                <div className="font-fredoka text-lg leading-tight">{item.label}</div>
                <div className="text-white/80 text-xs mt-0.5">{item.desc}</div>
              </div>
            </Link>
          ))}
          {/* Admin panel link */}
          {user.isAdmin && (
            <Link href="/admin">
              <div className="rounded-2xl p-4 text-white bg-gradient-to-br from-gray-500 to-gray-700 shadow-md active:scale-95 transition-transform cursor-pointer">
                <Shield size={28} className="mb-2 opacity-90" />
                <div className="font-fredoka text-lg leading-tight">Admin Panel</div>
                <div className="text-white/80 text-xs mt-0.5">Manage game</div>
              </div>
            </Link>
          )}
        </div>
      </div>
      <NavBar />
    </div>
  );
}
