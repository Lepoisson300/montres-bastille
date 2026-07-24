import { useEffect, useMemo, useState, useRef } from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import type { PartOption } from "../types/Parts";
import type { WatchConfiguratorProps } from "../types/Configurator";
import LuxuryDescription from './ComponentsDesc';
import MobileLuxuryModal from './DescriptionModal';
import { MeshGradient } from "@paper-design/shaders-react";
import BuyCard from "./buyCard";
import PartRow from "./PartRow";
import RenderViewer from "./RenderConfig";

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
  
  // Ref pour le slider de la zone basse
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Fonction de défilement pour les boutons PC
  const slide = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 600 : 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };



  return (
    <>
      <section className="flex flex-col bg-dark text-ivory min-h-screen font-sans overflow-hidden">
        
        {/* --- ZONE HAUTE (Contient le gradient, l'en-tête et la montre) --- */}
        <div className="relative w-full pt-15 flex-grow">
          
          {/* Halos ambiants (maintenant piégés dans la zone haute) */}
          <div className="pointer-events-none absolute top-0 -left-40 w-140 h-140 rounded-full bg-primary/10 blur-[160px] z-0" />
          <div className="pointer-events-none absolute top-1/3 -right-40 w-105 h-105 rounded-full bg-accent/10 blur-[140px] z-0" />
          
          {/* Mesh Gradient + Grain (limités à la zone haute via inset-0) */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute inset-0 opacity-90">
              <MeshGradient
                width={typeof window !== 'undefined' ? window.innerWidth : 1920}
                height={930}
                colors={["#0a0a0c", "#362b1e", "#c5a059", "#1c1a17", "#8b6528"]}
                distortion={0.35}
                speed={0.40}
              />
            </div>

          </div>

          {/* En-tête */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-4 md:pb-6 flex items-start justify-between">
            <div>
              <p className="text-text-muted text-[10px] md:text-xs uppercase tracking-widest mb-1 md:mb-2">Visualisation 3D • Prix Réel</p>
              <h3 className="font-serif text-2xl md:text-4xl text-primary">Configurez votre montre</h3>
            </div>
          </div>

          {/* SCÈNE PRINCIPALE */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-8 md:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative flex items-center justify-center"
            >
              <RenderViewer selections={selections} zoom={zoom} setZoom={setZoom}/>

              {/* Overlay gauche — prix + commander */}
              <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 z-20">
                <BuyCard sku={sku} price={totalPrice} onCheckout={() => onCheckout?.({ price: totalPrice, config })} />
              </div>

              {/* Overlay droit — description */}
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

            {/* Version mobile/tablette : prix + CTA empilés */}
            <div className="lg:hidden mt-5">
              <BuyCard sku={sku} price={totalPrice} onCheckout={() => onCheckout?.({ price: totalPrice, config })} />
            </div>
          </div>
        </div>

        {/* --- ZONE BASSE (Slider horizontal) --- */}
        {/* Le Mesh ne descend plus ici. Le fond sera le 'bg-dark' de la section + un 'bg-surface/10' par dessus */}
        <div className="relative pl-15 z-20 border-t border-white/10 bg-surface/10 backdrop-blur-sm group">
          
          {/* Navigation PC : Flèche Gauche */}
          <button 
            onClick={() => slide("left")}
            className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-dark/90 text-white border border-white/10 hover:bg-white/10 hover:scale-105 transition-all opacity-0 group-hover:opacity-100 shadow-xl focus:outline-none"
            aria-label="Défiler à gauche"
          >
            <GoChevronLeft className="text-2xl" />
          </button>

          {/* Navigation PC : Flèche Droite */}
          <button 
            onClick={() => slide("right")}
            className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-dark/90 text-white border border-white/10 hover:bg-white/10 hover:scale-105 transition-all opacity-0 group-hover:opacity-100 shadow-xl focus:outline-none"
            aria-label="Défiler à droite"
          >
            <GoChevronRight className="text-2xl" />
          </button>

          {/* Conteneur principal du slider */}
          <div 
            ref={scrollContainerRef}
            className="flex flex-row items-start overflow-x-auto snap-x snap-mandatory px-6 md:px-24 py-8 md:py-12 gap-x-12 md:gap-x-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
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
