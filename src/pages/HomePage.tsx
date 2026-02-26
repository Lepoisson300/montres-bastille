import React, { useRef, useState } from "react";
import arcClean from "/arc_clean.png";
import patrimoine from "/patrimoine.png";
import france from "/franceMap.png";
import watch2 from "/watch2.png";
import HeroCarousel from "../components/Carousel";
import Nav from "../components/Nav";
import BtnRedirection from "../components/btnRedirect";

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
    <>
    <Nav bg={false}/>

    <div className="font-sans min-h-screen bg-background text-text-secondary">
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
              <BtnRedirection text={"Personnaliser"} style={"full"} redirection="/region-page" size={{px:5,py:3}}/>

              <BtnRedirection text={"Découvrir"} style={"bordered"} redirection="/about" size={{px:5,py:3}}/>
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
                  <div className="h-px w-24 from-transparent via-primary to-transparent mb-8" />
                  <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-6 text-text-primary">
                    Découvrez la Collection
                  </h2>
                  <p className="text-lg text-text-muted leading-relaxed mb-10 font-sans">
                    Découvrez les pièces de notre collection, choisies pour représenter au mieux les régions françaises et leur patrimoine.
                    Créez votre morceau d'histoire unique.
                  </p>
                  <BtnRedirection text={"Explorer"} style={"bordered"} redirection="/community" size={{px:5,py:3}}/>
                </div>

                <div className="mx-auto max-w-sm">
                  <img
                    src={watch2}
                    alt="Collection"
                    className="drop-shadow-2xl"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
        {/* CUSTOM SECTION - Nos valeurs */}
        <section className="py-20 bg-background relative border-y border-white/5">
          <div className="px-6 md:px-12 max-w-7xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-4">
                  Hissons nos couleurs
                </h2>
                <div className="h-px w-20 bg-primary mx-auto opacity-60" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Valeur 1 : Responsable */}
                <div className="flex flex-col items-center text-center group">
                  <div className="mb-6 p-4 rounded-full border border-white/10 bg-surface/30 text-primary group-hover:bg-primary group-hover:text-dark transition-all duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl text-text-primary mb-3">Production Responsable</h3>
                  <p className="font-sans text-sm text-text-muted leading-relaxed max-w-xs">
                    Une fabrication raisonnée qui limite notre empreinte carbone. Nous privilégions le sens à la surproduction.
                  </p>
                </div>

                {/* Valeur 2 : France */}
                <div className="flex flex-col items-center text-center group">
                  <div className="mb-6 p-4 rounded-full border border-white/10 bg-surface/30 text-primary group-hover:bg-primary group-hover:text-dark transition-all duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl text-text-primary mb-3">Industrie Française</h3>
                  <p className="font-sans text-sm text-text-muted leading-relaxed max-w-xs">
                    Soutenir l'économie locale en travaillant main dans la main avec des industries et ateliers français.
                  </p>
                </div>

                {/* Valeur 3 : Durabilité */}
                <div className="flex flex-col items-center text-center group">
                  <div className="mb-6 p-4 rounded-full border border-white/10 bg-surface/30 text-primary group-hover:bg-primary group-hover:text-dark transition-all duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M8 11h8"/>
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl text-text-primary mb-3">Conçu pour Durer</h3>
                  <p className="font-sans text-sm text-text-muted leading-relaxed max-w-xs">
                    Des composants robustes sélectionnés pour résister au temps. Ici, pas d'obsolescence programmée.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

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
                                 transition-all duration-300 hover:bg-surface hover:shadow-lg"
                    >
                      <div className="font-serif text-lg text-text-primary">{item.title}</div>
                      <div className="text-sm text-text-muted mt-1 font-sans">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
                <BtnRedirection text={"Commencer la personnalisation"} style={"full"} redirection="/region-page" size={{px:8,py:4}}/>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      </>
  );
}