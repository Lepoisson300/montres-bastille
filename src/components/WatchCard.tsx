import type { Watch } from "../types/Parts";

interface WatchCardProps {
  montre: Watch;
  index: number;
  etape_actuelle?: number; // Permet de passer le statut depuis la commande parente
}

export default function WatchCard({ montre, index, etape_actuelle = 1 }: WatchCardProps) {
  
  // Fonction utilitaire pour gérer l'affichage du statut en fonction de l'étape
  const getStatusDisplay = (etape: number) => {
    switch (etape) {
      case 0:
        return { text: 'En attente de paiement', style: 'text-red-400 border-red-400/20 bg-red-400/5' };
      case 1:
        return { text: 'En assemblage', style: 'text-amber-400 border-amber-400/20 bg-amber-400/5' };
      case 2:
        return { text: 'Expédiée', style: 'text-blue-400 border-blue-400/20 bg-blue-400/5' };
      case 3:
        return { text: 'Livrée', style: 'text-green-400 border-green-400/20 bg-green-400/5' };
      default:
        return { text: 'En préparation', style: 'text-gray-400 border-gray-400/20 bg-gray-400/5' };
    }
  };

  const currentStatus = getStatusDisplay(etape_actuelle);

  // Fonction pour trouver le nom d'un composant spécifique
  const getPartName = (type: string) => {
    const part = montre.components?.find(c => c.type === type);
    return part ? part.name : "Standard";
  };

  // Liste des détails dynamiques
  const watchDetails = [
    { label: "Boîtier", value: getPartName("case") },
    { label: "Cadran", value: getPartName("dial") },
    { label: "Aiguilles", value: getPartName("hands") },
    { label: "Bracelet", value: getPartName("strap") }
  ];

  return (
    <div className="p-8 rounded-xl relative transition-all duration-500 bg-surface/40 border border-white/5 hover:border-primary/40 hover:-translate-y-1 group flex flex-col h-full">
      
      {/* En-tête : Titre, Statut et Tag */}
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
      
      {/* Visuel de la montre superposé */}
      <div className="relative w-full aspect-square mb-8 bg-dark/20 rounded-lg overflow-hidden flex items-center justify-center">
        {/* On boucle dans le bon ordre pour que les aiguilles soient au-dessus du cadran, etc. */}
        {["case", "dial", "hands", "strap"].map((category) => {
          const part = montre.components?.find((c) => c.type === category);
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

      {/* Détails de la configuration */}
      <div className="space-y-4 flex-grow">
        {watchDetails.map((detail, idx) => (
          <div key={idx} className="flex justify-between items-end">
            <span className="text-sm text-text-muted">{detail.label}</span>
            <div className="flex-grow border-b border-dotted border-white/10 mx-4 mb-1"></div>
            <span className="font-serif text-sm text-text-primary text-right max-w-[50%] truncate" title={detail.value}>
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      
    </div>
  );
}