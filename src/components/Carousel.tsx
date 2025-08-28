import React, { useEffect, useState } from "react";

type HeroCarouselProps = {
  images: string[];
  interval?: number;
  children?: React.ReactNode;
  roundedBottom?: boolean; // control rounding
};

const HeroCarousel: React.FC<HeroCarouselProps> = ({
  images,
  interval = 7000,
  children,
  roundedBottom = false,
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <section
      className={`relative h-[90vh] w-full overflow-hidden ${
        roundedBottom ? "rounded-b-2xl" : "rounded-b-none"
      }`}
    >
      {/* Images */}
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? "opacity-100 z-0" : "opacity-0 z-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-center bg-cover transition-transform duration-[7000ms] ease-out"
            style={{
              backgroundImage: `url(${src})`,
              transform: i === current ? "scale(1.1)" : "scale(1)",
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 z-10">
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          </div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-30 flex h-full items-center justify-center text-center px-6">
        <div className="drop-shadow-xl">{children}</div>
      </div>

      {/* Bullets */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              i === current ? "bg-champagne scale-110" : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
