"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SupabaseConfigChecker } from "@/components/SupabaseConfigChecker"
import { HeroSection } from "@/components/home/HeroSection"
import { StatsSection } from "@/components/home/StatsSection"
import { FeaturesSection } from "@/components/home/FeaturesSection"
import { HowItWorksSection } from "@/components/home/HowItWorksSection"
import { ReviewsSection } from "@/components/home/ReviewsSection"
import { CallToActionSection } from "@/components/home/CallToActionSection"
import { Footer } from "@/components/home/Footer"
import { Navbar } from "@/components/home/Navbar"
import { ClientOnly } from "@/components/ClientOnly"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B0F17" }}>
      <SupabaseConfigChecker />
      <ClientOnly>
        <Navbar />
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ReviewsSection />
        <CallToActionSection />
        <Footer />
      </ClientOnly>
    </div>
  )
}