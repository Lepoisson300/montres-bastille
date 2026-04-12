import { useEffect, useMemo, useRef, useState } from "react";
import { MobileCarousel } from "../components/MobileCarousel";
import { useNavigate } from "react-router-dom";
import { REGION_NAMES } from "../Logic/watchComponents";
import { DesktopMap } from "../components/DesktopMap";
import Nav from "../components/Nav";
import type { PartOption } from "../types/Parts";
import { Helmet } from "react-helmet-async";

interface RegionPageProps {
  components: PartOption[];
}

export default function RegionPage({ components }: RegionPageProps) {
  const [selectedId] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRootRef = useRef<SVGSVGElement | null>(null);
  
  // L'esthétique Montres-Bastille
  const HIGHLIGHT_COLOR = "#bda041";

  // --- 1. HOOKS ET LOGIQUE DIRECTEMENT LIÉS AUX PROPS ---

  // On utilise directement "components" (la prop) au lieu d'un state "watchComponents"
  const availableRegions = useMemo(() => {
    const regions = new Set<string>();
    
    // Si components n'est pas encore chargé, on renvoie un tableau vide
    if (!components) return [];

    components.forEach((component: PartOption) => {
      if (component.regions && typeof component.regions === 'object') {
        Object.values(component.regions).forEach((val: any) => {
          if (typeof val === 'string') {
            regions.add(val);
          }
        });
      }
    });
    
    return Array.from(regions);
  }, [components]); // Dès que la prop "components" change, on recalcule !

  const getComponentByRegion = (regionCode: string) => {
    if (!components) return [];
    return components.filter(elem => {
      if (elem.regions && typeof elem.regions === 'object') {
        return Object.values(elem.regions).includes(regionCode);
      }
      return false;
    });
  };

  const getComponentCount = (): number => {
    return components?.length ?? 0;
  };

  const handleConfigureClick = (regionId: string) => {
    const regionComponents = getComponentByRegion(regionId);
    console.log(regionComponents);
    (window as any).isValidNavigation = true;
    navigate('/configurator', { 
      state: { 
        selectedRegion: regionId,
        regionName: REGION_NAMES[regionId] || regionId,
        watchComponents: regionComponents // On passe les composants filtrés
      } 
    });
  };

  // --- 2. EFFETS SECONDAIRES (useEffect) ---

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

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

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const svg = containerRef.current.querySelector("svg");
    if (svg) svgRootRef.current = svg as unknown as SVGSVGElement;
  }, [svgContent]);

  useEffect(() => {
    if (isMobile) return;
    const svg = svgRootRef.current;
    if (!svg) return;
    svg.querySelectorAll(".selected-region").forEach((n) => n.classList.remove("selected-region"));
    if (!selectedId) return;
    const el = svg.querySelector(`#${CSS.escape(selectedId)}`);
    if (el) el.classList.add("selected-region");
  }, [selectedId, isMobile]);

  // Extraction SVG pour mobile
  const extractRegionSVG = (regionCode: string) => {
    if (!svgContent) return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const svgElement = doc.querySelector("svg");
    const regionElement = doc.querySelector(`#${CSS.escape(regionCode)}`);
    
    if (!regionElement || !svgElement) return null;
    
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
    
    const bbox = tempPath.getBBox();
    document.body.removeChild(tempDiv);
    
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

  // --- 3. CONDITIONS D'AFFICHAGE ---

  // Affichage du loader SEULEMENT après avoir initialisé tous les Hooks !
  if (!components || components.length === 0) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505]">
        <div className="relative flex items-center justify-center w-16 h-16 mb-8">
          <div className="absolute inset-0 border border-[#d4af37]/10 rounded-full"></div>
          <div className="absolute inset-0 border border-transparent border-t-[#d4af37] rounded-full animate-[spin_1.2s_cubic-bezier(0.5,0.1,0.4,0.9)_infinite]"></div>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[#d4af37] text-xs sm:text-sm uppercase tracking-[0.4em] font-serif animate-pulse ml-[0.4em]">
            Chargement des composants
          </p>
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent mt-4 opacity-50"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Choisir ma Région | Personnalisez votre Montre Bastille</title>
        <meta name="description" content="Sélectionnez une région française sur notre carte interactive pour configurer votre montre unique. Matériaux locaux et artisanat français de précision." />
        <meta property="og:title" content="Carte des Régions - Créez votre Montre Bastille" />
        <meta property="og:description" content="Découvrez les composants horlogers issus du patrimoine de nos régions françaises." />
        <link rel="canonical" href="https://montre-bastille.fr/region-page" />
      </Helmet>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Personnalisation de montres par région",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Montre Bastille",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Bordeaux",
              "addressCountry": "FR"
            }
          },
          "areaServed": "FR",
          "description": "Service de configuration de montres utilisant des matériaux issus des régions françaises."
        })}
      </script>
      <Nav bg={false}/>

      <div className="relative flex flex-col items-center justify-center min-h-screen px-8 pt-28 pb-16 bg-neutral-950 text-neutral-200 font-[Poppins] tracking-wide overflow-hidden" ref={containerRef}>
        <header className="text-center mb-6 sm:mb-10 px-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold text-neutral-100 tracking-widest mb-2">
            Montres-Bastille
          </h1>
          <h2 className="text-lg sm:text-sm md:text-base text-primary uppercase tracking-[0.35em] mb-2">
            Le Patrimoine des Régions de France
          </h2>
          <p className="text-xl sm:text-sm md:text-base text-neutral-300 max-w-2xl mx-auto">
            Sélectionnez votre région sur la carte pour concevoir une montre unique à partir de matériaux locaux (bois, pierre, cuir). 
          </p>
        </header>
          
        <main className="w-full" role="main" aria-label="Carte interactive des régions de France">
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
        </main>
      </div>
    </>
  );
}