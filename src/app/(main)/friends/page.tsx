"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { UserPlus, MessageSquare, User as UserIcon } from 'lucide-react';

// Mock data cho bạn bè
const MOCK_FRIENDS = [
  {
    id: 'u2',
    username: 'Ba_Lộc',
    level: 99,
    avatar_url: null,
    status: 'Online',
  },
  {
    id: 'u3',
    username: 'User_Random',
    level: 1,
    avatar_url: null,
    status: 'Offline',
  },
  {
    id: 'u4',
    username: 'NextJS_Expert',
    level: 45,
    avatar_url: null,
    status: 'Online',
  },
];

// Mock data cho gợi ý kết bạn
const MOCK_SUGGESTIONS = [
  {
    id: 'u5',
    username: 'Rust_Dev',
    level: 30,
    avatar_url: null,
    status: 'Online',
  },
  {
    id: 'u6',
    username: 'TypeScript_King',
    level: 12,
    avatar_url: null,
    status: 'Offline',
  },
];

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<'friends' | 'suggestions'>('friends');

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-800 px-1">Bạn bè</h2>
      
      {/* Tabs */}
      <div className="flex bg-gray-200 p-1 rounded-xl">
        <button 
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'friends' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Bạn bè
        </button>
        <button 
          onClick={() => setActiveTab('suggestions')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'suggestions' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Gợi ý kết bạn
        </button>
      </div>

      {/* Friends List */}
      <div className="flex flex-col gap-3">
        {activeTab === 'friends' ? (
          MOCK_FRIENDS.map((friend) => (
            <div key={friend.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-gray-600">
                  {friend.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-800">{friend.username}</span>
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] rounded-full font-medium">
                      Lv.{friend.level}
                    </span>
                  </div>
                  <span className={`text-[10px] ${friend.status === 'Online' ? 'text-green-500' : 'text-gray-400'}`}>
                    {friend.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-colors" title="Nhắn tin">
                  <MessageSquare className="w-4 h-4" />
                </button>
                <Link 
                  href={`/profile/${friend.id}`} 
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-colors"
                  title="Xem profile"
                >
                  <UserIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          MOCK_SUGGESTIONS.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-gray-600">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-800">{user.username}</span>
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] rounded-full font-medium">
                      Lv.{user.level}
                    </span>
                  </div>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                <UserPlus className="w-4 h-4" />
                Kết bạn
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
