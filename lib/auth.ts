// lib/auth.ts
import { createSupabaseClient } from './supabase'

export type User = {
  id: string
  email: string
  created_at: string
}

export const auth = {
  // Get Supabase client
  getClient() {
    return createSupabaseClient()
  },

  // Sign up new user
  async signUp(email: string, password: string) {
    const supabase = this.getClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  // Sign in user
  async signIn(email: string, password: string) {
    const supabase = this.getClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  // Sign out user
  async signOut() {
    const supabase = this.getClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser() {
    const supabase = this.getClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Listen to auth changes
  onAuthStateChange(callback: (user: User | null) => void) {
    const supabase = this.getClient()
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user as User | null)
    })
  },

  // Check if user is authenticated
  async isAuthenticated() {
    const user = await this.getCurrentUser()
    return !!user
  }
}