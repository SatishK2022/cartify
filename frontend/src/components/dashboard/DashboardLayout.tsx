'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, MapPin, Star, User, Shield, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../ui/Toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast('Logged Out Successfully', 'info');
    router.push('/login');
  };

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
    { label: 'My Reviews', href: '/dashboard/reviews', icon: Star },
    { label: 'Profile', href: '/dashboard/settings/profile', icon: User },
    { label: 'Security', href: '/dashboard/settings/security', icon: Shield },
  ];

  return (
    <div className="bg-surface py-10 flex-1 flex flex-col justify-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
          
          <div className="flex flex-col lg:flex-row gap-8 items-start flex-1">
            
            {/* Sidebar Navigation - Desktop view */}
            <aside className="hidden lg:flex w-64 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex-col justify-between shrink-0">
              <div className="flex flex-col gap-1.5">
                {/* User card info */}
                <div className="flex items-center gap-3 pb-5 mb-4 border-b border-gray-100">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop"}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-snug">{user?.name || 'Guest User'}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-none">{user?.email}</p>
                  </div>
                </div>

                {/* Nav list */}
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150
                        ${isActive
                          ? 'bg-primary text-white shadow-orange'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Log out */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-red-650 hover:text-red-700 hover:bg-red-50 mt-6 focus:outline-none transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </aside>

            {/* Sidebar Navigation - Mobile view */}
            <aside className="flex lg:hidden flex-col w-full bg-white border border-gray-100 rounded-2xl p-4 shadow-sm shrink-0">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop"}
                    alt={user?.name}
                    className="w-9 h-9 rounded-full object-cover border border-gray-100"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-snug">{user?.name || 'Guest User'}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-none">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-red-650 hover:bg-red-50 focus:outline-none transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Horizontally scrollable navigation tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-3 w-full scrollbar-none -mx-1 px-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`
                        flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0
                        ${isActive
                          ? 'bg-primary text-white shadow-orange'
                          : 'text-gray-600 bg-gray-50 hover:bg-gray-100/80 border border-gray-100/60'
                        }
                      `}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </aside>

            {/* Dashboard Content Workspace */}
            <main className="flex-1 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col min-h-[480px]">
              {children}
            </main>

          </div>
        </div>
      </div>
  );
}
