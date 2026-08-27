import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyle =
    'px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-100 cursor-pointer pointer-events-auto border-2';
  const variants = {
    primary:
      'bg-[#E056FD] text-black border-[#E056FD] hover:bg-white hover:text-black shadow-[0_0_15px_rgba(224,86,253,0.3)]',
    secondary:
      'bg-black text-[#E056FD] border-[#333] hover:border-[#E056FD] hover:bg-[#E056FD]/10',
    danger:
      'bg-[#FF003C] text-black border-[#FF003C] hover:bg-white hover:text-black shadow-[0_0_15px_rgba(255,0,60,0.3)]',
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};