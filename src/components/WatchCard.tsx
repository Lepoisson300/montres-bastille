// Composant WatchCard luxe
import type { Watch } from "../types/Parts";

export default function WatchCard({ montre, index }: { montre: Watch, index: number }) {
  
  // Fonction utilitaire pour gérer l'affichage du statut
  const getStatusDisplay = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'finished':
      case 'terminée':
        return { text: 'Terminée', style: 'text-green-400 border-green-400/20 bg-green-400/5' };
      case 'in construction':
      case 'en assemblage':
      case 'en cours':
        return { text: 'En assemblage', style: 'text-amber-400 border-amber-400/20 bg-amber-400/5' };
      default:
        return { text: 'En attente', style: 'text-gray-400 border-gray-400/20 bg-gray-400/5' };
    }
  };

  //const currentStatus = getStatusDisplay(montre.status.toString()); // Assurez-vous que la clé correspond à votre BDD (statut, status, etc.)

  const watchDetails = [
    { label: "Cadran", value: montre.components[0] || "Standard" },
    { label: "Boîtier", value: montre.components[1] || "Acier" },
    { label: "Bracelet", value: montre.components[2] || "Cuir" },
    { label: "Mouvement", value: montre.components[3] || "Automatique" }
  ];

  return (
    <div className="p-8 rounded-xl relative transition-all duration-500 bg-surface/40 border border-white/5 hover:border-primary/40 hover:-translate-y-1 group">
      
      {/* En-tête : Titre, Statut et Tag */}
      <div className="flex items-start justify-between mb-8 pb-4 border-b border-white/10">
        <div>
          <h3 className="font-serif text-xl text-primary mb-2">
            {montre.name || `Création N°${index + 1}`}
          </h3>
          <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-medium`}>
            {/*currentStatus.text*/}
          </span>
        </div>
        <span className="text-xs text-text-muted tracking-widest mt-1">ÉDITION UNIQUE</span>
      </div>
      
      {/* Détails de la configuration (Sub-composant fusionné) */}
      <div className="space-y-4 mb-10">
        {watchDetails.map((detail, idx) => (
          <div key={idx} className="flex justify-between items-end">
            <span className="text-sm text-text-muted">{detail.label}</span>
            <div className="flex-grow border-b border-dotted border-white/10 mx-4 mb-1"></div>
            <span className="font-serif text-text-primary">{/*detail.value*/}</span>
          </div>
        ))}
      </div>

      {/* Bouton d'action */}
      <button className="w-full bg-transparent border border-white/10 text-text-primary hover:bg-primary hover:text-dark hover:border-primary text-sm tracking-widest uppercase py-3 rounded transition-all duration-300">
        Voir les détails
      </button>
      
    </div>
  );
}