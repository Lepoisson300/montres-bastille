import { useEffect, useMemo, useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import type { PartOption } from "../types/Parts";
import type { WatchConfiguratorProps } from "../types/Configurator";
import LuxuryDescription from './ComponentsDesc';
import MobileLuxuryModal from './DescriptionModal';

// Converts PartOption[] → ?mouvement=mov-001&cases=case-42&...
const toQuery = (conf: PartOption[]) => {
  const params = conf.reduce<Record<string, string>>((acc, part) => {
    if (part.type && part.id) acc[part.type] = part.id;
    return acc;
  }, {});
  return `?${new URLSearchParams(params).toString()}`;
};

// Unchanged — still returns Record<string, string> of id strings
const fromQuery = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  return Object.fromEntries(new URLSearchParams(window.location.search));
};

export default function Configurator({ assets, defaultChoice, selectedRegion, onCheckout }: WatchConfiguratorProps) {

  const [isMobile, setIsMobile] = useState(false);
  const filtered = useMemo(() => {
    const filter = (items: PartOption[]) => items.filter(i => !i.regions || !selectedRegion || Object.values(i.regions).includes(selectedRegion));
    return {
      mouvement: filter(assets.mouvement),
      cases: filter(assets.cases),
      straps: filter(assets.straps),
      dials: filter(assets.dials),
      hands: filter(assets.hands),
    };
  }, [assets, selectedRegion]);

  // 2. Configuration State
  const [config, setConfig] = useState<PartOption[]>(() => {
    const query = fromQuery();

    const resolvedParts = [
      assets.mouvement?.find(p => p.id === (query.mouvement || defaultChoice?.mouvement)) ?? assets.mouvement?.[0],
      assets.cases?.find(p => p.id === (query.cases         || defaultChoice?.cases))     ?? assets.cases?.[0],
      assets.straps?.find(p => p.id === (query.straps       || defaultChoice?.straps))    ?? assets.straps?.[0],
      assets.dials?.find(p => p.id === (query.dials         || defaultChoice?.dials))     ?? assets.dials?.[0],
      assets.hands?.find(p => p.id === (query.hands         || defaultChoice?.hands))     ?? assets.hands?.[0],
    ];

    return resolvedParts.filter((p): p is PartOption => p !== undefined);
  });

  const [zoom, setZoom] = useState(3);
  const [focusedPart, setFocusedPart] = useState<PartOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 3. Derived Data
  const selections = useMemo(() => ({
    mouvement: filtered.mouvement.find(o => o.id === config[0].id),
    cases: filtered.cases.find(o => o.id === config[1].id),
    straps: filtered.straps.find(o => o.id === config[2].id),
    dials: filtered.dials.find(o => o.id === config[3].id),
    hands: filtered.hands.find(o => o.id === config[4].id),
  }), [config, filtered]);

  const totalPrice = useMemo(() =>
    Object.values(selections).reduce((acc, curr) => acc + (curr?.price || 0), 0)
  , [selections]);

  const sku = Object.values(config).filter(Boolean).join("-");

  // Piece currently highlighted on the right-hand description panel:
  // whatever was last clicked, falling back to the case so the panel is never empty.
  const activePart = focusedPart ?? selections.cases ?? selections.mouvement ?? null;

  // 4. Side Effects
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `${window.location.pathname}${toQuery(config)}`);
    }
  }, [config]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === "+") setZoom(z => Math.min(5, z + 0.5));
      if (e.key === "-") setZoom(z => Math.max(0.8, z - 0.5));
    };
    window.addEventListener("keydown", handleKeys);

    return () => {
      window.removeEventListener("keydown", handleKeys);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleDownload = async () => {
    const el = document.querySelector("#watch-viewer") as HTMLElement;
    if (!el) return;

    const canvas = await html2canvas(el, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      onclone: (clonedDocument) => {
        const allElements = clonedDocument.querySelectorAll('*');
        allElements.forEach((node) => {
          const htmlNode = node as HTMLElement;
          const style = window.getComputedStyle(htmlNode);
          const colorProps = ['backgroundColor', 'color', 'borderColor', 'outlineColor'];
          colorProps.forEach(prop => {
            // @ts-ignore
            if (style[prop] && style[prop].includes('oklab')) {
              if (prop === 'color') htmlNode.style.color = '#000000';
              else htmlNode.style[prop as any] = 'transparent';
            }
          });
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

  const handleSelectPart = (index: number, id: string, options: PartOption[]) => {
    const selectedPart = options.find(opt => opt.id === id);
    if (selectedPart) {
      setConfig(prevConfig => {
        const newConfig = [...prevConfig];
        newConfig[index] = selectedPart;
        return newConfig;
      });
      setFocusedPart(selectedPart);

      if (isMobile) {
        setIsModalOpen(true);
      }
    }
  };

  // Watch stage — the big centered visual, with layered part images and
  // a slim control bar (zoom + capture) docked to its bottom edge.
  const renderViewer = () => (
    <div
      id="watch-viewer"
      className="relative mx-auto aspect-square w-full max-w-70 sm:max-w-105 md:max-w-155 rounded-[2rem] md:rounded-[3rem] border border-white/10 bg-surface/15 overflow-hidden shadow-2xl shadow-black/50"
    >
      <div className="relative h-full w-full transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>
        <img
          src="/fondConfigurateur.webp"
          alt="Fond du configurateur"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90"
        />
        <AnimatePresence mode="popLayout">
          {(() => {
            const isC3 = selections.cases?.id === "c3";
            const renderLayers = isC3
              ? [selections.dials, selections.straps, selections.cases, selections.hands]
              : [selections.dials, selections.cases, selections.straps, selections.hands];

            return renderLayers.map((part) => (
              part?.thumbnail && (
                <motion.img
                  key={part.id}
                  src={part.thumbnail}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute scale-130 inset-0 top-7 md:top-12 w-full h-full object-contain pointer-events-none"
                />
              )
            ));
          })()}
        </AnimatePresence>
      </div>

      {/* Barre de contrôle discrète, ancrée en bas du cadre */}
      <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-3 md:px-6 py-2.5 md:py-4 bg-gradient-to-t from-dark/90 to-transparent">
        <div className="flex items-center bg-surface/70 backdrop-blur-sm rounded-full border border-white/10 p-1">
          <ZoomBtn label="−" onClick={() => setZoom(z => Math.max(0.8, z - 0.5))} />
          <span className="px-2 md:px-3 text-[9px] md:text-[10px] uppercase tracking-widest text-ivory/80">
            Zoom {Math.round((zoom / 3) * 100)}%
          </span>
          <ZoomBtn label="+" onClick={() => setZoom(z => Math.min(5, z + 0.5))} />
        </div>
        <button
          onClick={handleDownload}
          className="text-[9px] md:text-[10px] uppercase tracking-widest bg-accent/90 text-white border border-primary/30 px-3 md:px-5 py-1.5 md:py-2.5 rounded-full hover:bg-primary/10 transition backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Capture
        </button>
      </div>
    </div>
  );

  return (
    <>
      <section className="relative bg-dark text-ivory min-h-screen pt-15 font-sans overflow-hidden">
        {/* Halo ambiant, écho de l'éclairage studio de la référence */}
        <div className="pointer-events-none absolute -top-40 -left-40 w-140 h-140 rounded-full bg-primary/10 blur-[160px]" />
        <div className="pointer-events-none absolute top-1/3 -right-40 w-105 h-105 rounded-full bg-accent/10 blur-[140px]" />

        {/* En-tête */}
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-4 md:pb-6 flex items-start justify-between">
          <div>
            <p className="text-text-muted text-[10px] md:text-xs uppercase tracking-widest mb-1 md:mb-2">Visualisation 3D • Prix Réel</p>
            <h3 className="font-serif text-2xl md:text-4xl text-primary">Configurez votre montre</h3>
          </div>
          
        </div>

        {/* SCÈNE PRINCIPALE — montre en grand, prix/CTA à gauche, description à droite */}
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-8 md:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            {renderViewer()}

            {/* Overlay gauche — prix + commander */}
            <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 z-20">
              <BuyCard sku={sku} price={totalPrice} onCheckout={() => onCheckout?.({ price: totalPrice, config })} />
            </div>

            {/* Overlay droit — description de la pièce active */}
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 z-20 w-65">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePart?.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <LuxuryDescription
                    title={activePart?.name || "Nom de la pièce"}
                    description={activePart?.description || "Sélectionnez une pièce pour voir ses détails."}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Version mobile/tablette : prix + CTA empilés sous la montre */}
          <div className="lg:hidden mt-5">
            <BuyCard sku={sku} price={totalPrice} onCheckout={() => onCheckout?.({ price: totalPrice, config })} />
          </div>
        </div>

        {/* ZONE BASSE — sélection des composants, par variantes */}
        <div className="relative border-t border-white/10 bg-surface/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-14 space-y-7 md:space-y-10">
            <PartRow title="Mouvement" options={filtered.mouvement} current={config[0]} onSelect={(id: string) => handleSelectPart(0, id, filtered.mouvement)} />
            <PartRow title="Boîtier" options={filtered.cases} current={config[1]} onSelect={(id: string) => handleSelectPart(1, id, filtered.cases)} />
            <PartRow title="Cadran" options={filtered.dials} current={config[3]} onSelect={(id: string) => handleSelectPart(3, id, filtered.dials)} />
            <PartRow title="Aiguilles" options={filtered.hands} current={config[4]} onSelect={(id: string) => handleSelectPart(4, id, filtered.hands)} />
            <PartRow title="Bracelet" options={filtered.straps} current={config[2]} onSelect={(id: string) => handleSelectPart(2, id, filtered.straps)} />
          </div>
        </div>
      </section>

      <MobileLuxuryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activePart?.name || "Nom de la pièce"}
        description={activePart?.description || "Sélectionnez une pièce pour voir ses détails."}
      />
    </>
  );
}

function ZoomBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-6 h-6 md:w-8 md:h-8 rounded-full hover:bg-white/10 transition flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {label}
    </button>
  );
}

// Carte flottante prix + CTA, façon verre dépoli — ancrée sur le bord de la montre en desktop,
// empilée sous la montre en mobile.
function BuyCard({ sku, price, onCheckout }: any) {
  return (
    <div className="bg-surface/30 backdrop-blur-md w-full lg:w-65 p-5 md:p-6 rounded-2xl border border-primary/20 shadow-2xl shadow-black/40">
      <p className="text-text-muted text-[9px] md:text-[10px] uppercase tracking-widest mb-2">{sku}</p>
      <p className="text-2xl md:text-3xl font-serif text-primary mb-4 md:mb-6">{price}€</p>
      <button
        onClick={onCheckout}
        className="w-full text-xs md:text-sm bg-primary text-dark font-bold py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition shadow-lg shadow-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <GoArrowUpRight className="text-base md:text-lg" /> Commander la montre
      </button>
    </div>
  );
}

// Bande horizontale de vignettes rondes par catégorie — c'est la "zone design"
// qui permet de visualiser et choisir chaque composant.
function PartRow({ title, options, current, onSelect }: any) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4 md:mb-5">
        <h5 className="font-serif text-sm md:text-base text-ivory/90 uppercase tracking-widest">{title}</h5>
        <span className="flex-1 h-px bg-white/10" />
        <span className="text-[9px] md:text-[10px] text-text-muted uppercase tracking-widest">{options.length} options</span>
      </div>
      <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {options.map((opt: PartOption) => {
          const isActive = current?.id === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`group relative flex-shrink-0 snap-start w-20 md:w-24 rounded-2xl border p-2 md:p-3 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
            >
              <div className="aspect-square rounded-full overflow-hidden bg-background/60 mb-2">
                <img
                  src={opt.thumbnail}
                  alt={opt.name}
                  className={`w-full h-full object-contain transition-transform ${opt.type === "strap" ? "scale-150 group-hover:scale-175" : "scale-220 group-hover:scale-250"}`}
                />
              </div>
              <p className="text-[8px] md:text-[9px] text-center uppercase tracking-tighter truncate text-ivory/80">{opt.name}</p>
              {opt.price ? <p className="text-[9px] md:text-[10px] text-center text-primary mt-0.5">{opt.price}€</p> : null}
              {isActive && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}