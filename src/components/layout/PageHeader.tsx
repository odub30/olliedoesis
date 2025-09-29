// src/components/layout/PageHeader.tsx
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  children, 
  className = '' 
}: PageHeaderProps) {
  return (
    <div className={`border-b border-gray-200 pb-8 mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-xl text-gray-600 max-w-3xl">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="mt-6 sm:mt-0 sm:ml-6 flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}