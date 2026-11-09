import React from 'react';
import { Timer, BookOpen, Coffee, Sliders, Feather, Sparkles, Droplets } from 'lucide-react';

export type AppTab = 'brew' | 'journal' | 'drinks' | 'toolkit';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  appMode: 'coffee' | 'tea';
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, appMode }) => {
  const isTea = appMode === 'tea';

  const coffeeTabs = [
    {
      id: 'brew' as AppTab,
      label: 'Заваривание',
      sub: 'Калькулятор и таймер',
      icon: Timer,
    },
    {
      id: 'journal' as AppTab,
      label: 'Дневник вкуса',
      sub: 'Сорта и дегустации',
      icon: BookOpen,
    },
    {
      id: 'drinks' as AppTab,
      label: 'Энциклопедия',
      sub: 'Слои и рецепты',
      icon: Coffee,
    },
    {
      id: 'toolkit' as AppTab,
      label: 'Помол и TDS',
      sub: 'Клики и экстракция',
      icon: Sliders,
    },
  ];

  const teaTabs = [
    {
      id: 'brew' as AppTab,
      label: 'Гунфу Ча & Таймер',
      sub: 'Проливы, гайвань, матча',
      icon: Timer,
    },
    {
      id: 'journal' as AppTab,
      label: 'Чайный дневник',
      sub: 'Хуэй Гань и Ча Ци',
      icon: Feather,
    },
    {
      id: 'drinks' as AppTab,
      label: '6 Категорий чая',
      sub: 'Энциклопедия традиций',
      icon: Sparkles,
    },
    {
      id: 'toolkit' as AppTab,
      label: 'Вода и Экстракция',
      sub: 'TDS, температура и кипение',
      icon: Droplets,
    },
  ];

  const tabs = isTea ? teaTabs : coffeeTabs;

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-2">
      <div
        className={`border p-1.5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-1.5 shadow-xl shadow-black/30 backdrop-blur-md transition-colors duration-300 ${
          isTea
            ? 'bg-[#101e14]/90 border-[#23422b]'
            : 'bg-[#1c120c]/90 border-[#3e2618]'
        }`}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center sm:justify-center gap-2.5 px-3.5 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? isTea
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 border border-emerald-400/50 text-white font-bold shadow-lg shadow-emerald-700/25'
                    : 'btn-crema border border-[#f3be7a]/50 text-[#140d09]'
                  : isTea
                  ? 'text-[#a0c4ab] hover:text-[#f2f7f0] hover:bg-[#1a3322] border border-transparent'
                  : 'text-[#caa890] hover:text-[#fdf8f3] hover:bg-[#281910] border border-transparent'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive
                    ? isTea
                      ? 'text-white'
                      : 'text-[#140d09]'
                    : isTea
                    ? 'text-emerald-400'
                    : 'text-[#d48b46]'
                }`}
              />
              <div className="text-left leading-tight">
                <span className="text-xs sm:text-sm font-bold block">{tab.label}</span>
                <span
                  className={`text-[10px] hidden lg:block ${
                    isActive
                      ? isTea
                        ? 'text-emerald-100 font-semibold'
                        : 'text-[#382012] font-semibold'
                      : isTea
                      ? 'text-[#6e9278]'
                      : 'text-[#8e6e58]'
                  }`}
                >
                  {tab.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
