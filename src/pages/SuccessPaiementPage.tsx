import React, { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import BtnRedirection from "../components/btnRedirect";
import { Helmet } from "react-helmet-async";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

// Animation de Reveal
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 120);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
};

export default function SuccessPage() {
  const {isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  // 1. Vider le panier au chargement
  useEffect(() => {
    localStorage.removeItem("cart"); // Clé corrigée selon tes fichiers précédents
    // On dispatch l'événement pour mettre à jour la bulle du panier dans la Nav
    window.dispatchEvent(new Event('cartRemoved'));
  }, []);

  // 2. Gestion de la redirection conditionnelle
  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate("/account");
    } else {
      // Si pas connecté, on lance le flux de connexion Auth0
      loginWithRedirect({
        appState: { returnTo: "/account" }
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Commande Réussie | Montre Bastille</title>
        {/* CRUCIAL : On ne veut pas que cette page apparaisse sur Google */}
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Nav bg={false} />

      <div className="font-sans min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
        
        {/* Effet de fond subtil */}
        <div className="absolute inset-0 bg-dark opacity-50 z-0 pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-2xl text-center">
          <Reveal>
            
            {/* Animation SVG Checkmark */}
            <div className="flex justify-center mb-10">
              <svg 
                className="checkmark w-28 h-28 text-primary" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 52 52"
                aria-hidden="true"
              >
                <circle 
                  className="checkmark__circle" 
                  cx="26" cy="26" r="25" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                />
                <path 
                  className="checkmark__check" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8" 
                />
              </svg>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl text-text-primary mb-6 tracking-tight">
              Merci pour votre commande
            </h1>
            
            <div className="h-px w-20 bg-primary mx-auto opacity-60 mb-8" />
            
            <p className="font-sans text-lg text-text-muted leading-relaxed max-w-lg mx-auto mb-12">
              Votre morceau d'histoire est désormais en cours de préparation dans nos ateliers. Un email de confirmation vient de vous être envoyé.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <BtnRedirection 
                text={"Retour à l'accueil"} 
                style={"full"} 
                redirection="/" 
                size={{px:8, py:4}}
              />
              
              {/* Bouton avec logique personnalisée */}
              <button 
                onClick={handleAccountClick}
                className="inline-flex items-center justify-center border border-primary text-primary font-sans px-8 py-4 text-base uppercase tracking-[0.2em] transition-all duration-300 hover:bg-primary hover:text-dark rounded-full"
              >
                Voir mon compte
              </button>
            </div>

          </Reveal>
        </div>

        <style>{`
          .checkmark__circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            animation: stroke 0.8s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          }
          .checkmark__check {
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: stroke 0.5s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
          }
          @keyframes stroke {
            100% { stroke-dashoffset: 0; }
          }
        `}</style>
      </div>
    </>
  );
}