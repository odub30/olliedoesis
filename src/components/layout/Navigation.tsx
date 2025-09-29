// src/components/layout/Navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  name: string;
  href: string;
  description?: string;
}

interface NavigationProps {
  items: NavigationItem[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Navigation({ 
  items, 
  orientation = 'horizontal', 
  className = '' 
}: NavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const baseClasses = orientation === 'horizontal' 
    ? 'flex items-center space-x-8' 
    : 'flex flex-col space-y-2';

  return (
    <nav className={`${baseClasses} ${className}`}>
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
            isActive(item.href)
              ? 'text-blue-600'
              : 'text-gray-700 hover:text-blue-600'
          }`}
        >
          {item.name}
          {isActive(item.href) && orientation === 'horizontal' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
          )}
          {isActive(item.href) && orientation === 'vertical' && (
            <span className="absolute left-0 top-0 w-0.5 h-full bg-blue-600 rounded-full" />
          )}
        </Link>
      ))}
    </nav>
  );
}