import React from 'react'
import Link from 'next/link';
const CTASection = () => {
  return (
    <section className="py-32 px-6 mt-4 bg-gradient-to-b from-purple-200 to-purple-300 dark:from-purple-300 dark:via-purple-600 transition-colors duration-300">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900  mb-6">
          Ready to land your <span className="text-blue-800">dream job?</span>
        </h2>
        <p className="text-xl text-gray-800 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of professionals who made job hunting effortless with LandIT. Get started in minutes, land offers in weeks.
        </p>
        <Link href="/sign-in">
        <button className="px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold text-lg hover:bg-purple-800 transition-colors shadow-lg">
          Land IT today
        </button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection