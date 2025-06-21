import HeroSection from './components/sections/HeroSection'
import ArtCarousel from './components/sections/ArtCarousel'
import QuickNavigation from './components/sections/QuickNavigation'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ArtCarousel />
      <QuickNavigation />
    </main>
  )
}