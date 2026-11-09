import React, { useState } from 'react';
import { BREW_METHODS } from '../../data/brewMethods';
import type { BrewMethod, BrewMethodId } from '../../types';
import { BrewTimer } from './BrewTimer';
import {
  Sliders,
  Flame,
  Scale,
  Clock,
  Play,
  Lightbulb,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface BrewSectionProps {
  onLogToJournal: (details: {
    methodName: string;
    coffeeGrams: number;
    waterGrams: number;
    brewTimeSeconds: number;
    grindSize: string;
    waterTempC: number;
  }) => void;
}

export const BrewSection: React.FC<BrewSectionProps> = ({ onLogToJournal }) => {
  const [selectedMethodId, setSelectedMethodId] = useState<BrewMethodId>('v60-kasuya');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeTimerMethod, setActiveTimerMethod] = useState<BrewMethod | null>(null);

  const selectedMethod = BREW_METHODS.find((m) => m.id === selectedMethodId) || BREW_METHODS[0];

  // Ratio and dosing state
  const [coffeeGrams, setCoffeeGrams] = useState<number>(selectedMethod.defaultCoffeeGrams);
  const [ratio, setRatio] = useState<number>(selectedMethod.defaultRatio);
  const waterGrams = Math.round(coffeeGrams * ratio);

  // When changing method, reset default values
  const handleSelectMethod = (method: BrewMethod) => {
    setSelectedMethodId(method.id);
    setCoffeeGrams(method.defaultCoffeeGrams);
    setRatio(method.defaultRatio);
  };

  const handleRatioPreset = (newRatio: number) => {
    setRatio(newRatio);
  };

  const filteredMethods = BREW_METHODS.filter((m) => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'pourover') return m.category === 'pourover';
    if (categoryFilter === 'immersion') return m.category === 'immersion';
    if (categoryFilter === 'pressure') return m.category === 'pressure';
    if (categoryFilter === 'other') return m.category === 'cold' || m.category === 'traditional';
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in text-[#ede2d3]">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'Все методы' },
          { id: 'pourover', label: 'Воронка (Пуровер)' },
          { id: 'immersion', label: 'Иммерсия (AeroPress / Френч-пресс)' },
          { id: 'pressure', label: 'Гейзер (Moka Pot)' },
          { id: 'other', label: 'Турка и Cold Brew' },
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

      {/* Methods Carousel / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredMethods.map((m) => {
          const isSelected = m.id === selectedMethodId;
          return (
            <div
              key={m.id}
              onClick={() => handleSelectMethod(m)}
              className={`relative cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-[#3a2316] to-[#20130c] border-[#d48b46] shadow-xl shadow-[#d48b46]/15 -translate-y-0.5'
                  : 'bg-[#1b110a]/80 border-[#3a2417] hover:border-[#5a3824] hover:bg-[#23160e]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      m.difficulty === 'Легко'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : m.difficulty === 'Средне'
                        ? 'bg-[#d48b46]/20 text-[#f5be7e] border border-[#d48b46]/40'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {m.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#caa890]">
                    <Clock className="w-3.5 h-3.5 text-[#d48b46]" />
                    <span>{m.totalTimeEstimate}</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-[#fdf8f3] mb-1 leading-snug">
                  {m.name}
                </h3>
                <p className="text-xs text-[#b8957c] line-clamp-2 leading-relaxed">
                  {m.shortDesc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#341f13] flex items-center justify-between text-xs text-[#9c7860]">
                <span>База: {m.defaultCoffeeGrams}г / {m.defaultWaterGrams}г</span>
                {isSelected && (
                  <span className="text-[#f5be7e] font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Выбран
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Method Dashboard & Calculator */}
      <div className="bg-[#1c120c]/95 border border-[#442b1c] rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#382215]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#f5be7e] bg-[#d48b46]/15 border border-[#d48b46]/30 px-2.5 py-0.5 rounded-md">
                Рецепт и пропорции
              </span>
              <span className="text-xs text-[#9c7860]">• {selectedMethod.difficulty} уровень</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fdf8f3] font-serif">
              {selectedMethod.name}
            </h2>
            <p className="text-sm text-[#caa890] mt-1.5 max-w-2xl leading-relaxed">
              {selectedMethod.fullDesc}
            </p>
          </div>

          <button
            onClick={() => setActiveTimerMethod(selectedMethod)}
            className="w-full lg:w-auto px-7 py-4 btn-crema border border-[#f3be7a]/60 text-[#140d09] font-extrabold text-base rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            Запустить интерактивный таймер
          </button>
        </div>

        {/* Dynamic Calculator & Parameters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Left: Dose & Ratio Sliders */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#f5be7e]">
              <Sliders className="w-4 h-4 text-[#d48b46]" />
              <span>Калькулятор пропорций (Ratio & Water)</span>
            </div>

            {/* Coffee grams slider */}
            <div className="bg-[#140c08] p-4 rounded-xl border border-[#382215] space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs sm:text-sm text-[#d8c0b0] font-medium flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-[#d48b46]" />
                  Навеска кофе (сухой вес):
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="5"
                    max="100"
                    step="0.5"
                    value={coffeeGrams}
                    onChange={(e) => setCoffeeGrams(Math.max(5, parseFloat(e.target.value) || 5))}
                    className="w-20 bg-[#1c120c] border border-[#482e1d] text-[#f5be7e] font-bold text-right px-2.5 py-1 rounded-lg text-sm"
                  />
                  <span className="text-xs text-[#9c7860]">г</span>
                </div>
              </div>

              <input
                type="range"
                min="8"
                max="60"
                step="0.5"
                value={coffeeGrams}
                onChange={(e) => setCoffeeGrams(parseFloat(e.target.value))}
                className="w-full accent-[#d48b46] h-2 bg-[#2a1a11] rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-[#8e6e58]">
                <span>8 г (на 1 чашку)</span>
                <span>15 г (стандарт)</span>
                <span>30 г (на двоих)</span>
                <span>60 г (термос)</span>
              </div>
            </div>

            {/* Ratio selection */}
            <div className="bg-[#140c08] p-4 rounded-xl border border-[#382215] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-[#d8c0b0] font-medium">
                  Крепость и пропорция:
                </span>
                <span className="text-sm font-bold text-[#f5be7e] font-mono">
                  1 : {ratio.toFixed(1)}
                </span>
              </div>

              {/* Quick ratio presets */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { r: 14, label: '1:14', sub: 'Плотный' },
                  { r: 15, label: '1:15', sub: 'Насыщенный' },
                  { r: 16, label: '1:16', sub: 'Золотой стандарт' },
                  { r: 17, label: '1:17', sub: 'Чайный / Легкий' },
                ].map((item) => (
                  <button
                    key={item.r}
                    onClick={() => handleRatioPreset(item.r)}
                    className={`py-2 px-1 text-center rounded-lg border transition-all cursor-pointer ${
                      Math.abs(ratio - item.r) < 0.2
                        ? 'bg-[#d48b46]/25 border-[#d48b46] text-[#fdf8f3] font-bold shadow-sm shadow-[#d48b46]/20'
                        : 'bg-[#1c120c] border-[#382215] text-[#9c7860] hover:border-[#52331f] hover:text-[#ede2d3]'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-[#8e6e58] hidden sm:block">{item.sub}</div>
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="7"
                max="20"
                step="0.5"
                value={ratio}
                onChange={(e) => setRatio(parseFloat(e.target.value))}
                className="w-full accent-[#d48b46] h-2 bg-[#2a1a11] rounded-lg cursor-pointer"
              />
            </div>

            {/* Target Output Summary banner */}
            <div className="p-4 bg-gradient-to-r from-[#2c1a10] via-[#20130c] to-[#2c1a10] rounded-xl border border-[#d48b46]/40 flex items-center justify-between shadow-inner">
              <div>
                <span className="text-xs text-[#caa890] uppercase tracking-wide block">
                  Необходимый объем воды
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#f5be7e] font-mono">
                  {waterGrams} <span className="text-base font-normal text-[#caa890]">г (мл)</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#caa890] block">Выход готового напитка:</span>
                <span className="text-sm font-semibold text-[#fdf8f3]">
                  ~{Math.round(waterGrams - coffeeGrams * 2)} мл
                </span>
                <span className="text-[10px] text-[#8e6e58] block">(удержание жмыхом 2х)</span>
              </div>
            </div>
          </div>

          {/* Right: Recipe details, Grind, Water Temp & Barista Tips */}
          <div className="lg:col-span-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#140c08] p-3.5 rounded-xl border border-[#382215]">
                <span className="text-xs text-[#caa890] block mb-1">Помол зерна</span>
                <span className="text-xs sm:text-sm font-semibold text-[#f5be7e] leading-snug block">
                  {selectedMethod.recommendedGrind}
                </span>
              </div>

              <div className="bg-[#140c08] p-3.5 rounded-xl border border-[#382215]">
                <span className="text-xs text-[#caa890] block mb-1 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#d48b46]" />
                  Температура воды
                </span>
                <span className="text-sm font-bold text-[#f5be7e]">
                  {selectedMethod.recommendedTempC}°C
                </span>
                <span className="text-[10px] text-[#8e6e58] block">для светлой обжарки</span>
              </div>
            </div>

            {/* Steps Breakdown preview */}
            <div className="bg-[#140c08] p-4 rounded-xl border border-[#382215]">
              <div className="text-xs font-semibold text-[#f5be7e] mb-2.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d48b46]" />
                Этапы заваривания ({selectedMethod.steps.length}):
              </div>

              <div className="space-y-2">
                {selectedMethod.steps.map((st, i) => {
                  const scaledTarget = Math.round(
                    st.targetWaterGrams * (waterGrams / selectedMethod.defaultWaterGrams)
                  );
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-[#28180e] last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#d48b46]/20 text-[#f5be7e] font-bold text-[11px] flex items-center justify-center border border-[#d48b46]/40">
                          {i + 1}
                        </span>
                        <span className="text-[#ede2d3] font-medium">{st.title}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#f5be7e] font-mono font-semibold">{scaledTarget} г</span>
                        <span className="text-[#8e6e58] ml-1.5 font-mono">({st.timeSeconds}с)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Barista Tips Card */}
            <div className="bg-[#24150d] border border-[#4a2e1c] rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#f5be7e] mb-2">
                <Lightbulb className="w-4 h-4 text-[#d48b46]" />
                Советы чемпиона / бариста:
              </div>
              <ul className="space-y-1.5">
                {selectedMethod.tips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-[#caa890] flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#d48b46] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Timer Modal */}
      {activeTimerMethod && (
        <BrewTimer
          method={activeTimerMethod}
          coffeeGrams={coffeeGrams}
          waterGrams={waterGrams}
          onFinishAndLog={(details) => {
            setActiveTimerMethod(null);
            onLogToJournal(details);
          }}
          onClose={() => setActiveTimerMethod(null)}
        />
      )}
    </div>
  );
};
