import type { PartOption, PartsCatalog } from "./Parts";

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
    price: number;
    config: PartOption[];
  }) => void;
};


export type CartItem ={
  composants: PartOption[];
  price: number;
  id?: string;
  name?: string;
}
