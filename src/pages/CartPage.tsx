import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert"; 

// On définit le type des props pour TypeScript
interface CartPageProps {
  // Le "?" rend la fonction optionnelle : si elle n'est pas passée, pas d'erreur.
  updateCartCount?: (count: number) => void; 
}

export default function CartPage({ updateCartCount }: CartPageProps) {
  // 1. STATE : Initialisation via LocalStorage
  const [cartWatches, setCartWatches] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Erreur lecture localStorage:", e);
      return [];
    }
  });
  
  const [selectedWatchId, setSelectedWatchId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{type: string, message: string} | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 2. EFFECT : Gestion de la sélection par défaut
  useEffect(() => {
    if (cartWatches.length > 0 && !selectedWatchId) {
      // On sécurise l'accès à l'ID
      const firstId = cartWatches[0].id || cartWatches[0].cartId;
      if (firstId) setSelectedWatchId(firstId);
    }
  }, [cartWatches, selectedWatchId]);

  // 3. EFFECT : Sauvegarde et Mise à jour du compteur (CORRIGÉ)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartWatches));
    
    // CORRECTION ICI : On vérifie que la fonction existe avant de l'appeler
    if (updateCartCount && typeof updateCartCount === 'function') {
      updateCartCount(cartWatches.length);
    }
  }, [cartWatches, updateCartCount]);

  // Récupérer la montre sélectionnée
  const selectedWatch = cartWatches.find(w => (w.id === selectedWatchId || w.cartId === selectedWatchId)) || cartWatches[0];

  // Calcul du prix
  const getWatchPrice = (watch: any) => {
    const parts = watch.parts || watch.components || []; 
    const partsPrice = parts.reduce((acc: number, part: any) => acc + (part.price || 0), 0);
    return (watch.basePrice || 0) + partsPrice;
  };

  const grandTotal = cartWatches.reduce((acc, watch) => acc + getWatchPrice(watch), 0);

  const removeWatch = (targetId: string) => {
    const updatedCart = cartWatches.filter(w => {
        const wId = w.id || w.cartId;
        return wId !== targetId;
    });
    setCartWatches(updatedCart);
    
    if (selectedWatchId === targetId) {
       setSelectedWatchId(null); // On reset, le useEffect du haut remettra le 1er dispo
    }
  };

  const clearCart = () => {
    setCartWatches([]);
    setSelectedWatchId(null);
    setAlert({ type: "success", message: "Le panier a été vidé." });
  };

  const removePartFromSelected = (partId: string, type: string) => {
    if (!selectedWatch) return;

    const updatedWatches = cartWatches.map(watch => {
      const wId = watch.id || watch.cartId;
      if (wId === selectedWatchId) {
        const currentParts = watch.parts || watch.components || [];
        const filteredParts = currentParts.filter((p: any) => p.id !== partId);
        
        return {
          ...watch,
          parts: filteredParts,      
          components: filteredParts, 
        };
      }
      return watch;
    });

    setCartWatches(updatedWatches);
    setAlert({ type: "warning", message: `Pièce "${type}" retirée.` });
  };

  const handleCheckout = () => {
    if (cartWatches.length === 0) return;
    setIsRedirecting(true);
    setTimeout(() => {
      console.log("Commande envoyée :", cartWatches);
      setIsRedirecting(false);
      window.alert("Redirection vers le paiement..."); // Utilisation de window.alert pour éviter conflit de nom
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans pt-24 pb-12">
      {/* ALERTE */}
      {alert && (
        <Alert
          type={alert.type as "success" | "warning" | "error" | "info"}
          message={alert.message}
          onClose={() => setAlert(null)}
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
             <Link to="/configurator" className="text-primary underline hover:text-white transition">
                Créer une montre
             </Link>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LISTE DES MONTRES */}
            <div className="lg:col-span-7 flex flex-col gap-8 sticky top-32">
              
              {cartWatches.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                  {cartWatches.map((watch, index) => {
                    // CORRECTION CLÉ UNIQUE : On utilise cartId, sinon id, sinon l'index
                    const wId = watch.cartId || watch.id || `fallback-${index}`;
                    const isSelected = selectedWatchId === wId;
                    
                    return (
                      <button
                        key={wId} // Utilisation de la clé sécurisée
                        onClick={() => setSelectedWatchId(wId)}
                        className={`flex-shrink-0 snap-start w-64 p-4 rounded-xl border transition-all text-left relative group
                          ${isSelected
                            ? "bg-surface border-primary shadow-lg ring-1 ring-primary/20" 
                            : "bg-background border-border/20 opacity-70 hover:opacity-100 hover:border-primary/50"
                          }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">Config</span>
                          <div 
                            onClick={(e) => { e.stopPropagation(); removeWatch(wId); }}
                            className="text-text-muted hover:text-red-500 p-1 rounded-full hover:bg-red-500/10 transition"
                          >
                            ×
                          </div>
                        </div>
                        <p className="font-serif truncate text-lg">{watch.name || `Montre #${index + 1}`}</p>
                        <p className="text-sm text-text-muted">{getWatchPrice(watch)} €</p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* VISUALISATION */}
              {selectedWatch && (
                <div className="relative rounded-3xl bg-surface border border-primary/20 p-8 shadow-2xl overflow-hidden group min-h-[400px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <img 
                      src={selectedWatch.image || "/Gurv.png"} 
                      alt="Montre" 
                      className="max-h-[350px] w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-105" 
                    />
                  </div>
                  <div className="absolute bottom-6 left-6 z-10">
                    <p className="text-text-muted text-sm uppercase tracking-widest font-sans">Sélection actuelle</p>
                    <p className="text-primary font-serif text-xl">{selectedWatch.name || "Personnalisée"}</p>
                  </div>
                </div>
              )}
            </div>

            {/* DÉTAILS */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {selectedWatch && (
                <div className="bg-surface rounded-2xl border border-border/10 p-6 shadow-lg">
                  {(() => {
                    const partsList = selectedWatch.parts || selectedWatch.components || [];
                    return (
                      <>
                        <h2 className="font-serif text-xl mb-4 flex justify-between items-center">
                          <span>Composants</span>
                          <span className="text-sm font-sans text-text-muted font-normal">
                            {partsList.length} pièces
                          </span>
                        </h2>
                        
                        <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          {partsList.map((item: any, idx: number) => (
                            // Utilisation d'une clé composite pour éviter les doublons
                            <li key={`${item.id}-${idx}`} className="flex items-center gap-3 bg-background/50 p-2 rounded-lg border border-transparent hover:border-primary/20 transition-colors group">
                              <div className="h-10 w-10 rounded bg-surface-hover flex-shrink-0 overflow-hidden flex items-center justify-center border border-border/10">
                                {item.image || item.thumbnail ? (
                                  <img src={item.image || item.thumbnail} alt={item.name} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-primary/20" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-text-subtle uppercase tracking-wider">{item.type}</p>
                                <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-primary text-xs font-serif">{item.price} €</p>
                                <button
                                  onClick={() => removePartFromSelected(item.id, item.type)}
                                  className="text-[10px] text-red-400 opacity-0 group-hover:opacity-100 hover:underline"
                                >
                                  Retirer
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* PAIEMENT */}
              <div className="bg-dark text-text-primary rounded-2xl p-8 border border-primary/30 shadow-[0_10px_40px_rgba(0,0,0,0.3)] sticky top-32">
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                  <span className="text-text-muted font-sans text-sm">Sous-total</span>
                  <span className="font-serif text-xl text-white">{grandTotal} €</span>
                </div>
                <div className="flex justify-between items-end mb-2">
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