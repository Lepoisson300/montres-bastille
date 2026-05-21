import { motion, AnimatePresence } from "framer-motion";

const MobileLuxuryModal = ({ 
  isOpen, 
  onClose, 
  title = "Édition Prestige", 
  description = "Description de la pièce..." 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. L'arrière-plan sombre (Backdrop) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />

          {/* 2. Le tiroir du bas (Bottom Sheet) */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            
            // --- Configuration du Swipe (Drag) ---
            drag="y"
            dragConstraints={{ top: 0 }} // Empêche de glisser vers le haut au-delà de 0
            dragElastic={{ top: 0, bottom: 0.5 }} // Effet élastique léger vers le bas
            onDragEnd={(e, info) => {
              // Si on a glissé de plus de 100px ou avec une vitesse rapide vers le bas -> on ferme
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            // --------------------------------------

            className="fixed bottom-0 left-0 right-0 z-50 w-full max-h-[80vh] overflow-y-auto bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-t border-[rgba(212,175,55,0.4)] rounded-t-3xl p-6 pb-4 shadow-[0_-15px_40px_rgba(0,0,0,0.8)]"
          >
            {/* Petite barre décorative en haut (zone de préhension pour le drag) */}
            <div className="w-12 h-1.5 bg-[#D4AF37]/50 rounded-full mx-auto mb-3 cursor-grab active:cursor-grabbing" />

            <div className="relative">
              {/* Bouton de fermeture discret (Croix) */}
              <button 
                onClick={onClose}
                className="absolute -top-2 right-0 text-[#888888] hover:text-[#D4AF37] text-3xl leading-none p-2 focus:outline-none z-10"
                aria-label="Fermer"
              >
                &times;
              </button>

              {/* Contenu */}
              <h3 className="text-[#D4AF37] text-2xl font-serif font-normal tracking-wide border-b border-[rgba(212,175,55,0.2)] pb-4 mb-4 pr-10 mt-0">
                {title}
              </h3>
              
              <p className="text-sm leading-relaxed font-light text-[#cccccc]">
                {description}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileLuxuryModal;