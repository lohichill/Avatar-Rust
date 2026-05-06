"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  Users, 
  Bell, 
  User, 
  Search, 
  Menu 
} from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <h1 className="text-lg font-bold text-blue-600">Avatar 2.0</h1>
        </div>
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-500 cursor-pointer" />
          <Menu className="w-5 h-5 text-gray-500 cursor-pointer" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 px-4 pt-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 flex justify-around items-center z-50 shadow-lg">
        <Link 
          href="/feed" 
          className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-xl"
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] mt-1">Feed</span>
        </Link>
        <Link 
          href="/friends" 
          className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-xl"
        >
          <Users className="w-6 h-6" />
          <span className="text-[10px] mt-1">Friends</span>
        </Link>
        <Link 
          href="/notifications" 
          className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-xl"
        >
          <Bell className="w-6 h-6" />
          <span className="text-[10px] mt-1">Notifications</span>
        </Link>
        <Link 
          href="/profile" 
          className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-xl"
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
