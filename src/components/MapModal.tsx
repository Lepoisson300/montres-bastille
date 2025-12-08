import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { PartsCatalog } from "../types/Parts";
// 1. Import the new carousel
import RegionWatchesCarousel from "./RegionWatchCarousel"; 
import type { UserWatch } from "./RegionWatchCarousel";

// --- MOCK DATA FOR USER WATCHES ---
// You would usually fetch this from an API
const MOCK_USER_WATCHES: UserWatch[] = [
  { id: '1', name: 'L’Élégance Bretonne', creator: 'Arthur M.', regionId: 'FR-BRE', image: '/assets/watches/watch_bretagne.png' },
  { id: '2', name: 'Le Phare Ouest', creator: 'Marie L.', regionId: 'FR-BRE', image: '/assets/watches/watch_bretagne_2.png' },
  { id: '3', name: 'Azur Chrono', creator: 'Lucas P.', regionId: 'FR-PAC', image: '/assets/watches/watch_paca.png' },
  { id: '4', name: 'Riviera Gold', creator: 'Sophie D.', regionId: 'FR-PAC', image: '/assets/watches/watch_paca_2.png' },
  { id: '5', name: 'Alpiniste Acier', creator: 'Jean T.', regionId: 'FR-ARA', image: '/assets/watches/watch_rhone.png' },
  { id: '6', name: 'Esprit Volcan', creator: 'Clara B.', regionId: 'FR-ARA', image: '/assets/watches/watch_rhone_2.png' },
  // Add fallback/default images or more regions as needed
];

interface MapModalProps {
  selectedId: string | null;
  onClose: () => void;
  svgRootRef?: React.RefObject<SVGSVGElement | null>;
  RegionName: string;
  regions: { [key: string]: string };
  watchComponents: PartsCatalog;
}

export default function MapModal({ 
  selectedId, 
  onClose, 
  svgRootRef, 
  RegionName,
  watchComponents 
}: MapModalProps) {
  const navigate = useNavigate();

  // Get the display name of the region
  const selectedName = useMemo(() => {
    if (!selectedId) return null;
    return RegionName || selectedId;
  }, [selectedId, RegionName]);

  // 2. FILTER USER WATCHES BY REGION
  const regionWatches = useMemo(() => {
    if (!selectedId) return [];
    return MOCK_USER_WATCHES.filter(w => w.regionId === selectedId);
  }, [selectedId]);

  const handleConfigureClick = () => {
    navigate('/configurator', { 
      state: { 
        selectedRegion: selectedId,
        regionName: selectedName,
        watchComponents: watchComponents 
      } 
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {selectedId && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-4 z-50"
          >
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl shadow-2xl border border-bastilleGold/30 p-6 max-h-[85vh] overflow-y-auto relative">
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-bastilleGold/20 rounded-full transition-colors z-10"
                aria-label="Fermer"
              >
                <X size={24} className="text-bastilleGold" />
              </button>

              {/* Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-neutral-100"
                >
                  {/* Header */}
                  <div className="mb-6 pr-10 text-center sm:text-left">
                    <h2 className="text-3xl font-serif font-semibold text-bastilleGold mb-2">
                      {selectedName}
                    </h2>
                    <p className="text-neutral-300 text-sm">
                      Découvrez les créations de notre communauté
                    </p>
                  </div>

                  {/* 3. DISPLAY THE WATCHES CAROUSEL */}
                  <div className="mb-8">
                     <RegionWatchesCarousel watches={regionWatches} />
                  </div>

                  {/* Components Stats (Optional - kept for info) */}
                  <div className="grid grid-cols-4 gap-2 mb-6 border-t border-white/5 pt-6">
                    <div className="text-center">
                        <span className="block text-xl font-bold text-bastilleGold">{watchComponents?.cases?.length || 0}</span>
                        <span className="text-[10px] uppercase text-neutral-500">Boîtiers</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-xl font-bold text-bastilleGold">{watchComponents?.dials?.length || 0}</span>
                        <span className="text-[10px] uppercase text-neutral-500">Cadrans</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-xl font-bold text-bastilleGold">{watchComponents?.hands?.length || 0}</span>
                        <span className="text-[10px] uppercase text-neutral-500">Aiguilles</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-xl font-bold text-bastilleGold">{watchComponents?.straps?.length || 0}</span>
                        <span className="text-[10px] uppercase text-neutral-500">Bracelets</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleConfigureClick}
                    className="w-full flex items-center justify-center gap-2 group rounded-xl bg-surface p-4 hover:bg-surface-hover transition-all hover:shadow-lg hover:shadow-surface-hover mt-6"
                  >
                    <span className="font-serif text-lg tracking-wide text-primary font-semibold">
                      Configurer ma montre
                    </span>
                  </button>

                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}