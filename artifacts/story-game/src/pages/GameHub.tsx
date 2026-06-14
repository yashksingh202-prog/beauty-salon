import { Link } from "wouter";
import { useGetMyProfile, useGetMyStats, useGetProgress, useGetDailyRewardStatus } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Gift, Trophy, Star, ShieldAlert } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function GameHub() {
  const { data: profile, isLoading: profileLoading } = useGetMyProfile();
  const { data: stats, isLoading: statsLoading } = useGetMyStats();
  const { data: progress, isLoading: progressLoading } = useGetProgress();
  const { data: dailyReward, isLoading: dailyRewardLoading } = useGetDailyRewardStatus();

  if (profileLoading || statsLoading || progressLoading || dailyRewardLoading) {
    return (
      <div className="p-4 space-y-6 animate-pulse">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!profile || !stats || !progress) return null;

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header Profile Summary */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back,</h1>
          <p className="text-xl font-bold text-gradient-gold">{profile.username}</p>
        </div>
        <Link href="/profile">
          <div className="w-14 h-14 rounded-full border-2 border-primary/50 overflow-hidden bg-muted">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary">
                {profile.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Level Progress Card */}
      <Card className="p-5 bg-card border-border relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Current Level</p>
              <h2 className="text-4xl font-black text-foreground">Lvl {profile.level}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">XP</p>
              <p className="text-lg font-bold text-primary">{profile.xp}</p>
            </div>
          </div>
          
          <Progress value={(profile.xp % 1000) / 10} className="h-3 mb-6 bg-muted" />
          
          <Link href={`/story/${progress.currentLevel || 1}`}>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 text-lg rounded-xl border-glow-gold shadow-lg shadow-primary/20">
              <Play className="w-5 h-5 mr-2 fill-current" /> Continue Adventure
            </Button>
          </Link>
        </div>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Daily Reward Alert */}
        <Link href="/rewards">
          <Card className={`p-4 border-border h-full flex flex-col items-center justify-center text-center transition-all ${dailyReward?.canClaim ? 'bg-primary/10 border-primary/50 border-glow-gold' : 'bg-card hover:bg-muted/50'}`}>
            <div className="relative mb-2">
              <Gift className={`w-8 h-8 ${dailyReward?.canClaim ? 'text-primary' : 'text-muted-foreground'}`} />
              {dailyReward?.canClaim && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
              )}
            </div>
            <h3 className={`font-bold ${dailyReward?.canClaim ? 'text-primary' : 'text-foreground'}`}>Daily Reward</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {dailyReward?.canClaim ? 'Ready to claim!' : `Streak: ${dailyReward?.streak || 0} days`}
            </p>
          </Card>
        </Link>

        {/* Boss Battles */}
        <Link href="/bosses">
          <Card className="p-4 bg-card hover:bg-muted/50 border-border h-full flex flex-col items-center justify-center text-center transition-all">
            <ShieldAlert className="w-8 h-8 text-red-400 mb-2" />
            <h3 className="font-bold text-foreground">Boss Raids</h3>
            <p className="text-xs text-muted-foreground mt-1">Epic loot awaits</p>
          </Card>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="pt-4">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" /> Your Legend
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Levels</p>
            <p className="text-xl font-bold">{stats.totalLevelsCompleted}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Stories</p>
            <p className="text-xl font-bold">{stats.totalStoriesRead}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Bosses</p>
            <p className="text-xl font-bold text-red-400">{stats.bossesDefeated}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
