import { useGetMyProfile, useGetMyStats, useGetProgress } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Swords, Zap, Star, Edit3 } from "lucide-react";

export default function Profile() {
  const { data: profile, isLoading: profileLoading } = useGetMyProfile();
  const { data: stats, isLoading: statsLoading } = useGetMyStats();
  const { data: progress, isLoading: progressLoading } = useGetProgress();

  if (profileLoading || statsLoading || progressLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!profile || !stats || !progress) return null;

  return (
    <div className="p-4 space-y-6 pb-24 max-w-md mx-auto">
      {/* Header card */}
      <Card className="p-6 bg-card border-border overflow-hidden relative text-center flex flex-col items-center">
        <div className="absolute inset-0 bg-gradient-premium opacity-10 pointer-events-none"></div>
        
        <div className="relative mb-4 group">
          <div className="w-24 h-24 rounded-full border-4 border-primary/50 overflow-hidden bg-muted">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary">
                {profile.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
        
        <h1 className="text-2xl font-black text-foreground">{profile.username}</h1>
        <p className="text-muted-foreground text-sm flex items-center justify-center gap-2 mt-1">
          {profile.isPremium && <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px]"><Star className="w-3 h-3 mr-1 fill-current"/> Premium</Badge>}
          {profile.role !== 'user' && <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px] capitalize">{profile.role}</Badge>}
        </p>

        <div className="mt-6 w-full text-left">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="text-primary">Level {profile.level}</span>
            <span className="text-muted-foreground">{profile.xp} / {profile.level * 1000} XP</span>
          </div>
          <Progress value={(profile.xp % 1000) / 10} className="h-2 bg-muted" />
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-card border-border flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-muted-foreground">Stories Read</span>
          </div>
          <span className="text-2xl font-black">{stats.totalStoriesRead}</span>
        </Card>
        
        <Card className="p-4 bg-card border-border flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Swords className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-muted-foreground">Bosses Slain</span>
          </div>
          <span className="text-2xl font-black">{stats.bossesDefeated}</span>
        </Card>
        
        <Card className="p-4 bg-card border-border flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-400 font-bold">🪙</span>
            <span className="text-sm font-medium text-muted-foreground">Lifetime Coins</span>
          </div>
          <span className="text-2xl font-black">{stats.totalCoinsEarned.toLocaleString()}</span>
        </Card>
        
        <Card className="p-4 bg-card border-border flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-400 font-bold">💎</span>
            <span className="text-sm font-medium text-muted-foreground">Lifetime Gems</span>
          </div>
          <span className="text-2xl font-black">{stats.totalGemsEarned.toLocaleString()}</span>
        </Card>
      </div>

      <Card className="p-4 bg-card border-border">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Story Progression</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Main Quests</span>
          <span className="text-sm text-primary font-bold">{progress.progressPercent}%</span>
        </div>
        <Progress value={progress.progressPercent} className="h-2 bg-muted" />
        <p className="text-xs text-muted-foreground mt-3">{progress.completedLevels.length} of {progress.totalLevels} levels completed</p>
      </Card>
    </div>
  );
}
