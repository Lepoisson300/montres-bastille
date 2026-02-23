import { useLocation } from "react-router-dom";
import Configurator from "../components/Configurator";
import type { PartOption, PartsCatalog } from "../types/Parts";
import { useState } from "react";
import Nav from "../components/Nav";


interface LocationState {
  selectedRegion?: string;
  regionName?: string;
  watchComponents?: PartOption;
}

export default function ConfiguratorPage() {
  const location = useLocation();
  const state = location.state as LocationState;
  const [cartList, setCartList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
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
    // On crée d'abord la nouvelle liste dans une variable
    const updatedCart = [...cartList, order];
    // On met à jour l'état (pour l'affichage)
    setCartList(updatedCart);
    // On sauvegarde la variable updatedCart (qui contient bien le nouvel élément)
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log("Panier sauvegardé :", updatedCart);
    alert("Ajouté au panier !");
  };
  return (
    <>
        <Nav bg={false}/>
    <div className="min-h-screen bg-neutral-950">
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