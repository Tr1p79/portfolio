// app/components/layout/Navbar.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
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
    // Add a small delay before closing to make it less sensitive
    timeoutRef.current = setTimeout(() => {
      setIsWorkOpen(false)
    }, 150) // 150ms delay
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
        { name: '3D Art', href: '/work/3d', description: 'Digital sculptures & models' },
        { name: '2D Art', href: '/work/2d', description: 'Paintings & illustrations' },
        { name: 'Photography', href: '/work/photography', description: 'Captured moments' },
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
      className={`fixed top-0 w-full z-50 h-20 ... ${
        scrolled 
          ? 'bg-slate-900/90 backdrop-blur-xl border-b border-white/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <span className="text-white font-bold text-sm">YN</span>
                  </div>
                  {/* Magical glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 -z-10" />
                </div>
                <span className="text-xl font-light text-white transition-colors group-hover:text-gray-200 hidden sm:block">
                  Your Name
                </span>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.submenu ? (
                    // Work dropdown with improved hover handling
                    <div
                      className="relative"
                      onMouseEnter={handleWorkMouseEnter}
                      onMouseLeave={handleWorkMouseLeave}
                    >
                      <button
                        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                          isWorkActive || isActivePath(link.href)
                            ? 'text-white bg-white/10 shadow-lg shadow-purple-500/20'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {link.name}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isWorkOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Dropdown Menu with extended hover area */}
                      <AnimatePresence>
                        {isWorkOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 mt-1 w-64"
                            onMouseEnter={handleWorkMouseEnter}
                            onMouseLeave={handleWorkMouseLeave}
                          >
                            {/* Invisible bridge to prevent gap issues */}
                            <div className="h-2 w-full" />
                            
                            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/20 overflow-hidden">
                              {link.submenu.map((sublink, index) => (
                                <Link
                                  key={sublink.name}
                                  href={sublink.href}
                                  className={`block p-4 transition-all duration-200 ${
                                    isActivePath(sublink.href)
                                      ? 'bg-white/10 text-white'
                                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                                  } ${index === 0 ? 'rounded-t-2xl' : ''} ${index === link.submenu!.length - 1 ? 'rounded-b-2xl' : ''}`}
                                  onClick={() => {
                                    setIsWorkOpen(false)
                                    if (timeoutRef.current) {
                                      clearTimeout(timeoutRef.current)
                                    }
                                  }}
                                >
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                  >
                                    <div className="font-medium mb-1">{sublink.name}</div>
                                    <div className="text-xs text-gray-400">{sublink.description}</div>
                                  </motion.div>
                                </Link>
                              ))}
                              
                              {/* Magical glow effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    // Regular links
                    <Link
                      href={link.href}
                      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                        isActivePath(link.href)
                          ? 'text-white bg-white/10 shadow-lg shadow-purple-500/20'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.name}
                      
                      {/* Active indicator */}
                      {isActivePath(link.href) && (
                        <motion.div
                          layoutId="navbar-active"
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/10"
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-6 space-y-1 bg-slate-800/80 backdrop-blur-xl rounded-2xl mt-4 border border-white/10">
                {navLinks.map((link, index) => (
                  <div key={link.name}>
                    {link.submenu ? (
                      // Mobile Work section
                      <div>
                        <button
                          onClick={() => setIsWorkOpen(!isWorkOpen)}
                          className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors rounded-xl ${
                            isWorkActive ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {link.name}
                          </motion.div>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isWorkOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {isWorkOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-4 mt-1 space-y-1 overflow-hidden"
                            >
                              {link.submenu.map((sublink, subIndex) => (
                                <Link
                                  key={sublink.name}
                                  href={sublink.href}
                                  className={`block px-4 py-2 text-sm transition-colors rounded-lg ${
                                    isActivePath(sublink.href)
                                      ? 'text-white bg-white/10'
                                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                                  }`}
                                  onClick={() => setIsOpen(false)}
                                >
                                  <motion.div
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: subIndex * 0.1 }}
                                  >
                                    {sublink.name}
                                  </motion.div>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      // Mobile regular links
                      <Link
                        href={link.href}
                        className={`block px-4 py-3 transition-colors rounded-xl ${
                          isActivePath(link.href)
                            ? 'text-white bg-white/10'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {link.name}
                        </motion.div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom magical glow */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </motion.nav>
  )
}