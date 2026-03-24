import Reveal from "../Logic/Reveal";
import heroImg from "/about_hero.webp"; 
import atelier1 from "/atelier1.webp"; 
import atelier2 from "/Gurv.png"; 
import atelier3 from "/nico.webp"; 
import eclate from "/eclate.jpg"; 
import Nav from "../components/Nav";
import BtnRedirection from "../components/btnRedirect";
import { Helmet } from "react-helmet-async"; // Import indispensable

export default function AboutPage() {
  return (
      <>
        <Helmet>
          <title>Notre Histoire | Montre Bastille - L'Art de l'Horlogerie à Bordeaux</title>
          <meta name="description" content="Découvrez l'origine de Montre Bastille. Deux passionnés créant des montres uniques inspirées du patrimoine français et assemblées avec précision à Bordeaux." />
          <meta property="og:title" content="L'histoire de Montre Bastille - Savoir-faire et Patrimoine" />
          <meta property="og:description" content="De l'idée aux premiers prototypes : découvrez les coulisses de notre atelier bordelais." />
          <meta property="og:image" content="https://montre-bastille.fr/about_hero.png" />
          <link rel="canonical" href="https://montre-bastille.fr/about" />
        </Helmet>

        <Nav bg={false}/>

    <div className="bg-background text-text-secondary font-sans">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]" />
        <div className="relative isolate">
          <div className="absolute inset-0 -z-10">
            {/* SEO: Ajout d'un Alt descriptif et chargement prioritaire (eager) car c'est le haut de page */}
            <img 
                src={heroImg} 
                alt="Intérieur de l'atelier d'horlogerie Montre Bastille à Bordeaux" 
                className="h-[60vh] w-full object-cover object-center" 
                loading="eager"
            />
            <div className="absolute inset-0 bg-linear-to-b from-dark/40 via-dark/40 to-dark/65" />
          </div>
          <div className="mx-auto max-w-6xl px-6 md:px-12 h-[60vh] flex items-end">
            <Reveal>
              <div className="pb-14 text-text-primary">
                <p className="tracking-[.25em] text-xs uppercase text-primary font-sans opacity-90">Bordeaux — Est. 2025</p>
                <h1 className="mt-4 text-4xl md:text-6xl font-serif leading-tight tracking-tight text-text-primary">L'histoire de <span className="text-primary">Montres‑Bastille</span></h1>
                <p className="mt-4 max-w-2xl text-text-muted font-sans">Si vous êtes arrivé là, c'est que vous êtes curieux de savoir comment sont fabriquées nos montres et ce que nous faisons. Alors allons-y.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <Reveal>
            <div className="grid gap-10 md:grid-cols-12 items-start">
              <div className="md:col-span-7">
                <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-text-primary">La France dans un raffinement absolu</h2>
                <p className="mt-4 leading-relaxed text-text-muted font-sans">Une marque créée par deux passionnés de mécanisme et amoureux de leur pays, pour des gens qui désirent un morceau de cette passion à leur poignet.</p>
                <p className="mt-4 leading-relaxed text-text-muted font-sans">Nous nous déplaçons dans les régions de France pour discuter et comprendre avec les locaux ce qui caractérise le mieux leur région. Les matériaux sont ensuite choisis puis retravaillés par des artisans.</p>

                <h2 className="font-serif text-3xl md:text-4xl tracking-tight mt-8 text-text-primary">Pas seulement une montre</h2>
                <p className="mt-4 leading-relaxed text-text-muted font-sans">Quand on parle de montre, on parle souvent d'un lieu précis, une manière de faire. Nous vous proposons une montre unique qui se base sur l'essence même de la France.</p>
                <p className="mt-4 leading-relaxed text-text-muted font-sans">Chaque montre raconte une histoire, et cette histoire c'est vous qui la créez, à partir de son lieu d'origine et des matériaux qui la composent.</p>
              </div>
              <div className="md:col-span-5">
                <div className="rounded-2xl border border-primary/40 bg-surface p-2 shadow-lg">
                  <div className="rounded-xl bg-surface-hover p-6">
                    {/* SEO: Utilisation de <dl> (Description List) excellente pour la structure sémantique */}
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="text-text-subtle font-sans">Assemblage</dt>
                        <dd className="font-serif text-xl text-text-primary">Bordeaux</dd>
                      </div>
                      <div>
                        <dt className="text-text-subtle font-sans">Tolérance</dt>
                        <dd className="font-serif text-xl text-text-primary">±5 s/j</dd>
                      </div>
                      <div>
                        <dt className="text-text-subtle font-sans">Étanchéité</dt>
                        <dd className="font-serif text-xl text-text-primary">100 m</dd>
                      </div>
                      <div>
                        <dt className="text-text-subtle font-sans">Garantie</dt>
                        <dd className="font-serif text-xl text-text-primary">5 ans</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* IMAGE STRIP */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { src: atelier1, alt: "Outils de précision d'horloger - Atelier Bastille" },
                { src: atelier2, alt: "Artisan horloger en plein travail sur un mouvement" },
                { src: atelier3, alt: "Réglage minutieux d'une montre Bastille" }
              ].map((img, i) => (
                <figure key={i} className="group relative overflow-hidden rounded-2xl shadow-lg border border-border/20">
                  <img 
                    src={img.src} 
                    alt={img.alt} 
                    className="h-64 w-full scale-110 object-cover transition-transform duration-700 group-hover:scale-130" 
                    loading="lazy" 
                  />
                  <figcaption className="pointer-events-none absolute inset-0 bg-linear-to-t from-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </figure>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CRAFT SECTION (dark) */}
      <section className="mt-24 bg-dark text-text-primary shadow-xl">
        <div className="mx-auto max-w-6xl px-6 md:px-12 py-16 md:py-24">
          <Reveal>
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div>
                <h3 className="font-serif text-3xl md:text-4xl tracking-tight text-text-primary">Pourquoi faire ce projet ?</h3>
                <p className="mt-4 text-text-muted leading-relaxed font-sans">Tout est parti d'une simple idée d'avoir une montre personnalisée créée par nous. Nous nous sommes rendus compte que pour les modèles haut de gamme nous n'avions pas beaucoup de diversité de pièces ou que la montre ne créait pas vraiment de lien.</p>
                <p className="mt-4 text-text-muted leading-relaxed font-sans">
                  Chez Montres-Bastille, nous voulons faire des montres d'exception une aventure unique pleine d'émotions.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <BtnRedirection text="Nous écrire" redirection="/contact" style="bordered" size={{px:6,py:3}}/>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-6 -z-10 rounded-3xl bg-linear-to-tr from-primary/10 to-transparent blur-2xl" />
                <div className="rounded-2xl border border-primary/30 bg-surface p-2 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
                  <div className="aspect-4/3 rounded-xl bg-linear-to-b from-surface-hover to-surface-active flex items-center justify-center text-text-muted overflow-hidden">
                    <img 
                        src={eclate} 
                        alt="Vue éclatée du mécanisme d'une montre Bastille" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TIMELINE / MILESTONES */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <Reveal>
            <h3 className="font-serif text-3xl md:text-4xl tracking-tight text-text-primary">Repères</h3>
            <ol className="mt-8 relative border-l border-primary/40 pl-6 space-y-8">
              <li>
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary" />
                <p className="font-serif text-text-primary text-lg">2024 — L'idée</p>
                <p className="text-text-muted text-sm font-sans">Un cahier rempli de cadrans, une obsession pour la lisibilité et les proportions.</p>
              </li>
              <li>
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary" />
                <p className="font-serif text-text-primary text-lg">2025 — Les premiers prototypes</p>
                <p className="text-text-muted text-sm font-sans">Boîtiers usinés en petites séries, réglages minutieux, retours des premiers passionnés.</p>
              </li>
              <li>
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary" />
                <p className="font-serif text-text-primary text-lg">2026 — Lancement</p>
                <p className="text-text-muted text-sm font-sans">Montres‑Bastille voit le jour à Bordeaux. Vous configurez, nous assemblons.</p>
              </li>
            </ol>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIAL / QUOTE */}
      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <Reveal>
            <figure className="rounded-3xl border border-primary/30 bg-surface p-8 md:p-12 shadow-lg">
                <blockquote className="font-serif text-2xl md:text-3xl leading-relaxed text-text-primary italic">
                  "Une montre n'indique pas seulement l'heure, elle révèle la personnalité de celui qui la porte."
                </blockquote>
                <figcaption className="mt-4 text-sm text-text-subtle font-sans">— Le fondateur</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary/20 to-transparent" />
        <div className="mx-auto max-w-6xl px-6 md:px-12 py-12 md:py-16">
          <Reveal>
            <div className="rounded-2xl border border-primary/40 bg-dark text-text-primary p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="font-serif text-2xl md:text-3xl text-text-primary">Prêt(e) à passer au poignet ?</h4>
                <p className="mt-2 text-text-muted font-sans">Configurez votre Montres‑Bastille en quelques clics. Assemblée à Bordeaux, pour vous.</p>
              </div>
              <BtnRedirection text="Commencer" redirection="/region-page" style="bordered" size={{px:6,py:3}}/>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
      </>
  );
}