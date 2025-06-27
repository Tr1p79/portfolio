// app/(pages)/blog/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { ArrowLeft, Search, Calendar, Clock, Heart, Eye, Tag, ArrowRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { blogAPI, BlogPost } from '../../../lib/database'

// Blog categories with colors
const blogCategories = [
  { id: '1', name: 'Tutorials', color: 'from-blue-500 to-cyan-500' },
  { id: '2', name: 'Behind the Scenes', color: 'from-purple-500 to-pink-500' },
  { id: '3', name: 'Industry News', color: 'from-green-500 to-emerald-500' },
  { id: '4', name: 'Personal', color: 'from-orange-500 to-red-500' },
  { id: '5', name: 'Reviews', color: 'from-teal-500 to-blue-500' }
]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'featured'>('newest')
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.views - a.views)
        break
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      default: // newest
        filtered.sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime())
    }

    return filtered
  }, [blogPosts, searchTerm, selectedCategory, sortBy])

  const featuredPost = blogPosts.find(post => post.featured)

  // Memoize floating particles
  const floatingParticles = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 8 + Math.random() * 4,
      delay: Math.random() * 3,
    }))
  }, [])

  // Load blog posts on component mount
  useEffect(() => {
    loadBlogPosts()
  }, [])

  const loadBlogPosts = async () => {
    setLoading(true)
    setError('')
    try {
      const posts = await blogAPI.getPublishedPosts()
      setBlogPosts(posts)
    } catch (err: any) {
      setError(err.message || 'Failed to load blog posts')
      console.error('Error loading blog posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (categoryName: string) => {
    const category = blogCategories.find(cat => cat.name === categoryName)
    return category?.color || 'from-gray-500 to-gray-600'
  }

  const handlePostClick = async (post: BlogPost) => {
    // Increment view count
    try {
      await blogAPI.incrementViews(post.id)
      // Update local state
      setBlogPosts(prev => prev.map(p => 
        p.id === post.id ? { ...p, views: p.views + 1 } : p
      ))
    } catch (error) {
      console.error('Error incrementing views:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-indigo-900/80 to-slate-900/90" />
        
        {/* Floating particles */}
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-indigo-400/30 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
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
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <button
              onClick={loadBlogPosts}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 border border-white/20 transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight">
            Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Thoughts, tutorials, and insights on digital art, creativity, and the evolving world of visual storytelling.
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300"
          >
            {error}
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 space-y-6"
        >
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400/50 focus:bg-white/15 transition-all duration-300"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-400 text-sm">Categories:</span>
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedCategory === 'All'
                    ? 'bg-indigo-600/30 border border-indigo-400/50 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                All
              </button>
              {blogCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    selectedCategory === category.name
                      ? 'bg-indigo-600/30 border border-indigo-400/50 text-white'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Sort Filter */}
            <div className="flex gap-2 items-center ml-auto">
              <span className="text-gray-400 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-400/50"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="featured">Featured</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="flex items-center gap-3 text-white">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span>Loading blog posts...</span>
            </div>
          </motion.div>
        )}

        {/* Featured Post */}
        {!loading && featuredPost && selectedCategory === 'All' && !searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-medium text-white mb-6">Featured Article</h2>
            <Link 
              href={`/blog/${featuredPost.slug}`} 
              className="group block"
              onClick={() => handlePostClick(featuredPost)}
            >
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-400/30 transition-all duration-500">
                <div className="md:flex">
                  {/* Featured image */}
                  {featuredPost.featured_image && (
                    <div className="relative md:w-1/2 h-64 md:h-80 overflow-hidden">
                      <Image
                        src={featuredPost.featured_image}
                        alt={featuredPost.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-full">
                        Featured
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className={`${featuredPost.featured_image ? 'md:w-1/2' : 'w-full'} p-8 flex flex-col justify-center`}>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${getCategoryColor(featuredPost.category)} text-white text-sm rounded-full mb-4 w-fit`}>
                      <Tag className="w-3 h-3" />
                      {featuredPost.category}
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-medium text-white mb-4 group-hover:text-gray-100 transition-colors">
                      {featuredPost.title}
                    </h3>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(featuredPost.published_at || featuredPost.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {featuredPost.read_time} min read
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="block"
                  onClick={() => handlePostClick(post)}
                >
                  <article className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-400/30 transition-all duration-500">
                    {/* Featured badge */}
                    {post.featured && (
                      <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium rounded-full">
                        Featured
                      </div>
                    )}

                    {/* Post image */}
                    {post.featured_image && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      {/* Category */}
                      <div className={`inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r ${getCategoryColor(post.category)} text-white text-xs rounded-full mb-3`}>
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </div>

                      <h3 className="text-xl font-medium text-white mb-3 group-hover:text-gray-100 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Meta info */}
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.published_at || post.created_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.read_time}m
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.views}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Magical sparkles on hover */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-indigo-400 rounded-full"
                          style={{
                            left: `${i * 6}px`,
                            top: `${i * 8}px`,
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
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No results message */}
        {!loading && filteredPosts.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 text-lg mb-4">No articles found</div>
            <p className="text-gray-500">
              {blogPosts.length === 0 
                ? "No blog posts have been published yet." 
                : "Try adjusting your search or filter criteria"
              }
            </p>
          </motion.div>
        )}

        {/* Newsletter signup */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
          >
            <h3 className="text-2xl font-medium text-white mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-6">Get notified when I publish new articles about art and creativity</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400/50"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                Subscribe
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}