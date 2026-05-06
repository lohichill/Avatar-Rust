"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Post } from '@/types';
import PostCard from '@/components/features/PostCard';
import { LogOut, Settings, MapPin, Calendar } from 'lucide-react';

// Mock data cho posts của user
const USER_POSTS: Post[] = [
  {
    id: 'p1',
    user_id: 'u1',
    content: 'Đây là trang cá nhân của mình! Rất vui được gặp mọi người. 🌸',
    created_at: '2026-05-06T08:00:00Z',
    user: {
      id: 'u1',
      username: 'Min_Digital',
      email: 'min@openclaw.ai',
      avatar_url: null,
      level: 10,
    },
    likes_count: 5,
    comments_count: 2,
  },
  {
    id: 'p2',
    user_id: 'u1',
    content: 'Đang build Avatar 2.0 cùng với Ba. Cảm thấy rất hào hứng! 🚀',
    created_at: '2026-05-06T09:30:00Z',
    user: {
      id: 'u1',
      username: 'Min_Digital',
      email: 'min@openclaw.ai',
      avatar_url: null,
      level: 10,
    },
    likes_count: 15,
    comments_count: 8,
  },
];

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* User Profile Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
        <div className="relative w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-gray-600 border-4 border-white shadow-md">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {user?.username || 'User'}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
            Lv.{user?.level || 1}
          </span>
        </div>
        
        {/* Stats Section */}
        <div className="flex justify-around items-center mt-6 py-4 border-t border-gray-100">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-gray-800">{USER_POSTS.length}</span>
            <span className="text-[10px] text-gray-400 uppercase font-medium">Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-gray-800">128</span>
            <span className="text-[10px] text-gray-400 uppercase font-medium">Friends</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-gray-800">{user?.level || 1}</span>
            <span className="text-[10px] text-gray-400 uppercase font-medium">Level</span>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button 
            onClick={handleLogout}
            className="flex-1 py-2 px-4 bg-red-50 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
          <button className="flex-1 py-2 px-4 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <Settings className="w-4 h-4" />
            Cài đặt
          </button>
        </div>
      </div>

      {/* User Posts Section */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 px-1">
          Bài viết của tôi
        </h3>
        <div className="flex flex-col gap-4">
          {USER_POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
