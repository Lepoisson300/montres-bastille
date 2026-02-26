// NavbarLuxury.tsx
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import { useAuth0 } from '@auth0/auth0-react';
// import CartButton from "./cartsBouton"; // Décommenter si utilisé

type RouteItem = {
  name: string;
  shortName?: string; // Ajout d'une option pour les textes courts (Tablettes)
  to: string;
};

const primaryRoutes: RouteItem[] = [
  { name: "À propos", to: "/about" },
  { name: "Votre Montres-Bastille", shortName: "Votre Montre", to: "/region-page" },
  { name: "Communauté", to: "/community" },
  { name: "Contact", to: "/contact" },
];

type NavProps = {
  bg: boolean;
};

const Nav: React.FC<NavProps> = ({ bg = false }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [ cartNumber, setCartNumber ] = useState(0)
  const navigate = useNavigate();

  // Scroll detection
  useEffect(() => {
    // 1. Fonction pour lire le panier (sécurisée)
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart"));
        setCartNumber(cart?.length || 0);
      } catch (e) {
        setCartNumber(0);
      }
    };

    // 2. On lit le panier au premier chargement
    updateCartCount();

    // 3. On écoute un événement personnalisé qu'on va appeler 'cartUpdated'
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('cartRemoved', updateCartCount);

    // 4. Ta logique de scroll existante
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.scrollTo(0, 0);
    window.addEventListener("scroll", onScroll, { passive: true });

    // 5. Nettoyage
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener('cartUpdated', updateCartCount);
          window.addEventListener('cartRemoved', updateCartCount);

    };
  }, [pathname]);

  // Shared classes for mobile menu items to ensure consistency
  const mobileLinkClasses = (isActive: boolean) => [
    "block px-4 py-3 text-sm tracking-wide transition-all duration-300",
    "text-ivory/70 hover:bg-champagne/10 hover:text-ivory",
    isActive ? "bg-champagne/20 text-ivory" : "",
  ].join(" ");

  return (
<header className={[
  "fixed top-0 left-0 right-0 z-50 w-full", // J'ai retiré mx-4 ici (voir explication ci-dessous)
  bg ? "bg-neutral-950" : "bg-transparent", // Mieux vaut utiliser un ternaire pour éviter d'écrire "false" dans le HTML
  "py-2 transition-all duration-200 shadow-md"
].filter(Boolean).join(" ")}> 
    <nav
      className={[
        // Correction ici : left-4 right-4 remplace w-full + start-0 + mx-4 pour éviter l'overflow
        "fixed z-50 top-0 left-4 right-4 border-b mt-2 rounded-xl",
        "bg-midnight/95 backdrop-blur-sm",
        "border-champagne/20",
        "shadow-[0_2px_25px_rgba(0,0,0,0.35)]",
        scrolled ? "py-1" : "py-3",
        "transition-all duration-200"
      ].join(" ")}
      aria-label="Primary"
    >
      {/* Hairline top border effect */}
      <span className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-champagne/60 to-transparent rounded-t-2xl" />

      <div className="flex items-center justify-between px-4 md:px-6">
        
        {/* --- Logo + Brand --- */}
        {/* Remplacement de flex-col par flex-row pour un alignement propre sur toutes les tailles */}
        <Link to="/" className="flex flex-row items-center gap-2 md:gap-3 group shrink-0" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Montres-Bastille"
            className="h-8 w-auto md:h-10 lg:h-12 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-serif text-sm md:text-base lg:text-lg tracking-wide text-ivory whitespace-nowrap">
            Montres-Bastille
          </span>
        </Link>

        {/* --- Desktop Navigation --- */}
        <ul className="hidden md:flex items-center gap-1 lg:gap-2">
          {primaryRoutes.map(({ name, shortName, to }) => (
            <li key={to} className="relative group">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    // Ajustement des paddings et typographie pour Tablettes (md) et PC (lg)
                    "px-2 lg:px-3 py-2 rounded-md text-[11px] lg:text-sm uppercase tracking-[0.08em] lg:tracking-[0.12em] whitespace-nowrap",
                    "transition-all duration-300 block",
                    "text-ivory/70 hover:text-ivory",
                    "hover:-translate-y-px", 
                    isActive ? "text-ivory" : "",
                  ].join(" ")
                }
              >
                {/* Utilisation conditionnelle du texte court selon la taille de l'écran */}
                {shortName ? (
                  <>
                    <span className="lg:hidden">{shortName}</span>
                    <span className="hidden lg:inline">{name}</span>
                  </>
                ) : (
                  name
                )}
              </NavLink>
              {/* Animated Underline */}
              <span
                aria-hidden
                className={[
                  "absolute left-2 right-2 -bottom-0.5 h-px",
                  "bg-gradient-to-r from-transparent via-champagne to-transparent",
                  "transition-opacity duration-300",
                  "opacity-0 group-hover:opacity-100",
                ].join(" ")}
              />
            </li>
          ))}
        </ul>

        {/* --- Right Side Actions --- */}
        <div className="flex items-center gap-1 md:gap-2">

          <button
            onClick={()=>{navigate("/panier")}}
            aria-label="Voir le panier"
            className="group relative flex items-center justify-center rounded-full p-2 text-ivory/70 transition-all duration-300 hover:bg-white/5 hover:text-ivory"
          >
            {/* SVG Sac de Shopping élégant */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:scale-105"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartNumber>0 && (
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-bordeaux bg-accent border-2 border-buffer rounded-full -top-2 -end-2">{cartNumber}</div>

            )}

          </button>
          
          {/* Desktop Account Icon (Hidden on mobile) */}
          <button
            onClick={() => !isAuthenticated ? loginWithRedirect() : null}
            className="hidden md:inline-flex p-2 rounded-full text-ivory/70 transition-all duration-300 hover:text-ivory hover:bg-white/5 hover:-translate-y-[2px]"
            aria-label={isAuthenticated ? "Mon compte" : "Se connecter"}
          >
            {!isAuthenticated ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 lg:h-6 lg:w-6">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            ) : (
              <Link to="/account">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 lg:h-6 lg:w-6">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
                </svg>
              </Link>
            )}
          </button>

          {/* Mobile Hamburger Toggle (Hidden on Desktop) */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-full text-ivory/70 transition-all duration-300 hover:text-ivory hover:bg-white/5"
          >
            <span className="sr-only">Open menu</span>
            {open ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* --- Mobile Drawer Menu --- */}
      <div
        id="mobile-menu"
        className={[
          "md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="px-4 pb-4 pt-2">
          <ul className="divide-y divide-ivory/10 rounded-xl border border-ivory/10 bg-midnight/95">
            {primaryRoutes.map(({ name, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => mobileLinkClasses(isActive)}
                >
                  {name} {/* Sur mobile, on garde toujours le nom complet */}
                </NavLink>
              </li>
            ))}

            <li>
              {!isAuthenticated ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    loginWithRedirect();
                  }}
                  className={`${mobileLinkClasses(false)} w-full text-left flex items-center gap-2`}
                >
                  <span>Se connecter</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 opacity-70">
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              ) : (
                <NavLink
                  to="/account"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => mobileLinkClasses(isActive)}
                >
                  Mon compte
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>

</header>
  );
};

export default Nav;