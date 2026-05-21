import { useMemo, useState } from "react";
import { REGION_NAMES } from "../Logic/watchComponents";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion"; // <-- Ajout de l'import

interface MobileCarouselProps {
  availableRegions: string[];
  getComponentCount: (code: string) => number;
  extractRegionSVG: (code: string) => string | null;
  onSelect: (id: string) => void;
}

export const MobileCarousel = ({ availableRegions, getComponentCount, extractRegionSVG, onSelect }: MobileCarouselProps) => {

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedId] = useState<string | null>(null);

  const selectedName = useMemo(() => {
    if (!selectedId) return null;
    return REGION_NAMES[selectedId] || selectedId;
  }, [selectedId]);

  console.log("Available Regions in Carousel:", availableRegions[0]);

  const goToPrev = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCarouselIndex((prev) => Math.min(availableRegions.length - 1, prev + 1));
  };

  // --- Logique du Swipe ---
  const handleDragEnd = (event: any, info: any) => {
    // Si on a swipé vers la gauche avec assez de force ou de distance
    if (info.offset.x < -50 || info.velocity.x < -500) {
      goToNext();
    } 
    // Si on a swipé vers la droite avec assez de force ou de distance
    else if (info.offset.x > 50 || info.velocity.x > 500) {
      goToPrev();
    }
  };

  if (!availableRegions || availableRegions.length === 0) return null;

  return (
    <div className="w-full max-w-md px-4">
      <div className="relative mb-6"> {/* Ajout d'une marge basse (mb-6) pour espacer des dots */}
        
        {/* Carousel container */}
        <div className="overflow-hidden">
          <motion.div
            className="flex cursor-grab active:cursor-grabbing"
            // Animation fluide de Framer Motion plutôt que le style en ligne
            animate={{ x: `-${carouselIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            
            // --- Configuration du drag horizontal ---
            drag="x"
            // Empêche de glisser trop loin si on est au bout du carrousel
            dragConstraints={{ left: 0, right: 0 }} 
            dragElastic={0.2} // Petit effet de résistance
            onDragEnd={handleDragEnd}
          >
            {availableRegions.map((code) => {
              const regionSVG = extractRegionSVG(code);
              const componentCount = getComponentCount(code);

              return (
                <div key={code} className="w-full flex-shrink-0 px-2 pointer-events-none">
                   {/* pointer-events-none permet de ne pas bloquer le drag */}
                  <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl border border-[#D4AF37]/30 p-6 shadow-xl pointer-events-auto">
                    {/* pointer-events-auto remet les clics à l'intérieur de la carte */}
                    
                    {/* Region name */}
                    <h3 className="text-2xl font-serif text-[#D4AF37] text-center mb-4">
                      {REGION_NAMES[code]}
                    </h3>

                    {/* SVG Preview */}
                    {regionSVG && (
                      <div className="rounded-xl p-4 mb-4 flex items-center justify-center min-h-[200px] bg-neutral-800/30">
                        <div
                          dangerouslySetInnerHTML={{ __html: regionSVG }}
                          className="w-full max-w-[180px] [&>svg]:w-full [&>svg]:h-auto"
                        />
                      </div>
                    )}

                    {/* Component info */}
                    <div className="bg-neutral-800/50 rounded-lg p-4 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#D4AF37] mb-1">
                          {componentCount}
                        </div>
                        <div className="text-sm text-neutral-400">
                          composants disponibles
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => onSelect(availableRegions[carouselIndex])}
                      className="w-full py-4 bg-[#D4AF37] text-black font-bold rounded-xl active:scale-95 transition-transform shadow-lg"
                    >
                      Configurer
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Navigation arrows (Only if more than 1 region) */}
        {availableRegions.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              disabled={carouselIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-neutral-900/80 backdrop-blur-sm border border-[#D4AF37]/30 rounded-full p-3 hover:bg-neutral-800 transition-all shadow-lg z-10 disabled:opacity-30 pointer-events-auto"
              aria-label="Région précédente"
            >
              <ChevronLeft className="w-6 h-6 text-[#D4AF37]" />
            </button>

            <button
              onClick={goToNext}
              disabled={carouselIndex === availableRegions.length - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-neutral-900/80 backdrop-blur-sm border border-[#D4AF37]/30 rounded-full p-3 hover:bg-neutral-800 transition-all shadow-lg z-10 disabled:opacity-30 pointer-events-auto"
              aria-label="Région suivante"
            >
              <ChevronRight className="w-6 h-6 text-[#D4AF37]" />
            </button>
          </>
        )}
      </div>

      {/* Dots indicator & Counter */}
      <div className="space-y-4">
        <div className="flex justify-center gap-2">
          {availableRegions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCarouselIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === carouselIndex ? "bg-[#D4AF37] w-8" : "bg-neutral-600 w-2"
              }`}
              aria-label={`Aller à la région ${i + 1}`}
            />
          ))}
        </div>

        <div className="text-center text-sm text-neutral-400 font-medium">
          {carouselIndex + 1} / {availableRegions.length}
        </div>
      </div>
    </div>
  );
};