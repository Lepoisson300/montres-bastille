import { useState, useEffect } from 'react';

export default function ConsentModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifie si l'utilisateur a déjà fermé la bannière
    const hasSeenBanner = localStorage.getItem('site_privacy_info');
    if (!hasSeenBanner) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('site_privacy_info', 'seen');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none flex justify-center">
      
      <div className="w-full max-w-4xl bg-surface/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pointer-events-auto animate-in slide-in-from-bottom-10 duration-500">
        
        <div className="flex-1 space-y-2">
          <h2 className="font-serif text-lg font-semibold text-primary">
            Zéro tracking. Que de l'essentiel.
          </h2>
          <p className="font-sans text-text-secondary text-sm leading-relaxed">
            Pour respecter votre vie privée, ce site n'utilise aucun cookie publicitaire ou de suivi. Les seuls cookies que nous utilisons sont strictement nécessaires pour sécuriser votre connexion (via Auth0) et garantir votre paiement (via Stripe).
          </p>
          <p className="font-sans text-text-muted text-xs">
            Détails dans notre{' '}
            <a href="/confidentialite" className="text-primary hover:text-primary-light underline underline-offset-4 transition-colors">Politique de confidentialité</a>, nos{' '}
            <a href="/cgv" className="text-primary hover:text-primary-light underline underline-offset-4 transition-colors">CGV</a> et nos{' '}
            <a href="/mentions-legales" className="text-primary hover:text-primary-light underline underline-offset-4 transition-colors">Mentions légales</a>.
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="shrink-0 w-full sm:w-auto px-6 py-2.5 font-sans text-sm font-semibold text-background bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-[0_0_10px_rgba(201,169,110,0.15)] hover:shadow-[0_0_15px_rgba(201,169,110,0.3)]"
        >
          J'ai compris
        </button>
        
      </div>
    </div>
  );
}