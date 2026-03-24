import { Navigate, useLocation } from "react-router-dom";
import Configurator from "../components/Configurator";
import type { CartItem, PartOption, PartsCatalog } from "../types/Parts";
import { useState } from "react";
import Nav from "../components/Nav";
import Alert from "../components/Alert";

interface LocationState {
  selectedRegion?: string;
  regionName?: string;
  watchComponents?: PartOption[];
}

export default function ConfiguratorPage() {
  const location = useLocation();
  const state = location.state as LocationState;
  const [alert, setAlert] = useState<{type: string, message: string} | null>(null);

  if (!state || !state.watchComponents) {
    return <Navigate to="/region-page" replace />;
  }
  
  const [cartList, setCartList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
    const assets: PartsCatalog = {
      mouvement: state.watchComponents?.filter((part) => part.type === 'mouvement'),
      cases:     state.watchComponents?.filter((part) => part.type === 'case' || part.type === 'boitier'),
      straps:    state.watchComponents?.filter((part) => part.type === 'strap' || part.type === 'bracelet'),
      dials:     state.watchComponents?.filter((part) => part.type === 'dial' || part.type === 'cadran'),
      hands:     state.watchComponents?.filter((part) => part.type === 'hands' || part.type === 'aiguilles'),
  };

  const pricing = {
    base: 0,
    currency: "EUR"
  };

  const handleCheckout = (order: { sku: string; price: number; config: PartOption[] }) => {
    // Build a CartItem with the resolved PartOption array
    const cartItem: CartItem = {
      id: order.sku,
      price: order.price,
      composants: order.config,
    };
    const updatedCart = [...cartList, cartItem];
    setCartList(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log("Panier sauvegardé :", updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
    setAlert({ type: "success", message: "Montre ajoutée au panier" });
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