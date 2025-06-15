'use client';

import { Business } from '@/types/business';

// ▼ ここで onEdit を定義している ▼
interface BusinessCardProps {
  business: Business;
  onEdit: () => void;
}

// ▼ ここで onEdit を受け取っている ▼
export default function BusinessCard({ business, onEdit }: BusinessCardProps) {
  return (
    <button
      // ▼ ここで onEdit を使っている ▼
      onClick={onEdit}
      className="relative w-64 text-left transform transition-all duration-200 hover:scale-105"
    >
      <div className="relative bg-yellow-100 rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200">
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-yellow-200 transform rotate-45"></div>
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-200 transform rotate-45"></div>
        
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">{business.name}</h3>
        <div className="text-sm text-yellow-800/80 line-clamp-2">
          {business.fields[0]?.value || '詳細を表示'}
        </div>
      </div>
    </button>
  );
}