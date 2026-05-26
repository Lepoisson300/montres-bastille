import Reveal from "../Logic/Reveal";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { Helmet } from "react-helmet-async";

export default function ConfidentialitePage() {
  
  const privacyInfo = {
    companyName: "Montres-Bastille",
    email: "contact@montres-bastille.fr",
    updateDate: "26 Mai 2026",
  };

  return (
    <div className="bg-background text-text-secondary font-sans min-h-screen">
      <Helmet>
        <title>Politique de Confidentialité | Montres-Bastille</title>
        <meta name="description" content="Découvrez comment l'atelier Montres-Bastille collecte, utilise et protège vos données personnelles dans le respect du RGPD." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://montre-bastille.fr/confidentialite" />
      </Helmet>

      <Nav bg={false} />
      
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]" />
        <div className="absolute top-0 right-0 -z-10 h-125 w-125 rounded-full bg-primary/5 blur-[120px]" />
        
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <Reveal>
            <div className="max-w-3xl">
              <p className="tracking-[.25em] text-xs uppercase text-primary font-sans opacity-90 mb-4">Protection des données</p>
              <h1 className="text-4xl md:text-5xl font-serif leading-tight tracking-tight text-text-primary">
                Politique de <span className="text-primary">Confidentialité</span>
              </h1>
              <p className="mt-6 text-lg text-text-muted font-sans leading-relaxed">
                Chez {privacyInfo.companyName}, nous accordons une importance capitale à la confidentialité et à la sécurité de vos données. Cette page explique de manière transparente comment nous gérons vos informations.
              </p>
              <p className="mt-2 text-sm text-text-muted/60">Dernière mise à jour : {privacyInfo.updateDate}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTENU */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="grid gap-12 md:grid-cols-12">
            
            {/* Sommaire */}
            <div className="hidden md:block md:col-span-4 lg:col-span-3">
              <nav className="sticky top-32 border-l border-primary/20 pl-6 py-2">
                <Reveal>
                  <p className="font-serif text-text-primary mb-4 text-lg">Sommaire</p>
                  <ul className="space-y-3 text-sm text-text-muted font-sans">
                    <li><a href="#collecte" className="hover:text-primary transition-colors">1. Données collectées</a></li>
                    <li><a href="#authentification" className="hover:text-primary transition-colors">2. Authentification & Sécurité</a></li>
                    <li><a href="#stockage" className="hover:text-primary transition-colors">3. Hébergement & Bases de données</a></li>
                    <li><a href="#utilisation" className="hover:text-primary transition-colors">4. Finalité de l'utilisation</a></li>
                    <li><a href="#droits" className="hover:text-primary transition-colors">5. Vos droits (RGPD)</a></li>
                  </ul>
                </Reveal>
              </nav>
            </div>

            {/* Articles */}
            <div className="md:col-span-8 lg:col-span-9 space-y-16">
              
              <Reveal>
                <article id="collecte">
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">01.</span> Données collectées
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p>Dans le cadre de votre navigation et de vos achats sur <strong>{privacyInfo.companyName}</strong>, nous sommes amenés à collecter certaines informations vous concernant :</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                      <li><strong>Données d'identification :</strong> Nom, prénom, adresse e-mail.</li>
                      <li><strong>Données de livraison :</strong> Adresse postale, numéro de téléphone.</li>
                      <li><strong>Données techniques :</strong> Adresse IP, type de navigateur, informations de session.</li>
                    </ul>
                    <p className="text-sm italic">Note : Nous ne stockons aucune coordonnée bancaire. Les transactions sont gérées intégralement par nos prestataires de paiement sécurisés.</p>
                  </div>
                </article>
              </Reveal>

             <Reveal>
                <article id="authentification">
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">02.</span> Commandes & Sécurité
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p>Afin de vous offrir une expérience d'achat fluide et adaptée à vos préférences, deux options s'offrent à vous lors de la validation de votre commande :</p>
                    
                    <ul className="space-y-4 mt-4">
                      <li className="bg-surface-hover p-5 rounded-xl border border-border/5">
                        <strong className="text-text-primary block mb-1">1. La commande en mode "Invité"</strong>
                        <span className="text-sm">Vos informations (nom, adresse, email) sont collectées de manière ponctuelle et utilisées exclusivement pour le traitement, l'expédition et le suivi de la commande en cours. Aucun compte client permanent n'est créé.</span>
                      </li>
                      <li className="bg-surface-hover p-5 rounded-xl border border-border/5">
                        <strong className="text-text-primary block mb-1">2. La création d'un Espace Client</strong>
                        <span className="text-sm">Pour faciliter vos futurs achats et retrouver facilement l'historique de vos garanties, vous pouvez opter pour la création d'un compte. La sécurisation de cet espace est intégralement déléguée à <strong>Auth0</strong>, un leader mondial de la gestion des identités.</span>
                      </li>
                    </ul>

                    <div className="bg-background-alt rounded-xl p-6 border-l-2 border-primary mt-6">
                      <p className="text-sm">
                        <strong>Protection des identifiants :</strong> Dans le cas d'une création de compte, vos mots de passe ne transitent jamais en clair sur nos serveurs et ne sont pas stockés dans nos bases de données. Auth0 utilise des standards de cryptage de pointe pour garantir une sécurité absolue.
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>

              <Reveal>
                <article id="stockage">
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">03.</span> Hébergement & Bases de données
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p>L'architecture technique de <strong>{privacyInfo.companyName}</strong> repose sur des infrastructures modernes et sécurisées :</p>
                    <ul className="space-y-4">
                      <li className="flex flex-col">
                        <span className="font-bold text-text-primary">L'interface utilisateur (Front-end)</span>
                        <span>Le site web est hébergé de manière statique via <strong>GitHub</strong>, garantissant une disponibilité optimale et une sécurité contre les vulnérabilités de serveurs traditionnels.</span>
                      </li>
                      <li className="flex flex-col">
                        <span className="font-bold text-text-primary">La base de données (Back-end)</span>
                        <span>Les informations relatives à vos commandes et préférences (hors mots de passe) sont stockées de manière chiffrée sur des clusters <strong>MongoDB</strong> (technologie de base de données NoSQL), configurés avec des règles d'accès strictes.</span>
                      </li>
                    </ul>
                  </div>
                </article>
              </Reveal>

              <Reveal>
                <article id="utilisation">
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">04.</span> Finalité de l'utilisation
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p>Les données que nous collectons sont strictement nécessaires aux finalités suivantes :</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                      <li>La gestion et le traitement de vos commandes de montres.</li>
                      <li>Le suivi de la livraison et le service après-vente (garanties).</li>
                      <li>L'amélioration de l'expérience de navigation sur le site.</li>
                    </ul>
                    <p><strong>{privacyInfo.companyName} s'engage à ne jamais vendre, louer ou céder vos données à des tiers à des fins commerciales.</strong></p>
                  </div>
                </article>
              </Reveal>

              <Reveal>
                <article id="droits">
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">05.</span> Vos droits (RGPD)
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p>Conformément à la réglementation européenne (RGPD), vous disposez des droits suivants concernant vos données personnelles :</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                      <li><strong>Droit d'accès et de rectification :</strong> Vous pouvez modifier vos informations à tout moment depuis votre espace client Auth0.</li>
                      <li><strong>Droit à l'effacement ("droit à l'oubli") :</strong> Vous pouvez demander la suppression totale de votre compte et de l'historique associé.</li>
                      <li><strong>Droit à la portabilité :</strong> Vous pouvez demander l'export de vos données.</li>
                    </ul>
                    <p className="mt-4">
                      Pour exercer l'un de ces droits, il vous suffit de nous envoyer un e-mail à l'adresse <strong>{privacyInfo.email}</strong>. Nous nous engageons à traiter votre demande dans un délai maximum de 30 jours.
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