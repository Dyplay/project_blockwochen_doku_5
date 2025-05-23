"use client";

import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  progress: number;
}

export default function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  return (
    <div className="fixed top-0 left-0 z-50 w-full h-1 bg-transparent">
      <motion.div
        className="h-full bg-gradient-to-r from-purple-500 to-purple-700"
        style={{ width: `${progress}%` }}
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}