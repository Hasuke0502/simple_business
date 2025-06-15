'use client';

import { Business } from '@/types/business';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface BusinessCardProps {
  business: Business;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export default function BusinessCard({ business, onClick, onDelete }: BusinessCardProps) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="relative w-full text-left transform transition-all duration-200 hover:scale-105"
      >
        <div className="relative bg-yellow-100 rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200">
          {/* 左上の付箋の折り目 */}
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-yellow-200 transform rotate-45"></div>
          {/* 右上の付箋の折り目 */}
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-200 transform rotate-45"></div>
          
          {/* ビジネス名 */}
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">{business.name}</h3>
          
          {/* 最初のフィールドの内容を表示 */}
          <div className="text-sm text-yellow-800/80 line-clamp-2">
            {business.fields[0]?.value || '詳細を表示'}
          </div>

          {/* 作成日時 */}
          <div className="mt-2 text-xs text-yellow-700/60">
            {new Date(business.createdAt).toLocaleDateString('ja-JP')}
          </div>
        </div>
      </button>

      {/* 削除ボタン - 常に表示、色を強調 */}
      <button
        onClick={onDelete}
        className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full 
                 transition-all duration-200 hover:bg-red-700 hover:scale-110 transform
                 shadow-lg border-2 border-white z-10"
        title="このビジネスを削除"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}