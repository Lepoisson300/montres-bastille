const MobileLuxuryModal = ({ 
  isOpen, 
  onClose, 
  title = "Édition Prestige", 
  description = "Description de la pièce..." 
}) => {
  return (
    <>
      {/* 1. L'arrière-plan sombre (Backdrop) */}
      {/* Il permet de fermer le modal si on clique en dehors */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      />

      {/* 2. Le tiroir du bas (Bottom Sheet) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 w-full max-h-[85vh] overflow-y-auto bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-t border-[rgba(212,175,55,0.4)] rounded-t-3xl p-6 pb-10 shadow-[0_-15px_40px_rgba(0,0,0,0.8)] transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Petite barre décorative en haut (indique visuellement qu'on peut glisser/fermer) */}
        <div className="w-12 h-1.5 bg-[#D4AF37]/50 rounded-full mx-auto mb-6" />

        <div className="relative">
          {/* Bouton de fermeture discret (Croix) */}
          <button 
            onClick={onClose}
            className="absolute -top-2 right-0 text-[#888888] hover:text-[#D4AF37] text-3xl leading-none p-2 focus:outline-none"
            aria-label="Fermer"
          >
            &times;
          </button>

          {/* Contenu */}
          <h3 className="text-[#D4AF37] text-2xl font-serif font-normal tracking-wide border-b border-[rgba(212,175,55,0.2)] pb-4 mb-4 pr-10 mt-0">
            {title}
          </h3>
          
          <p className="text-sm leading-relaxed font-light text-[#cccccc] m-0">
            {description}
          </p>
        </div>
      </div>
    </>
  );
};

export default MobileLuxuryModal;