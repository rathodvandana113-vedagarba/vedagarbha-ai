"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function MotionCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -3, rotateX: 2.5, rotateY: -2.5 }}
      className={`panel perspective-card ${className}`}
    >
      {children}
    </motion.article>
  );
}
