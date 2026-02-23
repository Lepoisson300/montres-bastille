import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert"; 
import type { PartOption } from "../types/Parts";
import Nav from "../components/Nav";

// --- TYPES ---
interface CartItem {
  config: Record<string, string>;
  price: number;
  id?: string; 
  name?: string; 
}

interface CartPageProps {
  updateCartCount?: (count: number) => void;
  assets: PartOption[]; 
}

export default function CartPage({ updateCartCount }: CartPageProps) {
  
  // 1. STATE
  const [cartWatches, setCartWatches] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Erreur lecture localStorage:", e);
      return [];
    }
  });
  
  const [selectedWatchIndex, setSelectedWatchIndex] = useState<number>(0);
  const [alert, setAlert] = useState<{type: string, message: string} | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Sécurisation de la lecture des assets depuis le localStorage
  const assets = JSON.parse(localStorage.getItem("composants") || "[]");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartWatches));
    if (updateCartCount && typeof updateCartCount === 'function') {
      updateCartCount(cartWatches.length);
    }
  }, [cartWatches, updateCartCount]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.scrollTo(0, 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- LOGIQUE ---

  const selectedWatch = cartWatches[selectedWatchIndex];
  const grandTotal = cartWatches.reduce((acc, watch) => acc + watch.price, 0);

  const getPartDetails = (partId: string): PartOption | undefined => {
    return assets.find((p: PartOption) => p.id === partId);
  };

  const removeWatch = (indexToRemove: number) => {
    const updatedCart = cartWatches.filter((_, index) => index !== indexToRemove);
    setCartWatches(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    window.dispatchEvent(new Event('cartRemoved'));
    if (selectedWatchIndex >= updatedCart.length) {
      setSelectedWatchIndex(Math.max(0, updatedCart.length - 1));
    }
  };

  const clearCart = () => {
    setCartWatches([]);
    setSelectedWatchIndex(0);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartRemoved'));
    setAlert({ type: "success", message: "Le panier a été vidé." });
  };

  const removePartFromSelected = (categoryKey: string, partId: string) => {
    if (!selectedWatch) return;

    const newCart = [...cartWatches];
    const newConfig = { ...newCart[selectedWatchIndex].config };
    
    delete newConfig[categoryKey];

    const partDetails = getPartDetails(partId);
    const priceDeduction = partDetails ? partDetails.price : 0;
    const newPrice = newCart[selectedWatchIndex].price - priceDeduction;

    newCart[selectedWatchIndex] = {
      ...newCart[selectedWatchIndex],
      config: newConfig,
      price: newPrice
    };

    setCartWatches(newCart);
    setAlert({ type: "warning", message: "Pièce retirée de la configuration." });
  };

  const handleCheckout = () => {
    if (cartWatches.length === 0) return;
    setIsRedirecting(true);
    setTimeout(() => {
      console.log("Commande envoyée :", cartWatches);
      setIsRedirecting(false);
      window.alert("Redirection vers le paiement...");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans pt-24 pb-12">
      <Nav bg={false}/>

      {/* ALERTE */}
      {alert && (
        <Alert
          type={alert.type as "success" | "warning" | "error" | "info"}
          message={alert.message}
          duration={4000}
        />
      )}

      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex justify-between items-end mb-12">
          <h1 className="font-serif text-3xl md:text-5xl">
            Votre <span className="text-primary">Panier</span> ({cartWatches.length})
          </h1>
          
          {cartWatches.length > 0 && (
            <button 
              onClick={clearCart}
              className="text-xs text-red-400 border border-red-500/30 px-3 py-1 rounded hover:bg-red-500/10 transition"
            >
              Vider le panier
            </button>
          )}
        </div>

        {cartWatches.length === 0 ? (
           <div className="text-center py-20 bg-surface rounded-3xl border border-border/10">
             <p className="text-xl text-text-muted mb-4">Votre panier est vide.</p>
             <Link to="/region-page" className="text-primary underline hover:text-white transition">
                Créer une montre
             </Link>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LISTE DES MONTRES (Zone Gauche) */}
            <div className="lg:col-span-7 flex flex-col gap-8 sticky top-32">
              
              {/* Le slider fonctionnera maintenant car la box de la montre ne le chevauche plus */}
              {cartWatches.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x relative z-50">
                  {cartWatches.map((watch, index) => {
                    const isSelected = selectedWatchIndex === index;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedWatchIndex(index)}
                        className={`shrink-0 snap-start w-64 p-4 rounded-xl border transition-all text-left group
                          ${isSelected
                            ? "bg-surface border-primary shadow-lg ring-1 ring-primary/20" 
                            : "bg-background border-border/20 opacity-70 hover:opacity-100 hover:border-primary/50"
                          }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">Config</span>
                          <div 
                            onClick={(e) => { e.stopPropagation(); removeWatch(index); }}
                            className="text-text-muted hover:text-red-500 p-1 rounded-full hover:bg-red-500/10 transition"
                          >
                            ×
                          </div>
                        </div>
                        <p className="font-serif truncate text-lg">Montre #{index + 1}</p>
                        <p className="text-sm text-text-muted">{watch.price} €</p>
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedWatch && (
                <div className={`relative overflow-hidden rounded-3xl z-40 bg-surface border border-primary/20 shadow-2xl group transition-all duration-500 ease-in-out aspect-square ${
                    scrolled ? "p-4" : "p-8"
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
                  
                  {/* AJOUT : Superposition des pièces dans le BON ORDRE pour éviter qu'elles ne se cachent */}
                  <div className="relative z-10 flex items-center justify-center h-full w-full">
                    {/* On map sur un tableau fixe pour garantir que les aiguilles soient au-dessus du cadran, etc. */}
                    {["straps", "cases", "dials", "hands"].map((category) => {
                      // On récupère l'ID de la pièce pour cette catégorie dans la config de la montre
                      const partId = selectedWatch.config[category];
                      if (!partId) return null;
                      
                      // On va chercher l'image correspondante
                      const part = getPartDetails(partId);
                      if (!part?.thumbnail) return null;
                      
                      return (
                        <img 
                          key={partId}
                          src={part.thumbnail} 
                          alt={part.name || category} 
                          className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 scale-175" 
                        />
                      );
                    })}
                  </div>

                  <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                    <p className="text-text-muted text-sm uppercase tracking-widest font-sans">Sélection actuelle</p>
                    <p className="text-primary font-serif text-xl">Montre #{selectedWatchIndex + 1}</p>
                  </div>
                </div>
              )}
            </div>

            {/* DÉTAILS (Zone Droite) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {selectedWatch && (
                <div className="bg-surface rounded-2xl border border-border/10 p-6 shadow-lg relative z-40">
                  {(() => {
                    const configEntries = Object.entries(selectedWatch.config);
                    
                    return (
                      <>
                        <h2 className="font-serif text-xl mb-4 flex justify-between items-center">
                          <span>Composants</span>
                          <span className="text-sm font-sans text-text-muted font-normal">
                            {configEntries.length} pièces
                          </span>
                        </h2>
                        
                        <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {configEntries.map(([categoryKey, partId], idx) => {
                            const partDetails = getPartDetails(partId as string);
                            if (!partDetails) return null; 

                            return (
                              <li key={`${partId}-${idx}`} className="flex items-center gap-3 bg-background/50 p-2 rounded-lg border border-transparent hover:border-primary/20 transition-colors group">
                                <div className="h-16 w-16 rounded bg-surface-hover flex-shrink-0 overflow-hidden flex items-center justify-center border border-border/10">
                                  {partDetails.thumbnail ? (
                                    <img src={partDetails.thumbnail} alt={partDetails.name} className="h-full scale-[2] w-full object-cover" />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full bg-primary/20" />
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] text-text-subtle uppercase tracking-wider">{partDetails.type || categoryKey}</p>
                                  <p className="text-sm font-medium text-text-primary truncate">{partDetails.name}</p>
                                </div>
                                
                                <div className="text-right">
                                  <p className="text-primary text-xs font-serif">{partDetails.price} €</p>
                                  <button
                                    onClick={() => removePartFromSelected(categoryKey, partId as string)}
                                    className="text-[10px] text-red-400 opacity-0 group-hover:opacity-100 hover:underline"
                                  >
                                    Retirer
                                  </button>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* TOTAL & PAYER */}
              <div className="bg-dark text-text-primary rounded-2xl p-8 border border-primary/30 shadow-[0_10px_40px_rgba(0,0,0,0.3)] sticky top-32 z-40">
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                  <span className="text-text-muted font-sans text-sm">Total à payer</span>
                  <span className="font-serif text-3xl md:text-4xl text-primary">{grandTotal} €</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isRedirecting}
                  className="w-full mt-6 py-4 px-6 rounded-full text-sm uppercase tracking-[0.2em] font-bold bg-primary text-dark hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-3"
                >
                  {isRedirecting ? "Chargement..." : "Payer la commande"}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}