import { Link } from "react-router-dom";
import React, { useState,  useEffect } from "react";
import { GoArrowUpRight } from "react-icons/go";
import {useAuth0} from "@auth0/auth0-react";
import Alert from '../components/Alert'; 
import type { Region } from "../types/Parts";
import Nav from "../components/Nav";
import { Helmet } from "react-helmet-async"; // Ajout de Helmet
import Reveal from "../Logic/Reveal";
import { useAlert } from "../Logic/AlertContext";

// ... (Gardez vos composants Grain et Reveal tels quels)

export default function CommunityPage() {
  const [votedRegions, setVotedRegions] = useState(new Set());
  const { user, isAuthenticated } = useAuth0();
  const {showAlert} = useAlert();
  const [regionsVotes, setRegionsVotes] = React.useState<Region[]>([]);

  useEffect(() => {
    fetch('https://montre-bastille-api.onrender.com/api/votes')
      .then(response => response.json())
      .then(data => {
        setRegionsVotes(data.regions);
      })
      .catch((error) => console.error('Error fetching votes:', error));
  }, [])
  
  const LikeRegion = (regionName: string) => {
    if(!isAuthenticated){
      showAlert('warning', 'Vous devez être connecté pour voter pour une région.' );
      return;
    }
    const region = regionsVotes.find(r => r.name === regionName);
    if (!region) return;
    region.votes +=1 ;
    const voteData = { email: user?.email, region: region.name };

    fetch('https://montre-bastille-api.onrender.com/api/users/vote', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voteData)
    })
    .then(response => response.json())
    .then(data => {
      if(data.error){
        showAlert('info', data.error );
        return;
      }
      showAlert('success', `Votre vote pour la région ${region.name} a été enregistré !` );
      setVotedRegions(prev => new Set(prev).add(region.name));
    })
    .catch((error) => console.error('Error updating vote:', error));
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
      </section>

      {/* VOTING SECTION */}
      <section className="py-20 bg-dark text-text-primary border-t border-white/5">
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {regionsVotes.map((region, index) => (
              <Reveal key={region.name} delay={index + 1}>
                <div className="bg-surface border border-primary/40 rounded-xl p-6 transition-all duration-300 hover:bg-surface-hover hover:-translate-y-1">
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
                    onClick={() => LikeRegion(region.name)}
                    disabled={votedRegions.has(region.name)}
                    aria-label={`Voter pour la région ${region.name}`}
                    className={`w-full py-3 mt-4 rounded-full text-sm font-sans uppercase tracking-wider transition-all duration-300 ${
                      votedRegions.has(region.name)
                        ? 'bg-primary/20 text-primary/50 cursor-not-allowed'
                        : 'border border-primary text-primary hover:bg-primary hover:text-dark'
                    }`}
                  >
                    {votedRegions.has(region.name) ? 'Vote enregistré' : 'Voter pour cette région'}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={4}>
            <div className="text-center mt-16">
              <p className="text-text-subtle font-sans text-sm mb-6 italic">
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
      <section className="py-20 bg-background">
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