import React from 'react'

interface FeatureCardProp{
    icon:string;
    title:string;
    description:string;
    color:string
}

const FeatureCard: React.FC<FeatureCardProp> = ({ icon, title, description, color }) => {
  return (
    <div className={`${color} rounded-2xl p-8 hover:scale-105 transition-transform`}>
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-800 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard