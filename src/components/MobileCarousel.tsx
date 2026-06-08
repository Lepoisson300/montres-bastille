import { useMemo, useState } from "react";
// Make sure this points to your new regionData file
import { REGION_DATA } from "../Logic/watchComponents"; 
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion"; 

interface MobileCarouselProps {
  availableRegions: string[];
  getComponentCount: (code: string) => number;
  // NOTE: You can remove extractRegionSVG from your parent component completely!
  onSelect: (id: string) => void;
}

export const MobileCarousel = ({ availableRegions, getComponentCount, onSelect }: MobileCarouselProps) => {

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedId] = useState<string | null>(null);

  // 1. FIXED: Lookup using .find() instead of bracket notation
  const selectedName = useMemo(() => {
    if (!selectedId) return null;
    return REGION_DATA.find((r) => r.id === selectedId)?.name || selectedId;
  }, [selectedId]);

  const goToPrev = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCarouselIndex((prev) => Math.min(availableRegions.length - 1, prev + 1));
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    const velocityThreshold = 500;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      if (carouselIndex < availableRegions.length - 1) {
        goToNext();
      }
    } 
    else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      if (carouselIndex > 0) {
        goToPrev();
      }
    }
  };

  if (!availableRegions || availableRegions.length === 0) return null;

  return (
    <div className="w-full max-w-md px-4">
      <div className="relative mb-6">
        
        {/* Carousel container */}
        <div className="overflow-hidden">
          <motion.div
            className="flex cursor-grab active:cursor-grabbing"
            animate={{ x: `-${carouselIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }} 
            dragElastic={0.2} 
            onDragEnd={handleDragEnd}
          >
            {availableRegions.map((code) => {
              // 2. Locate the region data object for this specific code
              const region = REGION_DATA.find((r) => r.id === code);
              const componentCount = getComponentCount(code);

              return (
                <div key={code} className="w-full flex-shrink-0 px-2 pointer-events-none">
                  <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl border border-[#D4AF37]/30 p-6 shadow-xl pointer-events-auto">
                    
                    {/* 3. FIXED: Display the region name correctly */}
                    <h3 className="text-2xl font-serif text-[#D4AF37] text-center mb-4">
                      {region?.name || code}
                    </h3>

                    {/* 4. UPGRADED: Native React SVG instead of dangerouslySetInnerHTML */}
                    {region?.path && (
                      <div className="rounded-xl p-4 mb-4 flex items-center justify-center min-h-[200px] bg-neutral-800/30">
                        <svg 
                          viewBox="0 0 596.4 584.5" 
                          className="w-full max-w-[180px] drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                        >
                          <path 
                            d={region.path} 
                            fill="#2c2a25" 
                            stroke="#f5d47a" 
                            strokeWidth="3" 
                          />
                        </svg>
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
                      onClick={() => onSelect(code)}
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

        {/* Navigation arrows */}
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