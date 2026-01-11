import { useMemo, useState } from "react";
import { REGION_NAMES, WATCH_COMPONENTS } from "../Logic/watchComponents";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MobileCarouselProps {
  availableRegions: string[];
  getComponentCount: (code: string) => number;
  extractRegionSVG: (code: string) => string | null;
  onSelect: (id: string) => void;
}



export const MobileCarousel = ({ availableRegions, getComponentCount, extractRegionSVG, onSelect }: MobileCarouselProps) => {

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedId] = useState<string | null>(null);
  const navigate = useNavigate();

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

  if (!availableRegions || availableRegions.length === 0) return null;

  return (
    <div className="w-full max-w-md px-4">
      <div className="relative">
        {/* Carousel container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
          >
            {availableRegions.map((code) => {
              const regionSVG = extractRegionSVG(code);
              const componentCount = getComponentCount(code);

              return (
                <div key={code} className="w-full flex-shrink-0 px-2">
                  <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl border border-[#D4AF37]/30 p-6 shadow-xl">
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
          </div>
        </div>

        {/* Navigation arrows (Only if more than 1 region) */}
        {availableRegions.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              disabled={carouselIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-neutral-900/80 backdrop-blur-sm border border-[#D4AF37]/30 rounded-full p-3 hover:bg-neutral-800 transition-all shadow-lg z-10 disabled:opacity-30"
              aria-label="Région précédente"
            >
              <ChevronLeft className="w-6 h-6 text-[#D4AF37]" />
            </button>

            <button
              onClick={goToNext}
              disabled={carouselIndex === availableRegions.length - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-neutral-900/80 backdrop-blur-sm border border-[#D4AF37]/30 rounded-full p-3 hover:bg-neutral-800 transition-all shadow-lg z-10 disabled:opacity-30"
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