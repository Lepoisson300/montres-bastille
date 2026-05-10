import { Helmet } from "react-helmet-async";
import Nav from "../components/Nav";
import { MeshGradient } from "@paper-design/shaders-react";

// Images
const heroBg = "/fond1.webp";
const cmm10 = "/cmm10.webp";
const remi = "/remi.webp";
const womanBg = "/fond2.webp";
const eclateImg = "/eclate.webp";
const watchDialBg = "/watch_dial.webp";
const sketchImg = "/AlsaceDial1.webp";
const prototypeImg = "/nico.webp";
const finalWatchImg = "/remiTest.webp";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Notre Histoire | Montre Bastille - L'Art de l'Horlogerie à Bordeaux</title>
        <meta name="description" content="Découvrez l'origine de Montre Bastille. Deux passionnés créant des montres uniques inspirées du patrimoine français et assemblées avec précision à Bordeaux." />
      </Helmet>

      {/* Navigation requires dark background to be visible on the hero section if hero is dark, the original Nav had bg={false} which means transparent. */}
      <Nav bg={false} />

      <div className="bg-dark text-text-primary overflow-hidden font-sans selection:bg-primary/30">
        
        {/* Section 1: Hero */}
        <section className="relative min-h-screen flex items-center justify-center pt-20">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img src={heroBg} alt="Hero Background" className="w-full h-full object-cover blur-[2px] opacity-50 mix-blend-screen" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-dark" />
          </div>
          
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center pb-20">
            {/* Card Left */}
            <div className="border border-primary/30 bg-[#0A0A0A]/70 backdrop-blur-md p-10 md:p-14 rounded-sm shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              <h1 className="font-serif text-4xl md:text-[2.75rem] text-primary mb-6 leading-[1.15]">
                L'histoire de<br />Montres-Bastille
              </h1>
              <div className="w-10 h-[1px] bg-primary/40 mb-8"></div>
              <p className="text-white/90 text-sm md:text-base mb-6 leading-relaxed font-light">
                Une marque créée par un passionné de mécanisme, qu'ils soient pour indiquer le temps ou pour faire vibrer par des cylindres. Ces montres sont la continuité de votre parcours passionnant à travers le patrimoine Français.
              </p>
              <p className="text-white/60 text-xs md:text-sm mb-10 leading-relaxed font-light">
                Si vous êtes arrivé là, c'est que vous êtes curieux de savoir comment sont fabriquées ces gardes-temps? Alors allons-y.
              </p>

            </div>
            {/* Image Right */}
            <div className="flex justify-center md:justify-end">
              <div className="relative p-2 border border-primary/20 bg-[#0A0A0A]/50 shadow-2xl rounded-sm group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                <img src={remi} alt="Carnet d'horloger" className="w-full max-w-[400px] object-cover rounded-sm grayscale-[20%] contrast-125" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: La France dans un raffinement absolu */}
        <section className="relative min-h-screen flex items-center justify-center py-24 border-t border-white/5">
          <div className="absolute inset-0 z-0">
            <img src={womanBg} alt="Woman Vintage Background" className="w-full h-full object-cover opacity-40 mix-blend-luminosity grayscale" />
            <div className="absolute inset-0 bg-gradient-to-b from-dark via-[#0A0A0A]/80 to-dark" />
          </div>

          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image Left */}
            <div className="flex justify-center md:justify-start order-2 md:order-1">
              <div className="relative p-2 border border-primary/20 bg-[#0A0A0A]/50 shadow-2xl rounded-sm">
                <img src={eclateImg} alt="Pièces de montre" className="w-full max-w-[400px] object-cover rounded-sm grayscale-[30%] contrast-125 hover:grayscale-0 transition-all duration-700" />
              </div>
            </div>
            
            {/* Card Right */}
            <div className="border border-primary/30 bg-[#0A0A0A]/70 backdrop-blur-md p-10 md:p-14 rounded-sm shadow-2xl order-1 md:order-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              <h3 className="text-primary/80 text-[10px] tracking-[0.3em] uppercase mb-5 font-semibold">La France dans le détail</h3>
              <h2 className="font-serif text-4xl md:text-[2.75rem] text-white mb-6 leading-[1.15]">
                La France dans<br />un raffinement<br />absolu
              </h2>
              <div className="w-10 h-[1px] bg-primary/40 mb-8"></div>
              <p className="text-white/70 text-sm mb-10 leading-relaxed font-light">
                Nous nous déplaçons à travers les régions de France pour discuter et comprendre avec les locaux ce qui caractérise le mieux leur région. Les matériaux sont ensuite choisis puis retravaillés par des artisans.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-4 border-t border-white/10">
                <div>
                  <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2">Assemblage</p>
                  <p className="text-primary font-serif text-2xl">Bordeaux</p>
                </div>
                <div>
                  <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2">Tolérance</p>
                  <p className="text-primary font-serif text-2xl">±4 s/j</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: De la qualité */}
        <section className="relative min-h-screen flex items-center justify-center py-24 border-t border-white/5 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={watchDialBg} alt="Close up watch dial" className="w-full h-full object-cover opacity-15 mix-blend-luminosity grayscale-[50%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-[#0A0A0A]/90 to-dark" />
          </div>
          
          <div className="absolute inset-0 w-full h-full opacity-90 z-0 pointer-events-none" aria-hidden="true">
              <MeshGradient
                width={typeof window !== 'undefined' ? window.innerWidth : 1280}
                height={typeof window !== 'undefined' ? window.innerHeight : 800}
                colors={["#0a0a0c", "#262626", "#c5a059", "#1c1a17"]}
                distortion={0.25}
                speed={0.35}
              />
              {/* J'ai corrigé bg-linear-to-b (non standard dans Tailwind) par bg-gradient-to-b */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
          </div>

          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Card Left */}
            <div className="border border-primary/30 bg-[#0A0A0A]/70 backdrop-blur-md p-10 md:p-16 rounded-sm shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              <div className="flex justify-center mb-8">
                <svg className="w-10 h-10 text-primary/80" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-white text-center mb-8">De la qualité</h2>
              
              <p className="text-white/70 text-sm text-center mb-6 leading-relaxed font-light">
                Une de nos valeurs les plus importantes est de proposer des composants fabriqués et assemblés en France. Ces composants pleins de caractères et iconiques sont l'effet d'une révolution. 
              </p>
              <p className="text-white/70 text-sm text-center mb-10 leading-relaxed font-light">
                Les mouvements sont fabriqués par l'entreprise Yema à Morteau. Les bracelets sont conçus et fabriqués par la maison Fevre. Ainsi, Chez Montres-Bastille, nous voulons proposer une montres qui permettent de remettre la France dans la lumière dans l'horlogerie.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-[11px] text-white/50 tracking-[0.1em] uppercase">
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Mouvement Yema</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Bracelets Maison Fevre</div>
              </div>
            </div>
            
            {/* Image Left (ou Right selon l'ordre md:order) */}
            <div className="flex justify-center md:justify-start order-2 md:order-1">
              <div className="relative p-2 border border-primary/20 bg-[#0A0A0A]/50 shadow-2xl rounded-sm">
                <img src={cmm10} alt="Pièces de montre" className="w-full max-w-[500px] object-cover rounded-sm grayscale-[30%] contrast-125 hover:grayscale-0 transition-all duration-700" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Repères (Timeline) */}
        <section className="py-32 bg-[#0A0A0A] border-t border-white/5 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-[#0A0A0A] to-[#0A0A0A] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <h2 className="text-center font-serif text-5xl text-primary mb-32 tracking-wide">Repères</h2>
            
            <div className="max-w-4xl mx-auto relative">
              {/* Central Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-primary/30 to-transparent -translate-x-1/2 hidden md:block"></div>
              
              {/* 2024 */}
              <div className="flex flex-col md:flex-row items-center justify-between mb-32 w-full group">
                <div className="w-full md:w-5/12 text-center md:text-right md:pr-14 mb-8 md:mb-0">
                  <h3 className="font-serif text-4xl text-white mb-2 group-hover:text-primary transition-colors duration-300">2024</h3>
                  <p className="text-primary text-sm font-medium mb-4 tracking-wider uppercase">L'idée</p>
                  <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto md:ml-auto md:mr-0 font-light">Un cahier rempli de cadrans, de bracelets en matériaux étranges et des boitiers de montres tous apportant de la robustesse. </p>
                </div>
                <div className="hidden md:flex w-2/12 justify-center relative">
                  <div className="w-3 h-3 bg-dark border-2 border-primary/50 rounded-full z-10 transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(201,169,110,0.5)] group-hover:scale-125"></div>
                </div>
                <div className="w-full md:w-5/12 md:pl-14">
                  <div className="relative p-1.5 border border-white/5 bg-white/5 rounded-sm overflow-hidden transition-all duration-500 group-hover:border-primary/30">
                    <img src={sketchImg} alt="Croquis montre" className="w-full h-48 object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" />
                  </div>
                </div>
              </div>

              {/* 2025 */}
              <div className="flex flex-col md:flex-row-reverse items-center justify-between mb-32 w-full group">
                <div className="w-full md:w-5/12 text-center md:text-left md:pl-14 mb-8 md:mb-0">
                  <h3 className="font-serif text-4xl text-white mb-2 group-hover:text-primary transition-colors duration-300">2025</h3>
                  <p className="text-primary text-sm font-medium mb-4 tracking-wider uppercase">Les premiers prototypes</p>
                  <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto md:mr-auto md:ml-0 font-light">Achâts de différentes pièce et premiers contact avec l'entreprise de Yema et Maison-Fevre.</p>
                </div>
                <div className="hidden md:flex w-2/12 justify-center relative">
                  <div className="w-3 h-3 bg-dark border-2 border-primary/50 rounded-full z-10 transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(201,169,110,0.5)] group-hover:scale-125"></div>
                </div>
                <div className="w-full md:w-5/12 md:pr-14">
                  <div className="relative p-1.5 border border-white/5 bg-white/5 rounded-sm overflow-hidden transition-all duration-500 group-hover:border-primary/30">
                    <img src={prototypeImg} alt="Prototype boîtier" className="w-full h-48 object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" />
                  </div>
                </div>
              </div>

              {/* 2026 */}
              <div className="flex flex-col md:flex-row items-center justify-between w-full group">
                <div className="w-full md:w-5/12 text-center md:text-right md:pr-14 mb-8 md:mb-0">
                  <h3 className="font-serif text-4xl text-white mb-2 group-hover:text-primary transition-colors duration-300">2026</h3>
                  <p className="text-primary text-sm font-medium mb-4 tracking-wider uppercase">Finalisation</p>
                  <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto md:ml-auto md:mr-0 font-light">Montres-Bastille commence à voir le jour, rencontre avec les différents artisans qui vont faconner boitier et cadrans de votre Montres-Bastille</p>
                </div>
                <div className="hidden md:flex w-2/12 justify-center relative">
                  <div className="w-3 h-3 bg-primary rounded-full z-10 shadow-[0_0_20px_rgba(201,169,110,0.8)] scale-125"></div>
                </div>
                <div className="w-full md:w-5/12 md:pl-14">
                  <div className="relative p-1.5 border border-primary/20 bg-primary/5 rounded-sm overflow-hidden shadow-[0_0_30px_rgba(201,169,110,0.1)]">
                    <img src={finalWatchImg} alt="Montre finalisée" className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Quote */}
        <section className="py-32 bg-dark flex flex-col items-center justify-center text-center px-6 border-t border-white/5 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          <div className="text-primary font-serif text-8xl mb-2 leading-[0.5] opacity-60 select-none">"</div>
          <p className="font-serif text-2xl md:text-4xl text-white/90 italic max-w-3xl leading-relaxed md:leading-relaxed mb-10">
            Une montre n'indique pas seulement l'heure, elle révèle la personnalité et le chemin de celui qui la porte.
          </p>
          <div className="w-12 h-[1px] bg-primary/40 mb-8"></div>
          <p className="text-white/40 text-[10px] tracking-[0.4em] uppercase">— Le Fondateur</p>
        </section>
        
      </div>
    </>
  );
}