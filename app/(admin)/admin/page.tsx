// app/(admin)/admin/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
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
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalViews: number
  totalLikes: number
  totalComments: number
  blogPosts: number
  artPieces: number
  photos: number
  models3D: number
}

interface RecentActivity {
  id: string
  type: 'view' | 'like' | 'comment' | 'post'
  content: string
  timestamp: string
  user?: string
}

// Sample dashboard data
const dashboardStats: DashboardStats = {
  totalViews: 25847,
  totalLikes: 3429,
  totalComments: 892,
  blogPosts: 12,
  artPieces: 48,
  photos: 156,
  models3D: 23
}

const recentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'view',
    content: 'Someone viewed "Cyberpunk Character"',
    timestamp: '2 minutes ago'
  },
  {
    id: '2',
    type: 'like',
    content: 'User liked "The Future of Digital Art"',
    timestamp: '15 minutes ago',
    user: 'Alex Chen'
  },
  {
    id: '3',
    type: 'comment',
    content: 'New comment on "Color Theory Guide"',
    timestamp: '1 hour ago',
    user: 'Sarah Kim'
  },
  {
    id: '4',
    type: 'post',
    content: 'Published "Mastering Lighting in 3D"',
    timestamp: '2 hours ago'
  },
  {
    id: '5',
    type: 'view',
    content: 'Portfolio page viewed 45 times today',
    timestamp: '3 hours ago'
  }
]

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

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week')

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <Eye className="w-4 h-4" />
      case 'like':
        return <Heart className="w-4 h-4" />
      case 'comment':
        return <MessageSquare className="w-4 h-4" />
      case 'post':
        return <FileText className="w-4 h-4" />
      default:
        return <BarChart3 className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'view':
        return 'text-blue-400'
      case 'like':
        return 'text-red-400'
      case 'comment':
        return 'text-green-400'
      case 'post':
        return 'text-purple-400'
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

          {/* Time Range Filter */}
          <div className="flex gap-2">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  timeRange === range
                    ? 'bg-violet-600/30 border border-violet-400/50 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                This {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
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
            { label: 'Total Views', value: dashboardStats.totalViews, icon: Eye, color: 'from-blue-500 to-cyan-500', change: '+12%' },
            { label: 'Total Likes', value: dashboardStats.totalLikes, icon: Heart, color: 'from-red-500 to-pink-500', change: '+8%' },
            { label: 'Comments', value: dashboardStats.totalComments, icon: MessageSquare, color: 'from-green-500 to-emerald-500', change: '+15%' },
            { label: 'Content Items', value: dashboardStats.blogPosts + dashboardStats.artPieces + dashboardStats.photos + dashboardStats.models3D, icon: BarChart3, color: 'from-purple-500 to-violet-500', change: '+5%' }
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
                {stat.value.toLocaleString()}
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
                { label: 'Blog Posts', value: dashboardStats.blogPosts, icon: FileText, href: '/admin/blog' },
                { label: '2D Artworks', value: dashboardStats.artPieces, icon: Image, href: '/admin/art' },
                { label: 'Photos', value: dashboardStats.photos, icon: Camera, href: '/admin/photos' },
                { label: '3D Models', value: dashboardStats.models3D, icon: Cuboid, href: '/admin/3d' }
              ].map((item, index) => (
                <Link key={item.label} href={item.href} className="group">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:border-violet-400/30 transition-all duration-300 text-center">
                    <item.icon className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white mb-1">{item.value}</div>
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