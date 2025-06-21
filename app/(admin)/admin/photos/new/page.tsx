// app/(admin)/admin/photos/new/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo, useRef } from 'react'
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
  List
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface PhotoUpload {
  id: string
  file: File
  preview: string
  title: string
  description: string
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

export default function PhotoUploadManager() {
  const [uploads, setUploads] = useState<PhotoUpload[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    imageFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newUpload: PhotoUpload = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          preview: e.target?.result as string,
          title: file.name.replace(/\.[^/.]+$/, ''),
          description: '',
          category: '',
          location: '',
          camera: '',
          settings: '',
          tags: [],
          featured: false
        }
        
        setUploads(prev => [...prev, newUpload])
      }
      reader.readAsDataURL(file)
    })
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

  const handleSaveAll = () => {
    // In a real app, this would upload to your backend/cloud storage
    console.log('Uploading photos:', uploads)
    // Show success message and redirect
  }

  const selectedPhotoData = uploads.find(p => p.id === selectedPhoto)

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
              
              {uploads.length > 0 && (
                <button
                  onClick={handleSaveAll}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600/30 text-white rounded-full hover:bg-emerald-600/40 border border-emerald-400/50 transition-all duration-300"
                >
                  <Save className="w-4 h-4" />
                  Upload All ({uploads.length})
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Upload Zone */}
        {uploads.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-12"
          >
            <div
              className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-emerald-400/70 bg-emerald-400/10' 
                  : 'border-white/30 hover:border-emerald-400/50 hover:bg-white/5'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-6">
                <div className="w-20 h-20 bg-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto">
                  <Camera className="w-10 h-10 text-emerald-400" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-medium text-white mb-2">
                    Drop photos here or click to browse
                  </h3>
                  <p className="text-gray-400">
                    Support for JPG, PNG, WebP files. Multiple files supported.
                  </p>
                </div>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600/30 text-white rounded-full hover:bg-emerald-600/40 border border-emerald-400/50 transition-all duration-300"
                >
                  <Upload className="w-5 h-5" />
                  Choose Files
                </button>
              </div>
            </div>
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
              {/* Add More Button */}
              <div className="mb-6">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 border border-white/20 transition-all duration-300"
                >
                  <Upload className="w-4 h-4" />
                  Add More Photos
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

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
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={photo.preview}
                          alt={photo.title}
                          fill
                          className="object-cover"
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
                          <Image
                            src={photo.preview}
                            alt={photo.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-1">{photo.title || 'Untitled'}</h3>
                          <p className="text-gray-400 text-sm mb-2">{photo.file.name}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>{(photo.file.size / 1024 / 1024).toFixed(1)} MB</span>
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
                    {/* Title */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={selectedPhotoData.title}
                        onChange={(e) => updatePhoto(selectedPhotoData.id, { title: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400/50 text-sm"
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
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Category</label>
                      <select
                        value={selectedPhotoData.category}
                        onChange={(e) => updatePhoto(selectedPhotoData.id, { category: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-400/50 text-sm"
                      >
                        <option value="">Select category</option>
                        {photoCategories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
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

                  {/* Photo Preview */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                      <Image
                        src={selectedPhotoData.preview}
                        alt={selectedPhotoData.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>Size: {(selectedPhotoData.file.size / 1024 / 1024).toFixed(1)} MB</div>
                      <div>Type: {selectedPhotoData.file.type}</div>
                      <div>File: {selectedPhotoData.file.name}</div>
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