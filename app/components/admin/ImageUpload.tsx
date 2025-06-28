// app/components/admin/ImageUpload.tsx
'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { createSupabaseClient } from '../../../lib/supabase'

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  onRemove?: () => void
  currentImage?: string
  folder?: string // e.g., 'blog', 'artwork', 'photos'
  accept?: string
  maxSize?: number // in MB
  className?: string
}

export default function ImageUpload({
  onUploadComplete,
  onRemove,
  currentImage,
  folder = 'uploads',
  accept = 'image/*',
  maxSize = 5,
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)
      setError('')

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`File size must be less than ${maxSize}MB`)
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file')
      }

      const supabase = createSupabaseClient()
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      onUploadComplete(publicUrl)

    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (file: File) => {
    uploadImage(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

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
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove()
    }
  }

  if (currentImage) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative aspect-video rounded-lg overflow-hidden border border-white/20">
          <img
            src={currentImage}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors mr-2"
              title="Change Image"
            >
              <Upload className="w-5 h-5" />
            </button>
            {onRemove && (
              <button
                onClick={handleRemove}
                className="p-2 bg-red-600/80 backdrop-blur-sm rounded-lg text-white hover:bg-red-600 transition-colors"
                title="Remove Image"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
        />

        {uploading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="flex items-center gap-2 text-white">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Uploading...
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-blue-400/70 bg-blue-400/10' 
            : uploading
            ? 'border-blue-400/50 bg-blue-400/5'
            : 'border-white/20 hover:border-blue-400/50 hover:bg-white/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        {uploading ? (
          <div className="space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-2 border-blue-400 border-t-transparent rounded-full mx-auto"
            />
            <p className="text-blue-400">Uploading image...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-white font-medium mb-1">
                Drop image here or click to browse
              </p>
              <p className="text-gray-400 text-sm">
                Supports JPG, PNG, WebP up to {maxSize}MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/30 text-white rounded-lg hover:bg-blue-600/40 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Choose File
            </button>
          </div>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </motion.div>
      )}
    </div>
  )
}