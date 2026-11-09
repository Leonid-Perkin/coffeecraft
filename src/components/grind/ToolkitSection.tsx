import React, { useState } from 'react';
import { GRIND_LEVELS, GRINDERS } from '../../data/grindData';
import type { GrindLevel, GrinderModel } from '../../types';
import {
  Sliders,
  CheckCircle,
  AlertTriangle,
  Flame,
  Scale
} from 'lucide-react';

export const ToolkitSection: React.FC = () => {
  const [selectedGrindId, setSelectedGrindId] = useState<string>('medium');
  const [selectedGrinderId, setSelectedGrinderId] = useState<string>('comandante-c40');

  // TDS & Extraction Yield Calculator State
  const [dryCoffeeGrams, setDryCoffeeGrams] = useState<number>(18);
  const [beverageYieldGrams, setBeverageYieldGrams] = useState<number>(270);
  const [tdsPercent, setTdsPercent] = useState<number>(1.35);

  // Altitude / Water Boiling State
  const [altitudeMeters, setAltitudeMeters] = useState<number>(200);

  // Extraction Yield Formula: (Beverage Weight * TDS) / Dose
  const extractionYieldPercent =
    dryCoffeeGrams > 0 ? (beverageYieldGrams * tdsPercent) / dryCoffeeGrams : 0;

  // Boiling point at altitude approx formula: 100 - (altitude / 300)
  const boilingPointC = Math.max(80, Math.round((100 - altitudeMeters / 285) * 10) / 10);

  const activeGrindLevel: GrindLevel =
    GRIND_LEVELS.find((g) => g.id === selectedGrindId) || GRIND_LEVELS[3];

  const activeGrinder: GrinderModel =
    GRINDERS.find((g) => g.id === selectedGrinderId) || GRINDERS[1];

  // Diagnosis based on SCA extraction standards
  let extractionStatus: {
    status: 'under' | 'ideal' | 'over';
    title: string;
    description: string;
    tip: string;
  } = {
    status: 'ideal',
    title: 'Идеальная экстракция (Golden Cup 18-22%)',
    description: 'Оптимальный баланс сладости, выраженной спелой кислотности и прозрачности чашки без горечи.',
    tip: 'Отличный результат! Зафиксируйте этот помол и время в дневнике.',
  };

  if (extractionYieldPercent < 18.0) {
    extractionStatus = {
      status: 'under',
      title: 'Недоэкстракция (< 18%)',
      description: 'Чашка может быть едкой, кислой, с соленоватым или травянистым привкусом и коротким послевкусием.',
      tip: 'Рекомендация: сделайте помол мельче, увеличьте температуру воды или увеличьте время контакта.',
    };
  } else if (extractionYieldPercent > 22.0) {
    extractionStatus = {
      status: 'over',
      title: 'Переэкстракция (> 22%)',
      description: 'В напиток вышли тяжелые дубильные вещества. Вкус сухой, вяжущий, едкий и горький.',
      tip: 'Рекомендация: сделайте помол крупнее, снизьте температуру воды на 2-3°C или сократите время пролива.',
    };
  }

  return (
    <div className="space-y-8 animate-fade-in text-[#ede2d3]">
      {/* SECTION 1: Grind Size Explorer */}
      <div className="bg-[#1c120c]/95 border border-[#442b1c] rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        <div className="pb-5 border-b border-[#382215]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#f5be7e] bg-[#d48b46]/15 border border-[#d48b46]/30 px-2.5 py-0.5 rounded-md">
              Помол кофе
            </span>
            <span className="text-xs text-[#9c7860]">• Руководство по фракциям</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fdf8f3] font-serif">
            Интерактивный гид по помолу
          </h2>
          <p className="text-sm text-[#caa890] mt-1.5 max-w-2xl leading-relaxed">
            Помол — главный рычаг вкуса. Выберите степень помола, чтобы узнать размер в микронах, тактильные ориентиры и клики для популярных кофемолок.
          </p>
        </div>

        {/* Visual Grind Stepper */}
        <div className="py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {GRIND_LEVELS.map((lvl) => {
              const isSelected = lvl.id === selectedGrindId;
              return (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedGrindId(lvl.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#d48b46]/20 border-[#d48b46] shadow-md shadow-[#d48b46]/20 -translate-y-0.5'
                      : 'bg-[#140c08] border-[#382215] hover:border-[#52331f] hover:bg-[#20130c]'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-[#f5be7e] font-mono font-medium block">
                      {lvl.particleSizeMicrons}
                    </span>
                    <span className="text-xs font-bold text-[#fdf8f3] block mt-0.5 leading-snug">
                      {lvl.nameRu}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8e6e58] mt-2 block">
                    {lvl.nameEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Grind Level Detail Card */}
        <div className="bg-[#140c08] p-5 rounded-2xl border border-[#482d1c] grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold btn-crema border border-[#f3be7a]/60 text-[#140d09]">
                {activeGrindLevel.nameRu}
              </span>
              <span className="text-xs text-[#f5be7e] font-mono">
                {activeGrindLevel.particleSizeMicrons}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#caa890] mb-3 leading-relaxed">
              {activeGrindLevel.description}
            </p>
            <div className="p-3 bg-[#1c120c] rounded-xl border border-[#382215] text-xs">
              <span className="text-[#8e6e58] block mb-1">Тактильное ощущение на пальцах:</span>
              <strong className="text-[#f5be7e]">{activeGrindLevel.tactileComparison}</strong>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-[#caa890] uppercase tracking-wider block mb-2">
              Лучшие способы заваривания для этого помола:
            </span>
            <div className="space-y-1.5">
              {activeGrindLevel.bestMethods.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs sm:text-sm text-[#ede2d3] bg-[#1c120c] p-2 rounded-lg border border-[#341f13]"
                >
                  <CheckCircle className="w-4 h-4 text-[#d48b46] shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grinder Clicks Comparison Table */}
        <div className="pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-base font-bold text-[#fdf8f3] font-serif flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#d48b46]" />
              Таблица кликов кофемолок
            </h3>
            <select
              value={selectedGrinderId}
              onChange={(e) => setSelectedGrinderId(e.target.value)}
              className="rounded-xl px-3 py-1.5 text-xs sm:text-sm border"
            >
              {GRINDERS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.brand} — {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#382215]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#140c08] text-[#9c7860] uppercase tracking-wider text-[11px] border-b border-[#382215]">
                <tr>
                  <th className="py-2.5 px-3">Метод</th>
                  <th className="py-2.5 px-3">Рекомендация для {activeGrinder.brand} {activeGrinder.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d1b11] bg-[#180f0a]">
                <tr>
                  <td className="py-2.5 px-3 text-[#d8c0b0] font-medium">Джезва (Турка)</td>
                  <td className="py-2.5 px-3 text-[#f5be7e] font-mono">{activeGrinder.clicks.cezve}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#d8c0b0] font-medium">Эспрессо (9 бар)</td>
                  <td className="py-2.5 px-3 text-[#f5be7e] font-mono">{activeGrinder.clicks.espresso}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#d8c0b0] font-medium">AeroPress</td>
                  <td className="py-2.5 px-3 text-[#f5be7e] font-mono">{activeGrinder.clicks.aeropress}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#d8c0b0] font-medium">V60 (Пуровер)</td>
                  <td className="py-2.5 px-3 text-[#f5be7e] font-mono">{activeGrinder.clicks.v60}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#d8c0b0] font-medium">Chemex (Кемекс)</td>
                  <td className="py-2.5 px-3 text-[#f5be7e] font-mono">{activeGrinder.clicks.chemex}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#d8c0b0] font-medium">French Press</td>
                  <td className="py-2.5 px-3 text-[#f5be7e] font-mono">{activeGrinder.clicks.frenchPress}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#d8c0b0] font-medium">Cold Brew (Холодный настой)</td>
                  <td className="py-2.5 px-3 text-[#f5be7e] font-mono">{activeGrinder.clicks.coldBrew}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 2: TDS & Extraction Yield Calculator */}
      <div className="bg-[#1c120c]/95 border border-[#442b1c] rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        <div className="pb-5 border-b border-[#382215]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#f5be7e] bg-[#d48b46]/15 border border-[#d48b46]/30 px-2.5 py-0.5 rounded-md">
              SCA Стандарты
            </span>
            <span className="text-xs text-[#9c7860]">• Наука экстракции</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fdf8f3] font-serif">
            Калькулятор экстракции (TDS & Extraction Yield)
          </h2>
          <p className="text-sm text-[#caa890] mt-1.5 max-w-2xl leading-relaxed">
            Рассчитайте процент растворенных веществ, чтобы диагностировать недоэкстрагированную кислую чашку или горькую переэкстракцию.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Inputs */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#140c08] p-4 rounded-xl border border-[#382215] space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-[#d8c0b0] font-medium flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-[#d48b46]" />
                  Сухая навеска кофе (г):
                </span>
                <input
                  type="number"
                  step="0.5"
                  value={dryCoffeeGrams}
                  onChange={(e) => setDryCoffeeGrams(parseFloat(e.target.value) || 1)}
                  className="w-20 rounded-lg px-2 py-1 text-sm font-bold text-right"
                />
              </div>
              <input
                type="range"
                min="8"
                max="35"
                step="0.5"
                value={dryCoffeeGrams}
                onChange={(e) => setDryCoffeeGrams(parseFloat(e.target.value))}
                className="w-full accent-[#d48b46] h-1.5 bg-[#2a1a11] rounded-lg cursor-pointer"
              />
            </div>

            <div className="bg-[#140c08] p-4 rounded-xl border border-[#382215] space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-[#d8c0b0] font-medium">Вес готового напитка в чашке (г):</span>
                <input
                  type="number"
                  step="5"
                  value={beverageYieldGrams}
                  onChange={(e) => setBeverageYieldGrams(parseFloat(e.target.value) || 1)}
                  className="w-24 rounded-lg px-2 py-1 text-sm font-bold text-right"
                />
              </div>
              <input
                type="range"
                min="30"
                max="500"
                step="5"
                value={beverageYieldGrams}
                onChange={(e) => setBeverageYieldGrams(parseFloat(e.target.value))}
                className="w-full accent-[#d48b46] h-1.5 bg-[#2a1a11] rounded-lg cursor-pointer"
              />
            </div>

            <div className="bg-[#140c08] p-4 rounded-xl border border-[#382215] space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-[#d8c0b0] font-medium">TDS рефрактометра (%):</span>
                <input
                  type="number"
                  step="0.05"
                  value={tdsPercent}
                  onChange={(e) => setTdsPercent(parseFloat(e.target.value) || 0)}
                  className="w-20 rounded-lg px-2 py-1 text-sm font-bold text-right"
                />
              </div>
              <input
                type="range"
                min="0.8"
                max="2.2"
                step="0.05"
                value={tdsPercent}
                onChange={(e) => setTdsPercent(parseFloat(e.target.value))}
                className="w-full accent-[#d48b46] h-1.5 bg-[#2a1a11] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#8e6e58]">
                <span>1.15% (Легкий фильтр)</span>
                <span>1.35% (Идеал спешелти)</span>
                <span>1.55% (Плотный фильтр)</span>
              </div>
            </div>
          </div>

          {/* Results & SCA Gauge */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div className="bg-[#140c08] p-5 rounded-2xl border border-[#482d1c] text-center shadow-inner">
              <span className="text-xs text-[#9c7860] uppercase tracking-wider block mb-1">
                Расчетная экстракция (Extraction Yield)
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold text-[#f5be7e] font-mono tracking-tight my-2">
                {extractionYieldPercent.toFixed(1)}%
              </div>

              {/* Status Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  extractionStatus.status === 'ideal'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : extractionStatus.status === 'under'
                    ? 'bg-[#d48b46]/20 text-[#f5be7e] border border-[#d48b46]/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {extractionStatus.status === 'ideal' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                {extractionStatus.title}
              </div>

              <p className="text-xs text-[#caa890] mt-3 max-w-md mx-auto leading-relaxed">
                {extractionStatus.description}
              </p>
            </div>

            <div className="p-4 bg-[#24150d] rounded-xl border border-[#4a2e1c] text-xs text-[#d8c0b0]">
              <strong className="text-[#f5be7e] block mb-1">Что делать дальше:</strong>
              {extractionStatus.tip}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Water Temp & Boiling Point at Altitude */}
      <div className="bg-[#1c120c]/95 border border-[#442b1c] rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        <div className="pb-4 border-b border-[#382215]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#f5be7e] bg-[#d48b46]/15 border border-[#d48b46]/30 px-2.5 py-0.5 rounded-md">
              Вода и Химия
            </span>
            <span className="text-xs text-[#9c7860]">• Влияние высоты</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#fdf8f3] font-serif">
            Температура заваривания и точка кипения на высоте
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
          <div className="bg-[#140c08] p-4 rounded-xl border border-[#382215] space-y-3">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-[#d8c0b0] font-medium">Ваша высота над уровнем моря:</span>
              <span className="font-bold text-[#f5be7e] font-mono">{altitudeMeters} м</span>
            </div>
            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={altitudeMeters}
              onChange={(e) => setAltitudeMeters(parseInt(e.target.value, 10))}
              className="w-full accent-[#d48b46] h-1.5 bg-[#2a1a11] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#8e6e58]">
              <span>0 м (у моря)</span>
              <span>150 м (Москва/СПб)</span>
              <span>1000 м (предгорья)</span>
              <span>2500 м (горы)</span>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#341f13] text-xs">
              <span className="text-[#9c7860]">Точка кипения воды у вас:</span>
              <span className="text-lg font-bold text-[#f5be7e] font-mono">
                {boilingPointC}°C
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-[#140c08] rounded-xl border border-[#382215]">
              <span className="font-bold text-[#f5be7e] flex items-center gap-1.5 mb-1">
                <Flame className="w-3.5 h-3.5 text-[#d48b46]" />
                Светлая спешелти-обжарка (Light): 93°C – 96°C
              </span>
              <p className="text-[#caa890]">
                Требует максимальной температуры, чтобы раскрыть комплексные цветочные кислоты и фруктовую сладость плотного зерна.
              </p>
            </div>

            <div className="p-3 bg-[#140c08] rounded-xl border border-[#382215]">
              <span className="font-bold text-[#f5be7e] flex items-center gap-1.5 mb-1">
                <Flame className="w-3.5 h-3.5 text-[#d48b46]" />
                Темная эспрессо-обжарка (Dark): 88°C – 91°C
              </span>
              <p className="text-[#caa890]">
                Карамелизированное зерно очень пористое. Горячая вода выше 92°C вызовет едкую горечь и зольный привкус.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
