import { Link } from "react-router-dom";
import React, { useState, useRef } from "react";
import { GoArrowUpRight, GoHeart, GoHeartFill } from "react-icons/go";

// Background grain effect
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

// Reveal animation component
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

// Mock data for user creations
const userCreations = [
  {
    id: 1,
    name: "Provence Sunset",
    creator: "Marie L.",
    likes: 142,
    image: "bg-gradient-to-br from-amber-300 to-orange-500",
    dial: "Lavande",
    hands: "Or Rose",
    case: "Acier Brossé",
    strap: "Cuir Provence"
  },
  {
    id: 2,
    name: "Normandie Marine",
    creator: "Pierre D.",
    likes: 98,
    image: "bg-gradient-to-br from-blue-400 to-slate-600",
    dial: "Bleu Océan",
    hands: "Acier Poli",
    case: "Titane",
    strap: "Nato Bleu"
  },
  {
    id: 3,
    name: "Alsace Tradition",
    creator: "Sophie M.",
    likes: 176,
    image: "bg-gradient-to-br from-red-400 to-yellow-500",
    dial: "Rouge Colombage",
    hands: "Laiton Vintage",
    case: "Or Jaune",
    strap: "Cuir Bordeaux"
  },
  {
    id: 4,
    name: "Bretagne Mystique",
    creator: "Yann K.",
    likes: 89,
    image: "bg-gradient-to-br from-emerald-400 to-slate-700",
    dial: "Vert Forêt",
    hands: "Argenté",
    case: "Acier Noir",
    strap: "Silicone Gris"
  },
  {
    id: 5,
    name: "Côte d'Opale",
    creator: "Emma B.",
    likes: 134,
    image: "bg-gradient-to-br from-sky-300 to-emerald-400",
    dial: "Bleu Nacré",
    hands: "Platine",
    case: "Acier Poli",
    strap: "Maille Milanaise"
  },
  {
    id: 6,
    name: "Auvergne Volcanique",
    creator: "Lucas R.",
    likes: 67,
    image: "bg-gradient-to-br from-stone-600 to-red-700",
    dial: "Anthracite",
    hands: "Rouge Magma",
    case: "Carbone",
    strap: "Cuir Noir"
  }
];

// French regions for voting
const regions = [
  { name: "Corse", votes: 234, description: "L'île de beauté" },
  { name: "Occitanie", votes: 198, description: "Terre de contrastes" },
  { name: "Bourgogne", votes: 176, description: "Vignobles ancestraux" },
  { name: "Limousin", votes: 145, description: "Artisanat d'excellence" },
  { name: "Champagne", votes: 134, description: "Bulles et tradition" },
  { name: "Jura", votes: 89, description: "Montagne sauvage" }
];

export default function CommunityPage() {
  const [likedCreations, setLikedCreations] = useState(new Set());
  const [votedRegions, setVotedRegions] = useState(new Set());
  const [currentCreations, setCurrentCreations] = useState(userCreations);
  const [currentRegions, setCurrentRegions] = useState(regions);

  const toggleLike = (creationId) => {
    const newLiked = new Set(likedCreations);
    const newCreations = [...currentCreations];
    const creation = newCreations.find(c => c.id === creationId);
    
    if (newLiked.has(creationId)) {
      newLiked.delete(creationId);
      creation.likes -= 1;
    } else {
      newLiked.add(creationId);
      creation.likes += 1;
    }
    
    setLikedCreations(newLiked);
    setCurrentCreations(newCreations);
  };

  const voteForRegion = (regionName) => {
    if (votedRegions.has(regionName)) return;
    
    const newVoted = new Set(votedRegions);
    newVoted.add(regionName);
    
    const newRegions = currentRegions.map(region => 
      region.name === regionName 
        ? { ...region, votes: region.votes + 1 }
        : region
    ).sort((a, b) => b.votes - a.votes);
    
    setVotedRegions(newVoted);
    setCurrentRegions(newRegions);
  };

  return (
    <div className="font-sans min-h-screen bg-background text-text-secondary">
      <Grain />

      {/* HERO SECTION */}
      <section className="bg-dark text-text-primary pt-24 pb-20">
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center max-w-4xl mx-auto">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent mb-8 mx-auto" />
              <h1 className="font-serif text-4xl md:text-6xl tracking-tight mb-6 text-text-primary">
                Communauté Montres-Bastille
              </h1>
              <p className="text-lg text-text-muted leading-relaxed mb-10 font-sans">
                Découvrez les créations uniques de notre communauté et participez au choix des prochaines régions qui inspireront nos collections futures.
              </p>
              
            </div>
          </Reveal>
        </div>
      </section>

      {/* USER CREATIONS SECTION */}
      <section className="py-20 bg-background">
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-6 text-text-primary">
                Dernières Créations
              </h2>
              <p className="text-lg text-text-muted leading-relaxed max-w-2xl mx-auto font-sans">
                Explorez les montres uniques créées par notre communauté d'amateurs de patrimoine français.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {currentCreations.map((creation, index) => (
              <Reveal key={creation.id} delay={index + 1}>
                <div className="bg-surface rounded-2xl shadow-lg border border-border/20 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-surface-hover">
                  {/* Watch Preview */}
                  <div className="p-8 bg-gradient-to-br from-surface-hover to-surface-active">
                    <div className="w-40 h-40 mx-auto mb-4 rounded-full border-4 border-primary/30 shadow-lg flex items-center justify-center">
                      <div className={`w-32 h-32 rounded-full ${creation.image} shadow-inner flex items-center justify-center relative`}>
                        {/* Watch hands */}
                        <div className="absolute w-1 h-12 bg-white rounded-full opacity-90"></div>
                        <div className="absolute w-12 h-1 bg-white rounded-full opacity-90"></div>
                        <div className="absolute w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Creation Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif text-xl text-text-primary">{creation.name}</h3>
                      <button
                        onClick={() => toggleLike(creation.id)}
                        className="flex items-center gap-2 text-sm text-text-subtle transition-colors hover:text-red-500"
                      >
                        {likedCreations.has(creation.id) ? (
                          <GoHeartFill className="text-red-500" />
                        ) : (
                          <GoHeart />
                        )}
                        {creation.likes}
                      </button>
                    </div>
                    
                    <div className="text-sm text-text-subtle mb-4 font-sans">
                      Par <span className="font-sans font-medium text-text-secondary">{creation.creator}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                      <div>
                        <div className="text-text-subtle uppercase tracking-wider">Cadran</div>
                        <div className="font-medium text-text-secondary">{creation.dial}</div>
                      </div>
                      <div>
                        <div className="text-text-subtle uppercase tracking-wider">Aiguilles</div>
                        <div className="font-medium text-text-secondary">{creation.hands}</div>
                      </div>
                      <div>
                        <div className="text-text-subtle uppercase tracking-wider">Boîtier</div>
                        <div className="font-medium text-text-secondary">{creation.case}</div>
                      </div>
                      <div>
                        <div className="text-text-subtle uppercase tracking-wider">Bracelet</div>
                        <div className="font-medium text-text-secondary">{creation.strap}</div>
                      </div>
                    </div>

                    <button className="w-full mt-6 py-3 border border-primary text-primary rounded-full text-sm font-sans uppercase tracking-wider transition-all duration-300 hover:bg-primary hover:text-dark">
                      Voir les Détails
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={7}>
            <div className="text-center mt-16">
              <button className="inline-flex items-center gap-2 rounded-full border border-primary text-primary font-sans px-8 py-4 text-base uppercase tracking-[0.2em] 
                                 transition-all duration-300
                                 hover:bg-primary hover:text-dark hover:-translate-y-[2px] hover:shadow-lg">
                <GoArrowUpRight />
                Voir Plus de Créations
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VOTING SECTION */}
      <section className="py-20 bg-dark text-text-primary">
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent mb-8 mx-auto" />
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-6 text-text-primary">
                Prochaines Inspirations
              </h2>
              <p className="text-lg text-text-muted leading-relaxed max-w-2xl mx-auto font-sans">
                Votez pour les régions françaises qui inspireront nos prochaines collections de cadrans, aiguilles et bracelets.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {currentRegions.map((region, index) => (
              <Reveal key={region.name} delay={index + 1}>
                <div className="bg-surface border border-primary/40 rounded-xl p-6 transition-all duration-300 hover:bg-surface-hover hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-xl text-text-primary">{region.name}</h3>
                    <div className="text-primary font-sans text-sm">
                      {region.votes} votes
                    </div>
                  </div>
                  
                  <p className="text-text-muted text-sm mb-6 font-sans">
                    {region.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="w-full bg-surface-active rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((region.votes / 250) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => voteForRegion(region.name)}
                    disabled={votedRegions.has(region.name)}
                    className={`w-full py-3 rounded-full text-sm font-sans uppercase tracking-wider transition-all duration-300 ${
                      votedRegions.has(region.name)
                        ? 'bg-primary/20 text-primary/50 cursor-not-allowed'
                        : 'border border-primary text-primary hover:bg-primary hover:text-dark'
                    }`}
                  >
                    {votedRegions.has(region.name) ? 'Vote Enregistré' : 'Voter'}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={7}>
            <div className="text-center mt-16">
              <p className="text-text-subtle font-sans text-sm mb-6">
                Le vote se termine le 31 octobre 2025
              </p>
              <Link
                to="/your-watch"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-dark font-sans px-8 py-4 text-base uppercase tracking-[0.2em] 
                             transition-all duration-300 shadow-md font-medium
                             hover:bg-primary-dark hover:-translate-y-[2px] hover:shadow-lg"
              >
                <GoArrowUpRight />
                Créer avec les Inspirations Actuelles
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 bg-background">
        <div className="px-6 md:px-12 max-w-4xl mx-auto text-center">
          <Reveal>
            <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-6 text-text-primary">
              Rejoignez Notre Communauté
            </h3>
            <p className="text-lg text-text-muted leading-relaxed mb-10 font-sans">
              Partagez vos créations uniques, découvrez l'inspiration des autres membres, et participez à l'évolution de Montres-Bastille.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/your-watch"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-dark font-sans px-8 py-4 text-base uppercase tracking-[0.2em] 
                           transition-all duration-300 shadow-md font-medium
                           hover:bg-primary-dark hover:-translate-y-[2px] hover:shadow-lg"
              >
                <GoArrowUpRight />
                Créer Ma Montre
              </Link>
              <button className="inline-flex items-center gap-2 rounded-full border border-primary text-primary font-sans px-8 py-4 text-base uppercase tracking-[0.2em] 
                                transition-all duration-300
                                hover:bg-primary hover:text-dark hover:-translate-y-[2px] hover:shadow-lg">
                <GoArrowUpRight />
                S'inscrire à la Newsletter
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}