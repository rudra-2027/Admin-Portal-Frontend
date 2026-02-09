import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = true,
  onClick,
  ...props
}) => {
  const Component = motion.div;

  return (
    <Component
      className={`
        relative rounded-2xl p-6
        bg-base-200/70 backdrop-blur-md
        border border-base-300/50
        shadow-sm
        transition-all duration-300
        ${hover ? 'hover:shadow-xl hover:border-accent/40' : ''}
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        ${className}
      `}
      whileHover={hover ? { y: -6 } : {}}
      whileTap={onClick ? { scale: 0.97 } : {}}
      onClick={onClick}
      {...props}
    >
      {children}

      {/* Subtle glow */}
      {hover && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl 
          opacity-0 hover:opacity-100 transition-opacity duration-300
          bg-gradient-to-br from-accent/10 via-transparent to-transparent"
        />
      )}
    </Component>
  );
};

export default Card;
