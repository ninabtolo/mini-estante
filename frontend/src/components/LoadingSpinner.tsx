import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  className = '' 
}) => {
  const sizeClass = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  }[size];
  
  return (
    <div className={`loading-container ${className}`}>
      <div 
        className={`loading-spinner ${sizeClass}`}
        role="status"
        aria-label="Carregando"
      />
    </div>
  );
};

export default LoadingSpinner;
