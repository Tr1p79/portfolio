// app/(pages)/blog/[slug]/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { ArrowLeft, Calendar, Clock, Heart, Eye, Tag, Share2, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { sampleBlogPosts, blogCategories } from '../../../data/blog-types'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  // In a real app, you'd fetch the post by slug
  const post = sampleBlogPosts.find(p => p.slug === params.slug) || sampleBlogPosts[0]
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  
  // Get related posts (same category, excluding current post)
  const relatedPosts = sampleBlogPosts
    .filter(p => p.category === post.category && p.id !== post.id && p.published)
    .slice(0, 3)

  // Get previous and next posts
  const currentIndex = sampleBlogPosts.findIndex(p => p.id === post.id)
  const previousPost = currentIndex > 0 ? sampleBlogPosts[currentIndex - 1] : null
  const nextPost = currentIndex < sampleBlogPosts.length - 1 ? sampleBlogPosts[currentIndex + 1] : null

  // Memoize floating particles
  const floatingParticles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 10 + Math.random() * 5,
      delay: Math.random() * 3,
    }))
  }, [])

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        // Handle error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
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
            className="absolute w-1 h-1 bg-indigo-400/20 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1.8, 0.5],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-6 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getCategoryColor(post.category)} text-white text-sm rounded-full mb-6`}>
              <Tag className="w-4 h-4" />
              {post.category}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {post.views} views
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                {post.likes} likes
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                  isLiked
                    ? 'bg-red-600/20 border-red-400/50 text-red-400'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                Like
              </button>
              
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                  isBookmarked
                    ? 'bg-yellow-600/20 border-yellow-400/50 text-yellow-400'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                Save
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 text-gray-300 rounded-full hover:bg-white/10 transition-all duration-300"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-12 border border-white/10"
          >
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </motion.div>
        </div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto px-6 mb-16"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-12">
            <div className="prose prose-lg prose-invert max-w-none">
              {/* Convert markdown content to HTML - in a real app, use a markdown parser */}
              <div className="text-gray-300 leading-relaxed space-y-6">
                {post.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h2 key={index} className="text-3xl font-medium text-white mt-12 mb-6">
                        {paragraph.replace('# ', '')}
                      </h2>
                    )
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h3 key={index} className="text-2xl font-medium text-white mt-8 mb-4">
                        {paragraph.replace('## ', '')}
                      </h3>
                    )
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h4 key={index} className="text-xl font-medium text-white mt-6 mb-3">
                        {paragraph.replace('### ', '')}
                      </h4>
                    )
                  }
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').filter(item => item.startsWith('- '))
                    return (
                      <ul key={index} className="list-disc list-inside space-y-2 ml-4">
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-300">
                            {item.replace('- ', '')}
                          </li>
                        ))}
                      </ul>
                    )
                  }
                  return (
                    <p key={index} className="text-gray-300 leading-relaxed">
                      {paragraph}
                    </p>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-4xl mx-auto px-6 mb-16"
        >
          <div className="flex flex-wrap gap-3">
            <span className="text-gray-400">Tags:</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-full border border-white/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Navigation to Previous/Next Posts */}
        {(previousPost || nextPost) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-4xl mx-auto px-6 mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Previous Post */}
              {previousPost && (
                <Link href={`/blog/${previousPost.slug}`} className="group">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-indigo-400/30 transition-all duration-300">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <ChevronLeft className="w-4 h-4" />
                      Previous Article
                    </div>
                    <h4 className="text-white font-medium group-hover:text-gray-100 transition-colors">
                      {previousPost.title}
                    </h4>
                  </div>
                </Link>
              )}

              {/* Next Post */}
              {nextPost && (
                <Link href={`/blog/${nextPost.slug}`} className="group">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-indigo-400/30 transition-all duration-300 text-right">
                    <div className="flex items-center justify-end gap-2 text-gray-400 text-sm mb-2">
                      Next Article
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    <h4 className="text-white font-medium group-hover:text-gray-100 transition-colors">
                      {nextPost.title}
                    </h4>
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="max-w-7xl mx-auto px-6 mb-16"
          >
            <h3 className="text-2xl font-medium text-white mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                  <article className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-indigo-400/30 transition-all duration-300">
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-medium mb-2 group-hover:text-gray-100 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                        <Calendar className="w-3 h-3" />
                        {formatDate(relatedPost.publishedAt)}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}