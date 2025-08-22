import { ImageProxyTest } from '@/components/ImageProxyTest';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Test Laboratory
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Testing various components and features
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Image Proxy Testing
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Testing image proxy functionality, loading states, and error handling
              </p>
            </div>
            <div className="p-6">
              <ImageProxyTest />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}