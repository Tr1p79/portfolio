'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Cuboid, 
  Palette, 
  Camera, 
  User, 
  BookOpen, 
  Mail,
  ArrowRight 
} from 'lucide-react'

interface NavigationItem {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  gradient: string
  delay: number
}

const navigationItems: NavigationItem[] = [
  {
    title: '3D Work',
    description: 'Explore my 3D models and digital sculptures',
    href: '/work/3d',
    icon: <Cuboid className="w-6 h-6" />,
    gradient: 'from-blue-500 to-cyan-400',
    delay: 0.1
  },
  {
    title: '2D Art',
    description: 'Digital paintings and illustrations',
    href: '/work/2d',
    icon: <Palette className="w-6 h-6" />,
    gradient: 'from-purple-500 to-pink-400',
    delay: 0.2
  },
  {
    title: 'Photography',
    description: 'Capturing moments and perspectives',
    href: '/work/photography',
    icon: <Camera className="w-6 h-6" />,
    gradient: 'from-emerald-500 to-teal-400',
    delay: 0.3
  },
  {
    title: 'About Me',
    description: 'Learn about my journey and experience',
    href: '/about',
    icon: <User className="w-6 h-6" />,
    gradient: 'from-orange-500 to-red-400',
    delay: 0.4
  },
  {
    title: 'Blog',
    description: 'Thoughts on art, design, and creativity',
    href: '/blog',
    icon: <BookOpen className="w-6 h-6" />,
    gradient: 'from-indigo-500 to-purple-400',
    delay: 0.5
  },
  {
    title: 'Contact',
    description: 'Let\'s collaborate on something amazing',
    href: '/contact',
    icon: <Mail className="w-6 h-6" />,
    gradient: 'from-slate-500 to-gray-400',
    delay: 0.6
  }
]

export default function QuickNavigation() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Dark background with subtle patterns */}
      <div className="absolute inset-0">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            Explore My Universe
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Navigate through different dimensions of my creative journey
          </p>
        </motion.div>

        {/* Navigation grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: item.delay,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
            >
              <Link 
                href={item.href}
                className="group block"
              >
                <div className="relative h-full p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl hover:shadow-purple-500/20 hover:border-white/20 transition-all duration-500 overflow-hidden">
                  {/* Magical glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      {item.icon}
                    </div>
                    
                    {/* Icon glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`} />
                  </div>

                  {/* Content */}
                  <div className="relative space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-medium text-white group-hover:text-gray-100 transition-colors">
                        {item.title}
                      </h3>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom border accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                  
                  {/* Sparkle effects on hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: `${i * 8}px`,
                          top: `${i * 6}px`,
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.2,
                          repeat: Infinity,
                          repeatDelay: 1
                        }}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 text-sm">
            Each portal leads to a different realm of creativity. Choose your path.
          </p>
        </motion.div>
      </div>
    </section>
  )
}