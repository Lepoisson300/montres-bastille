import Reveal from "../Logic/Reveal";
import { Link } from "react-router-dom";
import texture from "/paper_texture.png";

export default function CgvPage() {
  
  const companyInfo = {
    companyName: "Montres-Bastille",
    email: "contact@montres-bastille.fr",
    mediator: "[Nom de ton médiateur de la consommation - ex: CM2C]",
    mediatorWebsite: "[Site web du médiateur]",
  };

  return (
    <div className="bg-background text-text-secondary font-sans min-h-screen">
      
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.08]" 
          style={{ backgroundImage: `url(${texture})`, backgroundSize: "600px" }} 
        />
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <Reveal>
            <div className="max-w-3xl">
              <p className="tracking-[.25em] text-xs uppercase text-primary font-sans opacity-90 mb-4">E-commerce</p>
              <h1 className="text-4xl md:text-5xl font-serif leading-tight tracking-tight text-text-primary">
                Conditions Générales <span className="text-primary">de Vente</span>
              </h1>
              <p className="mt-6 text-lg text-text-muted font-sans leading-relaxed">
                Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des transactions établies sur le site {companyInfo.companyName}. Veuillez les lire attentivement avant de passer commande.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTENU DES CGV */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="grid gap-12 md:grid-cols-12">
            
            {/* Sommaire */}
            <div className="hidden md:block md:col-span-4 lg:col-span-3">
              <Reveal>
                <div className="sticky top-32 border-l border-primary/20 pl-6 py-2">
                  <p className="font-serif text-text-primary mb-4 text-lg">Sommaire</p>
                  <ul className="space-y-3 text-sm text-text-muted font-sans">
                    <li>1. Champ d'application</li>
                    <li>2. Produits & Indépendance</li>
                    <li>3. Prix & Paiement</li>
                    <li>4. Fabrication & Livraison</li>
                    <li>5. Rétractation & Sur-mesure</li>
                    <li>6. Garanties Horlogères</li>
                    <li>7. Litiges & Médiation</li>
                  </ul>
                </div>
              </Reveal>
            </div>

            {/* Articles */}
            <div className="md:col-span-8 lg:col-span-9 space-y-16">
              
              <Reveal>
                <article>
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">01.</span> Champ d'application
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p>Les présentes CGV s'appliquent, sans restriction ni réserve, à l'ensemble des ventes conclues par <strong>{companyInfo.companyName}</strong> auprès d'acheteurs non professionnels désirant acquérir les montres proposées à la vente sur le site.</p>
                    <p>La validation d'une commande implique l'acceptation intégrale et sans réserve des présentes CGV par le client.</p>
                  </div>
                </article>
              </Reveal>

              <Reveal>
                <article>
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">02.</span> Produits & Indépendance
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p><strong>{companyInfo.companyName}</strong> propose des montres assemblées à la main, intégrant des composants horlogers de haute qualité (mouvements, boîtiers, cadrans).</p>
                    <div className="bg-surface-hover rounded-xl p-6 border-l-2 border-primary mt-4">
                      <p className="text-sm">
                        <strong>Avertissement :</strong> {companyInfo.companyName} est un atelier d'assemblage indépendant. Sauf mention contraire explicite, nous n'avons <strong>aucune affiliation, partenariat ou lien commercial</strong> avec les marques des mouvements génériques (ex: Seiko / TMI) ou autres composants tiers pouvant être intégrés dans nos créations.
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>

              <Reveal>
                <article>
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">03.</span> Prix & Paiement
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p>Les prix de nos montres sont indiqués en euros (€). [Mentionner "Toutes Taxes Comprises (TTC)" OU "TVA non applicable, art. 293 B du CGI" si tu es en micro-entreprise]. Les frais de livraison sont facturés en supplément et indiqués avant la validation finale de la commande.</p>
                    <p>Le paiement est exigible immédiatement à la commande. Le règlement s'effectue par carte bancaire via un système sécurisé.</p>
                  </div>
                </article>
              </Reveal>

              <Reveal>
                <article>
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">04.</span> Fabrication & Livraison
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p>Pour les modèles assemblés à la demande ou sur-mesure, un délai de fabrication de [X] à [Y] semaines s'ajoute au délai d'expédition. L'Acheteur en est informé lors de la commande.</p>
                    <p>La livraison est effectuée à l'adresse indiquée par le client. Le transfert des risques de perte et de détérioration s'opère dès la remise physique de la montre au client.</p>
                  </div>
                </article>
              </Reveal>

              <Reveal>
                <article>
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">05.</span> Droit de Rétractation & Sur-mesure
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p><strong>Montres en stock :</strong> Conformément à la loi, le client dispose d'un délai de 14 jours francs à compter de la réception de la montre pour exercer son droit de rétractation. La montre doit être retournée dans son état d'origine, non portée, avec ses films de protection.</p>
                    <p><strong>Montres personnalisées / Sur-mesure :</strong> Conformément à l'article L221-28 du Code de la consommation, <strong>le droit de rétractation ne s'applique pas</strong> aux biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (choix spécifique de cadran, d'aiguilles, gravure, etc.).</p>
                  </div>
                </article>
              </Reveal>

              <Reveal>
                <article>
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">06.</span> Garanties Horlogères
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p>Nos montres bénéficient de la garantie légale de conformité (2 ans) et de la garantie contre les vices cachés. Sont expressément <strong>exclus de la garantie</strong> :</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                      <li>L'usure normale de la montre et du bracelet.</li>
                      <li>Le bris de verre ou les rayures consécutifs à un choc.</li>
                      <li>Les dommages dus à un défaut d'étanchéité si la couronne n'était pas correctement vissée ou repoussée.</li>
                      <li>Toute montre ayant été ouverte, modifiée ou réparée par un tiers non autorisé par {companyInfo.companyName}.</li>
                    </ul>
                  </div>
                </article>
              </Reveal>

              <Reveal>
                <article>
                  <h2 className="font-serif text-2xl text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-primary text-lg font-sans opacity-60">07.</span> Litiges & Médiation
                  </h2>
                  <div className="text-text-muted font-sans leading-relaxed space-y-4">
                    <p>Les présentes CGV sont soumises à la loi française.</p>
                    <p>En cas de litige, le client s'adressera en priorité à <strong>{companyInfo.companyName}</strong> à l'adresse {companyInfo.email} pour trouver une solution amiable.</p>
                    <p>À défaut, le client peut recourir gratuitement au service de médiation de la consommation dont nous relevons : {companyInfo.mediator} via le site {companyInfo.mediatorWebsite}.</p>
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