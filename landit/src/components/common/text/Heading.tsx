import { ReactNode } from 'react';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'muted';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export default function Heading({ 
  level = 1,
  children, 
  variant = 'primary',
  align = 'left',
  className = '' 
}: HeadingProps) {

  const tagMap = {
    1: "h1",
    2: "h2",
    3: "h3",
    4: "h4",
    5: "h5",
    6: "h6"
  } as const;

  const HeadingTag = tagMap[level];

  const baseClasses = 'font-bold leading-tight';
  
  const sizeClasses = {
    1: 'text-4xl lg:text-5xl',
    2: 'text-3xl lg:text-4xl',
    3: 'text-2xl lg:text-3xl',
    4: 'text-xl lg:text-2xl',
    5: 'text-lg lg:text-xl',
    6: 'text-base lg:text-lg'
  };
  
  const variantClasses = {
    primary: 'text-foreground',
    secondary: 'text-muted-foreground',
    muted: 'text-muted-foreground/70'
  };
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[level]} ${variantClasses[variant]} ${alignClasses[align]} ${className}`;
  
  return (
    <HeadingTag className={combinedClasses}>
      {children}
    </HeadingTag>
  );
}
