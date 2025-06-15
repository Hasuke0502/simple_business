export interface BusinessField {
  id: string;
  label: string;
  value: string;
  isCustom?: boolean;
}

export interface Business {
  id: string;
  name: string;
  fields: BusinessField[];
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_FIELDS: Omit<BusinessField, 'id' | 'value'>[] = [
  { label: '商品・サービス', isCustom: false },
  { label: 'ペルソナ', isCustom: false },
  { label: 'インサイト', isCustom: false },
  { label: '請求額', isCustom: false },
  { label: '支払いを受ける方法', isCustom: false },
  { label: '広告方法', isCustom: false },
]; 