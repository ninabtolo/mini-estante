import React from 'react';

interface CardProps {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  footer,
  children,
  className = '',
  onClick,
}) => {
  return (
    <div 
      className={`card ${className} ${onClick ? 'cursor-pointer' : ''}`} 
      onClick={onClick}
    >
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
