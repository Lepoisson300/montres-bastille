import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BtnRedirection from "../components/btnRedirect";
import Reveal from "../Logic/Reveal";
import watch2 from "/gurv.webp";
import { Helmet } from "react-helmet-async";
import Nav from "../components/Nav";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 101;

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  
  const frameStateRef = useRef({ frame: 1 }); 

  // 1. Chargement des images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNumber = String(i).padStart(3, "0");
      img.src = `/frames/ezgif-frame-${frameNumber}.webp`;
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
    frameStateRef.current.frame = 1;

   const render = () => {
      // Petite astuce de sécurité pour éviter de sortir de l'array
      let frameIndex = Math.round(frameStateRef.current.frame);
      if (frameIndex >= images.length) frameIndex = images.length - 1;
      const image = images[frameIndex];
      if (!image) return;
      // Si l'image n'est pas encore chargée (complete === false)
      if (!image.complete) {
        // On lui attache un événement : quand elle a fini de charger, elle relance "render"
        image.onload = render;
        return; 
      }

      // Une fois l'image chargée, on la dessine
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
      <Helmet>
        <title>Montre Bastille | Créateur de Montres Personnalisées à Bordeaux</title>
        <meta name="description" content="Configurez votre montre Montre Bastille à partir de composants symbolique d'un région Francaise. Artisanat Bordelais, composants de précision et design unique." />
        <meta property="og:title" content="Montre Bastille - Votre Garde-Temps du patrimoine" />
        <meta property="og:image" content="/logo.webp" />

        <link rel="canonical" href="https://montre-bastille.fr/" />
      </Helmet>
    <Nav bg={false}/>
      {/* Conteneur Sticky pour le Canvas */}
      <div className="sticky top-0 h-screen w-full z-0 overflow-hidden bg-black flex justify-center items-center">
        
        {/* Conteneur qui prend tout l'écran avec une limite de largeur pour les très grands écrans */}
        <div className="relative w-full h-full max-w-480">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_40px_#000] md:shadow-[inset_0_0_150px_80px_#000]" />
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 2xl:w-64 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 2xl:w-64 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
        </div>
      </div>

      {/* Conteneur des textes superposés */}
      <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
        
        {/* Étape 1 */}
        <div className="min-h-screen flex mt-80 ml-10 max-w-[50%] lg:py-[20%] lg:ml-[20%] lg:max-w-2xl ">
          <div className="mx-[10%]">
          
             <p className="tracking-[.25em] text-[30px] md:text-5xl uppercase text-accent-light font-sans mb-3">
              Un morceau d'histoire française au poignet
            </p>
            <div className="flex mt-4 pointer-events-auto">
              <BtnRedirection text={"Découvrir"} style={"bordered"} redirection="/about" size={{px:10,py:4}}/>
            </div>
          </div>
        </div>

        {/* Étape 2 */}
        <div className="h-screen flex items-center">
            <div className="relative z-10 py-20 pointer-events-auto w-full min-[1921px]:mx-80">
              <Reveal>
              <div className="flex flex-col md:flex-row mx-6 md:mx-12"> 
                <div className="mt-auto mb-auto md:max-w-2xl">
                    <div className="h-px w-24 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent mb-8" />
                    <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-6 text-text-primary">
                      Découvrez la Collection
                    </h2>
                    <p className="text-[17px] md:text-xl text-text-muted leading-relaxed mb-10 font-sans">
                      Découvrez les pièces de notre collection, choisies pour représenter au mieux les régions françaises et leur patrimoine.
                      Créez votre morceau d'histoire unique.
                    </p>
                  {/* Le bouton reste centré sur mobile et s'aligne à gauche sur PC */}
                  <div className="flex justify-center md:justify-start">
                    <BtnRedirection text={"Explorer"} style={"bordered"} redirection="/community" size={{px:5,py:3}}/>
                  </div>
                </div>

                {/* BLOC IMAGE (À droite sur PC, en bas sur mobile) */}
                <div className="flex-1 flex mt-6 justify-center md:justify-end w-full">
                  <img
                    src={watch2}
                    alt="Collection"
                    // Ajout de classes pour sublimer l'image dans l'esprit Dark Gold
                    className="mask-image-blur max-w-80 md:max-w-sm drop-shadow-diffuse rounded-4xl border border-white/5 md:border-none shadow-2xl md:shadow-none"
                  />
                </div>
                
              </div>
            </Reveal>
          </div>
        </div>

        {/* Étape 3 */}
        <div className="relative mt-8 min-h-screen flex items-center justify-center">
      
      {/* Effet de lumière dorée en arrière-plan pour le côté luxe */}
      <div className="relative z-10 w-full px-6 md:px-12 max-w-7xl mx-auto pointer-events-auto py-20">
        <Reveal>
          <div className="text-center mb-16">
            <div className="flex flex-row justify-center items-center mb-4">
              <h2 className="font-serif text-3xl md:text-5xl text-accent-light tracking-wide">
                Hissons nos couleurs
              </h2>
              <div className="mx-4">
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
            
            {/* Ligne de séparation dorée en dégradé */}
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto opacity-70"  />
          </div>

          {/* Conteneur Flex sur mobile (pour le zigzag) 
            et Grid sur Desktop (pour les 3 colonnes) 
          */}
          <div className="flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-12">
            
            {/* Valeur 1 : Responsable (Aligné à gauche sur mobile) */}
            <div className="w-[80%] h-50 md:h-full md:w-full mr-auto flex flex-col items-center text-center group bg-zinc-900/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-500 shadow-xl">
              <div className=" md:mb-6 p-4 rounded-full border border-[#D4AF37]/30 bg-black/50 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <h3 className="font-serif text-lg md:text-2xl text-[#D4AF37] mb-3">Production Responsable</h3>
              <p className="font-sans text-[13px] md:text-base text-zinc-400 leading-relaxed max-w-xs">
                Une fabrication raisonnée qui limite notre empreinte carbone. Nous privilégions le sens à la surproduction.
              </p>
            </div>

            {/* Valeur 2 : France (Décalé à droite sur mobile grâce à `ml-auto`) */}
            <div className="w-[80%] h-50 md:h-full md:w-full ml-auto md:ml-0 flex flex-col items-center text-center group bg-zinc-900/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-500 shadow-xl">
              <div className="md:mb-6 p-4 rounded-full border border-[#D4AF37]/30 bg-black/50 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                </svg>
              </div>
              <h3 className="font-serif text-lg md:text-2xl text-[#D4AF37] mb-3">Industrie Française</h3>
              <p className="font-sans text-[13px] md:text-base text-zinc-400 leading-relaxed max-w-xs">
                Soutenir l'économie locale en travaillant main dans la main avec des industries et ateliers français.
              </p>
            </div>

            {/* Valeur 3 : Durabilité (Aligné à gauche sur mobile) */}
            <div className="w-[80%] h-50 md:h-full md:w-full mr-auto flex flex-col items-center text-center group bg-zinc-900/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-500 shadow-xl">
              <div className=" md:mb-6 p-4 rounded-full border border-[#D4AF37]/30 bg-black/50 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M8 11h8"/>
                </svg>
              </div>
              <h3 className="font-serif text-lg md:text-2xl text-[#D4AF37] mb-3">Conçu pour Durer</h3>
              <p className="font-sans text-[13px] md:text-base text-zinc-400 leading-relaxed max-w-xs">
                Des composants robustes sélectionnés pour résister au temps avec une attention particulière pour les finitions. 
              </p>
            </div>
            
          </div>
        </Reveal>
      </div>
    </div>
      {/* Etape 4*/}
      <div className="mt-2 flex items-center justify-center">
        <div className="px-6 md:px-12 pointer-events-auto">
          <Reveal>
            <div className="text-center max-w-4xl mx-auto">
              <h3 className="font-serif text-2xl md:text-4xl tracking-tight mb-6 text-text-primary">
                Faites de votre Montres-Bastille une pièce unique
              </h3>
              <p className="text-[15px] md:text-lg text-amber-50 leading-relaxed mb-4 font-sans">
                Choisissez le cadran, le mouvement, les aiguilles, la finition
                du boîtier et le bracelet. Visualisez vos modifications en
                temps réel, puis commandez votre pièce du patrimoine.
              </p>

              <div className="grid gap-6 grid-cols-2 lg:grid-cols-4 max-w-3xl mx-auto mb-4">
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