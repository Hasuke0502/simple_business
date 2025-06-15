'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import BusinessModal from '@/components/BusinessModal';
import BusinessCard from '@/components/BusinessCard';
import { Business } from '@/types/business';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

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

  const handleSave = (data: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingBusiness) {
      setBusinesses(
        businesses.map((b) =>
          b.id === editingBusiness.id
            ? { ...editingBusiness, ...data, updatedAt: new Date().toISOString() }
            : b
        )
      );
    } else {
      const newBusiness: Business = {
        ...data,
        id: `business-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setBusinesses([...businesses, newBusiness]);
    }
    handleCloseModal();
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 hidden sm:block">Simplify your business</h1>
          <button
            onClick={() => {
              setEditingBusiness(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-200 font-medium"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
            }}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            新規ビジネスを作成
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {businesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              // ▼ ここが onEdit になっていることを確認 ▼
              onEdit={() => handleEditClick(business)}
            />
          ))}
        </div>

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