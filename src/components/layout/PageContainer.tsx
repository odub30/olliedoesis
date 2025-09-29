// src/components/layout/PageContainer.tsx
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl';
  padding?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
};

export function PageContainer({ 
  children, 
  className = '', 
  maxWidth = '7xl',
  padding = true 
}: PageContainerProps) {
  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8 py-8' : '';
  
  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
}