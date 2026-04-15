
// ---------- Types ----------
export type PartOption = {
  id: string;
  material: string;
  name: string;
  price: number; // delta over base
  regions: string[]; // list of region codes where this part is available
  size: string;
  stock:number;
  description:string
  thumbnail: string; // small preview image
  type:string
};

export type PartsCatalog = {
  mouvement:PartOption[];
  cases: PartOption[];
  dials: PartOption[];
  hands: PartOption[];
  straps: PartOption[];
};

export type CartItem ={
  composants: PartOption[];
  price: number;
  id?: string;
  name?: string;
}

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
    config: PartOption[];
  }) => void;
};
