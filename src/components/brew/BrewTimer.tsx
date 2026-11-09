import React, { useState, useEffect, useRef } from 'react';
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
  onFinishAndLog,
  onClose,
}) => {
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
                  colors: ['#d48b46', '#c88344', '#f5be7e', '#8a5332', '#fbf6ee']
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#1b110a] border border-[#52331f] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col my-auto text-[#ede2d3]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#140c08] border-b border-[#382215]">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#d48b46]">
              Пошаговый таймер
            </span>
            <h3 className="text-base font-semibold text-[#fdf8f3] leading-tight font-serif">
              {method.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg text-[#caa890] hover:text-[#f5be7e] hover:bg-[#251710] transition-colors"
              title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="text-[#9c7860] hover:text-[#fdf8f3] px-2.5 py-1 text-sm rounded-lg hover:bg-[#251710]"
            >
              Закрыть
            </button>
          </div>
        </div>

        {/* Recipe Summary Pills */}
        <div className="grid grid-cols-3 gap-2 px-5 py-2.5 bg-[#170e09] border-b border-[#2d1b11] text-xs">
          <div className="text-center">
            <span className="text-[#8e6e58] block">Кофе</span>
            <span className="font-bold text-[#f5be7e]">{coffeeGrams} г</span>
          </div>
          <div className="text-center border-x border-[#382215]">
            <span className="text-[#8e6e58] block">Вода</span>
            <span className="font-bold text-[#f5be7e]">{waterGrams} г</span>
          </div>
          <div className="text-center">
            <span className="text-[#8e6e58] block">Температура</span>
            <span className="font-bold text-[#f5be7e]">{method.recommendedTempC}°C</span>
          </div>
        </div>

        {/* Center Countdown & Visual Progress */}
        <div className="p-6 flex flex-col items-center text-center">
          {!isCompleted ? (
            <>
              {/* Step indicator */}
              <div className="flex items-center gap-1.5 mb-2">
                {scaledSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentStepIndex
                        ? 'w-8 bg-[#d48b46]'
                        : idx < currentStepIndex
                        ? 'w-3 bg-[#8a5332]'
                        : 'w-2 bg-[#362114]'
                    }`}
                  />
                ))}
              </div>

              <div className="text-xs text-[#d48b46] font-medium tracking-wide uppercase mt-1">
                Шаг {currentStepIndex + 1} из {scaledSteps.length}
              </div>

              {/* Step Title */}
              <h4 className="text-xl sm:text-2xl font-bold text-[#fdf8f3] mt-1 mb-2 font-serif">
                {currentStep.title}
              </h4>

              {/* Step instructions */}
              <p className="text-[#d8c0b0] text-sm max-w-sm mb-4 leading-relaxed bg-[#140c08] p-3 rounded-xl border border-[#382215]">
                {currentStep.description}
              </p>

              {/* Big Timer Circle / Card */}
              <div className="relative w-52 h-52 flex flex-col items-center justify-center rounded-full bg-gradient-to-b from-[#2b1910] to-[#140c08] border-4 border-[#5a3824] shadow-2xl mb-4">
                {/* Visual circular svg progress */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="104"
                    cy="104"
                    r="98"
                    className="stroke-[#23150d]"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="104"
                    cy="104"
                    r="98"
                    className="stroke-[#d48b46] transition-all duration-300 ease-linear"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 98}
                    strokeDashoffset={2 * Math.PI * 98 * (1 - stepProgress / 100)}
                    strokeLinecap="round"
                  />
                </svg>

                <span className="text-xs text-[#a3826c] uppercase tracking-wider mb-0.5 z-10">
                  Осталось
                </span>
                <span className="text-4xl sm:text-5xl font-extrabold text-[#fdf8f3] font-mono z-10 tracking-tight">
                  {formatTime(stepSecondsLeft)}
                </span>
                <div className="text-xs text-[#a3826c] mt-1 z-10 font-mono">
                  Всего: {formatTime(totalSecondsElapsed)}
                </div>
              </div>

              {/* Water Target Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d48b46]/15 border border-[#d48b46]/40 rounded-xl text-[#f5be7e] font-medium text-sm mb-4">
                <Droplets className="w-4 h-4 text-[#d48b46]" />
                <span>Цель на весах: <strong className="text-[#fdf8f3] text-base">{currentStep.targetWaterGrams} г</strong></span>
              </div>
            </>
          ) : (
            /* Finished Screen */
            <div className="py-6 flex flex-col items-center animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-[#d48b46]/20 border-2 border-[#d48b46] flex items-center justify-center text-[#f5be7e] mb-4 shadow-xl shadow-[#d48b46]/20">
                <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
              </div>

              <h4 className="text-2xl font-bold text-[#fdf8f3] mb-1 font-serif">
                Чашка готова к дегустации!
              </h4>
              <p className="text-[#caa890] text-sm max-w-xs mb-6">
                Вы завершили заваривание {method.name} за{' '}
                <span className="text-[#f5be7e] font-bold">{formatTime(totalSecondsElapsed)}</span>.
                Дайте напитку остыть до 60–65°C для идеального раскрытия букета.
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
                className="w-full sm:w-auto px-7 py-3.5 btn-crema border border-[#f3be7a]/60 text-[#140d09] font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-5 h-5" />
                Записать результат в дневник
              </button>
            </div>
          )}

          {/* Overall progress bar */}
          {!isCompleted && (
            <div className="w-full bg-[#24150d] rounded-full h-1.5 overflow-hidden mb-5">
              <div
                className="bg-gradient-to-r from-[#8a5332] via-[#d48b46] to-[#f5be7e] h-full transition-all duration-300"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          )}

          {/* Controls Bar */}
          {!isCompleted && (
            <div className="flex items-center justify-center gap-3 w-full">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="p-3 rounded-xl bg-[#251710] hover:bg-[#342016] disabled:opacity-30 disabled:cursor-not-allowed text-[#ede2d3] border border-[#3e2618] transition-colors cursor-pointer"
                title="Предыдущий шаг"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handleStartPause}
                className={`px-8 py-3.5 rounded-xl font-bold text-base flex items-center gap-2.5 transition-all cursor-pointer ${
                  isRunning
                    ? 'bg-[#8a5332] text-[#fdf8f3] border border-[#d48b46]/50 shadow-md'
                    : 'btn-crema border border-[#f3be7a]/60 text-[#140d09]'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    Пауза
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    {totalSecondsElapsed === 0 ? 'Начать заваривание' : 'Продолжить'}
                  </>
                )}
              </button>

              <button
                onClick={handleNextStep}
                className="p-3 rounded-xl bg-[#251710] hover:bg-[#342016] text-[#ede2d3] border border-[#3e2618] transition-colors cursor-pointer"
                title="Следующий шаг"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={handleReset}
                className="p-3 rounded-xl bg-[#251710] hover:bg-[#342016] text-[#9c7860] hover:text-[#fdf8f3] border border-[#3e2618] transition-colors ml-1 cursor-pointer"
                title="Сбросить таймер"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
