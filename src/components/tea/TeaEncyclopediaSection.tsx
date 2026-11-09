import React, { useState } from 'react';
import { TEA_CATEGORIES_INFO } from '../../data/teaCategories';
import type { TeaCategoryInfo } from '../../types/tea';
import {
  Thermometer,
  Sparkles,
  BookOpen,
  Droplets,
  Heart
} from 'lucide-react';

export const TeaEncyclopediaSection: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('oolong');

  const activeCategory: TeaCategoryInfo =
    TEA_CATEGORIES_INFO.find((c) => c.id === selectedCategoryId) || TEA_CATEGORIES_INFO[2];

  return (
    <div className="space-y-8 animate-fade-in text-[#ede2d3]">
      {/* Category Pills Header */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        {TEA_CATEGORIES_INFO.map((cat) => {
          const isSelected = cat.id === selectedCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold shadow-md shadow-emerald-700/30 border border-emerald-400/50'
                  : 'bg-[#152319]/80 text-[#a7c5b1] hover:text-[#f2f7f0] hover:bg-[#1f3526] border border-[#233a2a]'
              }`}
            >
              <span className="font-serif">{cat.nameZh}</span>
              <span>{cat.nameRu}</span>
            </button>
          );
        })}
      </div>

      {/* Main Selected Category Card */}
      <div className="bg-[#121f15]/95 border border-[#25422d] rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#223927]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md ${activeCategory.accentColor} border ${activeCategory.borderColor}`}>
                {activeCategory.pinyin}
              </span>
              <span className="text-xs text-[#82a88e]">• Ферментация: {activeCategory.fermentationLevel}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f2f7f0] font-serif">
                {activeCategory.nameRu}
              </h2>
              <span className="text-3xl text-emerald-400 font-serif opacity-80">{activeCategory.nameZh}</span>
            </div>
            <p className="text-sm text-[#a8c5b0] mt-2 max-w-2xl leading-relaxed">
              {activeCategory.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#0a140d] border border-[#203627] rounded-xl px-4 py-3 text-center shadow-inner">
              <span className="text-[11px] text-[#71927c] uppercase tracking-wide flex items-center gap-1 justify-center">
                <Thermometer className="w-3.5 h-3.5 text-emerald-400" /> Температура
              </span>
              <span className="text-xl font-extrabold text-emerald-300 font-mono">
                {activeCategory.recommendedTempC}
              </span>
            </div>

            <div className="bg-[#0a140d] border border-[#203627] rounded-xl px-4 py-3 text-center shadow-inner">
              <span className="text-[11px] text-[#71927c] uppercase tracking-wide flex items-center gap-1 justify-center">
                <Droplets className="w-3.5 h-3.5 text-teal-400" /> Экспозиция
              </span>
              <span className="text-xs font-bold text-teal-300">
                {activeCategory.steepTime}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Famous teas in this group */}
          <div className="bg-[#0c160e] p-5 rounded-2xl border border-[#203625] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Знаменитые сорта этой категории:
            </span>
            <div className="space-y-2.5">
              {activeCategory.famousTeas.map((tea, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#142419] border border-[#203827] text-xs transition-all hover:border-emerald-500/50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-[#f2f7f0] flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      {tea.name}
                      <span className="text-emerald-400 font-serif text-xs opacity-90">{tea.zh}</span>
                    </span>
                    <span className="text-[10px] text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {tea.region}
                    </span>
                  </div>
                  <p className="text-[#a0c4ab] text-[11px] leading-relaxed pl-4">
                    {tea.flavorNotes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Vessels and Ceremony */}
          <div className="bg-[#0c160e] p-5 rounded-2xl border border-[#203625] space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 mb-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Рекомендованная чайная посуда:
              </span>
              <p className="text-xs sm:text-sm text-[#a8c5b0] leading-relaxed bg-[#142419] p-3 rounded-xl border border-[#203827]">
                {activeCategory.vessels}
              </p>
            </div>

            <div className="p-3.5 bg-[#172b1d] border border-[#2b4c34] rounded-xl text-xs space-y-1">
              <span className="font-bold text-emerald-300 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Биохимия и воздействие:
              </span>
              <p className="text-[#a0c4ab]">
                Богат L-теанином — уникальной аминокислотой, стимулирующей альфа-ритмы головного мозга. В сочетании с мягким чайным кофеином (теином) дарит сосредоточенность и ясность ума без нервозности и тремора.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Water Guide for Tea */}
      <div className="bg-[#121f15]/95 border border-[#25422d] rounded-2xl p-5 sm:p-7 shadow-xl">
        <h3 className="text-xl font-bold text-[#f2f7f0] font-serif mb-4 flex items-center gap-2">
          <Droplets className="w-5 h-5 text-emerald-400" />
          Вода — мать чая, а посуда — его отец
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#0c160e] border border-[#203625] space-y-1.5">
            <span className="font-bold text-emerald-300 block text-sm">Минерализация (TDS)</span>
            <p className="text-[#a0c4ab]">
              Для чая идеальна мягкая вода с минерализацией <strong>50 – 100 мг/л</strong>. Слишком жесткая вода связывает эфирные масла и делает настой мутным и плоским.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0c160e] border border-[#203625] space-y-1.5">
            <span className="font-bold text-emerald-300 block text-sm">Один кипяток</span>
            <p className="text-[#a0c4ab]">
              Воду для чая кипятят только один раз. Повторное кипячение выгоняет растворенный кислород, лишая чай живой свежести и тонкого аромата.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0c160e] border border-[#203625] space-y-1.5">
            <span className="font-bold text-emerald-300 block text-sm">Слив до капли</span>
            <p className="text-[#a0c4ab]">
              В технике Гунфу Ча сливайте настой из гайвани в чахай без остатка. Оставшиеся на дне капли продолжают варить лист и вызывают излишнюю горечь в следующем проливе.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
