import React from 'react';
import { Timer, BookOpen, Coffee, Sliders } from 'lucide-react';

export type AppTab = 'brew' | 'journal' | 'drinks' | 'toolkit';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
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

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-2">
      <div className="bg-[#1c120c]/90 border border-[#3e2618] p-1.5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-1.5 shadow-xl shadow-black/30 backdrop-blur-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center sm:justify-center gap-2.5 px-3.5 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'btn-crema border border-[#f3be7a]/50 text-[#140d09]'
                  : 'text-[#caa890] hover:text-[#fdf8f3] hover:bg-[#281910] border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#140d09]' : 'text-[#d48b46]'}`} />
              <div className="text-left leading-tight">
                <span className="text-xs sm:text-sm font-bold block">{tab.label}</span>
                <span className={`text-[10px] hidden lg:block ${isActive ? 'text-[#382012] font-semibold' : 'text-[#8e6e58]'}`}>
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
