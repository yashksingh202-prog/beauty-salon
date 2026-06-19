import { useState } from "react";
import { useGame } from "@/context/GameContext";
import CoinBar from "@/components/CoinBar";
import NavBar from "@/components/NavBar";
import { ChevronLeft, ShoppingBag, Coins, Check } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ShopItem = {
  id: string;
  name: string;
  description: string;
  cost: number;
  costType: "coins" | "gems";
  category: "tool" | "theme" | "boost";
  color: string;
};

const SHOP_ITEMS: ShopItem[] = [
  { id: "golden_razor",    name: "Golden Razor",     description: "Shave 2x faster",        cost: 500,  costType: "coins", category: "tool",  color: "from-yellow-400 to-amber-500" },
  { id: "sparkle_sponge",  name: "Sparkle Sponge",   description: "Washing gives +10 XP",   cost: 750,  costType: "coins", category: "tool",  color: "from-cyan-400 to-blue-500" },
  { id: "magic_brush",     name: "Magic Brush",      description: "Makeup auto-completes",   cost: 10000, costType: "coins", category: "tool",  color: "from-violet-400 to-purple-500" },
  { id: "pink_theme",      name: "Pink Paradise",    description: "Rose pink UI theme",      cost: 300,  costType: "coins", category: "theme", color: "from-pink-400 to-rose-500" },
  { id: "purple_theme",    name: "Purple Dream",     description: "Lavender UI theme",       cost: 300,  costType: "coins", category: "theme", color: "from-violet-400 to-purple-500" },
  { id: "gold_theme",      name: "Gold Edition",     description: "Golden UI theme",         cost: 2,    costType: "gems",  category: "theme", color: "from-yellow-400 to-orange-500" },
  { id: "xp_boost",        name: "XP Boost x2",      description: "Double XP for 10 levels", cost: 1,    costType: "gems",  category: "boost", color: "from-emerald-400 to-teal-500" },
  { id: "coin_magnet",     name: "Coin Magnet",      description: "+25% coins from levels",  cost: 3,    costType: "gems",  category: "boost", color: "from-amber-400 to-orange-500" },
  { id: "time_freeze",     name: "Time Freeze",      description: "No time limit for 5 levels",cost: 1,  costType: "gems",  category: "boost", color: "from-sky-400 to-indigo-500" },
];

type Category = "all" | "tool" | "theme" | "boost";

export default function Shop() {
  const { user, addCoins, addGems, unlockAchievement } = useGame();
  const { toast } = useToast();
  const [category, setCategory] = useState<Category>("all");
  const [purchased, setPurchased] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("glamstar_shop_" + (user?.id ?? "")) ?? "[]")
  );

  if (!user) return null;

  const shown = category === "all" ? SHOP_ITEMS : SHOP_ITEMS.filter(i => i.category === category);

  const handleBuy = (item: ShopItem) => {
    if (purchased.includes(item.id)) {
      toast({ title: "Already owned!", variant: "destructive" });
      return;
    }
    if (item.costType === "coins" && user.coins < item.cost) {
      toast({ title: "Not enough coins!", variant: "destructive" });
      return;
    }
    if (item.costType === "gems" && user.gems < item.cost) {
      toast({ title: "Not enough gems!", variant: "destructive" });
      return;
    }
    if (item.costType === "coins") addCoins(-item.cost);
    else addGems(-item.cost);

    const newOwned = [...purchased, item.id];
    setPurchased(newOwned);
    localStorage.setItem("glamstar_shop_" + user.id, JSON.stringify(newOwned));
    unlockAchievement("shop_visitor");
    toast({ title: `${item.name} purchased!`, description: "Item added to your collection" });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <CoinBar />
      <div className="pt-14 px-4 max-w-md mx-auto">
        <div className="flex items-center gap-3 py-3">
          <Link href="/hub">
            <button className="p-2 rounded-xl bg-card border border-border">
              <ChevronLeft size={20} />
            </button>
          </Link>
          <h1 className="font-fredoka text-2xl">Shop</h1>
          <ShoppingBag size={20} className="ml-auto text-primary" />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-4">
          {(["all","tool","theme","boost"] as Category[]).map(c => (
            <button
              key={c}
              data-testid={`shop-cat-${c}`}
              onClick={() => setCategory(c)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                category === c ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-2 gap-3">
          {shown.map(item => {
            const owned = purchased.includes(item.id);
            const canAfford = item.costType === "coins" ? user.coins >= item.cost : user.gems >= item.cost;
            return (
              <div
                key={item.id}
                data-testid={`shop-item-${item.id}`}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div className={`h-20 bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                  {owned && (
                    <div className="bg-white/30 rounded-full p-2">
                      <Check size={24} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-fredoka text-sm text-foreground">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                  <Button
                    size="sm"
                    onClick={() => handleBuy(item)}
                    disabled={owned || !canAfford}
                    className={`w-full text-xs h-8 ${owned ? "bg-muted text-muted-foreground" : ""}`}
                    variant={owned ? "outline" : "default"}
                  >
                    {owned ? "Owned" : (
                      <span className="flex items-center gap-1">
                        {item.costType === "coins"
                          ? <><Coins size={12} />{item.cost}</>
                          : <><span className="text-cyan-400">♦</span>{item.cost}</>}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <NavBar />
    </div>
  );
}
