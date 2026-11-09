import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Info, X, Sparkles, Heart, Download } from 'lucide-react';
import { CyberOwlLogo } from './CyberOwlLogo';

interface HeaderProps {
  beansCount: number;
  tastingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ beansCount, tastingsCount }) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Check if already in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setCanInstall(false);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice?.outcome === 'accepted') {
      setCanInstall(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#160e0a]/92 backdrop-blur-md border-b border-[#3d271a] px-4 sm:px-6 py-3 shadow-lg shadow-black/25">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#281810] via-[#1a0f0a] to-[#2f1b11] flex items-center justify-center border border-[#d48b46]/50 shadow-md shadow-[#d48b46]/15 group transition-transform hover:scale-105 cursor-pointer">
              <CyberOwlLogo className="w-7 h-7 drop-shadow-[0_0_6px_rgba(245,190,126,0.4)]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-[#fdf8f3] tracking-tight leading-none m-0 p-0 font-serif">
                  CoffeeCraft
                </h1>
                <span className="text-[10px] font-bold bg-[#d48b46]/20 text-[#f5be7e] border border-[#d48b46]/45 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  by CyberOwl
                </span>
              </div>
              <p className="text-[11px] text-[#caa890] m-0 p-0 hidden sm:block">
                Specialty Coffee Companion & Barista Toolkit
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

            {canInstall && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold btn-crema border border-[#f3be7a]/60 text-[#140d09] shadow-md transition-all cursor-pointer"
                title="Установить как PWA приложение на телефон или компьютер"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Установить</span>
              </button>
            )}

            <button
              onClick={() => setIsAboutOpen(true)}
              className="p-2 text-[#caa890] hover:text-[#f5be7e] hover:bg-[#251710] rounded-xl transition-colors border border-[#3f271a] cursor-pointer"
              title="О проекте CyberOwl"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* About Modal */}
      {isAboutOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#1e130c] border border-[#5a3723] rounded-2xl w-full max-w-md p-6 shadow-2xl relative my-auto animate-fade-in text-[#ede2d3] max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-[#9e7e68] hover:text-[#fdf8f3] hover:bg-[#2e1d13] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-13 h-13 rounded-2xl bg-[#140c08] border border-[#d48b46]/50 flex items-center justify-center shadow-lg shadow-[#d48b46]/20 p-2">
                  <CyberOwlLogo className="w-9 h-9" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#fdf8f3] font-serif">CoffeeCraft</h3>
                    <span className="text-[11px] font-bold text-[#f5be7e] bg-[#d48b46]/20 border border-[#d48b46]/40 px-2 py-0.5 rounded-full font-mono">
                      by CyberOwl
                    </span>
                  </div>
                  <span className="text-xs text-[#d48b46] font-medium">Specialty Coffee Companion</span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#d8c0b0] leading-relaxed">
                <p>
                  Цифровой компаньон для домашних кофейных гиков, энтузиастов и бариста. Разработано в лаборатории <strong>CyberOwl</strong> для точного заваривания и осознанной сенсорной дегустации.
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
                  Все ваши записи, сорта и настройки сохраняются в локальной памяти браузера и работают без подключения к сети.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#3a2316] flex items-center justify-between text-xs text-[#8c6d59]">
                <span className="flex items-center gap-1.5">
                  Crafted with <Heart className="w-3.5 h-3.5 text-[#d48b46] fill-[#d48b46]" /> by CyberOwl
                </span>
                <span className="font-mono">v1.3.0</span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
