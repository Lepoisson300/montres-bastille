import { useEffect, useMemo, useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import type { WatchConfiguratorProps, PartOption } from "../types/Parts";
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
    console.log("assets : ", assets);
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
  const [showPreview, setShowPreview] = useState(true);
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

  // 4. Side Effects
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `${window.location.pathname}${toQuery(config)}`);
    }
  }, [config]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    
    // Check initially
    checkMobile();
    
    // Add resize listener to update state dynamically
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

      if(isMobile){
        setIsModalOpen(true)
      }
    }
  };

  // Helper to render the Viewer content to avoid code duplication
  const renderViewer = () => (
    <div className="bg-surface/20 rounded-2xl md:rounded-3xl border border-white/10 p-2 md:p-6">
      
      {/* BOUTON POUR DÉROULER / ENROULER */}
      <button 
        onClick={() => setShowPreview(!showPreview)}
        className="w-full flex justify-between items-center text-ivory/90 hover:text-primary transition-colors py-1 md:py-2 px-2"
      >
        <span className="font-serif text-base md:text-lg">Aperçu en direct</span>
        <motion.div animate={{ rotate: showPreview ? 180 : 0 }}>
          ▼
        </motion.div>
      </button>

      {/* LA ZONE QUI S'ANIME */}
      <AnimatePresence initial={false}>
        {showPreview && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-2 md:pt-4">
              
              {/* Réduction de la taille sur mobile via w-[65%] et max-w-[250px] */}
              <div className="bg-background aspect-square w-[65%] max-w-87.5 md:w-full md:max-w-none mx-auto rounded-xl md:rounded-2xl border border-white/5 overflow-hidden">
                
                <div className="relative h-full w-full transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>
                  <img 
                  src="/fondConfigurateur.png" 
                  alt="Fond du configurateur"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90"
                />
                 <AnimatePresence mode="popLayout">
                  {(() => {
                    const isC3 = selections.cases?.id === "c3";
                    const renderLayers = isC3
                      ? [selections.dials, selections.straps, selections.cases, selections.hands]
                      : [selections.dials, selections.cases, selections.straps, selections.hands];

                    return renderLayers.map((part, i) => (
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
              </div>
              
              {/* BOUTONS SOUS LA MONTRE */}
              <div className="flex justify-between items-center mt-3 md:mt-4">
                <div className="flex bg-surface rounded-full mx-1 md:mx-2 p-1 flex-row border border-white/10 scale-90 md:scale-100 origin-left">
                  <ZoomBtn label="-" onClick={() => setZoom(Math.max(1, zoom - 0.5))} />
                  <span className="px-2 md:px-4 py-2 text-center text-xs">Zoom {Math.round((zoom/3) * 100)}%</span>
                  <ZoomBtn label="+" onClick={() => setZoom(Math.min(5, zoom + 0.5))} />
                </div>
                <button onClick={handleDownload} className="text-[10px] md:text-xs uppercase tracking-widest bg-accent text-white border border-primary/30 px-3 md:px-6 py-2 rounded-full hover:bg-primary/10 transition">
                  Capture
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
    {/* Réduction des marges globales sur mobile (pt-4, py-6, px-4) */}
    <section className="bg-dark text-ivory pt-4 md:pt-8 min-h-screen font-sans">
      <div className="py-6 md:py-16 max-w-7xl mx-auto">
        <div className="mb-2 md:mb-0">
            <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-primary mb-1 md:mb-2">Configurez votre montre</h3>
            <p className="text-text-muted text-[10px] md:text-sm uppercase tracking-widest">Visualisation 3D • Prix Réel</p>
          </div>
        <div className="grid gap-2 md:gap-6 lg:grid-cols-[1.2fr_1fr] items-start">
          
          
        
          {isMobile ? (
             <div className="sticky top-4 space-y-4 md:space-y-6 z-10 bg-dark pb-2 pt-1">
               {renderViewer()}
             </div>
          ) : (
            <div className="top-8 space-y-6 z-10 pb-3 pt-2">
               {renderViewer()}
              <LuxuryDescription 
                title={focusedPart?.name || "nom de la pièce"}  
                description={focusedPart?.description || "Description de la pièce"} 
              />
            </div>
          )}

          {/* RIGHT: Selection Controls */}
          <div className="space-y-4 md:space-y-8">
            <SummaryCard sku={sku} selections={selections} price={totalPrice} onCheckout={() => onCheckout?.({price: totalPrice, config})} />
            
            {/* Réduction du padding du conteneur des grilles sur mobile */}
            <div className="space-y-6 md:space-y-10 bg-surface/30 p-4 md:p-6 rounded-2xl border border-white/5">
              <PartGrid title="Mouvement" part="mouvement" options={filtered.mouvement} current={config[0]} 
              onSelect={(id: string) => handleSelectPart(0, id, filtered.mouvement)}/>
              <PartGrid title="Boîtier" part="cases" options={filtered.cases} current={config[1]} 
              onSelect={(id: string) => handleSelectPart(1, id, filtered.cases)} />
              <PartGrid title="Cadran" part="dials" options={filtered.dials} current={config[3]} 
              onSelect={(id: string) => handleSelectPart(3, id, filtered.dials)} />
              <PartGrid title="Aiguilles" part="hands" options={filtered.hands} current={config[4]} 
              onSelect={(id: string) => handleSelectPart(4, id, filtered.hands)} />
               <PartGrid title="Bracelet" part="straps" options={filtered.straps} current={config[2]} 
              onSelect={(id: string) => handleSelectPart(2, id, filtered.straps)}/>
            </div>
          </div>

        </div>
      </div>
    </section>
    
    <MobileLuxuryModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      title={focusedPart?.name || "Nom de la pièce"}
      description={focusedPart?.description || "Sélectionnez une pièce pour voir ses détails."}
    />
    </>
  );
}

// ... Keep your Sub-Components (ZoomBtn, SummaryCard, PartGrid) as they were ...
function ZoomBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick} className="w-6 h-6 md:w-8 md:h-8 rounded-full hover:bg-white/10 transition flex items-center justify-center">{label}</button>;
}

function SummaryCard({ sku, price, onCheckout }: any) {
  return (
    <div className="bg-surface p-4 md:p-6 rounded-2xl border border-primary/20 shadow-2xl">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div>
          <h4 className="text-primary font-serif text-lg md:text-xl">Votre Composition</h4>
        </div>
        <div className="text-right">
          <p className="text-xl md:text-2xl font-serif text-primary">{price}€</p>
        </div>
      </div>
      <button onClick={onCheckout} className="w-full text-sm md:text-base bg-primary text-dark font-bold py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition shadow-lg shadow-primary/20">
        <GoArrowUpRight className="text-lg md:text-xl" /> COMMANDER LA MONTRE
      </button>
    </div>
  );
}

function PartGrid({ title, options, current, onSelect }: any) {
  return (
    <div>
      <h5 className="font-serif text-base md:text-lg mb-3 md:mb-4 text-ivory/90">{title}</h5>
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {options.map((opt: PartOption) => (
          <button 
            key={opt.id} 
            onClick={() => onSelect(opt.id)}
            className={`group relative p-1.5 md:p-2 rounded-xl border transition-all ${current === opt.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
          >
            <div className="aspect-square mb-1 md:mb-2 overflow-hidden rounded-lg">
  {opt.type==="strap"?
              <img src={opt.thumbnail} alt={opt.name} className="w-full h-45 scale-200 object-contain group-hover:scale-250 transition-transform" />
              : <img src={opt.thumbnail} alt={opt.name} className="w-full h-45 scale-400 object-contain group-hover:scale-500 transition-transform" />}
              

              
            </div>
            <p className="text-[9px] md:text-[10px] text-center uppercase tracking-tighter truncate">{opt.name}</p>
            {opt.price ? <p className="text-[10px] md:text-[12px] text-center text-primary mt-0.5 md:mt-1">{opt.price}€</p> : null}
          </button>
        ))}
      </div>
    </div>
  );
}