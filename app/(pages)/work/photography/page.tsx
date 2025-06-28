// app/(pages)/work/photography/page.tsx - FIXED: Database integration
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { ArrowLeft, Search, Camera, Eye, Heart, MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { artworkAPI, Artwork } from '../../../../lib/database'

export default function PhotographyPage() {
  const [photos, setPhotos] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState<Artwork | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

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

  // Load photography from database
  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = async () => {
    setLoading(true)
    setError('')
    try {
      const allArtworks = await artworkAPI.getArtworks()
      // Filter for photography category only
      const photographyOnly = allArtworks.filter(art => art.category === 'photography')
      setPhotos(photographyOnly)
    } catch (err: any) {
      setError(err.message || 'Failed to load photos')
      console.error('Error loading photos:', err)
    } finally {
      setLoading(false)
    }
  }

  // Get unique subcategories for filtering - FIXED: Handle undefined subcategory
  const categories = useMemo(() => {
    const uniqueCategories = photos
      .map(photo => photo.subcategory)
      .filter((category): category is string => Boolean(category))
    return ['All', ...Array.from(new Set(uniqueCategories))]
  }, [photos])

  // Filter photos based on category and search - FIXED: Handle undefined subcategory
  const filteredPhotos = useMemo(() => {
    let filtered = photos

    // Category filter - FIXED: Properly handle undefined subcategory
    if (filter !== 'All') {
      filtered = filtered.filter(photo => photo.subcategory === filter)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(photo =>
        photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [photos, filter, searchTerm])

  // Lightbox functions
  const openLightbox = (photo: Artwork, index: number) => {
    setSelectedPhoto(photo)
    setCurrentIndex(index)
  }

  const closeLightbox = () => {
    setSelectedPhoto(null)
  }

  const navigatePhoto = (direction: 'prev' | 'next') => {
    const currentPhotoIndex = currentIndex
    let newIndex = direction === 'prev' 
      ? currentPhotoIndex > 0 ? currentPhotoIndex - 1 : filteredPhotos.length - 1
      : currentPhotoIndex < filteredPhotos.length - 1 ? currentPhotoIndex + 1 : 0
    
    setCurrentIndex(newIndex)
    setSelectedPhoto(filteredPhotos[newIndex])
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return
      
      switch (e.key) {
        case 'Escape':
          closeLightbox()
          break
        case 'ArrowLeft':
          navigatePhoto('prev')
          break
        case 'ArrowRight':
          navigatePhoto('next')
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedPhoto, currentIndex])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-emerald-900/80 to-slate-900/90" />
        
        {/* Floating Particles */}
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
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

      {/* Content Container - FIXED: Better spacing */}
      <div className="relative z-10 container mx-auto px-6 pt-6 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8" // Reduced margin
        >
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/work"
              className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-emerald-300 hover:text-white border border-white/20 hover:border-emerald-400/50 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent mb-2">
                Photography
              </h1>
              <p className="text-gray-300 text-lg">
                Capturing moments, emotions, and beauty through the lens
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
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400/50 transition-all duration-300 w-full sm:w-80"
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
                    ? 'bg-emerald-600/30 border border-emerald-400/50 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-emerald-400/30'
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
            <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Loading photos...</p>
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
        {!loading && !error && filteredPhotos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-gray-300 mb-2">No photos found</h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'All' 
                ? 'Try adjusting your search or filters'
                : 'No photos have been uploaded yet'
              }
            </p>
          </motion.div>
        )}

        {/* Photo Grid */}
        {!loading && !error && filteredPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
          >
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="group relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-emerald-400/50 transition-all duration-500 break-inside-avoid cursor-pointer"
                onClick={() => openLightbox(photo, index)}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <Image
                    src={photo.image_url}
                    alt={photo.title}
                    width={400}
                    height={600}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Featured Badge */}
                  {photo.featured && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-emerald-500/80 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                      Featured
                    </div>
                  )}
                  
                  {/* Camera Info */}
                  {photo.camera && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white">
                      {photo.camera}
                    </div>
                  )}

                  {/* Stats Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-semibold mb-1 line-clamp-1">{photo.title}</h3>
                    {photo.location && (
                      <div className="flex items-center gap-1 text-emerald-300 text-sm mb-2">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{photo.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {photo.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {photo.likes}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1 line-clamp-1">
                    {photo.title}
                  </h3>
                  {photo.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {photo.description}
                    </p>
                  )}

                  {/* Tags */}
                  {photo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {photo.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Camera Settings */}
                  {photo.settings && (
                    <div className="text-xs text-gray-500 mb-2">
                      {photo.settings}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {photo.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {photo.likes}
                      </span>
                    </div>
                    {photo.year && (
                      <span>{photo.year}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Navigation Buttons */}
          {filteredPhotos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigatePhoto('prev')
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors duration-200 z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigatePhoto('next')
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors duration-200 z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors duration-200 z-10"
          >
            ✕
          </button>

          {/* Image and Info */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={selectedPhoto.image_url}
                alt={selectedPhoto.title}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-xl p-4 text-white">
              <h3 className="text-xl font-semibold mb-1">{selectedPhoto.title}</h3>
              {selectedPhoto.description && (
                <p className="text-gray-300 mb-2">{selectedPhoto.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                {selectedPhoto.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedPhoto.location}
                  </span>
                )}
                {selectedPhoto.camera && (
                  <span className="flex items-center gap-1">
                    <Camera className="w-4 h-4" />
                    {selectedPhoto.camera}
                  </span>
                )}
                {selectedPhoto.settings && (
                  <span>{selectedPhoto.settings}</span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {selectedPhoto.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {selectedPhoto.likes} likes
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}