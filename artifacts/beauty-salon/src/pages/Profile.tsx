import { useState } from "react";
import { useGame } from "@/context/GameContext";
import CoinBar from "@/components/CoinBar";
import NavBar from "@/components/NavBar";
import { AVATAR_OPTIONS, AVATAR_COLORS } from "@/hooks/useGameStore";
import { ChevronLeft, LogOut, Edit2, Check, Share2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, logout, unlockAchievement } = useGame();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username ?? "");
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar ?? "avatar1");

  if (!user) return null;

  const xpPerLevel = user.level * 100;
  const xpPct = Math.min(100, (user.xp / xpPerLevel) * 100);
  const completedCount = Object.keys(user.completedLevels).length;
  const referralCode = `GLAM-${user.id.replace("user_", "").slice(-6).toUpperCase()}`;

  const handleSave = () => {
    if (newUsername.trim().length < 3) {
      toast({ title: "Username must be at least 3 characters", variant: "destructive" });
      return;
    }
    const users = JSON.parse(localStorage.getItem("glamstar_users") ?? "[]");
    const updatedUser = { ...user, username: newUsername.trim(), avatar: selectedAvatar };
    const updated = users.map((u: typeof user) =>
      u.id === user.id ? updatedUser : u
    );
    localStorage.setItem("glamstar_users", JSON.stringify(updated));
    localStorage.setItem("glamstar_current_user_id", user.id);
    // Trigger re-render by reloading page state
    window.dispatchEvent(new Event("glamstar_profile_updated"));
    setEditing(false);
    toast({ title: "Profile updated! Refresh to see changes." });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(referralCode).catch(() => {});
    unlockAchievement("referral");
    toast({ title: "Referral code copied!", description: referralCode });
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

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
          <h1 className="font-fredoka text-2xl">My Profile</h1>
          <button
            data-testid="btn-logout"
            onClick={handleLogout}
            className="ml-auto flex items-center gap-1 text-sm text-destructive font-semibold"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Avatar + name */}
        <div className="bg-card rounded-3xl p-5 border border-border shadow-sm">
          {editing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_OPTIONS.map(av => (
                  <button
                    key={av}
                    type="button"
                    data-testid={`avatar-select-${av}`}
                    onClick={() => setSelectedAvatar(av)}
                    className={`aspect-square rounded-xl border-2 flex items-center justify-center font-fredoka text-white text-lg transition-all ${
                      selectedAvatar === av ? "border-primary scale-105" : "border-transparent"
                    }`}
                    style={{ backgroundColor: AVATAR_COLORS[av] }}
                  >
                    {av.replace("avatar", "")}
                  </button>
                ))}
              </div>
              <Input
                data-testid="input-username-edit"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                placeholder="Username"
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  <Check size={16} className="mr-1" /> Save
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-fredoka text-white text-2xl border-2 border-primary/30"
                style={{ backgroundColor: AVATAR_COLORS[user.avatar] }}
              >
                {user.avatar.replace("avatar", "")}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-fredoka text-xl">{user.username}</h2>
                  <button data-testid="btn-edit-profile" onClick={() => setEditing(true)}>
                    <Edit2 size={14} className="text-muted-foreground" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">Level {user.level} • {user.streak} day streak</p>
                <div className="mt-1.5">
                  <Progress value={xpPct} className="h-1.5 [&>div]:bg-primary" />
                  <p className="text-xs text-muted-foreground mt-0.5">{user.xp} / {xpPerLevel} XP</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { label: "Levels Completed", value: completedCount },
            { label: "Games Played",     value: user.gamesPlayed },
            { label: "Total Coins",      value: user.totalCoinsEarned.toLocaleString() },
            { label: "Total Gems",       value: user.totalGemsEarned },
            { label: "Achievements",     value: user.achievements.length },
            { label: "Login Streak",     value: `${user.streak} days` },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-3">
              <div className="font-fredoka text-2xl text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Referral */}
        <div className="mt-4 bg-accent/10 border border-accent/30 rounded-2xl p-4">
          <h3 className="font-fredoka text-lg text-foreground">Referral Code</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex-1 bg-background rounded-xl px-3 py-2 font-mono font-bold text-primary border border-border">
              {referralCode}
            </span>
            <Button
              data-testid="btn-share-referral"
              onClick={handleShare}
              size="sm"
              variant="outline"
              className="border-primary/40"
            >
              <Share2 size={14} className="mr-1" />
              Copy
            </Button>
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  );
}
