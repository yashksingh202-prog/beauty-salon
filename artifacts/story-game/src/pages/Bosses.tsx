import { useListBosses, useStartBossBattle } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Swords, Heart } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function Bosses() {
  const { data: bosses, isLoading } = useListBosses();
  const startBattle = useStartBossBattle();
  const [battling, setBattling] = useState<number | null>(null);

  const handleBattle = (id: number) => {
    setBattling(id);
    startBattle.mutate({ id }, {
      onSuccess: (res) => {
        setBattling(null);
        if (res.won) {
          toast.success(
            <div className="flex flex-col gap-1">
              <span className="font-bold text-green-500">Victory! Boss Defeated!</span>
              <span className="text-sm">+{res.coinsEarned}🪙 +{res.gemsEarned}💎</span>
            </div>
          );
        } else {
          toast.error(`Defeated! You dealt ${res.damageDealt} damage. Try again later.`);
        }
      },
      onError: () => {
        setBattling(null);
        toast.error("Battle failed to start.");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1,2].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24 max-w-md mx-auto">
      <div>
        <h1 className="text-3xl font-black text-foreground mb-1 flex items-center gap-2">
          <ShieldAlert className="text-red-500 w-6 h-6" /> Boss Raids
        </h1>
        <p className="text-muted-foreground text-sm">High risk, legendary rewards</p>
      </div>

      <div className="space-y-6">
        {bosses?.map((boss: any) => {
          const isCooldown = boss.cooldownUntil && new Date(boss.cooldownUntil) > new Date();
          
          return (
            <Card key={boss.id} className="bg-card border-border overflow-hidden group">
              <div className="h-32 bg-red-950 relative overflow-hidden flex items-center justify-center border-b border-border/50">
                {boss.imageUrl ? (
                  <img src={boss.imageUrl} alt={boss.name} className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
                <h3 className="absolute bottom-2 left-4 text-2xl font-black text-white">{boss.name}</h3>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className={`bg-red-500/10 text-red-400 border-red-500/20`}>
                    {boss.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm font-bold text-red-400">
                    <Heart className="w-4 h-4 fill-current" /> {boss.hp} HP
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{boss.description}</p>
                
                <div className="flex justify-between items-center bg-muted/50 rounded-lg p-2 mb-4 border border-border/50">
                  <div className="text-xs font-medium text-muted-foreground">Loot:</div>
                  <div className="flex gap-2">
                    <span className="text-xs font-bold text-yellow-400">🪙 {boss.coinsReward}</span>
                    <span className="text-xs font-bold text-purple-400">💎 {boss.gemsReward}</span>
                  </div>
                </div>

                {isCooldown ? (
                  <Button disabled className="w-full bg-muted text-muted-foreground h-12">
                    Recovering...
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleBattle(boss.id)} 
                    disabled={battling === boss.id}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 border-none shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                  >
                    {battling === boss.id ? "Fighting..." : <><Swords className="w-5 h-5 mr-2" /> Attack Boss</>}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
        
        {bosses?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No bosses currently active. Check back soon.
          </div>
        )}
      </div>
    </div>
  );
}
