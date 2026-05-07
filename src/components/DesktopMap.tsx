import { useEffect, useRef, useMemo, useState } from "react";
import { REGION_NAMES } from "../Logic/watchComponents";

interface Props {
  svgContent: string;
  availableRegions: string[];
  onSelect: (id: string) => void;
}

export const DesktopMap = ({ svgContent, availableRegions, onSelect }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // 1. Clean the SVG string: Remove hardcoded width/height so CSS can take over
  const responsiveSvgContent = useMemo(() => {
    if (!svgContent) return "";

    return svgContent
      .replace(/width="[^"]+"/g, '')
      .replace(/height="[^"]+"/g, '')
      .replace('<svg', '<svg viewBox="0 0 596.41547 584.5448" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="overflow: visible;"');
  }, [svgContent]);

  useEffect(() => {
    if (!mapRef.current || !responsiveSvgContent) return;

    const paths = mapRef.current.querySelectorAll("path, g[id^='FR-']");

    paths.forEach((el) => {
      const regionId = el.id;
      const isAvailable = availableRegions.includes(regionId);
      const htmlEl = el as HTMLElement;

      htmlEl.style.transition = "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      htmlEl.style.transformOrigin = "center";

      if (isAvailable) {
        el.setAttribute("fill", "#1c1d21");
        el.setAttribute("stroke", "#bda041");
        el.setAttribute("stroke-width", "1.2");
        htmlEl.style.filter = "drop-shadow(4px 8px 6px rgba(0,0,0,0.8))";
        htmlEl.style.cursor = "pointer";

        const handleMouseEnter = () => {
          // Bring the hovered region to the front of the SVG to prevent overlap and flickering
          if (htmlEl.parentNode) {
            htmlEl.parentNode.appendChild(htmlEl);
          }

          el.setAttribute("fill", "#2c2a25");
          el.setAttribute("stroke", "#f5d47a");
          el.setAttribute("stroke-width", "2");
          // Translate to pop 'up' visually (adjusting for the -30deg Z rotation)
          htmlEl.style.transform = "translate(15px, -25px)";
          htmlEl.style.filter = "drop-shadow(15px 25px 15px rgba(189, 160, 65, 0.35)) drop-shadow(0px 0px 10px rgba(189, 160, 65, 0.5))";
          setHoveredRegion(regionId);
        };

        const handleMouseLeave = () => {
          el.setAttribute("fill", "#1c1d21");
          el.setAttribute("stroke", "#bda041");
          el.setAttribute("stroke-width", "1.2");
          htmlEl.style.transform = "translate(0px, 0px)";
          htmlEl.style.filter = "drop-shadow(4px 8px 6px rgba(0,0,0,0.8))";
          setHoveredRegion(null);
        };

        htmlEl.addEventListener('mouseenter', handleMouseEnter);
        htmlEl.addEventListener('mouseleave', handleMouseLeave);
      } else {
        el.setAttribute("fill", "#0a0a0c");
        el.setAttribute("stroke", "#1a1a1a");
        el.setAttribute("stroke-width", "0.5");
        htmlEl.style.pointerEvents = "none";
        htmlEl.style.filter = "drop-shadow(2px 4px 4px rgba(0,0,0,0.9))";
      }
    });
  }, [responsiveSvgContent, availableRegions]);

  return (
    <div
      className="relative w-full min-h-[70vh] flex items-center justify-center perspective-[2000px] bg-transparent"
      onClick={(e) => {
        const target = (e.target as HTMLElement).closest("[id^='FR-']");
        if (target && availableRegions.includes(target.id)) onSelect(target.id);
      }}
    >
      {/* Holographic Tooltip */}
      {hoveredRegion && (
        <div
          className="absolute z-30 top-1/4 right-10 md:right-32 p-6 rounded-xl border border-[#d4af37]/30 bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.15)] pointer-events-none transition-all duration-200 transform translate-y-0 opacity-100"
          style={{ animation: 'fade-in-up 0.5s ease-out forwards' }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/10 to-transparent rounded-xl"></div>
          <h3 className="relative z-10 text-xl font-serif text-[#f5d47a] mb-2 tracking-wide drop-shadow-md">
            {REGION_NAMES[hoveredRegion] || hoveredRegion}
          </h3>
          <p className="relative z-10 text-xs font-sans text-neutral-400 uppercase tracking-widest mb-4">
            Composants Locaux
          </p>
          <div className="relative z-10 w-24 h-24 mx-auto flex items-center justify-center">
            {/* Holographic Abstract Watch Part Projection */}
            <svg className="animate-spin-slow opacity-80" width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="#d4af37" strokeWidth="1">
              <circle cx="50" cy="50" r="40" strokeDasharray="4 4" />
              <circle cx="50" cy="50" r="30" strokeOpacity="0.5" />
              <circle cx="50" cy="50" r="10" fill="#d4af37" fillOpacity="0.2" />
              <path d="M50 10 L50 30" strokeWidth="2" />
              <path d="M50 70 L50 90" strokeWidth="2" />
              <path d="M10 50 L30 50" strokeWidth="2" />
              <path d="M70 50 L90 50" strokeWidth="2" />
            </svg>
            <div className="absolute inset-0 bg-[#d4af37]/5 mix-blend-screen rounded-full animate-pulse blur-sm"></div>
          </div>
        </div>
      )}

      {/* Container for the 3D map */}
      <div
        ref={mapRef}
        className="relative z-10 w-full max-w-4xl h-full flex items-center justify-center transform-style-3d"
        style={{
          // The 2.5D Isometric Transform
          transform: 'rotateX(55deg) rotateZ(-30deg) scale(1.2)',
          transition: 'transform 1.5s ease-out'
        }}
      >
        <div
          className="w-full h-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.9)]"
          dangerouslySetInnerHTML={{ __html: responsiveSvgContent }}
        />
      </div>

      {/* Stylized base/shadow directly beneath the map for depth */}
      <div
        className="absolute top-1/2 left-1/2 w-[80%] max-w-3xl h-[60%] bg-black/60 blur-[60px] rounded-[100%] pointer-events-none"
        style={{
          transform: 'translate(-50%, -30%) rotateX(55deg) rotateZ(-30deg)'
        }}
      />

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
};