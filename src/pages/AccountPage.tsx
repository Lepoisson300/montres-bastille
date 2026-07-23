import { useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import type { Order, User } from "../types/User";
import Nav from "../components/Nav";
import { MeshGradient } from '@paper-design/shaders-react';
import BtnRedirection from "../components/btnRedirect";
import { Helmet } from "react-helmet-async";
import WatchCard from "../components/WatchCard";
import InfoCard from "../components/InfoCards";
import { useAlert } from "../Logic/AlertContext";
import OnboardingModal from "../Modals/OnboardingModal";


// Animation de Reveal (inchangée)
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

const apiAddress = import.meta.env.VITE_API_URL;

export default function AccountPage() {
  const { user: authUser, isAuthenticated, isLoading, logout } = useAuth0();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { showAlert } = useAlert();

  // 1. Un seul appel API pour récupérer l'utilisateur ET ses commandes embarquées
  useEffect(() => {
    async function getUserData() {
      if (isAuthenticated && authUser?.email) {
        try {
          const response = await fetch(`${apiAddress}/api/users`);
          const users = await response.json();
          const foundUser = users.find((u: User) => u.email === authUser.email);    
          console.log(users)   
          if (foundUser) {
            setDbUser(foundUser);
          }
          if (!foundUser.numero || foundUser.numero === "") {
              setShowOnboarding(true);
            } else {
              setShowOnboarding(false);
            }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {  
          setLoadingData(false);
        }
      } else if (!isLoading) {
        setLoadingData(false);
      }
    }
    getUserData();
  }, [isAuthenticated, authUser, isLoading]);

  const handleOnboardingSuccess = (updatedUser: any) => {
    setDbUser(updatedUser); // Update local state immediately
    setShowOnboarding(false); // Close the modal
  };

  const displayUser = dbUser || {
    nom: authUser?.family_name || "Nom Inconnu",
    prenom: authUser?.given_name || "Utilisateur",
    email: authUser?.email,
    numero: "Non renseigné",
    commandes: [],
    pseudo: "Pseudo inconnu",
  };
  
  // 2. EXTRACTION DES MONTRES
  // On récupère toutes les commandes, et on extrait toutes les montres de chaque commande
  // On peut filtrer pour ne prendre que les commandes payées (etape_actuelle >= 1) si on le souhaite
  const commandesValidees = displayUser.commandes?.filter(c => c.etape_actuelle >= 1) || [];
  const toutesLesMontres = commandesValidees.flatMap(commande => commande.montre) || [];
  console.log(commandesValidees)
  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-primary font-serif">
        <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="animate-pulse tracking-widest text-sm uppercase">Chargement...</p>
      </div>
    );
  }

async function deleteAccount() {
  if (!displayUser?.email) {
    showAlert('error', "Impossible d'identifier le compte à supprimer.");
    return;
  }
  fetch(`${apiAddress}/api/users/delete`, {
    method: 'DELETE', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      { email: displayUser.email, 
        auth0Id : authUser?.sub
      }
    ) 
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        showAlert('error', data.error);
        return;
      }
      // La déconnexion après la suppression réussie
      logout({ logoutParams: { returnTo: window.location.origin } });
    })
    .catch((error) => {
      console.error(error);
      showAlert('error', "Impossible de supprimer le compte");
    });
}
  return (
    <>
      <Helmet>
        <title>Mon Espace Personnel | Montre Bastille</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Nav bg={false}/>
      
      <div className=" bg-background font-sans overflow-hidden pt-28 pb-20 ">
        
        {isAuthenticated && showOnboarding && (
                <OnboardingModal 
                   dbUser={dbUser} 
                   onUpdateSuccess={handleOnboardingSuccess} 
                   onClose={() => setShowOnboarding(false)}
                />
              )}

        <div className="">
          
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
              <div className="mx-auto">
                <button 
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} 
                  className="text-xs uppercase tracking-widest border border-primary/40 rounded-full px-6 py-3 bg-surface/50 text-text-primary hover:bg-primary hover:text-dark transition-all duration-300"
                >
                  Se déconnecter
                </button>

                <button 
                  onClick={() => deleteAccount()} 
                  className="text-xs ml-4 uppercase tracking-widest border border-primary/40 rounded-full px-6 py-3 bg-surface/50 text-text-primary hover:bg-primary hover:text-dark transition-all duration-300"
                >
                  Supprimer mon compte
                </button>
              </div>
              
            </div>
          </Reveal>

          {/* --- INFORMATIONS PERSONNELLES --- */}
          <div className="mb-24 mx-[10%]">
            <Reveal delay={1}>
              <h2 className="font-serif text-3xl mb-10 text-text-primary border-l-2 border-primary pl-4">
                Mes Coordonnées
              </h2>
            </Reveal>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Reveal delay={2}><InfoCard title="Identité" value={`${displayUser.prenom} ${displayUser.nom}`} /></Reveal>
              <Reveal delay={3}><InfoCard title="Email" value={displayUser.email || "Non renseigné"} /></Reveal>
              <Reveal delay={4}><InfoCard title="Téléphone" value={displayUser.numero || "Non renseigné"} /></Reveal>
              <Reveal delay={5}><InfoCard title="Pseudo" value={displayUser.pseudo || "Non renseigné"} /></Reveal>

            </div>
          </div>

          {/* --- COLLECTION DE MONTRES --- */}
          <div className="">
            <div className="absolute w-full h-screen opacity-90 z-0 pointer-events-none" aria-hidden="true">
              <MeshGradient
                width={typeof window !== 'undefined' ? window.innerWidth : 1920}
                height={typeof window !== 'undefined' ? window.innerHeight : 1080}
                colors={["#0a0a0c", "#262626", "#c5a059", "#1c1a17"]}
                distortion={0.25}
                speed={0.45}
              />
            </div>
            <Reveal delay={2}>
              <div className="flex p-4 mx-[10%] justify-between items-end mb-10 border-b border-white/5 pb-4">
                <h2 className="font-serif text-3xl text-text-primary border-l-2 border-primary pl-4">
                  Ma Collection
                </h2>
                <div className="mx-4">
                  <BtnRedirection text="Nouvelle Création" style="bordered" redirection="/region-page" size={{px: 5, py: 2}} />
                </div>
              </div>
            </Reveal>
            
            {toutesLesMontres.length > 0 ? (
               <div 
                  ref={scrollContainerRef}
                  className="flex flex-row items-start overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-y-4 px-6 md:px-24 py-8 md:py-12 gap-x-6 md:gap-x-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  {commandesValidees.map((commande: Order) => 
                    commande.montres.map((uneMontre, index) => (
                      <Reveal key={`${commande.numero_commande}-${index}`} delay={index + 3}>
                        <div className="w-[85vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none">
                          <WatchCard 
                            montre={uneMontre}
                            index={index} 
                            numero_commande={commande.numero_commande} 
                            etape_actuelle={commande.etape_actuelle} 
                          />
                        </div>
                      </Reveal>
                    ))
                  )}
                </div>
                            ) : (
              <Reveal delay={3}>
                <div className="mx-[10%] text-center py-20 bg-surface/20 rounded-2xl border border-white/5">
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