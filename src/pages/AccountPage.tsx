import { useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import type { User } from "../types/Parts";
import Nav from "../components/Nav";
import { MeshGradient } from '@paper-design/shaders-react';
import BtnRedirection from "../components/btnRedirect";
import { Helmet } from "react-helmet-async";

// Animation de Reveal
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

export default function AccountPage() {
  const { user: authUser, isAuthenticated, isLoading, logout } = useAuth0();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function getUserData() {
      if (isAuthenticated && authUser?.email) {
        try {
          const response = await fetch('https://montre-bastille-api.onrender.com/api/users');
          const users = await response.json();
          const foundUser = users.find((u: User) => u.email === authUser.email);
          
          if (foundUser) {
            setDbUser(foundUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoadingData(false);
        }
      }
    }
    getUserData();
  }, [isAuthenticated, authUser]);

  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-primary font-serif">
        <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="animate-pulse tracking-widest text-sm uppercase">Chargement...</p>
      </div>
    );
  }

  // Fallback data
  const displayUser = dbUser || {
    nom: authUser?.family_name || "Nom Inconnu",
    prenom: authUser?.given_name || "Utilisateur",
    email: authUser?.email,
    numero: "Non renseigné",
    montres_perso: [],  
    votes: []
  };

  console.log(displayUser.montres_perso)

  return (
    <>
      <Helmet>
        <title>Mon Espace Personnel | Montre Bastille</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Nav bg={false}/>
      
      <div className="relative min-h-screen bg-background font-sans overflow-hidden pt-24 pb-20">
        
        {/* Le Gradient Horloger - Optimisation : on s'assure qu'il ne bloque pas le focus */}
        <div className="absolute top-0 left-0 w-full h-150 opacity-90 z-0 pointer-events-none" aria-hidden="true">
          <MeshGradient
            width={typeof window !== 'undefined' ? window.innerWidth : 1280}
            height={600}
            colors={["#0a0a0c", "#262626", "#c5a059", "#1c1a17"]}
            distortion={0.25}
            speed={0.35}
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-background"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          
          {/* --- EN-TÊTE --- */}
          <Reveal>
            <div className="text-center mb-20">
              <h1 className="font-serif text-5xl md:text-6xl text-text-primary mb-6 tracking-tight">
                Mon Espace
              </h1>
              <div className="h-px w-20 bg-primary mx-auto opacity-60 mb-8" />
              <p className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                Bienvenue, <span className="text-primary font-serif text-xl">{displayUser.prenom}</span>.
              </p>
              
              <button 
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} 
                className="text-xs uppercase tracking-widest border border-primary/40 rounded-full px-6 py-3 bg-surface/50 text-text-primary hover:bg-primary hover:text-dark transition-all duration-300"
              >
                Se déconnecter
              </button>
            </div>
          </Reveal>

          {/* --- INFORMATIONS PERSONNELLES --- */}
          <div className="mb-24">
            <Reveal delay={1}>
              <h2 className="font-serif text-3xl mb-10 text-text-primary border-l-2 border-primary pl-4">
                Mes Coordonnées
              </h2>
            </Reveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Reveal delay={2}><InfoCard title="Identité" value={`${displayUser.prenom} ${displayUser.nom}`} /></Reveal>
              <Reveal delay={3}><InfoCard title="Email" value={displayUser.email} /></Reveal>
              <Reveal delay={4}><InfoCard title="Téléphone" value={displayUser.numero || "Non renseigné"} /></Reveal>
            </div>
          </div>

          {/* --- COLLECTION DE MONTRES --- */}
          <div>
            <Reveal delay={2}>
              <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-4">
                <h2 className="font-serif text-3xl text-text-primary border-l-2 border-primary pl-4">
                  Ma Collection
                </h2>
                <BtnRedirection text="Nouvelle Création" style="bordered" redirection="/region-page" size={{px: 5, py: 2}} />
              </div>
            </Reveal>
            
            {displayUser.montres_perso && displayUser.montres_perso.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayUser.montres_perso.map((montre, index) => (
                  <Reveal key={index} delay={index + 3}>
                    <WatchCard montre={montre} index={index} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal delay={3}>
                <div className="text-center py-20 bg-surface/20 rounded-2xl border border-white/5">
                  <p className="text-text-muted mb-8 text-lg font-serif">Votre collection est actuellement vide.</p>
                  <BtnRedirection text="Débuter la personnalisation" style="full" redirection="/region-page" size={{px: 8, py: 4}} />
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Composant InfoCard épuré et premium
function InfoCard({ title, value }: { title: string, value: string | undefined }) {
  return (
    <div className="p-8 rounded-xl bg-surface/40 border border-white/5 transition-colors duration-300 hover:border-primary/30 group">
      <h3 className="text-xs uppercase tracking-widest text-text-muted mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="font-serif text-xl text-text-primary">{value}</p>
    </div>
  );
}

// Composant WatchCard luxe
function WatchCard({ montre, index }: { montre: any, index: number }) {
  return (
    <div className="p-8 rounded-xl relative transition-all duration-500 bg-surface/40 border border-white/5 hover:border-primary/40 hover:-translate-y-1 group">
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <h3 className="font-serif text-xl text-primary">
          {montre.nom_montre || `Création N°${index + 1}`}
        </h3>
        <span className="text-xs text-text-muted tracking-widest">ÉDITION UNIQUE</span>
      </div>
      
      <div className="space-y-4 mb-10">
        <DetailRow label="Cadran" value={montre.configuration?.cadran_id || "Standard"} />
        <DetailRow label="Boîtier" value={montre.configuration?.boitier_id || "Acier"} />
        <DetailRow label="Bracelet" value={montre.configuration?.bracelet_id || "Cuir"} />
        <DetailRow label="Mouvement" value={montre.configuration?.mouvement_id || "Automatique"} />
      </div>

      <button className="w-full bg-transparent border border-white/10 text-text-primary hover:bg-primary hover:text-dark hover:border-primary text-sm tracking-widest uppercase py-3 rounded transition-all duration-300">
        Voir les détails
      </button>
    </div>
  );
}

// Sous-composant pour les lignes de détails de la montre
function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-end">
      <span className="text-sm text-text-muted">{label}</span>
      <div className="flex-grow border-b border-dotted border-white/10 mx-4 mb-1"></div>
      <span className="font-serif text-text-primary">{value}</span>
    </div>
  );
}