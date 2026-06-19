
export type StepType = "shaving" | "washing" | "makeup" | "hairstyle" | "outfit" | "nails";

export type LevelDifficulty = "easy" | "medium" | "hard" | "expert";

export type LevelDef = {
  id: string;
  name: string;
  difficulty: LevelDifficulty;
  steps: StepType[];  coinReward: number;
  xpReward: number;
  theme: string;
};

const STEP_POOLS: Record<LevelDifficulty, StepType[][]> = {
  easy:   [["shaving"], ["washing"], ["makeup"], ["hairstyle"], ["shaving", "makeup"], ["washing", "nails"]],
  medium: [["shaving", "makeup"], ["washing", "hairstyle"], ["makeup", "nails"], ["shaving", "outfit"], ["washing", "makeup", "nails"], ["hairstyle", "outfit"]],
  hard:   [["shaving", "washing", "makeup"], ["washing", "makeup", "nails"], ["shaving", "hairstyle", "outfit"], ["makeup", "hairstyle", "nails"], ["shaving", "washing", "outfit"], ["washing", "nails", "hairstyle"]],
  expert: [["shaving", "washing", "makeup", "nails"], ["washing", "makeup", "hairstyle", "outfit"], ["shaving", "makeup", "hairstyle", "nails"], ["shaving", "washing", "hairstyle", "outfit"], ["washing", "makeup", "nails", "outfit"], ["shaving", "washing", "makeup", "hairstyle", "outfit"]],
};

const THEMES = ["Princess", "Pop Star", "Beach Babe", "Night Out", "Cozy Day", "Prom Queen", "Street Style", "Fantasy", "Retro", "Boho"];

export const LEVELS: LevelDef[] = Array.from({ length: 1000 }, (_, i) => {
  const id = String(i + 1);
  const diff: LevelDifficulty = i < 250 ? "easy" : i < 500 ? "medium" : i < 750 ? "hard" : "expert";
  const stepOptions = STEP_POOLS[diff];
  const steps = stepOptions[i % stepOptions.length];
  const theme = THEMES[i % THEMES.length];
  return {
    id,
    name: `${theme} Makeover ${Math.ceil((i + 1) / 10)}`,
    difficulty: diff,
    steps,
    coinReward: 50 + i * 15,
    xpReward: 20 + i * 8,
    theme,
  };
});

export function getLevelById(id: string): LevelDef | undefined {
  return LEVELS.find(l => l.id === id);
}

export const DIFFICULTY_COLORS: Record<LevelDifficulty, string> = {
  easy:   "text-emerald-500",
  medium: "text-amber-500",
  hard:   "text-orange-500",
  expert: "text-rose-500",
};

export const DIFFICULTY_BG: Record<LevelDifficulty, string> = {
  easy:   "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard:   "bg-orange-100 text-orange-700",
  expert: "bg-rose-100 text-rose-700",
};
