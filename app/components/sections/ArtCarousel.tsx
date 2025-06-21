'use client'

import { motion, useAnimationFrame } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { ExternalLink } from 'lucide-react'

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
  }
]

export default function ArtCarousel() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-4 tracking-tight">
            Featured Work
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A curated selection of my latest creative projects across 3D, 2D, and photography
          </p>
        </motion.div>

        {/* Floating art carousel */}
        <div 
          ref={containerRef}
          className="relative h-96 md:h-[500px] flex items-center justify-center"
        >
          {artPieces.map((piece, index) => {
            const angle = (index * 72) * (Math.PI / 180) // 360/5 = 72 degrees
            const radius = 300
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius * 0.5 // Flatten vertically
            
            return (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  type: "spring",
                  bounce: 0.3
                }}
                viewport={{ once: true }}
                animate={{
                  x: x,
                  y: y,
                  rotate: hoveredId === piece.id ? 0 : Math.random() * 10 - 5,
                  scale: hoveredId === piece.id ? 1.1 : 1,
                  z: hoveredId === piece.id ? 50 : 0
                }}
                whileHover={{
                  scale: 1.15,
                  rotate: 0,
                  z: 100,
                  transition: { duration: 0.3 }
                }}
                className="absolute w-48 h-48 md:w-56 md:h-56 cursor-pointer"
                onMouseEnter={() => setHoveredId(piece.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Link href={piece.link}>
                  <div className="relative w-full h-full group">
                    {/* Card container */}
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/20 backdrop-blur-sm bg-white/10 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                      <Image
                        src={piece.image}
                        alt={piece.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-medium text-sm mb-1">{piece.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xs opacity-80 capitalize">{piece.category}</span>
                          <ExternalLink className="w-4 h-4 opacity-80" />
                        </div>
                      </div>
                    </div>

                    {/* Category badge */}
                    <div className="absolute -top-2 -right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 border border-gray-200/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {piece.category.toUpperCase()}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}

          {/* Center decoration */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            animate={{ rotate: 360 }}
            transition={{
                duration: 1,
                delay: 0.5,
                rotate: { duration: 20, repeat: Infinity, ease: "linear" }
            }}
            className="absolute w-16 h-16 border-2 border-gray-200/30 rounded-full"
          >
            <div className="absolute inset-2 border border-gray-300/20 rounded-full" />
            <div className="absolute inset-4 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full" />
          </motion.div>
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white/80 text-gray-900 rounded-full hover:bg-white border border-gray-200/50 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            Explore All Work
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ExternalLink className="w-4 h-4" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}