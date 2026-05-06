"use client";

import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
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
  );
}
