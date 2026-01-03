import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { GoArrowUpRight, GoHeart, GoHeartFill } from "react-icons/go";
import {useAuth0} from "@auth0/auth0-react";
import Alert from '../components/Alert'; 
import type { AlertType } from '../components/Alert';
import type { Region, Watch } from "../types/Parts";

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

export default function CommunityPage() {
  const [likedCreations, setLikedCreations] = useState(new Set());
  const [votedRegions, setVotedRegions] = useState(new Set());
  const { user,isAuthenticated } = useAuth0();
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);
  const [regionsVotes, setRegionsVotes] = React.useState<Region[]>([]);
  const [watches,setWatches] = React.useState<Watch[]>([]);

  useEffect(() => {
    fetch('https://montre-bastille-api.onrender.com/api/votes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        setRegionsVotes(data.regions);
        console.log('Vote get successfully:', data);
        // set the regions voted of the current user if authenticated
        
      })
      .catch((error) => {
        console.error('Error updating vote:', error);
      });

    
  },[])
  
  const LikeRegion = (regionName: string) => {
    console.log("Liking region with name:", regionName);
    const region = regionsVotes.find(r => r.name === regionName);
    if(isAuthenticated === false){//test if the user is authenticated
      console.log("User must be authenticated to like creations");
      setAlert({ type: 'warning', message: 'Vous devez être connecté pour aimer une création.' });
      return;
    }
    if (!region){
      console.log("Region not found");
      return;
    };
    const voteData = {
      email: user?.email,
      region: region.name // Using region name as region for demo purposes
    };
    fetch('https://montre-bastille-api.onrender.com/api/users/vote', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(voteData)
    })
    .then(response => response.json())
    .then(data => {
      if(data.error){
        setAlert({ type: 'info', message: data.error });
        return;
      }
      console.log('Vote updated successfully:', data);
      setAlert({ type: 'success', message: `Votre vote pour ${region.name} a été enregistré !` });
      setVotedRegions(prev => new Set(prev).add(region.name));
    })
    .catch((error) => {
      console.error('Error updating vote:', error);
    });
  };

  return (
    <div className="font-sans min-h-screen bg-background text-text-secondary">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)} // This cleans up the state when timer ends
        />
      )}
      <Grain />

      {/* HERO SECTION */}
      <section className="bg-dark text-text-primary pt-24 pb-20">
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center max-w-4xl mx-auto">
              <div className="h-px w-32  from-transparent via-primary to-transparent mb-8 mx-auto" />
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
            {watches.map((creation: Watch, index) => (
              <Reveal key={creation.id} delay={index + 1}>
                <div className="bg-surface rounded-2xl shadow-lg border border-border/20 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-surface-hover">
                  {/* Watch Preview */}
                  <div className="p-8  from-surface-hover to-surface-active">
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
                      //ajouter le onclick pour liker une création
                        className="flex items-center gap-2 text-sm text-text-subtle transition-colors hover:text-red-500"
                      >
                        {likedCreations.has(creation.id) ? (
                          <GoHeartFill className="text-red-500" />
                        ) : (
                          <GoHeart />
                        )}
                        {creation.votes}
                      </button>
                    </div>
                    
                    <div className="text-sm text-text-subtle mb-4 font-sans">
                      Par <span className="font-sans font-medium text-text-secondary">{creation.creator}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                      <div>
                        <div className="text-text-subtle uppercase tracking-wider">Cadran</div>
                        <div className="font-medium text-text-secondary">{creation.components[0].name}</div>
                      </div>
                      <div>
                        <div className="text-text-subtle uppercase tracking-wider">Aiguilles</div>
                        <div className="font-medium text-text-secondary">{creation.components[1].name}</div>
                      </div>
                      <div>
                        <div className="text-text-subtle uppercase tracking-wider">Boîtier</div>
                        <div className="font-medium text-text-secondary">{creation.components[2].name}</div>
                      </div>
                      <div>
                        <div className="text-text-subtle uppercase tracking-wider">Bracelet</div>
                        <div className="font-medium text-text-secondary">{creation.components[3].name}</div>
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
                                 hover:bg-primary hover:text-dark hover:shadow-lg">
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
              <div className="h-px w-32 from-transparent via-primary to-transparent mb-8 mx-auto" />
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-6 text-text-primary">
                Prochaines Inspirations
              </h2>
              <p className="text-lg text-text-muted leading-relaxed max-w-2xl mx-auto font-sans">
                Votez pour les régions françaises qui inspireront nos prochaines collections de cadrans, aiguilles et bracelets.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {regionsVotes.map((region, index) => (
              <Reveal key={region.name} delay={index + 1}>
                <div className="bg-surface border border-primary/40 rounded-xl p-6 transition-all duration-300 hover:bg-surface-hover hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-xl text-text-primary">{region.name}</h3>
                    <div className="text-primary font-sans text-sm">
                      {region.votes} votes
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-full bg-surface-active rounded-full h-2">
                      <div 
                        className="from-primary to-primary-dark h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((region.votes / 250) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => LikeRegion(region.name)}
                    disabled={votedRegions.has(region.name)}
                    className={`w-full py-3 rounded-full text-sm font-sans uppercase tracking-wider transition-all duration-300 ${
                      votedRegions.has(region.name)
                        ? 'bg-primary/20 text-primary/50 cursor-not-allowed'
                        : 'border border-primary text-primary hover:bg-primary hover:text-dark'
                    }`}
                  >
                    {votedRegions.has(region.name) ? 'Retirer Vote' : 'Voter'}
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
                             hover:bg-primary-dark hover:shadow-lg"
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
                           hover:bg-primary-dark hover:shadow-lg"
              >
                <GoArrowUpRight />
                Créer Ma Montre
              </Link>
              <button className="inline-flex items-center gap-2 rounded-full border border-primary text-primary font-sans px-8 py-4 text-base uppercase tracking-[0.2em] 
                                transition-all duration-300
                                hover:bg-primary hover:text-dark hover:shadow-lg">
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