// app/(admin)/admin/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { 
  Users, 
  FileText, 
  Image, 
  Camera, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Plus,
  Eye,
  Heart,
  TrendingUp,
  Activity,
  Palette,
  Cuboid
} from 'lucide-react'
import Link from 'next/link'
import AdminAuthGuard from '../../components/admin/AdminAuthGuard'
import { blogAPI, artworkAPI, contactAPI } from '../../../lib/database'

interface DashboardStats {
  totalPosts: number
  totalArtworks: number
  totalPhotos: number
  totalContacts: number
  totalViews: number
  totalLikes: number
}

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalArtworks: 0,
    totalPhotos: 0,
    totalContacts: 0,
    totalViews: 0,
    totalLikes: 0
  })
  const [loading, setLoading] = useState(true)

  // Memoize floating particles
  const floatingParticles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 25 + Math.random() * 15,
      delay: Math.random() * 10,
    }))
  }, [])

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      const [posts, artworks, contacts] = await Promise.all([
        blogAPI.getAllPosts().catch(() => []),
        artworkAPI.getArtworks().catch(() => []),
        contactAPI.getSubmissions().catch(() => [])
      ])

      const totalViews = artworks.reduce((sum, artwork) => sum + artwork.views, 0)
      const totalLikes = artworks.reduce((sum, artwork) => sum + artwork.likes, 0)
      const photos = artworks.filter(art => art.category === 'photography')
      const art = artworks.filter(art => art.category === '2d' || art.category === '3d')

      setStats({
        totalPosts: posts.length,
        totalArtworks: art.length,
        totalPhotos: photos.length,
        totalContacts: contacts.length,
        totalViews,
        totalLikes
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // FIXED: Unified quick actions with proper routing
  const quickActions = [
    {
      title: 'Write Blog Post',
      description: 'Create a new blog article',
      icon: FileText,
      href: '/admin/blog/new',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Upload Artwork',
      description: 'Add 2D or 3D artwork',
      icon: Palette,
      href: '/admin/art/new',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Add Photos',
      description: 'Upload photography',
      icon: Camera,
      href: '/admin/photos/new',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'View Messages',
      description: 'Check contact submissions',
      icon: MessageSquare,
      href: '/admin/contact',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10'
    }
  ]

  const managementLinks = [
    {
      title: 'Blog Management',
      description: `Manage ${stats.totalPosts} blog posts`,
      icon: FileText,
      href: '/admin/blog',
      color: 'from-blue-500 to-cyan-500',
      count: stats.totalPosts
    },
    {
      title: 'Artwork Gallery',
      description: `Manage ${stats.totalArtworks} artworks`,
      icon: Palette,
      href: '/admin/art',
      color: 'from-purple-500 to-pink-500',
      count: stats.totalArtworks
    },
    {
      title: 'Photo Gallery',
      description: `Manage ${stats.totalPhotos} photos`,
      icon: Camera,
      href: '/admin/photos',
      color: 'from-emerald-500 to-teal-500',
      count: stats.totalPhotos
    },
    {
      title: 'Contact Messages',
      description: `${stats.totalContacts} submissions`,
      icon: MessageSquare,
      href: '/admin/contact',
      color: 'from-orange-500 to-red-500',
      count: stats.totalContacts
    }
  ]

  const statsCards = [
    {
      title: 'Total Content',
      value: stats.totalPosts + stats.totalArtworks + stats.totalPhotos,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      description: 'Blog posts, artworks & photos'
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'from-purple-500 to-purple-600',
      description: 'Across all content'
    },
    {
      title: 'Total Likes',
      value: stats.totalLikes,
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      description: 'Community engagement'
    },
    {
      title: 'Messages',
      value: stats.totalContacts,
      icon: MessageSquare,
      color: 'from-emerald-500 to-emerald-600',
      description: 'Contact submissions'
    }
  ]

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-indigo-900/80 to-slate-900/90" />
          
          {/* Enhanced floating particles */}
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

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Admin Dashboard
            </h1>
            <p className="text-gray-300 text-lg">
              Welcome back! Manage your portfolio content and track engagement.
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-indigo-400/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                  {loading ? '...' : stat.value.toLocaleString()}
                </div>
                <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                <p className="text-gray-500 text-xs">{stat.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Plus className="w-6 h-6 text-indigo-400" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <Link
                    href={action.href}
                    className={`group block p-6 ${action.bgColor} backdrop-blur-sm rounded-xl border border-white/10 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105`}
                  >
                    <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${action.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {action.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Management Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-indigo-400" />
              Content Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {managementLinks.map((link, index) => (
                <motion.div
                  key={link.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-indigo-400/50 transition-all duration-300 hover:bg-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${link.color}`}>
                        <link.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors duration-300">
                          {link.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {link.description}
                        </p>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold bg-gradient-to-r ${link.color} bg-clip-text text-transparent`}>
                      {loading ? '...' : link.count}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Activity className="w-6 h-6 text-indigo-400" />
              Recent Activity
            </h2>
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Activity tracking coming soon...</p>
              <p className="text-gray-500 text-sm mt-2">
                View recent content updates, user engagement, and system events
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminAuthGuard>
  )
}

export default AdminDashboard