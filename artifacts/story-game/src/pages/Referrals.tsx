import { useState } from "react";
import { useGetReferralCode, useUseReferralCode, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Referrals() {
  const queryClient = useQueryClient();
  const { data: refData, isLoading } = useGetReferralCode();
  const useCodeMutation = useUseReferralCode();
  
  const [codeToUse, setCodeToUse] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!refData?.code) return;
    navigator.clipboard.writeText(refData.code);
    setCopied(true);
    toast.success("Referral code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseCode = () => {
    if (!codeToUse.trim()) return;
    
    useCodeMutation.mutate({ data: { code: codeToUse.trim().toUpperCase() } }, {
      onSuccess: (res) => {
        setCodeToUse("");
        queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
        if (res.success) {
          toast.success(`Success! You earned +${res.coinsEarned}🪙!`);
        } else {
          toast.error(res.message);
        }
      },
      onError: () => toast.error("Invalid or expired referral code")
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24 max-w-md mx-auto">
      <div>
        <h1 className="text-3xl font-black text-foreground mb-1 flex items-center gap-2">
          <Users className="text-blue-400 w-6 h-6" /> Invite Friends
        </h1>
        <p className="text-muted-foreground text-sm">Earn 500🪙 for every friend that joins</p>
      </div>

      <Card className="p-6 bg-card border-border border-dashed">
        <h3 className="font-bold mb-2">Your Referral Code</h3>
        <p className="text-sm text-muted-foreground mb-4">Share this code with friends. They get a bonus when they sign up!</p>
        
        <div className="flex gap-2">
          <div className="flex-1 bg-muted rounded-lg flex items-center justify-center font-mono font-bold text-xl tracking-widest text-primary border border-border/50">
            {refData?.code}
          </div>
          <Button onClick={handleCopy} variant="secondary" className="w-12 h-12 p-0 shrink-0">
            {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h3 className="font-bold mb-2">Redeem a Code</h3>
        <p className="text-sm text-muted-foreground mb-4">Did a friend invite you? Enter their code here.</p>
        
        <div className="flex gap-2">
          <Input 
            value={codeToUse}
            onChange={(e) => setCodeToUse(e.target.value)}
            placeholder="ENTER CODE" 
            className="font-mono uppercase bg-input border-border"
          />
          <Button 
            onClick={handleUseCode}
            disabled={!codeToUse.trim() || useCodeMutation.isPending}
            className="bg-primary text-primary-foreground font-bold"
          >
            Redeem
          </Button>
        </div>
      </Card>

      <div>
        <h3 className="font-bold mb-3">Your Invites ({refData?.totalReferrals || 0})</h3>
        {refData?.referrals && refData.referrals.length > 0 ? (
          <div className="space-y-2">
            {refData.referrals.map((ref: any, i: number) => (
              <div key={i} className="flex justify-between items-center bg-card p-3 rounded-xl border border-border/50">
                <span className="font-medium text-sm">{ref.username}</span>
                <span className="text-xs font-bold text-yellow-400">+{ref.coinsEarned} 🪙</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground bg-card/50 rounded-xl border border-border/30">
            You haven't invited anyone yet.
          </div>
        )}
      </div>
    </div>
  );
}
