import React, { useState, useEffect } from 'react';
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
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    // Deeper, luxury colors
    const colors = ['#1a2e35', '#3d2b1f', '#2a2a2a', '#1e3a5f', '#4a3b2c', '#2c3e50'];
    const getColor = (index: number) => colors[index % colors.length];
    const { showAlert } = useAlert();

    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    useEffect(() => {
        setWatches(sharedWatch || []);
    }, [sharedWatch]);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev === watches.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev === 0 ? watches.length - 1 : prev - 1));
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > 50) {
            nextSlide();
        } else if (distance < -50) {
            prevSlide();
        }
        setTouchStart(0);
        setTouchEnd(0);
    };

    const voteLike = async (watchShareName: string) => {
        if (!isAuthenticated) {
            showAlert('warning', 'Vous devez être connecté pour voter ou soutenir une création.');
            return;
        }

        if (watchShareName && likedWatches.has(watchShareName)) {
            showAlert('info', 'Vous avez déjà soutenu cette création.');
            return;
        }

        const watch = watches.find(w => w.watch.name === watchShareName);
        if (!watch) return;

        const likeData = { email: user?.email, elem: watch.watch.name, type: 'w' };
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_IDENTIFIER
            }
        });
        fetch(`${apiAddress}/api/users/vote`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            body: JSON.stringify(likeData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showAlert('info', data.error);
                    return;
                }

                setWatches(prevWatches => {
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

        if (offset < 0) offset += numItems; // Wrap around to the right

        if (offset === 0) {
            return "absolute transition-all duration-700 ease-out z-50 scale-100 translate-x-0 opacity-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl cursor-pointer";
        } else if (offset === 1) {
            return "absolute transition-all duration-700 ease-out z-40 scale-[0.85] translate-x-[60%] md:translate-x-[90%] opacity-90 shadow-xl rounded-2xl cursor-pointer";
        } else if (offset === 2) {
            return "absolute transition-all duration-700 ease-out z-30 scale-[0.70] translate-x-[120%] md:translate-x-[180%] opacity-60 shadow-lg rounded-2xl cursor-pointer";
        } else if (offset === 3) {
            return "absolute transition-all duration-700 ease-out z-20 scale-[0.55] translate-x-[180%] md:translate-x-[270%] opacity-30 rounded-2xl cursor-pointer";
        } else {
            return "absolute transition-all duration-700 ease-out opacity-0 z-0 scale-50 translate-x-[240%] pointer-events-none";
        }
    };

    if (watches.length < 1) {
        return null;
    }

    const activeWatch = watches[activeIndex];
    const activeThemeColor = getColor(activeIndex);
    const activeVotes = activeWatch.voteCount !== undefined ? activeWatch.voteCount : (activeWatch.watch.votes || (activeWatch.votes ? activeWatch.votes.length : 0));

    return (
        <div
            className="relative w-full min-h-screen overflow-hidden py-20 transition-colors duration-1000 ease-in-out flex flex-col md:flex-row items-center"
            style={{ backgroundColor: activeThemeColor }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none"></div>

            {/* Left Side: Info */}
            <div className="w-full md:w-1/2 px-8 md:px-16 lg:px-24 flex flex-col justify-center z-20 text-white min-h-[40vh] md:min-h-auto">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full border-2 border-primary/50 bg-black/40 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">{activeVotes}</span>
                    </div>
                    <div className="text-primary font-sans uppercase tracking-widest text-sm font-semibold">
                        Votes de la communauté
                    </div>
                </div>

                <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-4 drop-shadow-xl uppercase leading-tight">
                    {activeWatch.watch.name || 'Montre Custom'}
                </h2>
                <p className="text-xl md:text-2xl text-white/80 mb-10 font-sans tracking-wide">
                    Créée par <span className="text-primary font-medium">{activeWatch.watch.creator || 'Anonyme'}</span>
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6">


                    {/* Navigation */}
                    <div className="flex w-full">
                        <button
                            onClick={() => voteLike(activeWatch.watch.name)}
                            disabled={likedWatches.has(activeWatch.watch.name)}
                            className={`w-full flex items-center justify-center h-[50px] md:px-10 md:py-5 px-4 py-3 rounded-xl text-xs md:text-[18px] transition-all duration-300 ${likedWatches.has(activeWatch.watch.name)
                                ? 'bg-white/10 text-white/50 border border-white/10 cursor-not-allowed'
                                : 'bg-primary text-dark border border-primary hover:bg-primary-light hover:-translate-y-1'
                                }`}
                        >
                            {likedWatches.has(activeWatch.watch.name) ? 'Vote enregistré' : 'Soutenir'}
                        </button>
                        <div className='flex flex-row justify-end gap-4 ml-3'>
                            <button
                                onClick={prevSlide}
                                className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors backdrop-blur-sm"
                                aria-label="Précédent"
                            >
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors backdrop-blur-sm"
                                aria-label="Suivant"
                            >
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Right Side: Cards */}
            <div className="md:ml-6 w-full md:w-1/2 relative h-[450px] md:h-[600px] flex items-center justify-center md:justify-start z-10 mt-4 md:mt-0 px-4 md:px-0">
                <div className="relative w-64 sm:w-72 md:w-80 h-full max-h-[500px]">
                    {watches.map((shared, index) => {
                        const themeColor = getColor(index);

                        return (
                            <div
                                key={index}
                                className={`${getStyles(index)} w-full h-full border border-white/10`}
                                onClick={() => setActiveIndex(index)}
                                style={{
                                    background: `linear-gradient(to bottom, #111 0%, ${themeColor} 100%)`
                                }}
                            >
                                {/* Card Text (visible on non-active cards slightly, or we can keep it clean) */}
                                <div className="absolute top-6 left-6 z-20 flex flex-col">
                                    <h3 className="text-white/90 font-serif text-2xl uppercase font-bold tracking-wider">
                                        {shared.watch.name}
                                    </h3>
                                    <div className="text-white/50 text-xs font-sans uppercase tracking-widest mt-1">
                                        {shared.watch.creator || 'Anonyme'}
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
                                                className="absolute inset-0 w-full h-full scale-[1.3] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-transform duration-700"
                                            />
                                        );
                                    })}
                                </div>

                                <div className="absolute inset-0 z-15 mt-auto h-1/3 pointer-events-none"
                                    style={{ background: `linear-gradient(to top, ${themeColor}, transparent)` }}>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
