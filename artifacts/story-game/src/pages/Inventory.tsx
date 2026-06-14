import { useGetInventory, useEquipItem, getGetInventoryQueryKey, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Shield } from "lucide-react";
import { toast } from "sonner";

export default function Inventory() {
  const queryClient = useQueryClient();
  const { data: inventory, isLoading } = useGetInventory();
  const equipItem = useEquipItem();

  const handleEquip = (itemId: number) => {
    equipItem.mutate({ itemId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetInventoryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() }); // avatar might change
        toast.success("Item equipped!");
      },
      onError: () => toast.error("Failed to equip item")
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24 max-w-md mx-auto">
      <div>
        <h1 className="text-3xl font-black text-foreground mb-1 flex items-center gap-2">
          <Package className="text-primary w-6 h-6" /> Inventory
        </h1>
        <p className="text-muted-foreground text-sm">Manage your avatars and badges</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {inventory?.items.map((item: any) => (
          <Card key={item.id} className={`p-3 flex flex-col bg-card border transition-colors ${item.isEquipped ? 'border-primary shadow-[0_0_10px_rgba(255,223,115,0.1)]' : 'border-border'}`}>
            <div className="aspect-square rounded-lg bg-muted/50 mb-3 overflow-hidden border border-border/50 flex items-center justify-center p-2 relative">
              {item.isEquipped && (
                <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[8px] font-bold px-1.5 py-0.5 rounded-sm">
                  EQUIPPED
                </div>
              )}
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
              ) : (
                <Shield className="w-10 h-10 text-muted-foreground/30" />
              )}
            </div>
            
            <h3 className="font-bold text-sm text-foreground mb-1 truncate">{item.name}</h3>
            <Badge variant="outline" className="w-fit text-[9px] h-4 px-1 py-0 mb-3 bg-muted">
              {item.type}
            </Badge>
            
            <div className="mt-auto pt-2">
              {item.isEquipped ? (
                <Button disabled variant="outline" className="w-full h-8 text-xs border-primary/50 text-primary bg-primary/5">
                  Equipped
                </Button>
              ) : (
                <Button 
                  onClick={() => handleEquip(item.id)}
                  disabled={equipItem.isPending}
                  variant="secondary" 
                  className="w-full h-8 text-xs font-medium"
                >
                  Equip
                </Button>
              )}
            </div>
          </Card>
        ))}
        
        {(!inventory?.items || inventory.items.length === 0) && (
          <div className="col-span-2 text-center py-12 text-muted-foreground bg-card border border-border rounded-xl">
            Your inventory is empty. Defeat bosses and complete events to earn items!
          </div>
        )}
      </div>
    </div>
  );
}
