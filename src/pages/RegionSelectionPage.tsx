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
  };
  
  return (
    <div className="min-h-screen bg-neutral-950">
      <Configurator
        assets={assets}
        pricing={pricing}
        selectedRegion={state?.selectedRegion}
        onCheckout={handleCheckout}
      />
    </div>
  );
}