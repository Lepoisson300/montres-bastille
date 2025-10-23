import { useEffect, useMemo, useRef, useState } from "react";
import MapModal from "./MapModal"; // Import the modal
import type { PartsCatalog } from "../types/Parts";

/**
 * Official region names mapping (fill these using your SVG's labels).
 * Your SVG uses IDs like FR-A, FR-B, ... FR-T. We keep those IDs exactly.
 */
const REGION_NAMES: Record<string, string> = {
  "FR-A": "Alsace",
  "FR-B": "Aquitaine",
  "FR-C": "Auvergne",
  "FR-D": "Bourgogne",
  "FR-E": "Bretagne",
  "FR-F": "Centre-Val de Loire",
  "FR-G": "Champagne-Ardenne",
  "FR-H": "Corse",
  "FR-I": "Franche-Compté",
  "FR-J": "Ile-deFrance",
  "FR-K": "Languedoc-Roussillon",
  "FR-L": "Limousin",
  "FR-M": "Lorraine",
  "FR-N": "Midi-Pyrénées",
  "FR-O": "Nord-Pas-de-Calais",
  "FR-P": "Basse-Normandie",
  "FR-Q": "Haute-Normandie",
  "FR-R": "Pays de la Loire",
  "FR-S": "Picardie",
  "FR-T": "Poitou-Charentes",
  "FR-U": "Provence-Alpes-Côte d'Azur",
  "FR-V": "Rhône-Alpes",
};

const WATCH_COMPONENTS = {
  cases: [
    { 
      id: 'c1', 
      name: 'Classic Round', 
      price: 2500, 
      thumbnail: '/images/cases/classic-round.jpg',
      stock: 'in' as const,
      material: 'Stainless Steel', 
      size: '40mm', 
      regions: ['FR-E', 'FR-A', 'FR-U']
    },
    { 
      id: 'c2', 
      name: 'Sport Chronograph', 
      price: 3200, 
      thumbnail: '/images/cases/sport-chronograph.jpg',
      stock: 'low' as const,
      material: 'Titanium', 
      size: '42mm', 
      regions: ['FR-E', 'FR-A', 'FR-U']
    },
    { 
      id: 'c3', 
      name: 'Dress Slim', 
      price: 8500, 
      thumbnail: '/images/cases/dress-slim.jpg',
      stock: 'in' as const,
      material: '18K Gold', 
      size: '38mm', 
      regions: ['FR-A', 'FR-U']
    },
    { 
      id: 'c4', 
      name: 'Diver Pro', 
      price: 4100, 
      thumbnail: '/images/cases/diver-pro.jpg',
      stock: 'oos' as const,
      material: 'Ceramic', 
      size: '44mm', 
      regions: ['FR-E', 'FR-U']
    },
    { 
      id: 'c5', 
      name: 'Heritage Square', 
      price: 9200, 
      thumbnail: '/images/cases/heritage-square.jpg',
      stock: 'low' as const,
      material: 'Rose Gold', 
      size: '41mm', 
      regions: ['FR-A']
    },
  ],
  dials: [
    { 
      id: 'd1', 
      name: 'Sunburst Blue', 
      price: 800, 
      thumbnail: '/images/dials/sunburst-blue.jpg',
      stock: 'in' as const,
      color: 'Blue',
      finish: 'Lacquer', 
      markers: 'Roman', 
      regions: ['FR-E', 'FR-A', 'FR-U']
    },
    { 
      id: 'd2', 
      name: 'Black Carbon', 
      price: 1200, 
      thumbnail: '/images/dials/black-carbon.jpg',
      stock: 'in' as const,
      color: 'Black',
      finish: 'Carbon Fiber', 
      markers: 'Index', 
      regions: ['FR-E', 'FR-U']
    },
    { 
      id: 'd3', 
      name: 'Champagne Guilloché', 
      price: 2500, 
      thumbnail: '/images/dials/champagne-guilloche.jpg',
      stock: 'low' as const,
      color: 'Champagne',
      finish: 'Hand-engraved', 
      markers: 'Roman', 
      regions: ['FR-A']
    },
    { 
      id: 'd4', 
      name: 'Silver Opaline', 
      price: 900, 
      thumbnail: '/images/dials/silver-opaline.jpg',
      stock: 'in' as const,
      color: 'Silver',
      finish: 'Brushed', 
      markers: 'Baton', 
      regions: ['FR-E', 'FR-A', 'FR-U']
    },
    { 
      id: 'd5', 
      name: 'Meteorite', 
      price: 5500, 
      thumbnail: '/images/dials/meteorite.jpg',
      stock: 'oos' as const,
      color: 'Gray',
      finish: 'Natural Stone', 
      markers: 'Diamond', 
      regions: ['FR-A', 'FR-U']
    },
  ],
  hands: [
    { 
      id: 'h1', 
      name: 'Dauphine', 
      price: 200, 
      thumbnail: '/images/hands/dauphine.jpg',
      stock: 'in' as const,
      style: 'Classic', 
      luminous: true, 
      regions: ['FR-E', 'FR-A', 'FR-U']
    },
    { 
      id: 'h2', 
      name: 'Sword', 
      price: 250, 
      thumbnail: '/images/hands/sword.jpg',
      stock: 'low' as const,
      style: 'Vintage', 
      luminous: true, 
      regions: ['FR-A', 'FR-U']
    },
    { 
      id: 'h3', 
      name: 'Baton', 
      price: 180, 
      thumbnail: '/images/hands/baton.jpg',
      stock: 'in' as const,
      style: 'Modern', 
      luminous: false, 
      regions: ['FR-E', 'FR-A', 'FR-U']
    },
    { 
      id: 'h4', 
      name: 'Alpha', 
      price: 220, 
      thumbnail: '/images/hands/alpha.jpg',
      stock: 'in' as const,
      style: 'Sport', 
      luminous: true, 
      regions: ['FR-E', 'FR-U']
    },
  ],
  straps: [
    { 
      id: 's1', 
      name: 'Alligator Leather', 
      price: 600, 
      thumbnail: '/images/straps/alligator-leather.jpg',
      stock: 'in' as const,
      material: 'Alligator Leather',
      color: 'Black', 
      clasp: 'Deployant', 
      regions: ['FR-E', 'FR-A', 'FR-U']
    },
    { 
      id: 's2', 
      name: 'Steel Bracelet', 
      price: 800, 
      thumbnail: '/images/straps/steel-bracelet.jpg',
      stock: 'low' as const,
      material: 'Steel',
      color: 'Silver', 
      clasp: 'Folding', 
      regions: ['FR-E', 'FR-A', 'FR-U']
    },
    { 
      id: 's3', 
      name: 'Rubber Sport', 
      price: 350, 
      thumbnail: '/images/straps/rubber-sport.jpg',
      stock: 'in' as const,
      material: 'Rubber',
      color: 'Blue', 
      clasp: 'Tang', 
      regions: ['FR-E', 'FR-U']
    },
    { 
      id: 's4', 
      name: 'Gold Bracelet', 
      price: 3500, 
      thumbnail: '/images/straps/gold-bracelet.jpg',
      stock: 'oos' as const,
      material: 'Gold',
      color: 'Gold', 
      clasp: 'Folding', 
      regions: ['FR-A']
    },
    { 
      id: 's5', 
      name: 'Ostrich Leather', 
      price: 950, 
      thumbnail: '/images/straps/ostrich-leather.jpg',
      stock: 'low' as const,
      material: 'Ostrich Leather',
      color: 'Brown', 
      clasp: 'Pin', 
      regions: ['FR-A']
    },
  ],
};

export default function FranceMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRootRef = useRef<SVGSVGElement | null>(null);

  // Gold highlight style (Montres‑Bastille aesthetic)
  const HIGHLIGHT_COLOR = " #1E1E1E"; // rich gold

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
        // Try alternative path for production builds
        fetch("/assets/france.svg")
          .then((res) => res.text())
          .then(setSvgContent)
          .catch(() => console.error("SVG not found in any location"));
      });
  }, []);

  // Attach event delegation to capture clicks on any region element with id starting by FR-
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // Find the closest element that has an id like FR-*
      const el = (target.closest("[id^='FR-']") as HTMLElement) || null;
      if (!el) return;
      const id = el.id;
      if (id) setSelectedId(id);
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, []);

  // On mount, keep a reference to the embedded SVG element for later queries
  useEffect(() => {
    if (!containerRef.current) return;
    const svg = containerRef.current.querySelector("svg");
    if (svg) svgRootRef.current = svg as unknown as SVGSVGElement;
  }, [svgContent]);

  // Auto-detect region titles from <title> or data attributes and log a mapping helper
  useEffect(() => {
    const svg = svgRootRef.current;
    if (!svg) return;
    const nodes = Array.from(svg.querySelectorAll("[id^='FR-']"));
    const helper = nodes.map((el) => ({
      id: (el as HTMLElement).id,
      title:
        (el.querySelector("title")?.textContent ||
          (el as HTMLElement).getAttribute("data-name") ||
          (el as HTMLElement).getAttribute("name") ||
          (el as HTMLElement).getAttribute("inkscape:label") ||
          ""),
    }));
    console.table(helper);
  }, [svgContent]);

  // Visually highlight the selected region by adding/removing a CSS class
  useEffect(() => {
    const svg = svgRootRef.current;
    if (!svg) return;
    // Remove previous highlight
    svg.querySelectorAll(".selected-region").forEach((n) => n.classList.remove("selected-region"));
    if (!selectedId) return;
    const el = svg.querySelector(`#${CSS.escape(selectedId)}`);
    if (el) el.classList.add("selected-region");
  }, [selectedId]);

  const selectedName = useMemo(() => {
    if (!selectedId) return null;
    const explicit = REGION_NAMES[selectedId];
    if (explicit) return explicit;
    const svg = svgRootRef.current;
    const node = svg?.querySelector(`#${CSS.escape(selectedId)}`);
    const title = node?.querySelector("title")?.textContent || 
                  node?.getAttribute("data-name") || 
                  node?.getAttribute("name") || 
                  node?.getAttribute("inkscape:label");
    return title || selectedId;
  }, [selectedId]);

  // Filter watch components by selected region
  const filteredComponents: PartsCatalog = useMemo(() => {
    if (!selectedId) {
      return {
        cases: [],
        dials: [],
        hands: [],
        straps: [],
      };
    }
    
    return {
      cases: WATCH_COMPONENTS.cases.filter(c => c.regions.includes(selectedId)),
      dials: WATCH_COMPONENTS.dials.filter(d => d.regions.includes(selectedId)),
      hands: WATCH_COMPONENTS.hands.filter(h => h.regions.includes(selectedId)),
      straps: WATCH_COMPONENTS.straps.filter(s => s.regions.includes(selectedId)),
    };
  }, [selectedId]);

  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-screen px-8 pt-28 pb-16 bg-neutral-950 text-neutral-200 font-[Poppins] tracking-wide overflow-hidden">
        <style>{`
          .selected-region {
            stroke: ${HIGHLIGHT_COLOR};
            stroke-width: 2.5;
            transition: all 0.3s ease;
          }
          [id^='FR-']:hover { 
            cursor: pointer; 
            fill: ${HIGHLIGHT_COLOR};
            opacity: 0.2;
            border-radius: 8px;
            border: 2px solid ${HIGHLIGHT_COLOR};
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
        `}</style>

        {/* Branding header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold text-neutral-100 tracking-widest">
            Montres-Bastille
          </h1>
          <p className="text-sm md:text-base text-bastilleGold uppercase tracking-[0.35em]">
            Les Régions de France
          </p>
          <p className="text-sm md:text-base text-neutral-300">
            Choisissez une région de France pour concevoir votre pièce du patrimoine
          </p>
        </div>

        {/* Map container */}
        <div
          ref={containerRef}
          className="relative flex items-center justify-center w-full max-w-5xl rounded-3xl
                     shadow-[0_0_35px_rgba(245,194,66,0.12)] 
                     bg-gradient-to-b from-neutral-100 to-primary-dark border border-primary-dark p-6"
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
      </div>

      {/* Modal with filtered components */}
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