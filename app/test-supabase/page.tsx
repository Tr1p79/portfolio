// app/test-supabase/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '../../lib/supabase'
import { blogAPI, contactAPI } from '../../lib/database'

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [user, setUser] = useState<any>(null)
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [error, setError] = useState<string>('')
  const [envStatus, setEnvStatus] = useState<{url: boolean, key: boolean}>({ url: false, key: false })

  useEffect(() => {
    // First check environment variables
    checkEnvironmentVariables()
    // Then test connection
    testConnection()
  }, [])

  const checkEnvironmentVariables = () => {
    const url = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    setEnvStatus({ url, key })
    
    if (!url || !key) {
      setConnectionStatus('error')
      setError(`Missing environment variables: ${!url ? 'NEXT_PUBLIC_SUPABASE_URL ' : ''}${!key ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : ''}`)
      return false
    }
    return true
  }

  const testConnection = async () => {
    try {
      // Check env vars first
      if (!checkEnvironmentVariables()) {
        return
      }

      const supabase = createSupabaseClient()

      // Test 1: Check Supabase connection
      const { data, error: connectionError } = await supabase
        .from('blog_categories')
        .select('*')
        .limit(1)

      if (connectionError) throw connectionError

      // Test 2: Get current user (should be null since not logged in)
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      setUser(user)

      // Test 3: Try to fetch blog posts
      const posts = await blogAPI.getPublishedPosts()
      setBlogPosts(posts)

      setConnectionStatus('success')
    } catch (err: any) {
      setError(err.message)
      setConnectionStatus('error')
    }
  }

  const testContactForm = async () => {
    try {
      await contactAPI.submitContact({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Submission',
        message: 'This is a test contact form submission.',
        budget: '1k-5k',
        timeline: '1-month'
      })
      alert('Contact form test successful!')
    } catch (err: any) {
      alert('Contact form test failed: ' + err.message)
    }
  }

  const testLogin = async () => {
    const email = prompt('Enter admin email:')
    const password = prompt('Enter admin password:')
    
    if (!email || !password) return

    try {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      
      setUser(data.user)
      alert('Login successful!')
    } catch (err: any) {
      alert('Login failed: ' + err.message)
    }
  }

  const testLogout = async () => {
    try {
      const supabase = createSupabaseClient()
      await supabase.auth.signOut()
      setUser(null)
      alert('Logout successful!')
    } catch (err: any) {
      alert('Logout failed: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🧪 Supabase Connection Test</h1>

        {/* Environment Variables Check */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <div className={`p-3 rounded ${envStatus.url ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
              {envStatus.url ? '✅' : '❌'} NEXT_PUBLIC_SUPABASE_URL
              {envStatus.url && <span className="text-xs block mt-1">{process.env.NEXT_PUBLIC_SUPABASE_URL}</span>}
            </div>
            <div className={`p-3 rounded ${envStatus.key ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
              {envStatus.key ? '✅' : '❌'} NEXT_PUBLIC_SUPABASE_ANON_KEY
              {envStatus.key && <span className="text-xs block mt-1">{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30)}...</span>}
            </div>
          </div>
          
          {(!envStatus.url || !envStatus.key) && (
            <div className="mt-4 p-4 bg-yellow-900 text-yellow-200 rounded">
              <strong>⚠️ Environment variables missing!</strong>
              <ol className="list-decimal list-inside mt-2 text-sm">
                <li>Check that .env.local is in your project root</li>
                <li>Restart your dev server: <code>npm run dev</code></li>
                <li>Make sure variable names are exact (case-sensitive)</li>
              </ol>
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Connection Status</h2>
          <div className={`p-4 rounded ${
            connectionStatus === 'success' ? 'bg-green-900 text-green-200' :
            connectionStatus === 'error' ? 'bg-red-900 text-red-200' :
            'bg-yellow-900 text-yellow-200'
          }`}>
            {connectionStatus === 'testing' && '🔄 Testing connection...'}
            {connectionStatus === 'success' && '✅ Connected to Supabase successfully!'}
            {connectionStatus === 'error' && `❌ Connection failed: ${error}`}
          </div>
        </div>

        {/* User Status */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Authentication Status</h2>
          <p className="mb-4">
            {user ? `✅ Logged in as: ${user.email}` : '❌ Not logged in'}
          </p>
          <div className="flex gap-4">
            {!user ? (
              <button
                onClick={testLogin}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                Test Login
              </button>
            ) : (
              <button
                onClick={testLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
              >
                Test Logout
              </button>
            )}
          </div>
        </div>

        {/* Database Test */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Database Test</h2>
          <p className="mb-4">Blog posts found: {blogPosts.length}</p>
          <button
            onClick={testContactForm}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
          >
            Test Contact Form
          </button>
        </div>

        {/* Next Steps */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">✅ Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>If connection is successful, you can delete this test page</li>
            <li>Update your existing admin pages to use real Supabase data</li>
            <li>Connect your contact form to save to database</li>
            <li>Add authentication protection to admin routes</li>
          </ol>
        </div>
      </div>
    </div>
  )
}