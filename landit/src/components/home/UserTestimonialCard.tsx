import React from 'react'

interface UserTestimonialCardProp{
    text:string;
    name:string;
    role:string
}

const UserTestimonialCard: React.FC<UserTestimonialCardProp> = ({ text, name, role }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl text-purple-600 mb-3">"</div>
      <p className="text-gray-800 mb-4 leading-relaxed">
        {text}
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400"></div>
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-sm text-gray-600">{role}</div>
        </div>
      </div>
    </div>
  );
};

export default UserTestimonialCard
