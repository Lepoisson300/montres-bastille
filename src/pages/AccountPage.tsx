import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import type { User } from "../types/Parts";
import Nav from "../components/Nav";

export default function AccountPage() {
  const { user: authUser, isAuthenticated, isLoading, logout } = useAuth0();
  const [dbUser, setDbUser] = useState(null);
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
      <div className="min-h-screen bg-background flex items-center justify-center text-text-primary font-serif animate-pulse">
        Chargement de votre espace...
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

  return (
    <>
      <Nav bg={false}/>
    
      {/* Ajout d'un background subtil avec des gradients ou une image 
        pour que l'effet de verre soit visible. 
        Ajustez bg-dark/bg-background selon votre thème.
      */}
      <div className="relative min-h-screen bg-background text-text-primary font-sans py-20 px-5 overflow-hidden">
        
        {/* Cercles décoratifs flous en arrière-plan pour accentuer le glassmorphism */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto z-10">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="font-serif text-5xl md:text-6xl text-text-primary mb-6 tracking-wide">
              Mon Compte
            </h1>
            <p className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Bienvenue dans votre espace personnel, <span className="text-primary">{displayUser.prenom}</span>.<br/>
              Retrouvez ici vos informations et vos créations horlogères.
            </p>
            <button 
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} 
              className="bg-primary hover:bg-primary-dark text-background font-medium py-3 px-8 rounded-full transition-colors duration-300 shadow-lg shadow-primary/20"
            >
              Déconnexion
            </button>
          </div>

          {/* Personal Info Grid */}
          <h2 className="font-serif text-3xl text-center mb-10 text-text-secondary">Mes Informations</h2>
          
          <div className="flex flex-wrap justify-center gap-8 mb-20">
            <InfoCard 
              icon="👤" 
              title="Identité" 
              value={`${displayUser.prenom} ${displayUser.nom}`} 
            />
            <InfoCard 
              icon="✉️" 
              title="Email" 
              value={displayUser.email} 
            />
            <InfoCard 
              icon="📱" 
              title="Téléphone" 
              value={displayUser.numero || "Ajouter un numéro"} 
            />
          </div>

          {/* Watches Section */}
          <div className="pt-16">
            <h2 className="font-serif text-3xl text-center mb-10 text-text-secondary">Mes Montres Créées</h2>
            
            {displayUser.montres_perso && displayUser.montres_perso.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-8">
                {displayUser.montres_perso.map((montre, index) => (
                  <WatchCard key={index} montre={montre} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-surface/30 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] max-w-2xl mx-auto">
                <p className="text-text-muted mb-6 text-lg">Vous n'avez pas encore configuré de montre.</p>
                <button className="bg-primary hover:bg-primary-dark text-background font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-lg shadow-primary/20">
                  Créer ma montre
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

// Composant InfoCard avec effet Glassmorphism
function InfoCard({ icon, title, value }) {
  return (
    <div className="w-full max-w-[300px] p-10 rounded-2xl text-center transition-all duration-300 hover:-translate-y-2 group
      bg-surface/30 backdrop-blur-md border border-white/10 
      shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_0_rgba(primary,0.2)]">
      
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-white/5 border border-white/10 group-hover:bg-primary/20 transition-colors shadow-inner">
        <span className="text-2xl drop-shadow-md">{icon}</span>
      </div>
      <h3 className="font-serif text-2xl mb-3 text-text-primary drop-shadow-sm">{title}</h3>
      <p className="text-text-muted">{value}</p>
    </div>
  );
}

// Composant WatchCard avec effet Glassmorphism
function WatchCard({ montre, index }) {
  return (
    <div className="w-full max-w-[350px] p-8 rounded-2xl relative transition-all duration-300 hover:-translate-y-2
      bg-surface/30 backdrop-blur-md border border-white/10 
      shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_0_rgba(primary,0.2)]">
      
      <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
        <span className="text-2xl drop-shadow-md">⌚</span>
        <h3 className="font-serif text-xl text-primary drop-shadow-sm">
          {montre.nom_montre || `Montre #${index + 1}`}
        </h3>
      </div>
      
      <div className="space-y-3 mb-8 text-text-secondary text-sm">
        <div className="flex justify-between"><span className="text-text-muted">Cadran:</span> <span className="font-medium text-text-primary">{montre.configuration.cadran_id}</span></div>
        <div className="flex justify-between"><span className="text-text-muted">Bracelet:</span> <span className="font-medium text-text-primary">{montre.configuration.bracelet_id}</span></div>
        <div className="flex justify-between"><span className="text-text-muted">Boîtier:</span> <span className="font-medium text-text-primary">{montre.configuration.boitier_id}</span></div>
        <div className="flex justify-between"><span className="text-text-muted">Mouvement:</span> <span className="font-medium text-text-primary">{montre.configuration.mouvement_id}</span></div>
      </div>

      <button className="w-full bg-white/5 border border-white/10 text-primary hover:bg-primary hover:text-background hover:border-primary font-medium py-3 rounded-full transition-all duration-300 backdrop-blur-sm">
        Modifier
      </button>
    </div>
  );
} 