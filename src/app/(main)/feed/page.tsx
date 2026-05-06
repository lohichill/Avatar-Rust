"use client";

import React, { useState } from 'react';
import { Image, MessageCircle, Heart, Share2, Send } from 'lucide-react';
import { User, Post } from '@/types';

// Mock data for feed
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    user_id: 'u1',
    content: 'Chào mọi người! Mình vừa mới join Avatar 2.0. Rất vui được làm quen với tất cả các bạn! 🌸',
    created_at: '2026-05-06T10:00:00Z',
    user: {
      id: 'u1',
      username: 'Min_Digital',
      email: 'min@openclaw.ai',
      avatar_url: null,
      level: 10,
    },
    likes_count: 12,
    comments_count: 5,
  },
  {
    id: '2',
    user_id: 'u2',
    content: 'Học Next.js và Rust thật là thú vị! Có ai đang cùng nghiên cứu không? 🚀',
    created_at: '2026-05-06T11:30:00Z',
    user: {
      id: 'u2',
      username: 'Ba_Lộc',
      email: 'loc@lohi.io.vn',
      avatar_url: null,
      level: 99,
    },
    likes_count: 45,
    comments_count: 18,
  },
  {
    id: '3',
    user_id: 'u3',
    content: 'Thời tiết hôm nay thật tuyệt vời để đi dạo. Chúc mọi người một ngày làm việc hiệu quả nhé! ☀️',
    created_at: '2026-05-06T12:15:00Z',
    user: {
      id: 'u3',
      username: 'User_Random',
      email: 'random@example.com',
      avatar_url: null,
      level: 1,
    },
    likes_count: 8,
    comments_count: 2,
  },
];

export default function FeedPage() {
  const [postContent, setPostContent] = useState('');

  return (
    <div className="flex flex-col gap-6">
      {/* Post creation box */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center text-blue-600 font-bold">
            M
          </div>
          <div className="flex-1">
            <textarea
              placeholder="Chia sẻ điều gì đó..."
              className="w-full p-2 text-sm border-none focus:ring-0 resize-none text-black bg-transparent"
              rows={3}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button 
                className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full hover:bg-blue-700 transition-colors"
                onClick={() => {
                  alert('Tính năng đăng bài sẽ sớm ra mắt khi có API!');
                  setPostContent('');
                }}
              >
                Đăng bài
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts list */}
      <div className="flex flex-col gap-4">
        {MOCK_POSTS.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-gray-600">
                {post.user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-800">{post.user?.username}</span>
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] rounded-full font-medium">
                    Lv.{post.user?.level}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400">
                  {new Date(post.created_at).toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              {post.content}
            </p>
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <div className="flex gap-4">
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors text-xs">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes_count}</span>
                </button>
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors text-xs">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments_count}</span>
                </button>
              </div>
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors text-xs">
                <Share2 className="w-4 h-4" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
