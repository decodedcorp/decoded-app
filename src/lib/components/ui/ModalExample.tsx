'use client';
import React, { useState } from 'react';

import { Modal } from './Modal';

// 예: 모달 열기 버튼 있는 카드 목록
export function ModalExample() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <button 
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        onClick={() => setOpen(true)}
      >
        Open Modal
      </button>

      <Modal 
        open={open} 
        onClose={() => setOpen(false)} 
        titleId="example-modal-title" 
        descId="example-modal-desc"
        size="md"
      >
        <div className="p-6">
          <h2 id="example-modal-title" className="text-xl font-semibold text-gray-900">
            Edit Item
          </h2>
          <p id="example-modal-desc" className="mt-1 text-sm text-gray-500">
            Update properties of your item.
          </p>
          
          <form className="mt-4 space-y-4" onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
          }}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input 
                id="name"
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                placeholder="Enter name"
                autoFocus
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea 
                id="description"
                rows={3}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                placeholder="Enter description"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}