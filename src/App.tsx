// App.tsx
import "./App.css";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import AccountPage from "./pages/AccountPage";
import HomePage from "./pages/HomePage";
import { useEffect, useState } from "react";
import ConfiguratorPage from "./pages/RegionSelectionPage";
import AboutPage from "./pages/AboutPage";
import CommunityPage from "./pages/CommunityPage";
import ContactPage from "./pages/ContactPage";
import NotImplementedPage from "./pages/NotImplementedPage";
import RegionPage from "./pages/RegionPage"
import { useAuth0 } from "@auth0/auth0-react";
import OnboardingModal from "./components/OnboardingModal";
import Footer from "./components/Footer";
import LegalPage from "./pages/mentionLegalePage";
import CartPage from "./pages/CartPage";

// --- Main App Component ---

function App() {

  const { user, isAuthenticated, isLoading } = useAuth0();
  const [dbUser, setDbUser] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // 1. Fetch User Data whenever Auth0 User changes
  useEffect(() => {
    async function fetchUserData() {
      if (isAuthenticated && user?.email) {
        try {
          const res = await fetch("https://montre-bastille-api.onrender.com/api/users");
          const users = await res.json();
          const found = users.find((u: any) => u.email === user.email);

          if (found) {
            setDbUser(found);
            // If phone number is missing or empty, trigger the modal
            if (!found.numero || found.numero === "") {
              setShowOnboarding(true);
            } else {
              setShowOnboarding(false);
            }
          }
        } catch (error) {
          console.error("Failed to fetch user", error);
        }
      }
    }
    fetchUserData();
  }, [isAuthenticated, user]);

  useEffect(()=>{
    async function startServer(){
      const start = await fetch("https://montre-bastille-api.onrender.com/api/site")
      console.log(start.json)
    }
    startServer();
    async function getComponents(){
      const component = await fetch("https://montre-bastille-api.onrender.com/api/components")
      const comp = await component.json();
      localStorage.setItem("composants", JSON.stringify(comp))
      console.log(JSON.parse(localStorage.getItem("composants")));
    }
    getComponents();
  },[])

  const handleOnboardingSuccess = (updatedUser: any) => {
    setDbUser(updatedUser); // Update local state immediately
    setShowOnboarding(false); // Close the modal
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="">
      <HashRouter>

      {/* Main Content */}
      <main className="bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/not-implemented" element={<NotImplementedPage />} />
          <Route path="/region-page" element={<RegionPage />} />
          <Route path="/configurator" element={<ConfiguratorPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/mention" element={<LegalPage/>}/>
          <Route path="/panier" element={<CartPage assets={[]} />}/>
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {isAuthenticated && showOnboarding && (
        <OnboardingModal 
           dbUser={dbUser} 
           onUpdateSuccess={handleOnboardingSuccess} 
        />
      )}

      {/* Footer */}
      <Footer />

      </HashRouter>

    </div>

  );
}

export default App;