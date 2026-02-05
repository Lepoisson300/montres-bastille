import Reveal from "../Logic/Reveal";
import { Link } from "react-router-dom";
import texture from "/paper_texture.png"; // Assure-toi que le chemin est correct

export default function LegalPage() {
  
  // Données factices à remplacer par tes vraies infos
  const legalInfo = {
    companyName: "Montres-Bastille",
    status: "Auto-Entreprise au capital de 10 000 €",
    email: "contact@montres-bastille.fr",
    phone: "+33 6 23 25 65 46",
    siret: "123 456 789 00012",
    rcs: "RCS Bordeaux B 123 456 789",
    hostName: "OVH", // Ou OVH, AWS, etc.
    hostAddress: "340 S Lemon Ave #4133 Walnut, CA 91789, USA",
  };

  return (
    <div className="bg-background text-text-secondary font-sans min-h-screen">
      
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        {/* Grain / texture overlay */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.08]" 
          style={{ backgroundImage: `url(${texture})`, backgroundSize: "600px" }} 
        />
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <Reveal>
            <div className="max-w-3xl">
              <p className="tracking-[.25em] text-xs uppercase text-primary font-sans opacity-90 mb-4">Juridique</p>
              <h1 className="text-4xl md:text-6xl font-serif leading-tight tracking-tight text-text-primary">
                Mentions <span className="text-primary">Légales</span>
              </h1>
              <p className="mt-6 text-lg text-text-muted font-sans leading-relaxed">
                Conformément aux dispositions des articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique, dite L.C.E.N., il est porté à la connaissance des utilisateurs et visiteurs du site Montres-Bastille les présentes mentions légales.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTENU JURIDIQUE */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          
          <div className="grid gap-12 md:grid-cols-12">
            
            {/* Navigation / Sommaire (Optionnel ou décoratif sur Desktop) */}
            <div className="hidden md:block md:col-span-4 lg:col-span-3">
              <Reveal>
                <div className="sticky top-32 border-l border-primary/20 pl-6 py-2">
                  <p className="font-serif text-text-primary mb-4 text-lg">Sommaire</p>
                  <ul className="space-y-3 text-sm text-text-muted font-sans">
                    <li>1. Éditeur du site</li>
                    <li>2. Hébergement</li>
                    <li>3. Propriété intellectuelle</li>
                    <li>4. Données personnelles</li>
                  </ul>
                </div>
              </Reveal>
            </div>

            {/* Articles */}
            <div className="md:col-span-8 lg:col-span-9 space-y-16">
              
              {/* 1. ÉDITEUR */}
              <Reveal>
                <article>
                  <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-6 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">01.</span> Éditeur du site
                  </h2>
                  <div className="rounded-2xl border border-primary/20 bg-surface p-8 shadow-sm">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 text-sm">
                      <div>
                        <dt className="text-text-subtle font-sans uppercase tracking-wider text-xs mb-1">Dénomination</dt>
                        <dd className="font-serif text-lg text-text-primary">{legalInfo.companyName}</dd>
                      </div>
                      <div>
                        <dt className="text-text-subtle font-sans uppercase tracking-wider text-xs mb-1">Statut Juridique</dt>
                        <dd className="text-text-primary">{legalInfo.status}</dd>
                      </div>
                      <div className="md:col-span-2 border-t border-border/10 my-2"></div>
                      <div>
                        <dt className="text-text-subtle font-sans uppercase tracking-wider text-xs mb-1">Siège Social</dt>
                        <dd className="text-text-muted">{legalInfo.address}</dd>
                      </div>
                      <div>
                        <dt className="text-text-subtle font-sans uppercase tracking-wider text-xs mb-1">Immatriculation</dt>
                        <dd className="text-text-muted">{legalInfo.rcs} <br/> SIRET : {legalInfo.siret}</dd>
                      </div>
                      <div>
                        <dt className="text-text-subtle font-sans uppercase tracking-wider text-xs mb-1">TVA Intracommunautaire</dt>
                        <dd className="text-text-muted">{legalInfo.tva}</dd>
                      </div>
                      <div>
                        <dt className="text-text-subtle font-sans uppercase tracking-wider text-xs mb-1">Contact</dt>
                        <dd className="text-text-muted">
                          <a href={`mailto:${legalInfo.email}`} className="hover:text-primary transition-colors">{legalInfo.email}</a>
                          <br />
                          {legalInfo.phone}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </article>
              </Reveal>

              {/* 2. HÉBERGEMENT */}
              <Reveal>
                <article>
                  <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-6 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">02.</span> Hébergement
                  </h2>
                  <p className="text-text-muted leading-relaxed font-sans mb-4">
                    Le site est hébergé par :
                  </p>
                  <div className="bg-surface-hover rounded-xl p-6 border-l-2 border-primary">
                    <p className="font-serif text-lg text-text-primary">{legalInfo.hostName}</p>
                    <p className="text-text-muted text-sm mt-1">{legalInfo.hostAddress}</p>
                  </div>
                </article>
              </Reveal>

              {/* 3. PROPRIÉTÉ INTELLECTUELLE */}
              <Reveal>
                <article>
                  <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-6 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">03.</span> Propriété Intellectuelle
                  </h2>
                  <div className="prose prose-invert prose-p:text-text-muted prose-headings:font-serif max-w-none">
                    <p className="leading-relaxed">
                      L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                    </p>
                    <p className="leading-relaxed mt-4">
                      La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
                    </p>
                  </div>
                </article>
              </Reveal>

              {/* 4. DONNÉES PERSONNELLES */}
              <Reveal>
                <article>
                  <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-6 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">04.</span> Données & Cookies
                  </h2>
                  <div className="space-y-4 text-text-muted font-sans leading-relaxed">
                    <p>
                      Les informations recueillies sur les formulaires sont enregistrées dans un fichier informatisé par <strong>{legalInfo.companyName}</strong> pour la gestion de la clientèle et le suivi des commandes.
                    </p>
                    <p>
                      Conformément à la loi « informatique et libertés », vous pouvez exercer votre droit d'accès aux données vous concernant et les faire rectifier en contactant : <span className="text-primary">{legalInfo.email}</span>.
                    </p>
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