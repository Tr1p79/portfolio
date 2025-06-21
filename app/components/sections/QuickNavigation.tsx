'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Cuboid, //Cube?
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
    gradient: 'from-blue-500 to-cyan-500',
    delay: 0.1
  },
  {
    title: '2D Art',
    description: 'Digital paintings and illustrations',
    href: '/work/2d',
    icon: <Palette className="w-6 h-6" />,
    gradient: 'from-purple-500 to-pink-500',
    delay: 0.2
  },
  {
    title: 'Photography',
    description: 'Capturing moments and perspectives',
    href: '/work/photography',
    icon: <Camera className="w-6 h-6" />,
    gradient: 'from-green-500 to-emerald-500',
    delay: 0.3
  },
  {
    title: 'About Me',
    description: 'Learn about my journey and experience',
    href: '/about',
    icon: <User className="w-6 h-6" />,
    gradient: 'from-orange-500 to-red-500',
    delay: 0.4
  },
  {
    title: 'Blog',
    description: 'Thoughts on art, design, and creativity',
    href: '/blog',
    icon: <BookOpen className="w-6 h-6" />,
    gradient: 'from-indigo-500 to-purple-500',
    delay: 0.5
  },
  {
    title: 'Contact',
    description: 'Let\'s collaborate on something amazing',
    href: '/contact',
    icon: <Mail className="w-6 h-6" />,
    gradient: 'from-gray-600 to-gray-800',
    delay: 0.6
  }
]

export default function QuickNavigation() {
  return (
    <section className="relative py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/50" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            Explore My World
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Navigate through different aspects of my creative journey
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
                <div className="relative h-full p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      {item.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                        {item.title}
                      </h3>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom border accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
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
          <p className="text-gray-500 text-sm">
            Each section tells a part of my creative story. Start wherever feels right.
          </p>
        </motion.div>
      </div>
    </section>
  )
}