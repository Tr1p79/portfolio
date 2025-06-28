// app/(pages)/work/2d/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { ArrowLeft, Eye, Heart, Filter, Grid, Search, ZoomIn } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { artworkAPI, Artwork } from '../../../../lib/database'

interface LightboxImage {
  id: string
  src: string
  title: string
  description?: string
}

export default function TwoDWorkPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Memoize floating particles for performance
  const floatingParticles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 25 + Math.random() * 10,
      delay: Math.random() * 5,
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
      // Filter for 2D category only
      const twoDartworks = allArtworks.filter(art => art.category === '2d')
      setArtworks(twoDartworks)
    } catch (err: any) {
      setError(err.message || 'Failed to load 2D artworks')
      console.error('Error loading 2D artworks:', err)
    } finally {
      setLoading(false)
    }
  }

  // Get unique subcategories for filtering - FIXED: Handle undefined subcategory
  const categories = useMemo(() => {
    const uniqueCategories = artworks
      .map(art => art.subcategory)
      .filter((category): category is string => Boolean(category))
    return ['All', ...Array.from(new Set(uniqueCategories))]
  }, [artworks])

  // Filter artworks based on category and search - FIXED: Handle undefined subcategory
  const filteredArtworks = useMemo(() => {
    let filtered = artworks

    // Category filter - FIXED: Properly handle undefined subcategory
    if (filter !== 'All') {
      filtered = filtered.filter(art => art.subcategory === filter)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(art =>
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [artworks, filter, searchTerm])

  // Lightbox navigation
  const openLightbox = (artwork: Artwork, index: number) => {
    setLightboxImage({
      id: artwork.id,
      src: artwork.image_url,
      title: artwork.title,
      description: artwork.description
    })
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxImage(null)
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const currentIndex = lightboxIndex
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
    
    if (newIndex >= filteredArtworks.length) newIndex = 0
    if (newIndex < 0) newIndex = filteredArtworks.length - 1
    
    const newArtwork = filteredArtworks[newIndex]
    setLightboxImage({
      id: newArtwork.id,
      src: newArtwork.image_url,
      title: newArtwork.title,
      description: newArtwork.description
    })
    setLightboxIndex(newIndex)
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxImage) return
      
      switch (e.key) {
        case 'Escape':
          closeLightbox()
          break
        case 'ArrowLeft':
          navigateLightbox('prev')
          break
        case 'ArrowRight':
          navigateLightbox('next')
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [lightboxImage, lightboxIndex])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-pink-900/80 to-slate-900/90" />
        
        {/* Floating Particles */}
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-pink-400/30 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -120, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 2, 0.5],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/work"
              className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-pink-300 hover:text-white border border-white/20 hover:border-pink-400/50 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-pink-300 to-pink-500 bg-clip-text text-transparent mb-2">
                2D Digital Art
              </h1>
              <p className="text-gray-300 text-lg">
                Digital paintings, illustrations, and concept art
              </p>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search artworks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-pink-400/50 transition-all duration-300 w-full sm:w-80"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === category
                    ? 'bg-pink-600/30 border border-pink-400/50 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-pink-400/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 border-4 border-pink-400/30 border-t-pink-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Loading 2D artworks...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300"
          >
            {error}
          </motion.div>
        )}

        {/* No Results */}
        {!loading && !error && filteredArtworks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Grid className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-gray-300 mb-2">No artworks found</h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'All' 
                ? 'Try adjusting your search or filters'
                : 'No 2D artworks have been uploaded yet'
              }
            </p>
          </motion.div>
        )}

        {/* Artwork Grid */}
        {!loading && !error && filteredArtworks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredArtworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="group relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-pink-400/50 transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={artwork.image_url}
                    alt={artwork.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Featured Badge */}
                  {artwork.featured && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-pink-500/80 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                      Featured
                    </div>
                  )}
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => openLightbox(artwork, index)}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1 line-clamp-1">
                    {artwork.title}
                  </h3>
                  {artwork.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {artwork.description}
                    </p>
                  )}
                  
                  {/* Tags */}
                  {artwork.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {artwork.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {artwork.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {artwork.likes}
                      </span>
                    </div>
                    {artwork.year && (
                      <span>{artwork.year}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Navigation Buttons */}
            <button
              onClick={() => navigateLightbox('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors duration-200 z-10"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => navigateLightbox('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors duration-200 z-10"
            >
              <ArrowLeft className="w-6 h-6 rotate-180" />
            </button>

            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors duration-200 z-10"
            >
              ✕
            </button>

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={lightboxImage.src}
                alt={lightboxImage.title}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-xl p-4 text-white">
              <h3 className="text-xl font-semibold mb-1">{lightboxImage.title}</h3>
              {lightboxImage.description && (
                <p className="text-gray-300">{lightboxImage.description}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}