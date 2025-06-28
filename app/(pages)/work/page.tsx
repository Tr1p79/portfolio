// app/(pages)/work/page.tsx - Creative Work Overview Landing
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Palette, Cuboid, Camera, Eye, Heart, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { artworkAPI, Artwork } from '../../../lib/database'

interface WorkCategory {
  title: string
  subtitle: string
  description: string
  href: string
  icon: any
  color: string
  bgGradient: string
  count?: number
  featured?: Artwork[]
}

export default function WorkOverviewPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)

  // Memoize floating particles for performance
  const floatingParticles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 30 + Math.random() * 20,
      delay: Math.random() * 10,
    }))
  }, [])

  // Load all artworks for preview
  useEffect(() => {
    loadArtworks()
  }, [])

  const loadArtworks = async () => {
    setLoading(true)
    try {
      const allArtworks = await artworkAPI.getArtworks()
      setArtworks(allArtworks)
    } catch (err) {
      console.error('Error loading artworks:', err)
    } finally {
      setLoading(false)
    }
  }

  // Organize artworks by category
  const workCategories: WorkCategory[] = useMemo(() => {
    const threeDWorks = artworks.filter(art => art.category === '3d')
    const twoDWorks = artworks.filter(art => art.category === '2d')
    const photos = artworks.filter(art => art.category === 'photography')

    return [
      {
        title: '3D Art',
        subtitle: 'Digital Sculptures',
        description: 'Interactive 3D models, characters, environments, and digital sculptures created with industry-standard tools.',
        href: '/work/3d',
        icon: Cuboid,
        color: 'from-purple-400 via-purple-300 to-purple-500',
        bgGradient: 'from-slate-900 via-purple-900 to-slate-900',
        count: threeDWorks.length,
        featured: threeDWorks.filter(art => art.featured).slice(0, 3)
      },
      {
        title: '2D Art',
        subtitle: 'Digital Paintings',
        description: 'Digital paintings, illustrations, concept art, and visual storytelling through traditional and digital mediums.',
        href: '/work/2d',
        icon: Palette,
        color: 'from-pink-400 via-pink-300 to-pink-500',
        bgGradient: 'from-slate-900 via-pink-900 to-slate-900',
        count: twoDWorks.length,
        featured: twoDWorks.filter(art => art.featured).slice(0, 3)
      },
      {
        title: 'Photography',
        subtitle: 'Captured Moments',
        description: 'Professional photography capturing emotions, landscapes, portraits, and the beauty of our world through the lens.',
        href: '/work/photography',
        icon: Camera,
        color: 'from-emerald-400 via-emerald-300 to-emerald-500',
        bgGradient: 'from-slate-900 via-emerald-900 to-slate-900',
        count: photos.length,
        featured: photos.filter(art => art.featured).slice(0, 3)
      }
    ]
  }, [artworks])

  // Calculate total stats
  const totalStats = useMemo(() => ({
    works: artworks.length,
    views: artworks.reduce((sum, art) => sum + art.views, 0),
    likes: artworks.reduce((sum, art) => sum + art.likes, 0),
    featured: artworks.filter(art => art.featured).length
  }), [artworks])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-indigo-900/80 to-slate-900/90" />
        
        {/* Enhanced Floating Particles */}
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-indigo-400/20 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -150, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 2.5, 0.5],
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
          className="mb-16 mt-16 text-center" // Added mt-16 for navbar spacing
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <Link
              href="/"
              className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-indigo-300 hover:text-white border border-white/20 hover:border-indigo-400/50 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                My Work
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Explore my creative journey through digital art, 3D modeling, and photography. 
                Each piece tells a story and showcases technical mastery combined with artistic vision.
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            >
              {[
                { label: 'Total Works', value: totalStats.works, icon: Star },
                { label: 'Total Views', value: totalStats.views.toLocaleString(), icon: Eye },
                { label: 'Total Likes', value: totalStats.likes.toLocaleString(), icon: Heart },
                { label: 'Featured', value: totalStats.featured, icon: Star }
              ].map((stat, index) => (
                <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                  <stat.icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Work Categories - SMALLER SECTIONS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-6"
        >
          {workCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="group"
            >
              <Link href={category.href}>
                <div className={`relative bg-gradient-to-br ${category.bgGradient} rounded-xl border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-300 hover:scale-[1.01]`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  </div>

                  <div className="relative p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                      {/* Content - MORE COMPACT */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color}`}>
                            <category.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                              {category.title}
                            </h2>
                            <p className="text-gray-400">{category.subtitle}</p>
                          </div>
                        </div>

                        <p className="text-gray-300 leading-relaxed mb-4">
                          {category.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              {category.count} {category.count === 1 ? 'piece' : 'pieces'}
                            </span>
                            {category.featured && category.featured.length > 0 && (
                              <span className="flex items-center gap-2">
                                <Heart className="w-4 h-4" />
                                {category.featured.length} featured
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-white group-hover:text-indigo-300 transition-colors duration-300">
                            <span className="font-medium">Explore</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>

                      {/* Featured Preview - SMALLER */}
                      <div className="relative lg:col-span-1">
                        {category.featured && category.featured.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {category.featured.slice(0, 3).map((artwork, artIndex) => (
                              <motion.div
                                key={artwork.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 + artIndex * 0.1 }}
                                className="relative aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-300"
                              >
                                <Image
                                  src={artwork.image_url}
                                  alt={artwork.title}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  sizes="120px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                {/* Artwork Info - SMALLER */}
                                <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <h4 className="text-white text-xs font-medium truncate">
                                    {artwork.title}
                                  </h4>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="aspect-[3/2] rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                            <div className="text-center">
                              <category.icon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                              <p className="text-gray-500 text-xs">No works yet</p>
                            </div>
                          </div>
                        )}

                        {/* Smaller Decorative Elements */}
                        <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r ${category.color} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
                        <div className={`absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r ${category.color} rounded-full opacity-10 group-hover:opacity-30 transition-opacity duration-300`} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Interested in Working Together?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              I'm always excited to collaborate on new projects and bring creative visions to life. 
              Let's discuss how we can work together to create something amazing.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 font-medium"
            >
              Get In Touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}