// app/(pages)/work/2d/page.tsx - UPDATED to use real data
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { ArrowLeft, X, ChevronLeft, ChevronRight, Heart, Eye, Download, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { artworkAPI, Artwork } from '../../../../lib/database'

export default function TwoDWorkPage() {
  const [artPieces, setArtPieces] = useState<Artwork[]>([])
  const [selectedArt, setSelectedArt] = useState<Artwork | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filter, setFilter] = useState('All') // Fixed: removed type annotation
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Get unique categories
  const categories = ['All', ...Array.from(new Set(artPieces.map(art => art.subcategory).filter(Boolean)))]
  
  // Filter art pieces - Fixed: handle undefined subcategory
  const filteredArt = useMemo(() => {
    if (filter === 'All') return artPieces
    return artPieces.filter(art => art.subcategory === filter)
  }, [artPieces, filter])

  // Memoize floating particles
  const floatingParticles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 5 + Math.random() * 3,
      delay: Math.random() * 3,
    }))
  }, [])

  // Load 2D artworks from database
  useEffect(() => {
    loadArtworks()
  }, [])

  const loadArtworks = async () => {
    setLoading(true)
    setError('')
    try {
      const allArtworks = await artworkAPI.getArtworks()
      const artworks2D = allArtworks.filter(art => art.category === '2d')
      setArtPieces(artworks2D)
    } catch (err: any) {
      setError(err.message || 'Failed to load artworks')
      console.error('Error loading 2D artworks:', err)
    } finally {
      setLoading(false)
    }
  }

  const openLightbox = (art: Artwork) => {
    setSelectedArt(art)
    setCurrentIndex(filteredArt.findIndex(item => item.id === art.id))
    
    // Increment view count
    artworkAPI.updateArtwork(art.id, { views: art.views + 1 })
      .then(() => {
        // Update local state
        setArtPieces(prev => prev.map(piece => 
          piece.id === art.id ? { ...piece, views: piece.views + 1 } : piece
        ))
      })
      .catch(console.error)
  }

  const navigateArt = (direction: 'prev' | 'next') => {
    if (!selectedArt) return
    
    let newIndex = currentIndex
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredArt.length - 1
    } else {
      newIndex = currentIndex < filteredArt.length - 1 ? currentIndex + 1 : 0
    }
    
    setCurrentIndex(newIndex)
    setSelectedArt(filteredArt[newIndex])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/80 to-slate-900/90" />
        
        {/* Floating particles */}
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-pink-400/40 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5],
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight">
                2D Art
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl">
                Digital paintings, illustrations, and concept art showcasing creativity across various styles and themes.
              </p>
            </div>
            
            {/* Refresh button */}
            <button
              onClick={loadArtworks}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 border border-white/20 transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300"
          >
            {error}
          </motion.div>
        )}

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
                    ? 'bg-pink-600/30 border-pink-400/50 text-white shadow-lg shadow-pink-500/25'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-pink-400" />
            <p className="text-gray-300">Loading 2D artworks...</p>
          </div>
        ) : filteredArt.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-lg mb-4">
              {artPieces.length === 0 ? 'No 2D artworks yet' : 'No artworks match your criteria'}
            </div>
            <Link
              href="/admin/art/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600/30 text-white rounded-full hover:bg-pink-600/40 transition-colors"
            >
              Add Your First 2D Artwork
            </Link>
          </div>
        ) : (
          /* Art Gallery Grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {filteredArt.map((art, index) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
                onClick={() => openLightbox(art)}
              >
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-pink-500/20 hover:border-pink-400/30 transition-all duration-500">
                  {/* Featured badge */}
                  {art.featured && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-medium rounded-full">
                      Featured
                    </div>
                  )}

                  {/* Art Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={art.image_url}
                      alt={art.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* View overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Full
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-medium text-white mb-2 group-hover:text-gray-100 transition-colors">
                      {art.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {art.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>{art.year || new Date(art.created_at).getFullYear()}</span>
                      <span className="text-pink-400">{art.subcategory}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {art.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {art.views}
                        </div>
                      </div>
                      <span className="text-xs">{art.dimensions}</span>
                    </div>
                  </div>

                  {/* Magical sparkles on hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-pink-400 rounded-full"
                        style={{
                          left: `${i * 6}px`,
                          top: `${i * 8}px`,
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                        }}
                        transition={{
                          duration: 1.2,
                          delay: i * 0.15,
                          repeat: Infinity,
                          repeatDelay: 0.8
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-gray-300 rounded-full backdrop-blur-sm border border-white/10">
            <Download className="w-4 h-4" />
            High resolution prints available upon request
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedArt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setSelectedArt(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedArt(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation arrows */}
            {filteredArt.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateArt('prev')
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateArt('next')
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image and info */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="max-w-6xl max-h-[90vh] mx-4 flex flex-col md:flex-row gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative flex-1 max-h-[70vh] md:max-h-[80vh]">
                <Image
                  src={selectedArt.image_url}
                  alt={selectedArt.title}
                  width={1200}
                  height={800}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>

              {/* Info panel */}
              <div className="w-full md:w-80 bg-white/10 backdrop-blur-xl rounded-lg p-6 border border-white/20">
                <h2 className="text-2xl font-medium text-white mb-3">{selectedArt.title}</h2>
                <p className="text-gray-300 mb-6">{selectedArt.description}</p>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white">{selectedArt.subcategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Year:</span>
                    <span className="text-white">{selectedArt.year || new Date(selectedArt.created_at).getFullYear()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Medium:</span>
                    <span className="text-white">{selectedArt.medium || 'Digital'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dimensions:</span>
                    <span className="text-white">{selectedArt.dimensions || 'Digital'}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 mt-6 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-gray-300">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {selectedArt.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {selectedArt.views}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="text-xs text-gray-400">
                    {currentIndex + 1} of {filteredArt.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
