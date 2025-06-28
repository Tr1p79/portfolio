// app/components/layout/UltimateMedievalWarfareNavbar.tsx
'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Sword, Shield, Crown, Zap, Flame } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ===== INTERFACES FOR EPIC WARFARE =====
interface Projectile {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  progress: number
  type: 'arrow' | 'trebuchet_stone' | 'fireball' | 'lightning' | 'cannonball' | 'ballista_bolt'
  trail?: Array<{x: number, y: number, opacity: number}>
  damage?: number
}

interface Warrior {
  id: number
  x: number
  y: number
  type: 'knight' | 'archer' | 'catapult' | 'wizard' | 'dragon' | 'siege_tower' | 'paladin' | 'barbarian'
  direction: 'left' | 'right'
  state: 'idle' | 'charging' | 'attacking' | 'defending' | 'casting' | 'flying'
  health: number
  animation: string
  target?: string
}

interface SiegeWeapon {
  id: number
  x: number
  y: number
  type: 'trebuchet' | 'ballista' | 'battering_ram' | 'siege_tower' | 'catapult'
  state: 'loaded' | 'firing' | 'reloading' | 'destroyed'
  rotation: number
  ammunition: number
}

interface MagicalEffect {
  id: number
  x: number
  y: number
  type: 'fireball' | 'lightning_storm' | 'meteor' | 'healing_light' | 'frost_nova' | 'dragon_breath'
  intensity: number
  duration: number
  particles: Array<{x: number, y: number, vx: number, vy: number, life: number, color: string}>
}

interface CastleDefense {
  id: number
  x: number
  y: number
  type: 'arrow_slit' | 'murder_hole' | 'boiling_oil' | 'cannon' | 'tower'
  active: boolean
  health: number
}

export default function UltimateMedievalWarfareNavbar() {
  // ===== STATE MANAGEMENT =====
  const [isOpen, setIsOpen] = useState(false)
  const [isWorkOpen, setIsWorkOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [battleMode, setBattleMode] = useState<'peace' | 'skirmish' | 'battle' | 'war' | 'apocalypse'>('peace')
  const [battleIntensity, setBattleIntensity] = useState(0)
  
  // ===== WARFARE ARRAYS =====
  const [projectiles, setProjectiles] = useState<Projectile[]>([])
  const [warriors, setWarriors] = useState<Warrior[]>([])
  const [siegeWeapons, setSiegeWeapons] = useState<SiegeWeapon[]>([])
  const [magicalEffects, setMagicalEffects] = useState<MagicalEffect[]>([])
  const [castleDefenses, setCastleDefenses] = useState<CastleDefense[]>([])
  const [explosions, setExplosions] = useState<Array<{id: number, x: number, y: number, size: number, type: string}>>([])
  
  // ===== ENVIRONMENTAL EFFECTS =====
  const [weather, setWeather] = useState<'clear' | 'storm' | 'fog' | 'rain' | 'snow'>('clear')
  const [lightning, setLightning] = useState<Array<{id: number, points: string, opacity: number}>>([])
  const [fire, setFire] = useState<Array<{id: number, x: number, y: number, intensity: number}>>([])
  
  // ===== AUDIO SYSTEM =====
  const [audioEnabled, setAudioEnabled] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const soundEffectsRef = useRef<Map<string, AudioBuffer>>(new Map())
  
  // ===== REFS =====
  const navRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const idCounterRef = useRef(0)
  
  const pathname = usePathname()

  // ===== MEMOIZED DATA =====
  const navLinks = useMemo(() => [
    { name: 'Home', href: '/', emoji: '🏰', faction: 'castle' },
    { name: 'About', href: '/about', emoji: '👑', faction: 'royal' },
    { 
      name: 'Work', 
      href: '/work', 
      emoji: '⚔️',
      faction: 'military',
      submenu: [
        { name: '3D Art', href: '/work/3d', description: 'Digital fortresses', emoji: '🗡️', spell: 'fireball' },
        { name: '2D Art', href: '/work/2d', description: 'Battle paintings', emoji: '🛡️', spell: 'lightning' },
        { name: 'Photography', href: '/work/photography', description: 'Captured conquests', emoji: '🏹', spell: 'frost' },
      ]
    },
    { name: 'Blog', href: '/blog', emoji: '📜', faction: 'scholars' },
    { name: 'Contact', href: '/contact', emoji: '🕊️', faction: 'diplomats' },
  ], [])

  // ===== AUDIO INITIALIZATION =====
  const initializeAudio = useCallback(async () => {
    if (typeof window === 'undefined') return
    
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Load sound effects (you'd replace these with actual audio files)
      const soundFiles = {
        swordClash: '/sounds/sword-clash.mp3',
        arrowFly: '/sounds/arrow-fly.mp3',
        trebuchet: '/sounds/trebuchet-fire.mp3',
        explosion: '/sounds/explosion.mp3',
        dragonRoar: '/sounds/dragon-roar.mp3',
        magic: '/sounds/magic-spell.mp3',
        battleCry: '/sounds/battle-cry.mp3'
      }
      
      // Simulate loading (replace with actual fetch + decodeAudioData)
      console.log('Audio system initialized for medieval warfare!')
      setAudioEnabled(true)
    } catch (error) {
      console.warn('Audio not available:', error)
    }
  }, [])

  // ===== EPIC ANIMATION LOOP =====
  const animationLoop = useCallback(() => {
    // Update projectiles
    setProjectiles(prev => prev.map(projectile => {
      const newProgress = projectile.progress + 0.02
      const currentX = projectile.x + (projectile.targetX - projectile.x) * newProgress
      const currentY = projectile.y + (projectile.targetY - projectile.y) * newProgress
      
      // Add trail effect
      const newTrail = [...(projectile.trail || []), {
        x: currentX,
        y: currentY,
        opacity: 1 - newProgress
      }].slice(-10)
      
      return {
        ...projectile,
        progress: newProgress,
        trail: newTrail
      }
    }).filter(p => p.progress < 1))

    // Update warriors
    setWarriors(prev => prev.map(warrior => {
      let newX = warrior.x
      
      if (warrior.state === 'charging') {
        newX += warrior.direction === 'right' ? 3 : -3
      }
      
      return {
        ...warrior,
        x: newX
      }
    }).filter(w => w.x > -100 && w.x < window.innerWidth + 100))

    // Update magical effects
    setMagicalEffects(prev => prev.map(effect => ({
      ...effect,
      duration: effect.duration - 1,
      particles: effect.particles.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 0.02
      })).filter(p => p.life > 0)
    })).filter(e => e.duration > 0))

    // Update explosions
    setExplosions(prev => prev.map(explosion => ({
      ...explosion,
      size: explosion.size + 5
    })).filter(e => e.size < 100))

    animationRef.current = requestAnimationFrame(animationLoop)
  }, [])

  // ===== SIEGE WEAPON FUNCTIONS =====
  const fireTrebuchet = useCallback((targetX: number, targetY: number) => {
    const trebuchetId = idCounterRef.current++
    
    // Add trebuchet
    setSiegeWeapons(prev => [...prev, {
      id: trebuchetId,
      x: 50,
      y: 60,
      type: 'trebuchet',
      state: 'firing',
      rotation: -45,
      ammunition: 5
    }])

    // Launch projectile with arc
    setProjectiles(prev => [...prev, {
      id: idCounterRef.current++,
      x: 50,
      y: 60,
      targetX,
      targetY: targetY - 20,
      progress: 0,
      type: 'trebuchet_stone',
      trail: [],
      damage: 50
    }])

    setBattleIntensity(prev => Math.min(prev + 20, 100))
    
    // Audio effect
    if (audioEnabled) {
      console.log('🎵 TREBUCHET FIRED!')
    }
  }, [audioEnabled])

  const fireBallistaBolt = useCallback((targetX: number, targetY: number) => {
    setProjectiles(prev => [...prev, {
      id: idCounterRef.current++,
      x: window.innerWidth - 100,
      y: 65,
      targetX,
      targetY,
      progress: 0,
      type: 'ballista_bolt',
      trail: [],
      damage: 30
    }])

    setBattleIntensity(prev => Math.min(prev + 10, 100))
  }, [])

  // ===== MAGICAL SPELL SYSTEM =====
  const castFireball = useCallback((targetX: number, targetY: number) => {
    const particles = Array.from({ length: 50 }, () => ({
      x: targetX,
      y: targetY,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1,
      color: `hsl(${Math.random() * 60}, 100%, ${50 + Math.random() * 50}%)`
    }))

    setMagicalEffects(prev => [...prev, {
      id: idCounterRef.current++,
      x: targetX,
      y: targetY,
      type: 'fireball',
      intensity: 100,
      duration: 60,
      particles
    }])

    setBattleIntensity(prev => Math.min(prev + 15, 100))
  }, [])

  const castLightningStorm = useCallback(() => {
    const bolts = Array.from({ length: 5 }, () => {
      const startX = Math.random() * window.innerWidth
      const segments = Array.from({ length: 10 }, (_, i) => {
        const x = startX + (Math.random() - 0.5) * 50
        const y = i * 10
        return `${x},${y}`
      }).join(' ')
      
      return {
        id: idCounterRef.current++,
        points: segments,
        opacity: 1
      }
    })

    setLightning(bolts)
    
    setTimeout(() => setLightning([]), 200)
    setBattleIntensity(prev => Math.min(prev + 25, 100))
  }, [])

  // ===== DRAGON ATTACK SYSTEM =====
  const summonDragon = useCallback(() => {
    const dragonId = idCounterRef.current++
    
    setWarriors(prev => [...prev, {
      id: dragonId,
      x: -200,
      y: 20,
      type: 'dragon',
      direction: 'right',
      state: 'flying',
      health: 200,
      animation: 'soaring'
    }])

    // Dragon breathing fire
    setTimeout(() => {
      const fireBreath = Array.from({ length: 20 }, (_, i) => ({
        id: idCounterRef.current++,
        x: 200 + i * 30,
        y: 30 + Math.random() * 20,
        intensity: 100 - i * 5
      }))
      
      setFire(fireBreath)
      setTimeout(() => setFire([]), 3000)
    }, 1000)

    setBattleIntensity(prev => Math.min(prev + 40, 100))
  }, [])

  // ===== ARMY FORMATION SYSTEM =====
  const deployKnightFormation = useCallback(() => {
    const knights = Array.from({ length: 8 }, (_, i) => ({
      id: idCounterRef.current++,
      x: -50 - i * 20,
      y: 70,
      type: 'knight' as const,
      direction: 'right' as const,
      state: 'charging' as const,
      health: 100,
      animation: 'galloping'
    }))

    setWarriors(prev => [...prev, ...knights])
    setBattleIntensity(prev => Math.min(prev + 30, 100))
  }, [])

  // ===== CASTLE DEFENSE SYSTEM =====
  const activateCastleDefenses = useCallback(() => {
    // Arrow slits firing
    const arrows = Array.from({ length: 6 }, (_, i) => ({
      id: idCounterRef.current++,
      x: 100 + i * 50,
      y: 40,
      targetX: Math.random() * window.innerWidth,
      targetY: 70 + Math.random() * 20,
      progress: 0,
      type: 'arrow' as const,
      trail: [] as Array<{x: number, y: number, opacity: number}>
    }))

    setProjectiles(prev => [...prev, ...arrows])

    // Boiling oil
    const oilDrops = Array.from({ length: 10 }, (_, i) => ({
      id: idCounterRef.current++,
      x: 300 + i * 10,
      y: 30,
      targetX: 300 + i * 10,
      targetY: 80,
      progress: 0,
      type: 'cannonball' as const,
      trail: [] as Array<{x: number, y: number, opacity: number}>
    }))

    setProjectiles(prev => [...prev, ...oilDrops])
    setBattleIntensity(prev => Math.min(prev + 25, 100))
  }, [])

  // ===== INTERACTION HANDLERS =====
  const handleLinkHover = useCallback((linkName: string) => {
    switch (linkName) {
      case 'Home':
        activateCastleDefenses()
        break
      case 'About':
        deployKnightFormation()
        break
      case 'Work':
        summonDragon()
        break
      case 'Blog':
        castLightningStorm()
        break
      case 'Contact':
        castFireball(mousePos.x, mousePos.y)
        break
    }
  }, [mousePos, activateCastleDefenses, deployKnightFormation, summonDragon, castLightningStorm, castFireball])

  const handleLinkClick = useCallback((e: React.MouseEvent, linkName: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Multiple siege weapons fire simultaneously
    fireTrebuchet(centerX, centerY)
    fireBallistaBolt(centerX, centerY)
    
    // Massive explosion
    setExplosions(prev => [...prev, {
      id: idCounterRef.current++,
      x: centerX,
      y: centerY,
      size: 0,
      type: 'massive'
    }])
  }, [fireTrebuchet, fireBallistaBolt])

  // ===== EFFECTS =====
  useEffect(() => {
    initializeAudio()
    animationRef.current = requestAnimationFrame(animationLoop)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initializeAudio, animationLoop])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 20)
      
      // Battle intensity based on scroll
      const intensity = Math.min((scrollY / 500) * 100, 100)
      setBattleIntensity(intensity)
      
      if (intensity > 75) setBattleMode('apocalypse')
      else if (intensity > 50) setBattleMode('war')
      else if (intensity > 25) setBattleMode('battle')
      else if (intensity > 10) setBattleMode('skirmish')
      else setBattleMode('peace')
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect()
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }

    const navbar = navRef.current
    if (navbar) {
      navbar.addEventListener('mousemove', handleMouseMove)
      return () => navbar.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Random battle events
  useEffect(() => {
    const interval = setInterval(() => {
      if (battleIntensity > 30) {
        const random = Math.random()
        
        if (random < 0.3) {
          // Random arrow volleys
          const arrows = Array.from({ length: 3 }, () => ({
            id: idCounterRef.current++,
            x: Math.random() * window.innerWidth,
            y: 20,
            targetX: Math.random() * window.innerWidth,
            targetY: 70 + Math.random() * 10,
            progress: 0,
            type: 'arrow' as const,
            trail: [] as Array<{x: number, y: number, opacity: number}>
          }))
          setProjectiles(prev => [...prev, ...arrows])
        }
        
        if (random < 0.1 && battleIntensity > 60) {
          // Random lightning
          castLightningStorm()
        }
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [battleIntensity, castLightningStorm])

  const isActivePath = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const isWorkActive = navLinks.find(link => link.name === 'Work')?.submenu?.some(sub => 
    pathname.startsWith(sub.href)
  )

  return (
    <motion.nav 
      ref={navRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 w-full z-50 h-20 transition-all duration-500 overflow-hidden ${
        scrolled 
          ? 'bg-slate-900/95 backdrop-blur-xl border-b border-amber-500/30 shadow-2xl shadow-amber-500/20' 
          : 'bg-gradient-to-r from-slate-900/80 via-amber-900/60 to-slate-900/80 backdrop-blur-lg'
      }`}
      style={{
        background: scrolled 
          ? `linear-gradient(90deg, 
              rgba(15, 23, 42, 0.95) 0%, 
              rgba(146, 64, 14, ${0.3 + battleIntensity * 0.007}) ${battleIntensity}%, 
              rgba(15, 23, 42, 0.95) 100%)`
          : undefined,
        boxShadow: battleIntensity > 50 
          ? `0 0 ${battleIntensity}px rgba(255, 100, 0, 0.5)`
          : undefined
      }}
    >
      {/* ===== EPIC BATTLEFIELD BACKGROUND ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Castle silhouettes with battle damage */}
        <div className="absolute bottom-0 left-0 w-32 h-16 bg-gradient-to-t from-slate-800 to-slate-700 opacity-70">
          {/* Castle towers with flags */}
          <div className="absolute top-0 left-3 w-4 h-10 bg-slate-700 rounded-t-sm">
            <div className="absolute -top-2 left-1 w-2 h-4 bg-red-600 rounded-sm animate-pulse"></div>
          </div>
          <div className="absolute top-0 right-3 w-4 h-8 bg-slate-700 rounded-t-sm">
            <div className="absolute -top-2 left-1 w-2 h-4 bg-blue-600 rounded-sm animate-pulse"></div>
          </div>
          {/* Castle gate with battle damage */}
          <div className="absolute bottom-0 left-1/2 w-6 h-8 bg-amber-900 transform -translate-x-1/2">
            {battleIntensity > 50 && (
              <div className="absolute inset-0 bg-red-500/20 animate-pulse"></div>
            )}
          </div>
          {/* Arrow slits */}
          <div className="absolute top-4 left-6 w-1 h-4 bg-black opacity-60"></div>
          <div className="absolute top-6 right-6 w-1 h-4 bg-black opacity-60"></div>
        </div>
        
        {/* Enemy castle on the right */}
        <div className="absolute bottom-0 right-0 w-28 h-14 bg-gradient-to-t from-slate-800 to-slate-700 opacity-70">
          <div className="absolute top-0 left-4 w-4 h-10 bg-slate-700 rounded-t-sm">
            <div className="absolute -top-2 left-1 w-2 h-4 bg-green-600 rounded-sm animate-bounce"></div>
          </div>
          <div className="absolute top-0 right-4 w-4 h-8 bg-slate-700 rounded-t-sm"></div>
          <div className="absolute top-2 left-1/2 w-4 h-6 bg-red-800 transform -translate-x-1/2"></div>
        </div>

        {/* Flying projectiles */}
        {projectiles.map(projectile => {
          const currentX = projectile.x + (projectile.targetX - projectile.x) * projectile.progress
          const currentY = projectile.y + (projectile.targetY - projectile.y) * projectile.progress - 
                          Math.sin(projectile.progress * Math.PI) * 30 // Arc trajectory
          const rotation = Math.atan2(projectile.targetY - projectile.y, projectile.targetX - projectile.x) * 180 / Math.PI
          
          return (
            <motion.div
              key={projectile.id}
              className={`absolute z-20 ${
                projectile.type === 'arrow' ? 'w-6 h-1 bg-gradient-to-r from-amber-600 to-amber-800' :
                projectile.type === 'trebuchet_stone' ? 'w-4 h-4 bg-gray-600 rounded-full shadow-lg' :
                projectile.type === 'fireball' ? 'w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg shadow-red-500/50' :
                projectile.type === 'lightning' ? 'w-8 h-1 bg-blue-300 shadow-lg shadow-blue-400/80' :
                projectile.type === 'ballista_bolt' ? 'w-8 h-1 bg-gray-700' :
                'w-3 h-3 bg-amber-600 rounded-full'
              }`}
              style={{
                left: currentX,
                top: currentY,
                transform: `rotate(${rotation}deg)`,
                opacity: 1 - projectile.progress * 0.3
              }}
              animate={{
                scale: projectile.type === 'fireball' ? [1, 1.2, 1] : 1
              }}
              transition={{
                duration: 0.3,
                repeat: projectile.type === 'fireball' ? Infinity : 0
              }}
            >
              {/* Projectile trail */}
              {projectile.trail?.map((point, index) => (
                <div
                  key={index}
                  className="absolute w-1 h-1 bg-orange-400 rounded-full"
                  style={{
                    left: point.x - currentX,
                    top: point.y - currentY,
                    opacity: point.opacity * 0.5
                  }}
                />
              ))}
              
              {/* Special effects for different projectiles */}
              {projectile.type === 'fireball' && (
                <>
                  <div className="absolute inset-0 bg-red-400 rounded-full animate-pulse opacity-60"></div>
                  <div className="absolute -inset-2 bg-orange-400/30 rounded-full animate-ping"></div>
                </>
              )}
              
              {projectile.type === 'trebuchet_stone' && (
                <div className="absolute -inset-1 bg-gray-400/20 rounded-full animate-pulse"></div>
              )}
            </motion.div>
          )
        })}

        {/* Warriors and characters */}
        {warriors.map(warrior => (
          <motion.div
            key={warrior.id}
            className="absolute bottom-0 z-10"
            style={{ left: warrior.x, top: warrior.y }}
            animate={{
              y: warrior.type === 'dragon' ? [0, -10, 0] : [0, -3, 0],
              rotate: warrior.type === 'dragon' ? [0, 5, -5, 0] : 0
            }}
            transition={{
              duration: warrior.type === 'dragon' ? 3 : 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Knight */}
            {warrior.type === 'knight' && (
              <div className={`w-8 h-12 relative ${warrior.direction === 'left' ? 'scale-x-[-1]' : ''}`}>
                {/* Knight body */}
                <div className="w-6 h-10 bg-gradient-to-b from-blue-600 to-blue-800 rounded-t-lg relative">
                  {/* Helmet with plume */}
                  <div className="absolute -top-3 left-1 w-4 h-4 bg-gray-300 rounded-full"></div>
                  <div className="absolute -top-4 left-2 w-1 h-3 bg-red-500 animate-wave"></div>
                  {/* Sword */}
                  <div className="absolute -right-2 top-1 w-1 h-8 bg-gray-300 rounded-full"></div>
                  <div className="absolute -right-3 top-0 w-3 h-2 bg-gray-400 rounded"></div>
                  {/* Shield */}
                  <div className="absolute -left-2 top-2 w-3 h-5 bg-red-600 rounded border border-amber-400">
                    <div className="absolute inset-1 bg-amber-400 rounded-sm"></div>
                  </div>
                  {/* Battle effects */}
                  {warrior.state === 'charging' && (
                    <>
                      <div className="absolute -right-3 top-3 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-1 left-2 w-1 h-1 bg-yellow-400 animate-pulse"></div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Dragon */}
            {warrior.type === 'dragon' && (
              <div className="w-20 h-10 relative">
                {/* Dragon body */}
                <div className="w-16 h-6 bg-gradient-to-r from-green-800 via-green-600 to-green-700 rounded-full relative">
                  {/* Wings */}
                  <motion.div 
                    className="absolute -top-3 left-3 w-6 h-8 bg-green-700 rounded-full opacity-80"
                    animate={{ scaleY: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute -top-3 right-3 w-6 h-8 bg-green-700 rounded-full opacity-80"
                    animate={{ scaleY: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                  />
                  {/* Head */}
                  <div className="absolute -right-4 top-1 w-6 h-4 bg-green-800 rounded-r-full">
                    {/* Eyes */}
                    <div className="absolute right-1 top-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    {/* Horns */}
                    <div className="absolute -top-1 right-2 w-1 h-2 bg-gray-600 rounded-t-full"></div>
                  </div>
                  {/* Tail */}
                  <div className="absolute -left-4 top-2 w-6 h-2 bg-green-800 rounded-l-full"></div>
                  
                  {/* Fire breath */}
                  <div className="absolute -right-8 top-2 w-12 h-3">
                    <div className="w-full h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 opacity-80 animate-pulse rounded-r-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-transparent animate-ping rounded-r-full"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Wizard */}
            {warrior.type === 'wizard' && (
              <div className="w-6 h-12 relative">
                {/* Wizard robe */}
                <div className="w-6 h-10 bg-gradient-to-b from-purple-600 to-purple-800 rounded-t-lg relative">
                  {/* Wizard hat */}
                  <div className="absolute -top-4 left-1 w-4 h-6 bg-purple-700 rounded-t-full"></div>
                  <div className="absolute -top-5 left-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  {/* Staff */}
                  <div className="absolute -right-1 top-0 w-1 h-12 bg-amber-700 rounded-full"></div>
                  <div className="absolute -right-2 -top-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  {/* Magic aura */}
                  <div className="absolute -inset-2 bg-purple-400/20 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {/* Siege weapons */}
        {siegeWeapons.map(weapon => (
          <motion.div
            key={weapon.id}
            className="absolute z-10"
            style={{ left: weapon.x, top: weapon.y }}
            animate={{
              rotate: weapon.type === 'trebuchet' ? [weapon.rotation, weapon.rotation + 90, weapon.rotation + 60] : 0
            }}
            transition={{
              duration: weapon.state === 'firing' ? 0.8 : 0,
              ease: "easeOut"
            }}
          >
            {/* Trebuchet */}
            {weapon.type === 'trebuchet' && (
              <div className="w-16 h-16 relative">
                {/* Base */}
                <div className="absolute bottom-0 left-2 w-12 h-4 bg-amber-800 rounded"></div>
                {/* Vertical support */}
                <div className="absolute bottom-4 left-6 w-2 h-8 bg-amber-700 rounded-t-full"></div>
                {/* Throwing arm */}
                <div className="absolute bottom-8 left-7 w-1 h-6 bg-amber-600 rounded-full origin-bottom transform"></div>
                {/* Counterweight */}
                <div className="absolute bottom-6 left-5 w-3 h-3 bg-gray-600 rounded"></div>
                {/* Projectile basket */}
                <div className="absolute bottom-12 left-8 w-2 h-2 bg-amber-500 rounded"></div>
              </div>
            )}
          </motion.div>
        ))}

        {/* Magical effects */}
        {magicalEffects.map(effect => (
          <div
            key={effect.id}
            className="absolute z-20"
            style={{ left: effect.x - 25, top: effect.y - 25 }}
          >
            {effect.particles.map((particle, index) => (
              <div
                key={index}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: particle.x,
                  top: particle.y,
                  backgroundColor: particle.color,
                  opacity: particle.life
                }}
              />
            ))}
          </div>
        ))}

        {/* Lightning bolts */}
        {lightning.map(bolt => (
          <svg
            key={bolt.id}
            className="absolute inset-0 w-full h-full z-30 pointer-events-none"
            style={{ opacity: bolt.opacity }}
          >
            <polyline
              points={bolt.points}
              fill="none"
              stroke="#00BFFF"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>
        ))}

        {/* Fire effects */}
        {fire.map(flame => (
          <motion.div
            key={flame.id}
            className="absolute w-4 h-6 z-15"
            style={{ left: flame.x, top: flame.y }}
            animate={{
              scale: [1, 1.2, 0.8, 1],
              opacity: [flame.intensity / 100, (flame.intensity / 100) * 0.8, flame.intensity / 100]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-t-full opacity-80"></div>
          </motion.div>
        ))}

        {/* Explosions */}
        {explosions.map(explosion => (
          <motion.div
            key={explosion.id}
            className="absolute z-25 pointer-events-none"
            style={{ 
              left: explosion.x - explosion.size/2, 
              top: explosion.y - explosion.size/2,
              width: explosion.size,
              height: explosion.size
            }}
          >
            <div className="w-full h-full bg-gradient-radial from-yellow-300 via-orange-500 to-red-600 rounded-full opacity-80 animate-pulse"></div>
            <div className="absolute inset-2 bg-gradient-radial from-white via-yellow-400 to-transparent rounded-full animate-ping"></div>
          </motion.div>
        ))}

        {/* Battlefield smoke and dust */}
        <div className="absolute bottom-0 left-1/4 w-40 h-10 bg-gradient-to-t from-gray-600/40 to-transparent rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-32 h-8 bg-gradient-to-t from-gray-700/50 to-transparent rounded-full opacity-40 animate-pulse delay-1000"></div>

        {/* Battle intensity indicator */}
        <div className="absolute top-2 right-4 flex items-center gap-3 text-xs">
          <Sword className="w-4 h-4 text-amber-400" />
          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden border border-amber-400/50">
            <motion.div 
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
              animate={{ width: `${battleIntensity}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-amber-400 font-bold">{battleMode.toUpperCase()}</span>
        </div>

        {/* Weather effects */}
        {weather === 'storm' && (
          <div className="absolute inset-0 bg-gray-900/20 animate-pulse"></div>
        )}
      </div>

      {/* ===== MAIN NAVBAR CONTENT ===== */}
      <div className="container mx-auto px-6 h-20 flex items-center justify-between relative z-40">
        {/* Logo with battle effects */}
        <motion.div 
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onHoverStart={() => {
            castFireball(100, 40)
            deployKnightFormation()
          }}
        >
          <div className="relative">
            <Crown className="w-8 h-8 text-amber-400" />
            <motion.div
              className="absolute inset-0 text-amber-300"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Crown className="w-8 h-8" />
            </motion.div>
            {/* Crown glow effect */}
            <div className="absolute -inset-2 bg-amber-400/20 rounded-full animate-pulse"></div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
            Sir Portfolio
          </span>
          {battleIntensity > 50 && (
            <Flame className="w-5 h-5 text-red-500 animate-bounce" />
          )}
        </motion.div>

        {/* Desktop Navigation with epic battle effects */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800/60 backdrop-blur-sm rounded-full p-2 border border-amber-500/40">
            {navLinks.map((link, index) => (
              <div key={link.name} className="relative">
                {link.submenu ? (
                  // Work dropdown with ultimate warfare
                  <div 
                    className="relative"
                    onMouseEnter={() => {
                      setIsWorkOpen(true)
                      handleLinkHover('Work')
                    }}
                    onMouseLeave={() => setIsWorkOpen(false)}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        isWorkActive || isWorkOpen
                          ? 'text-white bg-amber-600/40 shadow-lg shadow-amber-500/30'
                          : 'text-gray-300 hover:text-white hover:bg-slate-700/60'
                      }`}
                      onClick={(e) => handleLinkClick(e, 'Work')}
                    >
                      <motion.span 
                        className="text-lg"
                        animate={{ rotate: [0, 20, -20, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      >
                        {link.emoji}
                      </motion.span>
                      {link.name}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                        isWorkOpen ? 'rotate-180' : ''
                      }`} />
                      
                      {/* Epic battle glow */}
                      {(isWorkActive || isWorkOpen) && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/30 via-red-500/30 to-amber-500/30"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.button>

                    {/* Ultimate warfare dropdown */}
                    <AnimatePresence>
                      {isWorkOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className="absolute top-full mt-2 left-0 min-w-80 bg-slate-800/95 backdrop-blur-xl border border-amber-500/40 rounded-xl shadow-2xl shadow-amber-500/20 overflow-hidden z-50"
                        >
                          <div className="p-3">
                            {link.submenu.map((subLink, subIndex) => (
                              <motion.div
                                key={subLink.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: subIndex * 0.1 }}
                              >
                                <Link
                                  href={subLink.href}
                                  className="group flex items-center gap-4 p-4 rounded-lg hover:bg-amber-600/30 transition-all duration-300 relative"
                                  onClick={(e) => {
                                    handleLinkClick(e, subLink.name)
                                    setIsWorkOpen(false)
                                  }}
                                  onMouseEnter={() => {
                                    if (subLink.spell === 'fireball') castFireball(400, 100)
                                    else if (subLink.spell === 'lightning') castLightningStorm()
                                    else if (subLink.spell === 'frost') activateCastleDefenses()
                                  }}
                                >
                                  <motion.div 
                                    className="text-3xl group-hover:scale-125 transition-transform duration-300"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: subIndex * 0.7 }}
                                  >
                                    {subLink.emoji}
                                  </motion.div>
                                  <div className="flex-1">
                                    <div className="font-medium text-white group-hover:text-amber-300 transition-colors duration-300">
                                      {subLink.name}
                                    </div>
                                    <div className="text-sm text-gray-400 group-hover:text-gray-300">
                                      {subLink.description}
                                    </div>
                                  </div>
                                  <motion.div
                                    className="ml-auto opacity-0 group-hover:opacity-100"
                                    animate={{ x: [0, 8, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                  >
                                    <Zap className="w-5 h-5 text-amber-400" />
                                  </motion.div>
                                  
                                  {/* Magical aura on hover */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                          
                          {/* Battle effects in dropdown */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute bottom-2 left-4 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
                            <div className="absolute top-3 right-6 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
                            <div className="absolute bottom-4 right-8 w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  // Regular nav links with warfare effects
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 group ${
                      isActivePath(link.href)
                        ? 'text-white bg-amber-600/40 shadow-lg shadow-amber-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-slate-700/60'
                    }`}
                    onClick={(e) => handleLinkClick(e, link.name)}
                    onMouseEnter={() => handleLinkHover(link.name)}
                  >
                    <motion.span 
                      className="text-lg group-hover:scale-125 transition-transform duration-300"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.6 }}
                    >
                      {link.emoji}
                    </motion.span>
                    {link.name}
                    
                    {/* Active battle indicator */}
                    {isActivePath(link.href) && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/30 via-red-500/30 to-amber-500/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                      />
                    )}
                    
                    {/* Battle sparks on hover */}
                    <motion.div
                      className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ⚡
                    </motion.div>
                    
                    {/* Faction glow based on link */}
                    {link.faction && (
                      <div className={`absolute -inset-1 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${
                        link.faction === 'castle' ? 'bg-blue-500/30' :
                        link.faction === 'royal' ? 'bg-purple-500/30' :
                        link.faction === 'military' ? 'bg-red-500/30' :
                        link.faction === 'scholars' ? 'bg-green-500/30' :
                        'bg-yellow-500/30'
                      }`}></div>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile menu button with warfare */}
        <div className="md:hidden">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsOpen(!isOpen)
              summonDragon()
              castLightningStorm()
            }}
            className="relative p-3 text-amber-300 hover:text-white transition-colors rounded-xl hover:bg-slate-700/60 border border-amber-500/40"
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
            
            {/* Mobile battle effects */}
            <div className="absolute -top-1 -right-1">
              <Shield className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -left-1">
              <Sword className="w-3 h-3 text-red-400 animate-bounce" />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation with battlefield theme */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-slate-800/95 backdrop-blur-xl border-t border-amber-500/40"
          >
            <div className="px-4 py-6 space-y-2 relative">
              {/* Mobile battle background */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/40 via-red-500/40 to-amber-500/40"></div>
                <div className="absolute top-2 right-4 text-2xl animate-bounce">⚔️</div>
                <div className="absolute bottom-2 left-4 text-lg animate-pulse">🏰</div>
                <div className="absolute top-4 left-1/2 text-sm animate-spin">✨</div>
              </div>
              
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.submenu ? (
                    <div>
                      <button
                        onClick={() => {
                          setIsWorkOpen(!isWorkOpen)
                          handleLinkHover('Work')
                        }}
                        className="w-full flex items-center justify-between p-3 text-left transition-colors rounded-xl hover:bg-slate-700/60 text-gray-300 hover:text-white"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{link.emoji}</span>
                          <span className="font-medium">{link.name}</span>
                        </div>
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
                            className="ml-4 mt-2 space-y-1 overflow-hidden"
                          >
                            {link.submenu.map((subLink, subIndex) => (
                              <motion.div
                                key={subLink.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: subIndex * 0.1 }}
                              >
                                <Link
                                  href={subLink.href}
                                  className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-slate-600/60 transition-colors"
                                  onClick={() => {
                                    setIsOpen(false)
                                    handleLinkHover(subLink.name)
                                  }}
                                >
                                  <span className="text-lg">{subLink.emoji}</span>
                                  <span>{subLink.name}</span>
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
                      className="flex items-center gap-3 p-3 rounded-xl transition-colors text-gray-300 hover:text-white hover:bg-slate-700/60"
                      onClick={() => {
                        setIsOpen(false)
                        handleLinkHover(link.name)
                      }}
                    >
                      <span className="text-xl">{link.emoji}</span>
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  )}
                </motion.div>
              ))}
              
              {/* Audio toggle in mobile menu */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-4 border-t border-amber-500/20"
              >
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors w-full ${
                    audioEnabled 
                      ? 'text-amber-400 bg-amber-400/10' 
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <span className="text-xl">🔊</span>
                  <span className="font-medium">
                    Battle Audio: {audioEnabled ? 'ON' : 'OFF'}
                  </span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}