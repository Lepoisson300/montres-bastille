
// ---------- Types ----------
export type PartOption = {
  id: string;
  name: string;
  price: number; // delta over base
  thumbnail: string; // small preview image
  stock: "in" | "low" | "oos"; // inventory badge
  material?: string;
  color?: string;
  regions?: string[]; // list of region codes where this part is available
  [key: string]: any;
};

export type PartsCatalog = {
  cases: PartOption[];
  dials: PartOption[];
  hands: PartOption[];
  straps: PartOption[];
};

export type Rules = {
  bans?: Array<{ if: Partial<Record<keyof PartsCatalog, string>>; because: string }>
  requires?: Array<{ if: Partial<Record<keyof PartsCatalog, string>>; then: Partial<Record<keyof PartsCatalog, string>>; note?: string }>
};

export type Pricing = {
  base: number;
  currency: string; // e.g., "EUR"
};

export type WatchConfiguratorProps = {
  assets: PartsCatalog;
  pricing: Pricing;
  selectedRegion?: string;
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
