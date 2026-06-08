import { useState } from "react";
// Make sure this path points to wherever you saved the big array!
import { REGION_DATA } from "../Logic/watchComponents"; 

interface Props {
  availableRegions: string[];
  onSelect: (id: string) => void;
}

export const DesktopMap = ({ availableRegions, onSelect }: Props) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Sort the array so the hovered region is ALWAYS rendered last.
  // This physically places it on top of the other paths, preventing overlap bugs.
  const sortedRegions = [...REGION_DATA].sort((a, b) => {
    if (a.id === hoveredRegion) return 1;
    if (b.id === hoveredRegion) return -1;
    return 0;
  });

  return (
    <div className="relative w-full min-h-[70vh] flex items-center justify-center perspective-[2000px] bg-transparent">
      
      {/* Holographic Tooltip */}
      {hoveredRegion && (
        <div
          className="absolute z-30 top-1/4 right-10 md:right-32 p-6 rounded-xl border border-[#d4af37]/30 bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.15)] pointer-events-none transition-all duration-200 transform translate-y-0 opacity-100"
          style={{ animation: 'fade-in-up 0.5s ease-out forwards' }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/10 to-transparent rounded-xl"></div>
          
          {/* CORRECTED: Using .find() to get the name from the array */}
          <h3 className="relative z-10 text-xl font-serif text-[#f5d47a] mb-2 tracking-wide drop-shadow-md">
            {REGION_DATA.find((r) => r.id === hoveredRegion)?.name || hoveredRegion}
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

      {/* 3D Map Container */}
      <div 
        className="relative z-10 w-full max-w-4xl h-full flex items-center justify-center transform-style-3d"
        style={{ transform: 'rotateX(55deg) rotateZ(-30deg) scale(1.2)' }}
      >
        <svg 
          viewBox="0 0 596.4 584.5" 
          className="w-full h-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.9)] overflow-visible"
        >
          {sortedRegions.map((region) => {
            const isAvailable = availableRegions.includes(region.id);
            const isHovered = hoveredRegion === region.id;

            return (
              <RegionPath
                key={region.id}
                id={region.id}
                pathData={region.path}
                isAvailable={isAvailable}
                isHovered={isHovered}
                onMouseEnter={() => isAvailable && setHoveredRegion(region.id)}
                onMouseLeave={() => isAvailable && setHoveredRegion(null)}
                onClick={() => isAvailable && onSelect(region.id)}
              />
            );
          })}
        </svg>
      </div>
      
      {/* Shadow Layer */}
      <div className="absolute top-1/2 left-1/2 w-[80%] max-w-3xl h-[60%] bg-black/60 blur-[60px] rounded-[100%] pointer-events-none" style={{ transform: 'translate(-50%, -30%) rotateX(55deg) rotateZ(-30deg)' }} />

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

// --- THE CHILD COMPONENT ---
interface RegionProps {
  id: string;
  pathData: string;
  isAvailable: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const RegionPath = ({ id, pathData, isAvailable, isHovered, onMouseEnter, onMouseLeave, onClick }: RegionProps) => {
  if (!isAvailable) {
    // Unavailable State (Semi-transparent, no interaction)
    return (
      <path
        id={id}
        d={pathData}
        fill="#1c1d21"
        stroke="#4a4a4a"
        strokeWidth="1"
        className="opacity-40 pointer-events-none"
      />
    );
  }

  // Tailwind handles the animation, colors, and transforms natively now
  return (
    <path
      id={id}
      d={pathData}
      // Base styles for available regions
      fill={isHovered ? "#2c2a25" : "#1c1d21"}
      stroke={isHovered ? "#f5d47a" : "#bda041"}
      strokeWidth={isHovered ? "2" : "1.2"}
      
      // Tailwind classes handle the smooth pop-up
      className={`
        cursor-pointer 
        transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] origin-center
        ${isHovered 
          ? "translate-x-[15px] -translate-y-[25px] drop-shadow-[15px_25px_15px_rgba(189,160,65,0.35)]" 
          : "translate-x-0 translate-y-0 drop-shadow-[4px_8px_6px_rgba(0,0,0,0.8)]"
        }
      `}
      
      // React synthetic events 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    />
  );
};