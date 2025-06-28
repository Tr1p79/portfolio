// app/(pages)/work/3d/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { ArrowLeft, ExternalLink, Eye, Heart, Grid, Search, Maximize2, Play } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { artworkAPI, Artwork } from '../../../../lib/database'

export default function ThreeDWorkPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedModel, setSelectedModel] = useState<Artwork | null>(null)
  const [filter, setFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

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

  // Load 3D artworks from database
  useEffect(() => {
    loadArtworks()
  }, [])

  const loadArtworks = async () => {
    setLoading(true)
    setError('')
    try {
      const allArtworks = await artworkAPI.getArtworks()
      // Filter for 3D category only
      const threeDartworks = allArtworks.filter(art => art.category === '3d')
      setArtworks(threeDartworks)
      
      // Auto-select first model if available
      if (threeDartworks.length > 0) {
        setSelectedModel(threeDartworks[0])
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load 3D artworks')
      console.error('Error loading 3D artworks:', err)
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

  // Update selected model when filter changes
  useEffect(() => {
    if (filteredArtworks.length > 0 && !filteredArtworks.find(art => art.id === selectedModel?.id)) {
      setSelectedModel(filteredArtworks[0])
    }
  }, [filteredArtworks, selectedModel])

  const handleModelSelect = (model: Artwork) => {
    setSelectedModel(model)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/80 to-slate-900/90" />
        
        {/* Floating Particles */}
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
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
      <div className="relative z-10 container mx-auto px-6 pt-6 pb-12">
      <div className="mt-20">
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
              className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-purple-300 hover:text-white border border-white/20 hover:border-purple-400/50 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-transparent mb-2">
                3D Models & Scenes
              </h1>
              <p className="text-gray-300 text-lg">
                Interactive 3D models, characters, and environments
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
              placeholder="Search 3D models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 transition-all duration-300 w-full sm:w-80"
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
                    ? 'bg-purple-600/30 border border-purple-400/50 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-purple-400/30'
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
            <div className="w-16 h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Loading 3D models...</p>
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
            <h3 className="text-xl text-gray-300 mb-2">No 3D models found</h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'All' 
                ? 'Try adjusting your search or filters'
                : 'No 3D models have been uploaded yet'
              }
            </p>
          </motion.div>
        )}

        {/* Main Content - Only show if we have artworks */}
        {!loading && !error && filteredArtworks.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* 3D Viewer - Left/Top Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="xl:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
            >
              {selectedModel ? (
                <div className="relative">
                  {/* Sketchfab Viewer */}
                  {selectedModel.sketchfab_id ? (
                    <div className="relative aspect-video">
                      <iframe
                        title={selectedModel.title}
                        className="w-full h-full"
                        src={`https://sketchfab.com/models/${selectedModel.sketchfab_id}/embed?autostart=1&ui_theme=dark&ui_hint=0&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0`}
                        frameBorder="0"
                        allow="autoplay; fullscreen; xr-spatial-tracking"
                        allowFullScreen
                      />
                      
                      {/* Overlay with model info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                        <div className="flex items-end justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                              {selectedModel.title}
                            </h2>
                            {selectedModel.description && (
                              <p className="text-gray-300 mb-3 max-w-2xl">
                                {selectedModel.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {selectedModel.views} views
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {selectedModel.likes} likes
                              </span>
                              {selectedModel.year && (
                                <span>{selectedModel.year}</span>
                              )}
                            </div>
                          </div>
                          
                          <a
                            href={`https://sketchfab.com/3d-models/${selectedModel.sketchfab_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 border border-purple-400/50 text-white rounded-full hover:bg-purple-600/40 transition-all duration-300"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View on Sketchfab
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Fallback for models without Sketchfab ID
                    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <div className="text-center">
                        <Maximize2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl text-gray-300 mb-2">{selectedModel.title}</h3>
                        <p className="text-gray-500">3D viewer not available</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Tags */}
                  {selectedModel.tags.length > 0 && (
                    <div className="p-6 border-t border-white/10">
                      <div className="flex flex-wrap gap-2">
                        {selectedModel.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-400/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Select a 3D model to view</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Model List - Right/Bottom Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="xl:col-span-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white mb-2">
                  3D Models ({filteredArtworks.length})
                </h3>
                <p className="text-gray-400 text-sm">
                  Click to view in 3D viewer
                </p>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                <div className="p-4 space-y-3">
                  {filteredArtworks.map((model) => (
                    <motion.div
                      key={model.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      onClick={() => handleModelSelect(model)}
                      className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                        selectedModel?.id === model.id
                          ? 'bg-purple-600/20 border-purple-400/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-400/30'
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={model.image_url}
                            alt={model.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                          {model.sketchfab_id && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Play className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white text-sm mb-1 truncate">
                            {model.title}
                          </h4>
                          {model.description && (
                            <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                              {model.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {model.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {model.likes}
                              </span>
                            </div>
                            {model.featured && (
                              <span className="px-2 py-0.5 bg-purple-500/30 text-purple-300 rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
    </div>
  )
}