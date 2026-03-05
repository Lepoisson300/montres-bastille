import { useEffect, useRef, useMemo } from "react";
import mapBG from "/mapBG.png"

interface Props {
  svgContent: string;
  availableRegions: string[];
  onSelect: (id: string) => void;
}

export const DesktopMap = ({ svgContent, availableRegions, onSelect }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // 1. Clean the SVG string: Remove hardcoded width/height so CSS can take over
// 1. Nettoyer et rendre le SVG responsive
  const responsiveSvgContent = useMemo(() => {
    if (!svgContent) return "";
    
    return svgContent
      // Supprime les dimensions fixes
      .replace(/width="[^"]+"/g, '')
      .replace(/height="[^"]+"/g, '')
      // Injecte le viewBox avec vos dimensions exactes + force la prise de l'espace
      .replace('<svg', '<svg viewBox="0 0 596.41547 584.5448" width="100%" height="100%" preserveAspectRatio="xMidYMid meet"');
  }, [svgContent]);

  useEffect(() => {
    if (!mapRef.current || !responsiveSvgContent) return;
    
    const paths = mapRef.current.querySelectorAll("path, g[id^='FR-']");
    
    paths.forEach((el) => {
      const regionId = el.id;
      const isAvailable = availableRegions.includes(regionId);

      el.setAttribute("class", "transition-all duration-300 ease-in-out");
      
      if (isAvailable) {
        el.classList.add(
          "fill-surface", 
          "hover:fill-primary", 
          "cursor-pointer", 
          "opacity-100",
          "stroke-border/20",
          "hover:stroke-primary/50"
        );
      } else {
        el.classList.add(
          "fill-background", 
          "opacity-70", 
          "pointer-events-none",
          "stroke-border/10"
        );
      }
    });
  }, [responsiveSvgContent, availableRegions]);

  return (
  <div 
    ref={mapRef}
    // 2. Added aspect ratio or min-h to ensure the container has a flexible but consistent shape
    className="relative w-full max-w-6xl min-h-[60vh] p-4 md:p-10 bg-surface/30 rounded-3xl border border-border/20 backdrop-blur-sm shadow-2xl overflow-hidden flex items-center justify-center mx-auto"
    onClick={(e) => {
      const target = (e.target as HTMLElement).closest("[id^='FR-']");
      if (target && availableRegions.includes(target.id)) onSelect(target.id);
    }}
  >
    <img 
      src={mapBG} 
      alt="Map Background" 
      className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none z-0" 
    />

    <div 
      // 3. Updated child SVG targeting: Force 100% width/height and keep aspect ratio intact
      className="relative z-10 w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:max-h-[75vh] [&_svg]:object-contain"
      dangerouslySetInnerHTML={{ __html: responsiveSvgContent }} 
      style={{ filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.5))' }}
    />
  </div>
);
};