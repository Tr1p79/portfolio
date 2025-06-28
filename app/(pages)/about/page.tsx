// app/(pages)/about/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { ArrowLeft, Download, Mail, MapPin, Calendar, Award, ExternalLink, Briefcase, GraduationCap, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Skill {
  name: string
  level: number
  category: string
  icon: string
}

interface Experience {
  id: string
  title: string
  company: string
  period: string
  description: string
  skills: string[]
  type: 'work' | 'education' | 'award'
}

// Skills data
const skills: Skill[] = [
  { name: '3D Modeling', level: 95, category: '3D', icon: '🎭' },
  { name: 'Blender', level: 90, category: '3D', icon: '🔷' },
  { name: 'Maya', level: 85, category: '3D', icon: '🔸' },
  { name: 'Digital Painting', level: 92, category: '2D', icon: '🎨' },
  { name: 'Photoshop', level: 95, category: '2D', icon: '📸' },
  { name: 'Illustrator', level: 88, category: '2D', icon: '✏️' },
  { name: 'Photography', level: 87, category: 'Photo', icon: '📷' },
  { name: 'Lightroom', level: 90, category: 'Photo', icon: '💡' },
  { name: 'Video Editing', level: 83, category: 'Video', icon: '🎬' },
  { name: 'After Effects', level: 80, category: 'Video', icon: '✨' },
]

// Experience data
const experiences: Experience[] = [
  {
    id: '1',
    title: 'Senior 3D Artist',
    company: 'Creative Studios Inc.',
    period: '2022 - Present',
    description: 'Leading 3D asset creation for AAA gaming projects. Responsible for character modeling, environment design, and technical art pipeline optimization.',
    skills: ['Blender', '3D Modeling', 'Texturing', 'Pipeline Development'],
    type: 'work'
  },
  {
    id: '2',
    title: 'Digital Artist',
    company: 'Freelance',
    period: '2020 - 2022',
    description: 'Provided digital art services for various clients including concept art, illustrations, and 3D visualizations for marketing and entertainment.',
    skills: ['Digital Painting', 'Concept Art', 'Client Relations', 'Project Management'],
    type: 'work'
  },
  {
    id: '3',
    title: 'Bachelor of Fine Arts',
    company: 'Art Institute of Design',
    period: '2016 - 2020',
    description: 'Specialized in Digital Media and 3D Art. Graduated Magna Cum Laude with focus on contemporary digital art practices.',
    skills: ['Art History', 'Traditional Art', 'Digital Fundamentals', 'Portfolio Development'],
    type: 'education'
  },
  {
    id: '4',
    title: 'Best Digital Art Portfolio',
    company: 'International Digital Art Awards',
    period: '2023',
    description: 'Recognized for outstanding portfolio demonstrating technical excellence and creative innovation in digital art.',
    skills: ['Portfolio Curation', 'Digital Art Excellence'],
    type: 'award'
  },
  {
    id: '5',
    title: '3D Visualization Specialist',
    company: 'Architectural Firm XYZ',
    period: '2019 - 2020',
    description: 'Created photorealistic 3D renderings and architectural visualizations for residential and commercial projects.',
    skills: ['Architectural Visualization', '3D Rendering', 'Client Presentation'],
    type: 'work'
  }
]

export default function AboutPage() {
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>('All')
  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'awards'>('experience')

  // Get unique skill categories
  const skillCategories = ['All', ...Array.from(new Set(skills.map(skill => skill.category)))]

  // Filter skills
  const filteredSkills = activeSkillCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === activeSkillCategory)

  // Filter experiences by type
  const getExperiencesByType = (type: string) => {
    switch (type) {
      case 'education':
        return experiences.filter(exp => exp.type === 'education')
      case 'awards':
        return experiences.filter(exp => exp.type === 'award')
      default:
        return experiences.filter(exp => exp.type === 'work')
    }
  }

  // Memoize floating particles
  const floatingParticles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 12 + Math.random() * 8,
      delay: Math.random() * 5,
    }))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-orange-900/80 to-slate-900/90" />
        
        {/* Floating particles */}
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 2, 0.5],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-6 pb-12">
      <div className="mt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight">
            About Me
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Passionate digital artist with a love for creating immersive experiences through 3D art, design, and storytelling.
          </p>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
        >
          {/* Profile Image */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              {/* Magical glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-3xl blur-2xl" />
              
              {/* Image container */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden p-6">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/about/profile-full.jpg"
                    alt="Your Name"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bio Content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-3xl font-medium text-white mb-6">Hello, I'm [Your Name]</h2>
              
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  I'm a digital artist and creative professional with over 5 years of experience in 3D modeling, 
                  digital painting, and visual storytelling. My journey began with traditional art, but I quickly 
                  fell in love with the limitless possibilities of digital creation.
                </p>
                
                <p>
                  My work spans across various industries including gaming, architecture, and entertainment. 
                  I specialize in creating compelling visual narratives that bridge the gap between imagination 
                  and reality, using cutting-edge tools and techniques.
                </p>
                
                <p>
                  When I'm not creating art, you can find me exploring new technologies, hiking in nature for 
                  inspiration, or sharing knowledge with the creative community through workshops and tutorials.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">5+</div>
                  <div className="text-gray-400 text-sm">Years Experience</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">100+</div>
                  <div className="text-gray-400 text-sm">Projects Completed</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">50k+</div>
                  <div className="text-gray-400 text-sm">Social Followers</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">15+</div>
                  <div className="text-gray-400 text-sm">Awards Won</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>New York, USA</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4 text-orange-400" />
                  <span>hello@yourname.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <span>Available for projects</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full hover:from-orange-500 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
                
                <Link
                  href="/contact"
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 border border-white/20 transition-all duration-300"
                >
                  <Mail className="w-4 h-4" />
                  Get In Touch
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-medium text-white mb-8">Skills & Expertise</h2>
          
          {/* Skill Categories */}
          <div className="flex flex-wrap gap-3 mb-8">
            {skillCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveSkillCategory(category)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  activeSkillCategory === category
                    ? 'bg-orange-600/30 border border-orange-400/50 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 group hover:border-orange-400/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{skill.icon}</span>
                  <div>
                    <h3 className="text-white font-medium">{skill.name}</h3>
                    <span className="text-gray-400 text-sm">{skill.category}</span>
                  </div>
                </div>
                
                {/* Skill Level Bar */}
                <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                  <motion.div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  />
                </div>
                <div className="text-right text-sm text-gray-400">{skill.level}%</div>

                {/* Sparkle effect */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {[...Array(2)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-orange-400 rounded-full"
                      style={{
                        left: `${i * 8}px`,
                        top: `${i * 6}px`,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.3,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-medium text-white mb-8">Experience & Background</h2>
          
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8">
            {[
              { key: 'experience', label: 'Work Experience', icon: Briefcase },
              { key: 'education', label: 'Education', icon: GraduationCap },
              { key: 'awards', label: 'Awards', icon: Award }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  activeTab === key
                    ? 'bg-orange-600/30 border border-orange-400/50 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Experience Timeline */}
          <div className="space-y-6">
            {getExperiencesByType(activeTab).map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-orange-400/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-medium text-white">{experience.title}</h3>
                      <span className="text-orange-400 text-sm font-medium">{experience.period}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {experience.type === 'work' && <Briefcase className="w-4 h-4 text-orange-400" />}
                      {experience.type === 'education' && <GraduationCap className="w-4 h-4 text-orange-400" />}
                      {experience.type === 'award' && <Award className="w-4 h-4 text-orange-400" />}
                      <span className="text-gray-300">{experience.company}</span>
                    </div>
                    
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      {experience.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {experience.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-orange-600/20 text-orange-300 text-sm rounded-full border border-orange-500/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-12"
        >
          <h3 className="text-3xl font-medium text-white mb-4">Let's Create Something Amazing</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            I'm always interested in new projects and collaborations. Whether you have a specific vision 
            or just want to explore possibilities, I'd love to hear from you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full hover:from-orange-500 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Mail className="w-5 h-5" />
              Start a Conversation
            </Link>
            
            <Link
              href="/work"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-full hover:bg-white/20 border border-white/20 transition-all duration-300"
            >
              <ExternalLink className="w-5 h-5" />
              View My Work
            </Link>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  )
}