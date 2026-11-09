import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { BrewMethod, BrewStep } from '../../types';
import { soundManager } from '../../utils/audio';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  CheckCircle2,
  Droplets,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BrewTimerProps {
  method: BrewMethod;
  coffeeGrams: number;
  waterGrams: number;
  theme?: 'coffee' | 'tea';
  doseLabel?: string;
  onFinishAndLog: (details: {
    methodName: string;
    coffeeGrams: number;
    waterGrams: number;
    brewTimeSeconds: number;
    grindSize: string;
    waterTempC: number;
  }) => void;
  onClose: () => void;
}

export const BrewTimer: React.FC<BrewTimerProps> = ({
  method,
  coffeeGrams,
  waterGrams,
  theme = 'coffee',
  doseLabel = 'Кофе',
  onFinishAndLog,
  onClose,
}) => {
  const isTea = theme === 'tea';

  // Scale steps based on user's target water ratio
  const ratioMultiplier = waterGrams / method.defaultWaterGrams;

  const scaledSteps: BrewStep[] = method.steps.map((step) => ({
    ...step,
    targetWaterGrams: Math.round(step.targetWaterGrams * ratioMultiplier),
  }));

  const totalBrewSeconds = scaledSteps.reduce((acc, step) => acc + step.timeSeconds, 0);

  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepSecondsElapsed, setStepSecondsElapsed] = useState(0);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<number | null>(null);

  const currentStep = scaledSteps[currentStepIndex] || scaledSteps[scaledSteps.length - 1];
  const stepSecondsLeft = Math.max(0, currentStep.timeSeconds - stepSecondsElapsed);

  // Audio countdown cue triggering at 3, 2, 1
  useEffect(() => {
    if (!isRunning || !soundEnabled || isCompleted) return;

    if (stepSecondsLeft <= 3 && stepSecondsLeft > 0) {
      soundManager.playTick();
    }
  }, [stepSecondsLeft, isRunning, soundEnabled, isCompleted]);

  // Main timer interval
  useEffect(() => {
    if (isRunning && !isCompleted) {
      timerRef.current = window.setInterval(() => {
        setTotalSecondsElapsed((prev) => prev + 1);
        setStepSecondsElapsed((prevStepSec) => {
          const nextSec = prevStepSec + 1;
          if (nextSec >= currentStep.timeSeconds) {
            // Move to next step or complete
            if (currentStepIndex < scaledSteps.length - 1) {
              if (soundEnabled) soundManager.playStepChime();
              setCurrentStepIndex((prevIdx) => prevIdx + 1);
              return 0;
            } else {
              // Complete
              setIsRunning(false);
              setIsCompleted(true);
              if (soundEnabled) soundManager.playCompletionChime();
              try {
                confetti({
                  particleCount: 120,
                  spread: 80,
                  origin: { y: 0.6 },
                  colors: isTea
                    ? ['#34d399', '#10b981', '#6ee7b7', '#f2f7f0', '#059669']
                    : ['#d48b46', '#c88344', '#f5be7e', '#8a5332', '#fbf6ee'],
                });
              } catch {
                // Ignore confetti error if any
              }
              return currentStep.timeSeconds;
            }
          }
          return nextSec;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, currentStepIndex, currentStep, scaledSteps, isCompleted, soundEnabled]);

  const handleStartPause = () => {
    if (isCompleted) return;
    if (!isRunning && totalSecondsElapsed === 0 && soundEnabled) {
      soundManager.playStepChime();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStepIndex(0);
    setStepSecondsElapsed(0);
    setTotalSecondsElapsed(0);
    setIsCompleted(false);
  };

  const handleNextStep = () => {
    if (currentStepIndex < scaledSteps.length - 1) {
      if (soundEnabled) soundManager.playStepChime();
      setCurrentStepIndex((prev) => prev + 1);
      setStepSecondsElapsed(0);
    } else {
      setIsRunning(false);
      setIsCompleted(true);
      if (soundEnabled) soundManager.playCompletionChime();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setStepSecondsElapsed(0);
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Step Progress %
  const stepProgress = Math.min(100, (stepSecondsElapsed / (currentStep.timeSeconds || 1)) * 100);
  const totalProgress = Math.min(100, (totalSecondsElapsed / (totalBrewSeconds || 1)) * 100);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className={`border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh] text-[#ede2d3] transition-colors ${
          isTea ? 'bg-[#101c13] border-[#2b4d34]' : 'bg-[#1b110a] border-[#52331f]'
        }`}
      >
        {/* Header Bar */}
        <div
          className={`flex items-center justify-between px-5 py-3.5 border-b shrink-0 ${
            isTea ? 'bg-[#0a140d] border-[#1d3323]' : 'bg-[#140c08] border-[#382215]'
          }`}
        >
          <div>
            <span
              className={`text-xs uppercase tracking-wider font-semibold ${
                isTea ? 'text-emerald-400' : 'text-[#d48b46]'
              }`}
            >
              {isTea ? 'Чайный таймер' : 'Пошаговый таймер'}
            </span>
            <h3 className="text-base font-semibold text-[#fdf8f3] leading-tight font-serif">
              {method.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isTea
                  ? 'text-[#8ab396] hover:text-emerald-300 hover:bg-[#1a2e20]'
                  : 'text-[#caa890] hover:text-[#f5be7e] hover:bg-[#251710]'
              }`}
              title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className={`px-2.5 py-1 text-sm rounded-lg cursor-pointer ${
                isTea
                  ? 'text-[#7ea38b] hover:text-[#fdf8f3] hover:bg-[#1a2e20]'
                  : 'text-[#9c7860] hover:text-[#fdf8f3] hover:bg-[#251710]'
              }`}
            >
              Закрыть
            </button>
          </div>
        </div>

        {/* Recipe Summary Pills */}
        <div
          className={`grid grid-cols-3 gap-2 px-5 py-2.5 border-b text-xs shrink-0 ${
            isTea ? 'bg-[#0f1a12] border-[#1c3022]' : 'bg-[#170e09] border-[#2d1b11]'
          }`}
        >
          <div className="text-center">
            <span className={`block ${isTea ? 'text-[#6e9278]' : 'text-[#8e6e58]'}`}>{doseLabel}</span>
            <span className={`font-bold ${isTea ? 'text-emerald-300' : 'text-[#f5be7e]'}`}>
              {coffeeGrams} г
            </span>
          </div>
          <div className={`text-center border-x ${isTea ? 'border-[#1c3022]' : 'border-[#382215]'}`}>
            <span className={`block ${isTea ? 'text-[#6e9278]' : 'text-[#8e6e58]'}`}>Вода</span>
            <span className={`font-bold ${isTea ? 'text-emerald-300' : 'text-[#f5be7e]'}`}>
              {waterGrams} г
            </span>
          </div>
          <div className="text-center">
            <span className={`block ${isTea ? 'text-[#6e9278]' : 'text-[#8e6e58]'}`}>Температура</span>
            <span className={`font-bold ${isTea ? 'text-emerald-300' : 'text-[#f5be7e]'}`}>
              {method.recommendedTempC}°C
            </span>
          </div>
        </div>

        {/* Center Countdown & Visual Progress (Scrollable) */}
        <div className="p-4 sm:p-6 flex flex-col items-center text-center overflow-y-auto flex-1 min-h-0">
          {!isCompleted ? (
            <>
              {/* Step indicator */}
              <div className="flex items-center gap-1.5 mb-2 shrink-0">
                {scaledSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentStepIndex
                        ? isTea
                          ? 'w-8 bg-emerald-400'
                          : 'w-8 bg-[#d48b46]'
                        : idx < currentStepIndex
                        ? isTea
                          ? 'w-3 bg-emerald-700'
                          : 'w-3 bg-[#8a5332]'
                        : isTea
                        ? 'w-2 bg-[#1c3322]'
                        : 'w-2 bg-[#362114]'
                    }`}
                  />
                ))}
              </div>

              <div
                className={`text-xs font-medium tracking-wide uppercase mt-1 shrink-0 ${
                  isTea ? 'text-emerald-400' : 'text-[#d48b46]'
                }`}
              >
                Шаг {currentStepIndex + 1} из {scaledSteps.length}
              </div>

              {/* Step Title */}
              <h4 className="text-lg sm:text-2xl font-bold text-[#fdf8f3] mt-1 mb-2 font-serif shrink-0">
                {currentStep.title}
              </h4>

              {/* Step instructions */}
              <p
                className={`text-xs sm:text-sm max-w-sm mb-3 sm:mb-4 leading-relaxed p-2.5 sm:p-3 rounded-xl border shrink-0 ${
                  isTea
                    ? 'text-[#c7dfcd] bg-[#0c160e] border-[#1d3523]'
                    : 'text-[#d8c0b0] bg-[#140c08] border-[#382215]'
                }`}
              >
                {currentStep.description}
              </p>

              {/* Big Timer Circle / Card */}
              <div
                className={`relative w-36 h-36 sm:w-48 sm:h-48 shrink-0 flex flex-col items-center justify-center rounded-full bg-gradient-to-b border-4 shadow-2xl mb-2 sm:mb-4 ${
                  isTea
                    ? 'from-[#172e20] to-[#0a140d] border-emerald-500/40'
                    : 'from-[#2b1910] to-[#140c08] border-[#5a3824]'
                }`}
              >
                {/* Visual circular svg progress */}
                <svg viewBox="0 0 208 208" className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="104"
                    cy="104"
                    r="98"
                    className={isTea ? 'stroke-[#14261a]' : 'stroke-[#23150d]'}
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="104"
                    cy="104"
                    r="98"
                    className={`transition-all duration-300 ease-linear ${
                      isTea ? 'stroke-emerald-400' : 'stroke-[#d48b46]'
                    }`}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 98}
                    strokeDashoffset={2 * Math.PI * 98 * (1 - stepProgress / 100)}
                    strokeLinecap="round"
                  />
                </svg>

                <span
                  className={`text-xs uppercase tracking-wider mb-0.5 z-10 ${
                    isTea ? 'text-[#7ea38b]' : 'text-[#a3826c]'
                  }`}
                >
                  Осталось
                </span>
                <span className="text-3xl sm:text-5xl font-extrabold text-[#fdf8f3] font-mono z-10 tracking-tight">
                  {formatTime(stepSecondsLeft)}
                </span>
                <div
                  className={`text-xs mt-0.5 z-10 font-mono ${
                    isTea ? 'text-[#7ea38b]' : 'text-[#a3826c]'
                  }`}
                >
                  Всего: {formatTime(totalSecondsElapsed)}
                </div>
              </div>

              {/* Water Target Badge */}
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 border rounded-xl font-medium text-xs sm:text-sm shrink-0 ${
                  isTea
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-[#d48b46]/15 border-[#d48b46]/40 text-[#f5be7e]'
                }`}
              >
                <Droplets className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isTea ? 'text-emerald-400' : 'text-[#d48b46]'}`} />
                <span>
                  Цель на весах:{' '}
                  <strong className="text-[#fdf8f3] text-sm sm:text-base">{currentStep.targetWaterGrams} г</strong>
                </span>
              </div>
            </>
          ) : (
            /* Finished Screen */
            <div className="py-6 flex flex-col items-center animate-fade-in my-auto">
              <div
                className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center mb-4 shadow-xl ${
                  isTea
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-emerald-500/20'
                    : 'bg-[#d48b46]/20 border-[#d48b46] text-[#f5be7e] shadow-[#d48b46]/20'
                }`}
              >
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
              </div>

              <h4 className="text-xl sm:text-2xl font-bold text-[#fdf8f3] mb-1 font-serif">
                {isTea ? 'Настой готов к разливу!' : 'Чашка готова к дегустации!'}
              </h4>
              <p className={`text-xs sm:text-sm max-w-xs mb-6 ${isTea ? 'text-[#a0c4ab]' : 'text-[#caa890]'}`}>
                Вы завершили заваривание {method.name} за{' '}
                <span className={`font-bold ${isTea ? 'text-emerald-300' : 'text-[#f5be7e]'}`}>
                  {formatTime(totalSecondsElapsed)}
                </span>
                . {isTea ? 'Разлейте по пиалам и насладитесь ароматом.' : 'Дайте напитку остыть для раскрытия букета.'}
              </p>

              <button
                onClick={() =>
                  onFinishAndLog({
                    methodName: method.name,
                    coffeeGrams,
                    waterGrams,
                    brewTimeSeconds: totalSecondsElapsed,
                    grindSize: method.recommendedGrind,
                    waterTempC: method.recommendedTempC,
                  })
                }
                className={`w-full sm:w-auto px-7 py-3.5 font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isTea
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-[#09150d] border border-emerald-300/50 shadow-lg shadow-emerald-700/30'
                    : 'btn-crema border border-[#f3be7a]/60 text-[#140d09]'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                {isTea ? 'Записать чаепитие в дневник' : 'Записать результат в дневник'}
              </button>
            </div>
          )}
        </div>

        {/* Pinned Bottom Controls Bar (shrink-0) */}
        {!isCompleted && (
          <div
            className={`p-3 sm:p-4 border-t shrink-0 flex flex-col gap-2.5 ${
              isTea ? 'bg-[#0a140d] border-[#1d3323]' : 'bg-[#140c08] border-[#382215]'
            }`}
          >
            {/* Progress bar */}
            <div
              className={`w-full rounded-full h-1.5 overflow-hidden ${
                isTea ? 'bg-[#15271b]' : 'bg-[#24150d]'
              }`}
            >
              <div
                className={`h-full transition-all duration-300 ${
                  isTea
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-300'
                    : 'bg-gradient-to-r from-[#8a5332] via-[#d48b46] to-[#f5be7e]'
                }`}
                style={{ width: `${totalProgress}%` }}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className={`p-2.5 sm:p-3 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed border transition-colors cursor-pointer shrink-0 ${
                  isTea
                    ? 'bg-[#152418] hover:bg-[#1f3624] text-[#ede2d3] border-[#25422d]'
                    : 'bg-[#251710] hover:bg-[#342016] text-[#ede2d3] border-[#3e2618]'
                }`}
                title="Предыдущий шаг"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={handleStartPause}
                className={`flex-1 sm:flex-none px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isRunning
                    ? isTea
                      ? 'bg-[#1c3b26] text-emerald-200 border border-emerald-500/50 shadow-md'
                      : 'bg-[#8a5332] text-[#fdf8f3] border border-[#d48b46]/50 shadow-md'
                    : isTea
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-[#09150d] font-bold border border-emerald-300/50 shadow-lg shadow-emerald-700/30'
                    : 'btn-crema border border-[#f3be7a]/60 text-[#140d09]'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    <span>Пауза</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    <span>
                      {totalSecondsElapsed === 0 ? (
                        <>
                          <span className="sm:hidden">Старт</span>
                          <span className="hidden sm:inline">Начать заваривание</span>
                        </>
                      ) : (
                        'Продолжить'
                      )}
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={handleNextStep}
                className={`p-2.5 sm:p-3 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                  isTea
                    ? 'bg-[#152418] hover:bg-[#1f3624] text-[#ede2d3] border-[#25422d]'
                    : 'bg-[#251710] hover:bg-[#342016] text-[#ede2d3] border-[#3e2618]'
                }`}
                title="Следующий шаг"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={handleReset}
                className={`p-2.5 sm:p-3 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                  isTea
                    ? 'bg-[#152418] hover:bg-[#1f3624] text-[#7ea38b] hover:text-[#fdf8f3] border-[#25422d]'
                    : 'bg-[#251710] hover:bg-[#342016] text-[#9c7860] hover:text-[#fdf8f3] border-[#3e2618]'
                }`}
                title="Сбросить таймер"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
