// app/components/layout/Navbar.tsx - Improved to match portfolio design
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isWorkOpen, setIsWorkOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
    setIsWorkOpen(false)
  }, [pathname])

  // Improved hover handlers with delay
  const handleWorkMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsWorkOpen(true)
  }

  const handleWorkMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsWorkOpen(false)
    }, 150)
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { 
      name: 'Work', 
      href: '/work', 
      submenu: [
        { name: '3D Art', href: '/work/3d', description: 'Digital sculptures & models', color: 'from-purple-500 to-purple-600' },
        { name: '2D Art', href: '/work/2d', description: 'Paintings & illustrations', color: 'from-pink-500 to-pink-600' },
        { name: 'Photography', href: '/work/photography', description: 'Captured moments', color: 'from-emerald-500 to-emerald-600' },
      ]
    },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActivePath = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const isWorkActive = navLinks.find(link => link.name === 'Work')?.submenu?.some(sub => 
    pathname.startsWith(sub.href)
  )

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-purple-500/5' 
          : 'bg-slate-900/80 backdrop-blur-xl border-b border-white/5'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo with magical effects */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="group relative">
              <div className="flex items-center gap-3">
                {/* Logo container with glassmorphism */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
                    <span className="text-white font-bold text-lg">YN</span>
                  </div>
                  {/* Magical glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-indigo-600/30 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 -z-10 opacity-0 group-hover:opacity-100" />
                  {/* Sparkle effect */}
                  <motion.div
                    className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </motion.div>
                </div>
                
                {/* Brand name */}
                <div className="hidden sm:block">
                  <span className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-white transition-all duration-300">
                    Your Portfolio
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full p-2 border border-white/10">
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                  {link.submenu ? (
                    // Work dropdown with enhanced design
                    <div
                      className="relative"
                      onMouseEnter={handleWorkMouseEnter}
                      onMouseLeave={handleWorkMouseLeave}
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                          isWorkActive || isWorkOpen
                            ? 'text-white bg-white/15 shadow-lg shadow-purple-500/20 border border-purple-400/30'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {link.name}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                          isWorkOpen ? 'rotate-180' : ''
                        }`} />
                        
                        {/* Active indicator with magical glow */}
                        {(isWorkActive || isWorkOpen) && (
                          <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.button>

                      {/* Enhanced dropdown menu */}
                      <AnimatePresence>
                        {isWorkOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full left-0 mt-2 w-80"
                            onMouseEnter={handleWorkMouseEnter}
                            onMouseLeave={handleWorkMouseLeave}
                          >
                            {/* Invisible bridge */}
                            <div className="h-2 w-full" />
                            
                            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/20 overflow-hidden">
                              <div className="p-3">
                                {link.submenu.map((sublink, index) => (
                                  <motion.div
                                    key={sublink.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                  >
                                    <Link
                                      href={sublink.href}
                                      className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                                        isActivePath(sublink.href)
                                          ? 'bg-white/15 text-white shadow-lg'
                                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                                      }`}
                                    >
                                      {/* Category color indicator */}
                                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${sublink.color} shadow-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
                                      
                                      <div className="flex-1">
                                        <div className="font-medium mb-1 group-hover:text-white transition-colors duration-300">
                                          {sublink.name}
                                        </div>
                                        <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                          {sublink.description}
                                        </div>
                                      </div>
                                      
                                      {/* Hover arrow */}
                                      <motion.div
                                        className="text-gray-500 group-hover:text-purple-400 opacity-0 group-hover:opacity-100"
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                      >
                                        →
                                      </motion.div>
                                      
                                      {/* Magical hover glow */}
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                                    </Link>
                                  </motion.div>
                                ))}
                              </div>
                              
                              {/* Bottom glow effect */}
                              <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    // Regular nav links with enhanced styling
                    <Link
                      href={link.href}
                      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full flex items-center group ${
                        isActivePath(link.href)
                          ? 'text-white bg-white/15 shadow-lg shadow-purple-500/20 border border-purple-400/30'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.name}
                      
                      {/* Active indicator with layout animation */}
                      {isActivePath(link.href) && (
                        <motion.div
                          layoutId="navbar-active"
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      {/* Hover sparkle effect */}
                      <motion.div
                        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="w-1 h-1 bg-purple-400 rounded-full" />
                      </motion.div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button with enhanced styling */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-3 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/10 border border-white/10"
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
              
              {/* Mobile button glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 py-6 space-y-3 bg-slate-800/90 backdrop-blur-xl rounded-2xl mt-4 border border-white/10 mx-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    {link.submenu ? (
                      <div>
                        <button
                          onClick={() => setIsWorkOpen(!isWorkOpen)}
                          className={`w-full flex items-center justify-between p-4 text-left transition-colors rounded-xl ${
                            isWorkActive
                              ? 'text-white bg-white/15 shadow-lg'
                              : 'text-gray-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span className="font-medium">{link.name}</span>
                          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                            isWorkOpen ? 'rotate-180' : ''
                          }`} />
                        </button>
                        
                        <AnimatePresence>
                          {isWorkOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="ml-4 mt-3 space-y-2 overflow-hidden"
                            >
                              {link.submenu.map((sublink, subIndex) => (
                                <motion.div
                                  key={sublink.name}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: subIndex * 0.05 }}
                                >
                                  <Link
                                    href={sublink.href}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                      isActivePath(sublink.href)
                                        ? 'text-white bg-white/15'
                                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                  >
                                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${sublink.color}`} />
                                    <span>{sublink.name}</span>
                                  </Link>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className={`block p-4 rounded-xl transition-colors font-medium ${
                          isActivePath(link.href)
                            ? 'text-white bg-white/15 shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}