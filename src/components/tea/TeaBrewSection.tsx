import React, { useState } from 'react';
import { TEA_METHODS } from '../../data/teaMethods';
import type { TeaMethod } from '../../types/tea';
import { BrewTimer } from '../brew/BrewTimer';
import {
  Sliders,
  Flame,
  Scale,
  Clock,
  Play,
  Lightbulb,
  Sparkles,
  Droplets
} from 'lucide-react';

interface TeaBrewSectionProps {
  onLogToTeaJournal: (details: {
    teaName: string;
    leafGrams: number;
    waterGrams: number;
    waterTempC: number;
    brewTimeSeconds: number;
    methodName: string;
    steepsCount: number;
  }) => void;
}

export const TeaBrewSection: React.FC<TeaBrewSectionProps> = ({ onLogToTeaJournal }) => {
  const [selectedMethodId, setSelectedMethodId] = useState<string>('gongfu-cha');
  const [activeTimerMethod, setActiveTimerMethod] = useState<TeaMethod | null>(null);

  const selectedMethod = TEA_METHODS.find((m) => m.id === selectedMethodId) || TEA_METHODS[0];

  const [leafGrams, setLeafGrams] = useState<number>(selectedMethod.defaultLeafGrams);
  const [ratio, setRatio] = useState<number>(selectedMethod.defaultRatio);
  const waterGrams = Math.round(leafGrams * ratio);

  const handleSelectMethod = (method: TeaMethod) => {
    setSelectedMethodId(method.id);
    setLeafGrams(method.defaultLeafGrams);
    setRatio(method.defaultRatio);
  };

  const isGongfu = selectedMethod.id === 'gongfu-cha';

  return (
    <div className="space-y-8 animate-fade-in text-[#ede2d3]">
      {/* Category header tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        {TEA_METHODS.map((m) => {
          const isSelected = m.id === selectedMethodId;
          return (
            <button
              key={m.id}
              onClick={() => handleSelectMethod(m)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold shadow-md shadow-emerald-700/30 border border-emerald-400/50'
                  : 'bg-[#152319]/80 text-[#a7c5b1] hover:text-[#f2f7f0] hover:bg-[#1f3526] border border-[#233a2a]'
              }`}
            >
              {m.name}
            </button>
          );
        })}
      </div>

      {/* Method Hero / Dashboard */}
      <div className="bg-[#121f15]/95 border border-[#25422d] rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#223927]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
                Чайная традиция
              </span>
              <span className="text-xs text-[#82a88e]">• Посуда: {selectedMethod.vessel}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f2f7f0] font-serif">
              {selectedMethod.name}
            </h2>
            <p className="text-sm text-[#a8c5b0] mt-1.5 max-w-2xl leading-relaxed">
              {selectedMethod.fullDesc}
            </p>
          </div>

          <button
            onClick={() => setActiveTimerMethod(selectedMethod)}
            className="w-full lg:w-auto px-7 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-[#09150d] font-extrabold text-base rounded-xl shadow-lg shadow-emerald-600/30 border border-emerald-300/40 flex items-center justify-center gap-2.5 transition-all cursor-pointer transform hover:scale-[1.02]"
          >
            <Play className="w-5 h-5 fill-current" />
            Запустить чайный таймер
          </button>
        </div>

        {/* Dynamic Calculator & Parameters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Left: Leaf dose and water calculation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Калькулятор навески чайного листа</span>
            </div>

            {/* Leaf grams slider */}
            <div className="bg-[#0c160e] p-4 rounded-xl border border-[#203625] space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs sm:text-sm text-[#c7dfcd] font-medium flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  Сухой чайный лист:
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="25"
                    step="0.5"
                    value={leafGrams}
                    onChange={(e) => setLeafGrams(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-20 bg-[#16271a] border border-[#2b4c34] text-emerald-300 font-bold text-right px-2.5 py-1 rounded-lg text-sm"
                  />
                  <span className="text-xs text-[#7ea38b]">г</span>
                </div>
              </div>

              <input
                type="range"
                min="1"
                max={isGongfu ? 12 : 20}
                step="0.5"
                value={leafGrams}
                onChange={(e) => setLeafGrams(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-[#1b3121] rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-[#71927c]">
                <span>2 г (матча/чашка)</span>
                <span>5 г (гайвань 100мл)</span>
                <span>8 г (насыщенный пролив)</span>
                <span>12 г (варка на огне)</span>
              </div>
            </div>

            {/* Target Water Summary banner */}
            <div className="p-4 bg-gradient-to-r from-[#172b1d] via-[#102015] to-[#172b1d] rounded-xl border border-emerald-500/35 flex items-center justify-between shadow-inner">
              <div>
                <span className="text-xs text-[#a0c4ab] uppercase tracking-wide block">
                  Объем воды на заваривание
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono">
                  {waterGrams} <span className="text-base font-normal text-[#a0c4ab]">мл</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#a0c4ab] block">Формат заваривания:</span>
                <span className="text-sm font-semibold text-[#f2f7f0]">
                  {isGongfu ? '5-7 проливов в гайвани' : selectedMethod.vessel}
                </span>
                <span className="text-[10px] text-[#7ea38b] block">Температура: {selectedMethod.recommendedTempC}°C</span>
              </div>
            </div>

            {/* Steeping Strategy tips */}
            <div className="p-3.5 bg-[#0e1a11] rounded-xl border border-[#203625] text-xs space-y-1.5 text-[#a8c5b0]">
              <span className="font-bold text-emerald-300 block flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                Секрет работы с чайным листом:
              </span>
              <p>
                В технике Гунфу Ча первый короткий пролив (5–8 сек) обычно не пьют — он омывает лист и позволяет ему раскрыть аромат в прогретой посуде. Каждый последующий пролив увеличивают на 3–10 секунд.
              </p>
            </div>
          </div>

          {/* Right: Steeps Table & Tips */}
          <div className="lg:col-span-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0c160e] p-3.5 rounded-xl border border-[#203625]">
                <span className="text-xs text-[#a0c4ab] block mb-1">Посуда</span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-300 leading-snug block">
                  {selectedMethod.vessel}
                </span>
              </div>

              <div className="bg-[#0c160e] p-3.5 rounded-xl border border-[#203625]">
                <span className="text-xs text-[#a0c4ab] block mb-1 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-emerald-400" />
                  Температура воды
                </span>
                <span className="text-sm font-bold text-emerald-300 font-mono">
                  {selectedMethod.recommendedTempC}°C
                </span>
                <span className="text-[10px] text-[#7ea38b] block">мягкая родниковая вода</span>
              </div>
            </div>

            {/* Steps Breakdown preview */}
            <div className="bg-[#0c160e] p-4 rounded-xl border border-[#203625]">
              <div className="text-xs font-semibold text-emerald-300 mb-2.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Этапы заваривания ({selectedMethod.steps.length}):
              </div>

              <div className="space-y-2">
                {selectedMethod.steps.map((st, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-[#1b3121] last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] flex items-center justify-center border border-emerald-500/40">
                        {i + 1}
                      </span>
                      <span className="text-[#e2eee4] font-medium">{st.title}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#86a892] font-mono font-medium">({st.timeSeconds}с)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Master Tips */}
            <div className="bg-[#172a1d] border border-[#2e5036] rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-2">
                <Lightbulb className="w-4 h-4 text-emerald-400" />
                Советы чайного мастера:
              </div>
              <ul className="space-y-1.5">
                {selectedMethod.tips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-[#a0c4ab] flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
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
          method={{
            id: 'v60-kasuya', // reuse timer renderer logic
            name: activeTimerMethod.name,
            category: 'immersion',
            shortDesc: activeTimerMethod.shortDesc,
            fullDesc: activeTimerMethod.fullDesc,
            difficulty: activeTimerMethod.difficulty,
            icon: 'Flame',
            defaultCoffeeGrams: leafGrams,
            defaultWaterGrams: waterGrams,
            defaultRatio: ratio,
            recommendedGrind: activeTimerMethod.vessel,
            recommendedTempC: activeTimerMethod.recommendedTempC,
            totalTimeEstimate: activeTimerMethod.totalTimeEstimate,
            steps: activeTimerMethod.steps,
            tips: activeTimerMethod.tips,
          }}
          coffeeGrams={leafGrams}
          waterGrams={waterGrams}
          theme="tea"
          doseLabel="Чайный лист"
          onFinishAndLog={(details) => {
            setActiveTimerMethod(null);
            onLogToTeaJournal({
              teaName: activeTimerMethod.name.includes('Матча') ? 'Матча Удзи' : 'Да Хун Пао',
              leafGrams,
              waterGrams,
              waterTempC: activeTimerMethod.recommendedTempC,
              brewTimeSeconds: details.brewTimeSeconds,
              methodName: activeTimerMethod.name,
              steepsCount: activeTimerMethod.steps.length,
            });
          }}
          onClose={() => setActiveTimerMethod(null)}
        />
      )}
    </div>
  );
};
