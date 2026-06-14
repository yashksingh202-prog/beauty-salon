import { useListMyWithdrawals, useGetMyProfile, useCreateWithdrawal, getListMyWithdrawalsQueryKey, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Withdrawals() {
  const queryClient = useQueryClient();
  const { data: profile } = useGetMyProfile();
  const { data: withdrawals, isLoading } = useListMyWithdrawals();
  const createWithdrawal = useCreateWithdrawal();

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [details, setDetails] = useState("");

  const GEMS_TO_USD_RATE = 1000; // 1000 gems = $1.00

  const handleWithdraw = () => {
    const gemsAmt = parseInt(amount);
    if (!gemsAmt || gemsAmt < 5000) {
      toast.error("Minimum withdrawal is 5,000 gems ($5.00)");
      return;
    }

    if (gemsAmt > (profile?.gems || 0)) {
      toast.error("Not enough gems");
      return;
    }

    if (!method || !details) {
      toast.error("Please fill all details");
      return;
    }

    createWithdrawal.mutate({
      data: {
        amount: gemsAmt,
        currency: "USD",
        method,
        accountDetails: details
      }
    }, {
      onSuccess: () => {
        setAmount("");
        setMethod("");
        setDetails("");
        queryClient.invalidateQueries({ queryKey: getListMyWithdrawalsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
        toast.success("Withdrawal request submitted!");
      },
      onError: () => toast.error("Failed to submit request")
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24 max-w-md mx-auto">
      <div>
        <h1 className="text-3xl font-black text-foreground mb-1 flex items-center gap-2">
          <DollarSign className="text-green-400 w-6 h-6" /> Cash Out
        </h1>
        <p className="text-muted-foreground text-sm">Convert your hard-earned gems to real money</p>
      </div>

      <Card className="p-5 bg-card border-border">
        <div className="flex justify-between items-center mb-6 p-3 bg-muted/50 rounded-lg border border-border/50">
          <div>
            <div className="text-xs text-muted-foreground font-medium mb-1">Available Balance</div>
            <div className="text-xl font-bold flex items-center gap-2">
              <span className="text-purple-400">💎 {profile?.gems || 0}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground font-medium mb-1">USD Value</div>
            <div className="text-xl font-bold text-green-400">
              ${((profile?.gems || 0) / GEMS_TO_USD_RATE).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Gems to Withdraw (Min 5,000)</Label>
            <Input 
              type="number" 
              placeholder="e.g. 5000" 
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="bg-input border-border"
            />
            {amount && !isNaN(Number(amount)) && (
              <p className="text-xs text-green-400 text-right">You will receive approx ${(Number(amount) / GEMS_TO_USD_RATE).toFixed(2)}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="crypto">Crypto (USDT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Account Details (Email or Address)</Label>
            <Input 
              placeholder="Where should we send it?" 
              value={details}
              onChange={e => setDetails(e.target.value)}
              className="bg-input border-border"
            />
          </div>

          <Button 
            onClick={handleWithdraw}
            disabled={createWithdrawal.isPending}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12"
          >
            Submit Request
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center mt-2">
            <AlertCircle className="w-3 h-3" /> Processing takes 3-5 business days
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-bold mb-3">History</h3>
        <div className="space-y-3">
          {withdrawals?.map((w: any) => (
            <Card key={w.id} className="p-3 bg-card border-border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-sm">{(w.amount / GEMS_TO_USD_RATE).toFixed(2)} USD</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(w.createdAt), 'MMM d, yyyy')}</div>
                </div>
                <Badge variant="outline" className={`text-[10px] capitalize ${getStatusColor(w.status)}`}>
                  {w.status}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                <span className="capitalize font-medium text-foreground">{w.method}</span>: {w.accountDetails}
              </div>
              {w.adminNote && (
                <div className="mt-2 text-xs text-red-400 bg-red-500/10 p-2 rounded-md border border-red-500/20">
                  Note: {w.adminNote}
                </div>
              )}
            </Card>
          ))}
          {withdrawals?.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground bg-card/50 rounded-xl border border-border/30">
              No previous withdrawals.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
