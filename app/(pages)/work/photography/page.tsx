// app/(pages)/work/photography/page.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { ArrowLeft, X, ChevronLeft, ChevronRight, Heart, Eye, Camera, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Photo {
  id: string
  title: string
  description: string
  image: string
  category: string
  location: string
  date: string
  camera: string
  settings: string
  likes: number
  views: number
  featured: boolean
}

// Sample photography data - replace with your actual photos
const photos: Photo[] = [
  {
    id: '1',
    title: 'Golden Hour Cityscape',
    description: 'The city awakens in the warm embrace of the golden hour, painting skyscrapers in amber light.',
    image: '/images/photography/golden-cityscape.jpg',
    category: 'Urban',
    location: 'New York City, USA',
    date: '2024-03-15',
    camera: 'Sony A7R V',
    settings: 'f/8, 1/125s, ISO 100',
    likes: 456,
    views: 2340,
    featured: true
  },
  {
    id: '2',
    title: 'Misty Mountain Dawn',
    description: 'Morning mist rolls over the mountain peaks, creating an ethereal landscape.',
    image: '/images/photography/misty-mountains.jpg',
    category: 'Landscape',
    location: 'Swiss Alps, Switzerland',
    date: '2024-02-28',
    camera: 'Canon EOS R5',
    settings: 'f/11, 1/60s, ISO 200',
    likes: 623,
    views: 3210,
    featured: true
  },
  {
    id: '3',
    title: 'Street Life Portrait',
    description: 'A candid moment capturing the essence of urban life and human connection.',
    image: '/images/photography/street-portrait.jpg',
    category: 'Portrait',
    location: 'Tokyo, Japan',
    date: '2024-01-20',
    camera: 'Fujifilm X-T5',
    settings: 'f/2.8, 1/250s, ISO 800',
    likes: 289,
    views: 1567,
    featured: false
  },
  {
    id: '4',
    title: 'Cosmic Starscape',
    description: 'The Milky Way stretches across the night sky above a solitary desert landscape.',
    image: '/images/photography/starscape.jpg',
    category: 'Astrophotography',
    location: 'Atacama Desert, Chile',
    date: '2024-04-10',
    camera: 'Sony A7S III',
    settings: 'f/2.8, 30s, ISO 3200',
    likes: 834,
    views: 4567,
    featured: true
  },
  {
    id: '5',
    title: 'Ocean Serenity',
    description: 'Gentle waves create patterns in the sand as the ocean meets the shore.',
    image: '/images/photography/ocean-waves.jpg',
    category: 'Nature',
    location: 'Big Sur, California',
    date: '2024-03-05',
    camera: 'Nikon Z9',
    settings: 'f/16, 1/4s, ISO 100',
    likes: 398,
    views: 2103,
    featured: false
  },
  {
    id: '6',
    title: 'Architectural Lines',
    description: 'Modern architecture creates bold geometric patterns against the sky.',
    image: '/images/photography/architecture.jpg',
    category: 'Architecture',
    location: 'Dubai, UAE',
    date: '2024-02-15',
    camera: 'Canon EOS R6',
    settings: 'f/8, 1/200s, ISO 100',
    likes: 267,
    views: 1234,
    featured: false
  },
  {
    id: '7',
    title: 'Wildlife Majesty',
    description: 'A majestic eagle soars through the mountain valleys in perfect flight.',
    image: '/images/photography/eagle-flight.jpg',
    category: 'Wildlife',
    location: 'Yellowstone, USA',
    date: '2024-04-01',
    camera: 'Canon EOS R7',
    settings: 'f/5.6, 1/1000s, ISO 800',
    likes: 512,
    views: 2876,
    featured: true
  },
  {
    id: '8',
    title: 'Cultural Heritage',
    description: 'Ancient temple architecture showcasing the beauty of traditional craftsmanship.',
    image: '/images/photography/temple.jpg',
    category: 'Cultural',
    location: 'Kyoto, Japan',
    date: '2024-01-25',
    camera: 'Sony A7R V',
    settings: 'f/11, 1/125s, ISO 200',
    likes: 345,
    views: 1890,
    featured: false
  }
]

export default function PhotographyPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filter, setFilter] = useState<string>('All')
  
  // Get unique categories
  const categories = ['All', ...Array.from(new Set(photos.map(photo => photo.category)))]
  
  // Filter photos
  const filteredPhotos = filter === 'All' 
    ? photos 
    : photos.filter(photo => photo.category === filter)

  // Memoize floating particles
  const floatingParticles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 6 + Math.random() * 4,
      delay: Math.random() * 3,
    }))
  }, [])

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo)
    setCurrentIndex(filteredPhotos.findIndex(item => item.id === photo.id))
  }

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (!selectedPhoto) return
    
    let newIndex = currentIndex
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredPhotos.length - 1
    } else {
      newIndex = currentIndex < filteredPhotos.length - 1 ? currentIndex + 1 : 0
    }
    
    setCurrentIndex(newIndex)
    setSelectedPhoto(filteredPhotos[newIndex])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-emerald-900/80 to-slate-900/90" />
        
        {/* Floating particles */}
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.7, 0.2],
              scale: [0.5, 1.3, 0.5],
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
            Photography
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Capturing moments, emotions, and the beauty of our world through the lens of creativity and technical excellence.
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
                    ? 'bg-emerald-600/30 border-emerald-400/50 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Masonry Photo Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 mb-12"
        >
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="break-inside-avoid group cursor-pointer"
              onClick={() => openLightbox(photo)}
            >
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-400/30 transition-all duration-500">
                {/* Featured badge */}
                {photo.featured && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-medium rounded-full">
                    Featured
                  </div>
                )}

                {/* Photo */}
                <div className="relative overflow-hidden">
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    width={400}
                    height={600}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Quick info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Camera className="w-4 h-4" />
                      {photo.camera}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      {photo.location}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-medium text-white mb-2 group-hover:text-gray-100 transition-colors">
                    {photo.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {photo.description}
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>{new Date(photo.date).toLocaleDateString()}</span>
                    <span className="text-emerald-400">{photo.category}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {photo.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {photo.views}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Magical sparkles on hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                      style={{
                        left: `${i * 5}px`,
                        top: `${i * 7}px`,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.2, 0],
                      }}
                      transition={{
                        duration: 1.5,
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
            <Camera className="w-4 h-4" />
            Available for photography commissions and collaborations
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation arrows */}
            {filteredPhotos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigatePhoto('prev')
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigatePhoto('next')
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Photo and info */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="max-w-7xl max-h-[90vh] mx-4 flex flex-col lg:flex-row gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Photo */}
              <div className="relative flex-1 max-h-[60vh] lg:max-h-[85vh]">
                <Image
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  width={1200}
                  height={800}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>

              {/* Info panel */}
              <div className="w-full lg:w-96 bg-white/10 backdrop-blur-xl rounded-lg p-6 border border-white/20">
                <h2 className="text-2xl font-medium text-white mb-3">{selectedPhoto.title}</h2>
                <p className="text-gray-300 mb-6">{selectedPhoto.description}</p>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{selectedPhoto.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Camera className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{selectedPhoto.camera}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <span className="text-gray-400 block">Category</span>
                      <span className="text-white">{selectedPhoto.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Date</span>
                      <span className="text-white">{new Date(selectedPhoto.date).toLocaleDateString()}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400 block">Settings</span>
                      <span className="text-white">{selectedPhoto.settings}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 mt-6 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-gray-300">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {selectedPhoto.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {selectedPhoto.views}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="text-xs text-gray-400">
                    {currentIndex + 1} of {filteredPhotos.length}
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