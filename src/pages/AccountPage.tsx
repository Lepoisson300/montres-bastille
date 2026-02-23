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
    
    <div className="min-h-screen bg-background text-text-primary font-sans py-20 px-5">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl text-text-primary mb-6 tracking-wide">
            Mon Compte
          </h1>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="bg-primary hover:bg-primary-dark text-background font-medium py-3 px-8 rounded-full transition-colors duration-300 mb-4">
            Déconnexion
          </button>

          <p className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Bienvenue dans votre espace personnel, <span className="text-primary">{displayUser.prenom}</span>.<br/>
            Retrouvez ici vos informations et vos créations horlogères.
          </p>
        </div>

        {/* Personal Info Grid */}
        <h2 className="font-serif text-3xl text-center mb-10 text-text-secondary">Mes Informations</h2>
        
        <div className="flex flex-wrap justify-center gap-8 mb-20">
          {/* Info Card: Identity */}
          <InfoCard 
            icon="👤" 
            title="Identité" 
            value={`${displayUser.prenom} ${displayUser.nom}`} 
          />
          
          {/* Info Card: Email */}
          <InfoCard 
            icon="✉️" 
            title="Email" 
            value={displayUser.email} 
          />
          
          {/* Info Card: Phone */}
          <InfoCard 
            icon="📱" 
            title="Téléphone" 
            value={displayUser.numero || "Ajouter un numéro"} 
          />
        </div>

        {/* Watches Section */}
        <div className="border-t border-border pt-16">
          <h2 className="font-serif text-3xl text-center mb-10 text-text-secondary">Mes Montres Créées</h2>
          
          {displayUser.montres_perso && displayUser.montres_perso.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8">
              {displayUser.montres_perso.map((montre, index) => (
                <WatchCard key={index} montre={montre} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-surface/50 rounded-xl border border-dashed border-border max-w-2xl mx-auto">
              <p className="text-text-muted mb-6 text-lg">Vous n'avez pas encore configuré de montre.</p>
              <button className="bg-primary hover:bg-primary-dark text-background font-medium py-3 px-8 rounded-full transition-colors duration-300">
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

// Sub-component for Info Cards to keep code clean
function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-surface border border-border hover:border-primary w-full max-w-[300px] p-10 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 group">
      <div className="w-16 h-16 border border-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="font-serif text-2xl mb-3 text-text-primary">{title}</h3>
      <p className="text-text-muted">{value}</p>
    </div>
  );
}

// Sub-component for Watch Cards
function WatchCard({ montre, index }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-8 w-full max-w-[350px] relative hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <div className="flex items-center gap-4 mb-6 border-b border-border pb-4">
        <span className="text-2xl">⌚</span>
        <h3 className="font-serif text-xl text-primary">
          {montre.nom_montre || `Montre #${index + 1}`}
        </h3>
      </div>
      
      <div className="space-y-3 mb-8 text-text-secondary text-sm">
        <div className="flex justify-between"><span className="text-text-muted">Cadran:</span> <span>{montre.configuration.cadran_id}</span></div>
        <div className="flex justify-between"><span className="text-text-muted">Bracelet:</span> <span>{montre.configuration.bracelet_id}</span></div>
        <div className="flex justify-between"><span className="text-text-muted">Boîtier:</span> <span>{montre.configuration.boitier_id}</span></div>
        <div className="flex justify-between"><span className="text-text-muted">Mouvement:</span> <span>{montre.configuration.mouvement_id}</span></div>
      </div>

      <button className="w-full bg-transparent border border-primary text-primary hover:bg-primary hover:text-surface-active font-medium py-2.5 rounded-full transition-all duration-300">
        Modifier
      </button>
    </div>
    
  );
}