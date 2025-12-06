import React from 'react'
import {TestimonialCardProp} from '../../types/index'
import {Paragraph} from '../common/text/index'

const TestimonialCard: React.FC<TestimonialCardProp> = ({ quote, author, role }) => {
  return (
    <div className="bg-white rounded-2xl hover:-translate-y-2 hover:shadow-md transition-all p-8 shadow-sm max-w-3xl mx-auto">
      <Paragraph className="text-lg text-gray-800 text-center italic mb-4">
        "{quote}"
      </Paragraph>
      <Paragraph className="text-center text-gray-600 font-medium">
        -{author}, {role}
      </Paragraph>
    </div>
  );
};

export default TestimonialCard