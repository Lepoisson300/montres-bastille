import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Configurator from "../components/Configurator";
import type { PartOption, PartsCatalog } from "../types/Parts";


interface LocationState {
  selectedRegion?: string;
  regionName?: string;
  watchComponents?: PartOption;
}

export default function ConfiguratorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // Transform the watch components to match the PartsCatalog format
  const assets: PartsCatalog = {
    cases: state?.watchComponents?.cases || [],
    straps: state?.watchComponents?.straps || [],
    dials: state?.watchComponents?.dials || [],
    hands: state?.watchComponents?.hands || [],
  };

  const pricing = {
    base: 450,
    currency: "EUR"
  };

  const handleCheckout = (order: { sku: string; price: number; config: Record<string, string> }) => {
    console.log("Order placed:", order);
    // Add your checkout logic here
    // e.g., navigate to checkout page, send to API, etc.
  };

  const handleBackToMap = () => {
    navigate(-1); // Go back to previous page (the map)
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header with region info and back button */}
      {state?.regionName && (
        <div className=" border-b border-bastilleGold/20 sticky top-0 z-10 backdrop-blur-lg bg-neutral-900/95">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToMap}
                className="flex items-center gap-2 text-neutral-400 hover:text-bastilleGold transition group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">Retour à la carte</span>
              </button>
              
              <div className="flex items-center gap-3">
                <span className="text-neutral-400 text-sm hidden sm:block">Région sélectionnée:</span>
                <span className="px-4 py-2 bg-bastilleGold/10 border border-bastilleGold/30 rounded-full text-bastilleGold font-semibold text-sm">
                  {state.regionName}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Configurator Component */}
      <Configurator
        assets={assets}
        pricing={pricing}
        selectedRegion={state?.selectedRegion}
        onCheckout={handleCheckout}
      />
    </div>
  );
}