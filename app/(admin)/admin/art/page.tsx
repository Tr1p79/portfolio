// app/(admin)/admin/art/page.tsx - FIXED TypeScript errors
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { 
  ArrowLeft, 
  Plus, 
  Eye, 
  Trash2, 
  Search,
  Palette,
  Cuboid,
  Heart,
  RefreshCw,
  Grid,
  List,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import AdminAuthGuard from '../../../components/admin/AdminAuthGuard'
import { artworkAPI, Artwork } from '../../../../lib/database'

function ArtworkManagement() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All') // Fixed: removed type annotation
  const [typeFilter, setTypeFilter] = useState<'all' | '2d' | '3d'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [error, setError] = useState('')

  // Memoize floating particles
  const floatingParticles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 20 + Math.random() * 10,
      delay: Math.random() * 5,
    }))
  }, [])

  useEffect(() => {
    loadArtworks()
  }, [])

  const loadArtworks = async () => {
    setLoading(true)
    setError('')
    try {
      const allArtworks = await artworkAPI.getArtworks()
      // Filter out photography (handled in separate page)
      const artOnly = allArtworks.filter(art => art.category === '2d' || art.category === '3d')
      setArtworks(artOnly)
    } catch (err: any) {
      setError(err.message || 'Failed to load artworks')
      console.error('Error loading artworks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteArtwork = async (artworkId: string) => {
    if (!confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
      return
    }

    try {
      await artworkAPI.deleteArtwork(artworkId)
      setArtworks(prev => prev.filter(art => art.id !== artworkId))
    } catch (err: any) {
      alert('Failed to delete artwork: ' + err.message)
    }
  }

  // Get unique subcategories - Fixed: handle undefined subcategory
  const categories = useMemo(() => {
    const uniqueCategories = artworks
      .map(art => art.subcategory)
      .filter((category): category is string => Boolean(category))
    return ['All', ...Array.from(new Set(uniqueCategories))]
  }, [artworks])

  // Filter artworks - Fixed: handle undefined subcategory
  const filteredArtworks = useMemo(() => {
    let filtered = artworks

    // Type filter (2D/3D)
    if (typeFilter !== 'all') {
      filtered = filtered.filter(art => art.category === typeFilter)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(art =>
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter - Fixed: handle undefined subcategory
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(art => art.subcategory === categoryFilter)
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [artworks, typeFilter, searchTerm, categoryFilter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const stats = useMemo(() => ({
    total: artworks.length,
    artworks2d: artworks.filter(art => art.category === '2d').length,
    artworks3d: artworks.filter(art => art.category === '3d').length,
    featured: artworks.filter(art => art.featured).length,
    totalViews: artworks.reduce((sum, art) => sum + art.views, 0)
  }), [artworks])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/80 to-slate-900/90" />
        
        {/* Floating particles */}
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 3, 0.5],
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
          className="mb-8"
        >
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-white tracking-tight mb-2">
                Artwork Gallery
              </h1>
              <p className="text-gray-300">
                Manage your 2D and 3D artwork portfolio
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={loadArtworks}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 border border-white/20 transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              {/* View Mode Toggle */}
              <div className="flex gap-1 bg-white/10 rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    viewMode === 'grid' ? 'bg-purple-600/30 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    viewMode === 'list' ? 'bg-purple-600/30 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <Link
                href="/admin/art/new"
                className="flex items-center gap-2 px-6 py-3 bg-purple-600/30 text-white rounded-full hover:bg-purple-600/40 border border-purple-400/50 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Add Artwork
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300"
          >
            {error}
          </motion.div>
        )}

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search artworks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Type Filter */}
            <div className="flex gap-2">
              <span className="text-gray-400 text-sm flex items-center">Type:</span>
              {[
                { key: 'all', label: 'All', icon: null },
                { key: '2d', label: '2D Art', icon: Palette },
                { key: '3d', label: '3D Art', icon: Cuboid }
              ].map((type) => (
                <button
                  key={type.key}
                  onClick={() => setTypeFilter(type.key as 'all' | '2d' | '3d')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    typeFilter === type.key
                      ? 'bg-purple-600/30 border border-purple-400/50 text-white'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {type.icon && <type.icon className="w-4 h-4" />}
                  {type.label}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              <span className="text-gray-400 text-sm flex items-center">Category:</span>
              {categories.slice(0, 5).map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    categoryFilter === category
                      ? 'bg-purple-600/30 border border-purple-400/50 text-white'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
        >
          {[
            { label: 'Total Artworks', value: stats.total, color: 'from-purple-500 to-pink-500' },
            { label: '2D Artworks', value: stats.artworks2d, color: 'from-blue-500 to-cyan-500' },
            { label: '3D Artworks', value: stats.artworks3d, color: 'from-green-500 to-emerald-500' },
            { label: 'Featured', value: stats.featured, color: 'from-yellow-500 to-orange-500' },
            { label: 'Total Views', value: stats.totalViews, color: 'from-red-500 to-pink-500' }
          ].map((stat, index) => (
            <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
              <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                {loading ? '...' : stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Artworks Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {loading ? (
            <div className="text-center py-20">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
              <p className="text-gray-300">Loading artworks...</p>
            </div>
          ) : filteredArtworks.length === 0 ? (
            <div className="text-center py-20">
              <Palette className="w-20 h-20 text-purple-400/50 mx-auto mb-6" />
              <div className="text-gray-400 text-lg mb-4">
                {artworks.length === 0 ? 'No artworks yet' : 'No artworks match your criteria'}
              </div>
              <Link
                href="/admin/art/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600/30 text-white rounded-full hover:bg-purple-600/40 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Your First Artwork
              </Link>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-purple-400/30 transition-all duration-300 group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={artwork.image_url}
                      alt={artwork.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {artwork.featured && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                        Featured
                      </div>
                    )}
                    {/* Category badge */}
                    <div className={`absolute top-2 ${artwork.featured ? 'right-2' : 'left-2'} px-2 py-1 text-white text-xs rounded-full ${
                      artwork.category === '2d' ? 'bg-blue-600/80' : 'bg-green-600/80'
                    }`}>
                      {artwork.category === '2d' ? '2D' : '3D'}
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                      <Link
                        href={`/work/${artwork.category}`}
                        className="p-1 bg-purple-600/80 text-white rounded-full hover:bg-purple-600 transition-colors"
                        title="View"
                      >
                        <Eye className="w-3 h-3" />
                      </Link>
                      {artwork.sketchfab_id && (
                        <a
                          href={`https://sketchfab.com/3d-models/${artwork.sketchfab_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 bg-blue-600/80 text-white rounded-full hover:bg-blue-600 transition-colors"
                          title="View on Sketchfab"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteArtwork(artwork.id)}
                        className="p-1 bg-red-600/80 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-medium mb-1 truncate">{artwork.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{artwork.subcategory || 'Uncategorized'}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{artwork.year || formatDate(artwork.created_at)}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {artwork.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {artwork.views}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <div className="divide-y divide-white/10">
                {filteredArtworks.map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="p-6 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={artwork.image_url}
                          alt={artwork.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-medium">{artwork.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            artwork.category === '2d' 
                              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                              : 'bg-green-600/20 text-green-300 border border-green-500/30'
                          }`}>
                            {artwork.category === '2d' ? '2D' : '3D'}
                          </span>
                          {artwork.featured && (
                            <span className="px-2 py-1 text-xs bg-purple-600/20 text-purple-300 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{artwork.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{artwork.subcategory || 'Uncategorized'}</span>
                          <span>{artwork.year || formatDate(artwork.created_at)}</span>
                          {artwork.medium && <span>{artwork.medium}</span>}
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {artwork.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {artwork.views}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/work/${artwork.category}`}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                          title="View Artwork"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {artwork.sketchfab_id && (
                          <a
                            href={`https://sketchfab.com/3d-models/${artwork.sketchfab_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-600/10 rounded-lg transition-all duration-200"
                            title="View on Sketchfab"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDeleteArtwork(artwork.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-600/10 rounded-lg transition-all duration-200"
                          title="Delete Artwork"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default function ArtworkManagementPage() {
  return (
    <AdminAuthGuard>
      <ArtworkManagement />
    </AdminAuthGuard>
  )
}