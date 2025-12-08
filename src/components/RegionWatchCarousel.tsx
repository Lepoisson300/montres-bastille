import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';

// Define the type for a complete watch
export interface UserWatch {
  id: string;
  name: string;
  creator: string;
  image: string;
  regionId: string;
}

interface RegionWatchesCarouselProps {
  watches: UserWatch[];
}

export default function RegionWatchesCarousel({ watches }: RegionWatchesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no watches exist for this region, show a placeholder
  if (!watches || watches.length === 0) {
    return (
      <div className="w-full h-64 bg-neutral-900/50 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center p-6">
        <p className="text-neutral-400 italic mb-2">Aucune création pour le moment.</p>
        <p className="text-bastilleGold text-sm">Soyez le premier à créer une montre pour cette région !</p>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % watches.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + watches.length) % watches.length);
  };

  const currentWatch = watches[currentIndex];

  return (
    <div className="relative w-full mb-8 group">
      {/* Watch Image Container */}
      <div className="relative h-72 w-full overflow-hidden rounded-xl bg-gradient-to-b from-neutral-800/30 to-neutral-900/50 border border-white/5 flex items-center justify-center">
        
        {/* Main Image */}
        <div key={currentIndex} className="animate-fadeIn transition-opacity duration-500 p-4 h-full flex items-center justify-center">
           <img 
             src={currentWatch.image} 
             alt={currentWatch.name}
             className="max-h-full max-w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500"
           />
        </div>

        {/* Creator Tag (Overlay) */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full py-1.5 px-3 flex items-center gap-2">
            <User size={12} className="text-bastilleGold" />
            <span className="text-xs text-neutral-300">Par {currentWatch.creator}</span>
        </div>

        {/* Navigation Arrows */}
        {watches.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/70 hover:bg-bastilleGold hover:text-black transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/70 hover:bg-bastilleGold hover:text-black transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Watch Info */}
      <div className="text-center mt-4 space-y-1">
        <h3 className="text-xl font-serif text-white tracking-wide">
          {currentWatch.name}
        </h3>
        
        {/* Dots Indicators */}
        {watches.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {watches.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-bastilleGold' : 'w-1.5 bg-neutral-700'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}