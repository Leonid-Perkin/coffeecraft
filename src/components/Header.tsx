import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Info, X, Sparkles, Heart, Download } from 'lucide-react';
import { CyberOwlLogo } from './CyberOwlLogo';

interface HeaderProps {
  appMode: 'coffee' | 'tea';
  setAppMode: (mode: 'coffee' | 'tea') => void;
  beansCount: number;
  tastingsCount: number;
  teasCount: number;
  teaTastingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  appMode,
  setAppMode,
  beansCount,
  tastingsCount,
  teasCount,
  teaTastingsCount,
}) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  const isTea = appMode === 'tea';

  useEffect(() => {
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
      <header
        className={`sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-lg shadow-black/25 transition-colors duration-300 border-b ${
          isTea
            ? 'bg-[#0e1911]/92 border-[#203a27]'
            : 'bg-[#160e0a]/92 border-[#3d271a]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border shadow-md transition-all duration-300 ${
                isTea
                  ? 'bg-gradient-to-br from-[#1b3524] via-[#0f2316] to-[#1c3826] border-emerald-500/50 shadow-emerald-500/20'
                  : 'bg-gradient-to-br from-[#281810] via-[#1a0f0a] to-[#2f1b11] border-[#d48b46]/50 shadow-[#d48b46]/15'
              }`}
            >
              <CyberOwlLogo
                variant={appMode}
                className={`w-6 h-6 sm:w-7 sm:h-7 ${
                  isTea ? 'drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'drop-shadow-[0_0_6px_rgba(245,190,126,0.4)]'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-extrabold text-[#fdf8f3] tracking-tight leading-none m-0 p-0 font-serif">
                  {isTea ? 'TeaCraft' : 'CoffeeCraft'}
                </h1>
                <span
                  className={`text-[10px] font-bold border px-2 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                    isTea
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-[#d48b46]/20 text-[#f5be7e] border-[#d48b46]/45'
                  }`}
                >
                  by CyberOwl
                </span>
              </div>
              <p
                className={`text-[11px] m-0 p-0 hidden sm:block ${
                  isTea ? 'text-[#8ab396]' : 'text-[#caa890]'
                }`}
              >
                {isTea ? 'Gongfu Cha & Specialty Tea Lab' : 'Specialty Coffee Companion & Barista Toolkit'}
              </p>
            </div>
          </div>

          {/* Mode Switcher: ☕ Кофе / 🍵 Чай */}
          <div className="flex items-center bg-[#0d1610] p-1 rounded-2xl border border-[#2b3a2f] shadow-inner">
            <button
              onClick={() => setAppMode('coffee')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !isTea
                  ? 'btn-crema border border-[#f3be7a]/60 text-[#140d09] shadow-md'
                  : 'text-[#8da895] hover:text-white'
              }`}
            >
              <span>☕</span>
              <span className="hidden sm:inline">Кофе</span>
            </button>

            <button
              onClick={() => setAppMode('tea')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isTea
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-[#09150d] font-extrabold shadow-md shadow-emerald-700/30 border border-emerald-300/50'
                  : 'text-[#8da895] hover:text-white'
              }`}
            >
              <span>🍵</span>
              <span className="hidden sm:inline">Чай</span>
            </button>
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center gap-2.5">
            <div
              className={`hidden md:flex items-center gap-2 border rounded-xl px-3 py-1.5 text-xs ${
                isTea
                  ? 'bg-[#122417] border-[#25462e] text-[#b8dec4]'
                  : 'bg-[#21150e] border-[#42291b] text-[#d8c0b0]'
              }`}
            >
              <span className={isTea ? 'text-[#7ea38b]' : 'text-[#9e7e68]'}>
                {isTea ? 'Сортов:' : 'Сортов:'}
              </span>
              <span className={`font-bold font-mono ${isTea ? 'text-emerald-300' : 'text-[#f5be7e]'}`}>
                {isTea ? teasCount : beansCount}
              </span>
              <span className={isTea ? 'text-[#31573c]' : 'text-[#4e3222]'}>|</span>
              <span className={isTea ? 'text-[#7ea38b]' : 'text-[#9e7e68]'}>
                {isTea ? 'Чаепитий:' : 'Чашек:'}
              </span>
              <span className={`font-bold font-mono ${isTea ? 'text-emerald-300' : 'text-[#f5be7e]'}`}>
                {isTea ? teaTastingsCount : tastingsCount}
              </span>
            </div>

            {canInstall && (
              <button
                onClick={handleInstallClick}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer border ${
                  isTea
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-[#09150d] border-emerald-300'
                    : 'btn-crema border-[#f3be7a]/60 text-[#140d09]'
                }`}
                title="Установить как PWA приложение"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Установить</span>
              </button>
            )}

            <button
              onClick={() => setIsAboutOpen(true)}
              className={`p-2 rounded-xl transition-colors border cursor-pointer ${
                isTea
                  ? 'text-[#8ab396] hover:text-emerald-300 hover:bg-[#183020] border-[#22402b]'
                  : 'text-[#caa890] hover:text-[#f5be7e] hover:bg-[#251710] border-[#3f271a]'
              }`}
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
            <div
              className={`border rounded-2xl w-full max-w-md p-6 shadow-2xl relative my-auto animate-fade-in text-[#ede2d3] max-h-[90vh] overflow-y-auto ${
                isTea ? 'bg-[#101e14] border-[#2e5639]' : 'bg-[#1e130c] border-[#5a3723]'
              }`}
            >
              <button
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-[#88a892] hover:text-[#fdf8f3] hover:bg-[#1f3a27] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5 mb-4">
                <div
                  className={`w-13 h-13 rounded-2xl border flex items-center justify-center shadow-lg p-2 ${
                    isTea
                      ? 'bg-[#0a150e] border-emerald-500/50 shadow-emerald-500/20'
                      : 'bg-[#140c08] border-[#d48b46]/50 shadow-[#d48b46]/20'
                  }`}
                >
                  <CyberOwlLogo variant={appMode} className="w-9 h-9" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#fdf8f3] font-serif">
                      {isTea ? 'TeaCraft' : 'CoffeeCraft'}
                    </h3>
                    <span
                      className={`text-[11px] font-bold border px-2 py-0.5 rounded-full font-mono ${
                        isTea
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-[#d48b46]/20 text-[#f5be7e] border-[#d48b46]/40'
                      }`}
                    >
                      by CyberOwl
                    </span>
                  </div>
                  <span className={`text-xs font-medium ${isTea ? 'text-emerald-400' : 'text-[#d48b46]'}`}>
                    {isTea ? 'Gongfu Cha & Specialty Tea Companion' : 'Specialty Coffee Companion'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#c7dfcd] leading-relaxed">
                <p>
                  Цифровая лаборатория осознанного заваривания от <strong>CyberOwl</strong>. Теперь объединяет культуру спешелти-кофе и великую китайскую чайную традицию Гунфу Ча в единой экосистеме.
                </p>
                <div className="bg-[#0b160f] p-3.5 rounded-xl border border-[#213b28] space-y-2 text-xs">
                  <div className={`flex items-center gap-2 ${isTea ? 'text-emerald-300' : 'text-[#f5be7e]'}`}>
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Пошаговые таймеры: эспрессо, пуроверы, гайвань проливами, варка на огне</span>
                  </div>
                  <div className={`flex items-center gap-2 ${isTea ? 'text-emerald-300' : 'text-[#f5be7e]'}`}>
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Два сенсорных радара: SCA колесо кофе и китайский радар Хуэй Гань / Ча Ци</span>
                  </div>
                  <div className={`flex items-center gap-2 ${isTea ? 'text-emerald-300' : 'text-[#f5be7e]'}`}>
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Энциклопедия: 6 категорий китайского чая и авторские слои кофейных напитков</span>
                  </div>
                  <div className={`flex items-center gap-2 ${isTea ? 'text-emerald-300' : 'text-[#f5be7e]'}`}>
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>100% PWA оффлайн-работа с сохранением дневника в LocalStorage</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#233a29] flex items-center justify-between text-xs text-[#71927c]">
                <span className="flex items-center gap-1.5">
                  Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by CyberOwl
                </span>
                <span className="font-mono">v1.4.0</span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
