import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BtnRedirection from "../components/btnRedirect";
import Reveal from "../Logic/Reveal";
import watch2 from "/gurv.png";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 101;

export default function FramePage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  
  const frameStateRef = useRef({ frame: 0 }); 

  // 1. Chargement des images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNumber = String(i).padStart(3, "0");
      img.src = `/frames/ezgif-frame-${frameNumber}.png`;
      loadedImages.push(img);
    }

    setImages(loadedImages);
  }, []);

  // 2. Logique du Canvas et de GSAP
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Résolution fixe en Full HD
    canvas.width = 1920;
    canvas.height = 1080;

    // IMPORTANT : On remet la frame à 0 au cas où l'utilisateur revient sur la page
    frameStateRef.current.frame = 0;

    const render = () => {
      const frameIndex = Math.round(frameStateRef.current.frame);
      const image = images[frameIndex];
      
      if (!image || !image.complete) return;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, 1920, 1080);
    };

    render();

    // L'UTILISATION DE GSAP.CONTEXT() EST LA CLÉ POUR REACT
    let ctx = gsap.context(() => {
      gsap.to(frameStateRef.current, {
        frame: TOTAL_FRAMES - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "90% bottom", 
          scrub: 1, 
        },
        onUpdate: render,
      });
    }, containerRef); // On limite le contexte à ce conteneur spécifique

    // Nettoyage propre au démontage (changement de page)
    return () => {
      ctx.revert(); // Annule proprement cette animation précise et son ScrollTrigger
    };
  }, [images]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[400vh] bg-black"
    >
      
      {/* Conteneur Sticky pour le Canvas */}
      <div className="sticky top-0 h-screen w-full z-0 overflow-hidden bg-black flex justify-center items-center">
        
        {/* Conteneur limitant la taille (1920px max) avec ratio 16/9 */}
        <div className="relative w-full max-w-[1920px] max-h-screen aspect-video">
          
          <canvas 
            ref={canvasRef} 
            className="w-full h-full object-contain"
          />
          
          {/* Calque de fondu sombre (Vignette) */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_80px_#000]" />

        </div>
      </div>

      {/* Conteneur des textes superposés */}
      <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
        
        {/* Étape 1 */}
        <div className="h-screen flex items-center justify-center">
          <div className="mx-[10%]">
            <p className="tracking-[.25em] text-2xl uppercase text-accent font-sans mx-2">
              Un morceau d'histoire française au poignet
            </p>
            <h1 className="mt-4 mb-6 text-7xl md:text-9xl font-serif text-text-primary leading-tight tracking-tight">
              Montres-Bastille
            </h1>
            <div className="flex flex-wrap justify-center gap-4 pointer-events-auto">
              <BtnRedirection text={"Personnaliser"} style={"full"} redirection="/region-page" size={{px:5,py:3}}/>
              <BtnRedirection text={"Découvrir"} style={"bordered"} redirection="/about" size={{px:5,py:3}}/>
            </div>
          </div>
        </div>

        {/* Étape 2 */}
        <div className="h-screen flex items-center justify-end ">
          <div className="relative z-10 mx-11 py-20 pointer-events-auto">
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
                  <BtnRedirection text={"Explorer"} style={"bordered"} redirection="/community" size={{px:5,py:3}}/>
                </div>

                <div className="mx-auto max-w-sm rounded-sm">
                    <img
                    src={watch2}
                    alt="Collection"
                    className="mask-image-blur drop-shadow-diffuse rounded-4xl"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Étape 3 */}
        <div className="h-screen flex items-center justify-end">
          <div className="px-6 md:px-12 max-w-9xl mx-auto pointer-events-auto">
            <Reveal>
              <div className="text-center mb-16">
                <div className="flex flex-row justify-center">
                <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-4">
                  Hissons nos couleurs
                </h2>
                <div className=" mx-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="45" height="45">
                    <defs>
                      <clipPath id="circle-mask">
                        <circle cx="50" cy="50" r="50" />
                      </clipPath>
                    </defs>
                    <g clipPath="url(#circle-mask)">
                      <rect x="0" y="0" width="33.333" height="100" fill="#002654" />
                      <rect x="33.333" y="0" width="33.334" height="100" fill="#FFFFFF" />
                      <rect x="66.667" y="0" width="33.333" height="100" fill="#ED2939" />
                    </g>
                  </svg>
                </div>
                </div>
                
                
                <div className="h-px w-20 bg-primary mx-auto opacity-60" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Valeur 1 : Responsable */}
                <div className="flex flex-col items-center text-center group bg-gray-500/90 rounded-2xl p-2 border-4 border-gray-700 hover:border-accent">
                  <div className="mb-6 p-4 rounded-full border border-white/10 bg-surface/30 text-primary group-hover:bg-primary group-hover:text-dark transition-all duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                    </svg>
                  </div>
                  <h3 className="font-serif text-3xl text-text-primary mb-3">Production Responsable</h3>
                  <p className="font-sans text-[15px] text-text-secondary leading-relaxed max-w-xs">
                    Une fabrication raisonnée qui limite notre empreinte carbone. Nous privilégions le sens à la surproduction.
                  </p>
                </div>

                {/* Valeur 2 : France */}
                <div className="flex flex-col items-center text-center group bg-gray-200/90 rounded-2xl p-2 border-4 border-gray-400 hover:border-accent">
                  <div className="mb-6 p-4 rounded-full border border-white/10 bg-surface/30 text-primary group-hover:bg-primary group-hover:text-dark transition-all duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                    </svg>
                  </div>
                  <h3 className="font-serif text-3xl text-gray-800 mb-3">Industrie Française</h3>
                  <p className="font-sans text-[15px] text-gray-600 leading-relaxed max-w-xs">
                    Soutenir l'économie locale en travaillant main dans la main avec des industries et ateliers français.
                  </p>
                </div>

                {/* Valeur 3 : Durabilité */}
                <div className="flex flex-col items-center text-center group bg-red-900/90 rounded-2xl p-2 border-4 border-red-800 hover:border-accent">
                  <div className="mb-6 p-4 rounded-full border border-white/10 bg-surface/30 text-primary group-hover:bg-primary group-hover:text-dark transition-all duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M8 11h8"/>
                    </svg>
                  </div>
                  <h3 className="font-serif text-3xl text-text-primary mb-3">Conçu pour Durer</h3>
                  <p className="font-sans text-[15px] text-text-secondary leading-relaxed max-w-xs">
                    Des composants robustes sélectionnés pour résister au temps avec une attention particulière pour les finitions. 
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

      <div className="h-screen flex items-center justify-center">

        <div className="px-6 md:px-12 pointer-events-auto">
          <Reveal>
            <div className="text-center max-w-4xl mx-auto">
              <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-6 text-text-primary">
                Faites de votre Montres-Bastille une pièce unique
              </h3>
              <p className="text-lg text-amber-50 leading-relaxed mb-12 font-sans">
                Choisissez le cadran, le mouvement, les aiguilles, la finition
                du boîtier et le bracelet. Visualisez vos modifications en
                temps réel, puis commandez votre pièce du patrimoine.
              </p>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-3xl mx-auto mb-12">
                {[
                  { title: "Cadrans", desc: "9 modèles" },
                  { title: "Aiguilles", desc: "4 styles" },
                  { title: "Boîtiers", desc: "9 finitions" },
                  { title: "Bracelets", desc: "12 options" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-primary/40 bg-surface/80 p-6 text-center 
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
      </div>
    </div>

    </section>
  );
}