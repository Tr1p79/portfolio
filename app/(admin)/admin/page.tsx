// app/(admin)/admin/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { 
  BarChart3, 
  FileText, 
  Image, 
  Camera, 
  Cuboid, 
  User, 
  Settings, 
  Plus,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Heart,
  MessageSquare,
  Mail,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import AdminAuthGuard from '../../components/admin/AdminAuthGuard'
import { blogAPI, artworkAPI, contactAPI, analyticsAPI } from '../../../lib/database'

interface DashboardStats {
  totalViews: number
  totalLikes: number
  totalComments: number
  blogPosts: number
  artPieces: number
  photos: number
  models3D: number
  contactSubmissions: number
}

interface RecentActivity {
  id: string
  type: 'contact' | 'blog' | 'artwork' | 'view'
  content: string
  timestamp: string
  user?: string
}

function AdminDashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    blogPosts: 0,
    artPieces: 0,
    photos: 0,
    models3D: 0,
    contactSubmissions: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Memoize floating particles
  const floatingParticles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
    }))
  }, [])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Load all data in parallel
      const [
        blogPosts,
        artworks,
        contacts,
        pageViews
      ] = await Promise.all([
        blogAPI.getAllPosts(),
        artworkAPI.getArtworks(),
        contactAPI.getSubmissions(),
        analyticsAPI.getPageViews(30)
      ])

      // Calculate stats
      const totalLikes = blogPosts.reduce((sum, post) => sum + post.likes, 0) + 
                        artworks.reduce((sum, art) => sum + art.likes, 0)
      const totalViews = blogPosts.reduce((sum, post) => sum + post.views, 0) + 
                        artworks.reduce((sum, art) => sum + art.views, 0) + 
                        pageViews.length

      const photos = artworks.filter(art => art.category === 'photography').length
      const models3D = artworks.filter(art => art.category === '3d').length
      const artPieces = artworks.filter(art => art.category === '2d').length

      setStats({
        totalViews,
        totalLikes,
        totalComments: 0, // You can add comments later
        blogPosts: blogPosts.length,
        artPieces,
        photos,
        models3D,
        contactSubmissions: contacts.length
      })

      // Create recent activity from various sources
      const activities: RecentActivity[] = []

      // Recent contact submissions
      contacts.slice(0, 3).forEach(contact => {
        activities.push({
          id: contact.id,
          type: 'contact',
          content: `New contact from ${contact.name}: "${contact.subject}"`,
          timestamp: formatTimeAgo(contact.created_at),
          user: contact.name
        })
      })

      // Recent blog posts
      blogPosts.slice(0, 2).forEach(post => {
        activities.push({
          id: post.id,
          type: 'blog',
          content: `Published "${post.title}"`,
          timestamp: formatTimeAgo(post.created_at)
        })
      })

      // Recent artworks
      artworks.slice(0, 2).forEach(artwork => {
        activities.push({
          id: artwork.id,
          type: 'artwork',
          content: `Added new ${artwork.category} artwork: "${artwork.title}"`,
          timestamp: formatTimeAgo(artwork.created_at)
        })
      })

      // Sort by most recent and take top 5
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setRecentActivity(activities.slice(0, 5))
      setLastUpdated(new Date())

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  const quickActions = [
    {
      title: 'New Blog Post',
      description: 'Create a new article',
      icon: FileText,
      href: '/admin/blog/new',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Upload 2D Art',
      description: 'Add new artwork',
      icon: Image,
      href: '/admin/art/new',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Add Photos',
      description: 'Upload photography',
      icon: Camera,
      href: '/admin/photos/new',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Upload 3D Model',
      description: 'Add 3D artwork',
      icon: Cuboid,
      href: '/admin/3d/new',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <Mail className="w-4 h-4" />
      case 'blog':
        return <FileText className="w-4 h-4" />
      case 'artwork':
        return <Image className="w-4 h-4" />
      case 'view':
        return <Eye className="w-4 h-4" />
      default:
        return <BarChart3 className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'contact':
        return 'text-green-400'
      case 'blog':
        return 'text-blue-400'
      case 'artwork':
        return 'text-purple-400'
      case 'view':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-violet-900/80 to-slate-900/90" />
        
        {/* Floating particles */}
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-violet-400/20 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 2.5, 0.5],
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-light text-white mb-2 tracking-tight">
                Dashboard
              </h1>
              <p className="text-gray-300">
                Welcome back! Here's what's happening with your portfolio.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={loadDashboardData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 border border-white/20 transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 border border-white/20 transition-all duration-300"
              >
                <Eye className="w-4 h-4" />
                View Site
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 px-4 py-2 bg-violet-600/30 text-white rounded-full hover:bg-violet-600/40 border border-violet-400/50 transition-all duration-300"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </div>
          </div>

          {/* Last updated */}
          <div className="text-sm text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'from-blue-500 to-cyan-500', change: '+12%' },
            { label: 'Total Likes', value: stats.totalLikes, icon: Heart, color: 'from-red-500 to-pink-500', change: '+8%' },
            { label: 'Contact Submissions', value: stats.contactSubmissions, icon: Mail, color: 'from-green-500 to-emerald-500', change: '+15%' },
            { label: 'Content Items', value: stats.blogPosts + stats.artPieces + stats.photos + stats.models3D, icon: BarChart3, color: 'from-purple-500 to-violet-500', change: '+5%' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-violet-400/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {loading ? '...' : stat.value.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h2 className="text-2xl font-medium text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={action.href} className="group block">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-violet-400/30 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color}`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-1">{action.title}</h3>
                          <p className="text-gray-400 text-sm">{action.description}</p>
                        </div>
                        <Plus className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Content Overview */}
            <h2 className="text-2xl font-medium text-white mb-6">Content Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Blog Posts', value: stats.blogPosts, icon: FileText, href: '/admin/blog' },
                { label: '2D Artworks', value: stats.artPieces, icon: Image, href: '/admin/art' },
                { label: 'Photos', value: stats.photos, icon: Camera, href: '/admin/photos' },
                { label: '3D Models', value: stats.models3D, icon: Cuboid, href: '/admin/3d' }
              ].map((item, index) => (
                <Link key={item.label} href={item.href} className="group">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:border-violet-400/30 transition-all duration-300 text-center">
                    <item.icon className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white mb-1">
                      {loading ? '...' : item.value}
                    </div>
                    <div className="text-gray-400 text-sm">{item.label}</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-2xl font-medium text-white mb-6">Recent Activity</h2>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                      <div className="w-8 h-8 bg-white/10 rounded-lg" />
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-white/10 rounded w-3/4" />
                        <div className="h-3 bg-white/5 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className={`p-2 rounded-lg bg-white/10 ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm mb-1">{activity.content}</p>
                        {activity.user && (
                          <p className="text-violet-400 text-xs mb-1">by {activity.user}</p>
                        )}
                        <p className="text-gray-400 text-xs">{activity.timestamp}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
              
              <button className="w-full mt-4 px-4 py-2 text-violet-400 hover:text-white text-sm transition-colors">
                View All Activity
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AdminAuthGuard>
      <AdminDashboardContent />
    </AdminAuthGuard>
  )
}