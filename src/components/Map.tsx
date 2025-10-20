import React, { useEffect, useMemo, useRef, useState } from "react";
import MapModal from "./MapModal"; // Import the modal

/**
 * Official region names mapping (fill these using your SVG's labels).
 * Your SVG uses IDs like FR-A, FR-B, ... FR-T. We keep those IDs exactly.
 * We'll try to auto-detect titles on mount and log a console helper table
 * so you can copy/paste the correct names here.
 */
const REGION_NAMES: Record<string, string> = {
  // Example placeholders — update with your official names
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




/**
 * Example watches per region code. Replace with your real models/images.
 * Keyed by FR-* code for reliability.
 */
const WATCHES_BY_REGION: Record<string, { name: string; img?: string; ref?: string }[]> = {
  "FR-A": [
    { name: "Bastille Classique" },
    { name: "Haussmann Automatic" },
  ],
  "FR-B": [{ name: "Les Freirets" }],
  "FR-C": [{ name: "Strasbourg Édition" }],
  // ... add others as needed
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
  }, [svgContent]); // Re-run when SVG content loads

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
    // Helpful console table so you can copy names into REGION_NAMES
    // eslint-disable-next-line no-console
    console.table(helper);
  }, [svgContent]); // Re-run when SVG content loads

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
    const title = node?.querySelector("title")?.textContent || node?.getAttribute("data-name") || node?.getAttribute("name") || node?.getAttribute("inkscape:label");
    return title || selectedId;
  }, [selectedId]);

  const watches = useMemo(() => {
    if (!selectedId) return [] as { name: string; img?: string; ref?: string }[];
    return WATCHES_BY_REGION[selectedId] || [];
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

    {/* Modal */}
    <MapModal
      selectedId={selectedId}
      onClose={() => setSelectedId(null)}
      svgRootRef={svgRootRef}
      RegionName={selectedName || ""}
    />
  </>
);
}