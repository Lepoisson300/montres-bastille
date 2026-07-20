// App.tsx
import "./App.css";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import AccountPage from "./pages/AccountPage";
import { useEffect, useState } from "react";
import ConfiguratorPage from "./pages/ConfiguratorPage";
import AboutPage from "./pages/AboutPage";
import CommunityPage from "./pages/CommunityPage";
import ContactPage from "./pages/ContactPage";
import RegionPage from "./pages/RegionPage"
import { useAuth0 } from "@auth0/auth0-react";
import OnboardingModal from "./components/OnboardingModal";
import Footer from "./components/Footer";
import CartPage from "./pages/CartPage";
import type { PartOption } from "./types/Parts";
import SuccessPage from "./pages/SuccessPaiementPage";
import { HelmetProvider } from 'react-helmet-async';
import { AlertProvider } from "./Logic/AlertContext";
import OrderTrackingPage from "./pages/orderPage";
import CgvPage from "./pages/CGVPage";
import MentionsLegalesPage from "./pages/MentionsLegalesPage";
import ConfidentialitePage from "./pages/ConfidentialitePage";
import HomePage from "./pages/HomePage";


// --- Main App Component ---

const apiAddress = import.meta.env.VITE_API_URL;

function App() {

  const { user, isAuthenticated, isLoading } = useAuth0();
  const [dbUser, setDbUser] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [components, setComponents] = useState<PartOption[]>([]);  // 1. Fetch User Data whenever Auth0 User changes
  
  useEffect(() => {
    async function fetchUserData() {
      if (isAuthenticated && user?.email) {
        try {
          const res = await fetch(`${apiAddress}/api/users`);
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
  

  useEffect(() => {
    async function startServer() {
      try {
        const start = await fetch(`${apiAddress}/api/site`);
        console.log("Server start OK :", start.ok);
      } catch (error) {
        console.error("Failed to ping server", error);
      }
    }
    
    // Create an async wrapper function inside the useEffect
    async function fetchAllData() {
      // We can run the ping in the background without waiting for it
      startServer(); 
      setComponents(await getComponents());
    }
    console.log(components)
    fetchAllData();
  }, []);

    // Récupération depuis l'API
  async function getComponents() {
    try {
      const response = await fetch(`${apiAddress}/api/components`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("result : ",result)
      return result; 
      
    } catch (error) {
      console.error("Erreur lors de la récupération des composants:", error);
      return []; 
    }
  }


  const handleOnboardingSuccess = (updatedUser: any) => {
    setDbUser(updatedUser); // Update local state immediately
    setShowOnboarding(false); // Close the modal
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="">
      <HelmetProvider>
      <BrowserRouter>
      <AlertProvider>
      {/* Main Content */}
      <main className="bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage allcomponents={components}/>} />
          <Route path="/region-page" element={<RegionPage components={components} />} />
          <Route path="/configurator" element={<ConfiguratorPage/>} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/cgv" element={<CgvPage/>}/>
          <Route path="/mention" element={<MentionsLegalesPage/>}/>
          <Route path="/privacy" element={<ConfidentialitePage/>}/>
          <Route path="/panier" element={<CartPage />}/>
          <Route path="/success" element={<SuccessPage/>}/>
          <Route path="/order" element={<OrderTrackingPage/>}/>
          <Route path="/framer" element={<HomePage/>}/>

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
      </AlertProvider>
      </BrowserRouter>
</HelmetProvider>
    </div>

  );
}

export default App;