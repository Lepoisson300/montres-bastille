// App.tsx
import "./App.css";
import Reveal from "./Logic/Reveal";
import Nav from "./components/Nav";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ConfiguratorPage from "./pages/ConfiguratorPage";
import AboutPage from "./pages/AboutPage";


// temp placeholders so routes render something
const CommunityPage = () => <div className="p-8">Communauté — bientôt…</div>;
const ContactPage = () => <div className="p-8">Contact — bientôt…</div>;
const AppointmentPage = () => <div className="p-8">Rendez-vous — bientôt…</div>;
const AccountPage = () => <div className="p-8">Compte — bientôt…</div>;

const assets = {
  case: [{ id: "steel_40", name: "Acier 40 mm" }],
  dial: [{ id: "navy", name: "Bleu sunburst" }],
  hands: [{ id: "sword", name: "Feuille" }],
  strap: [{ id: "leather_tan", name: "Cuir cognac", stock: "in" as const }],
  crystal: [{ id: "arc", name: "Saphir AR" }],
  shadow: [{ id: "soft", name: "Ombre douce" }],
};

const pricing = { base: 349, currency: "EUR" };
const rules = {
  bans: [{ if: { case: "gold_38", strap: "rubber_black" }, because: "Rubber indisponible avec or 38 mm." }],
  requires: [{ if: { dial: "date_window" }, then: { hands: "date_set" }, note: "Cadran date → aiguilles date" }],
};

function App() {
  return (
    <div >
      {/* Navbar always visible */}
      <Nav />

      {/* All page content must be inside Routes. Remove the extra <HomePage /> */}
      <main className="bg-parchment shadow-sm">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/your-watch"
            element={<ConfiguratorPage assets={assets} pricing={pricing} rules={rules} />}
          />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/appointment" element={<AppointmentPage />} />
          <Route path="/account" element={<AccountPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer (use Link, not <a>) */}
      <footer className="pt-4 bg-parchment shadow-sm text-mb-ivory border-t border-mb-champagne/20">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <Reveal>
            <div className="grid gap-10 md:grid-cols-4">
              <div>
                <p className="font-serif text-2xl mb-2 text-mb-ivory">Montres-Bastille</p>
                <p className="text-sm text-mb-ivory/70">Paris — Est. 2025</p>
              </div>

              {/* Use Link from react-router-dom */}
              <div>
                <h4 className="font-serif text-lg mb-3 text-mb-champagne">Navigation</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link className="hover:text-mb-champagne transition-all duration-300" to="/about">À propos</Link></li>
                  <li><Link className="hover:text-mb-champagne transition-all duration-300" to="/community">Communauté</Link></li>
                  <li><Link className="hover:text-mb-champagne transition-all duration-300" to="/contact">Contact</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-serif text-lg mb-3 text-mb-champagne">Contact</h4>
                <p className="text-sm">Lepuig@bastille.fr</p>
                <p className="text-sm">+33 6 69 69 69 69</p>
                <p className="text-sm">12 rue de la Bastille, Paris</p>
              </div>

              {/* Social (external can stay <a>) */}
              <div>
                <h4 className="font-serif text-lg mb-3 text-mb-champagne">Suivez-nous</h4>
                {/* ...icons unchanged... */}
              </div>
            </div>
          </Reveal>

          <div className="mt-10 border-t border-mb-ivory/10 pt-6 text-center text-xs text-mb-ivory/50">
            © 2025 Montres-Bastille — Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
