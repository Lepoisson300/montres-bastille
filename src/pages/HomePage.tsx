import React, { useRef, useState } from 'react';
import { GoArrowUpRight } from 'react-icons/go';

// Simple textured background matching the CardNav aesthetic
const Grain = () => (
  <svg className="pointer-events-none fixed inset-0 -z-10 opacity-[0.07]" aria-hidden="true">
    <filter id="n" x="0" y="0">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#n)" />
  </svg>
);

// Reveal animation component matching CardNav's GSAP style
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 100);
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
      className={`transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
};

export default function HomePage() {
  return (
    <div className=" text-[#2b2723] font-serif min-h-screen">
      <Grain />

      <div className="pt-[100px] md:pt-[120px] px-4 sm:px-6 md:px-8">
        {/* HERO */}
        <section className="bg-[#f3eadf] shadow-sm relative overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 opacity-20">
            <img src="./src/assets/arcClean.png" alt="" className="w-full h-full object-cover object-center" />
          </div>
          
          <div className="m-3 p-6 md:p-10 relative z-10">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <Reveal>
          <div className="mx-auto max-w-sm">
            {/* Watch placeholder matching CardNav card style */}
            <div className="aspect-square rounded-xl border border-[#cdbfae] shadow-sm p-8 flex items-center justify-center bg-[#f3eadf]/80 backdrop-blur-sm">
                <img src="./src/assets/watch1.png" alt="Watch" className='w-full h-full object-contain'/>
            </div>
          </div>
              </Reveal>

              <Reveal delay={1}>
          <div>
            <p className="tracking-[.2em] text-xs uppercase text-[#2b2723]/70">Inspiré par le patrimoine français</p>
            <h1 className="mt-2 font-serif text-4xl leading-tight md:text-6xl tracking-[-0.5px]">
              Montres <span className="block">Personnalisées</span>
            </h1>
            <p className="mt-4 max-w-prose text-lg text-[#463f38] leading-relaxed">
              Composez votre Montres-Bastille avec cadrans, aiguilles, mouvement et bracelets évoquant l'élégance intemporelle des régions de France.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a 
                href="#custom" 
                className="inline-flex items-center gap-2 rounded-xl border border-[#ad9f8c] bg-[#efe6da] px-5 py-3 text-sm uppercase tracking-wider shadow-sm transition-all duration-300 hover:bg-[#e6dccf] hover:shadow-md hover:-translate-y-0.5 hover:opacity-80"
              >
                <GoArrowUpRight />
                Personnaliser
              </a>
              <a 
                href="#collection" 
                className="inline-flex items-center gap-2 rounded-xl border border-[#ad9f8c] bg-[#e6dccf] px-5 py-3 text-sm uppercase tracking-wider shadow-sm transition-all duration-300 hover:bg-[#ddd3c6] hover:shadow-md hover:-translate-y-0.5 hover:opacity-80"
              >
                <GoArrowUpRight />
                Découvrir
              </a>
            </div>
          </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* DISCOVER SECTION - Card style */}
        <section id="collection" className="mt-10 rounded-2xl border border-[#cdbfae] bg-[#f3eadf] shadow-sm relative overflow-hidden">
          {/* Background image */}
            <div className="absolute inset-0 opacity-20">
              <img src="./src/assets/nh35.png" alt="" className="w-full h-full object-cover object-center scale-110 -rotate-12" />
            </div>
          
          <div className="m-3 p-6 md:p-10 relative z-10">
            <Reveal>
              <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl tracking-[-0.5px]">Découvrez la Collection</h2>
            <p className="mt-6 text-lg text-[#463f38] leading-relaxed">
              Créez votre montre unique avec des éléments évoquant le patrimoine et les paysages de France.
            </p>
            <a 
              href="#models" 
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#ad9f8c] bg-[#efe6da] px-5 py-3 text-sm uppercase tracking-wider shadow-sm transition-all duration-300 hover:bg-[#e6dccf] hover:shadow-md hover:-translate-y-0.5 hover:opacity-80"
            >
              <GoArrowUpRight />
              Découvrir
            </a>
          </div>
          
          <div className="mx-auto max-w-sm">
            <img src="./src/assets/watch2.png" alt="" className='w-[250px]'/>
          </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* MODELS GRID - Card style matching CardNav */}
        <section id="models" className="mt-10 bg-[#f3eadf] shadow-sm">
          <div className="m-3 p-6 md:p-10">
            <Reveal>
              <h3 className="font-serif text-3xl md:text-4xl tracking-[-0.5px] mb-8">Modèles Signature</h3>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { name: "Mont Saint-Michel", price: "349€", bg: "#efe6da" },
                { name: "Côte d'Azur", price: "389€", bg: "#e6dccf" },
                { name: "Haussmann", price: "429€", bg: "#ddd3c6" }
              ].map((model, i) => (
                <Reveal key={model.name} delay={i + 1}>
                  <div 
                    className="shadow-sm p-[12px] md:p-[16px] min-h-[200px] flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    style={{ backgroundColor: model.bg }}
                  >
                    {/* Watch visualization */}
                    <div className="flex-1 flex items-center justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-[#f3eadf] border border-[#cdbfae] shadow-sm flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#2b2723] relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-[#efe6da] rounded-full"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-1 bg-[#efe6da] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="font-serif tracking-[-0.5px] text-[18px] md:text-[22px] mb-2">
                        {model.name}
                      </div>
                      <div className="flex flex-col gap-[2px]">
                        <div className="text-sm text-[#2b2723]/70 mb-2">À partir de {model.price}</div>
                        <a
                          href="#custom"
                          className="inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-80 text-[15px] md:text-[16px]"
                        >
                          <GoArrowUpRight />
                          Personnaliser
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CUSTOM SECTION - Larger card style */}
        <section id="custom" className="mt-10 rounded-2xl border border-[#cdbfae] bg-[#f3eadf] shadow-sm">
          <div className="m-3 p-6 md:p-10">
            <Reveal>
              <div className="text-center max-w-4xl mx-auto">
                <h3 className="font-serif text-3xl md:text-4xl tracking-[-0.5px] mb-6">
                  Faites de votre Montres-Bastille une pièce unique
                </h3>
                <p className="text-lg text-[#463f38] leading-relaxed mb-8">
                  Choisissez le cadran, le mouvement, les aiguilles, la finition du boîtier et le bracelet. 
                  Visualisez vos modifications en temps réel, puis commandez votre pièce du patrimoine.
                </p>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-2xl mx-auto">
                  {[
                    { title: "Cadrans", desc: "12 modèles" },
                    { title: "Aiguilles", desc: "8 styles" },
                    { title: "Boîtiers", desc: "6 finitions" },
                    { title: "Bracelets", desc: "15 options" }
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl border border-[#cdbfae] bg-[#efe6da] shadow-sm p-4 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="font-serif text-lg tracking-[-0.5px]">{item.title}</div>
                      <div className="text-sm text-[#2b2723]/70 mt-1">{item.desc}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <a 
                    href="#configurator" 
                    className="inline-flex items-center gap-2 rounded-xl border border-[#ad9f8c] bg-[#efe6da] px-8 py-4 text-base uppercase tracking-wider shadow-sm transition-all duration-300 hover:bg-[#e6dccf] hover:shadow-md hover:-translate-y-0.5 hover:opacity-80"
                  >
                    <GoArrowUpRight />
                    Commencer la Personnalisation
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>        
      </div>
    </div>
  );
}