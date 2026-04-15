import { motion, AnimatePresence } from "framer-motion";
interface desc{
    title : string,
    description : string
}

const LuxuryDescription = ({ title, description }: desc) => {
  return (
    <AnimatePresence mode="wait">
      {title && (
        <motion.div
          key={title} // Le 'key' force Framer Motion à rejouer l'animation quand le titre change
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-6 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] text-[#cccccc] border border-[rgba(212,175,55,0.3)] border-l-[3px] border-l-[#D4AF37] p-6 shadow-[0_15px_35px_rgba(0,0,0,0.9),_0_0_20px_rgba(212,175,55,0.05)] w-full max-w-full"
        >
          <h3 className="text-[#D4AF37] text-xl font-serif font-normal tracking-wide border-b border-[rgba(212,175,55,0.2)] pb-3 mb-3 mt-0">
            {title}
          </h3>
          <p className="text-sm leading-relaxed font-light m-0 text-left">
            {description || "Une pièce d'exception conçue avec le plus grand soin. Finitions haute horlogerie."}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LuxuryDescription;