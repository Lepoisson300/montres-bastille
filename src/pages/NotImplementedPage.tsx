import React from "react";
import { GoArrowUpRight, GoTools } from "react-icons/go";
import { Link } from "react-router-dom";

// Background grain
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

export default function NotImplementedPage() {
  return (
    <div className="font-sans min-h-screen bg-background text-text-secondary">
      <Grain />

      {/* HERO SECTION – Dark */}
      <section className="bg-dark text-text-primary shadow-lg relative overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-primary via-transparent to-transparent" />
        </div>

        <div className="relative z-10 px-6 md:px-12 py-20 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-surface border border-primary/40">
              <GoTools className="w-12 h-12 text-primary" />
            </div>

            <p className="tracking-[.25em] text-xs uppercase text-text-muted font-sans opacity-90 mb-4">
              Bientôt disponible
            </p>
            
            <h1 className="mt-4 mb-6 text-4xl md:text-6xl font-serif text-text-primary leading-tight tracking-tight">
              Page en Construction
            </h1>

            <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8" />

            <p className="text-lg text-text-muted leading-relaxed mb-12 font-sans max-w-2xl mx-auto">
              Nous travaillons actuellement sur cette section pour vous offrir 
              une expérience exceptionnelle. Cette page sera bientôt disponible 
              avec tout le raffinement que vous attendez de Montres-Bastille.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-dark font-sans px-6 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:bg-primary-dark hover:-translate-y-[2px] hover:shadow-lg"
              >
                <GoArrowUpRight />
                Retour à l'accueil
              </Link>
              
            </div>
          </div>
        </div>
      </section>

      {/* INFO SECTION – Background */}
      <section className="bg-background py-20">
        <div className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight mb-8 text-text-primary text-center">
              En attendant, découvrez...
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "À propos",
                  desc: "Explorez nos montres inspirées du patrimoine français",
                  link: "/about",
                },
                {
                  title: "Communauté",
                  desc: "Créez votre montre unique avec notre configurateur",
                  link: "/community",
                },
                {
                  title: "Accueil",
                  desc: "Découvrez l'essence de Montres-Bastille",
                  link: "/homePage",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  to={item.link}
                  className="rounded-xl border border-border/20 bg-surface p-6 transition-all duration-300 hover:bg-surface-hover hover:-translate-y-[2px] hover:shadow-md group"
                >
                  <div className="font-serif text-lg text-text-primary mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </div>
                  <div className="text-sm text-text-muted font-sans leading-relaxed">
                    {item.desc}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <GoArrowUpRight />
                    <span className="font-sans tracking-[0.15em] uppercase text-xs">
                      Découvrir
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}