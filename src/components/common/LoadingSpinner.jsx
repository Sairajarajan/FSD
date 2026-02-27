import { motion } from "motion/react";

export default function LoadingSpinner() {
  return (
    <div className="loading-shell" role="status" aria-live="polite">
      <motion.div
        className="loading-line-track"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="loading-line"
          initial={{ scaleX: 0, x: "-50%" }}
          animate={{ scaleX: [0, 1, 0], x: ["-50%", "0%", "50%"] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <motion.p
        className="state-text loading-text"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        Loading
      </motion.p>
    </div>
  );
}
