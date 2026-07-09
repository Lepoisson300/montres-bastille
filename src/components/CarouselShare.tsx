import { useState } from 'react';
import type { SharedWatch} from '../types/Parts';
import { useAuth0 } from "@auth0/auth0-react";
import { useAlert } from "../Logic/AlertContext";

interface carouselInterface{
    sharedWatch:SharedWatch[]
}
const apiAddress = import.meta.env.VITE_API_URL;

export default function CarouselShare({sharedWatch}:carouselInterface){
    const [activeIndex, setActiveIndex] = useState(0);
    const [likedWatches, setLikedWatches] = useState<Set<string>>(new Set()); // Ajout du state manquant
    const { user, isAuthenticated } = useAuth0();
    const { showAlert } = useAlert();
    console.log(sharedWatch)
    // Fonctions de navigation
    const nextSlide = () => {
        setActiveIndex((prev) => (prev === sharedWatch.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev === 0 ? sharedWatch.length - 1 : prev - 1));
    };

    const voteLike = (watchShareName: string) => {
        if (!isAuthenticated) {
        showAlert('warning', 'Vous devez être connecté pour voter ou soutenir une création.');
        return;
        }

        if (watchShareName && likedWatches.has(watchShareName)) {
            showAlert('info', 'Vous avez déjà soutenu cette création.');
            return;
        }

        const watch = sharedWatch.find(w => w.watch.name === watchShareName);
        if (!watch) return;

        // Nouveau format attendu par ton backend unifié
        const likeData = { email: user?.email, elem: watch.watch.name, type: 'w' };

        // On tape désormais sur la même route !
        fetch(`${apiAddress}/api/users/vote`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(likeData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
            showAlert('info', data.error);
            return;
            }

            setLikedWatches(prevWatches => 
            prevWatches.map(w => {
                if (w.watch.name === watch.watch.name) {
                const currentVotes = w.voteCount || (w.votes ? w.votes.length : 0);
                return { ...w, voteCount: currentVotes + 1 };
                }
                return w;
            })
            );

            setLikedWatches(prev => new Set(prev).add(watch.watch.name));
            showAlert('success', 'Votre vote pour cette création a été enregistré !');
        })
        .catch((error) => console.error('Error updating like:', error));
        
  };

    // Fonction pour calculer les classes Tailwind en fonction de la position relative
    const getStyles = (index) => {
        // Calcul de la distance par rapport à l'image active
        let offset = index - activeIndex;
        const numItems = sharedWatch.length;

        // Logique pour gérer la boucle infinie du carousel
        if (offset < -Math.floor(numItems / 2)) offset += numItems;
        if (offset > Math.floor(numItems / 2)) offset -= numItems;

        // Styles par défaut (images cachées ou très éloignées)
        let classes = "absolute transition-all duration-500 ease-in-out opacity-60 z-0 scale-50";

        // Application des styles selon le décalage (offset)
        if (offset === 0) {
        // Image Centrale
        classes = "absolute transition-all duration-500 ease-in-out z-10 scale-100 translate-x-0 opacity-100 shadow-2xl rounded-2xl";
        } else if (offset === -1) {
        // Image à gauche directe
        classes = "absolute transition-all duration-500 ease-in-out z-40 scale-[0.80] -translate-x-[80%] opacity-100 shadow-xl rounded-2xl";
        } else if (offset === 1) {
        // Image à droite directe
        classes = "absolute transition-all duration-500 ease-in-out z-40 scale-[0.80] translate-x-[80%] opacity-100 shadow-xl rounded-2xl";
        } else if (offset === -2) {
        // Image extrême gauche
        classes = "absolute transition-all duration-500 ease-in-out z-30 scale-[0.65] -translate-x-[110%] opacity-70 rounded-2xl";
        } else if (offset === 2) {
        // Image extrême droite
        classes = "absolute transition-all duration-500 ease-in-out z-30 scale-[0.65] translate-x-[110%] opacity-70 rounded-2xl";
        }

        return classes;
    };

    return(
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-black/40  overflow-hidden py-10">
      
        {/* Conteneur du Carousel */}
        <div className="relative w-full max-w-6xl h-[400px] flex items-center justify-center mb-12">
            {sharedWatch.map((shared, index) => (
                <div
                    key={index}
                    className={`${getStyles(index)} bg-black/90 backdrop-blur-xs w-[400px] h-full cursor-pointer flex flex-col justify-between overflow-hidden rounded-2xl`}
                    onClick={() => setActiveIndex(index)} 
                >
                {/* EN-TÊTE : Le bouton vote */}
                <div className="flex justify-start w-full pt-3 pl-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Empêche de déclencher le clic de la carte
                            voteLike(shared.watch.name);
                        }}
                        disabled={likedWatches.has(shared.watch.name)}
                        className="text-primary font-sans text-sm font-bold whitespace-nowrap bg-primary/20 px-3 py-1 rounded-full z-10"
                    >
                        {shared.watch.votes || (shared.votes ? shared.votes.length : 0)} ❤️
                    </button>
                </div>

                {/* MILIEU : Le conteneur de la montre */}
                <div className="relative flex-1 flex items-center justify-center w-full my-4">
                    {["dial","case", "strap", "hand"].map((category) => {
                        const part = shared.watch.components?.find((c) => c.type === category);
                        if (!part || !part.thumbnail) return null;
                        
                        return (
                            <img
                                key={part.id || category}
                                src={part.thumbnail}
                                alt={`Composant ${category} : ${part.name}`}                            
                                className="absolute inset-0 w-full h-full scale-150 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700"
                            />
                        );
                    })}
                </div>

                {/* PIED DE CARTE : Le texte */}
                <div className='bg-white/10 p-4 w-full backdrop-blur-xs'>
                    <p className="text-white font-medium">
                        Montre Créée par {shared.watch.creator || 'Anonyme'}
                    </p>
                </div>
    </div>
            ))}
        </div>

        {/* Boutons de navigation */}
        <div className="flex mt-16 space-x-6 z-10">
            <button
            onClick={prevSlide}
            className="p-3 rounded-full border border-amber-400 text-gray-700 hover:bg-accent transition-colors focus:outline-none"
            >
            {/* Icône Flèche Gauche (SVG) */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            </button>
            
            <button
            onClick={nextSlide}
            className="p-3 rounded-full border border-amber-400 text-gray-700 hover:bg-accent transition-colors focus:outline-none"
            >
            {/* Icône Flèche Droite (SVG) */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            </button>
        </div>

    </div>
    )
}