// app/(admin)/admin/art/new/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Save,
  Image as ImageIcon,
  Palette,
  Cuboid,
  Tag,
  Calendar,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import AdminAuthGuard from '../../../../components/admin/AdminAuthGuard'
import ImageUpload from '../../../../components/admin/ImageUpload'
import CustomDropdown from '../../../../components/ui/CustomDropdown'
import { artworkAPI } from '../../../../../lib/database'

interface ArtworkForm {
  title: string
  description: string
  image_url: string
  category: '3d' | '2d'
  subcategory: string
  year: number
  medium: string
  dimensions: string
  sketchfab_id: string
  tags: string[]
  featured: boolean
}

const artworkCategories = {
  '2d': [
    'Digital Painting',
    'Illustration',
    'Concept Art',
    'Character Design',
    'Environment Art',
    'Portrait',
    'Abstract',
    'Fantasy Art'
  ],
  '3d': [
    'Character Model',
    'Environment',
    'Props',
    'Vehicle',
    'Architectural',
    'Abstract Sculpture',
    'Animation',
    'Game Asset'
  ]
}

function ArtworkUploadContent() {
  const [formData, setFormData] = useState<ArtworkForm>({
    title: '',
    description: '',
    image_url: '',
    category: '2d',
    subcategory: '',
    year: new Date().getFullYear(),
    medium: '',
    dimensions: '',
    sketchfab_id: '',
    tags: [],
    featured: false
  })

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

  const handleSave = async () => {
    if (!formData.title || !formData.image_url || !formData.subcategory) {
      setError('Title, image, and category are required')
      return
    }

    setIsSaving(true)
    setError('')
    setSaveStatus('idle')

    try {
      await artworkAPI.createArtwork({
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url,
        category: formData.category,
        subcategory: formData.subcategory,
        year: formData.year,
        medium: formData.medium,
        dimensions: formData.dimensions,
        sketchfab_id: formData.sketchfab_id,
        tags: formData.tags,
        featured: formData.featured
      })

      setSaveStatus('success')
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/admin/art')
      }, 1500)

    } catch (err: any) {
      setError(err.message || 'Failed to save artwork')
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  const currentCategories = artworkCategories[formData.category]
  
  // Create dropdown options for subcategory
  const subcategoryOptions = currentCategories.map(category => ({
    value: category,
    label: category
  }))

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

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
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
              Upload Artwork
            </h1>
            
            <div className="flex gap-3">
              {saveStatus === 'success' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-500/30 text-green-300 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  Saved successfully!
                </div>
              )}
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600/30 text-white rounded-full hover:bg-purple-600/40 border border-purple-400/50 transition-all duration-300 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Artwork'}
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

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="xl:col-span-3 space-y-6"
          >
            {/* Artwork Image */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-white font-medium">Artwork Image</h3>
              </div>
              <ImageUpload
                currentImage={formData.image_url}
                onUploadComplete={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                onRemove={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                folder="artwork"
                className="aspect-[4/3]"
              />
            </div>

            {/* Basic Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Palette className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-white font-medium">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Title */}
                <div className="lg:col-span-2">
                  <label className="block text-white font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Artwork title"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-300"
                  />
                </div>

                {/* Description */}
                <div className="lg:col-span-2">
                  <label className="block text-white font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    placeholder="Describe your artwork..."
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Category Type */}
                <div className="lg:col-span-2">
                  <label className="block text-white font-medium mb-2">Type *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: '2d', subcategory: '' }))}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
                        formData.category === '2d'
                          ? 'bg-purple-600/30 border-purple-400/50 text-white'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <Palette className="w-5 h-5" />
                      2D Art
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: '3d', subcategory: '' }))}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
                        formData.category === '3d'
                          ? 'bg-purple-600/30 border-purple-400/50 text-white'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <Cuboid className="w-5 h-5" />
                      3D Art
                    </button>
                  </div>
                </div>

                {/* Subcategory */}
                <div>
                  <label className="block text-white font-medium mb-2">Category *</label>
                  <CustomDropdown
                    options={subcategoryOptions}
                    value={formData.subcategory}
                    onChange={(value) => setFormData(prev => ({ ...prev, subcategory: value }))}
                    placeholder="Select category"
                    required
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-white font-medium mb-2">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400/50"
                  />
                </div>

                {/* Medium */}
                <div className="lg:col-span-2">
                  <label className="block text-white font-medium mb-2">Medium</label>
                  <input
                    type="text"
                    value={formData.medium}
                    onChange={(e) => setFormData(prev => ({ ...prev, medium: e.target.value }))}
                    placeholder="e.g., Digital, Blender, Photoshop"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-white font-medium mb-2">Dimensions</label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                    placeholder="e.g., 1920x1080, 30x40cm"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50"
                  />
                </div>

                {/* Sketchfab ID (for 3D) - spans full width when visible */}
                {formData.category === '3d' && (
                  <div className="lg:col-span-2">
                    <label className="block text-white font-medium mb-2">
                      <ExternalLink className="w-4 h-4 inline mr-1" />
                      Sketchfab Model ID
                    </label>
                    <input
                      type="text"
                      value={formData.sketchfab_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, sketchfab_id: e.target.value }))}
                      placeholder="Sketchfab model ID for 3D viewer"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50"
                    />
                    <p className="text-gray-400 text-sm mt-1">
                      Optional: Enter Sketchfab model ID to enable 3D viewer
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="xl:col-span-2 space-y-6"
          >
            {/* Tags */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Tag className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-white font-medium">Tags</h3>
              </div>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 text-sm"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-2 bg-purple-600/30 text-white rounded-lg hover:bg-purple-600/40 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600/20 text-purple-300 text-sm rounded-full border border-purple-500/30"
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

            {/* Settings */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-white font-medium">Settings</h3>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                  />
                  <span className="text-white">Featured Artwork</span>
                  <span className="text-gray-400 text-sm ml-auto">Showcase in portfolio</span>
                </label>
              </div>
            </div>

            {/* Preview */}
            {formData.image_url && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h3 className="text-white font-medium mb-4">Preview</h3>
                
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                  <img
                    src={formData.image_url}
                    alt={formData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Title:</span>
                    <span className="text-white ml-2">{formData.title || 'Untitled'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white ml-2">{formData.category.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white ml-2">{formData.subcategory || 'None'}</span>
                  </div>
                  {formData.year && (
                    <div>
                      <span className="text-gray-400">Year:</span>
                      <span className="text-white ml-2">{formData.year}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function ArtworkUpload() {
  return (
    <AdminAuthGuard>
      <ArtworkUploadContent />
    </AdminAuthGuard>
  )
}