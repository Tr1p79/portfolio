// components/layout/Navbar.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { 
    name: 'Work', 
    href: '/work',
    submenu: [
      { name: '3D Art', href: '/work/3d', color: 'from-purple-500 to-blue-500' },
      { name: '2D Art', href: '/work/2d', color: 'from-pink-500 to-purple-500' },
      { name: 'Photography', href: '/work/photography', color: 'from-emerald-500 to-teal-500' }
    ]
  },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' }
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isWorkOpen, setIsWorkOpen] = useState(false)
  const pathname = usePathname()
  const workTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isActivePath = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const isWorkActive = navLinks
    .find(link => link.name === 'Work')
    ?.submenu?.some(sublink => isActivePath(sublink.href)) || false

  // Enhanced hover handlers with proper timing
  const handleWorkMouseEnter = () => {
    if (workTimeoutRef.current) {
      clearTimeout(workTimeoutRef.current)
    }
    setIsWorkOpen(true)
  }

  const handleWorkMouseLeave = () => {
    workTimeoutRef.current = setTimeout(() => {
      setIsWorkOpen(false)
    }, 200) // Increased delay for better UX
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (workTimeoutRef.current) {
        clearTimeout(workTimeoutRef.current)
      }
    }
  }, [])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isOpen 
          ? 'bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-purple-500/5' 
          : 'bg-slate-900/80 backdrop-blur-xl border-b border-white/5'
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
                      </motion.button>
                      
                      {/* Dropdown Menu with extended hover area */}
                      <AnimatePresence>
                        {isWorkOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-64"
                            onMouseEnter={handleWorkMouseEnter}
                            onMouseLeave={handleWorkMouseLeave}
                          >
                            {/* Invisible bridge to prevent gap issues */}
                            <div className="absolute -top-2 left-0 right-0 h-4" />
                            
                            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/20 overflow-hidden">
                              {link.submenu.map((sublink, index) => (
                                <Link
                                  key={sublink.name}
                                  href={sublink.href}
                                  className={`group block p-4 transition-all duration-200 border-b border-white/5 last:border-b-0 ${
                                    isActivePath(sublink.href)
                                      ? 'bg-white/10 text-white'
                                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${sublink.color} group-hover:scale-110 transition-transform`} />
                                    <span className="font-medium">{sublink.name}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
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

          {/* Mobile menu button */}
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
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-white/10 overflow-hidden"
            >
              <div className="px-2 pt-4 pb-6 space-y-2">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.submenu ? (
                      <div>
                        <button
                          onClick={() => setIsWorkOpen(!isWorkOpen)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors font-medium ${
                            isWorkActive || isWorkOpen
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
                            ? 'text-white bg-white/15 shadow-lg shadow-purple-500/20 border border-purple-400/30'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}