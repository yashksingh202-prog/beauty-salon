import { useGetPremiumPlans, useGetPremiumStatus } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Check } from "lucide-react";

export default function Premium() {
  const { data: status, isLoading: statusLoading } = useGetPremiumStatus();
  const { data: plans, isLoading: plansLoading } = useGetPremiumPlans();

  if (statusLoading || plansLoading) {
    return (
      <div className="p-4 space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24 max-w-md mx-auto">
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          <Star className="w-8 h-8 text-purple-400 fill-current" />
        </div>
        <h1 className="text-3xl font-black text-foreground mb-2">Premium Pass</h1>
        <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
          Unlock exclusive stories, bonus daily rewards, and stand out on the leaderboard.
        </p>
      </div>

      {status?.isPremium ? (
        <Card className="p-6 bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-500/30 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Active Premium Pass</h2>
          <p className="text-purple-300 text-sm mb-4">
            Plan: <span className="font-bold text-white">{status.planName || 'Custom'}</span>
          </p>
          <div className="text-xs text-muted-foreground">Enjoy your benefits!</div>
        </Card>
      ) : (
        <div className="space-y-4">
          {plans?.map((plan: any) => (
            <Card key={plan.id} className="p-5 bg-card border-border overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Star className="w-24 h-24 text-primary" />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-3xl font-black">${(plan.price / 100).toFixed(2)}</span>
                  <span className="text-muted-foreground font-medium mb-1">/{plan.durationDays} days</span>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feat: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span>Instant bonus: {plan.coinsBonus}🪙 and {plan.gemsBonus}💎</span>
                  </li>
                </ul>
                
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold h-12 border-none">
                  Get Premium
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
