'use client';

import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import BusinessCard from '@/components/BusinessCard';
import BusinessModal from '@/components/BusinessModal';
import { Business } from '@/types/business';

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  // ローカルストレージからデータを読み込む
  useEffect(() => {
    const loadBusinesses = () => {
      try {
        const saved = localStorage.getItem('businesses');
        if (saved) {
          const parsed = JSON.parse(saved);
          setBusinesses(parsed);
        }
      } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
      }
    };

    loadBusinesses();
  }, []);

  // データを保存する
  const saveBusinesses = (newBusinesses: Business[]) => {
    try {
      localStorage.setItem('businesses', JSON.stringify(newBusinesses));
      setBusinesses(newBusinesses);
    } catch (error) {
      console.error('データの保存に失敗しました:', error);
    }
  };

  // 新規作成または編集を保存
  const handleSave = (data: { name: string; fields: { id: string; label: string; value: string }[] }) => {
    const now = new Date().toISOString();
    let newBusinesses: Business[];
    
    if (selectedBusiness) {
      // 既存のビジネスを更新
      newBusinesses = businesses.map(b => 
        b.id === selectedBusiness.id
          ? { ...b, ...data, updatedAt: now }
          : b
      );
    } else {
      // 新規作成
      const newBusiness: Business = {
        id: `business-${Date.now()}`,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      newBusinesses = [...businesses, newBusiness];
    }
    
    saveBusinesses(newBusinesses);
    setIsModalOpen(false);
    setSelectedBusiness(null);
  };

  // ビジネスを削除
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newBusinesses = businesses.filter(b => b.id !== id);
    saveBusinesses(newBusinesses);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 新規作成ボタン */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-900">Simplify your business</h1>
          <button
            onClick={() => {
              setSelectedBusiness(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-6 py-3 bg-yellow-400 text-yellow-900 rounded-lg shadow-md hover:bg-yellow-500 hover:shadow-lg transition-all duration-200 font-medium"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              boxShadow: '0 2px 4px rgba(245, 158, 11, 0.2)'
            }}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            新規ビジネスを作成
          </button>
        </div>

        {/* ビジネスカード一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">ビジネス情報がありません。新規作成ボタンから追加してください。</p>
            </div>
          ) : (
            businesses.map((business) => (
              <div key={business.id} className="relative group">
                <BusinessCard
                  business={business}
                  onClick={() => {
                    setSelectedBusiness(business);
                    setIsModalOpen(true);
                  }}
                  onDelete={(e) => handleDelete(business.id, e)}
                />
              </div>
            ))
          )}
        </div>

        {/* モーダル */}
        <BusinessModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBusiness(null);
          }}
          onSave={handleSave}
          initialData={selectedBusiness}
        />
      </div>
    </main>
  );
} 