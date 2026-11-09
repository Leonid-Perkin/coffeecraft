import React from 'react';

interface CyberOwlLogoProps {
  className?: string;
  size?: number;
  variant?: 'coffee' | 'tea';
}

export const CyberOwlLogo: React.FC<CyberOwlLogoProps> = ({
  className = 'w-7 h-7',
  size = 28,
  variant = 'coffee',
}) => {
  const isTea = variant === 'tea';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`cyberOwlGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isTea ? '#6ee7b7' : '#f5be7e'} />
          <stop offset="60%" stopColor={isTea ? '#10b981' : '#d48b46'} />
          <stop offset="100%" stopColor={isTea ? '#047857' : '#9c551c'} />
        </linearGradient>
        <linearGradient id={`eyeGlow-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isTea ? '#f0fdf4' : '#fff8e7'} />
          <stop offset="100%" stopColor={isTea ? '#34d399' : '#f5be7e'} />
        </linearGradient>
      </defs>

      {/* Cybernetic Owl Head Contour */}
      <path
        d="M6 9L11 4L16 8L21 4L26 9L27 19L22 28L16 26L10 28L5 19L6 9Z"
        fill={isTea ? '#0b1910' : '#1a100a'}
        stroke={`url(#cyberOwlGrad-${variant})`}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Forehead V-plate (feathers & brows) */}
      <path
        d="M11 4L16 13L21 4"
        stroke={`url(#cyberOwlGrad-${variant})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Left Owl Eye Hexagon */}
      <polygon
        points="11,13 14,15 14,19 11,21 8,19 8,15"
        fill={isTea ? '#14291a' : '#261710'}
        stroke={isTea ? '#34d399' : '#d48b46'}
        strokeWidth="1.2"
      />
      {/* Left Glowing Pupil */}
      <circle cx="11" cy="17" r="2.2" fill={`url(#eyeGlow-${variant})`} />
      <circle cx="11" cy="17" r="1" fill={isTea ? '#09150d' : '#140d09'} />

      {/* Right Owl Eye Hexagon */}
      <polygon
        points="21,13 24,15 24,19 21,21 18,19 18,15"
        fill={isTea ? '#14291a' : '#261710'}
        stroke={isTea ? '#34d399' : '#d48b46'}
        strokeWidth="1.2"
      />
      {/* Right Glowing Pupil */}
      <circle cx="21" cy="17" r="2.2" fill={`url(#eyeGlow-${variant})`} />
      <circle cx="21" cy="17" r="1" fill={isTea ? '#09150d' : '#140d09'} />

      {/* Cyber Beak */}
      <path
        d="M14 18L16 23L18 18"
        stroke={`url(#cyberOwlGrad-${variant})`}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={isTea ? '#10b981' : '#d48b46'}
        fillOpacity="0.3"
      />

      {/* Tech Accent Micro-ticks */}
      <line
        x1="16"
        y1="24"
        x2="16"
        y2="26"
        stroke={isTea ? '#6ee7b7' : '#f5be7e'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="6" cy="9" r="1.2" fill={isTea ? '#6ee7b7' : '#f5be7e'} />
      <circle cx="26" cy="9" r="1.2" fill={isTea ? '#6ee7b7' : '#f5be7e'} />
    </svg>
  );
};
