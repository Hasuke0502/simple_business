'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlusIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { Business, BusinessField, DEFAULT_FIELDS } from '@/types/business';

interface BusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; fields: { id: string; label: string; value: string }[] }) => void;
  initialData: Business | null;
}

export default function BusinessModal({ isOpen, onClose, onSave, initialData }: BusinessModalProps) {
  const [name, setName] = useState('');
  const [fields, setFields] = useState<BusinessField[]>([]);
  const [draggedField, setDraggedField] = useState<string | null>(null);

  // モーダルが開かれるたびにデータを初期化
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setFields(initialData.fields);
    } else {
      setName('');
      setFields(DEFAULT_FIELDS.map((field, index) => ({
        ...field,
        id: `field-${index}`,
        value: '',
      })));
    }
  }, [initialData, isOpen]);

  const handleAddField = () => {
    const newField: BusinessField = {
      id: `field-${Date.now()}`,
      label: '',
      value: '',
      isCustom: true,
    };
    setFields([...fields, newField]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleFieldChange = (id: string, key: 'label' | 'value', value: string) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  const handleDragStart = (id: string) => {
    setDraggedField(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedField || draggedField === targetId) return;

    const draggedIndex = fields.findIndex(f => f.id === draggedField);
    const targetIndex = fields.findIndex(f => f.id === targetId);
    const newFields = [...fields];
    const [draggedItem] = newFields.splice(draggedIndex, 1);
    newFields.splice(targetIndex, 0, draggedItem);

    setFields(newFields);
    setDraggedField(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      fields: fields.filter(field => field.label.trim() !== ''),
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-yellow-50 p-6 text-left align-middle shadow-xl transition-all border-2 border-yellow-200">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-yellow-200 transform rotate-45"></div>
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-200 transform rotate-45"></div>

                <Dialog.Title as="h3" className="text-lg font-medium text-yellow-900 mb-4">
                  {initialData ? 'ビジネスを編集' : '新規ビジネス作成'}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ビジネス名を入力"
                      className="mt-1 block w-full rounded-md border-yellow-200 bg-yellow-50 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 sm:text-sm placeholder-yellow-800/50"
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    {fields.map((field) => (
                      <div
                        key={field.id}
                        draggable
                        onDragStart={() => handleDragStart(field.id)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(field.id)}
                        className="group relative flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 transition-all hover:border-yellow-400"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <ArrowsUpDownIcon className="h-5 w-5 cursor-move text-yellow-600/50" />
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                              placeholder="項目名"
                              className="block w-full rounded-md border-yellow-200 bg-yellow-50 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 sm:text-sm placeholder-yellow-800/50"
                            />
                          </div>
                          <textarea
                            value={field.value}
                            onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
                            placeholder="内容"
                            className="mt-2 block w-full rounded-md border-yellow-200 bg-yellow-50 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 sm:text-sm placeholder-yellow-800/50"
                            rows={2}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveField(field.id)}
                          className="absolute right-2 top-2 p-1 text-yellow-600/50 opacity-0 hover:text-red-500 group-hover:opacity-100"
                          title="項目を削除"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddField}
                    className="mt-4 flex items-center text-sm text-yellow-700 hover:text-yellow-800"
                  >
                    <PlusIcon className="mr-1 h-4 w-4" />
                    項目を追加
                  </button>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-yellow-900 hover:bg-yellow-500"
                    >
                      {initialData ? '更新' : '作成'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 