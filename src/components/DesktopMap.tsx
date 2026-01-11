import { useEffect, useRef } from "react";
import mapBG from "/mapBG.png"

interface Props {
  svgContent: string;
  availableRegions: string[];
  onSelect: (id: string) => void;
}

export const DesktopMap = ({ svgContent, availableRegions, onSelect }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !svgContent) return;
    
    const paths = mapRef.current.querySelectorAll("path, g[id^='FR-']");
    
    paths.forEach((el) => {
      const regionId = el.id;
      const isAvailable = availableRegions.includes(regionId);

      // Reset des styles de base
      el.setAttribute("class", "transition-all duration-300 ease-in-out");
      
      if (isAvailable) {
        // RÉGIONS DISPONIBLES : Couleurs Primary & Surface
        el.classList.add(
          "fill-surface", 
          "hover:fill-primary", 
          "cursor-pointer", 
          "opacity-100",
          "stroke-border/20",
          "hover:stroke-primary/50"
        );
      } else {
        // RÉGIONS NON DISPONIBLES : Effet désactivé
        el.classList.add(
          "fill-background", 
          "opacity-70", 
          "pointer-events-none",
          "stroke-border/10"
        );
      }
    });
  }, [svgContent, availableRegions]);

  return (
  <div 
    ref={mapRef}
    className="relative w-full max-w-5xl p-10 bg-surface/30 rounded-3xl border border-border/20 backdrop-blur-sm shadow-2xl overflow-hidden flex items-center justify-center"
    onClick={(e) => {
      const target = (e.target as HTMLElement).closest("[id^='FR-']");
      if (target && availableRegions.includes(target.id)) onSelect(target.id);
    }}
    onMouseOver={(e) => {
      const target = (e.target as HTMLElement).closest("[id^='FR-']");
      // On ne déclenche le hover que si la région est disponible
    }}
  >
    {/* Background Image - Positionnée derrière le SVG via z-index */}
    <img 
      src={mapBG} 
      alt="Map Background" 
      className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none z-0" 
    />

    {/* SVG Content - Positionné devant l'image */}
    <div 
      className="relative z-10 w-full h-full flex items-center justify-center [&_svg]:max-h-[70vh] [&_svg]:w-auto"
      dangerouslySetInnerHTML={{ __html: svgContent }} 
      style={{ filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.5))' }}
    />
  </div>
);
};