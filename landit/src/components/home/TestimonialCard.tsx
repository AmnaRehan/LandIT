import React from 'react'

interface TestimonialCardProp{
    quote : string;
    author:string;
    role:string;
}


const TestimonialCard: React.FC<TestimonialCardProp> = ({ quote, author, role }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm max-w-3xl mx-auto">
      <p className="text-lg text-gray-800 text-center italic mb-4">
        "{quote}"
      </p>
      <p className="text-center text-gray-600 font-medium">
        -{author}, {role}
      </p>
    </div>
  );
};

export default TestimonialCard