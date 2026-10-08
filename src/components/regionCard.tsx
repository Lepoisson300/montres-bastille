import type { Region } from "../types/Parts"

interface regionCardInterface{
    region : Region;
    votedRegions : Set<string>;
    vote(type:string,name:string) : void;
    isActive?: boolean;
    onClick?: () => void;
}

export default function RegionCard({region, votedRegions, vote, isActive, onClick}: regionCardInterface){
    return(
        <div 
            onClick={onClick}
            className={`relative w-64 md:w-80 h-96 md:h-[500px] rounded-3xl overflow-hidden cursor-pointer group transition-all duration-500 ease-out transform ${isActive ? 'scale-105 shadow-2xl z-10 border-2 border-white/30' : 'scale-95 opacity-70 hover:opacity-100 hover:scale-100 border border-white/10 shadow-lg'}`}
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img 
                    src={region.img} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    alt={`Patrimoine de la région ${region.name}`} 
                    loading="lazy"
                />
            </div>
            
            {/* Gradient Overlay for Text Readability */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'bg-gradient-to-t from-black/90 via-black/30 to-transparent' : 'bg-gradient-to-t from-black/80 via-black/40 to-black/20'}`}></div>

            {/* Top Stats / Avatar */}
            <div className="absolute top-6 left-6 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white/50 bg-black/40 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">{region.votes}</span>
                </div>
                <div className="text-white/80 text-xs font-sans uppercase tracking-widest bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    Votes
                </div>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end">
                <h3 className="font-serif text-3xl md:text-4xl text-white mb-2 leading-none tracking-tight drop-shadow-md group-hover:text-primary transition-colors duration-300">
                    {region.name}
                </h3>
                <p className="text-white/70 text-sm font-sans uppercase tracking-widest mb-6">
                    Héritage Français
                </p>
                
                {/* Voting Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        vote('r', region.name);
                    }}
                    disabled={votedRegions.has(region.name)}
                    className={`w-full py-4 rounded-xl text-sm font-sans uppercase tracking-widest transition-all duration-300 backdrop-blur-md border ${
                        votedRegions.has(region.name)
                            ? 'bg-white/10 text-white/50 border-white/10 cursor-not-allowed'
                            : 'bg-primary/90 text-dark border-primary hover:bg-primary hover:shadow-[0_0_15px_rgba(209,185,148,0.5)]'
                    }`}
                >
                    {votedRegions.has(region.name) ? 'Vote enregistré' : 'Voter'}
                </button>
            </div>
        </div>
    )
}