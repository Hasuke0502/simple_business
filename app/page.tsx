'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import BusinessModal from '@/components/BusinessModal';
import BusinessCard from '@/components/BusinessCard';
import { Business } from '@/types/business';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

  // データを保存する関数
  const saveBusinesses = (newBusinesses: Business[]) => {
    try {
      localStorage.setItem('businesses', JSON.stringify(newBusinesses));
      setBusinesses(newBusinesses);
    } catch (error) {
      console.error('データの保存に失敗しました:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBusiness(null);
  };

  const handleNewClick = () => {
    setEditingBusiness(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (business: Business) => {
    setEditingBusiness(business);
    setIsModalOpen(true);
  };

  // 削除ハンドラー
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  // 削除の確定
  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteConfirmId) {
      const newBusinesses = businesses.filter(b => b.id !== deleteConfirmId);
      saveBusinesses(newBusinesses);
      setDeleteConfirmId(null);
    }
  };

  // 削除のキャンセル
  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(null);
  };

  // 新規作成または編集を保存
  const handleSave = (data: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingBusiness) {
      // 既存のビジネスを更新
      const updatedBusinesses = businesses.map((b) =>
        b.id === editingBusiness.id
          ? { ...editingBusiness, ...data, updatedAt: new Date().toISOString() }
          : b
      );
      saveBusinesses(updatedBusinesses);
    } else {
      // 新規作成
      const newBusiness: Business = {
        ...data,
        id: `business-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveBusinesses([...businesses, newBusiness]);
    }
    handleCloseModal();
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-end">
          
          <button
            onClick={handleNewClick}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white 
                     rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all 
                     duration-200 font-medium text-sm sm:text-base"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
            }}
          >
            <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            <span className="whitespace-nowrap">新規ビジネスを作成</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {businesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              onClick={() => handleEditClick(business)}
              onDelete={(e) => handleDelete(business.id, e)}
            />
          ))}
        </div>

        {deleteConfirmId && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm shadow-xl border border-gray-200 relative">
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  本当に削除しますか？
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  この操作は取り消せません。
                </p>
                <div className="flex justify-center gap-3 sm:gap-4">
                  <button
                    onClick={cancelDelete}
                    className="px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                             rounded-md hover:bg-gray-200 transition-colors duration-200
                             border border-gray-300 shadow-sm"
                  >
                    いいえ
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 sm:px-6 py-2 text-sm font-medium text-white bg-red-500 
                             rounded-md hover:bg-red-600 transition-colors duration-200
                             shadow-sm"
                  >
                    はい
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <BusinessModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          initialData={editingBusiness}
        />
      </div>
    </main>
  );
}