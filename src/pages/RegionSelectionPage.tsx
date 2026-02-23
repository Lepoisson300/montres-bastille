import { useLocation } from "react-router-dom";
import Configurator from "../components/Configurator";
import type { PartOption, PartsCatalog } from "../types/Parts";
import { useState } from "react";
import Nav from "../components/Nav";
import Alert from "../components/Alert";


interface LocationState {
  selectedRegion?: string;
  regionName?: string;
  watchComponents?: PartOption;
}

export default function ConfiguratorPage() {
  const location = useLocation();
  const state = location.state as LocationState;
  const [alert, setAlert] = useState<{type: string, message: string} | null>(null);
  const [cartList, setCartList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
    const assets: PartsCatalog = {
    mouvement: state?.watchComponents?.mouvement || [],
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
    // On crée d'abord la nouvelle liste dans une variable
    const updatedCart = [...cartList, order];
    // On met à jour l'état (pour l'affichage)
    setCartList(updatedCart);
    // On sauvegarde la variable updatedCart (qui contient bien le nouvel élément)
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log("Panier sauvegardé :", updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
    setAlert({ type: "success", message: "Montre ajouté au panier" });
  };
  return (
    <>
    <Nav bg={true}/>
      <div className="min-h-screen bg-neutral-950">

      {alert && (
          <Alert
            type={alert.type as "success" | "warning" | "error" | "info"}
            message={alert.message}
            duration={4000}
          />
        )}
        
      <Configurator
        assets={assets}
        pricing={pricing}
        selectedRegion={state?.selectedRegion}
        onCheckout={handleCheckout}
      />
    </div>
    </>
  );
}