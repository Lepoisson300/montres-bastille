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
  const { isAuthenticated } = useAuth0();
  const { loginWithRedirect } = useAuth0();


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.scrollTo(0, 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);



  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
      ].join(" ")}
      role="banner"
    >
      <div className="mx-auto mt-3 w-[95%] max-w-6xl">
        <nav
          className={[
            "relative rounded-2xl border",
            "bg-midnight/95",
            "border-champagne/20",
            "shadow-[0_2px_25px_rgba(0,0,0,0.35)]",
            scrolled ? "py-2" : "py-3",
          ].join(" ")}
          aria-label="Primary"
        >
          {/* Hairline top border */}
          <span className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-champagne/60 to-transparent rounded-t-2xl" />

          <div className="flex items-center justify-between px-4 md:px-6">
            {/* Logo + Brand */}
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src={logo}
                alt="Montres-Bastille"
                className="h-12 w-16 "
              />
              <span className="font-serif text-lg tracking-wide text-ivory">
                Montres-Bastille
              </span>
            </Link>

            {/* Desktop navigation */}
            <ul className="hidden md:flex items-center gap-2">
              {primaryRoutes.map(({ name, to }) => (
                <li key={to} className="relative group">
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      [
                        "px-3 py-2 rounded-md text-sm uppercase tracking-[0.12em]",
                        "transition-all duration-300",
                        "text-ivory/70 hover:text-ivory",
                        "hover:-translate-y-[2px] hover:shadow-md",
                        isActive ? "text-ivory" : "",
                      ].join(" ")
                    }
                  >
                    {name}
                  </NavLink>
                  {/* Champagne underline */}
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

            {/* Right side */}
            <div className="flex items-center gap-2">
              

              {/* Account */}
              {isAuthenticated === false ? <>
                    <Link
                  onClick={() =>loginWithRedirect()}
                  to="#"
                  aria-label="Compte"
                  className="hidden sm:inline-flex p-2 rounded-full text-ivory/70 
                            transition-all duration-300
                            hover:text-ivory hover:bg-white/5 hover:-translate-y-[2px] hover:shadow-md"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
                    />
                  </svg>
                </Link>
              </> : <Link
                to="/account"
                aria-label="Compte"
                className="hidden sm:inline-flex p-2 rounded-full text-ivory/70 
                           transition-all duration-300
                           hover:text-ivory hover:bg-white/5 hover:-translate-y-[2px] hover:shadow-md"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
                  />
                </svg>
              </Link>}
              

              {/* Mobile toggle */}
              <button
                type="button"
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((v) => !v)}
                className="md:hidden p-2 rounded-full text-ivory/70 
                           transition-all duration-300
                           hover:text-ivory hover:bg-white/5 hover:-translate-y-[2px] hover:shadow-md"
              >
                {open ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 7h16M4 12h16M4 17h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile drawer */}
          <div
            id="mobile-menu"
            className={[
              "md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
              open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <div className="px-4 pb-4 pt-2">
              <ul className="divide-y divide-ivory/10 rounded-xl border border-ivory/10 bg-midnight/95">
                {primaryRoutes.map(({ name, to }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        [
                          "block px-4 py-3 text-sm tracking-wide transition-all duration-300",
                          "text-ivory/70 hover:bg-champagne/10 hover:text-ivory hover:-translate-y-[2px] hover:shadow-md",
                          isActive ? "bg-champagne/20 text-ivory" : "",
                        ].join(" ")
                      }
                    >
                      {name}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <Link
                    to="/appointment"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-sm tracking-wide text-ivory 
                               bg-champagne/20 hover:bg-champagne/30 hover:-translate-y-[2px] hover:shadow-md transition-all duration-300"
                  >
                    Prendre rendez-vous
                  </Link>
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
