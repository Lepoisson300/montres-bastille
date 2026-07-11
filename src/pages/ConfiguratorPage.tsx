import { Navigate, Route, useLocation } from "react-router-dom";
import Configurator from "../components/Configurator";
import type { CartItem, PartOption, PartsCatalog } from "../types/Parts";
import { useState } from "react";
import Nav from "../components/Nav";
import { useAlert } from "../Logic/AlertContext";
import ModalWatchName from "../Modals/ModalWatchName";


interface LocationState {
  selectedRegion?: string;
  regionName?: string;
  watchComponents?: PartOption[];
}

export default function ConfiguratorPage() {
  const location = useLocation();
  const state = location.state as LocationState;
  const { showAlert } = useAlert();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [order, setOrder] = useState()

  // 2. On redirige si l'état est manquant OU si c'est un rechargement
  if (!state?.watchComponents || !(window as any).isValidNavigation) {
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
      hands:     state.watchComponents?.filter((part) => part.type === 'hand' || part.type === 'aiguilles'),
  };

  const pricing = {
    base: 0,
    currency: "EUR"
  };

  const handleCheckout = (order: { sku: string; price: number; config: PartOption[]; name:string }) => {
    // Build a CartItem with the resolved PartOption array
    setOrder(order)
    setIsModalOpen(true); 

  };

  const checkout = (finalOrder: { sku: string; price: number; config: PartOption[]; name: string }) => {
      
      const cartItem: CartItem = {
        id: finalOrder.sku,
        name: finalOrder.name,
        price: finalOrder.price,
        composants: finalOrder.config,
      };

      setIsModalOpen(false); 
      setOrder(undefined);

      const updatedCart = [...cartList, cartItem];
      setCartList(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      console.log("Panier sauvegardé :", updatedCart);
      window.dispatchEvent(new Event('cartUpdated'));
      showAlert("success", `La montre "${finalOrder.name}" a été ajoutée au panier`); // Petit bonus pour le message !
    };


  return (
    <>
    <Nav bg={true}/>
      <div className="min-h-screen bg-neutral-950">
        <ModalWatchName 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            order = {order}
            onSubmit={checkout} 
        />
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
