// lib/database.ts
import { createSupabaseClient } from './supabase'

// Get client function - creates fresh client each time
function getClient() {
  return createSupabaseClient()
}

// Blog Post Types
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  category: string
  tags: string[]
  featured_image?: string
  published: boolean
  featured: boolean
  likes: number
  views: number
  read_time: number
  created_at: string
  updated_at: string
  published_at?: string
}

export interface Artwork {
  id: string
  title: string
  description?: string
  image_url: string
  thumbnail_url?: string
  category: '3d' | '2d' | 'photography'
  subcategory?: string
  year?: number
  medium?: string
  dimensions?: string
  camera?: string
  settings?: string
  location?: string
  sketchfab_id?: string
  tags: string[]
  featured: boolean
  likes: number
  views: number
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  budget?: string
  timeline?: string
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
}

// Blog Functions
export const blogAPI = {
  // Get all published blog posts
  async getPublishedPosts(): Promise<BlogPost[]> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get blog post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Get all posts (admin)
  async getAllPosts(): Promise<BlogPost[]> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create new blog post
  async createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes' | 'views'>): Promise<BlogPost> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update blog post
  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete blog post
  async deletePost(id: string): Promise<void> {
    const supabase = getClient()
    
    try {
      // 1. Get post data first to find featured image
      const allPosts = await this.getAllPosts()
      const post = allPosts.find(p => p.id === id)
      
      // 2. Delete featured image from storage if exists
      if (post?.featured_image) {
        const urlParts = post.featured_image.split('/')
        const fileName = urlParts[urlParts.length - 1]
        const folder = urlParts[urlParts.length - 2] || 'blog'
        const filePath = `${folder}/${fileName}`
        
        console.log('Deleting blog featured image:', filePath)
        
        const { error: storageError } = await supabase.storage
          .from('images')
          .remove([filePath])
        
        if (storageError) {
          console.error('Blog image deletion error:', storageError)
        }
      }
      
      // 3. Delete from database
      const { error: dbError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError
      
    } catch (error) {
      console.error('Error deleting blog post:', error)
      throw error
    }
  },

  // Increment view count
  async incrementViews(id: string): Promise<void> {
    const supabase = getClient()
    const { error } = await supabase.rpc('increment_views', { post_id: id })
    if (error) console.error('Error incrementing views:', error)
  }
}

// Artwork Functions
export const artworkAPI = {
  // Get all artworks
  async getArtworks(category?: string): Promise<Artwork[]> {
    const supabase = getClient()
    let query = supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false })

    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  },

  // Get artwork by ID
  async getArtworkById(id: string): Promise<Artwork | null> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Create new artwork
  async createArtwork(artwork: Omit<Artwork, 'id' | 'created_at' | 'updated_at' | 'likes' | 'views'>): Promise<Artwork> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from('artworks')
      .insert([artwork])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update artwork
  async updateArtwork(id: string, updates: Partial<Artwork>): Promise<Artwork> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from('artworks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete artwork
  async deleteArtwork(id: string): Promise<void> {
    const supabase = getClient()
    
    try {
      // 1. Get artwork data first to find image URL
      const artwork = await this.getArtworkById(id)
      
      // 2. Delete from storage if image exists
      if (artwork?.image_url) {
        // Extract the file path from the full URL
        // URL format: https://project.supabase.co/storage/v1/object/public/images/folder/filename.jpg
        const urlParts = artwork.image_url.split('/')
        const fileName = urlParts[urlParts.length - 1] // Get filename
        const folder = urlParts[urlParts.length - 2] // Get folder (artwork, photos, etc.)
        const filePath = `${folder}/${fileName}`
        
        console.log('Deleting file from storage:', filePath)
        
        const { error: storageError } = await supabase.storage
          .from('images')
          .remove([filePath])
        
        if (storageError) {
          console.error('Storage deletion error:', storageError)
          // Don't throw here - continue with database deletion even if storage fails
        }
      }
      
      // 3. Delete from database
      const { error: dbError } = await supabase
        .from('artworks')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError
      
      console.log('Artwork deleted successfully:', id)
      
    } catch (error) {
      console.error('Error deleting artwork:', error)
      throw error
    }
  }
}

// Contact Functions
export const contactAPI = {
  // Submit contact form
  async submitContact(submission: Omit<ContactSubmission, 'id' | 'created_at' | 'status'>): Promise<ContactSubmission> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([submission])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get all contact submissions (admin)
  async getSubmissions(): Promise<ContactSubmission[]> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Update submission status
  async updateStatus(id: string, status: ContactSubmission['status']): Promise<void> {
    const supabase = getClient()
    const { error } = await supabase
      .from('contact_submissions')
      .update({ status })
      .eq('id', id)

    if (error) throw error
  }
}

// Analytics Functions
export const analyticsAPI = {
  // Track page view
  async trackPageView(page_path: string, user_agent?: string, referrer?: string): Promise<void> {
    const supabase = getClient()
    const { error } = await supabase
      .from('page_views')
      .insert([{
        page_path,
        user_agent,
        referrer
      }])

    if (error) console.error('Error tracking page view:', error)
  },

  // Get analytics data (admin)
  async getPageViews(days: number = 30): Promise<any[]> {
    const supabase = getClient()
    const { data, error } = await supabase
      .from('page_views')
      .select('*')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}