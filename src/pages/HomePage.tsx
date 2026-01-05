import React, { useRef, useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import arcClean from "/arcClean.png";
import patrimoine from "/patrimoine.png";
import france from "/franceMap.png";
import watch2 from "/watch2.png";
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
    <div className="font-sans min-h-screen bg-background text-text-secondary">
      <Grain />

        {/* HERO – Dark with overlay */}
        <HeroCarousel images={[arcClean, france, patrimoine]}>
          <div className="max-w-2xl">
            <p className="tracking-[.25em] text-xs uppercase text-text-primary font-sans opacity-90">
              Un morceau d'histoire française au poignet
            </p>
            <h1 className="mt-4 mb-6 text-5xl md:text-7xl font-serif text-text-primary leading-tight tracking-tight">
              Montres-Bastille
            </h1>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/region-page"
                className="inline-flex rounded-2xl items-center gap-2 bg-primary text-dark font-sans px-6 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:bg-primary-dark hover:-translate-y-[2px] hover:shadow-lg"
              >
                <GoArrowUpRight />
                Personnaliser
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-text-primary text-text-primary font-sans px-6 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:bg-primary hover:text-dark hover:-translate-y-[2px] hover:shadow-lg"
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
          className="bg-dark text-text-primary shadow-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <img
              src={patrimoine}
              alt=""
              className="w-full h-full object-cover object-center scale-110"
            />
          </div>

          <div className="relative z-10 px-6 md:px-12 py-20">
            <Reveal>
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <div>
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mb-8" />
                  <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-6 text-text-primary">
                    Découvrez la Collection
                  </h2>
                  <p className="text-lg text-text-muted leading-relaxed mb-10 font-sans">
                    Découvrez les pièces de notre collection, choisies pour représenter au mieux les régions françaises et leur patrimoine.
                    Créez votre morceau d'histoire unique.
                  </p>
                  <Link
                    to="/community"
                    className="inline-flex items-center gap-2 rounded-full 
                               border border-primary px-6 py-3 text-sm font-sans uppercase tracking-[0.2em] 
                               text-primary transition-all duration-300
                               hover:bg-primary hover:text-dark hover:-translate-y-[2px] hover:shadow-lg"
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

        {/* MODELS GRID – Dark Surface 
        <section id="models" className="mt-24 bg-background shadow-sm">
          <div className="px-6 md:px-12 py-20">
            <Reveal>
              <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-12 text-text-primary">
                Modèles Signature
              </h3>
            </Reveal>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { name: "Mont Saint-Michel", price: "349€", bg: "bg-surface" },
                { name: "Côte d'Azur", price: "389€", bg: "bg-surface-hover" },
                { name: "Haussmann", price: "429€", bg: "bg-surface-active" },
              ].map((model, i) => (
                <Reveal key={model.name} delay={i + 1}>
                  <div
                    className={`${model.bg} rounded-xl shadow-sm p-6 min-h-[240px] flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border border-border/20`}
                  >
                    <div className="flex-1 flex items-center justify-center mb-6">
                      <div className="w-24 h-24 rounded-full bg-background border border-primary shadow-lg flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-text-secondary relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-background rounded-full"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-1 bg-background rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto text-center">
                      <div className="font-serif text-lg md:text-xl mb-2 text-text-primary">
                        {model.name}
                      </div>
                      <div className="text-sm text-text-muted mb-4 font-sans">
                        À partir de {model.price}
                      </div>
                      <Link
                        to="/region-page"
                        className="inline-flex items-center gap-2 text-sm uppercase font-sans tracking-[0.15em] text-primary 
                                   transition-all duration-300 hover:text-primary-dark hover:-translate-y-[2px]"
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
        */}

        {/* CUSTOM SECTION – Deep Dark */}
        <section
          id="custom"
          className="mt-24 bg-dark text-text-primary shadow-xl"
        >
          <div className="px-6 md:px-12 py-20">
            <Reveal>
              <div className="text-center max-w-4xl mx-auto">
                <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-6 text-text-primary">
                  Faites de votre Montres-Bastille une pièce unique
                </h3>
                <p className="text-lg text-text-muted leading-relaxed mb-12 font-sans">
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
                      className="rounded-xl border border-primary/40 bg-surface/60 p-6 text-center 
                                 transition-all duration-300 hover:bg-surface hover:-translate-y-[2px] hover:shadow-lg"
                    >
                      <div className="font-serif text-lg text-text-primary">{item.title}</div>
                      <div className="text-sm text-text-muted mt-1 font-sans">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/not-implemented"
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-dark font-sans px-8 py-4 text-base uppercase tracking-[0.2em] 
                             transition-all duration-300 shadow-md font-medium
                             hover:bg-primary-dark hover:-translate-y-[2px] hover:shadow-lg"
                >
                  <GoArrowUpRight />
                  Commencer la Personnalisation
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
  );
}