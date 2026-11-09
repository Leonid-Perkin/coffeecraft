import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import type { AppTab } from './components/Navbar';
import { BrewSection } from './components/brew/BrewSection';
import { JournalSection } from './components/journal/JournalSection';
import { DrinksSection } from './components/drinks/DrinksSection';
import { ToolkitSection } from './components/grind/ToolkitSection';
import { INITIAL_BEANS, INITIAL_TASTINGS } from './data/sampleData';
import type { Bean, TastingEntry } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('brew');

  // Beans state with localStorage
  const [beans, setBeans] = useState<Bean[]>(() => {
    try {
      const saved = localStorage.getItem('coffeecraft_beans');
      return saved ? JSON.parse(saved) : INITIAL_BEANS;
    } catch {
      return INITIAL_BEANS;
    }
  });

  // Tastings state with localStorage
  const [tastings, setTastings] = useState<TastingEntry[]>(() => {
    try {
      const saved = localStorage.getItem('coffeecraft_tastings');
      return saved ? JSON.parse(saved) : INITIAL_TASTINGS;
    } catch {
      return INITIAL_TASTINGS;
    }
  });

  // Initial brew log passed from timer to journal
  const [initialBrewLog, setInitialBrewLog] = useState<{
    methodName: string;
    coffeeGrams: number;
    waterGrams: number;
    brewTimeSeconds: number;
    grindSize: string;
    waterTempC: number;
  } | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('coffeecraft_beans', JSON.stringify(beans));
    } catch {
      // localStorage error handling
    }
  }, [beans]);

  useEffect(() => {
    try {
      localStorage.setItem('coffeecraft_tastings', JSON.stringify(tastings));
    } catch {
      // localStorage error handling
    }
  }, [tastings]);

  // Handle "Записать в дневник" from Brew Timer
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

  return (
    <div className="min-h-screen bg-[#110e0c] text-[#ede5dc] flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Header */}
      <Header beansCount={beans.length} tastingsCount={tastings.length} />

      {/* Main Tab Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-20">
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
      </main>

      {/* Footer */}
      <footer className="border-t border-[#341f14] bg-[#140c08]/90 py-6 px-4 text-center text-xs text-[#8e6e58]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="flex items-center justify-center gap-1.5 text-[#caa890]">
            <strong className="text-[#f5be7e]">CoffeeCraft</strong> by CyberOwl — Спешелти компаньон и помощник заваривания кофе
          </span>
          <span className="font-mono text-[#8e6e58]">© 2026 CyberOwl. Crafted with precision.</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
