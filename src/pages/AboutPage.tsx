import Reveal from "../Logic/Reveal";
import { Link } from "react-router-dom";
import heroImg from "../assets/about_hero.png";      // replace with real image
import atelier1 from "../assets/atelier1.png";       // replace with real image
import atelier2 from "../assets/atelier2.png";       // replace with real image
import atelier3 from "../assets/watch1.png";       // replace with real image
import texture from "../assets/paper_texture.png";    // optional subtle texture

export default function AboutPage() {
  return (
    <div className="bg-parchment text-ink">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* grain / texture overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url(${texture})`, backgroundSize: "600px" }} />
        <div className="relative isolate">
          <div className="absolute inset-0 -z-10">
            <img src={heroImg} alt="Atelier parisien" className="h-[60vh] w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-midnight/40 via-midnight/40 to-midnight/65" />
          </div>
          <div className="mx-auto max-w-6xl px-6 md:px-12 h-[60vh] flex items-end">
            <Reveal>
              <div className="pb-14 text-ivory">
                <p className="tracking-[.25em] text-xs uppercase text-champagne/90 font-sans">Paris — Est. 2025</p>
                <h1 className="mt-4 text-4xl md:text-6xl font-serif leading-tight tracking-tight">L'histoire de <span className="text-champagne">Montres‑Bastille</span></h1>
                <p className="mt-4 max-w-2xl text-ivory/90">Une maison née de l'amour de son pays et la fascination des mecanismes. Nous créons des montres que l'on garde, que l'on transmet, qui nous rappelle et nous unis à une histoire.</p>
                <div className="mt-6">
                  <Link to="/your-watch" className="inline-flex items-center gap-2 rounded-full bg-champagne text-midnight font-sans px-6 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:bg-champagne/90 hover:-translate-y-[2px]">
                    Créer votre montres-bastille
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7m0 0H9m8 0v8"/></svg>
                  </Link>
                </div>
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
                <h2 className="font-serif text-3xl md:text-4xl tracking-tight">Le temps, sans détour</h2>
                <p className="mt-4 leading-relaxed text-ink/80">Au cœur de la ville de Bordeaux, nous assemblons chaque pièce à la main. Nos boîtiers acier sont fabriqué par des machines de précision chez ... puis brossé et miroir ches nous. Les cadrans sont fabriqués avec des matériaux raffinés qui proviennes directement des régions de France, cela permet de créer des détails qui se découvrent au second regard.</p>
                <p className="mt-4 leading-relaxed text-ink/80">Dès l'origine, nous avons voulu une montre honnête: mouvement éprouvé, composants interchangeables, service simple. Pas d'esbroufe : du beau, du fiable, du durable et de l'histoire.</p>
              </div>
              <div className="md:col-span-5">
                <div className="rounded-2xl border border-wheat-500/40 bg-white/50 p-2 shadow-sm">
                  <div className="rounded-xl bg-parchment p-6">
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="text-ink/60">Assemblage</dt>
                        <dd className="font-serif text-xl">Bordeaux</dd>
                      </div>
                      <div>
                        <dt className="text-ink/60">Tolérance</dt>
                        <dd className="font-serif text-xl">±5 s/j</dd>
                      </div>
                      <div>
                        <dt className="text-ink/60">Étanchéité</dt>
                        <dd className="font-serif text-xl">100 m</dd>
                      </div>
                      <div>
                        <dt className="text-ink/60">Garantie</dt>
                        <dd className="font-serif text-xl">5 ans</dd>
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
              {[atelier1, atelier2, atelier3].map((src, i) => (
                <figure key={i} className="group relative overflow-hidden rounded-2xl shadow-sm">
                  <img src={src} alt="Atelier" className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <figcaption className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </figure>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CRAFT SECTION (dark) */}
      <section className="mt-24 bg-midnight text-ivory shadow-xl">
        <div className="mx-auto max-w-6xl px-6 md:px-12 py-16 md:py-24">
          <Reveal>
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div>
                <h3 className="font-serif text-3xl md:text-4xl tracking-tight">Un morceau d'histoire à votre poignet</h3>
                <p className="mt-4 text-ivory/80 leading-relaxed">Nous limitons le superflu pour sublimer l'essentiel : une lecture claire, une présence au poignet, une lumière qui glisse sur l'acier. Chaque décision — de la typographie du cadran aux aiguilles — répond à une logique d'usage avant tout.</p>
                <ul className="mt-6 space-y-2 text-sm text-ivory/80">
                  <li>• Acier 316L brossé / poli au grain fin</li>
                  <li>• Verre saphir double traitement anti‑reflet</li>
                  <li>• Étanchéité réelle testée pièce par pièce</li>
                  <li>• Bracelets interchangeables en 10 secondes</li>
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/your-watch" className="inline-flex items-center gap-2 rounded-full bg-champagne text-midnight font-sans px-6 py-3 text-sm uppercase tracking-[0.2em] transition-all hover:-translate-y-[2px] hover:shadow-md">Configurer la vôtre</Link>
                  <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-champagne/50 px-6 py-3 text-sm uppercase tracking-[0.2em] text-ivory transition-all hover:bg-white/5 hover:-translate-y-[2px]">Nous écrire</Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-champagne/10 to-transparent blur-2xl" />
                <div className="rounded-2xl border border-champagne/30 bg-midnight/60 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
                  <div className="aspect-[4/3] rounded-xl bg-gradient-to-b from-slate-900/40 to-slate-900/70 flex items-center justify-center text-ivory/60">
                    <span className="text-sm">Vidéo / image macro de cadran (placeholder)</span>
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
            <h3 className="font-serif text-3xl md:text-4xl tracking-tight">Repères</h3>
            <ol className="mt-8 relative border-l border-wheat-500/40 pl-6 space-y-8">
              <li>
                <div className="absolute -left-[6px] top-1.5 h-3 w-3 rounded-full bg-champagne" />
                <p className="font-serif">2024 — L'idée</p>
                <p className="text-ink/70 text-sm">Un cahier rempli de cadrans, une obsession pour la lisibilité et les proportions.</p>
              </li>
              <li>
                <div className="absolute -left-[6px] top-1.5 h-3 w-3 rounded-full bg-champagne" />
                <p className="font-serif">2025 — Les premiers prototypes</p>
                <p className="text-ink/70 text-sm">Boîtiers usinés en petites séries, réglages minutieux, retours des premiers passionnés.</p>
              </li>
              <li>
                <div className="absolute -left-[6px] top-1.5 h-3 w-3 rounded-full bg-champagne" />
                <p className="font-serif">2026 — Lancement</p>
                <p className="text-ink/70 text-sm">Montres‑Bastille voit le jour à Bordeaux. Vous configurez, nous assemblons.</p>
              </li>
            </ol>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIAL / QUOTE */}
      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <Reveal>
            <figure className="rounded-3xl border border-wheat-500/30 bg-white/60 p-8 md:p-12 shadow-sm">
                <blockquote className="font-serif text-2xl md:text-3xl leading-relaxed text-ink/90">"Une montre n'indique pas seulement l'heure, elle révèle la personnalité de celui qui la porte."</blockquote>
                <figcaption className="mt-4 text-sm text-ink/70">— Le fondateur</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-champagne/20 to-transparent" />
        <div className="mx-auto max-w-6xl px-6 md:px-12 py-12 md:py-16">
          <Reveal>
            <div className="rounded-2xl border border-wheat-500/40 bg-midnight text-ivory p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="font-serif text-2xl md:text-3xl">Prêt(e) à passer au poignet ?</h4>
                <p className="mt-2 text-ivory/80">Configurez votre Montres‑Bastille en quelques clics. Assemblée à Paris, pour vous.</p>
              </div>
              <Link to="/your-watch" className="inline-flex items-center gap-2 rounded-full bg-champagne text-midnight font-sans px-6 py-3 text-sm uppercase tracking-[0.2em] transition-all hover:-translate-y-[2px] hover:shadow-md">Commencer</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
