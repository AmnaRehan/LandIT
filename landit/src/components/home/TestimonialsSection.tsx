import React from 'react'
import UserTestimonialCard from './UserTestimonialCard';
import {Heading} from '../common/text/index'


const TestimonialsSection = () => {
  const testimonials = [
    {
      text: "The AI practice sessions were incredibly realistic. I felt completely prepared. Google loved the role on my first try!",
      name: "Zoey Stewart",
      role: "Software Engineer, Google"
    },
    {
      text: "LandIT'S resume suggestions helped me get noticed perfectly. I went from getting no responses to multiple offers within weeks!",
      name: "Isabella Smith",
      role: "Product Manager, Meta"
    },
    {
      text: "The technical question practice was incredibly helpful. The detailed explanations and feedback helped me understand complex algorithms and ace my Netflix interview!",
      name: "Andre Castillo",
      role: "Data Scientist, Netflix"
    },
    {
      text: "After months of rejections, LandIT completely changed my approach. I got three job offers in two weeks!",
      name: "Lucy Kennedy",
      role: "UX Designer, Adobe"
    },
    {
      text: "As a career changer, I was nervous about breaking into tech. LandIT's practice sessions gave me the confidence to interview for tech roles successfully.",
      name: "Manush Prescott",
      role: "Software Engineer, Google"
    },
    {
      text: "The technical interview practice was spot-on. It prepared me for all the coding challenges and system design questions at Amazon.",
      name: "Evan Freeman",
      role: "Senior SDE, Amazon"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Heading className="text-4xl md:text-5xl font-medium mb-4">
            <span className="text-purple-600">👥 Trusted by job seekers</span> at top companies
          </Heading>
          <p className="text-xl mt-6 text-gray-700 dark:text-gray-300">
            see how LandIT has helped professionals land their dream job
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <UserTestimonialCard
              key={index}
              text={testimonial.text}
              name={testimonial.name}
              role={testimonial.role}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection