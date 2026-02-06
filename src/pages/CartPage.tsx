import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert"; // Assure-toi que le chemin est bon
import watchRender from "/Gurv.png"; // Remplace par ton image finale

// Données factices pour l'exemple (simulant ce qui viendrait d'un Context ou Redux)
const INITIAL_ITEMS = [
  { id: 1, type: "boitier", name: "Boîtier Acier Noir 40mm", price: 150, image: "/parts/case-black.png" },
  { id: 2, type: "cadran", name: "Cadran Bleu Nuit", price: 85, image: "/parts/dial-blue.png" },
  { id: 3, type: "aiguilles", name: "Aiguilles Dauphine Argent", price: 35, image: "/parts/hands-silver.png" },
  { id: 4, type: "mouvement", name: "Mouvement Automatique Miyota", price: 120, image: "/parts/movement.png" },
  { id: 5, type: "bracelet", name: "Bracelet Acier Noir", price: 90, image: "/parts/strap-black.png" },
];

export default function CartPage({ updateCartCount }) {
  const [cartItems, setCartItems] = useState(INITIAL_ITEMS);
  const [alert, setAlert] = useState(null); // State pour gérer l'affichage de l'alerte
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Calcul du total
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

  // Fonction de suppression
  const handleRemoveItem = (id, type) => {
    // 1. Filtrer l'élément
    const newItems = cartItems.filter((item) => item.id !== id);
    setCartItems(newItems);

    // 2. Mettre à jour le compteur global (via props)
    if (updateCartCount) {
      updateCartCount(newItems.length);
    }

    // 3. Déclencher l'alerte spécifique demandée
    setAlert({
      type: "warning",
      message: `Vous avez retiré : ${type}. Votre montre est incomplète, n'oubliez pas d'en sélectionner un nouveau.`,
    });
  };

  // Fonction de paiement Stripe (Simulée)
  const handleCheckout = async () => {
    if (cartItems.length < 5) {
      setAlert({
        type: "error",
        message: "Votre montre est incomplète. Veuillez ajouter tous les composants avant de payer.",
      });
      return;
    }

    setIsRedirecting(true);
    
    // Simulation d'appel API
    // En production: const stripe = await loadStripe('PK_...');
    setTimeout(() => {
      console.log("Redirection vers Stripe Checkout...");
      // window.location.href = "https://buy.stripe.com/..." 
      setIsRedirecting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans pt-24 pb-12">
      
      {/* Affichage conditionnel de l'alerte */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          duration={4000}
        />
      )}

      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <h1 className="font-serif text-3xl md:text-5xl mb-12">
          Votre <span className="text-primary">Configuration</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* COLONNE GAUCHE : VISUEL FINAL */}
          <div className="lg:col-span-7 sticky top-32">
            <div className="relative rounded-3xl bg-surface border border-primary/20 p-8 shadow-2xl overflow-hidden group">
              {/* Fond subtil */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
              
              {/* Image Montre */}
              <div className="relative z-10 aspect-square flex items-center justify-center">
                 {/* Utilisation de l'image placeholder si watchRender n'est pas dispo */}
                <img 
                  src={watchRender} 
                  alt="Votre montre configurée" 
                  className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-105" 
                />
              </div>

              <div className="absolute bottom-6 left-6 z-10">
                <p className="text-text-muted text-sm uppercase tracking-widest font-sans">Modèle Unique</p>
                <p className="text-primary font-serif text-xl">Bastille — Édition Personnalisée</p>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : LISTE & PAIEMENT */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Liste des composants */}
            <div className="bg-surface rounded-2xl border border-border/10 p-6 shadow-lg">
              <h2 className="font-serif text-2xl mb-6 border-b border-border/10 pb-4">Détail des pièces</h2>
              
              {cartItems.length === 0 ? (
                <p className="text-text-muted text-center py-8">Votre panier est vide.</p>
              ) : (
                <ul className="space-y-4">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex items-center gap-4 bg-background/50 p-3 rounded-xl border border-transparent hover:border-primary/30 transition-colors group">
                      {/* Miniature composant (placeholder bg si pas d'image) */}
                      <div className="h-16 w-16 rounded-lg bg-surface-hover flex-shrink-0 overflow-hidden flex items-center justify-center border border-border/10">
                         {item.image ? (
                           <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                         ) : (
                           <div className="w-4 h-4 rounded-full bg-primary/20" />
                         )}
                      </div>

                      {/* Info Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text-subtle uppercase tracking-wider mb-0.5">{item.type}</p>
                        <p className="font-medium text-text-primary truncate">{item.name}</p>
                        <p className="text-primary text-sm font-serif mt-1">{item.price} €</p>
                      </div>

                      {/* Bouton Supprimer */}
                      <button
                        onClick={() => handleRemoveItem(item.id, item.type)}
                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Retirer ce composant"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Résumé & Total */}
            <div className="bg-dark text-text-primary rounded-2xl p-8 border border-primary/30 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
              <div className="flex justify-between items-end mb-2">
                <span className="text-text-muted font-sans text-sm">Total estimé</span>
                <span className="font-serif text-3xl md:text-4xl text-primary">{totalPrice} €</span>
              </div>
              <p className="text-xs text-text-subtle mb-8">Taxes incluses, livraison offerte en France.</p>

              <button
                onClick={handleCheckout}
                disabled={isRedirecting || cartItems.length === 0}
                className={`w-full py-4 px-6 rounded-full text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center justify-center gap-3
                  ${isRedirecting || cartItems.length === 0
                    ? "bg-surface text-text-muted cursor-not-allowed" 
                    : "bg-primary text-dark hover:bg-primary-dark hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:-translate-y-1"
                  }`}
              >
                {isRedirecting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Redirection...
                  </>
                ) : (
                  <>
                    <span>Valider la commande</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </>
                )}
              </button>
              
              <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Icônes de paiement (décoratif) */}
                <div className="h-6 w-10 bg-white/10 rounded" title="Visa"></div>
                <div className="h-6 w-10 bg-white/10 rounded" title="Mastercard"></div>
                <div className="h-6 w-10 bg-white/10 rounded" title="Amex"></div>
              </div>
            </div>

            <Link to="/configurator" className="text-center text-sm text-text-muted hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4">
              Modifier la configuration
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}