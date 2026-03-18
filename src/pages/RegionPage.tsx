import { useEffect, useMemo, useRef, useState } from "react";
import { MobileCarousel } from "../components/MobileCarousel";
import { useNavigate } from "react-router-dom";
import { REGION_NAMES } from "../Logic/watchComponents";
import { DesktopMap } from "../components/DesktopMap";
import Nav from "../components/Nav";
import type { PartOption } from "../types/Parts";

export default function RegionPage() {
  const [selectedId] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRootRef = useRef<SVGSVGElement | null>(null);
  
  // Plus besoin de useState pour availableRegions, useMemo s'en charge !
  const [watchComponents, setWatchComponents] = useState<PartOption[]>([]);

  // Gold highlight style (Montres‑Bastille aesthetic)
  const HIGHLIGHT_COLOR = "#D4AF37"; // rich gold

  // Navigation vers le configurateur
  const handleConfigureClick = (regionId: string) => {
    const components = getComponentByRegion(regionId);
    console.log(components)
    navigate('/configurator', { 
      state: { 
        selectedRegion: regionId,
        regionName: REGION_NAMES[regionId] || regionId,
        watchComponents: components
      } 
    });
  };

  // Récupération depuis l'API
  async function getComponents() {
    try {
      const response = await fetch("https://montre-bastille-api.onrender.com/api/components");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("result : ",result)
      return result; 
      
    } catch (error) {
      console.error("Erreur lors de la récupération des composants:", error);
      return []; 
    }
  }

  // Detect mobile & Fetch Data
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 1. Récupération du SVG
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

    // 2. CORRECTION : Encapsulation de l'appel asynchrone
    const fetchAndSetComponents = async () => {
      const components = await getComponents();
      console.log("components : ", components)
      setWatchComponents(components);
    };
    
    fetchAndSetComponents();

    return () => window.removeEventListener('resize', checkMobile);
  }, []); // Exécuté une seule fois au montage


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

  const getComponentCount = (): number => {
    return watchComponents.length ?? 0;
  };

  const getComponentByRegion = (regionCode: string)=> {
    return watchComponents.filter(elem => {
      if (elem.regions && Array.isArray(elem.regions)) {
        return elem.regions.includes(regionCode);
      }
      return false;
    });
  }

  // CORRECTION : useMemo calcule automatiquement les régions dès que watchComponents change
  // Utilisation d'un "Set" pour éviter les doublons automatiquement et proprement
  const availableRegions = useMemo(() => {
    const regions = new Set<string>();
    
    watchComponents.forEach((component: PartOption) => {
      if (component.regions && Array.isArray(component.regions)) {
        component.regions.forEach((region: string) => {
          regions.add(region);
        });
      }
    });
    
    return Array.from(regions); // Convertit le Set en tableau classique
  }, [watchComponents]);


  // Extract individual region from full SVG
  const extractRegionSVG = (regionCode: string) => {
    if (!svgContent) return null;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const svgElement = doc.querySelector("svg");
    const regionElement = doc.querySelector(`#${CSS.escape(regionCode)}`);
    
    if (!regionElement || !svgElement) return null;
    
    // Create a temporary SVG to calculate bounding box
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    document.body.appendChild(tempDiv);
    
    const tempSvg = svgElement.cloneNode(true) as SVGSVGElement;
    tempDiv.appendChild(tempSvg);
    
    const tempPath = tempSvg.querySelector(`#${CSS.escape(regionCode)}`) as SVGGraphicsElement;
    
    if (!tempPath) {
      document.body.removeChild(tempDiv);
      return null;
    }
    
    // Get bounding box
    const bbox = tempPath.getBBox();
    document.body.removeChild(tempDiv);
    
    // Create new SVG with just this region
    const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const padding = 10;
    newSvg.setAttribute("viewBox", `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`);
    newSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    newSvg.setAttribute("width", "100%");
    newSvg.setAttribute("height", "100%");
    
    const clone = regionElement.cloneNode(true) as SVGElement;
    clone.setAttribute("fill", "#f5c242");
    clone.setAttribute("stroke", "#1E1E1E");
    clone.setAttribute("stroke-width", "3");
    
    newSvg.appendChild(clone);
    
    return new XMLSerializer().serializeToString(newSvg);
  };

  return (
    <>
      <Nav bg={false}/>

      <div className="relative flex flex-col items-center justify-center min-h-screen px-8 pt-28 pb-16 bg-neutral-950 text-neutral-200 font-[Poppins] tracking-wide overflow-hidden" ref={containerRef}>
        <style>{`
          .selected-region {
            stroke: ${HIGHLIGHT_COLOR};
            stroke-width: 2.5;
            transition: all 0.3s ease;
          }
          [id^='FR-']:hover {
            cursor: pointer;
            fill: ${HIGHLIGHT_COLOR};
            stroke-width: 8px;
            stroke: 2px solid ${HIGHLIGHT_COLOR};
            transition: all 0.2s ease;
          }
          svg {
            display: block;
            margin: 0 auto;
            max-width: 90%;
            height: auto;
            transition: transform 0.3s ease;
          }
          svg:hover { transform: scale(1.02); }
        `}
      </style>

        {/* Branding header */}
        <div className="text-center mb-6 sm:mb-10 px-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold text-neutral-100 tracking-widest mb-2">
            Montres-Bastille
          </h1>
          <p className="text-lg sm:text-sm md:text-base text-primary uppercase tracking-[0.35em] mb-2">
            Les Régions de France
          </p>
          <p className="text-xl sm:text-sm md:text-base text-neutral-300">
            Choisissez une région pour concevoir votre Montres-Bastille, en utilisant les matériaux de cette région. 
          </p>
        </div>
          
        {/* Desktop: Full Map */}
        {!isMobile && (
          <DesktopMap svgContent={svgContent} availableRegions={availableRegions} onSelect={handleConfigureClick}/>
        )}

        {isMobile && (
          <MobileCarousel
            availableRegions={availableRegions}
            getComponentCount={getComponentCount}
            extractRegionSVG={extractRegionSVG}
            onSelect={handleConfigureClick}
            />
        )}
      </div>
    </>
  );
}