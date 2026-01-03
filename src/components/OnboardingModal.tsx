import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface OnboardingModalProps {
  dbUser: any;
  onUpdateSuccess: (updatedUser: any) => void;
}

export default function OnboardingModal({ dbUser, onUpdateSuccess }: OnboardingModalProps) {
  const { user } = useAuth0();
  const [formData, setFormData] = useState({
    prenom: dbUser?.prenom || user?.given_name || "",
    nom: dbUser?.nom || user?.family_name || "",
    numero: dbUser?.numero || "",
  });
  const [loading, setLoading] = useState(false);

  // Function to handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to submit data to your API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Prepare the payload (merging existing data with new data)
      const payload = {
        email: user?.email, // Identifier
        ...formData
      };
      // 2. Call your API (Ensure you have an endpoint for this, usually PUT or POST)
      const response = await fetch("https://montre-bastille-api.onrender.com/api/users/update   ", {
        method: "PUT", // or POST depending on your backend
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        // 3. Notify parent component to close the modal
        onUpdateSuccess(updatedUser);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. Full Screen Overlay with Blur
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-all duration-500">
      
      {/* 2. The Modal Card */}
      <div className="w-full max-w-lg bg-[#1a1a1a] border border-[#C9A96E]/30 rounded-2xl shadow-2xl p-8 animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl text-[#C9A96E] mb-2">Bienvenue chez Montres-Bastille</h2>
          <p className="text-gray-400 text-sm">
            Pour finaliser votre inscription et accéder à l'expérience complète, 
            veuillez compléter ces quelques informations.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            {/* Prénom */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#C9A96E]">Prénom</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                className="w-full bg-[#111] border border-gray-700 text-white p-3 rounded-lg focus:border-[#C9A96E] focus:outline-none transition-colors"
                placeholder="Votre prénom"
              />
            </div>
            
            {/* Nom */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#C9A96E]">Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="w-full bg-[#111] border border-gray-700 text-white p-3 rounded-lg focus:border-[#C9A96E] focus:outline-none transition-colors"
                placeholder="Votre nom"
              />
            </div>
          </div>

          {/* Phone Number (The Key Field) */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-[#C9A96E]">Numéro de téléphone</label>
            <input
              type="tel"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              required
              className="w-full bg-[#111] border border-gray-700 text-white p-3 rounded-lg focus:border-[#C9A96E] focus:outline-none transition-colors"
              placeholder="06 12 34 56 78"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A96E] text-black font-serif font-bold text-lg py-3 rounded-lg hover:bg-[#b0935d] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? "Enregistrement..." : "Accéder à mon espace"}
          </button>
        </form>
        
      </div>
    </div>
  );
}