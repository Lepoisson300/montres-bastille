import React, { useRef, useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import arcClean from "../assets/arcClean.jpg";
import nh35 from "../assets/37.jpg";
import france from "../assets/france.jpg";
import watch2 from "../assets/watch2.png";
import HeroCarousel from "../components/Carousel";
import { Link } from "react-router-dom";

// Background grain
const Grain = () => (
  <svg
    className="pointer-events-none fixed inset-0 -z-10 opacity-[0.05]"
    aria-hidden="true"
  >
    <filter id="n" x="0" y="0">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.8"
        numOctaves="4"
        stitchTiles="stitch"
      />
    </filter>
    <rect width="100%" height="100%" filter="url(#n)" />
  </svg>
);

// Reveal animation
const Reveal = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 120);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="font-serif min-h-screen bg-parchment text-ink">
      <Grain />

      <div className=" md:pt-[120px]">
        {/* HERO – Light */}
        <HeroCarousel images={[arcClean, france, nh35]}>
          <div className="max-w-2xl">
            <p className="tracking-[.25em] text-xs uppercase text-amber-50 font-sans">
              Un bout d'histoire française au poignet
            </p>
            <h1 className="mt-4 mb-6 text-5xl md:text-7xl font-serif text-amber-50 leading-tight tracking-tight">
              Montres-Bastille
            </h1>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/your-watch"
                className="inline-flex rounded-2xl items-center gap-2 bg-amber-50 text-midnight font-sans px-6 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:bg-wheat-600 hover:-translate-y-[2px] hover:shadow-lg"
              >
                <GoArrowUpRight />
                Personnaliser
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-amber-50 text-amber-50 font-sans px-6 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:bg-champagne hover:text-midnight hover:-translate-y-[2px] hover:shadow-lg"
              >
                <GoArrowUpRight />
                Découvrir
              </Link>
            </div>
          </div>
        </HeroCarousel>

        {/* COLLECTION – Dark */}
        <section
          id="collection"
          className=" bg-midnight text-ivory shadow-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <img
              src={nh35}
              alt=""
              className="w-full h-full object-cover object-center scale-110"
            />
          </div>

          <div className="relative z-10 px-6 md:px-12 py-20">
            <Reveal>
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <div>
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-champagne to-transparent mb-8" />
                  <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-6">
                    Découvrez la Collection
                  </h2>
                  <p className="text-lg text-ivory/80 leading-relaxed mb-10">
                    Découvrez les pièces de notre collection, choisis pour représenter au mieux les régions françaises et leur patrimoine.
                    Créez votre bout d'histoire unique.
                  </p>
                  <Link
                    to="/community"
                    className="inline-flex items-center gap-2 rounded-full 
                               border border-champagne px-6 py-3 text-sm font-sans uppercase tracking-[0.2em] 
                               text-champagne transition-all duration-300
                               hover:bg-champagne hover:text-midnight hover:-translate-y-[2px] hover:shadow-lg"
                  >
                    <GoArrowUpRight />
                    Explorer
                  </Link>
                </div>

                <div className="mx-auto max-w-sm">
                  <img
                    src={watch2}
                    alt="Collection"
                    className="w-[280px] drop-shadow-2xl"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* MODELS GRID – Light */}
        <section id="models" className="mt-24 bg-parchment shadow-sm">
          <div className="px-6 md:px-12 py-20">
            <Reveal>
              <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-12">
                Modèles Signature
              </h3>
            </Reveal>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { name: "Mont Saint-Michel", price: "349€", bg: "bg-sand-200" },
                { name: "Côte d'Azur", price: "389€", bg: "bg-sand-300" },
                { name: "Haussmann", price: "429€", bg: "bg-sand-400" },
              ].map((model, i) => (
                <Reveal key={model.name} delay={i + 1}>
                  <div
                    className={`${model.bg} rounded-xl shadow-sm p-6 min-h-[240px] flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}
                  >
                    <div className="flex-1 flex items-center justify-center mb-6">
                      <div className="w-24 h-24 rounded-full bg-parchment border border-wheat-500 shadow flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-ink relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-sand-200 rounded-full"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-1 bg-sand-200 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto text-center">
                      <div className="font-serif text-lg md:text-xl mb-2">
                        {model.name}
                      </div>
                      <div className="text-sm text-ink/70 mb-4">
                        À partir de {model.price}
                      </div>
                      <Link
                        to="/your-watch"
                        className="inline-flex items-center gap-2 text-sm uppercase font-sans tracking-[0.15em] text-champagne 
                                   transition-all duration-300 hover:text-wheat-600 hover:-translate-y-[2px]"
                      >
                        <GoArrowUpRight />
                        Personnaliser
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CUSTOM SECTION – Dark */}
        <section
          id="custom"
          className="mt-24 bg-midnight text-ivory shadow-xl"
        >
          <div className="px-6 md:px-12 py-20">
            <Reveal>
              <div className="text-center max-w-4xl mx-auto">
                <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-6">
                  Faites de votre Montres-Bastille une pièce unique
                </h3>
                <p className="text-lg text-ivory/80 leading-relaxed mb-12">
                  Choisissez le cadran, le mouvement, les aiguilles, la finition
                  du boîtier et le bracelet. Visualisez vos modifications en
                  temps réel, puis commandez votre pièce du patrimoine.
                </p>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-3xl mx-auto mb-12">
                  {[
                    { title: "Cadrans", desc: "12 modèles" },
                    { title: "Aiguilles", desc: "8 styles" },
                    { title: "Boîtiers", desc: "6 finitions" },
                    { title: "Bracelets", desc: "15 options" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl border border-champagne/40 bg-midnight/60 p-6 text-center 
                                 transition-all duration-300 hover:bg-midnight/80 hover:-translate-y-[2px] hover:shadow-lg"
                    >
                      <div className="font-serif text-lg">{item.title}</div>
                      <div className="text-sm text-ivory/70 mt-1">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/your-watch"
                  className="inline-flex items-center gap-2 rounded-full bg-champagne text-midnight font-sans px-8 py-4 text-base uppercase tracking-[0.2em] 
                             transition-all duration-300 shadow-md
                             hover:bg-wheat-600 hover:-translate-y-[2px] hover:shadow-lg"
                >
                  <GoArrowUpRight />
                  Commencer la Personnalisation
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}