import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay } },
      }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}
export default Reveal;