import { useState, useEffect } from "react";
import type { PartOption } from "../types/Parts"; 

export const REGION_NAMES: Record<string, string> = {
  "FR-A": "Alsace", "FR-B": "Aquitaine", "FR-C": "Auvergne", "FR-D": "Bourgogne",
  "FR-E": "Bretagne", "FR-F": "Centre-Val de Loire", "FR-G": "Champagne-Ardenne",
  "FR-H": "Corse", "FR-I": "Franche-Compté", "FR-J": "Ile-deFrance",
  "FR-K": "Languedoc-Roussillon", "FR-L": "Limousin", "FR-M": "Lorraine",
  "FR-N": "Midi-Pyrénées", "FR-O": "Nord-Pas-de-Calais", "FR-P": "Basse-Normandie",
  "FR-Q": "Haute-Normandie", "FR-R": "Pays de la Loire", "FR-S": "Picardie",
  "FR-T": "Poitou-Charentes", "FR-U": "Provence-Alpes-Côte d'Azur", "FR-V": "Rhône-Alpes",
};

type FrenchPartsCarouselProps = {
  parts: PartOption[];
};

// Fonction utilitaire
const getRegionsArray = (regions: any): string[] => {
  if (!regions) return [];
  if (Array.isArray(regions)) return regions;
  if (typeof regions === 'object') return Object.values(regions);
  if (typeof regions === 'string') return [regions];
  return [];
};

export default function ComponentsCarousel({ parts }: FrenchPartsCarouselProps) {
  
  // 1. Filtrage
  const frenchComponents = parts.filter(part => {
    const regionsArray = getRegionsArray(part.regions);
    const isFrench = regionsArray.some(r => 
      typeof r === 'string' && (r.startsWith("FR-") || REGION_NAMES[r])
    );
    const partType = part.type ? part.type.toLowerCase() : "";
    const isNotBoitier = partType !== "boitier" && partType !== "case";
    const isNotAiguilles = partType !== "aiguilles" && partType !== "hands" && partType !== "hand";
    return isFrench && isNotBoitier && isNotAiguilles;
  });

  // 2. Gestion de l'état
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === frenchComponents.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? frenchComponents.length - 1 : prev - 1));
  };

  // 3. Défilement automatique
  useEffect(() => {
    if (frenchComponents.length === 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // Défilement toutes les 5 secondes
    return () => clearInterval(timer);
  }, [frenchComponents.length]);

  // 4. Fallback si aucun composant
  if (frenchComponents.length === 0) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center border border-primary/20 bg-[#0A0A0A]/50 rounded-sm">
        <p className="text-white/50 text-sm font-light">Chargement des composants d'exception...</p>
      </div>
    );
  }

  // Calculs pour le conteneur coulissant (permet un glissement CSS parfait)
  const trackWidth = `${frenchComponents.length * 100}%`;
  const slideWidth = `${100 / frenchComponents.length}%`;
  const transformX = `translateX(-${currentSlide * (100 / frenchComponents.length)}%)`;

  return (
    <div className="relative w-full overflow-hidden group py-4">
      
      {/* PISTE DE DÉFILEMENT (Track) */}
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ width: trackWidth, transform: transformX }}
      >
        {frenchComponents.map((comp) => {
          const regionsArray = getRegionsArray(comp.regions);
          const partType = comp.type ? comp.type.toLowerCase() : "";
          const shouldZoomOnHover = partType === 'dial' || partType === 'strap';
          
          return (
            // CONTENEUR DE LA CARTE INDIVIDUELLE
            <div 
              key={comp.id} 
              className="px-2" 
              style={{ width: slideWidth }}
            >
              <div className="bg-[#0f0f0f] border border-primary/20 shadow-2xl rounded-lg overflow-hidden flex flex-col h-[480px]">
                
                {/* HAUT DE LA CARTE : Image */}
                <div className="h-3/5 w-full relative overflow-hidden bg-black border-b border-primary/10">
                    {comp.type==='dial'&&
                        <img 
                            src={comp.thumbnail} 
                            alt={comp.name} 
                            className={`w-full h-full object-cover grayscale-[20%] contrast-125 scale-200 transition-transform duration-700 ${
                            shouldZoomOnHover ? " hover:grayscale-0" : ""
                            }`}
                        />
                    }
                    <img 
                            src={comp.thumbnail} 
                            alt={comp.name} 
                            className={`w-full h-full object-cover scale-115 grayscale-[20%] contrast-125 transition-transform duration-700 ${
                            shouldZoomOnHover ? "hover:scale-120 hover:grayscale-0" : ""
                            }`}
                        />
                  
                  {/* Badge de la région en superposition */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/10">
                    <p className="text-primary/90 text-[10px] tracking-[0.2em] uppercase">
                      {regionsArray.map(r => REGION_NAMES[r] || r).join(" • ")}
                    </p>
                  </div>
                </div>
                
                {/* BAS DE LA CARTE : Informations */}
                <div className="h-2/5 p-6 flex flex-col justify-center bg-gradient-to-b from-[#111111] to-[#0a0a0a]">
                  <h3 className="font-serif text-2xl text-white mb-2">{comp.name}</h3>
                  <p className="text-primary/80 text-xs uppercase tracking-widest mb-3">
                    {comp.material}
                  </p>
                  <p className="text-white/60 text-sm font-light leading-relaxed line-clamp-3">
                    {comp.description}
                  </p>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* CONTRÔLES : Flèches */}
      <button 
        onClick={prevSlide} 
        className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/60 hover:bg-primary text-white hover:text-dark rounded-full backdrop-blur-sm border border-white/10 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 disabled:opacity-0"
        aria-label="Composant précédent"
      >
        <svg className="w-6 h-6 ml-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      
      <button 
        onClick={nextSlide} 
        className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/60 hover:bg-primary text-white hover:text-dark rounded-full backdrop-blur-sm border border-white/10 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 disabled:opacity-0"
        aria-label="Composant suivant"
      >
        <svg className="w-6 h-6 mr-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
      </button>

      {/* INDICATEURS : Points sous la carte */}
      <div className="mt-4 bottom-0 left-0 w-full flex justify-center gap-3 pb-2 z-20">
        {frenchComponents.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Voir le composant ${index + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              index === currentSlide ? "bg-primary w-8 shadow-[0_0_8px_rgba(201,169,110,0.8)]" : "bg-white/20 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

    </div>
  );
}