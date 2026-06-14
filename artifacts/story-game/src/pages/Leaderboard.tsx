import { useGetLeaderboard } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Trophy, Star, Medal } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Leaderboard() {
  const [tab, setTab] = useState<"alltime" | "weekly" | "monthly">("alltime");
  
  const { data: leaderboardData, isLoading } = useGetLeaderboard({ type: tab });

  return (
    <div className="p-4 space-y-6 pb-24 max-w-md mx-auto">
      <div>
        <h1 className="text-3xl font-black text-foreground mb-1 flex items-center gap-2">
          <Trophy className="text-yellow-400 w-6 h-6" /> Hall of Fame
        </h1>
        <p className="text-muted-foreground text-sm">The greatest adventurers in the realm</p>
      </div>

      <Tabs value={tab} onValueChange={(v: any) => setTab(v)} className="w-full">
        <TabsList className="w-full bg-card border border-border h-12 p-1">
          <TabsTrigger value="weekly" className="flex-1 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="flex-1 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Monthly</TabsTrigger>
          <TabsTrigger value="alltime" className="flex-1 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All Time</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
        ) : (
          leaderboardData?.entries.map((entry: any, i: number) => {
            const isTop3 = i < 3;
            return (
              <Card 
                key={entry.userId} 
                className={`p-3 flex items-center gap-4 transition-all ${
                  i === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-card border-yellow-500/50' :
                  i === 1 ? 'bg-gradient-to-r from-slate-400/20 to-card border-slate-400/50' :
                  i === 2 ? 'bg-gradient-to-r from-amber-700/20 to-card border-amber-700/50' :
                  'bg-card border-border'
                }`}
              >
                <div className="w-8 flex justify-center font-black text-lg">
                  {i === 0 ? <Medal className="w-6 h-6 text-yellow-400" /> :
                   i === 1 ? <Medal className="w-6 h-6 text-slate-300" /> :
                   i === 2 ? <Medal className="w-6 h-6 text-amber-600" /> :
                   <span className="text-muted-foreground">#{entry.rank}</span>}
                </div>
                
                <div className="w-10 h-10 rounded-full border border-primary/20 overflow-hidden bg-muted flex shrink-0 items-center justify-center font-bold">
                  {entry.avatarUrl ? (
                    <img src={entry.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : entry.username.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <div className="font-bold text-sm truncate flex items-center gap-1">
                    {entry.username}
                    {entry.isPremium && <Star className="w-3 h-3 text-purple-400 fill-current" />}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    Level {entry.level}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-primary text-sm">{entry.score.toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Score</div>
                </div>
              </Card>
            );
          })
        )}
        
        {(!leaderboardData || leaderboardData.entries.length === 0) && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            No rankings available for this period.
          </div>
        )}
      </div>
    </div>
  );
}
