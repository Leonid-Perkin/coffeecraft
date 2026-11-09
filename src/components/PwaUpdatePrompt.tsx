import React, { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface PwaUpdatePromptProps {
  appMode?: 'coffee' | 'tea';
}

export const PwaUpdatePrompt: React.FC<PwaUpdatePromptProps> = ({ appMode = 'coffee' }) => {
  const isTea = appMode === 'tea';
  const [showOfflineToast, setShowOfflineToast] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Periodically check for updates (every 30 minutes)
        setInterval(() => {
          r.update().catch(() => {});
        }, 30 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.warn('PWA registration error:', error);
    },
  });

  // Show offline ready toast briefly
  useEffect(() => {
    if (offlineReady) {
      setShowOfflineToast(true);
      const timer = setTimeout(() => {
        setShowOfflineToast(false);
        setOfflineReady(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [offlineReady, setOfflineReady]);

  // Listen for custom manual check event from Header
  useEffect(() => {
    const handleManualCheck = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) {
            await reg.update();
            if (reg.waiting) {
              setNeedRefresh(true);
            }
          }
        } catch {
          // Ignore
        }
      }
    };

    window.addEventListener('check-pwa-update', handleManualCheck);
    return () => window.removeEventListener('check-pwa-update', handleManualCheck);
  }, [setNeedRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleCloseNeedRefresh = () => {
    setNeedRefresh(false);
  };

  return (
    <>
      {/* Offline Ready Notification */}
      {showOfflineToast && (
        <div className="fixed bottom-4 left-4 z-[99] animate-fade-in max-w-sm">
          <div
            className={`p-3.5 rounded-2xl border shadow-2xl flex items-center gap-3 backdrop-blur-md ${
              isTea
                ? 'bg-[#101f14]/95 border-[#284931] text-[#e2eee4]'
                : 'bg-[#1b110a]/95 border-[#52331f] text-[#ede2d3]'
            }`}
          >
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold block text-[#fdf8f3]">Оффлайн-режим активирован</span>
              <span className="text-[#a0c4ab]">Приложение сохранено и работает без интернета</span>
            </div>
            <button
              onClick={() => setShowOfflineToast(false)}
              className="p-1 text-[#8e6e58] hover:text-white ml-auto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* New Version Available Update Banner / Toast */}
      {needRefresh && (
        <div className="fixed bottom-4 right-4 z-[99] animate-fade-in max-w-md w-[calc(100vw-2rem)] sm:w-auto">
          <div
            className={`p-4 rounded-2xl border-2 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md ${
              isTea
                ? 'bg-[#0f1f14]/98 border-emerald-400 shadow-emerald-500/20 text-[#f2f7f0]'
                : 'bg-[#1c120c]/98 border-[#d48b46] shadow-[#d48b46]/20 text-[#fdf8f3]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
                  isTea
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300'
                    : 'bg-[#d48b46]/25 border-[#d48b46] text-[#f5be7e]'
                }`}
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-sm block">Доступна новая версия!</span>
                <span className={isTea ? 'text-[#a0c4ab]' : 'text-[#caa890]'}>
                  Обновите, чтобы получить свежие функции и рецепты
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-1 sm:pt-0">
              <button
                onClick={handleUpdate}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
                  isTea
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-[#09150d] border border-emerald-300/50'
                    : 'btn-crema border border-[#f3be7a]/60 text-[#140d09]'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Обновить сейчас</span>
              </button>

              <button
                onClick={handleCloseNeedRefresh}
                className="p-1.5 rounded-lg text-[#8e6e58] hover:text-white hover:bg-white/10 transition-colors"
                title="Закрыть уведомление"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
