// app/components/sections/HeroSection.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Download, ExternalLink } from 'lucide-react'
import { useState, useRef, useMemo } from 'react'
import StarfieldBackground from '../ui/StarfieldBackground'

interface ArtPiece {
  id: string
  title: string
  category: '3d' | '2d' | 'photography'
  image: string
  link: string
}

// Sample data - you'll replace this with your actual art pieces
const artPieces: ArtPiece[] = [
  {
    id: '1',
    title: 'Abstract Sculpture',
    category: '3d',
    image: '/images/art/3d-1.jpg',
    link: '/work/3d'
  },
  {
    id: '2',
    title: 'Digital Painting',
    category: '2d',
    image: '/images/art/2d-1.jpg',
    link: '/work/2d'
  },
  {
    id: '3',
    title: 'Urban Photography',
    category: 'photography',
    image: '/images/art/photo-1.png',
    link: '/work/photography'
  },
  {
    id: '4',
    title: 'Character Design',
    category: '3d',
    image: '/images/art/3d-2.jpg',
    link: '/work/3d'
  },
  {
    id: '5',
    title: 'Landscape Art',
    category: '2d',
    image: '/images/art/2d-2.png',
    link: '/work/2d'
  },
  {
    id: '6',
    title: 'Portrait Study',
    category: 'photography',
    image: '/images/art/photo-2.jpg',
    link: '/work/photography'
  }
]

export default function HeroSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Memoize floating elements to prevent hydration issues
  const floatingElements = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      top: 10 + Math.random() * 80,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }))
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/80 to-slate-900/90" />
        <div className="min-h-screen flex items-center justify-center relative pt-20"></div>
        {/* Isolated starfield background */}
        <StarfieldBackground />

        {/* Magical aurora effect */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.4) 0%, transparent 70%)',
              'radial-gradient(circle at 80% 30%, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
              'radial-gradient(circle at 60% 80%, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
              'radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
              'radial-gradient(circle at 70% 60%, rgba(147, 51, 234, 0.4) 0%, transparent 70%)',
              'radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.4) 0%, transparent 70%)',
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Floating art pieces */}
      <div 
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        {artPieces.map((piece, index) => {
          // Fixed positions for art pieces
          const positions = [
            { x: -300, y: -150 }, // Top left
            { x: 300, y: -150 },  // Top right
            { x: -380, y: 80 },   // Middle left
            { x: 380, y: 80 },    // Middle right
            { x: -250, y: 250 },  // Bottom left
            { x: 250, y: 250 },   // Bottom right
          ]
          
          const position = positions[index] || { x: 0, y: 0 }
          const rotation = Math.random() * 20 - 10 // Random rotation between -10 and 10 degrees
          
          return (
            <motion.div
              key={piece.id}
              initial={{ opacity: 0, scale: 0, x: position.x, y: position.y }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: position.x,
                y: position.y,
                rotate: rotation,
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: index * 0.15 },
                scale: { duration: 0.8, delay: index * 0.15, type: "spring", bounce: 0.3 },
                rotate: { duration: 0.8, delay: index * 0.15 }
              }}
              whileHover={{
                scale: 1.15,
                rotate: 0, // Straighten on hover
                z: 100,
                transition: { duration: 0.3 }
              }}
              className="absolute w-40 h-40 md:w-48 md:h-48 cursor-pointer"
              style={{
                left: '50%',
                top: '50%',
                marginLeft: '-80px', // Half of width
                marginTop: '-80px',  // Half of height
              }}
              onMouseEnter={() => setHoveredId(piece.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link href={piece.link}>
                <div className="relative w-full h-full group">
                  {/* Magical glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:from-purple-400/40 group-hover:to-blue-400/40 transition-all duration-500" />
                  
                  {/* Card container */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm bg-black/20 shadow-2xl group-hover:shadow-purple-500/25 group-hover:border-purple-400/30 transition-all duration-500">
                    <Image
                      src={piece.image}
                      alt={piece.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-medium text-sm mb-1">{piece.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs opacity-80 capitalize">{piece.category}</span>
                        <ExternalLink className="w-4 h-4 opacity-80" />
                      </div>
                    </div>
                  </div>

                  {/* Fantasy sparkles */}
                  {hoveredId === piece.id && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                          style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                          }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ 
                            opacity: [0, 1, 0], 
                            scale: [0, 1, 0],
                            y: [-20, -40, -60]
                          }}
                          transition={{
                            duration: 1.5,
                            delay: i * 0.1,
                            repeat: Infinity,
                            repeatDelay: 0.5
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Central hero content */}
      <div className="relative z-20 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Minimalistic profile photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative mx-auto w-32 h-32 md:w-40 md:h-40"
          >
            {/* Magical aura */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-xl animate-pulse" />
            
            {/* Profile container */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20 backdrop-blur-sm bg-black/10 shadow-2xl">
              <Image
                src="/images/hero/profile.jpg"
                alt="Your Name"
                fill
                className="object-cover"
                priority
              />
              
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full" />
            </div>
          </motion.div>

          {/* Minimalistic text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-light text-white tracking-tight">
              Your Name
            </h1>
            <p className="text-lg md:text-xl text-purple-200 font-light">
              Digital Artist & Creator
            </p>
          </motion.div>

          {/* Simple description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-gray-300 max-w-lg mx-auto leading-relaxed"
          >
            Crafting immersive experiences through digital art and design
          </motion.p>

          {/* Minimal CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <Link
              href="/work"
              className="group flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 border border-white/20 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 backdrop-blur-sm"
            >
              Explore Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/about"
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Download className="w-4 h-4" />
              Resume
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Magical floating elements */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
          style={{
            left: `${element.left}%`,
            top: `${element.top}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}