
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

export type User = {
  id: string;
  email: string;
  nom: string;
  prenom: string;
};

export type Watch = {
  id: number;
  creator: string;
  name: string;
  votes: number;
  image: string;
  components: PartOption[];
}

export type Region = {
    id: number,
    name: string,
    votes: number,
}

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
    config: Record<string, string>;
    engraving?: string;
  }) => void;
};
