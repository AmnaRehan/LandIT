import React from 'react'
import {Heading,Paragraph} from '../common/text/index'
import { Button } from '../ui/Button';
import Link from "next/link";
const HeroSection = () => {
  return (
    <section className="pt-24 pb-20 px-6 -mt-5 bg-gradient-to-b from-purple-500 via-purple-200 to-white :dark:from-purple-900 dark:to-purple-700  transition-colors duration-300">
      <div className="max-w-4xl mx-auto text-center">
        <Heading className="text-4xl md:text-5xl font-medium text-gray-900 mb-6 leading-tight">
          Land your dream job with{' '}
          <span className="text-blue-800 ">AI-powered</span>
          <br />
          job preparation
        </Heading>
        <Paragraph className="text-lg md:text-xl mt-8 text-gray-800 mb-14 max-w-3xl mx-auto leading-relaxed">
          Skip the guesswork and accelerate your job search.
          Our AI platform eliminates interview anxiety, optimizes your resume, and gives you the technical edge to land offers faster.
        </Paragraph>
        <Link href="/sign-in">
        <Button className="px-8 py-4 bg-gray-900 -mt-4 text-white rounded-lg font-semibold text-lg hover:bg-purple-800 transition-colors shadow-lg">
          Get Started for Free
        </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection