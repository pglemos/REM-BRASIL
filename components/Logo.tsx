import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  layout?: 'vertical' | 'horizontal';
  theme?: 'light' | 'dark';
}

export function Logo({ className = "w-16 h-16", showText = true, layout = 'vertical', theme = 'light' }: LogoProps) {
  const textColorPrimary = theme === 'dark' ? 'text-rem-white' : 'text-[#0A2529]';
  const textRetoDe = theme === 'dark' ? 'text-rem-white' : 'text-[#37D2E2]';
  
  return (
    <div className={`flex ${layout === 'vertical' ? 'flex-col items-center text-center' : 'flex-row items-center text-left'}`}>
      <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 1. Cyan Shield */}
        <path d="M 30 50 L 100 90 L 170 50 C 170 130 140 175 100 185 C 60 175 30 130 30 50 Z" fill="#37D2E2"/>
        
        {/* 2. Orange Background (Mountain + Base) */}
        <path d="M 30 120 Q 60 100 90 85 L 105 105 L 125 65 Q 145 90 165 110 C 155 150 130 175 100 185 C 70 175 45 150 30 120 Z" fill="#F05A28"/>
        
        {/* 3. White Mountain */}
        <path d="M 30 120 Q 60 100 85 80 L 88 105 L 105 90 L 108 115 L 125 105 L 135 120 Q 90 140 30 120 Z" fill="#FFFFFF"/>
        
        {/* 4. White Swoosh */}
        <path d="M 35 140 C 70 150 110 150 145 135 C 110 160 70 160 35 140 Z" fill="#FFFFFF"/>
      </svg>
      
      {showText && (
        <div className={`flex flex-col justify-center ${layout === 'vertical' ? 'items-center mt-4' : 'items-start ml-4'}`}>
          <span className={`${textRetoDe} font-extrabold text-[1.2rem] md:text-[1.4rem] tracking-[0.2em] leading-[1.1] mb-1`}>RETO DE</span>
          <span className={`${textColorPrimary} font-extrabold text-[1.1rem] md:text-[1.3rem] tracking-[0.02em] leading-[1.1] mb-1`}>EMPODERAMIENTO</span>
          <span className={`${textColorPrimary} font-extrabold text-[1.1rem] md:text-[1.3rem] tracking-[0.02em] leading-[1.1] mb-2`}>MATRIMONIAL</span>
          <span className="text-[#9CA3AF] font-light text-[0.9rem] md:text-[1rem] tracking-wide">Propuesta</span>
        </div>
      )}
    </div>
  );
}
