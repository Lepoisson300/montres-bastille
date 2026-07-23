import type { Region } from "../types/Parts"

interface regionCardInterface{
    region : Region;
    votedRegions : Set<string>;
    vote(type:string,name:string) : void
}

export default function RegionCard({region, votedRegions, vote}: regionCardInterface){

    return(
        <div className="bg-surface rounded-3xl p-8 sm:p-10 transition-all duration-300 ease-in-out shadow-[8px_8px_18px_rgba(0,0,0,0.5),-8px_-8px_18px_rgba(255,255,255,0.03)] hover:shadow-[10px_10px_22px_rgba(0,0,0,0.6),-10px_-10px_22px_rgba(255,255,255,0.04)]">
            {/* En-tête de la carte */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl text-text-primary">{region.name}</h3>
                <div className="text-primary font-sans text-sm font-bold">
                {region.votes} votes
                </div>
            </div>

            {/* Conteneur de l'image (Effet Creusé / Inset) */}
            <div className="w-full h-40 p-1.5 rounded-2xl bg-surface shadow-[inset_6px_6px_12px_rgba(0,0,0,0.5),inset_-6px_-6px_12px_rgba(255,255,255,0.03)] mb-6">
                <div className="w-full h-full overflow-hidden rounded-xl">
                <img 
                    src={region.img} 
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" 
                    alt={`Patrimoine de la région ${region.name} - Inspiration pour Montre Bastille`} 
                    loading="lazy"
                />
                </div>
            </div>
            
            {/* Bouton Neumorphique Dynamique */}
            <button
                onClick={() => vote('r', region.name)}
                disabled={votedRegions.has(region.name)}
                aria-label={`Voter pour la région ${region.name}`}
                className={`w-full py-3.5 rounded-xl text-sm font-sans uppercase tracking-wider transition-all duration-300 bg-surface ${
                votedRegions.has(region.name)
                    ? 'shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.02)] text-primary/40 cursor-not-allowed'
                    : 'shadow-[6px_6px_12px_rgba(0,0,0,0.5),-6px_-6px_12px_rgba(255,255,255,0.03)] text-primary hover:text-primary hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.03)]'
                }`}
            >
                {votedRegions.has(region.name) ? 'Vote enregistré' : 'Voter pour cette région'}
            </button>

            </div>
    )
}