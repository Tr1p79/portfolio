// app/(admin)/admin/blog/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { 
  ArrowLeft, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Search,
  Calendar,
  Clock,
  Heart,
  MoreVertical,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import AdminAuthGuard from '../../../components/admin/AdminAuthGuard'
import { blogAPI, BlogPost } from '../../../../lib/database'

function BlogManagementContent() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [error, setError] = useState<string>('')

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
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    setError('')
    try {
      const allPosts = await blogAPI.getAllPosts()
      setPosts(allPosts)
    } catch (err: any) {
      setError(err.message || 'Failed to load blog posts')
      console.error('Error loading posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      await blogAPI.deletePost(postId)
      setPosts(prev => prev.filter(post => post.id !== postId))
    } catch (err: any) {
      alert('Failed to delete post: ' + err.message)
    }
  }

  const togglePublished = async (post: BlogPost) => {
    try {
      const updatedPost = await blogAPI.updatePost(post.id, {
        published: !post.published,
        published_at: !post.published ? new Date().toISOString() : undefined
      })
      
      setPosts(prev => prev.map(p => p.id === post.id ? updatedPost : p))
    } catch (err: any) {
      alert('Failed to update post: ' + err.message)
    }
  }

  // Filter posts based on search and status
  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    switch (filter) {
      case 'published':
        filtered = filtered.filter(post => post.published)
        break
      case 'draft':
        filtered = filtered.filter(post => !post.published)
        break
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [posts, searchTerm, filter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-slate-900/90" />
        
        {/* Floating particles */}
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
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
                Blog Management
              </h1>
              <p className="text-gray-300">
                Manage your blog posts and articles
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={loadPosts}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 border border-white/20 transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <Link
                href="/admin/blog/new"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600/30 text-white rounded-full hover:bg-blue-600/40 border border-blue-400/50 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                New Post
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
          className="mb-8 flex flex-col sm:flex-row gap-4"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Posts' },
              { key: 'published', label: 'Published' },
              { key: 'draft', label: 'Drafts' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key as any)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  filter === option.key
                    ? 'bg-blue-600/30 border border-blue-400/50 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Posts', value: posts.length, color: 'from-blue-500 to-cyan-500' },
            { label: 'Published', value: posts.filter(p => p.published).length, color: 'from-green-500 to-emerald-500' },
            { label: 'Drafts', value: posts.filter(p => !p.published).length, color: 'from-yellow-500 to-orange-500' },
            { label: 'Total Views', value: posts.reduce((sum, p) => sum + p.views, 0), color: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
              <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                {loading ? '...' : stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Posts List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
              <p className="text-gray-300">Loading blog posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-lg mb-4">
                {posts.length === 0 ? 'No blog posts yet' : 'No posts match your criteria'}
              </div>
              <Link
                href="/admin/blog/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600/30 text-white rounded-full hover:bg-blue-600/40 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="p-6 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-medium text-white hover:text-gray-100 transition-colors">
                          {post.title}
                        </h3>
                        
                        {/* Status Badge */}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          post.published 
                            ? 'bg-green-600/20 text-green-300 border border-green-500/30'
                            : 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                        
                        {post.featured && (
                          <span className="px-2 py-1 text-xs rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      {post.excerpt && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-6 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.read_time}m read
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likes} likes
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                          title="View Post"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                      
                      <Link
                        href={`/admin/blog/edit/${post.id}`}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        title="Edit Post"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      
                      <button
                        onClick={() => togglePublished(post)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          post.published
                            ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-600/10'
                            : 'text-green-400 hover:text-green-300 hover:bg-green-600/10'
                        }`}
                        title={post.published ? 'Unpublish' : 'Publish'}
                      >
                        {post.published ? '📝' : '🚀'}
                      </button>
                      
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-600/10 rounded-lg transition-all duration-200"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default function BlogManagement() {
  return (
    <AdminAuthGuard>
      <BlogManagementContent />
    </AdminAuthGuard>
  )
}