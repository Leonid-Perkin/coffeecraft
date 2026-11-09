import type { TeaItem, TeaTastingEntry } from '../types/tea';

export const INITIAL_TEAS: TeaItem[] = [
  {
    id: 'tea-1',
    name: 'Да Хун Пао (Большой красный халат)',
    chineseName: '大红袍',
    category: 'Улун (Цин Ча)',
    province: 'Фуцзянь, горы Уишань',
    harvestYear: '2025',
    grade: 'Средний прогрев на углях (Чжун Хо)',
    userRating: 5,
    descriptors: ['Печеный хлеб', 'Орхидея', 'Тёмный шоколад', 'Карамель'],
    notes: 'Утёсный улун высокой плотности. Вкус переливается от пряно-древесного к нежнейшему цветочному шлейфу.',
    createdAt: Date.now() - 86400000 * 4
  },
  {
    id: 'tea-2',
    name: 'Шу Пуэр Мэнхай «Золотой павлин»',
    chineseName: '勐海金孔雀',
    category: 'Шу Пуэр',
    province: 'Юньнань, Сишуанбаньна',
    harvestYear: '2019 (выдержка)',
    grade: 'Гунтин (дворцовый лист)',
    userRating: 5,
    descriptors: ['Чернослив', 'Грецкий орех', 'Древесная кора', 'Финики'],
    notes: 'Шелковистый нефтяной настой. Глубокое согревающее состояние Ча Ци, сладкий финиковый финиш.',
    createdAt: Date.now() - 86400000 * 7
  },
  {
    id: 'tea-3',
    name: 'Лун Цзин «Колодец Дракона» Премиум',
    chineseName: '西湖龙井',
    category: 'Зеленый (Люй Ча)',
    province: 'Чжэцзян, озеро Сиху',
    harvestYear: '2026 (ранняя весна До Дождей)',
    grade: 'Ши Фэн (Львиный пик)',
    userRating: 4.9,
    descriptors: ['Жареный каштан', 'Свежий горошек', 'Луговые цветы', 'Сливочное масло'],
    notes: 'Хрестоматийный плоский лист ручной обжарки в котле. Невероятный орехово-сливочный аромат.',
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'tea-4',
    name: 'ГАБА Алишань «Рубиновая»',
    chineseName: '阿里山佳叶龙茶',
    category: 'Улун (Цин Ча)',
    province: 'Тайвань, гора Алишань (1400 м)',
    harvestYear: '2025',
    grade: 'Бескислородная ферментация с гамма-аминомасляной кислотой',
    userRating: 5,
    descriptors: ['Сушеная вишня', 'Карамельное яблоко', 'Ржаной хлеб', 'Мёд'],
    notes: 'Мягкий ягодно-карамельный вкус с приятной кислинкой. Снимает стресс и концентрирует внимание.',
    createdAt: Date.now() - 86400000 * 10
  }
];

export const INITIAL_TEA_TASTINGS: TeaTastingEntry[] = [
  {
    id: 'tea-tasting-1',
    teaName: 'Да Хун Пао (Большой красный халат)',
    category: 'Улун (Цин Ча)',
    province: 'Фуцзянь, Уишань',
    date: '2026-11-07',
    methodName: 'Гунфу Ча (Проливы в гайвани)',
    leafGrams: 7,
    waterGrams: 110,
    waterTempC: 95,
    steepsCount: 7,
    rating: 5,
    flavorProfile: {
      aroma: 10,
      huigan: 9,
      chaqi: 9,
      body: 8,
      freshness: 7,
      astringency: 3
    },
    descriptors: ['Печеный хлеб', 'Орхидея', 'Тёмный шоколад'],
    verdictNotes: 'С 3-го пролива на крышечке гайвани появился яркий аромат дикой орхидеи. Сладкое возвращающееся послевкусие (Хуэй Гань) держалось более 20 минут.'
  },
  {
    id: 'tea-tasting-2',
    teaName: 'Шу Пуэр Мэнхай «Золотой павлин»',
    category: 'Шу Пуэр',
    province: 'Юньнань',
    date: '2026-11-09',
    methodName: 'Варка на огне по Лу Юю',
    leafGrams: 12,
    waterGrams: 1000,
    waterTempC: 98,
    steepsCount: 1,
    rating: 5,
    flavorProfile: {
      aroma: 8,
      huigan: 10,
      chaqi: 10,
      body: 10,
      freshness: 4,
      astringency: 1
    },
    descriptors: ['Чернослив', 'Грецкий орех', 'Финики'],
    verdictNotes: 'Густой темный настой цвета черного шоколада. Абсолютная мягкость без горечи, мощная медитативная волна тепла.'
  }
];
