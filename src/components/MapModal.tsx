import React, { useMemo } from "react";
import { Link} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";


/**
 * Example watches per region code
 */
const WATCHES_BY_REGION: Record<string, { name: string; img?: string; ref?: string }[]> = {
  "FR-A": [
    { name: "Bastille Classique" },
    { name: "Haussmann Automatic" },
  ],
  "FR-B": [{ name: "Les Freirets" }],
  "FR-C": [{ name: "Strasbourg Édition" }],
};

interface MapModalProps {
  selectedId: string | null;
  onClose: () => void;
  svgRootRef?: React.RefObject<SVGSVGElement | null>;
  RegionName: string;
}

export default function MapModal({ selectedId, onClose, svgRootRef, RegionName }: MapModalProps) {
  const selectedName = useMemo(() => {
    if (!selectedId) return null;
    const explicit = RegionName;
    if (explicit && explicit !== "(à renseigner)") return explicit;
    // fallback: try reading from the SVG itself
    const svg = svgRootRef?.current;
    const node = svg?.querySelector(`#${CSS.escape(selectedId)}`);
    const title = 
      node?.querySelector("title")?.textContent || 
      node?.getAttribute("data-name") || 
      node?.getAttribute("name") || 
      node?.getAttribute("inkscape:label");
    return title || selectedId;
  }, [selectedId, svgRootRef]);

  const watches = useMemo(() => {
    if (!selectedId) return [] as { name: string; img?: string; ref?: string }[];
    return WATCHES_BY_REGION[selectedId] || [];
  }, [selectedId]);

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
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4 z-50"
          >
            <div className="bg-gray-50 rounded-2xl shadow-2xl p-5 max-h-[80vh] overflow-y-auto relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full transition-colors z-10"
                aria-label="Fermer"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {/* Content */}
              <AnimatePresence mode="wait">
                {selectedId ? (
                  <motion.div
                    key={selectedId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <h2 className="text-2xl font-semibold mb-4 pr-10">{selectedName}</h2>

                    {watches.length > 0 ? (
                      <ul className="grid grid-cols-1 gap-3">
                        {watches.map((w) => (
                          <li key={w.name} className="bg-white rounded-xl shadow-sm p-3">
                            <div className="font-medium">{w.name}</div>
                            <Link to="/configurator" className="flex items-center gap-2 group">
                                <span className="font-serif text-lg tracking-wide text-ivory">
                                Configurez selon cette région                                     
                                </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">
                        Aucune montre associée pour le moment.
                      </p>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>

             
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}