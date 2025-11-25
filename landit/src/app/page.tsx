import React from 'react'
import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTASection from '@/components/home/CTASection'

const page = () => {
  return (
    <div>
     <HeroSection/>
     <StatsSection/>
     <FeaturesSection/>
     <TestimonialsSection/>
     <CTASection/>
    </div>
  )
}

export default page
