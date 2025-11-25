import { ReactNode } from "react";

export interface HeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  cta: ReactNode;
}

export interface StatsCardProps {
  value: string | number;
  label: string;
  sublabel?: string;
}

export interface UserTestimonialCardProp{
    text:string;
    name:string;
    role:string
}

export interface TestimonialCardProp{
    quote : string;
    author:string;
    role:string;
}

export interface FeatureCardProp{
    icon:string;
    title:string;
    description:string;
    color:string
}



