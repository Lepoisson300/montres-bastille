
// ---------- Types ----------
export type PartOption = {
  id: string;
  name: string;
  price?: number; // delta over base
  thumbnail?: string; // small preview image
  stock?: "in" | "low" | "oos"; // inventory badge
  meta?: Record<string, any>;
};

export type PartsCatalog = {
  case: PartOption[];
  dial: PartOption[];
  hands: PartOption[];
  strap: PartOption[];
  crystal?: PartOption[]; // optional overlay for AR coating/reflections
  shadow?: PartOption[]; // optional shadow base
};

export type Rules = {
  // Disallow combinations
  bans?: Array<{ if: Partial<Record<keyof PartsCatalog, string>>; because: string }>
  // Require combinations (e.g., certain dial requires date hands)
  requires?: Array<{ if: Partial<Record<keyof PartsCatalog, string>>; then: Partial<Record<keyof PartsCatalog, string>>; note?: string }>
};

export type Pricing = {
  base: number;
  currency: string; // e.g., "EUR"
  // Optional per-part multipliers or taxes by region if you need them
};

export type WatchConfiguratorProps = {
  assets: PartsCatalog;
  pricing: Pricing;
  rules?: Rules;
  defaultChoice?: Partial<Record<keyof PartsCatalog, string>>;
  brand?: string;
  onCheckout?: (payload: {
    sku: string;
    price: number;
    config: Record<string, string>;
    engraving?: string;
  }) => void;
};
