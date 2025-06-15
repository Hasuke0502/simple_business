'use client';

import { Business } from '@/types/business';

interface BusinessCardProps {
  business: Business;
  onClick: () => void;  // onEditからonClickに変更
}

export default function BusinessCard({ business, onClick }: BusinessCardProps) {  // onEditからonClickに変更
  return (
    <button
      onClick={onClick}  // onEditからonClickに変更
      className="relative w-64 text-left transform transition-all duration-200 hover:scale-105"
    >
      // ... 残りのコードは変更なし ...
    </button>
  );
}