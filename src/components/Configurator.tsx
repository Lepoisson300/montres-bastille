import { useEffect, useMemo, useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import type { WatchConfiguratorProps, PartOption } from "../types/Parts";

// --- Utilities ---
const fmt = (v: number, ccy: string) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: ccy }).format(v);
const toQuery = (conf: Record<string, string>) => `?${new URLSearchParams(conf).toString()}`;
const fromQuery = (): Record<string, string> => Object.fromEntries(new URLSearchParams(window.location.search));

export default function Configurator({ assets, pricing, defaultChoice, selectedRegion, onCheckout }: WatchConfiguratorProps) {
  // 1. Filtered Assets based on Region
  const filtered = useMemo(() => {
    const filter = (items: PartOption[]) => items.filter(i => !i.regions || !selectedRegion || i.regions.includes(selectedRegion));
    return {
      cases: filter(assets.cases),
      straps: filter(assets.straps),
      dials: filter(assets.dials),
      hands: filter(assets.hands),
    };
  }, [assets, selectedRegion]);

  // 2. Configuration State
  const [config, setConfig] = useState<Record<string, string>>(() => ({
    cases: fromQuery().cases || defaultChoice?.cases || filtered.cases[0]?.id || "",
    straps: fromQuery().straps || defaultChoice?.straps || filtered.straps[0]?.id || "",
    dials: fromQuery().dials || defaultChoice?.dials || filtered.dials[0]?.id || "",
    hands: fromQuery().hands || defaultChoice?.hands || filtered.hands[0]?.id || "",
  }));

  const [zoom, setZoom] = useState(1);

  // 3. Derived Data
  const selections = useMemo(() => ({
    cases: filtered.cases.find(o => o.id === config.cases),
    straps: filtered.straps.find(o => o.id === config.straps),
    dials: filtered.dials.find(o => o.id === config.dials),
    hands: filtered.hands.find(o => o.id === config.hands),
  }), [config, filtered]);

  const totalPrice = useMemo(() => 
    pricing.base + Object.values(selections).reduce((acc, curr) => acc + (curr?.price || 0), 0)
  , [selections, pricing.base]);

  const sku = Object.values(config).filter(Boolean).join("-");

  // 4. Side Effects (URL Sync & Zoom Keys)
  useEffect(() => {
    window.history.replaceState(null, "", `${window.location.pathname}${toQuery(config)}`);
  }, [config]);

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === "+") setZoom(z => Math.min(2, z + 0.1));
      if (e.key === "-") setZoom(z => Math.max(0.8, z - 0.1));
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, []);

const handleDownload = async () => {
  const el = document.querySelector("#watch-viewer") as HTMLElement;
  if (!el) return;

  const canvas = await html2canvas(el, { 
    backgroundColor: null, 
    scale: 2,
    useCORS: true, // Important si vos images (thumbnails) sont sur un autre domaine
    onclone: (clonedDocument) => {
      // Nous parcourons TOUS les éléments du clone pour neutraliser oklab
      const allElements = clonedDocument.querySelectorAll('*');
      allElements.forEach((node) => {
        const htmlNode = node as HTMLElement;
        const style = window.getComputedStyle(htmlNode);

        // Liste des propriétés courantes pouvant contenir des couleurs
        const colorProps = ['backgroundColor', 'color', 'borderColor', 'outlineColor'];

        colorProps.forEach(prop => {
          // @ts-ignore - style[prop] est dynamique
          if (style[prop] && style[prop].includes('oklab')) {
            // On remplace par une valeur sûre (transparent ou couleur hexadécimale)
            if (prop === 'color') htmlNode.style.color = '#000000';
            else htmlNode.style[prop as any] = 'transparent';
          }
        });

        // Nettoyage spécifique pour les ombres portées qui utilisent souvent oklab par défaut (Tailwind 4)
        if (style.boxShadow.includes('oklab')) {
          htmlNode.style.boxShadow = 'none';
        }
      });
    }
  });

  const link = document.createElement("a");
  link.download = `Bastille_${sku}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
};
  return (
    <section className="bg-dark text-ivory pt-8 min-h-screen font-sans">
      <div className="px-6 md:px-12 py-16 max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-10">
          <h3 className="font-serif text-3xl md:text-4xl text-primary mb-2">Configurez votre montre</h3>
          <p className="text-text-muted text-sm uppercase tracking-widest">Visualisation 3D • Prix Réel</p>
        </header>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          
          {/* LEFT: Viewer Component */}
          <div className="sticky top-8 space-y-6 z-10 bg-dark pb-3 pt-2">
            <div id="watch-viewer" className="relative bg-background aspect-square rounded-2xl border border-white/5 overflow-hidden">
               <div className="relative h-full w-full transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>
                  <AnimatePresence mode="popLayout">
                    {[ selections.cases, selections.dials,selections.straps, selections.hands].map((part, i) => (
                      part?.thumbnail && (
                        <motion.img 
                          key={`${part.id}-${i}`}
                          src={part.thumbnail} 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute scale-130 inset-0 w-full h-full object-contain pointer-events-none"
                        />
                      )
                    ))}
                  </AnimatePresence>
               </div>
            </div>
            
            <div className="flex justify-between items-center">
                <div className="flex bg-surface rounded-full mx-2 p-1 flex-row border border-white/10">
                  <ZoomBtn label="-" onClick={() => setZoom(Math.max(0.6, zoom - 0.1))} />
                  <span className="px-4 py-1 text-center text-xs">Zoom {Math.round(zoom * 100)}%</span>
                  <ZoomBtn label="+" onClick={() => setZoom(Math.min(6, zoom + 0.2))} />
                </div>
                <button onClick={handleDownload} className="text-xs uppercase tracking-widest bg-accent text-white border border-primary/30 px-6 py-2 rounded-full hover:bg-primary/10 transition">
                  Capture d'écran
                </button>
            </div>
          </div>

          {/* RIGHT: Selection Controls */}
          <div className="space-y-8">
            <SummaryCard sku={sku} selections={selections} price={totalPrice} currency={pricing.currency} onCheckout={() => onCheckout?.({sku, price: totalPrice, config})} />
            
            <div className="space-y-10 bg-surface/30 p-6 rounded-2xl border border-white/5">
              <PartGrid title="Boîtier" part="cases" options={filtered.cases} current={config.cases} onSelect={(id) => setConfig(prev => ({...prev, cases: id}))} currency={pricing.currency} />
              <PartGrid title="Bracelet" part="straps" options={filtered.straps} current={config.straps} onSelect={(id) => setConfig(prev => ({...prev, straps: id}))} currency={pricing.currency} />
              <PartGrid title="Cadran" part="dials" options={filtered.dials} current={config.dials} onSelect={(id) => setConfig(prev => ({...prev, dials: id}))} currency={pricing.currency} />
              <PartGrid title="Aiguilles" part="hands" options={filtered.hands} current={config.hands} onSelect={(id) => setConfig(prev => ({...prev, hands: id}))} currency={pricing.currency} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// --- Sub-Components (Keep in same file or move to separate files) ---

function ZoomBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick} className="w-8 h-8 rounded-full hover:bg-white/10 transition flex items-center justify-center">{label}</button>;
}

function SummaryCard({ sku, selections, price, currency, onCheckout }: any) {
  return (
    <div className="bg-surface p-6 rounded-2xl border border-primary/20 shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-primary font-serif text-xl">Votre Composition</h4>
          <p className="text-[10px] text-text-subtle uppercase tracking-widest mt-1">Ref: {sku}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-serif text-primary">{fmt(price, currency)}</p>
        </div>
      </div>
      <button onClick={onCheckout} className="w-full bg-primary text-dark font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition shadow-lg shadow-primary/20">
        <GoArrowUpRight className="text-xl" /> COMMANDER LA MONTRE
      </button>
    </div>
  );
}

function PartGrid({ title, options, current, onSelect, currency }: any) {
  return (
    <div>
      <h5 className="font-serif text-lg mb-4 text-ivory/90">{title}</h5>
      <div className="grid grid-cols-4 gap-3">
        {options.map((opt: PartOption) => (
          <button 
            key={opt.id} 
            onClick={() => onSelect(opt.id)}
            className={`group relative p-2 rounded-xl border transition-all ${current === opt.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
          >
            <div className="aspect-square mb-2 overflow-hidden rounded-lg">
              <img src={opt.thumbnail} alt={opt.name} className="w-full h-full scale-500 object-contain group-hover:scale-600 transition-transform" />
            </div>
            <p className="text-[10px] text-center uppercase tracking-tighter truncate">{opt.name}</p>
            {opt.price ? <p className="text-[9px] text-center text-primary mt-1">{fmt(opt.price, currency)}</p> : null}
          </button>
        ))}
      </div>
    </div>
  );
}