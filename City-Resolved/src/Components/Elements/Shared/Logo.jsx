import React from "react";
import { motion } from "motion/react";

const Logo = ({ className = "" }) => {
  return (
    <motion
      href="/"
      className={`relative z-10 inline-flex items-center font-extrabold tracking-tight no-underline ${className}`}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <span className="text-base-700 dark:text-neutral-100">City</span>

      <motion.span
        className="ml-1 text-green-500 dark:text-neutral-100"
        variants={{
          rest: { opacity: 1, x: 0 },
          hover: { opacity: 0.8, x: 2 },
        }}
        transition={{ duration: 0.2 }}
      >
        Resolved
      </motion.span>
    </motion>
  );
};
export default Logo;
