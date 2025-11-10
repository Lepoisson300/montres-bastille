import { useEffect, useMemo, useRef, useState } from "react";
import MapModal from "./MapModal"; // Import the modal
import type { PartsCatalog } from "../types/Parts";




  // Filter watch components by selected region
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