import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedEvents } from "@/components/home/featured-events"
import { HowItWorks } from "@/components/home/how-it-works"
import { EventCategories } from "@/components/home/event-categories"
import { TopHosts } from "@/components/home/top-hosts"
import { Testimonials } from "@/components/home/testimonials"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedEvents />
        <HowItWorks />
        <EventCategories />
        <TopHosts />
        <Testimonials />
        <WhyChooseUs />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
