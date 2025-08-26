import './App.css'
import Reveal from './Logic/Reveal'
import HomePage from './pages/HomePage'
import CardNav from "./components/Nav";
import { BrowserRouter } from "react-router-dom";



function App() {

  return (
    
      <div className="bg-[#f3eadf]">
        <BrowserRouter>
          <CardNav />
          <HomePage />
        </BrowserRouter>

          <footer className="mt-20 bg-mb-midnight text-mb-ivory border-t border-mb-champagne/20">
  <div className="mx-auto max-w-6xl px-6 py-12 md:px-12">
    <Reveal>
      <div className="grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div>
          <p className="font-serif text-2xl mb-2 text-mb-ivory">Montres-Bastille</p>
          <p className="text-sm text-mb-ivory/70">Paris — Est. 2025</p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-serif text-lg mb-3 text-mb-champagne">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-mb-champagne transition-all duration-300">À propos</a></li>
            <li><a href="/community" className="hover:text-mb-champagne transition-all duration-300">Communauté</a></li>
            <li><a href="/contact" className="hover:text-mb-champagne transition-all duration-300">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-serif text-lg mb-3 text-mb-champagne">Contact</h4>
          <p className="text-sm">Lepuig@bastille.fr</p>
          <p className="text-sm">+33 6 69 69 69 69</p>
          <p className="text-sm">12 rue de la Bastille, Paris</p>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-serif text-lg mb-3 text-mb-champagne">Suivez-nous</h4>
          <div className="flex gap-4">
            <a href="https://instagram.com" aria-label="Instagram"
               className="p-2 rounded-full border border-mb-champagne/40 text-mb-ivory hover:bg-mb-champagne hover:text-mb-midnight hover:-translate-y-[2px] hover:shadow-md transition-all duration-300">
              {/* Instagram icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3.5A5.5 5.5 0 1 0 17.5 13 5.5 5.5 0 0 0 12 7.5zm0 2A3.5 3.5 0 1 1 8.5 13 3.5 3.5 0 0 1 12 9.5zM17.5 6a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 17.5 6z"/>
              </svg>
            </a>
            <a href="https://facebook.com" aria-label="Facebook"
               className="p-2 rounded-full border border-mb-champagne/40 text-mb-ivory hover:bg-mb-champagne hover:text-mb-midnight hover:-translate-y-[2px] hover:shadow-md transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M13 3h4V0h-4c-2.8 0-5 2.2-5 5v3H5v4h3v12h4V12h3l1-4h-4V5c0-.6.4-1 1-1z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </Reveal>

    {/* Bottom line */}
    <div className="mt-10 border-t border-mb-ivory/10 pt-6 text-center text-xs text-mb-ivory/50">
      © 2025 Montres-Bastille — Tous droits réservés
    </div>
  </div>
</footer>

    </div>
  )
}

export default App
