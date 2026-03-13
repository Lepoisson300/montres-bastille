import React, { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import BtnRedirection from "../components/btnRedirect";

// On réutilise votre superbe animation d'apparition
const Reveal = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
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
  
  // Vider le panier au chargement de la page de succès
  useEffect(() => {
    // Adaptez ceci selon la façon dont vous stockez votre panier
    localStorage.removeItem("cartWatches");
    // Si vous utilisez un Context (ex: clearCart()), appelez-le ici
  }, []);

  return (
    <>
      <Nav bg={false} />

      <div className="font-sans min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
        
        {/* Effet de fond subtil pour rappeler la page d'accueil */}
        <div className="absolute inset-0 bg-dark opacity-50 z-0"></div>
        
        <div className="relative z-10 w-full max-w-2xl text-center">
          <Reveal>
            
            {/* L'Animation SVG Premium (utilise votre couleur 'primary') */}
            <div className="flex justify-center mb-10">
              <svg 
                className="checkmark w-28 h-28 text-primary" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 52 52"
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

            {/* Le Texte */}
            <h1 className="font-serif text-4xl md:text-6xl text-text-primary mb-6 tracking-tight">
              Commande validée
            </h1>
            
            <div className="h-px w-20 bg-primary mx-auto opacity-60 mb-8" />
            
            <p className="font-sans text-lg text-text-muted leading-relaxed max-w-lg mx-auto mb-12">
              Merci pour votre confiance. Votre morceau d'histoire est désormais en cours de préparation dans nos ateliers. Vous recevrez très bientôt un email de confirmation avec le suivi de votre création.
            </p>

            {/* Les Actions (Utilisation de votre composant) */}
            <div className="flex flex-wrap justify-center gap-6">
              <BtnRedirection 
                text={"Retour à l'accueil"} 
                style={"full"} 
                redirection="/" 
                size={{px:8, py:4}}
              />
              <BtnRedirection 
                text={"Votre compte"} 
                style={"bordered"} 
                redirection="/account" 
                size={{px:8, py:4}}
              />
            </div>

          </Reveal>
        </div>

        {/* CSS pour animer le trait du SVG (très léger et fluide) */}
        <style>{`
          .checkmark__circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            fill: none;
            animation: stroke 0.8s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          }

          .checkmark__check {
            transform-origin: 50% 50%;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: stroke 0.5s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
          }

          @keyframes stroke {
            100% {
              stroke-dashoffset: 0;
            }
          }
        `}</style>
      </div>
    </>
  );
}