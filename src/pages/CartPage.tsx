import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import type { PartOption, CartItem } from "../types/Parts";
import Nav from "../components/Nav";


interface CartPageProps {
  updateCartCount?: (count: number) => void;
}

export default function CartPage({ updateCartCount }: CartPageProps) {

  // 1. STATE
  const [cartWatches, setCartWatches] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      console.log(saved)
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Erreur lecture localStorage:", e);
      return [];
    }
  });

  const Livraison: PartOption = {
    price: 30,
    id: "liv1",
    material: "",
    name: "",
    regions: ["FR-E", "FR-U", "FR-A"],
    size: "",
    stock: 1,
    thumbnail: "",
    type: ""
  };

  const BoiteRangement: PartOption = {
    id: "boit1",
    material: "",
    name: "",
    price: 0,
    regions: ["FR-E", "FR-U", "FR-A"],
    size: "",
    stock: 1,
    thumbnail: "",
    type: ""
  };

  const [selectedWatchIndex, setSelectedWatchIndex] = useState<number>(0);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
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

  const handleCheckout = async () => {
    if (cartWatches.length === 0) return;
    setIsRedirecting(true);

    // FIX: Clone to avoid mutating state directly
    const watchConfig = [
      ...cartWatches[selectedWatchIndex].composants,
      Livraison,
      BoiteRangement,
    ];
    console.log("envoie de la commande : ",watchConfig)
    try {
      const res = await fetch("https://montre-bastille-api.onrender.com/api/stripeOrder", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configs: watchConfig }),
      });
      const data = await res.json();

      if (data.url) {
        // FIX: Return immediately after redirect — don't run code below
        window.location.href = data.url;
        return;
      } else {
        console.error("Aucune URL de redirection reçue :", data.error);
        setAlert({type:'error', message:"Erreur lors de la création du paiement"});
      }
    } catch (error) {
      console.error("Failed to send order", error);
      setAlert({type:'error', message:"Une erreur est survenue. Veuillez réessayer."});
    }

    setIsRedirecting(false);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans pt-24 pb-12">
      <Nav bg={false} />

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
                <div className="w-full flex justify-center">
                  <div className={`relative overflow-hidden rounded-3xl z-40 bg-surface border border-primary/20 shadow-2xl group transition-all duration-500 ease-in-out aspect-square w-full max-w-[450px] max-h-[450px] ${
                    scrolled ? "p-4" : "p-8"
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />

                    <div className="relative z-10 flex items-center justify-center h-full w-full">
                      {["case", "dial", "strap", "hands"].map((category) => {
                        const part = selectedWatch.composants?.find((c) => c.type === category);
                        if (!part || !part.thumbnail) return null;
                        console.log("parts : ",part)
                        return (
                          <img
                            key={part.id || category}
                            src={part.thumbnail}
                            alt={part.name || category}
                            // J'ai aussi légèrement réduit le scale-175 à scale-150 pour éviter que la montre sorte du conteneur réduit
                            className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 scale-[1.7]"
                          />
                        );
                      })}
                    </div>

                    <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                      <p className="text-text-muted text-sm uppercase tracking-widest font-sans">Sélection actuelle</p>
                      <p className="text-primary font-serif text-xl">Montre #{selectedWatchIndex + 1}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DÉTAILS (Zone Droite) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {selectedWatch && (
                <div className="bg-surface rounded-2xl border border-border/10 p-6 shadow-lg relative z-40">
                  {/* FIX: Iterate directly over the PartOption array — no Object.entries needed */}
                  <h2 className="font-serif text-xl mb-4 flex justify-between items-center">
                    <span>Composants</span>
                    <span className="text-sm font-sans text-text-muted font-normal">
                      {selectedWatch.composants.length} pièces
                    </span>
                  </h2>

                  <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedWatch.composants.map((part, idx) => {
                      // FIX: `part` is already a full PartOption — no lookup needed
                      if (!part) return null;

                      return (
                        <li
                          key={`${part.id ?? idx}`}
                          className="flex items-center gap-3 bg-background/50 p-2 rounded-lg border border-transparent hover:border-primary/20 transition-colors group"
                        >
                          <div className="h-16 w-16 rounded bg-surface-hover flex-shrink-0 overflow-hidden flex items-center justify-center border border-border/10">
                            {part.thumbnail ? (
                              <img
                                src={part.thumbnail}
                                alt={part.name}
                                className="h-full scale-[2] w-full object-cover"
                              />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-primary/20" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-text-subtle uppercase tracking-wider">{part.type}</p>
                            <p className="text-sm font-medium text-text-primary truncate">{part.name}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* TOTAL & PAYER */}
              <div className="bg-dark text-text-primary rounded-2xl p-8 border border-primary/30 shadow-[0_10px_40px_rgba(0,0,0,0.3)] sticky top-32 z-40">

                {/* Détails de la commande */}
                <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted font-sans text-sm">Livraison sécurisée</span>
                    <span className="font-serif text-lg text-text-primary">30 €</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-text-primary font-sans text-sm flex items-center gap-3">
                        Boîte de remontage automatique
                      </span>
                    </div>
                    <span className="font-sans text-xs uppercase tracking-widest text-primary border border-primary/40 bg-primary/10 px-3 py-1 rounded-full">
                      Offert
                    </span>
                  </div>
                </div>

                {/* Total à payer */}
                <div className="flex justify-between items-end mb-8">
                  <span className="text-text-muted font-sans text-sm pb-1">Total à payer</span>
                  <span className="font-serif text-3xl md:text-4xl text-primary leading-none">{grandTotal + 30} €</span>
                </div>

                {/* Bouton de paiement */}
                <button
                  onClick={handleCheckout}
                  disabled={isRedirecting}
                  className="w-full py-4 px-6 rounded-full text-sm uppercase tracking-[0.2em] font-bold bg-primary text-dark hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-3"
                >
                  {isRedirecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-dark/20 border-t-dark rounded-full animate-spin"></div>
                      Chargement...
                    </>
                  ) : (
                    "Payer la commande"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}