// app/components/layout/Navbar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Work', href: '/work', submenu: [
      { name: '3D Art', href: '/work/3d' },
      { name: '2D Art', href: '/work/2d' },
      { name: 'Photography', href: '/work/photography' },
    ]},
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">YN</span>
                </div>
                <span className="text-xl font-light text-white transition-colors group-hover:text-gray-200">
                  Your Name
                </span>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    className="relative px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 rounded-full hover:bg-white/10"
                  >
                    {link.name}
                    
                    {/* Magical hover effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      layoutId="navbar-hover"
                    />
                  </Link>
                  
                  {/* Submenu for Work */}
                  {link.submenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden"
                    >
                      {link.submenu.map((sublink, index) => (
                        <Link
                          key={sublink.name}
                          href={sublink.href}
                          className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                        >
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {sublink.name}
                          </motion.div>
                        </Link>
                      ))}
                    </motion.div>
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
              className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
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
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-2 pt-2 pb-6 space-y-1 bg-slate-800/50 backdrop-blur-xl rounded-2xl mt-4 border border-white/10">
            {navLinks.map((link, index) => (
              <div key={link.name}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-xl"
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
                
                {/* Mobile Submenu */}
                {link.submenu && (
                  <div className="ml-4 space-y-1">
                    {link.submenu.map((sublink, subIndex) => (
                      <Link
                        key={sublink.name}
                        href={sublink.href}
                        className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index + subIndex + 1) * 0.1 }}
                        >
                          {sublink.name}
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Magical glow effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    </motion.nav>
  )
}