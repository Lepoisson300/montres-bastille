import Reveal from "../Logic/Reveal";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { Helmet } from "react-helmet-async";

export default function MentionsLegalesPage() {
  
  const legalInfo = {
    companyName: "Montres-Bastille",
    legalForm: "[Statut juridique, Auto-entreprise]",
    //capital: "4000 €", // À retirer si auto-entreprise
    address: "538 rte de la Redonde, 24260 Campagne",
    siret: "",
    rcs: "Ville du RCS - RCS de Paris",
    //vatNumber: "[Numéro de TVA intracommunautaire - si applicable]",
    email: "contact@montres-bastille.fr",
    phone: "+33 6 23 25 65 46",
    director: "Puigsech Rémi",
    hostName: "GITHUB FRANCE",
    hostAddress: "37 QUAI DU PRESIDENT ROOSEVELT 92130 ISSY-LES-MOULINEAUX",
  };

  return (
    <div className="bg-background text-text-secondary font-sans min-h-screen">
      <Helmet>
        <title>Mentions Légales | Montres-Bastille</title>
        <meta name="description" content="Consultez les mentions légales du site Montres-Bastille. Informations sur l'éditeur, l'hébergement et la propriété intellectuelle." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://montre-bastille.fr/mentions-legales" />
      </Helmet>

      <Nav bg={false} />
      
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.08]" 
        />
        <div className="absolute top-0 right-0 -z-10 h-125 w-125 rounded-full bg-primary/5 blur-[120px]" />
        
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <Reveal>
            <div className="max-w-3xl">
              <p className="tracking-[.25em] text-xs uppercase text-primary font-sans opacity-90 mb-4">Informations Juridiques</p>
              <h1 className="text-4xl md:text-5xl font-serif leading-tight tracking-tight text-text-primary">
                Mentions <span className="text-primary">Légales</span>
              </h1>
              <p className="mt-6 text-lg text-text-muted font-sans leading-relaxed">
                Conformément aux dispositions de la loi pour la confiance dans l'économie numérique (LCEN), les informations concernant l'éditeur et l'hébergeur du site {legalInfo.companyName} sont détaillées ci-dessous.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTENU DES MENTIONS LÉGALES */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="grid gap-12 md:grid-cols-12">
            
            {/* Sommaire */}
            <div className="hidden md:block md:col-span-4 lg:col-span-3">
              <nav className="sticky top-32 border-l border-primary/20 pl-6 py-2">
                <Reveal>
                  <p className="font-serif text-text-primary mb-4 text-lg">Sommaire</p>
                  <ul className="space-y-3 text-sm text-text-muted font-sans">
                    <li><a href="#editeur" className="hover:text-primary transition-colors">1. Éditeur du site</a></li>
                    <li><a href="#directeur" className="hover:text-primary transition-colors">2. Directeur de la publication</a></li>
                    <li><a href="#hebergement" className="hover:text-primary transition-colors">3. Hébergement</a></li>
                    <li><a href="#propriete" className="hover:text-primary transition-colors">4. Propriété intellectuelle</a></li>
                    <li><a href="#donnees" className="hover:text-primary transition-colors">5. Données personnelles</a></li>
                  </ul>
                </Reveal>
              </nav>
            </div>

            {/* Articles */}
            <div className="md:col-span-8 lg:col-span-9 space-y-16">
              
              <Reveal>
                <article id="editeur">
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">01.</span> Éditeur du site
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p>Le site <strong>{legalInfo.companyName}</strong> est édité par :</p>
                    <ul className="space-y-1 bg-surface-hover p-6 rounded-xl border border-border/10">
                      <li><strong>Raison sociale :</strong> {legalInfo.companyName} ({legalInfo.legalForm})</li>
                      <li><strong>Siège social :</strong> {legalInfo.address}</li>
                      <li><strong>Numéro SIRET :</strong> {legalInfo.siret}</li>
                      <li><strong>RCS :</strong> {legalInfo.rcs}</li>
                      <li className="pt-2 mt-2 border-t border-border/10"><strong>Email :</strong> {legalInfo.email}</li>
                      <li><strong>Téléphone :</strong> {legalInfo.phone}</li>
                    </ul>
                  </div>
                </article>
              </Reveal>

              <Reveal>
                <article id="directeur">
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">02.</span> Directeur de la publication
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p>Le Directeur de la publication est <strong>{legalInfo.director}</strong>, en sa qualité de représentant légal de {legalInfo.companyName}.</p>
                  </div>
                </article>
              </Reveal>

              <Reveal>
                <article id="hebergement">
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">03.</span> Hébergement
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p>Le présent site est hébergé par :</p>
                    <p className="bg-surface-hover p-4 rounded-lg inline-block border border-border/10">
                      <strong>{legalInfo.hostName}</strong><br/>
                      {legalInfo.hostAddress}<br/>
                    </p>
                  </div>
                </article>
              </Reveal>

              <Reveal>
                <article id="propriete">
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">04.</span> Propriété intellectuelle
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p>La structure générale du site, ainsi que les textes, images (animées ou non), photographies, savoir-faire et tous les autres éléments composant le site sont la propriété exclusive de <strong>{legalInfo.companyName}</strong> ou de ses partenaires.</p>
                    <p>Toute représentation ou reproduction, totale ou partielle, de ce site ou de son contenu, par quel que procédé que ce soit, sans l'autorisation expresse et préalable de {legalInfo.companyName} est interdite et constituerait une contrefaçon sanctionnée par le Code de la propriété intellectuelle.</p>
                  </div>
                </article>
              </Reveal>

              <Reveal>
                <article id="donnees">
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">05.</span> Données personnelles
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, les utilisateurs disposent d'un droit d'accès, de rectification, d'effacement et d'opposition aux données personnelles les concernant.</p>
                    <p>Pour exercer ces droits, vous pouvez nous contacter par courriel à l'adresse suivante : <strong>{legalInfo.email}</strong>.</p>
                  </div>
                </article>
              </Reveal>

            </div>
          </div>

          {/* FOOTER CTA */}
          <Reveal>
            <div className="mt-24 border-t border-border/10 pt-12 flex justify-center">
               <Link 
                to="/" 
                className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-colors font-sans"
              >
                <span>← Retour à l'accueil</span>
              </Link>
            </div>
          </Reveal>

        </div>
      </section>
    </div>
  );
}