import { useState } from "react";
import { useListStories, useGetProgress } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Lock, CheckCircle2, Play, Star } from "lucide-react";

export default function StoryBrowser() {
  const [search, setSearch] = useState("");
  const { data: storiesData, isLoading: storiesLoading } = useListStories({ limit: 50 });
  const { data: progress, isLoading: progressLoading } = useGetProgress();

  if (storiesLoading || progressLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="grid gap-4">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  const stories = storiesData?.stories || [];
  const completedIds = new Set(progress?.completedLevels || []);
  const currentLevel = progress?.currentLevel || 1;

  const filteredStories = stories.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'legendary': return 'bg-red-500/20 text-red-400 border-red-500/30 font-bold';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-foreground">Adventure Log</h1>
        <p className="text-muted-foreground text-sm">Explore 1000+ interactive stories</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search quests..." 
          className="pl-10 h-12 bg-card border-border rounded-xl focus-visible:ring-primary"
        />
      </div>

      <div className="space-y-4">
        {filteredStories.map((story) => {
          const isCompleted = completedIds.has(story.id);
          const isCurrent = story.levelNumber === currentLevel;
          const isLocked = story.levelNumber > currentLevel;

          return (
            <Card 
              key={story.id} 
              className={`overflow-hidden border transition-all ${
                isCurrent ? 'border-primary/50 shadow-[0_0_15px_rgba(255,223,115,0.15)]' : 
                isLocked ? 'border-border/40 opacity-70' : 'border-border'
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Level {story.levelNumber}
                    </span>
                    {story.isPremium && (
                      <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px] px-1 py-0 h-4">
                        <Star className="w-2 h-2 mr-1 fill-current" /> Premium
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className={`text-xs ${getDifficultyColor(story.difficulty)}`}>
                    {story.difficulty}
                  </Badge>
                </div>
                
                <h3 className={`text-xl font-bold mb-2 ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {story.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {story.description}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-3 text-xs font-medium">
                    <span className="flex items-center gap-1 text-yellow-400">🪙 {story.coinsReward}</span>
                    <span className="flex items-center gap-1 text-purple-400">💎 {story.gemsReward}</span>
                    <span className="flex items-center gap-1 text-blue-400">⚡ {story.xpReward}</span>
                  </div>

                  {isLocked ? (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                      <Lock className="w-4 h-4" /> Locked
                    </div>
                  ) : isCompleted ? (
                    <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </div>
                  ) : (
                    <Link href={`/story/${story.id}`}>
                      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                        <Play className="w-5 h-5 ml-1 fill-current" />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        {filteredStories.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No stories found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
