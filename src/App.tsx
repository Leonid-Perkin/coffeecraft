import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import type { AppTab } from './components/Navbar';
import { BrewSection } from './components/brew/BrewSection';
import { JournalSection } from './components/journal/JournalSection';
import { DrinksSection } from './components/drinks/DrinksSection';
import { ToolkitSection } from './components/grind/ToolkitSection';
import { TeaBrewSection } from './components/tea/TeaBrewSection';
import { TeaJournalSection } from './components/tea/TeaJournalSection';
import { TeaEncyclopediaSection } from './components/tea/TeaEncyclopediaSection';
import { INITIAL_BEANS, INITIAL_TASTINGS } from './data/sampleData';
import { INITIAL_TEAS, INITIAL_TEA_TASTINGS } from './data/sampleTeaData';
import type { Bean, TastingEntry } from './types';
import type { TeaItem, TeaTastingEntry } from './types/tea';

export const App: React.FC = () => {
  // Mode switcher: 'coffee' | 'tea'
  const [appMode, setAppMode] = useState<'coffee' | 'tea'>(() => {
    try {
      const saved = localStorage.getItem('cyberowl_app_mode');
      return saved === 'tea' ? 'tea' : 'coffee';
    } catch {
      return 'coffee';
    }
  });

  const [activeTab, setActiveTab] = useState<AppTab>('brew');

  // Coffee: Beans state with localStorage
  const [beans, setBeans] = useState<Bean[]>(() => {
    try {
      const saved = localStorage.getItem('coffeecraft_beans');
      return saved ? JSON.parse(saved) : INITIAL_BEANS;
    } catch {
      return INITIAL_BEANS;
    }
  });

  // Coffee: Tastings state with localStorage
  const [tastings, setTastings] = useState<TastingEntry[]>(() => {
    try {
      const saved = localStorage.getItem('coffeecraft_tastings');
      return saved ? JSON.parse(saved) : INITIAL_TASTINGS;
    } catch {
      return INITIAL_TASTINGS;
    }
  });

  // Tea: Teas collection with localStorage
  const [teas, setTeas] = useState<TeaItem[]>(() => {
    try {
      const saved = localStorage.getItem('teacraft_teas');
      return saved ? JSON.parse(saved) : INITIAL_TEAS;
    } catch {
      return INITIAL_TEAS;
    }
  });

  // Tea: Tea tastings state with localStorage
  const [teaTastings, setTeaTastings] = useState<TeaTastingEntry[]>(() => {
    try {
      const saved = localStorage.getItem('teacraft_tastings');
      return saved ? JSON.parse(saved) : INITIAL_TEA_TASTINGS;
    } catch {
      return INITIAL_TEA_TASTINGS;
    }
  });

  // Initial brew logs passed from timer to journal
  const [initialBrewLog, setInitialBrewLog] = useState<{
    methodName: string;
    coffeeGrams: number;
    waterGrams: number;
    brewTimeSeconds: number;
    grindSize: string;
    waterTempC: number;
  } | null>(null);

  const [initialTeaBrewLog, setInitialTeaBrewLog] = useState<{
    teaName: string;
    leafGrams: number;
    waterGrams: number;
    waterTempC: number;
    brewTimeSeconds: number;
    methodName: string;
    steepsCount: number;
  } | null>(null);

  // Sync mode
  useEffect(() => {
    try {
      localStorage.setItem('cyberowl_app_mode', appMode);
    } catch {
      // ignore
    }
  }, [appMode]);

  // Sync Coffee
  useEffect(() => {
    try {
      localStorage.setItem('coffeecraft_beans', JSON.stringify(beans));
    } catch {
      // ignore
    }
  }, [beans]);

  useEffect(() => {
    try {
      localStorage.setItem('coffeecraft_tastings', JSON.stringify(tastings));
    } catch {
      // ignore
    }
  }, [tastings]);

  // Sync Tea
  useEffect(() => {
    try {
      localStorage.setItem('teacraft_teas', JSON.stringify(teas));
    } catch {
      // ignore
    }
  }, [teas]);

  useEffect(() => {
    try {
      localStorage.setItem('teacraft_tastings', JSON.stringify(teaTastings));
    } catch {
      // ignore
    }
  }, [teaTastings]);

  // Handlers for timer -> journal transition
  const handleLogToJournal = (details: {
    methodName: string;
    coffeeGrams: number;
    waterGrams: number;
    brewTimeSeconds: number;
    grindSize: string;
    waterTempC: number;
  }) => {
    setInitialBrewLog(details);
    setActiveTab('journal');
  };

  const handleLogToTeaJournal = (details: {
    teaName: string;
    leafGrams: number;
    waterGrams: number;
    waterTempC: number;
    brewTimeSeconds: number;
    methodName: string;
    steepsCount: number;
  }) => {
    setInitialTeaBrewLog(details);
    setActiveTab('journal');
  };

  const isTea = appMode === 'tea';

  return (
    <div
      className={`min-h-screen text-[#ede2d3] flex flex-col font-sans transition-colors duration-500 ${
        isTea
          ? 'bg-[#0b140d] selection:bg-emerald-500 selection:text-neutral-950'
          : 'bg-[#110e0c] selection:bg-amber-500 selection:text-neutral-950'
      }`}
    >
      {/* Header with ☕ / 🍵 Switcher */}
      <Header
        appMode={appMode}
        setAppMode={setAppMode}
        beansCount={beans.length}
        tastingsCount={tastings.length}
        teasCount={teas.length}
        teaTastingsCount={teaTastings.length}
      />

      {/* Main Tab Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} appMode={appMode} />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-20">
        {/* COFFEE MODE VIEWS */}
        {!isTea && (
          <>
            {activeTab === 'brew' && <BrewSection onLogToJournal={handleLogToJournal} />}

            {activeTab === 'journal' && (
              <JournalSection
                beans={beans}
                setBeans={setBeans}
                tastings={tastings}
                setTastings={setTastings}
                initialBrewLog={initialBrewLog}
                clearInitialBrewLog={() => setInitialBrewLog(null)}
              />
            )}

            {activeTab === 'drinks' && <DrinksSection />}

            {activeTab === 'toolkit' && <ToolkitSection />}
          </>
        )}

        {/* TEA MODE VIEWS */}
        {isTea && (
          <>
            {activeTab === 'brew' && <TeaBrewSection onLogToTeaJournal={handleLogToTeaJournal} />}

            {activeTab === 'journal' && (
              <TeaJournalSection
                teas={teas}
                setTeas={setTeas}
                teaTastings={teaTastings}
                setTeaTastings={setTeaTastings}
                initialTeaBrewLog={initialTeaBrewLog}
                clearInitialTeaBrewLog={() => setInitialTeaBrewLog(null)}
              />
            )}

            {activeTab === 'drinks' && <TeaEncyclopediaSection />}

            {activeTab === 'toolkit' && <ToolkitSection />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-6 px-4 text-center text-xs transition-colors duration-300 ${
          isTea
            ? 'border-[#1f3825] bg-[#0c1810]/90 text-[#71927c]'
            : 'border-[#341f14] bg-[#140c08]/90 text-[#8e6e58]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className={`flex items-center justify-center gap-1.5 ${isTea ? 'text-[#a0c4ab]' : 'text-[#caa890]'}`}>
            <strong className={isTea ? 'text-emerald-300' : 'text-[#f5be7e]'}>
              {isTea ? 'TeaCraft' : 'CoffeeCraft'}
            </strong>{' '}
            by CyberOwl — {isTea ? 'Лаборатория чайных традиций Гунфу Ча' : 'Спешелти компаньон и помощник заваривания'}
          </span>
          <span className="font-mono">© 2026 CyberOwl. Crafted with precision.</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
