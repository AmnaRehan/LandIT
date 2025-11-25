import React from 'react'
import FeatureCard  from './FeatureCard';

const FeaturesSection = () => {
  const features = [
    {
      icon: '🎤',
      title: 'AI Interview Practice',
      description: 'Simulate real interviews with AI that adapts to your responses. Build confidence and eliminate nervousness before the big day.',
      color: 'bg-yellow-200'
    },
    {
      icon: '📄',
      title: 'Tailored Resume Suggestions',
      description: 'Transform your resume into an ATS-friendly, recruiter-approved document that gets you more callbacks.',
      color: 'bg-blue-200'
    },
    {
      icon: '📖',
      title: 'Technical Question Practice',
      description: 'Solve coding problems with guided hints and explanations. Perfect your approach to technical interviews.',
      color: 'bg-green-200'
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Take your best shot at <span className="text-purple-600">Landing IT</span>
        </h2>
        <p className="text-xl text-gray-700 text-center mb-16 max-w-2xl mx-auto">
          Turn job hunting from stressful to straightforward with AI that does the heavy lifting for you
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection