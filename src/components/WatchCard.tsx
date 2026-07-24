import { useState } from "react";
import { Link } from "react-router-dom";
import type { Watch } from "../types/Parts";
import { useAuth0 } from "@auth0/auth0-react";

// 1. On déclare le type de l'utilisateur attendu par ton API
interface User {
  email: string;
  token: string;
}

interface WatchCardProps {
  montre: Watch;
  index: number;
  etape_actuelle?: number;
  numero_commande: string;
  user?: User | null; 
}

const apiAddress = import.meta.env.VITE_API_URL;


export default function WatchCard({ 
  montre, 
  index, 
  etape_actuelle = 1, 
  numero_commande,
}: WatchCardProps) {
  
  // États pour l'UX du bouton Partager
  const [isSharing, setIsSharing] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const {user: authUser, isAuthenticated, getAccessTokenSilently} = useAuth0();

  const getStatusDisplay = (etape: number) => {
    switch (etape) {
      case 0: return { text: 'En attente de paiement', style: 'text-red-400 border-red-400/20 bg-red-400/5' };
      case 1: return { text: 'En assemblage', style: 'text-amber-400 border-amber-400/20 bg-amber-400/5' };
      case 2: return { text: 'Expédiée', style: 'text-blue-400 border-blue-400/20 bg-blue-400/5' };
      case 3: return { text: 'Livrée', style: 'text-green-400 border-green-400/20 bg-green-400/5' };
      default: return { text: 'En préparation', style: 'text-gray-400 border-gray-400/20 bg-gray-400/5' };
    }
  };
  const currentStatus = getStatusDisplay(etape_actuelle);
  console.log(montre)
  const getPartName = (type: string) => {
    const part = montre.composants?.find(c => c.type === type);
    return part ? part.name : "Standard";
  };

  const watchDetails = [
    { label: "Boîtier", value: getPartName("case") },
    { label: "Cadran", value: getPartName("dial") },
    { label: "Aiguilles", value: getPartName("hand") },
    { label: "Bracelet", value: getPartName("strap") }
  ];

  const handleShare = async (unShare: boolean) => {
    if (!isAuthenticated) {
      setShareFeedback({ type: 'error', msg: "Connectez-vous pour partager" });
      return;
    }
    
    setIsSharing(true);
    setShareFeedback(null);

    try {
      // 1. On attend (await) la récupération du token JWT
      const token = await getAccessTokenSilently();

      const payload = {
        watch: {
          name: montre.name || `Création N°${index + 1}`,
          components: montre.composants,
          votes: 0,
          // 2. On remplace "test" par le vrai nom de l'utilisateur (ou "Anonyme" par défaut)
          creator: authUser?.nickname || authUser?.name || "Anonyme" 
        },
        user: {
          email: authUser?.email,
        }
      };

      // 3. On détermine l'URL dynamiquement pour éviter de dupliquer le fetch
      const endpoint = unShare ? '/api/unpostwatch' : '/api/postwatch';

      const response = await fetch(`${apiAddress}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'opération");
      }

      setShareFeedback({ type: 'success', msg: unShare ? "Retirée de la communauté !" : "Partagée avec succès !" });

      // Optionnel : effacer le message de succès après 3 secondes
      setTimeout(() => setShareFeedback(null), 3000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur serveur";
      setShareFeedback({ type: 'error', msg: errorMessage });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="p-8 rounded-xl max-w-xl relative transition-all duration-500 bg-surface/40 border border-white/5 hover:border-primary/40 hover:-translate-y-1 group flex flex-col">
      
      {/* En-tête */}
      <div className="flex items-start justify-between mb-6 pb-4 border-b border-white/10">
        <div>
          <h3 className="font-serif text-xl text-primary mb-2">
            {montre.name || `Création N°${index + 1}`}
          </h3>
          <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-medium ${currentStatus.style}`}>
            {currentStatus.text}
          </span>
        </div>
        <span className="text-xs text-text-muted tracking-widest mt-1">ÉDITION UNIQUE</span>
      </div>
      
      {/* Visuel */}
      <div className="relative w-full aspect-square mb-8 bg-dark/20 rounded-lg overflow-hidden flex items-center justify-center">
        {["case", "dial", "hand", "strap"].map((category) => {
          const part = montre.composants?.find((c) => c.type === category);
          if (!part || !part.thumbnail) return null;
          
          return (
            <img
              key={part.id || category}
              src={part.thumbnail}
              alt={`Composant ${category} : ${part.name}`}                           
              className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] scale-[1.4] transition-transform duration-700 group-hover:scale-[1.5]"
            />
          );
        })}
      </div>

      {/* Détails */}
      <div className="space-y-4 grow">
        {watchDetails.map((detail, idx) => (
          <div key={idx} className="flex justify-between items-end">
            <span className="text-sm text-text-muted">{detail.label}</span>
            <div className="grow border-b border-dotted border-white/10 mx-4 mb-1"></div>
            <span className="font-serif text-sm text-text-primary text-right max-w-[50%] truncate" title={detail.value}>
              {detail.value}
            </span>
          </div>
        ))}
      </div>
      
      {/* Zone de Feedback API (Erreur ou Succès) */}
      {shareFeedback && (
        <div className={`mt-4 p-2 text-center text-xs rounded border ${
          shareFeedback.type === 'success' 
            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
            : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {shareFeedback.msg}
        </div>
      )}

      {/* Actions */}
      <div className="flex mt-4 gap-3">
        <Link 
          to={`/order?commande=${numero_commande}`}
          className="w-1/2 flex items-center justify-center bg-transparent border border-white/10 text-text-primary hover:bg-primary hover:text-dark hover:border-primary text-xs tracking-widest uppercase py-3 rounded transition-all duration-300"
        >
          Ma commande
        </Link>
        {montre.shared ? (
          <button 
          onClick={()=>handleShare(true)}
          disabled={isSharing || shareFeedback?.type === 'success'}
          className={`w-1/2 flex items-center bg-amber-400/80 backdrop-blur-2xl justify-center text-xs tracking-widest uppercase py-3 rounded transition-all duration-300 border ${
            shareFeedback?.type === 'success'
              ? 'bg-green-500/20 text-green-400 border-green-500/30 cursor-default'
              : ' border-white/10 text-text-primary hover:bg-primary hover:text-dark hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {isSharing ? "Envoi..." : shareFeedback?.type === 'success' ? "Supprimé de la communauté ✓" : "Départager"}
        </button>
        ) : 
          <button 
          onClick={()=>handleShare(false)}
          disabled={isSharing || shareFeedback?.type === 'success'}
          className={`w-1/2 flex items-center justify-center text-xs tracking-widest uppercase py-3 rounded transition-all duration-300 border ${
            shareFeedback?.type === 'success'
              ? 'bg-green-500/20 text-green-400 border-green-500/30 cursor-default'
              : 'bg-transparent border-white/10 text-text-primary hover:bg-primary hover:text-dark hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {isSharing ? "Envoi..." : shareFeedback?.type === 'success' ? "Partagé ✓" : "Partager"}
        </button>
        }
       
      </div>

    </div>
  );
}