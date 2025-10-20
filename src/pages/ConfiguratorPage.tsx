import React, { useEffect, useMemo, useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";

/**
 * WatchConfiguratorLite
 * Enhanced version with animated layer transitions,
 * image export, and luxury-tailored Tailwind styling.
 */

// ---------- Types ----------
export type Stock = "in" | "low" | "oos" | undefined;
export type PartOption = {
  id: string;
  name: string;
  thumbnail?: string;
  image: string;
  price?: number;
  stock?: Stock;
};

export type PartsCatalog = {
  case: PartOption[];
  strap: PartOption[];
  crystal?: PartOption[];
  shadow?: PartOption[];
};

export type Pricing = { base: number; currency: string };

export type WatchConfiguratorLiteProps = {
  brand?: string;
  assets: PartsCatalog;
  pricing: Pricing;
  defaultChoice?: Partial<Record<keyof PartsCatalog, string>>;
  onCheckout?: (payload: {
    sku: string;
    price: number;
    config: Record<string, string>;
  }) => void;
};

// ---------- Utils ----------
const cx = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(" ");
const fmt = (v: number, ccy: string) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: ccy,
  }).format(v);
const findOpt = (list: PartOption[] | undefined, id?: string) =>
  list?.find((o) => o.id === id) || list?.[0];

const toQuery = (conf: Record<string, string>) =>
  `?${new URLSearchParams(conf).toString()}`;
const fromQuery = (): Record<string, string> => {
  const out: Record<string, string> = {};
  const p = new URLSearchParams(window.location.search);
  p.forEach((v, k) => (out[k] = v));
  return out;
};

// ---------- Component ----------
export default function WatchConfiguratorLite({
  assets,
  pricing,
  defaultChoice,
  brand = "Montres Bastille",
  onCheckout,
}: WatchConfiguratorLiteProps) {
  const initial: Record<string, string> = useMemo(() => {
    const q = typeof window !== "undefined" ? fromQuery() : {};
    return {
      case: q.case || defaultChoice?.case || assets.case[0]?.id,
      strap: q.strap || defaultChoice?.strap || assets.strap[0]?.id,
      crystal:
        q.crystal ||
        defaultChoice?.crystal ||
        assets.crystal?.[0]?.id ||
        "",
      shadow:
        q.shadow || defaultChoice?.shadow || assets.shadow?.[0]?.id || "",
    };
  }, [assets, defaultChoice]);

  const [config, setConfig] = useState<Record<string, string>>(initial);
  const [zoom, setZoom] = useState(1);

  // permalink
  const href = useMemo(() => toQuery(config), [config]);
  useEffect(() => {
    const url = `${window.location.pathname}${href}`;
    window.history.replaceState(null, "", url);
  }, [href]);

  // keyboard zoom
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "+")
        setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)));
      if (e.key === "-")
        setZoom((z) => Math.max(0.8, +(z - 0.1).toFixed(2)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const price = useMemo(() => {
    let p = pricing.base;
    const add = (part: keyof PartsCatalog) => {
      const id = config[part as string];
      const opt = (assets[part] || []).find((o) => o.id === id);
      if (opt?.price) p += opt.price;
    };
    add("case");
    add("strap");
    add("crystal");
    return p;
  }, [config, pricing, assets]);

  const sku = useMemo(
    () =>
      [config.case, config.strap, config.crystal]
        .filter(Boolean)
        .join("-"),
    [config]
  );

  const layers: Array<{ key: string; src?: string }> = [
    { key: "shadow", src: findOpt(assets.shadow, config.shadow)?.image },
    { key: "strap", src: findOpt(assets.strap, config.strap)?.image },
    { key: "case", src: findOpt(assets.case, config.case)?.image },
    { key: "crystal", src: findOpt(assets.crystal, config.crystal)?.image },
  ];

  async function handleDownload() {
    const el = document.querySelector("#watch-viewer");
    if (!el) return;
    const canvas = await html2canvas(el as HTMLElement, {
      backgroundColor: null,
    });
    const link = document.createElement("a");
    link.download = `MontresBastille_${sku}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function SelectGrid({
    part,
    title,
  }: {
    part: keyof PartsCatalog;
    title: string;
  }) {
    const options = (assets[part] || []) as PartOption[];
    const current = config[part as string];

    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-serif text-lg">{title}</h4>
          {options.length > 6 && (
            <span className="text-xs text-ink/60">
              {options.length} options
            </span>
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
                current === o.id
                  ? "border-champagne ring-1 ring-champagne"
                  : "border-wheat-400/50"
              )}
            >
              {o.thumbnail ? (
                <img
                  src={o.thumbnail}
                  alt={o.name}
                  className="mx-auto h-14 w-14 object-contain"
                />
              ) : (
                <span className="block text-xs text-center py-6">
                  {o.name}
                </span>
              )}
              <div className="mt-1 text-center text-xs">
                <span className="font-medium">{o.name}</span>
                {o.price ? (
                  <span className="ml-1 text-ink/60">
                    +{fmt(o.price, pricing.currency)}
                  </span>
                ) : null}
              </div>
              {o.stock && (
                <span
                  className={cx(
                    "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-sans uppercase tracking-wider",
                    o.stock === "in" && "bg-emerald-600 text-ivory",
                    o.stock === "low" && "bg-amber-600 text-ivory",
                    o.stock === "oos" && "bg-rose-700 text-ivory"
                  )}
                >
                  {o.stock === "in"
                    ? "En stock"
                    : o.stock === "low"
                    ? "Faible"
                    : "Rupture"}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section id="configurator" className="bg-midnight text-ivory pt-8">
      <div className="px-6 md:px-12 py-16 ">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-2">
            Sélectionnez votre boîtier & bracelet
          </h3>
          <p className="text-ivory/80">
            Visualisation en temps réel • Lien partageable • Prix mis à jour
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-start">
          {/* Viewer */}
          <div className="bg-midnight/60 rounded-2xl border border-champagne/30 p-4 shadow-xl">
            <div
              id="watch-viewer"
              className="relative mx-auto aspect-square max-w-[560px] select-none overflow-hidden rounded-xl 
              bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),rgba(0,0,0,0.7))]"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center",
              }}
              aria-label="Aperçu de la montre personnalisée"
              role="img"
            >
              <AnimatePresence mode="wait">
                {layers.map(
                  (l) =>
                    l.src && (
                      <motion.img
                        key={l.key + l.src}
                        src={l.src}
                        alt=""
                        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                      />
                    )
                )}
              </AnimatePresence>
            </div>

            {/* Viewer controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm">
                <button
                  className="rounded-full border border-champagne/50 px-3 py-1 transition"
                  onClick={() =>
                    setZoom((z) => Math.max(0.8, +(z - 0.1).toFixed(2)))
                  }
                  aria-label="Zoom out"
                >
                  –
                </button>
                <div className="min-w-16 text-center text-xs">
                  Zoom {Math.round(zoom * 100)}%
                </div>
                <button
                  className="rounded-full border border-champagne/50 px-3 py-1 transition"
                  onClick={() =>
                    setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)))
                  }
                  aria-label="Zoom in"
                >
                  +
                </button>
              </div>
              <div className="flex gap-2">
                <a
                  href={href}
                  className="inline-flex items-center gap-2 rounded-full bg-champagne text-midnight font-sans px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all hover:-translate-y-[1px] hover:shadow"
                  title="Lien permanent de cette configuration"
                >
                  <GoArrowUpRight /> Lien
                </a>
                <button
                  onClick={handleDownload}
                  className="rounded-full border border-champagne/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ivory/90 hover:-translate-y-[1px] transition"
                >
                  Télécharger
                </button>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-champagne/40 bg-midnight/60 p-5">
              <div className="flex items-baseline justify-between">
                <h4 className="font-serif text-xl">Votre sélection</h4>
                <div className="text-sm text-ivory/80">SKU: {sku}</div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-ivory/80">
                <div>Boîtier</div>
                <div className="text-right">
                  {findOpt(assets.case, config.case)?.name}
                </div>
                <div>Bracelet</div>
                <div className="text-right">
                  {findOpt(assets.strap, config.strap)?.name}
                </div>
              </div>
              <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-champagne/60 to-transparent" />
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-ivory/80">Prix</div>
                <div className="text-2xl font-serif">
                  {fmt(price, pricing.currency)}
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-champagne text-midnight font-sans px-5 py-3 text-sm uppercase tracking-[0.2em] transition-all hover:-translate-y-[2px] hover:shadow"
                  onClick={() => onCheckout?.({ sku, price, config })}
                >
                  <GoArrowUpRight /> Commander
                </button>
                <button
                  className="rounded-full border border-champagne/50 px-5 py-3 text-sm uppercase tracking-[0.2em] text-ivory/90 transition"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}${window.location.pathname}${href}`
                    )
                  }
                >
                  Copier le lien
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-champagne/40 bg-midnight/60 p-5 space-y-8">
              <SelectGrid part="case" title="Boîtier" />
              <SelectGrid part="strap" title="Bracelet" />
              {assets.crystal && assets.crystal.length > 0 && (
                <SelectGrid part="crystal" title="Verre" />
              )}
              {assets.shadow && assets.shadow.length > 0 && (
                <SelectGrid part="shadow" title="Ombre" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
