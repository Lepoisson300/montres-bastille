import React, { useEffect, useMemo, useRef, useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import type {PartOption, PartsCatalog, Rules, Pricing, WatchConfiguratorProps} from "../types/Parts";
/**
 * WatchConfigurator
 * 2D layer-based configurator that matches the serif/lux French aesthetic from your page.
 * - Tailwind utility classes aligned to your palette (parchment/midnight/champagne/etc.)
 * - URL permalinks (?case=steel_40&dial=navy&hands=sword&strap=leather_tan)
 * - Simple rule engine + live price + stock badge
 * - Keyboard & screen-reader friendly
 * - Optional engraving preview
 *
 * HOW TO USE
 * 1) Import and render <WatchConfigurator assets={...} pricing={...} rules={...} onCheckout={fn} />
 * 2) Provide PNG layers for each part (transparent background). Layers stack in this order:
 *        case -> dial -> hands -> strap (under-lug) -> glass/reflection -> shadow
 * 3) Drop the section into your #configurator anchor on the page.
 */
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

// ---------- Component ----------
export default function WatchConfigurator({ assets, pricing, rules, defaultChoice, brand = "Montres Bastille", onCheckout, }: WatchConfiguratorProps) {
  // derived defaults
  const initial: Record<string, string> = useMemo(() => {
    const q = typeof window !== "undefined" ? fromQuery() : {};
    return {
      case: q.case || defaultChoice?.case || assets.case[0]?.id,
      dial: q.dial || defaultChoice?.dial || assets.dial[0]?.id,
      hands: q.hands || defaultChoice?.hands || assets.hands[0]?.id,
      strap: q.strap || defaultChoice?.strap || assets.strap[0]?.id,
      crystal: q.crystal || defaultChoice?.crystal || assets.crystal?.[0]?.id,
      shadow: q.shadow || defaultChoice?.shadow || assets.shadow?.[0]?.id,
    } as any;
  }, [assets, defaultChoice]);

  const [config, setConfig] = useState<Record<string, string>>(initial);
  const [engraving, setEngraving] = useState<string>(new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("engraving") || "");
  const [zoom, setZoom] = useState(1);

  // Update permalink on change
  usePermalink(config, engraving);

  const total = computePrice(pricing, assets, config);
  const issues = validate(rules, config);

  const viewerRef = useRef<HTMLDivElement | null>(null);

  // Accessibility: focus outline for keyboard users
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "+") setZoom((z) => Math.min(2, z + 0.1));
      if (e.key === "-") setZoom((z) => Math.max(0.8, z - 0.1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const layers: Array<{ key: string; src?: string }>
    = [
      { key: "shadow"},
      { key: "strap"},
      { key: "case"},
      { key: "dial"},
      { key: "hands"},
      { key: "crystal"},
    ];

  const sku = useMemo(() => [config.case, config.dial, config.hands, config.strap].filter(Boolean).join("-"), [config]);

  function SelectGrid<T extends keyof PartsCatalog>({ part, title }: { part: T; title: string }) {
    const options = (assets[part] || []) as PartOption[];
    const current = (config as any)[part] as string;

    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-serif text-lg">{title}</h4>
          {options.length > 6 && (
            <span className="text-xs text-ink/60">{options.length} options</span>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {options.map((o) => (
            <button
              key={o.id}
              aria-pressed={current === o.id}
              onClick={() => setConfig((c) => ({ ...c, [part]: o.id }))}
              className={cx(
                "group relative rounded-xl border p-2 transition-all duration-300",
                "bg-parchment/80 backdrop-blur hover:-translate-y-[2px] hover:shadow",
                current === o.id ? "border-champagne ring-1 ring-champagne" : "border-wheat-400/50"
              )}
            >
              {!!o.thumbnail ? (
                <img src={o.thumbnail} alt={o.name} className="mx-auto h-14 w-14 object-contain" />
              ) : (
                <span className="block text-xs text-center py-6">{o.name}</span>
              )}
              <div className="mt-1 text-center text-xs">
                <span className="font-medium">{o.name}</span>
                {o.price ? (
                  <span className="ml-1 text-ink/60">+{formatPrice(o.price, pricing.currency)}</span>
                ) : null}
              </div>
              {o.stock && (
                <span className={cx(
                  "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-sans uppercase tracking-wider",
                  o.stock === "in" && "bg-emerald-600 text-ivory",
                  o.stock === "low" && "bg-amber-600 text-ivory",
                  o.stock === "oos" && "bg-rose-700 text-ivory"
                )}>
                  {o.stock === "in" ? "En stock" : o.stock === "low" ? "Faible" : "Rupture"}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section id="configurator" className="bg-midnight text-ivory">
      <div className="px-6 md:px-12 py-20">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">Configurez votre montre</h3>
          <p className="text-ivory/80">Choisissez les éléments, visualisez en temps réel, enregistrez un lien ou commandez.</p>
        </div>

        {/* Viewer */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="bg-midnight/60 rounded-2xl border border-champagne/30 p-4 shadow-xl">
            <div
              ref={viewerRef}
              className="relative mx-auto aspect-square max-w-[560px] select-none overflow-hidden rounded-xl bg-gradient-to-b from-slate-900/20 to-slate-900/40"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
              aria-label="Aperçu de la montre personnalisée"
              role="img"
            >
              {layers.map((l) => (
                l.src ? (
                  <img key={l.key} src={l.src} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-contain" />
                ) : null
              ))}

              {/* Engraving preview (simple lower arc) */}
              {engraving && (
                <div className="absolute inset-x-0 bottom-6 text-center">
                  <span className="font-serif text-xs tracking-[0.25em] text-ivory/80">{engraving}</span>
                </div>
              )}
            </div>

            {/* Controls below viewer */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm">
                <button
                  className="rounded-full border border-champagne/50 px-3 py-1 hover:-translate-y-[1px] transition"
                  onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.1).toFixed(2)))}
                  aria-label="Zoom out"
                >
                  –
                </button>
                <div className="min-w-16 text-center text-xs">Zoom {Math.round(zoom * 100)}%</div>
                <button
                  className="rounded-full border border-champagne/50 px-3 py-1 hover:-translate-y-[1px] transition"
                  onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)))}
                  aria-label="Zoom in"
                >
                  +
                </button>
              </div>

              <a
                href={toQuery(config, engraving)}
                className="inline-flex items-center gap-2 rounded-full bg-champagne text-midnight font-sans px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all hover:-translate-y-[1px] hover:shadow"
                title="Copier le lien de cette configuration"
              >
                <GoArrowUpRight /> Lien
              </a>
            </div>
          </div>

          {/* Right rail: options */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-champagne/40 bg-midnight/60 p-5">
              <div className="flex items-baseline justify-between">
                <h4 className="font-serif text-xl">Votre sélection</h4>
                <div className="text-sm text-ivory/80">SKU: {sku}</div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-ivory/80">
                <div>Boîtier</div><div className="text-right">{findOption(assets.case, config.case)?.name}</div>
                <div>Cadran</div><div className="text-right">{findOption(assets.dial, config.dial)?.name}</div>
                <div>Aiguilles</div><div className="text-right">{findOption(assets.hands, config.hands)?.name}</div>
                <div>Bracelet</div><div className="text-right">{findOption(assets.strap, config.strap)?.name}</div>
              </div>
              <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-champagne/60 to-transparent" />
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-ivory/80">Prix</div>
                <div className="text-2xl font-serif">{formatPrice(total, pricing.currency)}</div>
              </div>
              {issues.length > 0 && (
                <div className="mt-3 rounded-lg border border-rose-600/40 bg-rose-900/30 p-3 text-sm">
                  {issues.map((msg, i) => (
                    <div key={i}>• {msg}</div>
                  ))}
                </div>
              )}
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-champagne text-midnight font-sans px-5 py-3 text-sm uppercase tracking-[0.2em] transition-all hover:-translate-y-[2px] hover:shadow disabled:opacity-50"
                  disabled={issues.length > 0}
                  onClick={() => onCheckout?.({ sku, price: total, config, engraving })}
                >
                  <GoArrowUpRight /> Commander
                </button>
                <button
                  className="rounded-full border border-champagne/50 px-5 py-3 text-sm uppercase tracking-[0.2em] text-ivory/90 transition hover:-translate-y-[2px]"
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}${toQuery(config, engraving)}`)}
                >
                  Copier le lien
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-champagne/40 bg-midnight/60 p-5 space-y-8">
              <SelectGrid part="case" title="Boîtier" />
              <SelectGrid part="dial" title="Cadran" />
              <SelectGrid part="hands" title="Aiguilles" />
              <SelectGrid part="strap" title="Bracelet" />

              {/* Engraving */}
              <div>
                <h4 className="font-serif text-lg mb-3">Gravure</h4>
                <div className="flex gap-2">
                  <input
                    value={engraving}
                    maxLength={24}
                    onChange={(e) => setEngraving(e.target.value.toUpperCase())}
                    placeholder="EX: POUR LUCIE 2025"
                    className="flex-1 rounded-xl border border-champagne/40 bg-midnight/40 px-3 py-2 text-sm placeholder:text-ivory/40 focus:outline-none focus:ring-1 focus:ring-champagne"
                  />
                  <button
                    className="rounded-xl border border-champagne/50 px-3 py-2 text-sm hover:shadow"
                    onClick={() => setEngraving("")}
                  >
                    Effacer
                  </button>
                </div>
                <div className="mt-2 text-xs text-ivory/70">24 caractères, capitales.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
