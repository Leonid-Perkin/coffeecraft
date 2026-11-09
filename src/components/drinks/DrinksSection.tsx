import React, { useState } from 'react';
import { DRINK_RECIPES } from '../../data/drinks';
import type { DrinkRecipe } from '../../types';
import {
  Sparkles,
  Zap,
  Flame,
  Layers,
  Info,
  Milk
} from 'lucide-react';

interface MilkOption {
  id: string;
  name: string;
  calorieMultiplier: number;
}

const MILK_OPTIONS: MilkOption[] = [
  { id: 'whole', name: 'Цельное коровье (3.2%)', calorieMultiplier: 1.0 },
  { id: 'oat', name: 'Овсяное (Oatly / Green Milk)', calorieMultiplier: 0.9 },
  { id: 'almond', name: 'Миндальное', calorieMultiplier: 0.55 },
  { id: 'coconut', name: 'Кокосовое', calorieMultiplier: 0.8 },
  { id: 'skim', name: 'Обезжиренное (1.5%)', calorieMultiplier: 0.7 },
];

export const DrinksSection: React.FC = () => {
  const [selectedDrinkId, setSelectedDrinkId] = useState<string>(DRINK_RECIPES[1].id); // Flat White default
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedSizeMl, setSelectedSizeMl] = useState<number>(200);
  const [selectedMilk, setSelectedMilk] = useState<MilkOption>(MILK_OPTIONS[0]);

  const activeDrink: DrinkRecipe =
    DRINK_RECIPES.find((d) => d.id === selectedDrinkId) || DRINK_RECIPES[0];

  // Adjust calories and caffeine based on serving size scale
  const sizeRatio = selectedSizeMl / activeDrink.baseVolumeMl;
  const calculatedCaffeine = Math.round(activeDrink.baseCaffeineMg * (sizeRatio > 1.4 ? 1.5 : 1));
  const calculatedCalories = Math.round(
    activeDrink.baseCalories * sizeRatio * (activeDrink.category === 'milk' ? selectedMilk.calorieMultiplier : 1)
  );

  const filteredDrinks = DRINK_RECIPES.filter((d) => {
    if (categoryFilter === 'all') return true;
    return d.category === categoryFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in text-[#ede2d3]">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        {[
          { id: 'all', label: 'Все напитки' },
          { id: 'classic', label: 'Классика (Эспрессо)' },
          { id: 'milk', label: 'Молочные напитки' },
          { id: 'signature', label: 'Авторские (Раф, Бамбл)' },
          { id: 'cold', label: 'Холодные и тоники' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              categoryFilter === tab.id
                ? 'btn-crema border border-[#f3be7a]/60 text-[#140d09]'
                : 'bg-[#1e130c]/80 text-[#caa890] hover:text-[#fdf8f3] hover:bg-[#2a1a11] border border-[#3d2719]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Drink Cards Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {filteredDrinks.map((drink) => {
          const isSelected = drink.id === selectedDrinkId;
          return (
            <div
              key={drink.id}
              onClick={() => {
                setSelectedDrinkId(drink.id);
                setSelectedSizeMl(drink.baseVolumeMl);
              }}
              className={`p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-[#3a2316] to-[#20130c] border-[#d48b46] shadow-xl shadow-[#d48b46]/15 -translate-y-0.5'
                  : 'bg-[#1b110a]/80 border-[#3a2417] hover:border-[#5a3824] hover:bg-[#23160e]'
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-[#d48b46] block mb-1">
                  {drink.originalName}
                </span>
                <h4 className="font-bold text-sm sm:text-base text-[#fdf8f3] leading-snug mb-1 font-serif">
                  {drink.name}
                </h4>
                <p className="text-[11px] text-[#b8957c] line-clamp-2 leading-relaxed">
                  {drink.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#341f13] flex items-center justify-between text-[11px] text-[#9c7860]">
                <span>{drink.baseVolumeMl} мл</span>
                <span className="text-[#f5be7e] font-mono font-medium">{drink.baseCaffeineMg} мг</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Drink Deep-Dive Dashboard */}
      <div className="bg-[#1c120c]/95 border border-[#442b1c] rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#382215]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#f5be7e] bg-[#d48b46]/15 border border-[#d48b46]/30 px-2.5 py-0.5 rounded-md">
                {activeDrink.category.toUpperCase()}
              </span>
              <span className="text-xs text-[#9c7860]">• {activeDrink.origin}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fdf8f3] font-serif">
              {activeDrink.name} ({activeDrink.originalName})
            </h2>
            <p className="text-sm text-[#caa890] mt-1.5 max-w-2xl leading-relaxed">
              {activeDrink.description}
            </p>
          </div>

          {/* Quick Nutrition / Caffeine Badges */}
          <div className="flex items-center gap-3">
            <div className="bg-[#140c08] border border-[#382215] rounded-xl px-4 py-2.5 text-center shadow-inner">
              <span className="text-[11px] text-[#9c7860] uppercase tracking-wide flex items-center gap-1 justify-center">
                <Zap className="w-3.5 h-3.5 text-[#d48b46]" /> Кофеин
              </span>
              <span className="text-xl font-extrabold text-[#f5be7e] font-mono">
                ~{calculatedCaffeine} <span className="text-xs font-normal text-[#9c7860]">мг</span>
              </span>
            </div>

            <div className="bg-[#140c08] border border-[#382215] rounded-xl px-4 py-2.5 text-center shadow-inner">
              <span className="text-[11px] text-[#9c7860] uppercase tracking-wide flex items-center gap-1 justify-center">
                <Flame className="w-3.5 h-3.5 text-[#d48b46]" /> Калории
              </span>
              <span className="text-xl font-extrabold text-[#f5be7e] font-mono">
                ~{calculatedCalories} <span className="text-xs font-normal text-[#9c7860]">ккал</span>
              </span>
            </div>
          </div>
        </div>

        {/* Visualizer & Recipe Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Left Column: Glass Visualizer */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#f5be7e] mb-3">
              <Layers className="w-4 h-4 text-[#d48b46]" />
              Анатомия слоев напитка
            </div>

            {/* Realistic Glass Cross-section container */}
            <div className="relative w-56 sm:w-64 h-80 rounded-b-3xl rounded-t-lg border-4 border-[#5a3824] bg-[#140c08] shadow-2xl p-2.5 flex flex-col justify-end overflow-hidden">
              {/* Glass sheen highlight */}
              <div className="absolute top-0 left-3 w-3 h-full bg-gradient-to-r from-white/10 to-transparent pointer-events-none rounded-full" />
              <div className="absolute top-0 right-4 w-1.5 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />

              {/* Render Drink Layers */}
              {activeDrink.layers.map((layer, idx) => (
                <div
                  key={idx}
                  style={{
                    height: `${layer.percentage}%`,
                    background: layer.color,
                  }}
                  className="w-full relative flex items-center justify-center transition-all duration-500 group shadow-sm overflow-hidden"
                >
                  <span
                    style={{ color: layer.textColor || '#ffffff' }}
                    className="text-[11px] font-bold tracking-wide px-2 py-0.5 text-center drop-shadow transition-transform group-hover:scale-105"
                  >
                    {layer.name} ({layer.percentage}%)
                  </span>
                </div>
              ))}
            </div>

            {/* Serving Size & Milk Switchers */}
            <div className="w-full max-w-xs mt-5 space-y-3">
              <div>
                <label className="text-xs text-[#caa890] block mb-1">
                  Объем напитка: <strong className="text-[#f5be7e]">{selectedSizeMl} мл</strong>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[150, 200, 300, 350].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSizeMl(sz)}
                      className={`py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${
                        selectedSizeMl === sz
                          ? 'btn-crema border border-[#f3be7a]/60 text-[#140d09] font-bold'
                          : 'bg-[#140c08] text-[#9c7860] border-[#382215] hover:text-[#ede2d3]'
                      }`}
                    >
                      {sz} мл
                    </button>
                  ))}
                </div>
              </div>

              {activeDrink.category === 'milk' && (
                <div>
                  <label className="text-xs text-[#caa890] flex items-center gap-1 mb-1">
                    <Milk className="w-3.5 h-3.5 text-[#d48b46]" />
                    Тип молока:
                  </label>
                  <select
                    value={selectedMilk.id}
                    onChange={(e) => {
                      const found = MILK_OPTIONS.find((m) => m.id === e.target.value);
                      if (found) setSelectedMilk(found);
                    }}
                    className="w-full rounded-lg text-xs px-3 py-2 border"
                  >
                    {MILK_OPTIONS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Recipe Details & Barista Instructions */}
          <div className="lg:col-span-7 space-y-5">
            {/* Ingredients */}
            <div className="bg-[#140c08] p-4 rounded-xl border border-[#382215]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f5be7e] block mb-2">
                Ингредиенты и пропорции
              </span>
              <div className="space-y-2">
                {activeDrink.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-xs sm:text-sm py-1.5 border-b border-[#28180e] last:border-0"
                  >
                    <span className="text-[#ede2d3] flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d48b46]" />
                      {ing.item}
                    </span>
                    <span className="font-semibold text-[#f5be7e] font-mono">{ing.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Steps */}
            <div className="bg-[#140c08] p-4 rounded-xl border border-[#382215]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f5be7e] block mb-2.5">
                Пошаговый процесс приготовления
              </span>
              <div className="space-y-3">
                {activeDrink.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                    <span className="w-6 h-6 rounded-full bg-[#d48b46]/20 text-[#f5be7e] font-bold text-xs flex items-center justify-center shrink-0 border border-[#d48b46]/40">
                      {idx + 1}
                    </span>
                    <p className="text-[#d8c0b0] leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Barista Tip */}
            <div className="bg-[#24150d] border border-[#4a2e1c] rounded-xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#d48b46] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#f5be7e] block mb-0.5">
                  Секрет идеальной подачи:
                </span>
                <p className="text-xs text-[#caa890] leading-relaxed">
                  {activeDrink.baristaTip}
                </p>
              </div>
            </div>

            {/* Layers description breakdown */}
            <div className="bg-[#140c08] p-3.5 rounded-xl border border-[#382215] text-xs">
              <span className="font-semibold text-[#caa890] block mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#d48b46]" />
                Спецификация слоев:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeDrink.layers.map((l, i) => (
                  <div key={i} className="p-2 rounded-lg bg-[#1c120c] border border-[#341f13]">
                    <span className="font-semibold text-[#f5be7e] block">{l.name}</span>
                    <span className="text-[#a3826c] text-[11px]">{l.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
