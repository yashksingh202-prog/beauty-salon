import { useState } from "react";
import { useGame } from "@/context/GameContext";
import NavBar from "@/components/NavBar";
import CoinBar from "@/components/CoinBar";

type ShopCategory = "boosters" | "cosmetics" | "salon" | "gems";

type ShopItem = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  costCoins?: number;
  costGems?: number;
  category: ShopCategory;
  effect: string;
  isPopular?: boolean;
  isBestValue?: boolean;
};

const SHOP_ITEMS: ShopItem[] = [
  // Boosters
  { id: "coin_boost_2x",   name: "2x Coin Boost",      emoji: "🪙", description: "Double coins for the next 5 levels",      costCoins: 300,  category: "boosters", effect: "2x coins ×5 levels", isPopular: true },
  { id: "xp_boost_2x",     name: "2x XP Boost",         emoji: "⭐", description: "Double XP for the next 5 levels",         costCoins: 250,  category: "boosters", effect: "2x XP ×5 levels" },
  { id: "star_guarantee",  name: "Star Shield",          emoji: "🛡️", description: "Guarantee at least 1 star on next level", costCoins: 150,  category: "boosters", effect: "1-star guarantee" },
  { id: "hint_pack",       name: "Hint Pack",            emoji: "💡", description: "Reveal customer preferences for 3 levels", costCoins: 200,  category: "boosters", effect: "3 preference hints" },
  { id: "tip_master",      name: "Tip Master",           emoji: "💰", description: "Earn 50% extra tips for 10 levels",       costGems: 3,     category: "boosters", effect: "+50% tips ×10 levels", isBestValue: true },
  { id: "perfect_streak",  name: "Perfect Streak",       emoji: "🎯", description: "Next 3 choices are treated as perfect",   costGems: 5,     category: "boosters", effect: "Perfect ×3 choices" },

  // Cosmetics (salon decoration)
  { id: "pink_chair",      name: "Pink Crystal Chair",   emoji: "💺", description: "Upgrade your salon with a gorgeous pink throne",  costCoins: 800,  category: "cosmetics", effect: "Salon decoration" },
  { id: "gold_mirror",     name: "Gold Frame Mirror",    emoji: "🪞", description: "An ornate gold mirror for your salon",            costCoins: 1200, category: "cosmetics", effect: "Salon decoration" },
  { id: "flower_wall",     name: "Rose Gold Flower Wall",emoji: "🌸", description: "A stunning floral backdrop for makeovers",       costCoins: 1500, category: "cosmetics", effect: "Salon decoration", isPopular: true },
  { id: "neon_sign",       name: "Glam Neon Sign",       emoji: "💄", description: "A neon 'Glam Empire' sign for your salon",      costCoins: 2000, category: "cosmetics", effect: "Salon decoration" },
  { id: "vip_lounge",      name: "VIP Lounge Chair",     emoji: "🥂", description: "Ultra-luxe seating for your most special clients", costGems: 8,   category: "cosmetics", effect: "VIP decoration" },

  // Salon upgrades shortcuts
  { id: "coin_pack_sm",    name: "Coin Pack S",          emoji: "🪙", description: "500 coins instantly",           costGems: 1,  category: "gems", effect: "+500 coins" },
  { id: "coin_pack_md",    name: "Coin Pack M",          emoji: "💰", description: "2,000 coins instantly",        costGems: 3,  category: "gems", effect: "+2,000 coins", isBestValue: true },
  { id: "coin_pack_lg",    name: "Coin Pack L",          emoji: "💸", description: "10,000 coins instantly",      costGems: 12, category: "gems", effect: "+10,000 coins" },
  { id: "gem_pack_sm",     name: "Gem Pack S",           emoji: "💎", description: "5 gems instantly",            costCoins: 1000, category: "gems", effect: "+5 gems" },
  { id: "gem_pack_md",     name: "Gem Pack M",           emoji: "💎", description: "15 gems instantly",          costCoins: 2500, category: "gems", effect: "+15 gems", isPopular: true },
];

const CATEGORIES: { id: ShopCategory; label: string; emoji: string }[] = [
  { id: "boosters",  label: "Boosters",  emoji: "⚡" },
  { id: "cosmetics", label: "Decor",     emoji: "🌸" },
  { id: "gems",      label: "Packs",     emoji: "💎" },
];

export default function Shop() {
  const { user, purchaseShopItem, purchaseShopItemWithGems, addCoins, addGems, spendGems, checkAchievements } = useGame();
  const [activeCategory, setActiveCategory] = useState<ShopCategory>("boosters");
  const [buyResult, setBuyResult] = useState<{ msg: string; success: boolean } | null>(null);

  const items = SHOP_ITEMS.filter(i => i.category === activeCategory);
  const owned = user?.shopPurchases ?? [];

  function handleBuy(item: ShopItem) {
    let success = false;
    if (item.costCoins) {
      success = purchaseShopItem(item.id, item.costCoins);
      if (success) {
        // Apply instant effects
        if (item.id === "gem_pack_sm")  addGems(5);
        if (item.id === "gem_pack_md")  addGems(15);
      }
    } else if (item.costGems) {
      if ((user?.gems ?? 0) < item.costGems) {
        setBuyResult({ msg: "Not enough gems!", success: false });
        setTimeout(() => setBuyResult(null), 2000);
        return;
      }
      if (item.category === "gems") {
        // Consumable coin pack — spend gems, apply coins, no ownership tracking
        success = spendGems(item.costGems);
        if (success) {
          if (item.id === "coin_pack_sm") addCoins(500);
          if (item.id === "coin_pack_md") addCoins(2000);
          if (item.id === "coin_pack_lg") addCoins(10000);
        }
      } else {
        // Tracked booster / cosmetic — record in shopPurchases
        success = purchaseShopItemWithGems(item.id, item.costGems);
      }
    }

    if (success) {
      setBuyResult({ msg: `${item.emoji} ${item.name} purchased!`, success: true });
      checkAchievements();
    } else {
      setBuyResult({ msg: item.costCoins ? "Not enough coins!" : "Not enough gems!", success: false });
    }
    setTimeout(() => setBuyResult(null), 2500);
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: "linear-gradient(160deg,hsl(285 40% 8%),hsl(330 35% 11%),hsl(310 30% 9%))" }}>
      <CoinBar title="Shop" showBack />

      <div className="px-4 max-w-lg mx-auto mt-4">

        {/* Balance cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-2xl p-3 text-center glass-card-gold">
            <div className="text-2xl mb-0.5">🪙</div>
            <div className="font-fredoka text-yellow-300 text-xl">{(user?.coins ?? 0).toLocaleString()}</div>
            <div className="text-yellow-200/50 text-xs font-bold">COINS</div>
          </div>
          <div className="rounded-2xl p-3 text-center glass-card">
            <div className="text-2xl mb-0.5">💎</div>
            <div className="font-fredoka text-purple-300 text-xl">{user?.gems ?? 0}</div>
            <div className="text-purple-200/50 text-xs font-bold">GEMS</div>
          </div>
        </div>

        {/* Purchase result toast */}
        {buyResult && (
          <div className={`rounded-2xl p-3 mb-4 text-center font-fredoka text-lg animate-bounce-in ${buyResult.success ? "glass-card-gold" : "glass-card"}`}
            style={{ color: buyResult.success ? "#FFD700" : "#ff6b6b" }}>
            {buyResult.msg}
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 mb-4">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm tap-scale transition-all"
              style={{
                background: activeCategory === cat.id ? "linear-gradient(135deg,rgba(255,80,150,0.3),rgba(180,80,255,0.2))" : "rgba(255,255,255,0.05)",
                border: activeCategory === cat.id ? "1px solid rgba(255,80,150,0.5)" : "1px solid rgba(255,255,255,0.08)",
                color: activeCategory === cat.id ? "white" : "rgba(255,255,255,0.5)",
              }}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 gap-3">
          {items.map(item => {
            const isOwned = owned.includes(item.id) && item.category !== "gems";
            const canAfford = item.costCoins
              ? (user?.coins ?? 0) >= item.costCoins
              : (user?.gems ?? 0) >= (item.costGems ?? 0);

            return (
              <div key={item.id}
                className="rounded-2xl p-4 flex items-center gap-3 animate-slide-up"
                style={{
                  background: isOwned ? "rgba(255,200,60,0.08)" : "rgba(255,255,255,0.05)",
                  border: isOwned ? "1px solid rgba(255,200,60,0.25)" : "1px solid rgba(255,255,255,0.08)",
                }}>
                {/* Tags */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: "rgba(255,255,255,0.06)" }}>
                    {item.emoji}
                  </div>
                  {item.isPopular && (
                    <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                      style={{ background: "linear-gradient(135deg,#ff4d94,#c084fc)", color: "white" }}>
                      HOT
                    </div>
                  )}
                  {item.isBestValue && (
                    <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                      style={{ background: "linear-gradient(135deg,#FFD700,#FF9A3C)", color: "#1a0a00" }}>
                      BEST
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-fredoka text-white text-sm">{item.name}</div>
                  <div className="text-white/45 text-xs">{item.description}</div>
                  <div className="text-pink-300/70 text-[11px] font-bold mt-0.5">{item.effect}</div>
                </div>

                {/* Buy button */}
                <div className="shrink-0">
                  {isOwned ? (
                    <div className="px-3 py-2 rounded-xl text-xs font-bold text-green-300 glass-card">✓ Owned</div>
                  ) : (
                    <button onClick={() => handleBuy(item)}
                      className="px-3 py-2 rounded-xl text-xs font-bold tap-scale transition-all"
                      style={{
                        background: canAfford ? "linear-gradient(135deg,rgba(255,80,150,0.3),rgba(180,80,255,0.2))" : "rgba(255,255,255,0.06)",
                        border: canAfford ? "1px solid rgba(255,80,150,0.4)" : "1px solid rgba(255,255,255,0.1)",
                        color: canAfford ? "white" : "rgba(255,255,255,0.3)",
                      }}>
                      {item.costCoins ? `🪙 ${item.costCoins.toLocaleString()}` : `💎 ${item.costGems}`}
                    </button>
                  )}
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
