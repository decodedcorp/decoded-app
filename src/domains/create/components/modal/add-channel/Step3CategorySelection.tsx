import React, { useState, useEffect } from 'react';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
import { useSimpleCategories } from '../../../../channels/hooks/useCategories';

interface Step3Data {
  selectedCategory: string;
  selectedSubcategory: string;
}

interface Step3CategorySelectionProps {
  data: Step3Data;
  onDataChange?: (data: Step3Data) => void;
}

export function Step3CategorySelection({ data, onDataChange }: Step3CategorySelectionProps) {
  const t = useCommonTranslation();
  const [formData, setFormData] = useState<Step3Data>(data);
  const { data: categoriesResponse, isLoading, error } = useSimpleCategories();

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleCategorySelect = (categoryName: string) => {
    const newData = {
      selectedCategory: categoryName,
      selectedSubcategory: '', // Reset subcategory when main category changes
    };
    setFormData(newData);

    if (onDataChange) {
      onDataChange(newData);
    }
  };

  const handleSubcategorySelect = (subcategoryName: string) => {
    const newData = {
      ...formData,
      selectedSubcategory: subcategoryName,
    };
    setFormData(newData);

    if (onDataChange) {
      onDataChange(newData);
    }
  };

  // Get current category data for subcategories
  const currentCategory = categoriesResponse?.categories?.find(
    (cat) => cat.category === formData.selectedCategory,
  );
  const subcategories = currentCategory?.subcategories || [];

  if (isLoading) {
    return (
      <div className="flex gap-6 max-w-full mx-auto">
        <div className="flex-1">
          <div className="text-left mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {t.globalContentUpload.addChannel.step3.title()}
            </h2>
            <p className="text-zinc-400">
              {t.globalContentUpload.addChannel.step3.loadingCategories()}
            </p>
          </div>

          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-zinc-700 rounded w-1/4"></div>
            <div className="grid grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-zinc-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex gap-6 max-w-full mx-auto">
        <div className="flex-1">
          <div className="text-left mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {t.globalContentUpload.addChannel.step3.title()}
            </h2>
            <p className="text-zinc-400">{t.globalContentUpload.addChannel.step3.failedToLoad()}</p>
          </div>

          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">
              {t.globalContentUpload.addChannel.step3.errorLoading()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 max-w-full mx-auto">
      {/* Left side - Category Selection */}
      <div className="flex-1">
        <div className="text-left mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {t.globalContentUpload.addChannel.step3.title()}
          </h2>
          <p className="text-zinc-400">{t.globalContentUpload.addChannel.step3.subtitle()}</p>
        </div>

        {/* Categories with inline subcategories */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {t.globalContentUpload.addChannel.step3.chooseCategory()}
          </h3>
          <div className="space-y-3">
            {categoriesResponse?.categories?.map((category) => (
              <div key={category.category} className="space-y-3">
                {/* Main Category Button */}
                <button
                  onClick={() => handleCategorySelect(category.category)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    formData.selectedCategory === category.category
                      ? 'bg-[#eafd66] text-black'
                      : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white'
                  }`}
                >
                  <div className="font-medium">{category.category}</div>
                  <div className="text-sm opacity-75">
                    {category.subcategories?.length || 0}{' '}
                    {t.globalContentUpload.addChannel.step3.subcategories()}
                  </div>
                </button>

                {/* Subcategories - show only for selected category */}
                {formData.selectedCategory === category.category &&
                  category.subcategories &&
                  category.subcategories.length > 0 && (
                    <div className="ml-4 grid grid-cols-2 gap-2">
                      {category.subcategories.map((subcategory) => (
                        <button
                          key={subcategory}
                          onClick={() => handleSubcategorySelect(subcategory)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            formData.selectedSubcategory === subcategory
                              ? 'bg-[#eafd66] text-black'
                              : 'bg-zinc-600 text-zinc-300 hover:bg-zinc-500 hover:text-white'
                          }`}
                        >
                          {subcategory}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Channel Preview */}
      <div className="flex-1">
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-700/50 overflow-hidden">
          {/* Banner section - placeholder */}
          <div className="h-32 bg-gradient-to-r from-zinc-700 to-zinc-600"></div>

          {/* Channel info section */}
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">
                {t.globalContentUpload.addChannel.step3.preview.channelName()}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-zinc-400 mb-4">
                <span>{t.globalContentUpload.addChannel.step3.preview.newChannel()}</span>
                <span>•</span>
                <span>0 {t.globalContentUpload.addChannel.step3.preview.subscribers()}</span>
              </div>
              <div className="text-zinc-300 text-sm mb-4">
                {t.globalContentUpload.addChannel.step3.preview.descriptionPlaceholder()}
              </div>
            </div>

            {/* Selected Category Display */}
            {formData.selectedCategory && (
              <div>
                <h4 className="text-sm font-medium text-zinc-300 mb-3">
                  {t.globalContentUpload.addChannel.step3.category()}
                </h4>
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-[#eafd66]/20 text-[#eafd66] text-sm rounded-full border border-[#eafd66]/30">
                    {formData.selectedCategory}
                  </span>
                  {formData.selectedSubcategory && (
                    <span className="inline-block ml-2 px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30">
                      {formData.selectedSubcategory}
                    </span>
                  )}
                </div>
              </div>
            )}

            {!formData.selectedCategory && (
              <div className="text-zinc-500 text-sm">
                {t.globalContentUpload.addChannel.step3.noCategorySelected()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
