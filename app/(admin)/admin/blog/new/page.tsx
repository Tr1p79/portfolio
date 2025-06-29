// app/(admin)/admin/blog/new/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  Image as ImageIcon, 
  Tag,
  Calendar,
  Clock,
  FileText,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Quote,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import AdminAuthGuard from '@components/admin/AdminAuthGuard'
import ImageUpload from '../../../../components/admin/ImageUpload'
import CustomDropdown from '../../../../components/ui/CustomDropdown'
import { blogAPI } from '@lib/database'

// Blog categories - in a real app, get from database
const blogCategories = [
  { id: '1', name: 'Tutorials', color: 'from-blue-500 to-cyan-500' },
  { id: '2', name: 'Behind the Scenes', color: 'from-purple-500 to-pink-500' },
  { id: '3', name: 'Industry News', color: 'from-green-500 to-emerald-500' },
  { id: '4', name: 'Personal', color: 'from-orange-500 to-red-500' },
  { id: '5', name: 'Reviews', color: 'from-teal-500 to-blue-500' }
]

interface BlogPostForm {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  featured_image?: string
  published: boolean
  featured: boolean
}

function BlogEditorContent() {
  const [formData, setFormData] = useState<BlogPostForm>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    featured_image: '',
    published: false,
    featured: false
  })

  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const [tagInput, setTagInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const router = useRouter()

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

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const insertMarkdown = (syntax: string, text: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const newText = text || selectedText || 'text'
    
    let insertion = ''
    switch (syntax) {
      case 'bold':
        insertion = `**${newText}**`
        break
      case 'italic':
        insertion = `*${newText}*`
        break
      case 'link':
        insertion = `[${newText}](url)`
        break
      case 'quote':
        insertion = `> ${newText}`
        break
      case 'list':
        insertion = `- ${newText}`
        break
      case 'heading':
        insertion = `## ${newText}`
        break
    }

    const newContent = 
      textarea.value.substring(0, start) + 
      insertion + 
      textarea.value.substring(end)

    setFormData(prev => ({ ...prev, content: newContent }))
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const handleSave = async (publish: boolean = false) => {
    if (!formData.title || !formData.content) {
      setError('Title and content are required')
      return
    }

    setIsSaving(true)
    setError('')
    setSaveStatus('idle')

    try {
      const postData = {
        ...formData,
        published: publish,
        read_time: calculateReadTime(formData.content),
        published_at: publish ? new Date().toISOString() : undefined
      }

      await blogAPI.createPost(postData)
      
      setSaveStatus('success')
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/admin/blog')
      }, 1500)
      
    } catch (err: any) {
      setError(err.message || 'Failed to save blog post')
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  // Create dropdown options for categories
  const categoryOptions = blogCategories.map(category => ({
    value: category.name,
    label: category.name
  }))

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

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
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
            <h1 className="text-4xl font-light text-white tracking-tight">
              {formData.title || 'New Blog Post'}
            </h1>
            
            <div className="flex gap-3">
              {saveStatus === 'success' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-500/30 text-green-300 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  Saved successfully!
                </div>
              )}
              
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 border border-white/20 transition-all duration-300 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
              
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/30 text-white rounded-full hover:bg-blue-600/40 border border-blue-400/50 transition-all duration-300 disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                {isSaving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300 flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('write')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  activeTab === 'write'
                    ? 'bg-blue-600/30 border border-blue-400/50 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <FileText className="w-4 h-4" />
                Write
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  activeTab === 'preview'
                    ? 'bg-blue-600/30 border border-blue-400/50 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>

            {activeTab === 'write' ? (
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-white font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter your blog post title..."
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-white font-medium mb-2">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-friendly-slug"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300"
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    URL: /blog/{formData.slug || 'your-post-slug'}
                  </p>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-white font-medium mb-2">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of your post..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap gap-2 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <button
                    onClick={() => insertMarkdown('bold')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => insertMarkdown('italic')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => insertMarkdown('heading')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    title="Heading"
                  >
                    H2
                  </button>
                  <button
                    onClick={() => insertMarkdown('list')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    title="List"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => insertMarkdown('link')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    title="Link"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => insertMarkdown('quote')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    title="Quote"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-white font-medium mb-2">Content</label>
                  <textarea
                    id="content-editor"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Start writing your blog post content here..."
                    rows={20}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-300 resize-none font-mono"
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    Supports Markdown. Estimated read time: {calculateReadTime(formData.content)} minutes
                  </p>
                </div>
              </div>
            ) : (
              /* Preview */
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <h1 className="text-4xl font-light text-white mb-4">{formData.title || 'Preview Title'}</h1>
                <p className="text-gray-300 mb-8">{formData.excerpt || 'Preview excerpt will appear here...'}</p>
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {formData.content || 'Your content will appear here as you type...'}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Publish Settings */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-white font-medium mb-4">Publish Settings</h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                  />
                  <span className="text-white">Published</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                  />
                  <span className="text-white">Featured</span>
                </label>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 relative z-50">
              <h3 className="text-white font-medium mb-4">Category</h3>
              <CustomDropdown
                options={categoryOptions}
                value={formData.category}
                onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                placeholder="Select category"
              />
            </div>

            {/* Tags */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-white font-medium mb-4">Tags</h3>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 text-sm"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-2 bg-blue-600/30 text-white rounded-lg hover:bg-blue-600/40 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-300 text-sm rounded-full border border-blue-500/30"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-white font-medium mb-4">Featured Image</h3>
              
              <ImageUpload
                currentImage={formData.featured_image}
                onUploadComplete={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
                onRemove={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                folder="blog"
              />
            </div>

            {/* Post Stats */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-white font-medium mb-4">Post Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Word count:</span>
                  <span className="text-white">{formData.content.split(/\s+/).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Read time:</span>
                  <span className="text-white">{calculateReadTime(formData.content)} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Characters:</span>
                  <span className="text-white">{formData.content.length}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function BlogEditor() {
  return (
    <AdminAuthGuard>
      <BlogEditorContent />
    </AdminAuthGuard>
  )
}