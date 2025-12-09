// App.tsx
import "./App.css";
import Reveal from "./Logic/Reveal";
import Nav from "./components/Nav";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { Auth0Provider, useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"; // Import Auth0 hooks

import HomePage from "./pages/HomePage";
import ConfiguratorPage from "./pages/RegionSelectionPage";
import AboutPage from "./pages/AboutPage";
import CommunityPage from "./pages/CommunityPage";
import ContactPage from "./pages/ContactPage";
import NotImplementedPage from "./pages/NotImplementedPage";
import Map from "./components/Map";

const rules = {
  bans: [{ if: { case: "gold_38", strap: "rubber_black" }, because: "Rubber indisponible avec or 38 mm." }],
  requires: [{ if: { dial: "date_window" }, then: { hands: "date_set" }, note: "Cadran date → aiguilles date" }],
};

// --- Placeholders ---

const AppointmentPage = () => (
  <div className="p-8 bg-background text-text-secondary font-sans min-h-screen">
    <div className="max-w-2xl mx-auto pt-20">
      <h1 className="font-serif text-4xl text-text-primary mb-4">Rendez-vous</h1>
      <p className="text-text-muted">Cette fonctionnalité arrive bientôt...</p>
    </div>
  </div>
);

// --- Account Page (User Profile) ---

const AccountPage = () => {
  const { user, logout } = useAuth0();

  return (
    <div className="p-8 bg-background text-text-secondary font-sans min-h-screen">
      <div className="max-w-2xl mx-auto pt-20">
        <h1 className="font-serif text-4xl text-text-primary mb-8 border-b border-white/10 pb-4">
          Mon Compte
        </h1>
        
        <div className="bg-surface p-6 rounded-lg border border-white/5 shadow-xl">
          <div className="flex items-center gap-6 mb-8">
            {user?.picture ? (
              <img 
                src={user.picture} 
                alt={user.name} 
                className="w-20 h-20 rounded-full border-2 border-primary"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-serif">
                {user?.name?.charAt(0)}
              </div>
            )}
            
            <div>
              <h2 className="text-xl text-text-primary font-medium">{user?.name}</h2>
              <p className="text-text-muted text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-background/50 rounded border border-white/5">
              <h3 className="text-primary text-sm uppercase tracking-wider mb-1">Statut</h3>
              <p className="text-text-secondary">Membre Montres-Bastille</p>
            </div>
          </div>

          <button 
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="mt-8 px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-dark transition-all duration-300 rounded-full text-sm font-medium"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Auth Guard Wrapper ---

const ProtectedAccountPage = withAuthenticationRequired(AccountPage, {
  onRedirecting: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-primary font-serif tracking-widest animate-pulse">AUTHENTIFICATION</p>
      </div>
    </div>
  ),
});

// --- Main App Component ---

function App() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Navbar always visible */}
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN || ""}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || ""}
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >
        <Nav />
      </Auth0Provider>

      {/* Main Content */}
      <main className="flex-grow bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/not-implemented" element={<NotImplementedPage />} />
          <Route path="/your-watch" element={<Map />} />
          <Route path="/configurator" element={<ConfiguratorPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/appointment" element={<AppointmentPage />} />
          
          {/* Protected Route */}
          <Route path="/account" element={<ProtectedAccountPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="pt-16 pb-8 bg-dark text-text-primary border-t border-primary/20">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <Reveal>
            <div className="grid gap-10 md:grid-cols-4">
              <div>
                <p className="font-serif text-2xl mb-2 text-text-primary">Montres-Bastille</p>
                <p className="text-sm text-text-muted font-sans">Bordeaux — Est. 2025</p>
              </div>

              {/* Navigation Links */}
              <div>
                <h4 className="font-serif text-lg mb-3 text-primary">Navigation</h4>
                <ul className="space-y-2 text-sm font-sans">
                  <li>
                    <Link 
                      className="text-text-muted hover:text-primary transition-all duration-300" 
                      to="/about"
                    >
                      À propos
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="text-text-muted hover:text-primary transition-all duration-300" 
                      to="/your-watch"
                    >
                      Personnaliser
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="text-text-muted hover:text-primary transition-all duration-300" 
                      to="/community"
                    >
                      Communauté
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="text-text-muted hover:text-primary transition-all duration-300" 
                      to="/contact"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-serif text-lg mb-3 text-primary">Contact</h4>
                <div className="space-y-1 text-sm font-sans text-text-muted">
                  <p>
                    <a 
                      href="mailto:lepuig@bastille.fr" 
                      className="hover:text-primary transition-colors duration-300"
                    >
                      contact@montres-bastille.fr
                    </a>
                  </p>
                  <p>
                    <a 
                      href="tel:+33669696969" 
                      className="hover:text-primary transition-colors duration-300"
                    >
                      +33 6 23 25 65 46
                    </a>
                  </p>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="font-serif text-lg mb-3 text-primary">Suivez-nous</h4>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-surface border border-primary/30 flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all duration-300"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-surface border border-primary/30 flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all duration-300"
                    aria-label="Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-12 border-t border-border/20 pt-6 text-center text-xs text-text-subtle font-sans">
            <p>© 2025 Montres-Bastille — Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;