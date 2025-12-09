import { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react'; // Assuming you use lucide-react for icons
import { useAuth0 } from '@auth0/auth0-react'; 

const ConnectionModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
    const { loginWithRedirect } = useAuth0();
    

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-surface border border-white/10 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Decorative Top Border (Gold Brand Accent) */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-primary transition-colors p-1"
        >
          <X size={20} />
        </button>

        <div className="p-8 pt-10">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl text-text-primary mb-2 tracking-wide">
              {isLogin ? 'Connexion' : 'Rejoindre'}
            </h2>
            <p className="font-sans text-sm text-text-muted">
              {isLogin 
                ? 'Accédez à votre espace Montres-Bastille' 
                : 'Commencez votre voyage horloger'}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Name Input (Only for Signup) */}
            {!isLogin && (
              <div className="group space-y-1">
                <label className="text-xs font-sans font-medium text-text-subtle uppercase tracking-wider ml-1">
                  Nom Complet
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="Jean Dupont"
                    className="w-full bg-background/50 border border-border text-text-primary rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-text-subtle/50 font-sans"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="group space-y-1">
              <label className="text-xs font-sans font-medium text-text-subtle uppercase tracking-wider ml-1">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted h-4 w-4" />
                <input 
                  type="email" 
                  placeholder="nom@exemple.com"
                  className="w-full bg-background/50 border border-border text-text-primary rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-text-subtle/50 font-sans"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-sans font-medium text-text-subtle uppercase tracking-wider">
                  Mot de passe
                </label>
                {isLogin && (
                  <a href="#" className="text-xs text-primary hover:text-primary-light transition-colors font-sans">
                    Oublié ?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted h-4 w-4" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-background/50 border border-border text-text-primary rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-text-subtle/50 font-sans"
                />
              </div>
            </div>

            {/* Main Action Button (Pill Shape like website) */}
            <button 
              className="w-full bg-primary hover:bg-primary-dark text-dark font-sans font-medium py-3 rounded-full mt-6 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group"
              onClick={() => loginWithRedirect()

              }>


              <span>{isLogin ? 'Se connecter' : 'Créer un compte'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer Toggle */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-text-muted text-sm font-sans">
              {isLogin ? "Pas encore de compte ?" : "Vous avez déjà un compte ?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-primary hover:text-primary-light font-medium transition-colors"
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionModal;