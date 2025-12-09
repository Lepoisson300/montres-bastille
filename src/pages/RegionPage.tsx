import { useEffect, useMemo, useRef, useState } from "react";
import MapModal from "./MapModal";
import type { PartsCatalog } from "../types/Parts";
import { WATCH_COMPONENTS, REGION_NAMES } from "../Logic/watchComponents";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FranceMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRootRef = useRef<SVGSVGElement | null>(null);

  const HIGHLIGHT_COLOR = "#f5c242";

  // Get array of region codes for carousel
  const regionCodes = useMemo(() => Object.keys(REGION_NAMES), []);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load SVG content on mount
  useEffect(() => {
    fetch("/france.svg")
      .then((res) => {
        if (!res.ok) throw new Error("SVG not found");
        return res.text();
      })
      .then(setSvgContent)
      .catch((err) => {
        console.error("Failed to load SVG:", err);
        fetch("/assets/france.svg")
          .then((res) => res.text())
          .then(setSvgContent)
          .catch(() => console.error("SVG not found in any location"));
      });
  }, []);

  // Desktop: Attach event delegation
  useEffect(() => {
    if (isMobile) return;
    
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = (target.closest("[id^='FR-']") as HTMLElement) || null;
      if (!el) return;
      const id = el.id;
      if (id) setSelectedId(id);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = (target.closest("[id^='FR-']") as HTMLElement) || null;
      if (el) setHoveredRegion(el.id);
    };

    const handleMouseOut = () => {
      setHoveredRegion(null);
    };

    container.addEventListener("click", handleClick);
    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mouseout", handleMouseOut);

    return () => {
      container.removeEventListener("click", handleClick);
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isMobile]);

  // Keep reference to SVG
  useEffect(() => {
    if (!containerRef.current) return;
    const svg = containerRef.current.querySelector("svg");
    if (svg) svgRootRef.current = svg as unknown as SVGSVGElement;
  }, [svgContent]);

  // Highlight selected region on desktop map
  useEffect(() => {
    if (isMobile) return;
    const svg = svgRootRef.current;
    if (!svg) return;
    svg.querySelectorAll(".selected-region").forEach((n) => n.classList.remove("selected-region"));
    if (!selectedId) return;
    const el = svg.querySelector(`#${CSS.escape(selectedId)}`);
    if (el) el.classList.add("selected-region");
  }, [selectedId, isMobile]);

  const selectedName = useMemo(() => {
    if (!selectedId) return null;
    return REGION_NAMES[selectedId] || selectedId;
  }, [selectedId]);

  const hoveredName = useMemo(() => {
    if (!hoveredRegion) return null;
    return REGION_NAMES[hoveredRegion] || hoveredRegion;
  }, [hoveredRegion]);

  // Filter watch components
  const filteredComponents: PartsCatalog = useMemo(() => {
    if (!selectedId) {
      return { cases: [], dials: [], hands: [], straps: [] };
    }
    
    return {
      cases: WATCH_COMPONENTS.cases.filter(c => c.regions?.includes(selectedId)),
      dials: WATCH_COMPONENTS.dials.filter(d => d.regions?.includes(selectedId)),
      hands: WATCH_COMPONENTS.hands.filter(h => h.regions?.includes(selectedId)),
      straps: WATCH_COMPONENTS.straps.filter(s => s.regions?.includes(selectedId)),
    };
  }, [selectedId]);

  // Count available components for a region
  const getComponentCount = (regionCode: string) => {
    return (
      WATCH_COMPONENTS.cases.filter(c => c.regions?.includes(regionCode)).length +
      WATCH_COMPONENTS.dials.filter(d => d.regions?.includes(regionCode)).length +
      WATCH_COMPONENTS.hands.filter(h => h.regions?.includes(regionCode)).length +
      WATCH_COMPONENTS.straps.filter(s => s.regions?.includes(regionCode)).length
    );
  };

  // Carousel navigation
  const goToNext = () => {
    setCarouselIndex((prev) => (prev + 1) % regionCodes.length);
  };

  const goToPrev = () => {
    setCarouselIndex((prev) => (prev - 1 + regionCodes.length) % regionCodes.length);
  };

  // Extract individual region from full SVG
  const extractRegionSVG = (regionCode: string) => {
    if (!svgContent) return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const regionElement = doc.querySelector(`#${CSS.escape(regionCode)}`);
    
    if (!regionElement) return null;
    
    const clone = regionElement.cloneNode(true) as SVGElement;
    const bbox = (regionElement as SVGGraphicsElement).getBBox();
    
    const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    newSvg.setAttribute("viewBox", `${bbox.x - 10} ${bbox.y - 10} ${bbox.width + 20} ${bbox.height + 20}`);
    newSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    newSvg.appendChild(clone);
    
    clone.setAttribute("fill", "#f5c242");
    clone.setAttribute("stroke", "#000");
    clone.setAttribute("stroke-width", "2");
    
    return new XMLSerializer().serializeToString(newSvg);
  };

  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 pt-20 sm:pt-28 pb-12 sm:pb-16 bg-neutral-950 text-neutral-200 font-[Poppins] tracking-wide overflow-hidden">
        <style>{`
          .selected-region {
            stroke: ${HIGHLIGHT_COLOR} !important;
            stroke-width: 3 !important;
            filter: drop-shadow(0 0 8px rgba(245,194,66,0.8)) !important;
            transition: all 0.3s ease;
          }
          [id^='FR-'] {
            cursor: pointer;
            transition: all 0.2s ease;
            stroke: rgba(245,194,66,0.3);
            stroke-width: 1;
          }
          [id^='FR-']:hover { 
            stroke: ${HIGHLIGHT_COLOR};
            stroke-width: 2;
            filter: drop-shadow(0 0 4px rgba(245,194,66,0.5));
          }
          svg {
            display: block;
            margin: 0 auto;
            width: 100%;
            height: auto;
            max-height: 70vh;
            transition: transform 0.3s ease;
          }
          svg:hover { transform: scale(1.02); }
        `}</style>

        {/* Branding header */}
        <div className="text-center mb-6 sm:mb-10 px-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold text-neutral-100 tracking-widest mb-2">
            Montres-Bastille
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-bastilleGold uppercase tracking-[0.35em] mb-2">
            Les Régions de France
          </p>
          <p className="text-xs sm:text-sm md:text-base text-neutral-300">
            {isMobile ? "Parcourez les régions ci-dessous" : "Choisissez une région de France pour concevoir votre pièce du patrimoine"}
          </p>
        </div>

        {/* Desktop hover tooltip */}
        {!isMobile && hoveredName && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <div className="bg-neutral-900/95 backdrop-blur-sm border border-bastilleGold/50 rounded-lg px-4 py-2 shadow-lg">
              <span className="text-bastilleGold font-semibold">{hoveredName}</span>
            </div>
          </div>
        )}

        {/* Desktop: Full Map */}
        {!isMobile && (
          <div
            ref={containerRef}
            className="relative flex items-center justify-center w-full max-w-6xl rounded-3xl
                       shadow-[0_0_35px_rgba(245,194,66,0.12)]
                       bg-gradient-to-b from-neutral-100 to-neutral-800 border border-bastilleGold/30 
                       p-6 overflow-hidden"
          >
            {svgContent ? (
              <div
                className="w-full flex justify-center items-center"
                dangerouslySetInnerHTML={{ __html: svgContent }}
                style={{
                  filter: 'sepia(1) saturate(3) hue-rotate(35deg) brightness(1.2)'
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-neutral-500 italic">
                Chargement de la carte...
              </div>
            )}
          </div>
        )}

        {/* Mobile: Region Carousel */}
        {isMobile && svgContent && (
          <div className="w-full max-w-md px-4">
            <div className="relative">
              {/* Carousel container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                >
                  {regionCodes.map((code) => {
                    const regionSVG = extractRegionSVG(code);
                    const componentCount = getComponentCount(code);
                    
                    return (
                      <div key={code} className="w-full flex-shrink-0 px-2">
                        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl border border-bastilleGold/30 p-6 shadow-xl">
                          {/* Region name */}
                          <h3 className="text-2xl font-serif text-bastilleGold text-center mb-4">
                            {REGION_NAMES[code]}
                          </h3>
                          
                          {/* Region SVG preview */}
                          {regionSVG && (
                            <div className="bg-neutral-100 rounded-xl p-8 mb-4 flex items-center justify-center min-h-[200px]">
                              <div 
                                dangerouslySetInnerHTML={{ __html: regionSVG }}
                                className="w-full max-w-[200px]"
                              />
                            </div>
                          )}
                          
                          {/* Component info */}
                          <div className="bg-neutral-800/50 rounded-lg p-4 mb-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-bastilleGold mb-1">
                                {componentCount}
                              </div>
                              <div className="text-sm text-neutral-400">
                                composants disponibles
                              </div>
                            </div>
                          </div>
                          
                          {/* Configure button */}
                          <button
                            onClick={() => setSelectedId(code)}
                            className="w-full bg-bastilleGold text-neutral-900 font-semibold py-4 rounded-xl hover:bg-bastilleGold/90 transition-all shadow-lg"
                          >
                            Configurer ma montre
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation arrows */}
              <button
                onClick={goToPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-bastilleGold/10 backdrop-blur-sm border border-bastilleGold/30 rounded-full p-3 hover:bg-bastilleGold/20 transition-all shadow-lg z-10"
                aria-label="Région précédente"
              >
                <ChevronLeft className="w-6 h-6 text-bastilleGold" />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-bastilleGold/10 backdrop-blur-sm border border-bastilleGold/30 rounded-full p-3 hover:bg-bastilleGold/20 transition-all shadow-lg z-10"
                aria-label="Région suivante"
              >
                <ChevronRight className="w-6 h-6 text-bastilleGold" />
              </button>

              {/* Dots indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {regionCodes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === carouselIndex 
                        ? 'bg-bastilleGold w-8' 
                        : 'bg-neutral-600'
                    }`}
                    aria-label={`Aller à la région ${index + 1}`}
                  />
                ))}
              </div>

              {/* Counter */}
              <div className="text-center mt-4 text-sm text-neutral-400">
                {carouselIndex + 1} / {regionCodes.length}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <MapModal
        selectedId={selectedId}
        onClose={() => setSelectedId(null)}
        svgRootRef={svgRootRef}
        RegionName={selectedName || ""}
        regions={REGION_NAMES}
        watchComponents={filteredComponents}
      />
    </>
  );
}