import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { useAuth0 } from "@auth0/auth0-react";
import type { Region } from "../types/Parts";
import Nav from "../components/Nav";
import { Helmet } from "react-helmet-async";
import Reveal from "../Logic/Reveal";
import { useAlert } from "../Logic/AlertContext";
import CarouselShare from "../components/CarouselShare";

// ... (Gardez vos composants Grain et Reveal tels quels)
const apiAddress = import.meta.env.VITE_API_URL;

export default function CommunityPage() {
  const [votedRegions, setVotedRegions] = useState<Set<string>>(new Set());
  const [likedWatches, setLikedWatches] = useState<Set<string>>(new Set()); // Ajout du state manquant
  const [sharedwatch, setSharedWatch] = useState<any[]>([]); // Modifié en tableau vide []
  
  const { user, isAuthenticated } = useAuth0();
  const { showAlert } = useAlert();
  const [regionsVotes, setRegionsVotes] = React.useState<Region[]>([]);

  useEffect(() => {
    fetch(`${apiAddress}/api/votes`)
      .then(response => response.json())
      .then(data => {
        setRegionsVotes(data.regions);
      })
      .catch((error) => console.error('Error fetching votes:', error));

    fetch(`${apiAddress}/api/postedwatch`)
      .then(response => response.json())
      .then(data => {
        setSharedWatch(data);
      })
      .catch((error) => console.error('Error fetching shared watch:', error));
  }, []);
  
  const voteLike = (type: string, regionName?: string, watchShareName?: string) => {
    if (!isAuthenticated) {
      showAlert('warning', 'Vous devez être connecté pour voter ou soutenir une création.');
      return;
    }

    // ==========================================
    // CAS 1 : VOTE POUR UNE RÉGION
    // ==========================================
    if (type === 'r') {
      if (regionName && votedRegions.has(regionName)) {
        showAlert('info', 'Vous avez déjà voté pour cette région.');
        return;
      }

      const region = regionsVotes.find(r => r.name === regionName);
      if (!region) return;

      // Nouveau format attendu par ton backend unifié
      const voteData = { email: user?.email, elem: region.name, type: 'r' };

      fetch(`${apiAddress}/api/users/vote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voteData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          showAlert('info', data.error);
          return;
        }
        
        region.votes += 1;
        setVotedRegions(prev => new Set(prev).add(region.name));
        showAlert('success', `Votre vote pour la région ${region.name} a été enregistré !`);
      })
      .catch((error) => console.error('Error updating vote:', error));
    } 
    
    // ==========================================
    // CAS 2 : LIKE POUR UNE MONTRE PARTAGÉE
    // ==========================================
    else {
      if (watchShareName && likedWatches.has(watchShareName)) {
        showAlert('info', 'Vous avez déjà soutenu cette création.');
        return;
      }

      const watch = sharedwatch.find(w => w.watch.name === watchShareName);
      if (!watch) return;

      // Nouveau format attendu par ton backend unifié
      const likeData = { email: user?.email, elem: watch.watch.name, type: 'w' };

      // On tape désormais sur la même route !
      fetch(`${apiAddress}/api/users/vote`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(likeData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          showAlert('info', data.error);
          return;
        }

        setSharedWatch(prevWatches => 
          prevWatches.map(w => {
            if (w.watch.name === watch.watch.name) {
              const currentVotes = w.voteCount || (w.votes ? w.votes.length : 0);
              return { ...w, voteCount: currentVotes + 1 };
            }
            return w;
          })
        );

        setLikedWatches(prev => new Set(prev).add(watch.watch.name));
        showAlert('success', 'Votre vote pour cette création a été enregistré !');
      })
      .catch((error) => console.error('Error updating like:', error));
    }
  };

  return (
    <div className="font-sans min-h-screen bg-background text-text-secondary">
      <Helmet>
        <title>Communauté & Vote | Montre Bastille - Choisissez nos collections</title>
        <meta name="description" content="Rejoignez la communauté Montre Bastille. Votez pour les prochaines régions françaises qui inspireront nos futurs cadrans et montres personnalisées." />
        <meta property="og:title" content="Communauté Montre Bastille - Quel sera notre prochain cadran ?" />
        <meta property="og:description" content="Participez au processus de création et votez pour votre patrimoine régional préféré." />
        <meta property="og:image" content="https://montre-bastille.fr/logo.webp" />
        <link rel="canonical" href="https://montre-bastille.fr/community" />
      </Helmet>

      <Nav bg={false}/>

      {/* HERO SECTION */}
      <section className="bg-dark text-text-primary pt-24 pb-20">
        <div className="fixed inset-0 z-0 pointer-events-none bg-background">
          <img 
            src="/communityBG.webp" 
            alt="Fond spatial MedGlass" 
            className="absolute object-cover w-full h-full"
          />
        </div>
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center max-w-4xl mx-auto">
              <div className="h-px w-32 from-transparent via-primary to-transparent mb-8 mx-auto" />
              <h1 className="font-serif text-4xl md:text-6xl tracking-tight mb-6 text-text-primary">
                Communauté Montres-Bastille
              </h1>
              <p className="text-lg text-text-muted leading-relaxed mb-10 font-sans">
                Découvrez les créations de nos membres et participez au choix des prochaines régions qui inspireront nos collections à Bordeaux.
              </p>
            </div>
          </Reveal>
        </div>
        <CarouselShare sharedWatch={sharedwatch}/>

        
      </section>

      {/* VOTING SECTION */}
      <section className="py-20 bg-dark text-text-primary border-t border-white/5 relative z-10">
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-6 text-text-primary">
                Prochaines Inspirations
              </h2>
              <p className="text-lg text-text-muted leading-relaxed max-w-2xl mx-auto font-sans">
                Votez pour le patrimoine français. Les régions en tête de liste seront les prochaines à intégrer notre configurateur.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {regionsVotes.map((region, index) => (
              <Reveal key={region.name} delay={index - 1}>
                <div className="bg-surface/70 border border-primary/40 backdrop-blur-xs rounded-3xl p-10 transition-all duration-300 hover:bg-surface-hover hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-xl text-text-primary">{region.name}</h3>
                    <div className="text-primary font-sans text-sm font-bold">
                      {region.votes} votes
                    </div>
                  </div>

                  <div className="w-full h-[160px] overflow-hidden rounded-lg bg-dark/50">
                      <img 
                        src={region.img} 
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" 
                        alt={`Patrimoine de la région ${region.name} - Inspiration pour Montre Bastille`} 
                        loading="lazy"
                      />
                  </div>
                  
                  <button
                    onClick={() => voteLike('r', region.name)}
                    disabled={votedRegions.has(region.name)}
                    aria-label={`Voter pour la région ${region.name}`}
                    className={`w-full py-3 mt-4 rounded-full text-sm font-sans uppercase tracking-wider transition-all duration-300 ${
                      votedRegions.has(region.name)
                        ? 'bg-primary/20 text-primary/50 cursor-not-allowed border border-transparent'
                        : 'border border-primary text-primary hover:bg-primary hover:text-dark'
                    }`}
                  >
                    {votedRegions.has(region.name) ? 'Vote enregistré' : 'Voter pour cette région'}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={2}>
            <div className="text-center mt-16">
              <p className="text-accent-light font-sans text-xl mb-6 italic">
                Fin de la session de vote : 21 Juin 2026
              </p>
              <Link
                to="/region-page"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-dark font-sans px-8 py-4 text-base uppercase tracking-[0.2em] transition-all duration-300 shadow-md font-medium hover:bg-primary-dark hover:shadow-lg"
              >
                <GoArrowUpRight />
                Créer avec les Collections Actuelles
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 bg-background relative z-10">
        <div className="px-6 md:px-12 max-w-4xl mx-auto text-center">
          <Reveal>
            <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-6 text-text-primary">
              Rejoignez l'Aventure
            </h3>
            <p className="text-lg text-text-muted leading-relaxed mb-10 font-sans">
              Partagez vos créations uniques, inspirez-vous des autres membres et participez activement à l'évolution de l'horlogerie française.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/region-page"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-dark font-sans px-8 py-4 text-base uppercase tracking-[0.2em] transition-all duration-300 shadow-md font-medium hover:bg-primary-dark hover:shadow-lg"
              >
                <GoArrowUpRight />
                Personnaliser Ma Montre
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}