// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Get environment variables with validation
function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }

  return { supabaseUrl, supabaseAnonKey }
}

// Client-side Supabase client factory
export function createSupabaseClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Default client for immediate use (with error handling)
let _supabase: SupabaseClient | null = null

export function getSupabaseClient() {
  if (!_supabase) {
    try {
      _supabase = createSupabaseClient()
    } catch (error) {
      console.error('Failed to create Supabase client:', error)
      throw error
    }
  }
  return _supabase
}

// Legacy export for compatibility
export const supabase = getSupabaseClient()

// Server-side admin client
export function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Only create admin client when needed (server-side)
let supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    supabaseAdmin = createSupabaseAdmin()
  }
  return supabaseAdmin
}