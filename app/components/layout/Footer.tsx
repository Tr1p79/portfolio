// app/components/layout/Footer.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Github, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Heart,
  ArrowUp,
  Palette,
  Camera,
  Cuboid
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    work: [
      { name: '3D Art', href: '/work/3d', icon: Cuboid },
      { name: '2D Art', href: '/work/2d', icon: Palette },
      { name: 'Photography', href: '/work/photography', icon: Camera },
    ],
    connect: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
    ],
    social: [
      { name: 'GitHub', href: '#', icon: Github },
      { name: 'Twitter', href: '#', icon: Twitter },
      { name: 'Instagram', href: '#', icon: Instagram },
      { name: 'LinkedIn', href: '#', icon: Linkedin },
    ]
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900 border-t border-white/10">
      {/* Magical glow effect at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">YN</span>
                </div>
                <h3 className="text-2xl font-light text-white">Your Name</h3>
              </div>
              
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                Digital artist and creative professional specializing in 3D modeling, 
                digital painting, and visual storytelling. Creating immersive experiences 
                through art and technology.
              </p>

              {/* Social links */}
              <div className="flex items-center gap-4">
                {footerLinks.social.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-purple-400/30 transition-all duration-300"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Work links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-medium mb-6">Portfolio</h4>
              <ul className="space-y-4">
                {footerLinks.work.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      <link.icon className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Connect links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-medium mb-6">Connect</h4>
              <ul className="space-y-4">
                {footerLinks.connect.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Contact info */}
              <div className="mt-8">
                <h5 className="text-white font-medium mb-3">Get in Touch</h5>
                <a
                  href="mailto:hello@yourname.com"
                  className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                  hello@yourname.com
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-6 py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-gray-400 text-sm"
            >
              <span>© {currentYear} Your Name. Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>and lots of</span>
              <span className="text-purple-400">✨ magic</span>
            </motion.div>

            {/* Back to top button */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-purple-400/30 transition-all duration-300"
            >
              <span className="text-sm">Back to top</span>
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}