import { Link, useLocation } from "wouter";
import { useGetMyProfile } from "@workspace/api-client-react";
import { Home, BookOpen, Trophy, Gift, User, Shield } from "lucide-react";
import { useClerk } from "@clerk/react";

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: profile } = useGetMyProfile();
  const { signOut } = useClerk();

  const navItems = [
    { href: "/game", icon: Home, label: "Hub" },
    { href: "/stories", icon: BookOpen, label: "Stories" },
    { href: "/leaderboard", icon: Trophy, label: "Rank" },
    { href: "/rewards", icon: Gift, label: "Rewards" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  const isAdmin = profile && ['admin', 'superadmin', 'moderator'].includes(profile.role);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4 max-w-md mx-auto">
          <Link href="/game" className="flex items-center gap-2">
            <img src="/logo.svg" alt="StoryQuest" className="w-8 h-8" />
            <span className="font-bold text-xl text-gradient-gold">StoryQuest</span>
          </Link>
          <div className="flex items-center gap-4">
            {profile && (
              <div className="flex gap-3 text-sm font-medium">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 font-bold">🪙</span>
                  <span>{profile.coins}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-purple-400 font-bold">💎</span>
                  <span>{profile.gems}</span>
                </div>
              </div>
            )}
            {isAdmin && (
              <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                <Shield className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-safe">
        <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                <Icon className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
