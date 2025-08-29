
// ---------- Types ----------
export type PartOption = {
  id: string;
  name: string;
  price?: number; // delta over base
  img: string; // transparent PNG layer (same canvas size for all parts)
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

// ---------- Helpers ----------
const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" ");

function formatPrice(value: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(value);
}

function toQuery(config: Record<string, string>, engraving?: string) {
  const p = new URLSearchParams(config);
  if (engraving) p.set("engraving", engraving);
  return `?${p.toString()}`;
}

function fromQuery(): Record<string, string> {
  const p = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  p.forEach((v, k) => (out[k] = v));
  return out;
}

function usePermalink(config: Record<string, string>, engraving?: string) {
  const href = useMemo(() => toQuery(config, engraving), [config, engraving]);
  useEffect(() => {
    const url = `${window.location.pathname}${href}`;
    window.history.replaceState(null, "", url);
  }, [href]);
  return href;
}

function findOption(list: PartOption[] | undefined, id: string | undefined) {
  if (!list || !id) return undefined;
  return list.find((o) => o.id === id) || list[0];
}

// Very small rule engine
function validate(rules: Rules | undefined, config: Record<string, string>) {
  const issues: string[] = [];
  if (!rules) return issues;

  rules.bans?.forEach((rule) => {
    const matches = Object.entries(rule.if).every(([k, v]) => config[k] === v);
    if (matches) issues.push(rule.because);
  });

  rules.requires?.forEach((rule) => {
    const matches = Object.entries(rule.if).every(([k, v]) => config[k] === v);
    if (matches) {
      Object.entries(rule.then).forEach(([k, v]) => {
        if (config[k] !== v) issues.push(rule.note || `Nécessite ${k}: ${v}`);
      });
    }
  });

  return issues;
}

function computePrice(pricing: Pricing, assets: PartsCatalog, config: Record<string, string>) {
  let price = pricing.base;
  (Object.keys(config) as Array<keyof PartsCatalog>).forEach((part) => {
    const list = assets[part];
    const opt = list?.find((o) => o.id === (config as any)[part]);
    if (opt?.price) price += opt.price;
  });
  return price;
}