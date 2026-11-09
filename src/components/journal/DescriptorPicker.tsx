import React, { useState } from 'react';
import { FLAVOR_CATEGORIES } from '../../data/descriptors';
import { Tag, Search, X, Check } from 'lucide-react';

interface DescriptorPickerProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const DescriptorPicker: React.FC<DescriptorPickerProps> = ({ selected, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const toggleDescriptor = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((s) => s !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  const filteredCategories = FLAVOR_CATEGORIES.map((cat) => {
    return {
      ...cat,
      items: cat.items.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase().trim())
      ),
    };
  }).filter((cat) => (activeCategory === 'all' || cat.name === activeCategory) && cat.items.length > 0);

  return (
    <div className="space-y-3 bg-[#140c08] p-3.5 rounded-xl border border-[#382215]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#f5be7e]">
          <Tag className="w-4 h-4 text-[#d48b46]" />
          <span>Дескрипторы вкуса (SCA Колесо)</span>
        </div>
        <span className="text-xs text-[#f5be7e] bg-[#d48b46]/20 px-2.5 py-0.5 rounded-full border border-[#d48b46]/40 font-medium font-mono">
          Выбрано: {selected.length}
        </span>
      </div>

      {/* Selected tags badges */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-[#1c120c] rounded-lg border border-[#362114] max-h-24 overflow-y-auto">
          {selected.map((item) => (
            <span
              key={item}
              onClick={() => toggleDescriptor(item)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#d48b46]/25 text-[#fdf8f3] border border-[#d48b46]/50 cursor-pointer hover:bg-rose-900/40 hover:text-rose-200 transition-colors"
            >
              {item}
              <X className="w-3 h-3" />
            </span>
          ))}
        </div>
      )}

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9c7860]" />
          <input
            type="text"
            placeholder="Поиск нот (напр. персик, карамель, жасмин)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border"
          />
        </div>

        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="text-xs rounded-lg px-2.5 py-1.5 border"
        >
          <option value="all">Все группы</option>
          {FLAVOR_CATEGORIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Descriptors grid */}
      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
        {filteredCategories.map((category) => (
          <div key={category.name}>
            <div className={`text-[11px] font-semibold mb-1.5 ${category.textColor}`}>
              {category.name}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {category.items.map((item) => {
                const isSelected = selected.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleDescriptor(item)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'btn-crema border border-[#f3be7a]/60 text-[#140d09] font-bold shadow-md shadow-[#d48b46]/20'
                        : `${category.color} border`
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <p className="text-center text-xs text-[#8e6e58] py-3">Ноты не найдены</p>
        )}
      </div>
    </div>
  );
};
