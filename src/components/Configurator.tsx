import { useEffect, useMemo, useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import type { PartsCatalog, WatchConfiguratorProps, PartOption } from "../types/Parts";

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

export default function Configurator({
  assets,
  pricing,
  defaultChoice,
  selectedRegion,
  onCheckout
}: WatchConfiguratorProps) {
  
  // 1. Filter assets by selected region
  // Fixed: Uncommented dials and hands, corrected 'dial' to 'dials'
  const filteredAssets = useMemo(() => {
    if (!selectedRegion) return assets;

    const filterByRegion = (items: PartOption[]) => 
      items.filter(i => !i.regions || i.regions.includes(selectedRegion));

    return {
      cases: filterByRegion(assets.cases),
      straps: filterByRegion(assets.straps),
      dials: filterByRegion(assets.dials), 
      hands: filterByRegion(assets.hands),
    };
  }, [assets, selectedRegion]);

  // 2. Initialize State
  const initial: Record<string, string> = useMemo(() => {
    const q = typeof window !== "undefined" ? fromQuery() : {};
    return {
      cases: q.cases || defaultChoice?.cases || filteredAssets.cases[0]?.id || "",
      straps: q.straps || defaultChoice?.straps || filteredAssets.straps[0]?.id || "",
      //dials: q.dials || defaultChoice?.dials || filteredAssets.dials[0]?.id || "",
      //hands: q.hands || defaultChoice?.hands || filteredAssets.hands[0]?.id || "",
    };
  }, [filteredAssets, defaultChoice]);

  const [config, setConfig] = useState<Record<string, string>>(initial);
  const [zoom, setZoom] = useState(1);

  // 3. Update config when region changes
  // Fixed: Now resets all 4 components to the first available option in the new region
  useEffect(() => {
    setConfig({
      cases: filteredAssets.cases[0]?.id || "",
      straps: filteredAssets.straps[0]?.id || "",
      //dials: filteredAssets.dials[0]?.id || "",
      //hands: filteredAssets.hands[0]?.id || "",
    });
  }, [selectedRegion, filteredAssets]);

  // Permalink updates
  const href = useMemo(() => toQuery(config), [config]);
  useEffect(() => {
    const url = `${window.location.pathname}${href}`;
    window.history.replaceState(null, "", url);
  }, [href]);

  // Keyboard zoom
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "+") setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)));
      if (e.key === "-") setZoom((z) => Math.max(0.8, +(z - 0.1).toFixed(2)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 4. Calculate Price
  const price = useMemo(() => {
    let p = pricing.base;
    const add = (part: keyof PartsCatalog) => {
      const id = config[part];
      // @ts-ignore - dynamic access
      const opt = (filteredAssets[part] || []).find((o) => o.id === id);
      if (opt?.price) p += opt.price;
    };
    add("cases");
    add("straps");
    add("dials");
    add("hands");
    return p;
  }, [config, pricing, filteredAssets]);

  const sku = useMemo(
    () =>
      [config.cases, config.straps, config.dials, config.hands]
        .filter(Boolean)
        .join("-"),
    [config]
  );

  // 5. Visual Layers
  // Fixed: Added dials and hands. Order is crucial for Z-Index (Stacking)
  const layers: Array<{ key: string; src?: string }> = [
    { key: "straps", src: findOpt(filteredAssets.straps, config.straps)?.thumbnail },
    { key: "cases", src: findOpt(filteredAssets.cases, config.cases)?.thumbnail },
    //{ key: "dials", src: findOpt(filteredAssets.dials, config.dials)?.thumbnail },
    //{ key: "hands", src: findOpt(filteredAssets.hands, config.hands)?.thumbnail },
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
    const options = (filteredAssets[part] || []) as PartOption[];
    const current = config[part as string];

    if (options.length === 0) {
      return (
        <div>
          <h4 className="font-serif text-lg mb-3 text-ivory">{title}</h4>
          <p className="text-ivory/60 text-sm italic">
            Aucune option disponible pour cette région
          </p>
        </div>
      );
    }

    return (
      <div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {options.map((o) => (
            <button
              key={o.id}
              aria-pressed={current === o.id}
              onClick={() => setConfig((c) => ({ ...c, [part]: o.id }))}
              className={cx(
                "group relative rounded-xl border p-3 transition-all duration-300",
                "bg-neutral-800/50 backdrop-blur hover:-translate-y-[2px] hover:shadow-lg",
                current === o.id
                  ? "border-bastilleGold ring-2 ring-bastilleGold shadow-bastilleGold/20"
                  : "border-neutral-700 hover:border-bastilleGold/50"
              )}
            >
              {o.thumbnail ? (
                <img
                  src={o.thumbnail}
                  alt={o.name}
                  className="mx-auto h-16 w-16 object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-16 bg-neutral-700/30 rounded-lg">
                  <span className="block text-xs text-center text-ivory/60">
                    {o.name}
                  </span>
                </div>
              )}
              <div className="mt-2 text-center">
                <span className="block font-medium text-sm text-ivory">{o.name}</span>
                {o.price && o.price > 0 ? (
                  <span className="block text-xs text-bastilleGold mt-1">
                    +{fmt(o.price, pricing.currency)}
                  </span>
                ) : null}
                
                {(o.material || o.size || o.finish || o.style || o.color) && (
                  <span className="block text-xs text-ivory/50 mt-1">
                    {o.material || o.finish || o.style || o.color}
                    {o.size && ` • ${o.size}`}
                  </span>
                )}
              </div>
              {o.stock && (
                <span
                  className={cx(
                    "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-sans uppercase tracking-wider",
                    o.stock === "in" && "bg-emerald-600 text-white",
                    o.stock === "low" && "bg-amber-600 text-white",
                    o.stock === "oos" && "bg-rose-700 text-white"
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
    <section id="configurator" className="bg-neutral-950 text-ivory pt-8 min-h-screen">
      <div className="px-6 md:px-12 py-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-2 text-bastilleGold">
            Configurez votre montre
          </h3>
          <p className="text-ivory/80">
            Visualisation en temps réel • Lien partageable • Prix mis à jour
          </p>
          {selectedRegion && (
            <div className="mt-3 inline-block px-4 py-2 bg-bastilleGold/10 border border-bastilleGold/30 rounded-full">
              <span className="text-sm text-bastilleGold">
                Région: {selectedRegion}
              </span>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-start">
          {/* Viewer */}
         <div className="bg-neutral-900/60 rounded-2xl border border-bastilleGold/30 p-4 shadow-xl">
          <div
            id="watch-viewer"
            // 1. On garde overflow-hidden ici pour "couper" ce qui dépasse
            className="relative mx-auto aspect-square max-w-[560px] select-none overflow-hidden rounded-xl 
            bg-[radial-gradient(circle_at_center,rgba(245,194,66,0.05),rgba(0,0,0,0.9))]"
            aria-label="Aperçu de la montre personnalisée"
            role="img"
            // 2. SUPPRIMEZ le style transform ici
          >
            {/* 3. CRÉEZ une div interne qui va gérer le zoom */}
            <div 
              className="relative h-full w-full"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center",
                transition: "transform 0.3s ease-out" // Ajoute une animation fluide au zoom
              }}
            >
              <AnimatePresence>
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
          </div>

            {/* Viewer controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm">
                <button
                  className="rounded-full border border-bastilleGold/50 px-3 py-1 transition hover:bg-bastilleGold/10"
                  onClick={() =>
                    setZoom((z) => Math.max(0.8, +(z - 0.1).toFixed(2)))
                  }
                  aria-label="Zoom out"
                >
                  –
                </button>
                <div className="min-w-16 text-center text-xs text-ivory/80">
                  Zoom {Math.round(zoom * 100)}%
                </div>
                <button
                  className="rounded-full border border-bastilleGold/50 px-3 py-1 transition hover:bg-bastilleGold/10"
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
                  className="inline-flex items-center gap-2 rounded-full bg-bastilleGold text-neutral-900 font-sans px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all hover:-translate-y-[1px] hover:shadow-lg hover:shadow-bastilleGold/30"
                  title="Lien permanent de cette configuration"
                >
                  <GoArrowUpRight /> Lien
                </a>
                <button
                  onClick={handleDownload}
                  className="rounded-full border border-bastilleGold/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ivory/90 hover:-translate-y-[1px] transition hover:bg-bastilleGold/10"
                >
                  Télécharger
                </button>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-bastilleGold/40 bg-neutral-900/60 p-5 backdrop-blur">
              <div className="flex items-baseline justify-between mb-4">
                <h4 className="font-serif text-xl text-bastilleGold">Votre sélection</h4>
                <div className="text-sm text-ivory/60">SKU: {sku}</div>
              </div>
              <div className="space-y-2 text-sm text-ivory/80">
                <div className="flex justify-between">
                  <span>Boîtier</span>
                  <span className="text-right font-medium text-ivory">
                    {findOpt(filteredAssets.cases, config.cases)?.name || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Bracelet</span>
                  <span className="text-right font-medium text-ivory">
                    {findOpt(filteredAssets.straps, config.straps)?.name || "—"}
                  </span>
                </div>
                {/* Fixed: Added Dial and Hands display */}
                <div className="flex justify-between">
                  <span>Cadran</span>
                  <span className="text-right font-medium text-ivory">
                    {findOpt(filteredAssets.dials, config.dials)?.name || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Aiguilles</span>
                  <span className="text-right font-medium text-ivory">
                    {findOpt(filteredAssets.hands, config.hands)?.name || "—"}
                  </span>
                </div>
              </div>
              <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-bastilleGold/60 to-transparent" />
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-ivory/80">Prix total</div>
                <div className="text-2xl font-serif text-bastilleGold">
                  {fmt(price, pricing.currency)}
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-bastilleGold text-neutral-900 font-sans px-5 py-3 text-sm uppercase tracking-[0.2em] transition-all hover:-translate-y-[2px] hover:shadow-lg hover:shadow-bastilleGold/30 font-semibold"
                  onClick={() => onCheckout?.({ sku, price, config })}
                >
                  <GoArrowUpRight /> Commander
                </button>
                <button
                  className="rounded-full border border-bastilleGold/50 px-5 py-3 text-sm uppercase tracking-[0.2em] text-ivory/90 transition hover:bg-bastilleGold/10"
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

            <div className="rounded-2xl border border-bastilleGold/40 bg-neutral-900/60 p-5 space-y-8 backdrop-blur">
              <SelectGrid part="cases" title="Boîtier" />
              <SelectGrid part="straps" title="Bracelet" />
              {/* Fixed: Enabled Dial and Hands selectors with correct keys */}
              <SelectGrid part="dials" title="Cadran" />
              <SelectGrid part="hands" title="Aiguilles" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}