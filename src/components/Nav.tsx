// NavbarLuxury.tsx
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "/logo.png";
import { useAuth0 } from '@auth0/auth0-react';

type RouteItem = {
  name: string;
  to: string;
};

const primaryRoutes: RouteItem[] = [
  { name: "À propos", to: "/about" },
  { name: "Votre Montres-Bastille", to: "/your-watch" },
  { name: "Communauté", to: "/community" },
  { name: "Contact", to: "/contact" },
];

const Nav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.scrollTo(0, 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Shared classes for mobile menu items to ensure consistency
  const mobileLinkClasses = (isActive: boolean) => [
    "block px-4 py-3 text-sm tracking-wide transition-all duration-300",
    "text-ivory/70 hover:bg-champagne/10 hover:text-ivory",
    isActive ? "bg-champagne/20 text-ivory" : "",
  ].join(" ");

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      role="banner"
    >
      <div className="mx-auto mt-3 w-[95%] max-w-6xl">
        <nav
          className={[
            "relative rounded-2xl border",
            "bg-midnight/95 backdrop-blur-sm", // Added backdrop-blur for better readability
            "border-champagne/20",
            "shadow-[0_2px_25px_rgba(0,0,0,0.35)]",
            scrolled ? "py-2" : "py-3",
            "transition-all duration-300"
          ].join(" ")}
          aria-label="Primary"
        >
          {/* Hairline top border effect */}
          <span className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-champagne/60 to-transparent rounded-t-2xl" />

          <div className="flex items-center justify-between px-4 md:px-6">
            
            {/* --- Logo + Brand --- */}
            <Link to="/" className="flex items-center gap-2 group shrink-0" onClick={() => setOpen(false)}>
              <img
                src={logo}
                alt="Montres-Bastille"
                className="h-10 w-auto md:h-12 transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-serif text-base md:text-lg tracking-wide text-ivory whitespace-nowrap">
                Montres-Bastille
              </span>
            </Link>

            {/* --- Desktop Navigation --- */}
            <ul className="hidden md:flex items-center gap-1 lg:gap-2">
              {primaryRoutes.map(({ name, to }) => (
                <li key={to} className="relative group">
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      [
                        "px-3 py-2 rounded-md text-sm uppercase tracking-[0.12em]",
                        "transition-all duration-300 block",
                        "text-ivory/70 hover:text-ivory",
                        "hover:-translate-y-[1px]", 
                        isActive ? "text-ivory" : "",
                      ].join(" ")
                    }
                  >
                    {name}
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
            <div className="flex items-center gap-2">
              
              {/* Desktop Account Icon (Hidden on mobile) */}
              <button
                onClick={() => !isAuthenticated ? loginWithRedirect() : null}
                className="hidden md:inline-flex p-2 rounded-full text-ivory/70 transition-all duration-300 hover:text-ivory hover:bg-white/5 hover:-translate-y-[2px] hover:shadow-md"
                aria-label={isAuthenticated ? "Mon compte" : "Se connecter"}
              >
                 {!isAuthenticated ? (
                   // Login Icon
                   <Link to="#" onClick={(e) => e.preventDefault()}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                   </Link>
                 ) : (
                   // Account Link
                   <Link to="/account">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
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
                {/* Standard Links */}
                {primaryRoutes.map(({ name, to }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => mobileLinkClasses(isActive)}
                    >
                      {name}
                    </NavLink>
                  </li>
                ))}

                {/* Mobile Account / Login Item */}
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
      </div>
    </header>
  );
};

export default Nav;