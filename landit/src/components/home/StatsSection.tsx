import React from 'react'
import StatsCard from '../home/StatsCard'
import TestimonialCard from '../home/TestimonialCard'

const StatsSection = () => {
  const stats = [
    {
      value: '2.3 weeks',
      label: 'Average time to offer job',
      sublabel: 'vs 6-8 weeks industry average'
    },
    {
      value: '87%',
      label: 'Interview Success Rate',
      sublabel: 'vs 25% industry average'
    },
    {
      value: '2.1',
      label: 'Average Interviews to Jobs',
      sublabel: 'vs 6-8 weeks interviews industry average'
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-purple-200 to-purple-100 dark:from-purple-700 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-4xl font-medium text-center mb-16">
          Our users land jobs{' '}
          <span className="text-purple-600 dark:text-black">3x faster</span>{' '}
          than the average applicant
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 ">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              value={stat.value}
              label={stat.label}
              sublabel={stat.sublabel}
            />
          ))}
        </div>

        <TestimonialCard
          quote="I landed my dream job at a fortune 500 company after just 3 interviews. LandIT's AI practice sessions gave me the confidence I needed to ace every question."
          author="Sara Chen"
          role="Software Engineer at Google"
        />
      </div>
    </section>
  );
};

export default StatsSection
