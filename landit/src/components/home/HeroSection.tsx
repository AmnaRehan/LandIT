import React from 'react'
import {Heading,Paragraph} from '../common/text/index'
import { Button } from '../ui/Button';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-purple-300 to-purple-200">
      <div className="max-w-4xl mx-auto text-center">
        <Heading className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Land your dream job with{' '}
          <span className="text-blue-500">AI-powered</span>
          <br />
          job preparation
        </Heading>
        <Paragraph className="text-lg md:text-xl text-gray-800 mb-4 max-w-2xl mx-auto leading-relaxed">
          Skip the guesswork and accelerate your job search.
        </Paragraph>
        <Paragraph className="text-lg md:text-xl text-gray-800 mb-8 max-w-2xl mx-auto leading-relaxed">
          Our AI platform eliminates interview anxiety, optimizes your resume, and gives you the technical edge to land offers faster.
        </Paragraph>
        <Button className="px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors shadow-lg">
          Get Started for Free
        </Button>
      </div>
    </section>
  );
};

export default HeroSection