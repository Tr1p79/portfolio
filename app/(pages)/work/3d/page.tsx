// app/(pages)/work/3d/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { ArrowLeft, ExternalLink, Eye, Heart, Download } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ThreeDModel {
  id: string
  title: string
  description: string
  sketchfabId: string
  thumbnail: string
  category: string
  likes: number
  views: number
  tags: string[]
  featured: boolean
}

// Sample 3D models data - replace with your actual Sketchfab models
const threeDModels: ThreeDModel[] = [
  {
    id: '1',
    title: 'Cyberpunk Character',
    description: 'A futuristic cyberpunk character with detailed textures and rigging.',
    sketchfabId: 'your-sketchfab-model-id-1',
    thumbnail: '/images/3d/cyberpunk-character.jpg',
    category: 'Character',
    likes: 234,
    views: 1205,
    tags: ['Character', 'Cyberpunk', 'Rigged'],
    featured: true
  },
  {
    id: '2',
    title: 'Fantasy Sword',
    description: 'An enchanted sword with magical particles and glowing effects.',
    sketchfabId: 'your-sketchfab-model-id-2',
    thumbnail: '/images/3d/fantasy-sword.jpg',
    category: 'Props',
    likes: 189,
    views: 892,
    tags: ['Weapon', 'Fantasy', 'VFX'],
    featured: false
  },
  {
    id: '3',
    title: 'Sci-Fi Environment',
    description: 'A detailed space station corridor with atmospheric lighting.',
    sketchfabId: 'your-sketchfab-model-id-3',
    thumbnail: '/images/3d/scifi-environment.jpg',
    category: 'Environment',
    likes: 445,
    views: 2103,
    tags: ['Environment', 'Sci-Fi', 'Lighting'],
    featured: true
  },
  {
    id: '4',
    title: 'Mechanical Robot',
    description: 'Industrial robot with complex mechanical details and animations.',
    sketchfabId: 'your-sketchfab-model-id-4',
    thumbnail: '/images/3d/mechanical-robot.jpg',
    category: 'Character',
    likes: 312,
    views: 1567,
    tags: ['Robot', 'Mechanical', 'Animated'],
    featured: false
  }
]

export default function ThreeDWorkPage() {
  const [selectedModel, setSelectedModel] = useState<ThreeDModel | null>(null)
  const [filter, setFilter] = useState<string>('All')
  
  // Get unique categories
  const categories = ['All', ...Array.from(new Set(threeDModels.map(model => model.category)))]
  
  // Filter models
  const filteredModels = filter === 'All' 
    ? threeDModels 
    : threeDModels.filter(model => model.category === filter)

  // Memoize floating particles to prevent hydration issues
  const floatingParticles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 2,
    }))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/80 to-slate-900/90" />
        
        {/* Floating particles */}
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight">
            3D Works
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Immersive 3D models, characters, and environments crafted with attention to detail and technical excellence.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-3 rounded-full transition-all duration-300 backdrop-blur-sm border ${
                  filter === category
                    ? 'bg-purple-600/30 border-purple-400/50 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Models Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {filteredModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
              onClick={() => setSelectedModel(model)}
            >
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-purple-500/20 hover:border-purple-400/30 transition-all duration-500">
                {/* Featured badge */}
                {model.featured && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium rounded-full">
                    Featured
                  </div>
                )}

                {/* Thumbnail */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={model.thumbnail}
                    alt={model.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* View button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Model
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-medium text-white group-hover:text-gray-100 transition-colors">
                      {model.title}
                    </h3>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {model.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {model.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {model.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {model.views}
                      </div>
                    </div>
                    <span className="text-purple-400">{model.category}</span>
                  </div>
                </div>

                {/* Magical sparkles on hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${i * 8}px`,
                        top: `${i * 6}px`,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-gray-300 rounded-full backdrop-blur-sm border border-white/10">
            <Download className="w-4 h-4" />
            More models available on my Sketchfab profile
          </div>
        </motion.div>
      </div>

      {/* Model Viewer Modal */}
      {selectedModel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedModel(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-medium text-white mb-2">{selectedModel.title}</h2>
                  <p className="text-gray-300">{selectedModel.description}</p>
                </div>
                <button
                  onClick={() => setSelectedModel(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sketchfab Embed */}
            <div className="relative h-96 md:h-[500px]">
              <iframe
                src={`https://sketchfab.com/models/${selectedModel.sketchfabId}/embed?autostart=1&ui_theme=dark`}
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
                title={selectedModel.title}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Heart className="w-4 h-4" />
                    {selectedModel.likes} likes
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Eye className="w-4 h-4" />
                    {selectedModel.views} views
                  </div>
                </div>
                <a
                  href={`https://sketchfab.com/3d-models/${selectedModel.sketchfabId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Sketchfab
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}