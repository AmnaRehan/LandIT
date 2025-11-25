import { ReactNode } from 'react';

interface ParagraphProps {
  children: ReactNode;
  variant?: 'default' | 'large' | 'small' | 'muted' | 'lead';
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
}

export default function Paragraph({ 
  children, 
  variant = 'default',
  align = 'center',
  className = '' 
}: ParagraphProps) {
  const baseClasses = 'leading-relaxed';
  
  const variantClasses = {
    default: 'text-base text-foreground',
    large: 'text-lg text-foreground',
    small: 'text-sm text-foreground',
    muted: 'text-base text-muted-foreground',
    lead: 'text-xl text-foreground font-medium'
  };
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center', 
    right: 'text-right',
    justify: 'text-justify'
  };
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${alignClasses[align]} ${className}`;
  
  return (
    <p className={combinedClasses}>
      {children}
    </p>
  );
}