import React, { useState } from 'react';
import { Coffee, Info, X, Sparkles, Heart } from 'lucide-react';

interface HeaderProps {
  beansCount: number;
  tastingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ beansCount, tastingsCount }) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#160e0a]/90 backdrop-blur-md border-b border-[#3d271a] px-4 sm:px-6 py-3.5 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d48b46] via-[#ad6226] to-[#6d3711] flex items-center justify-center text-[#140d09] shadow-md shadow-[#d48b46]/20 border border-[#f3be7a]/40">
              <Coffee className="w-6 h-6 stroke-[2.3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-[#fdf8f3] tracking-tight leading-none m-0 p-0 font-serif">
                  CoffeeCraft
                </h1>
                <span className="text-[10px] font-bold bg-[#c88344]/20 text-[#f5be7e] border border-[#c88344]/40 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Specialty
                </span>
              </div>
              <p className="text-[11px] text-[#caa890] m-0 p-0 hidden sm:block">
                All-in-One компаньон для любителей спешелти кофе
              </p>
            </div>
          </div>

          {/* Quick Stats & Info */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[#21150e] border border-[#42291b] rounded-xl px-3.5 py-1.5 text-xs text-[#d8c0b0]">
              <span className="text-[#9e7e68]">В коллекции:</span>
              <span className="font-bold text-[#f5be7e]">{beansCount} сортов</span>
              <span className="text-[#4e3222]">|</span>
              <span className="text-[#9e7e68]">Оценено:</span>
              <span className="font-bold text-[#f5be7e]">{tastingsCount} чашек</span>
            </div>

            <button
              onClick={() => setIsAboutOpen(true)}
              className="p-2 text-[#caa890] hover:text-[#f5be7e] hover:bg-[#251710] rounded-xl transition-colors border border-[#3f271a]"
              title="О приложении"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1e130c] border border-[#5a3723] rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-fade-in text-[#ede2d3]">
            <button
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#9e7e68] hover:text-[#fdf8f3] hover:bg-[#2e1d13] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d48b46] to-[#8d4715] text-[#160d09] flex items-center justify-center shadow-lg shadow-[#d48b46]/20">
                <Coffee className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#fdf8f3] font-serif">CoffeeCraft Specialty</h3>
                <span className="text-xs text-[#d48b46] font-medium">Ваш персональный цифровой бариста</span>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#d8c0b0] leading-relaxed">
              <p>
                Полнофункциональное веб-приложение для всех, кто увлечен спешелти-кофе — от домашних исследователей воронки до опытных бариста и кап-тестеров.
              </p>
              <div className="bg-[#140c08] p-3.5 rounded-xl border border-[#3f2719] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#f5be7e]">
                  <Sparkles className="w-3.5 h-3.5 text-[#d48b46] shrink-0" />
                  <span>Пошаговые интерактивные таймеры заваривания со звуком</span>
                </div>
                <div className="flex items-center gap-2 text-[#f5be7e]">
                  <Sparkles className="w-3.5 h-3.5 text-[#d48b46] shrink-0" />
                  <span>Дневник с сенсорным вкусовым радаром и SCA колесом</span>
                </div>
                <div className="flex items-center gap-2 text-[#f5be7e]">
                  <Sparkles className="w-3.5 h-3.5 text-[#d48b46] shrink-0" />
                  <span>Энциклопедия напитков с анатомией слоев в бокале</span>
                </div>
                <div className="flex items-center gap-2 text-[#f5be7e]">
                  <Sparkles className="w-3.5 h-3.5 text-[#d48b46] shrink-0" />
                  <span>Гид по кликам кофемолок и калькулятор экстракции TDS</span>
                </div>
              </div>
              <p className="text-[#a88a75] text-xs">
                Все ваши записи, сорта и настройки сохраняются в локальной памяти браузера и доступны оффлайн.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#3a2316] flex items-center justify-between text-xs text-[#8c6d59]">
              <span className="flex items-center gap-1.5">
                Сварено с <Heart className="w-3.5 h-3.5 text-[#d48b46] fill-[#d48b46]" /> для ценителей вкуса
              </span>
              <span>v1.2.0</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
