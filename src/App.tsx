import './App.css'
import Reveal from './Logic/Reveal'
import HomePage from './pages/HomePage'
import CardNav from "./components/Nav";
import logo from "./assets/logo.png";



function App() {

  const items = [
    {
      label: "A propos",
      bgColor: "#0D0716",
      textColor: "#ffffff",
      links: [
        { label: "L'entreprise", ariaLabel: "L'entreprise", href: "/about" },
        { label: "Les pieces", ariaLabel: "Les pieces", href: "/careers" },
      ],
    },
    {
      label: "Votre montre",
      bgColor: "#170D27",
      textColor: "#ffffff",
      links: [
        { label: "Personnalisation", ariaLabel: "create your own watch", href: "/projects/featured" },
        { label: "Communauté", ariaLabel: "see the other watches designed", href: "/projects/case-studies" },
      ],
    },
    {
      label: "Contact",
      bgColor: "#271E37",
      textColor: "#ffffff",
      links: [
        { label: "Email", ariaLabel: "Email us", href: "mailto:hello@example.com" },
        { label: "Twitter", ariaLabel: "Twitter", href: "https://twitter.com/yourhandle" },
        { label: "Instagram", ariaLabel: "Instagram", href: "https://www.instagram.com/yourhandle" },
      ],
    },
  ];

  return (
    
    <div className="bg-[#f3eadf]">

        <CardNav
        logo={logo}
        logoAlt="Company Logo"
        items={items}
        // Palette aligned with your page
        baseColor="#f3eadf"
        menuColor="#2b2723"
        buttonBgColor="#efe6da"
        buttonTextColor="#2b2723"
        borderColor="#cdbfae"
        ease="power3.out"
      />

      <HomePage />
          <footer className="mt-8 mx-8 rounded-xl border border-[#cdbfae] bg-[#f3eadf] shadow-sm">
                  <div className="m-3 rounded-xl border border-[#cdbfae] bg-[#f3eadf] px-6 py-8 shadow-sm md:px-10">
                      <Reveal>
                      <p className="font-serif text-2xl">Montres-Bastille</p>
                      <p className="mt-2 text-sm text-[#5a5249]">Paris — Est. 2025</p>
                      <p className="mt-2 text-sm">hello@bastille.fr</p>
                      </Reveal>
                  </div>
            </footer>
    </div>
  )
}

export default App
