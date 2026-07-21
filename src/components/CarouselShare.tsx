import { useState, useEffect } from 'react';
import type { SharedWatch } from '../types/Parts';
import { useAuth0 } from "@auth0/auth0-react";
import { useAlert } from "../Logic/AlertContext";

interface carouselInterface {
    sharedWatch: SharedWatch[]
}
const apiAddress = import.meta.env.VITE_API_URL;

export default function CarouselShare({ sharedWatch }: carouselInterface) {
    const [watches, setWatches] = useState<SharedWatch[]>((sharedWatch || []));
    
    const [activeIndex, setActiveIndex] = useState(0);
    const [likedWatches, setLikedWatches] = useState<Set<string>>(new Set());
    const { user, isAuthenticated } = useAuth0();
    
    const colors = ['#5D4037', '#D1B994', '#2F3E46', '#B8B8B8', '#C9A96E'];
    const getColor = (index: number) => colors[index % colors.length];
    const { showAlert } = useAlert();

    // Permet de synchroniser l'état local si le composant parent met à jour les props
    useEffect(() => {
        setWatches(sharedWatch || []);
    }, [sharedWatch]);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev === watches.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev === 0 ? watches.length - 1 : prev - 1));
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

        // On cherche dans notre état local "watches"
        const watch = watches.find(w => w.watch.name === watchShareName);
        if (!watch) return;

        const likeData = { email: user?.email, elem: watch.watch.name, type: 'w' };

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

                setWatches(prevWatches => {
                    // on retourne un tableau vide pour empêcher le crash du .map()
                    if (!Array.isArray(prevWatches)) return [];

                    return prevWatches.map(w => {
                        if (w.watch.name === watch.watch.name) {
                            const currentVotes = w.voteCount || (w.votes ? w.votes.length : 0);
                            return { ...w, voteCount: currentVotes + 1 };
                        }
                        return w;
                    });
                });

                setLikedWatches(prev => new Set(prev).add(watch.watch.name));
                showAlert('success', 'Votre vote pour cette création a été enregistré !');
            })
            .catch((error) => console.error('Error updating like:', error));
    };

    const getStyles = (index: number) => {
        let offset = index - activeIndex;
        const numItems = watches.length;

        if (offset < -Math.floor(numItems / 2)) offset += numItems;
        if (offset > Math.floor(numItems / 2)) offset -= numItems;

        let classes = "absolute transition-all duration-500 ease-in-out opacity-0 z-0 scale-50 pointer-events-none";

        if (offset === 0) {
            classes = "absolute transition-all duration-500 ease-in-out z-50 scale-100 translate-x-0 opacity-100 shadow-2xl rounded-2xl pointer-events-auto";
        } else if (offset === -1) {
            classes = "absolute transition-all duration-500 ease-in-out z-40 scale-[0.80] -translate-x-[110%] opacity-80 shadow-xl rounded-2xl pointer-events-none";
        } else if (offset === 1) {
            classes = "absolute transition-all duration-500 ease-in-out z-40 scale-[0.80] translate-x-[110%] opacity-80 shadow-xl rounded-2xl pointer-events-none";
        } else if (offset === -2) {
            classes = "absolute transition-all duration-500 ease-in-out z-30 scale-[0.65] -translate-x-[160%] opacity-50 rounded-2xl pointer-events-none";
        } else if (offset === 2) {
            classes = "absolute transition-all duration-500 ease-in-out z-30 scale-[0.65] translate-x-[160%] opacity-50 rounded-2xl pointer-events-none";
        }

        return classes;
    };

    if (watches.length < 1) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen overflow-hidden py-10">

            <div className="relative w-full max-w-6xl h-[500px] flex items-center justify-center mb-12">
                {/* On map désormais sur l'état local "watches" et non plus sur la prop "sharedWatch" */}
                {watches.map((shared, index) => {
                    const themeColor = getColor(index);

                    return (
                        <div
                            key={index}
                            className={`${getStyles(index)} bg-black/90 backdrop-blur-xs w-[400px] h-full cursor-pointer flex flex-col justify-between overflow-hidden rounded-2xl`}
                            onClick={() => setActiveIndex(index)}
                        >
                            <div
                                className="absolute inset-0 rounded-2xl blur-xl transform group-hover:scale-105 transition-all duration-500 z-0"
                                style={{ backgroundColor: themeColor }}
                            ></div>
                            
                            <div
                                className={`${getStyles(index)} relative w-full h-full cursor-pointer flex flex-col justify-between overflow-hidden rounded-2xl z-10 border border-white/10`}
                                onClick={() => setActiveIndex(index)}
                                style={{
                                    background: `linear-gradient(to bottom, #1e293b 0%, ${themeColor} 100%)`
                                }}
                            >
                                <div className="flex justify-start w-full pt-5 pl-5 z-20">
                                    <div className="text-white font-sans text-sm font-bold whitespace-nowrap bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 transition-colors">
                                        {/* Affiche dynamiquement voteCount mis à jour localement, ou la longueur du tableau si pas encore voté */}
                                        {shared.voteCount !== undefined ? shared.voteCount : (shared.watch.votes || (shared.votes ? shared.votes.length : 0))} ❤️
                                    </div>
                                </div>

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

                                <div
                                    className="absolute inset-0 z-15 mt-auto h-1/4 pointer-events-none"
                                    style={{
                                        background: `linear-gradient(to top, ${themeColor}, ${themeColor}B3, transparent)`
                                    }}
                                ></div>

                                <div className="relative flex flex-col justify-end p-6 w-full z-20 mt-auto h-full">
                                    <h3 className="text-white text-3xl font-bold tracking-wide mb-1 drop-shadow-md">
                                        {shared.watch.name || 'Montre Custom'}
                                    </h3>
                                    <p className="text-white/80 text-sm mb-5">
                                        Créée par {shared.watch.creator || 'Anonyme'}
                                    </p>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            voteLike(shared.watch.name);
                                        }}
                                        disabled={likedWatches.has(shared.watch.name)}
                                        style={{
                                            backgroundColor: `${themeColor}4D`
                                        }}
                                        className="group flex items-center justify-between backdrop-blur-sm transition-colors p-4 rounded-xl border border-white/20 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="text-white/90 text-sm font-medium">Soutenir cette création</span>
                                        <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Boutons de navigation */}
            <div className="flex mt-16 space-x-6 z-10">
                <button
                    onClick={prevSlide}
                    className="p-3 rounded-full border border-amber-400 text-gray-700 hover:bg-white/10 transition-colors focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>

                <button
                    onClick={nextSlide}
                    className="p-3 rounded-full border border-amber-400 text-gray-700 hover:bg-white/10 transition-colors focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
