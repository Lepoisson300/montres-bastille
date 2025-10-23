import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Watch } from "lucide-react";

interface WatchComponent {
  id: string;
  name: string;
  price: number;
  regions: string[];
  [key: string]: any; // For additional properties like material, size, etc.
}

interface FilteredComponents {
  cases: WatchComponent[];
  dials: WatchComponent[];
  hands: WatchComponent[];
  straps: WatchComponent[];
}

interface MapModalProps {
  selectedId: string | null;
  onClose: () => void;
  svgRootRef?: React.RefObject<SVGSVGElement | null>;
  RegionName: string;
  regions: { [key: string]: string };
  watchComponents?: FilteredComponents | null;
}

export default function MapModal({ 
  selectedId, 
  onClose, 
  svgRootRef, 
  RegionName,
  watchComponents 
}: MapModalProps) {
  const navigate = useNavigate();

  const selectedName = useMemo(() => {
    if (!selectedId) return null;
    const explicit = RegionName;
    if (explicit) return explicit;
    // fallback: try reading from the SVG itself
    const svg = svgRootRef?.current;
    const node = svg?.querySelector(`#${CSS.escape(selectedId)}`);
    const title = 
      node?.querySelector("title")?.textContent || 
      node?.getAttribute("data-name") || 
      node?.getAttribute("name") || 
      node?.getAttribute("inkscape:label");
    return title || selectedId;
  }, [selectedId, svgRootRef, RegionName]);

  // Calculate total available components
  const totalComponents = useMemo(() => {
    if (!watchComponents) return 0;
    return (
      watchComponents.cases.length +
      watchComponents.dials.length +
      watchComponents.hands.length +
      watchComponents.straps.length
    );
  }, [watchComponents]);

  // Check if any components are available
  const hasComponents = totalComponents > 0;

  const handleConfigureClick = () => {
    // Navigate to configurator with region and components data
    navigate('/configurator', { 
      state: { 
        selectedRegion: selectedId,
        regionName: selectedName,
        watchComponents: watchComponents 
      } 
    });
    onClose(); // Close the modal after navigation
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
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-bastilleGold/20 rounded-full transition-colors z-10"
                aria-label="Fermer"
              >
                <X size={24} className="text-bastilleGold" />
              </button>

              {/* Content */}
              <AnimatePresence mode="wait">
                {selectedId ? (
                  <motion.div
                    key={selectedId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-neutral-100"
                  >
                    {/* Header */}
                    <div className="mb-6 pr-10">
                      <h2 className="text-3xl font-serif font-semibold text-bastilleGold mb-2">
                        {selectedName}
                      </h2>
                      <p className="text-neutral-300 text-sm">
                        Composants disponibles pour cette région
                      </p>
                    </div>

                    {hasComponents && watchComponents ? (
                      <div className="space-y-6">
                        {/* Components Summary */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                          <div className="bg-neutral-800/50 rounded-lg p-3 border border-bastilleGold/20">
                            <div className="text-2xl font-bold text-bastilleGold">
                              {watchComponents.cases.length}
                            </div>
                            <div className="text-xs text-neutral-400 uppercase tracking-wider">
                              Boîtiers
                            </div>
                          </div>
                          <div className="bg-neutral-800/50 rounded-lg p-3 border border-bastilleGold/20">
                            <div className="text-2xl font-bold text-bastilleGold">
                              {watchComponents.dials.length}
                            </div>
                            <div className="text-xs text-neutral-400 uppercase tracking-wider">
                              Cadrans
                            </div>
                          </div>
                          <div className="bg-neutral-800/50 rounded-lg p-3 border border-bastilleGold/20">
                            <div className="text-2xl font-bold text-bastilleGold">
                              {watchComponents.hands.length}
                            </div>
                            <div className="text-xs text-neutral-400 uppercase tracking-wider">
                              Aiguilles
                            </div>
                          </div>
                          <div className="bg-neutral-800/50 rounded-lg p-3 border border-bastilleGold/20">
                            <div className="text-2xl font-bold text-bastilleGold">
                              {watchComponents.straps.length}
                            </div>
                            <div className="text-xs text-neutral-400 uppercase tracking-wider">
                              Bracelets
                            </div>
                          </div>
                        </div>

                        {/* Component Details */}
                        <div className="space-y-4">
                          {/* Cases */}
                          {watchComponents.cases.length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold text-bastilleGold mb-3">
                                Boîtiers ({watchComponents.cases.length})
                              </h3>
                              <div className="grid gap-2">
                                {watchComponents.cases.map((component) => (
                                  <div
                                    key={component.id}
                                    className="bg-neutral-800/30 rounded-lg p-3 border border-neutral-700 hover:border-bastilleGold/40 transition"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="font-medium text-neutral-100">
                                          {component.name}
                                        </div>
                                        <div className="text-sm text-neutral-400 mt-1">
                                          {component.material} • {component.size}
                                        </div>
                                      </div>
                                      <div className="text-bastilleGold font-semibold">
                                        {component.price.toLocaleString()}€
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Dials */}
                          {watchComponents.dials.length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold text-bastilleGold mb-3">
                                Cadrans ({watchComponents.dials.length})
                              </h3>
                              <div className="grid gap-2">
                                {watchComponents.dials.map((component) => (
                                  <div
                                    key={component.id}
                                    className="bg-neutral-800/30 rounded-lg p-3 border border-neutral-700 hover:border-bastilleGold/40 transition"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="font-medium text-neutral-100">
                                          {component.name}
                                        </div>
                                        <div className="text-sm text-neutral-400 mt-1">
                                          {component.finish} • {component.markers}
                                        </div>
                                      </div>
                                      <div className="text-bastilleGold font-semibold">
                                        {component.price.toLocaleString()}€
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Hands */}
                          {watchComponents.hands.length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold text-bastilleGold mb-3">
                                Aiguilles ({watchComponents.hands.length})
                              </h3>
                              <div className="grid gap-2">
                                {watchComponents.hands.map((component) => (
                                  <div
                                    key={component.id}
                                    className="bg-neutral-800/30 rounded-lg p-3 border border-neutral-700 hover:border-bastilleGold/40 transition"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="font-medium text-neutral-100">
                                          {component.name}
                                        </div>
                                        <div className="text-sm text-neutral-400 mt-1">
                                          {component.style} • {component.luminous ? 'Lumineux' : 'Non lumineux'}
                                        </div>
                                      </div>
                                      <div className="text-bastilleGold font-semibold">
                                        {component.price.toLocaleString()}€
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Straps */}
                          {watchComponents.straps.length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold text-bastilleGold mb-3">
                                Bracelets ({watchComponents.straps.length})
                              </h3>
                              <div className="grid gap-2">
                                {watchComponents.straps.map((component) => (
                                  <div
                                    key={component.id}
                                    className="bg-neutral-800/30 rounded-lg p-3 border border-neutral-700 hover:border-bastilleGold/40 transition"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="font-medium text-neutral-100">
                                          {component.name}
                                        </div>
                                        <div className="text-sm text-neutral-400 mt-1">
                                          {component.color} • {component.clasp}
                                        </div>
                                      </div>
                                      <div className="text-bastilleGold font-semibold">
                                        {component.price.toLocaleString()}€
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
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
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-800 mb-4">
                          <Watch className="w-8 h-8 text-neutral-500" />
                        </div>
                        <p className="text-neutral-400 italic text-lg">
                          Aucun composant disponible pour cette région
                        </p>
                        <p className="text-neutral-500 text-sm mt-2">
                          Veuillez sélectionner une autre région
                        </p>
                      </div>
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