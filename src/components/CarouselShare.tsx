import { useState } from 'react';
import type { SharedWatch } from '../types/Parts';
import { useAuth0 } from "@auth0/auth0-react";
import { useAlert } from "../Logic/AlertContext";

interface carouselInterface {
    sharedWatch: SharedWatch[]
}
const apiAddress = import.meta.env.VITE_API_URL;

export default function CarouselShare({ sharedWatch }: carouselInterface) {
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

    if(sharedWatch.length<1){
        return;
    }

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen  overflow-hidden py-10">

            {/* Conteneur du Carousel */}
            <div className="relative w-full max-w-6xl h-[500px] flex items-center justify-center mb-12">
                {sharedWatch.map((shared, index) => (
                    <div
                        key={index}
                        className={`${getStyles(index)} bg-black/90 backdrop-blur-xs w-[400px] h-full cursor-pointer flex flex-col justify-between overflow-hidden rounded-2xl`}
                        onClick={() => setActiveIndex(index)}
                    >
                        {/* 1. L'EFFET DE FLOU (OUTER GLOW) */}
                        <div className="absolute inset-0 bg-purple-600/60 rounded-2xl blur-xl transform group-hover:scale-105 transition-all duration-500 z-0"></div>

                        {/* 2. LA CARTE PRINCIPALE */}
                        <div
                            className={`${getStyles(index)} relative bg-slate-900 w-full h-full cursor-pointer flex flex-col justify-between overflow-hidden rounded-2xl z-10 border border-white/10`}
                            onClick={() => setActiveIndex(index)}
                        >
                            {/* EN-TÊTE : Le bouton vote */}
                            <div className="flex justify-start w-full pt-5 pl-5 z-20">
                        <div
                            
                            className="text-white font-sans text-sm font-bold whitespace-nowrap bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 transition-colors"
                        >
                            {shared.watch.votes || (shared.votes ? shared.votes.length : 0)} ❤️
                        </div>
                    </div>

                    {/* MILIEU : Le conteneur de la montre (Positionné en absolu pour prendre tout le fond) */}
                    <div className="absolute inset-0 flex items-center justify-center w-full h-full z-10">
                        {["dial", "case", "strap", "hand"].map((category) => {
                            const part = shared.watch.components?.find((c) => c.type === category);
                            if (!part || !part.thumbnail) return null;

                            return (
                                <img
                                    key={part.id || category}
                                    src={part.thumbnail}
                                    alt={`Composant ${category} : ${part.name}`}
                                    className="absolute inset-0 w-full h-full scale-125 object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)] transition-transform duration-700"
                                />
                                    );
                                })}
                            </div>

                            {/* OVERLAY DÉGRADÉ INTÉRIEUR (Comme sur l'image : sombre en bas, transparent en haut) */}
                            {/* Remplace la couleur from-[#3A225E] par celle qui correspond à ton design */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#3A225E] via-[#3A225E]/70 to-transparent z-15 mt-auto h-1/4 pointer-events-none"></div>

                            {/* PIED DE CARTE : Le texte et le faux bouton (Basé sur l'image) */}
                            <div className="relative flex flex-col justify-end p-6 w-full z-20 mt-auto h-full">
                                <h3 className="text-white text-3xl font-bold tracking-wide mb-1 drop-shadow-md">
                                    {shared.watch.name || 'Montre Custom'}
                                </h3>
                                <p className="text-white/80 text-sm mb-5">
                                    Créée par {shared.watch.creator || 'Anonyme'}
                                </p>
                                
                                {/* Le bloc type "Explore Now" de l'image */}
                                <button 
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    voteLike(shared.watch.name);
                                }}
                                disabled={likedWatches.has(shared.watch.name)}
                                className="flex items-center justify-between bg-[#2a1744]/80 backdrop-blur-sm hover:bg-[#3d2263] transition-colors p-4 rounded-xl border border-white/5">
                                    <span className="text-white/90 text-sm font-medium">Soutenir cette création</span>
                                    <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
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