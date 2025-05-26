'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  name: string;
  href: string;
}

const navigation: NavItem[] = [
  {
    name: 'Zamówienia',
    href: '/dashboard/orders',
  },
  {
    name: 'Kurierzy',
    href: '/dashboard/couriers',
  },
  {
    name: 'Archiwum',
    href: '/dashboard/archive',
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut, isLoading } = useAuth();
  
  return (
    <div className="flex h-screen flex-col justify-between bg-white border-r border-gray-200 w-64">
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
          <h1 className="text-lg font-medium text-gray-900">Smart Delivery Routes</h1>
        </div>
        <div className="flex flex-col flex-grow overflow-y-auto pt-8">
          <nav className="flex-1 px-6 space-y-6">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-800 hover:bg-indigo-500 hover:text-white'
                  } flex items-center justify-center py-3 text-lg font-bold rounded-lg transition-all duration-200 ease-in-out`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <button
          onClick={() => signOut()}
          disabled={isLoading}
          className="flex w-full items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Wylogowywanie...
            </>
          ) : (
            'Wyloguj się'
          )}
        </button>
      </div>
    </div>
  );
}
