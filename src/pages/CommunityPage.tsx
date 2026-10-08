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
import RegionCard from "../components/regionCard";

// ... (Gardez vos composants Grain et Reveal tels quels)
const apiAddress = import.meta.env.VITE_API_URL;

export default function CommunityPage() {
  const [votedRegions, setVotedRegions] = useState<Set<string>>(new Set());
  const [sharedwatch, setSharedWatch] = useState<any[]>([]); // Modifié en tableau vide []
  const [activeRegionImg, setActiveRegionImg] = useState<string | null>(null);

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
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

  const voteLike = async (type: string, regionName?: string) => {
    if (!isAuthenticated) {
      showAlert('warning', 'Vous devez être connecté pour voter ou soutenir une création.');
      return;
    }
    if (type === 'r') {
      if (regionName && votedRegions.has(regionName)) {
        showAlert('info', 'Vous avez déjà voté pour cette région.');
        return;
      }

      const region = regionsVotes.find(r => r.name === regionName);
      if (!region) return;

      // Nouveau format attendu par ton backend unifié
      const voteData = { email: user?.email, elem: region.name, type: 'r' };
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_IDENTIFIER
        }
      });
      fetch(`${apiAddress}/api/users/vote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
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

  };

  return (
    <div className="font-sans min-h-screen bg-background text-text-secondary">
      <Helmet>
        <title>Communauté & Vote | Montre Bastille - Choisissez nos collections</title>
        <meta name="description" content="Rejoignez la communauté Montre Bastille. Votez pour les prochaines régions françaises qui inspireront nos futurs cadrans et montres personnalisées." />
        <meta property="og:title" content="Communauté Montre Bastille - Quel sera notre prochain cadran ?" />
        <meta property="og:description" content="Participez au processus de création et votez pour votre patrimoine régional préféré." />
        <meta property="og:image" content="https://montres-bastille.fr/logo.webp" />
        <link rel="canonical" href="https://montres-bastille.fr/community" />
      </Helmet>

      <Nav bg={false} />

      {/* LUXURY HERO SECTION */}
      <section className="relative h-screen flex flex-col justify-center items-center text-white overflow-hidden pt-20">
        {/* Full background image for hero */}
        <div className="absolute inset-0 z-0">
          <img
            src="/communityBG.webp"
            alt="Fond du mont Saint Michel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background"></div>
        </div>

        <div className="relative z-10 px-6 text-center max-w-5xl mx-auto flex-1 flex flex-col justify-center">
          <Reveal>
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 mb-8 shadow-lg">
              <div className="flex -space-x-2">
                {/* Fake user avatars to represent community */}
                <div className="w-8 h-8 rounded-full bg-primary/80 border-2 border-white flex items-center justify-center text-xs font-bold text-dark">MB</div>
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden"><img src="https://i.pravatar.cc/100?img=1" alt="User" /></div>
                <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white overflow-hidden"><img src="https://i.pravatar.cc/100?img=2" alt="User" /></div>
              </div>
              <span className="text-sm font-medium tracking-wide">Des centaines de passionnés nous ont rejoints. Rejoignez-nous !</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6 leading-tight drop-shadow-xl">
              Créativité. Héritage.<br />Communauté.
            </h1>
            <p className="text-[12px] md:text-[15px] text-white/90 leading-relaxed mb-5 font-sans max-w-3xl mx-auto drop-shadow-md">
              Découvrez les créations de nos membres et participez au choix des prochaines régions qui inspireront nos collections.
            </p>

            <Link
              to="/region-page"
              className="inline-block rounded-2xl bg-primary text-dark font-sans px-4 py-3 md:px-10 md:py-5 text-[10px] md:text-[15px] uppercase tracking-[0.15em] transition-all duration-300 shadow-[0_0_20px_rgba(209,185,148,0.4)] font-medium hover:bg-primary-light hover:scale-105"
            >
              Personnaliser Ma Montre
            </Link>
          </Reveal>
        </div>

        {/* Floating Stats Glass Bar */}
        <div className="flex flex-row w-full px-6 pb-8">
          <div className="max-w-5xl mx-auto rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 flex flex-row md:flex-row justify-around items-center gap-8 shadow-2xl">
            <div className="text-center">
              <div className="text-2xl md:text-5xl font-serif text-primary mb-1">450+</div>
              <div className="text-[10px] md:text-sm uppercase tracking-wider text-white/70 font-medium">Membres Actifs</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-white/10"></div>
            <div className="text-center">
              <div className="text-2xl md:text-5xl font-serif text-white mb-1">120</div>
              <div className="text-[10px] md:text-sm uppercase tracking-wider text-white/70 font-medium">Montres Créées</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-white/10"></div>
            <div className="text-center">
              <div className="text-2xl md:text-5xl font-serif text-white mb-1">2.5K</div>
              <div className="text-[10px] md:text-sm uppercase tracking-wider text-white/70 font-medium">Votes Récoltés</div>
            </div>
          </div>
        </div>
      </section>

      {/* CAROUSEL SECTION */}
      <section className="relative z-10 w-full">
        <CarouselShare sharedWatch={sharedwatch} />
      </section>

      {/* VOTING SECTION (Interactive Background) */}
      <section className="py-24 relative overflow-hidden transition-all duration-1000 ease-in-out min-h-screen flex items-center">
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 z-0">
          {regionsVotes.map((region) => (
            <img
              key={region.name}
              src={region.img}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${activeRegionImg === region.img ? 'opacity-40' : 'opacity-0'}`}
              alt=""
            />
          ))}
          {/* Default fallback background if no card is selected */}
          <div className={`absolute inset-0 bg-background transition-opacity duration-1000 ${!activeRegionImg ? 'opacity-100' : 'opacity-0'}`}></div>
          {/* Dark gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>

        <div className="relative z-10 px-6 md:px-12 w-full max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-6 text-white drop-shadow-md">
                Prochaines Inspirations
              </h2>
              <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto font-sans drop-shadow">
                Votez pour le patrimoine français. Les régions en tête de liste seront les prochaines à intégrer notre configurateur. Cliquez sur une carte pour découvrir son univers.
              </p>
            </div>
          </Reveal>

          <div className="flex overflow-x-auto pb-12 pt-4 snap-x snap-mandatory hide-scrollbar gap-6 md:gap-8 px-4">
            {regionsVotes.map((region, index) => (
              <Reveal key={region.name} delay={index * 0.1}>
                <div className="snap-center shrink-0">
                  <RegionCard
                    region={region}
                    votedRegions={votedRegions}
                    vote={voteLike}
                    isActive={activeRegionImg === region.img}
                    onClick={() => setActiveRegionImg(region.img)}
                  />
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="text-center mt-8">
              <p className="text-primary font-sans text-xl mb-6 italic drop-shadow-sm">
                Fin de la session de vote : 21 Juin 2026
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 bg-background border-t border-white/5 relative z-10">
        <div className="px-6 md:px-12 max-w-4xl mx-auto text-center">
          <Reveal>
            <h3 className="font-serif text-3xl md:text-5xl tracking-tight mb-6 text-text-primary">
              Rejoignez l'Aventure
            </h3>
            <p className="text-lg text-text-muted leading-relaxed mb-10 font-sans max-w-2xl mx-auto">
              Partagez vos créations uniques, inspirez-vous des autres membres et participez activement à l'évolution de l'horlogerie française.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/region-page"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-dark font-sans px-8 py-4 text-base uppercase tracking-[0.2em] transition-all duration-300 shadow-md font-medium hover:bg-primary-dark hover:shadow-[0_0_20px_rgba(209,185,148,0.4)] hover:-translate-y-1"
              >
                <GoArrowUpRight className="text-xl" />
                Personnaliser Ma Montre
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}