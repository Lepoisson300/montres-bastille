import { useEffect, useMemo, useRef, useState } from "react";
import MapModal from "./MapModal"; // Import the modal

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
    { id: 'c1', name: 'Classic Round', material: 'Stainless Steel', size: '40mm', regions: ['FR-E', 'FR-A', 'FR-U'], price: 2500 },
    { id: 'c2', name: 'Sport Chronograph', material: 'Titanium', size: '42mm', regions: ['FR-E', 'FR-A', 'FR-U'], price: 3200 },
    { id: 'c3', name: 'Dress Slim', material: '18K Gold', size: '38mm', regions: ['FR-A', 'FR-U'], price: 8500 },
    { id: 'c4', name: 'Diver Pro', material: 'Ceramic', size: '44mm', regions: ['FR-E', 'FR-U'], price: 4100 },
    { id: 'c5', name: 'Heritage Square', material: 'Rose Gold', size: '41mm', regions: ['FR-A'], price: 9200 },
  ],
  dials: [
    { id: 'd1', name: 'Sunburst Blue', finish: 'Lacquer', markers: 'Roman', regions: ['FR-E', 'FR-A', 'FR-U'], price: 800 },
    { id: 'd2', name: 'Black Carbon', finish: 'Carbon Fiber', markers: 'Index', regions: ['FR-E', 'FR-U'], price: 1200 },
    { id: 'd3', name: 'Champagne Guilloché', finish: 'Hand-engraved', markers: 'Roman', regions: ['FR-A'], price: 2500 },
    { id: 'd4', name: 'Silver Opaline', finish: 'Brushed', markers: 'Baton', regions: ['FR-E', 'FR-A', 'FR-U'], price: 900 },
    { id: 'd5', name: 'Meteorite', finish: 'Natural Stone', markers: 'Diamond', regions: ['FR-A', 'FR-U'], price: 5500 },
  ],
  hands: [
    { id: 'h1', name: 'Dauphine', style: 'Classic', luminous: true, regions: ['FR-E', 'FR-A', 'FR-U'], price: 200 },
    { id: 'h2', name: 'Sword', style: 'Vintage', luminous: true, regions: ['FR-A', 'FR-U'], price: 250 },
    { id: 'h3', name: 'Baton', style: 'Modern', luminous: false, regions: ['FR-E', 'FR-A', 'FR-U'], price: 180 },
    { id: 'h4', name: 'Alpha', style: 'Sport', luminous: true, regions: ['FR-E', 'FR-U'], price: 220 },
  ],
  straps: [
    { id: 's1', name: 'Alligator Leather', color: 'Black', clasp: 'Deployant', regions: ['FR-E', 'FR-A', 'FR-U'], price: 600 },
    { id: 's2', name: 'Steel Bracelet', color: 'Silver', clasp: 'Folding', regions: ['FR-E', 'FR-A', 'FR-U'], price: 800 },
    { id: 's3', name: 'Rubber Sport', color: 'Blue', clasp: 'Tang', regions: ['FR-E', 'FR-U'], price: 350 },
    { id: 's4', name: 'Gold Bracelet', color: 'Gold', clasp: 'Folding', regions: ['FR-A'], price: 3500 },
    { id: 's5', name: 'Ostrich Leather', color: 'Brown', clasp: 'Pin', regions: ['FR-A'], price: 950 },
  ],
};

export default function FranceMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRootRef = useRef<SVGSVGElement | null>(null);

  // Gold highlight style (Montres‑Bastille aesthetic)
  const HIGHLIGHT_COLOR = "#f5c242"; // rich gold

  // Load SVG content on mount
  useEffect(() => {
    fetch("/src/assets/france.svg")
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
  const filteredComponents = useMemo(() => {
    if (!selectedId) return null;
    
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
            filter: drop-shadow(0 0 6px rgba(245,194,66,0.6));
            transition: all 0.3s ease;
          }
          [id^='FR-']:hover { cursor: pointer; opacity: 0.9; }
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