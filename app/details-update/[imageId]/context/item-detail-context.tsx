'use client';

import { createContext, useContext, useState } from 'react';

interface ItemDetailContextType {
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
}

const ItemDetailContext = createContext<ItemDetailContextType | undefined>(undefined);

export function ItemDetailProvider({ children }: { children: React.ReactNode }) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  return (
    <ItemDetailContext.Provider value={{ selectedItemId, setSelectedItemId }}>
      {children}
    </ItemDetailContext.Provider>
  );
}

export function useItemDetail() {
  const context = useContext(ItemDetailContext);
  if (!context) {
    throw new Error('useItemDetail must be used within ItemDetailProvider');
  }
  return context;
} 