import { useState } from "react";
import { useGetDailyRewardStatus, useClaimDailyReward, useGetSpinStatus, useExecuteSpin, getGetDailyRewardStatusQueryKey, getGetMyProfileQueryKey, getGetMyStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Gift, Coins, Gem, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Rewards() {
  const queryClient = useQueryClient();
  const { data: dailyStatus, isLoading: dailyLoading } = useGetDailyRewardStatus();
  const { data: spinStatus, isLoading: spinLoading } = useGetSpinStatus();
  
  const claimMutation = useClaimDailyReward();
  const spinMutation = useExecuteSpin();
  
  const [spinning, setSpinning] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);

  const handleClaimDaily = () => {
    claimMutation.mutate(undefined, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: getGetDailyRewardStatusQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetMyStatsQueryKey() });
        toast.success(`Claimed +${res.coinsEarned}🪙 and +${res.gemsEarned}💎! Streak: ${res.streak} days`);
      },
      onError: () => toast.error("Failed to claim daily reward")
    });
  };

  const handleSpin = () => {
    if (spinning || !spinStatus || spinMutation.isPending) return;
    
    if (spinStatus.freeSpinsAvailable <= 0 && spinStatus.paidSpinCost > 0) {
      // For now, assuming they have enough, backend will reject if not
    }

    setSpinning(true);
    
    spinMutation.mutate(undefined, {
      onSuccess: (res) => {
        // Calculate rotation: 5 spins + index of prize
        const prizeCount = spinStatus.prizes.length;
        const sliceAngle = 360 / prizeCount;
        const targetAngle = (res.prizeIndex * sliceAngle) + (sliceAngle / 2);
        const newRotation = spinRotation + (360 * 5) + (360 - targetAngle);
        
        setSpinRotation(newRotation);
        
        setTimeout(() => {
          setSpinning(false);
          queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
          toast.success(
            <div className="flex flex-col gap-1">
              <span className="font-bold">{res.prize.label}</span>
              <span className="text-sm">Prize unlocked!</span>
            </div>
          );
        }, 4000); // 4 second spin duration
      },
      onError: () => {
        setSpinning(false);
        toast.error("Failed to spin the wheel");
      }
    });
  };

  if (dailyLoading || spinLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8 pb-24 max-w-md mx-auto">
      <div>
        <h1 className="text-3xl font-black text-foreground mb-1">Rewards Hub</h1>
        <p className="text-muted-foreground text-sm">Claim your loot and test your luck</p>
      </div>

      {/* Daily Rewards */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Gift className="text-primary w-5 h-5" /> Daily Check-In
        </h2>
        
        <Card className="p-4 bg-card border-border overflow-hidden relative">
          <div className="flex items-center justify-between mb-4">
            <div className="font-medium text-sm">Current Streak: <span className="text-primary font-bold">{dailyStatus?.streak || 0}</span></div>
            {dailyStatus?.canClaim && (
              <Button 
                onClick={handleClaimDaily} 
                disabled={claimMutation.isPending}
                className="bg-primary text-primary-foreground font-bold border-glow-gold h-8 text-xs"
              >
                {claimMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Claim Now"}
              </Button>
            )}
          </div>
          
          <div className="flex justify-between gap-2 overflow-x-auto pb-2 snap-x">
            {dailyStatus?.weekSchedule?.map((day: any) => (
              <div 
                key={day.day} 
                className={`snap-center shrink-0 flex flex-col items-center justify-center w-[60px] h-[80px] rounded-xl border ${
                  day.isToday && !day.isClaimed 
                    ? 'bg-primary/20 border-primary shadow-[0_0_10px_rgba(255,223,115,0.3)]' 
                    : day.isClaimed 
                      ? 'bg-muted/50 border-border/50 opacity-50' 
                      : 'bg-card border-border'
                }`}
              >
                <span className="text-[10px] text-muted-foreground font-medium mb-1">Day {day.day}</span>
                <div className="flex flex-col items-center gap-0.5">
                  {day.coins > 0 && <span className="text-xs font-bold text-yellow-400">🪙 {day.coins}</span>}
                  {day.gems > 0 && <span className="text-xs font-bold text-purple-400">💎 {day.gems}</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Lucky Spin Wheel */}
      <section className="space-y-3 pt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="text-blue-400 w-5 h-5" /> Lucky Spin
          </h2>
          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {spinStatus?.freeSpinsAvailable || 0} Free Spins
          </div>
        </div>
        
        <Card className="p-6 bg-card border-border flex flex-col items-center justify-center">
          {/* Render Wheel visually */}
          <div className="relative w-64 h-64 mb-8">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-8 bg-red-500 z-10 [clip-path:polygon(50%_100%,_0_0,_100%_0)] shadow-lg"></div>
            
            <motion.div 
              className="w-full h-full rounded-full border-4 border-primary shadow-[0_0_20px_rgba(255,223,115,0.2)] overflow-hidden relative"
              animate={{ rotate: spinRotation }}
              transition={{ duration: 4, type: "tween", ease: "circOut" }}
            >
              {spinStatus?.prizes?.map((prize: any, idx: number) => {
                const angle = 360 / spinStatus.prizes.length;
                const rotation = idx * angle;
                return (
                  <div 
                    key={prize.id}
                    className="absolute top-0 left-0 w-full h-full origin-center"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      background: `conic-gradient(from -${angle/2}deg at 50% 50%, ${prize.color} ${angle}deg, transparent ${angle}deg)`
                    }}
                  >
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap" style={{ transform: `rotate(${angle/2}deg)` }}>
                      {prize.label}
                    </div>
                  </div>
                );
              })}
            </motion.div>
            
            {/* Center Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-background border-4 border-primary rounded-full z-10 flex items-center justify-center shadow-inner">
              <div className="w-4 h-4 rounded-full bg-primary/50"></div>
            </div>
          </div>
          
          <Button 
            onClick={handleSpin} 
            disabled={spinning || (!spinStatus?.freeSpinsAvailable && !spinStatus?.paidSpinCost)}
            size="lg"
            className="w-full max-w-[200px] h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-none shadow-[0_0_20px_rgba(147,51,234,0.4)]"
          >
            {spinning ? "Spinning..." : 
              (spinStatus?.freeSpinsAvailable || 0) > 0 ? "Free Spin!" : 
              `Spin (${spinStatus?.paidSpinCost} 🪙)`}
          </Button>
        </Card>
      </section>
    </div>
  );
}
