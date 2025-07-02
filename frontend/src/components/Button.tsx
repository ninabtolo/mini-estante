import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  ...props
}) => {
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'md' ? '' : `btn-${size}`;
  
  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="loading-spinner w-4 h-4 border-2 mr-2"></span>
      ) : icon ? (
        <span className="button-icon">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
