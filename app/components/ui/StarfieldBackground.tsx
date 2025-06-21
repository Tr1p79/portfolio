// app/components/ui/StarfieldBackground.tsx
'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function StarfieldBackground() {
  // Generate stars once and memoize them to prevent regeneration
  const stars = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 5,
      animationDuration: 3 + Math.random() * 4,
    }))
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: star.animationDuration,
            repeat: Infinity,
            delay: star.animationDelay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}