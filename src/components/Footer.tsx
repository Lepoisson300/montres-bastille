// src/components/Footer.tsx
import React from "react";
import Reveal from "../Logic/Reveal";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="pt-20 pb-10 bg-dark text-ivory border-t border-primary/20 relative overflow-hidden">
      
      {/* Background Texture Element (Optional subtle luxury touch) */}
      <div className="absolute top-0 left-0 w-full h-1 from-transparent via-primary/40 to-transparent opacity-50" />

      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        <Reveal>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Column 1: Brand & Tagline */}
            <div className="space-y-4">
              <h3 className="font-serif text-3xl text-primary tracking-wide">
                Montres-Bastille
              </h3>
              <p className="text-text-muted text-sm font-sans leading-relaxed max-w-xs">
                Un morceau d'histoire française au poignet. <br />
                Conçu et assemblé à Bordeaux.
              </p>
              <p className="text-xs text-primary/60 font-serif italic mt-2">
                Est. 2025
              </p>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h4 className="font-serif text-lg mb-6 text-ivory border-b border-primary/20 pb-2 inline-block">
                Navigation
              </h4>
              <ul className="space-y-3 text-sm font-sans">
                {['À propos', 'Personnaliser', 'Communauté'].map((item, index) => {
                   // Helper to map names to routes
                   const routes: Record<string, string> = {
                     'À propos': '/about',
                     'Personnaliser': '/region-page',
                     'Communauté': '/community'
                   };
                   return (
                     <li key={index}>
                       <Link 
                         to={routes[item]}
                         className="text-text-muted hover:text-primary hover:pl-2 transition-all duration-300 block"
                       >
                         {item}
                       </Link>
                     </li>
                   );
                })}
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h4 className="font-serif text-lg mb-6 text-ivory border-b border-primary/20 pb-2 inline-block">
                Nous Contacter
              </h4>
              <div className="space-y-4 text-sm font-sans text-text-muted">
                <div className="group">
                  <span className="block text-xs uppercase tracking-wider text-text-subtle mb-1">Email</span>
                  <a 
                    href="mailto:contact@montres-bastille.fr" 
                    className="group-hover:text-primary transition-colors duration-300"
                  >
                    contact@montres-bastille.fr
                  </a>
                </div>
                <div className="group">
                  <span className="block text-xs uppercase tracking-wider text-text-subtle mb-1">Téléphone</span>
                  <a 
                    href="tel:+33623256546" 
                    className="group-hover:text-primary transition-colors duration-300"
                  >
                    +33 6 23 25 65 46
                  </a>
                </div>
              </div>
            </div>

            {/* Column 4: Socials */}
            <div>
              <h4 className="font-serif text-lg mb-6 text-ivory border-b border-primary/20 pb-2 inline-block">
                Suivez-nous
              </h4>
              <p className="text-text-muted text-sm mb-4">
                Rejoignez le mouvement et découvrez nos dernières créations.
              </p>
              <div className="flex space-x-4">
                {/* Instagram */}
                <SocialLink href="#" label="Instagram">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </SocialLink>
                
                {/* Twitter / X */}
                <SocialLink href="#" label="Twitter">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </SocialLink>
              </div>
            </div>

          </div>
        </Reveal>

        {/* Bottom Copyright Bar */}
        <div className="mt-16 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center text-xs text-text-subtle font-sans gap-4">
          <p>© 2025 Montres-Bastille. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link to="/mention" className="hover:text-primary transition-colors">Mentions Légales</Link>
            <Link to="/cgv" className="hover:text-primary transition-colors">CGV</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Sub-component for social links to keep code clean
function SocialLink({ href, label, children }: { href: string, label: string, children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-10 h-10 rounded-full bg-surface border border-primary/20 flex items-center justify-center text-text-muted hover:text-dark hover:bg-primary hover:border-primary transition-all duration-300 transform hover:-translate-y-1"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        {children}
      </svg>
    </a>
  );
}