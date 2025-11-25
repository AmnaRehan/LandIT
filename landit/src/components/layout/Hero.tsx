import React, { ReactNode } from 'react';
import { Container } from '../ui/Container';
import { useTheme } from '../common/ThemeContext';
import {HeroProps} from '../../types/index'
import {Heading,Paragraph,Text} from '../common/text/index'

export const Hero: React.FC<HeroProps> = ({ title, subtitle, description, cta }) => {
  const { isDark } = useTheme();
  
  return (
    <section className={`py-20 min-h-[500px] flex items-center transition-colors ${
      isDark 
        ? 'bg-gradient-to-br from-purple-900 to-purple-800' 
        : 'bg-gradient-to-br from-purple-400 to-purple-300'
    }`}>
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <Heading className={`text-5xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </Heading>
          {subtitle && (
            <Paragraph className={`text-xl mb-8 ${
              isDark ? 'text-gray-300' : 'text-gray-800'
            }`}>
              {subtitle}
            </Paragraph>
          )}
          {description && (
            <p className={`text-lg mb-10 leading-relaxed ${
              isDark ? 'text-gray-400' : 'text-gray-700'
            }`}>
              {description}
            </p>
          )}
          <div className="flex justify-center">{cta}</div>
        </div>
      </Container>
    </section>
  );
};