'use client';

import { useEffect, useState } from 'react';
import { provideAPI } from '@/lib/api/provide';
import { DetailPageState, ItemDocument } from '@/types/model';

export function ProvideTest() {
  const [detailState, setDetailState] = useState<DetailPageState | null>(null);
  const [items, setItems] = useState<ItemDocument[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 테스트용 이미지 ID - 실제 테스트할 ID로 변경 필요
  const testImageId = 'test-image-1';

  useEffect(() => {
    async function fetchData() {
      try {
        const detailResponse = await provideAPI.getDetailPageState(testImageId);
        setDetailState(detailResponse.data);

        const itemsResponse = await provideAPI.getImageItems(testImageId);
        setItems(itemsResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Provide API Error:', err);
      }
    }

    fetchData();
  }, []);

  return (
    <section className="w-full max-w-[1280px] mx-auto py-16 px-4">
      <h2 className="text-2xl font-bold mb-8">Provide API Test</h2>
      
      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded mb-4">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Detail State */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Detail Page State</h3>
          <div className="bg-gray-50 rounded p-4 h-[300px] overflow-auto">
            <pre className="text-sm">
              {detailState ? JSON.stringify(detailState, null, 2) : 'Loading...'}
            </pre>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Image Items ({items.length})</h3>
          <div className="space-y-4 h-[300px] overflow-auto">
            {items.length > 0 ? (
              items.map((item, index) => (
                <div key={index} className="border rounded p-4">
                  <div className="flex items-start gap-4">
                    {item.imgUrl && (
                      <img
                        src={item.imgUrl}
                        alt={item.metadata.name || 'Item image'}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div>
                      <h4 className="font-medium">
                        {item.metadata.name || 'Unnamed Item'}
                      </h4>
                      {item.metadata.brand && (
                        <p className="text-sm text-gray-600">
                          Brand: {item.metadata.brand}
                        </p>
                      )}
                      {item.metadata.category && (
                        <p className="text-sm text-gray-600">
                          Category: {item.metadata.category}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items found</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 