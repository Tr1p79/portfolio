// app/(admin)/admin/photos/new/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Save,
  Image as ImageIcon,
  Camera,
  MapPin,
  Calendar,
  Settings,
  Tag,
  Eye,
  Heart,
  Download,
  Grid,
  List,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import AdminAuthGuard from '../../../../components/admin/AdminAuthGuard'
import ImageUpload from '../../../../components/admin/ImageUpload'
import CustomDropdown from '../../../../components/ui/CustomDropdown'
import { artworkAPI } from '../../../../../lib/database'

interface PhotoUpload {
  id: string
  title: string
  description: string
  image_url: string
  category: string
  location: string
  camera: string
  settings: string
  tags: string[]
  featured: boolean
}

const photoCategories = [
  'Landscape',
  'Portrait', 
  'Urban',
  'Nature',
  'Architecture',
  'Wildlife',
  'Street',
  'Abstract',
  'Astrophotography',
  'Cultural'
]

function PhotoUploadContent() {
  const [uploads, setUploads] = useState<PhotoUpload[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const router = useRouter()

  // Memoize floating particles
  const floatingParticles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 25 + Math.random() * 15,
      delay: Math.random() * 5,
    }))
  }, [])

  const createNewPhoto = (): PhotoUpload => {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: '',
      description: '',
      image_url: '',
      category: '',
      location: '',
      camera: '',
      settings: '',
      tags: [],
      featured: false
    }
  }

  const addNewPhoto = () => {
    const newPhoto = createNewPhoto()
    setUploads(prev => [...prev, newPhoto])
    setSelectedPhoto(newPhoto.id)
  }

  const updatePhoto = (id: string, updates: Partial<PhotoUpload>) => {
    setUploads(prev => prev.map(photo => 
      photo.id === id ? { ...photo, ...updates } : photo
    ))
  }

  const removePhoto = (id: string) => {
    setUploads(prev => prev.filter(photo => photo.id !== id))
    if (selectedPhoto === id) setSelectedPhoto(null)
  }

  const addTag = (id: string, tag: string) => {
    if (!tag.trim()) return
    
    updatePhoto(id, {
      tags: [...uploads.find(p => p.id === id)?.tags || [], tag.trim()]
    })
  }

  const removeTag = (id: string, tagToRemove: string) => {
    updatePhoto(id, {
      tags: uploads.find(p => p.id === id)?.tags.filter(tag => tag !== tagToRemove) || []
    })
  }

  const handleSaveAll = async () => {
    const validPhotos = uploads.filter(photo => 
      photo.image_url && photo.title && photo.category
    )

    if (validPhotos.length === 0) {
      setError('Please add at least one photo with title, image, and category')
      return
    }

    setIsSaving(true)
    setError('')
    setSaveStatus('idle')

    try {
      // Save each photo to database
      for (const photo of validPhotos) {
        await artworkAPI.createArtwork({
          title: photo.title,
          description: photo.description,
          image_url: photo.image_url,
          category: 'photography',
          subcategory: photo.category,
          location: photo.location,
          camera: photo.camera,
          settings: photo.settings,
          tags: photo.tags,
          featured: photo.featured
        })
      }

      setSaveStatus('success')
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/admin/photos')
      }, 1500)

    } catch (err: any) {
      setError(err.message || 'Failed to save photos')
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  const selectedPhotoData = uploads.find(p => p.id === selectedPhoto)
  
  // Create dropdown options for photo categories
  const categoryOptions = photoCategories.map(category => ({
    value: category,
    label: category
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-emerald-900/80 to-slate-900/90" />
        
        {/* Floating particles */}
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -120, 0],
              opacity: [0.2, 0.7, 0.2],
              scale: [0.5, 3.5, 0.5],
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
                Upload Photos
              </h1>
              <p className="text-gray-300">
                {uploads.length} photo{uploads.length !== 1 ? 's' : ''} ready for upload
              </p>
            </div>
            
            <div className="flex gap-3">
              {saveStatus === 'success' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-500/30 text-green-300 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  Saved successfully!
                </div>
              )}

              {/* View Mode Toggle */}
              <div className="flex gap-1 bg-white/10 rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    viewMode === 'grid' ? 'bg-emerald-600/30 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    viewMode === 'list' ? 'bg-emerald-600/30 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={addNewPhoto}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 border border-white/20 transition-all duration-300"
              >
                <Upload className="w-4 h-4" />
                Add Photo
              </button>

              {uploads.length > 0 && (
                <button
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600/30 text-white rounded-full hover:bg-emerald-600/40 border border-emerald-400/50 transition-all duration-300 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : `Save All (${uploads.length})`}
                </button>
              )}
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

        {/* Empty State */}
        {uploads.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center py-20"
          >
            <Camera className="w-20 h-20 text-emerald-400/50 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-white mb-4">No Photos Added</h3>
            <p className="text-gray-400 mb-8">Start by adding your first photo to the gallery</p>
            <button
              onClick={addNewPhoto}
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600/30 text-white rounded-full hover:bg-emerald-600/40 border border-emerald-400/50 transition-all duration-300"
            >
              <Upload className="w-5 h-5" />
              Add Your First Photo
            </button>
          </motion.div>
        )}

        {/* Photo Grid/List */}
        {uploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Photos List */}
            <div className="lg:col-span-3">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {uploads.map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`bg-white/5 backdrop-blur-sm rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 ${
                        selectedPhoto === photo.id 
                          ? 'border-emerald-400/50 shadow-lg shadow-emerald-500/20' 
                          : 'border-white/10 hover:border-emerald-400/30'
                      }`}
                      onClick={() => setSelectedPhoto(photo.id)}
                    >
                      {photo.image_url ? (
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={photo.image_url}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removePhoto(photo.id)
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-600/80 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {photo.featured && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-600 text-white text-xs rounded-full">
                              Featured
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-[4/3] flex items-center justify-center bg-white/10">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-white font-medium mb-1 truncate">{photo.title || 'Untitled'}</h3>
                        <p className="text-gray-400 text-sm">{photo.category || 'Uncategorized'}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {uploads.map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`bg-white/5 backdrop-blur-sm rounded-2xl border p-4 cursor-pointer transition-all duration-300 ${
                        selectedPhoto === photo.id 
                          ? 'border-emerald-400/50' 
                          : 'border-white/10 hover:border-emerald-400/30'
                      }`}
                      onClick={() => setSelectedPhoto(photo.id)}
                    >
                      <div className="flex gap-4">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          {photo.image_url ? (
                            <img
                              src={photo.image_url}
                              alt={photo.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-white/10 flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-1">{photo.title || 'Untitled'}</h3>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>{photo.category || 'Uncategorized'}</span>
                            {photo.featured && <span className="text-emerald-400">Featured</span>}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removePhoto(photo.id)
                          }}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Edit Panel */}
            <div className="lg:col-span-1">
              {selectedPhotoData ? (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sticky top-6"
                >
                  <h3 className="text-white font-medium mb-6">Edit Photo Details</h3>
                  
                  <div className="space-y-4">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Photo</label>
                      <ImageUpload
                        currentImage={selectedPhotoData.image_url}
                        onUploadComplete={(url) => updatePhoto(selectedPhotoData.id, { image_url: url })}
                        onRemove={() => updatePhoto(selectedPhotoData.id, { image_url: '' })}
                        folder="photos"
                        className="aspect-[4/3]"
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={selectedPhotoData.title}
                        onChange={(e) => updatePhoto(selectedPhotoData.id, { title: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400/50 text-sm"
                        placeholder="Photo title"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={selectedPhotoData.description}
                        onChange={(e) => updatePhoto(selectedPhotoData.id, { description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400/50 text-sm resize-none"
                        placeholder="Photo description"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Category</label>
                      <CustomDropdown
                        options={categoryOptions}
                        value={selectedPhotoData.category}
                        onChange={(value) => updatePhoto(selectedPhotoData.id, { category: value })}
                        placeholder="Select category"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={selectedPhotoData.location}
                        onChange={(e) => updatePhoto(selectedPhotoData.id, { location: e.target.value })}
                        placeholder="City, Country"
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400/50 text-sm"
                      />
                    </div>

                    {/* Camera & Settings */}
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          <Camera className="w-4 h-4 inline mr-1" />
                          Camera
                        </label>
                        <input
                          type="text"
                          value={selectedPhotoData.camera}
                          onChange={(e) => updatePhoto(selectedPhotoData.id, { camera: e.target.value })}
                          placeholder="e.g., Canon EOS R5"
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400/50 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          <Settings className="w-4 h-4 inline mr-1" />
                          Settings
                        </label>
                        <input
                          type="text"
                          value={selectedPhotoData.settings}
                          onChange={(e) => updatePhoto(selectedPhotoData.id, { settings: e.target.value })}
                          placeholder="f/2.8, 1/125s, ISO 100"
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400/50 text-sm"
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Tags</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Add tag..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const target = e.target as HTMLInputElement
                              addTag(selectedPhotoData.id, target.value)
                              target.value = ''
                            }
                          }}
                          className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400/50 text-sm"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPhotoData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-600/20 text-emerald-300 text-xs rounded-full border border-emerald-500/30"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(selectedPhotoData.id, tag)}
                              className="hover:text-white transition-colors"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Featured */}
                    <div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedPhotoData.featured}
                          onChange={(e) => updatePhoto(selectedPhotoData.id, { featured: e.target.checked })}
                          className="w-4 h-4 text-emerald-600 bg-white/10 border-white/20 rounded focus:ring-emerald-500"
                        />
                        <span className="text-white text-sm">Featured Photo</span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select a photo to edit details</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function PhotoUploadManager() {
  return (
    <AdminAuthGuard>
      <PhotoUploadContent />
    </AdminAuthGuard>
  )
}