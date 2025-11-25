import React from 'react'

const CTASection = () => {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-purple-200 to-purple-300">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Ready to land your <span className="text-blue-500">dream job?</span>
        </h2>
        <p className="text-xl text-gray-800 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of professionals who made job hunting effortless with LandIT. Get started in minutes, land offers in weeks.
        </p>
        <button className="px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors shadow-lg">
          Land IT today
        </button>
      </div>
    </section>
  );
};

export default CTASection