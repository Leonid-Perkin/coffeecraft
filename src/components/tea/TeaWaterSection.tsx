import React, { useState } from 'react';
import {
  Thermometer,
  Droplets,
  Scale,
  AlertCircle,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export const TeaWaterSection: React.FC = () => {
  const [tempC, setTempC] = useState<number>(85);
  const [tdsPpm, setTdsPpm] = useState<number>(75);

  // Temperature guide logic
  let tempCategory = {
    title: '85°C — Светлые улуны и белый чай',
    idealFor: 'Те Гуань Инь, ГАБА Алишань, белый чай Бай Му Дань',
    desc: 'Оптимальная температура для полуферментированных улунов и плотных белых сортов. Раскрывает сиренево-медовый букет без ожога листа.',
    color: 'text-emerald-300',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  };

  if (tempC < 78) {
    tempCategory = {
      title: `${tempC}°C — Деликатные зеленые чаи и Матча`,
      idealFor: 'Лун Цзин, Сенча, Гёкуро, порошковый чай Матча',
      desc: 'Низкая температура сохраняет сладкий вкус умами и аминокислоту L-теанин, полностью предотвращая горечь и разрушение витамина C.',
      color: 'text-teal-300',
      badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40'
    };
  } else if (tempC <= 88) {
    tempCategory = {
      title: `${tempC}°C — Белый чай и высокогорные улуны`,
      idealFor: 'Бай Хао Инь Чжэнь, Те Гуань Инь, Дун Дин, ГАБА улуны',
      desc: 'Прекрасный баланс нежности и экстракции. Цветочные ноты орхидеи и персика раскрываются в полную силу.',
      color: 'text-emerald-300',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    };
  } else if (tempC <= 95) {
    tempCategory = {
      title: `${tempC}°C — Скальные улуны и красные чаи`,
      idealFor: 'Да Хун Пао, Жоу Гуй, Дянь Хун, Чжэн Шань Сяо Чжун',
      desc: 'Горячая вода пробивает глубокий прогрев листа на углях. В настой переходят теплые оттенки печеного хлеба, шоколада и карамели.',
      color: 'text-amber-300',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    };
  } else {
    tempCategory = {
      title: `${tempC}°C — Шу Пуэры, старые Шэны и варка на огне`,
      idealFor: 'Шу Пуэр (Мэнхай), выдержанные Шэны от 7 лет, Хэй Ча',
      desc: 'Крутой кипяток необходим для плотного, ферментированного листа и прессованных блинов. Дарит густой нефтяной настой с ароматом чернослива и древесной коры.',
      color: 'text-orange-300',
      badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40'
    };
  }

  // Water Mineralization (TDS) logic
  let tdsStatus = {
    status: 'ideal',
    title: 'Идеальная мягкая вода для чая (50–90 ppm)',
    desc: 'Оптимальное количество минералов: не связывает эфирные масла листа, настой кристально прозрачный, а вкус — глубокий и сладкий.',
    color: 'text-emerald-300',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  };

  if (tdsPpm < 50) {
    tdsStatus = {
      status: 'light',
      title: 'Сверхмягкая родниковая вода (< 50 ppm)',
      desc: 'Идеальна для утонченных зеленых и белых чаев (Серебряные иглы). Чай получается очень чистым, легким и прозрачным.',
      color: 'text-teal-300',
      badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40'
    };
  } else if (tdsPpm > 130) {
    tdsStatus = {
      status: 'hard',
      title: 'Слишком жесткая вода (> 130 ppm)',
      desc: 'Ионы кальция и магния связывают полифенолы чая. Настой мутнеет, на поверхности чашки появляется радужная пленка, а аромат становится плоским.',
      color: 'text-rose-300',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    };
  }

  return (
    <div className="space-y-8 animate-fade-in text-[#ede2d3]">
      {/* SECTION 1: Temperature Guide */}
      <div className="bg-[#121f15]/95 border border-[#25422d] rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        <div className="pb-5 border-b border-[#223927]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
              Термодинамика чая
            </span>
            <span className="text-xs text-[#82a88e]">• Температурная шкала</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f2f7f0] font-serif">
            Интерактивный термометр заваривания
          </h2>
          <p className="text-sm text-[#a8c5b0] mt-1.5 max-w-2xl leading-relaxed">
            Разные категории чая требуют разной температуры. Передвигайте ползунок, чтобы увидеть, какой сорт раскроется лучше всего при выбранном градусе.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Temperature Slider */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#0c160e] p-5 rounded-2xl border border-[#203625] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#c7dfcd] flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-emerald-400" />
                  Температура воды:
                </span>
                <span className="text-3xl font-extrabold text-emerald-300 font-mono">
                  {tempC}°C
                </span>
              </div>

              <input
                type="range"
                min="70"
                max="100"
                step="1"
                value={tempC}
                onChange={(e) => setTempC(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 h-2 bg-[#1b3121] rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-[#71927c]">
                <span>70°C (Зеленый/Матча)</span>
                <span>85°C (Улун/Белый)</span>
                <span>95°C (Красный)</span>
                <span>100°C (Пуэр)</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { t: 75, label: '75°C', sub: 'Зеленый' },
                { t: 85, label: '85°C', sub: 'Улун' },
                { t: 92, label: '92°C', sub: 'Красный' },
                { t: 98, label: '98°C', sub: 'Пуэр' },
              ].map((p) => (
                <button
                  key={p.t}
                  onClick={() => setTempC(p.t)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    tempC === p.t
                      ? 'bg-emerald-500/25 border-emerald-400 text-white font-bold shadow-md shadow-emerald-700/20'
                      : 'bg-[#0c160e] border-[#203625] text-[#a0c4ab] hover:border-[#2f5538] hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold font-mono">{p.label}</div>
                  <div className="text-[10px] text-[#71927c]">{p.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Result Card */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="bg-[#0c160e] p-5 rounded-2xl border border-[#26442e] space-y-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${tempCategory.badge}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {tempCategory.title}
              </span>

              <div>
                <span className="text-xs text-[#71927c] block mb-0.5">Идеально подходит для сортов:</span>
                <span className="text-sm font-bold text-[#f2f7f0]">{tempCategory.idealFor}</span>
              </div>

              <p className="text-xs text-[#a8c5b0] leading-relaxed pt-1 border-t border-[#1b3121]">
                {tempCategory.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Water Mineralization (TDS / PPM) */}
      <div className="bg-[#121f15]/95 border border-[#25422d] rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        <div className="pb-5 border-b border-[#223927]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
              Химия воды
            </span>
            <span className="text-xs text-[#82a88e]">• Минерализация (TDS / PPM)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f2f7f0] font-serif">
            Минерализация воды для чайной церемонии
          </h2>
          <p className="text-sm text-[#a8c5b0] mt-1.5 max-w-2xl leading-relaxed">
            «Вода — мать чая». Слишком жесткая вода убивает тонкие цветочные ноты, а слишком мягкая может сделать настой резким.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#0c160e] p-5 rounded-2xl border border-[#203625] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#c7dfcd] flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-emerald-400" />
                  Уровень минерализации (TDS):
                </span>
                <span className="text-3xl font-extrabold text-emerald-300 font-mono">
                  {tdsPpm} <span className="text-sm font-normal text-[#71927c]">ppm (мг/л)</span>
                </span>
              </div>

              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={tdsPpm}
                onChange={(e) => setTdsPpm(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 h-2 bg-[#1b3121] rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-[#71927c]">
                <span>20 ppm (Родник)</span>
                <span>75 ppm (Идеал Гунфу)</span>
                <span>150 ppm (Жесткая)</span>
                <span>250 ppm (Водопровод)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-[#0c160e] p-5 rounded-2xl border border-[#26442e] space-y-2.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${tdsStatus.badge}`}>
                {tdsStatus.status === 'hard' ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                {tdsStatus.title}
              </span>
              <p className="text-xs text-[#a8c5b0] leading-relaxed">
                {tdsStatus.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Stages of Boiling by Lu Yu */}
      <div className="bg-[#121f15]/95 border border-[#25422d] rounded-2xl p-5 sm:p-7 shadow-xl">
        <h3 className="text-xl font-bold text-[#f2f7f0] font-serif mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          Стадии закипания воды по «Чайному Канону» Лу Юя (VIII век)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#0c160e] border border-[#203625] space-y-1.5">
            <span className="font-bold text-emerald-300 block text-sm">1. «Рыбьи глаза» (~75–80°C)</span>
            <p className="text-[#a0c4ab]">
              Первые тихие мелкие пузырьки воздуха зарождаются на дне чайника. Звук едва слышен. Идеально для деликатных зеленых сортов.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0c160e] border border-[#203625] space-y-1.5">
            <span className="font-bold text-emerald-300 block text-sm">2. «Шум ветра в соснах» (~90–95°C)</span>
            <p className="text-[#a0c4ab]">
              Пузыри поднимаются гирляндами, поднимается устойчивый пар, чайник издает глубокий звук ветра в хвойном лесу. Вершина энергии воды!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0c160e] border border-[#203625] space-y-1.5">
            <span className="font-bold text-rose-300 block text-sm">3. «Бурный ключ» (100°C)</span>
            <p className="text-[#a0c4ab]">
              Вода кипит ключом с крупными волнами. Лу Юй предостерегал: перекипевшая вода теряет кислород, становится «состарившейся» и портит настой.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: Brewing Ratio Cheat Sheet */}
      <div className="bg-[#121f15]/95 border border-[#25422d] rounded-2xl p-5 sm:p-7 shadow-xl">
        <h3 className="text-xl font-bold text-[#f2f7f0] font-serif mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-400" />
          Шпаргалка чайных пропорций (Ratio)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-[#0c160e] border border-[#203625] rounded-xl">
            <span className="font-bold text-emerald-300 block mb-1">Гунфу Ча (Проливы)</span>
            <span className="text-lg font-mono font-bold text-[#f2f7f0] block mb-1">1 : 15 – 1 : 20</span>
            <span className="text-[#71927c]">5–8 г на 100–120 мл. Экспозиция 10–30 сек.</span>
          </div>

          <div className="p-3.5 bg-[#0c160e] border border-[#203625] rounded-xl">
            <span className="font-bold text-emerald-300 block mb-1">Чайник (Настаивание)</span>
            <span className="text-lg font-mono font-bold text-[#f2f7f0] block mb-1">1 : 80 – 1 : 90</span>
            <span className="text-[#71927c]">5 г на 450 мл. Экспозиция 3:00–4:00 мин.</span>
          </div>

          <div className="p-3.5 bg-[#0c160e] border border-[#203625] rounded-xl">
            <span className="font-bold text-emerald-300 block mb-1">Матча (Часен)</span>
            <span className="text-lg font-mono font-bold text-[#f2f7f0] block mb-1">1 : 35</span>
            <span className="text-[#71927c]">2 г на 70 мл воды 75°C. Взбивание 35 сек.</span>
          </div>

          <div className="p-3.5 bg-[#0c160e] border border-[#203625] rounded-xl">
            <span className="font-bold text-emerald-300 block mb-1">Cold Brew чай</span>
            <span className="text-lg font-mono font-bold text-[#f2f7f0] block mb-1">1 : 100</span>
            <span className="text-[#71927c]">8–10 г на 1000 мл холодной воды (8–10 ч).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
