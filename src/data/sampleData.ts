import type { Bean, TastingEntry } from '../types';

export const INITIAL_BEANS: Bean[] = [
  {
    id: 'bean-1',
    name: 'Ethiopia Yirgacheffe Chelchele',
    roaster: 'Tasty Coffee',
    originCountry: 'Эфиопия',
    region: 'Гедео, Челчеле',
    altitudeMeters: '1900 - 2100 м',
    variety: 'Местные разновидности (Heirloom)',
    processing: 'Анаэробный (Anaerobic)',
    roastLevel: 'Светлая (Фильтр)',
    roastDate: '2026-10-28',
    descriptors: ['Бергамот', 'Персик', 'Жасмин', 'Красная смородина'],
    userRating: 5,
    notes: 'Невероятно шелковистый и цветочный букет, взрывная ягодная сладость на остывании.',
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'bean-2',
    name: 'Colombia El Paraiso Lychee',
    roaster: 'Submarine Coffee',
    originCountry: 'Колумбия',
    region: 'Каука, Диего Бермудес',
    altitudeMeters: '1930 м',
    variety: 'Кастильо (Castillo)',
    processing: 'Экспериментальный',
    roastLevel: 'Светлая (Фильтр)',
    roastDate: '2026-11-01',
    descriptors: ['Маракуйя', 'Манго', 'Липовый мёд', 'Лайм'],
    userRating: 5,
    notes: 'Двойная ферментация с термошоком. Ярчайший тропический сок, ноты спелого личи и розы.',
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'bean-3',
    name: 'Kenya Nyeri Hill PB',
    roaster: 'Сварщица Екатерина',
    originCountry: 'Кения',
    region: 'Ньери',
    altitudeMeters: '1800 м',
    variety: 'SL28, SL34 (Пиберри)',
    processing: 'Мытый (Washed)',
    roastLevel: 'Светлая (Фильтр)',
    roastDate: '2026-10-24',
    descriptors: ['Черная смородина', 'Грейпфрут', 'Шиповник', 'Тростниковый сахар'],
    userRating: 4.8,
    notes: 'Хрестоматийная кенийская смородина с сочной винной кислотностью и карамельным финишем.',
    createdAt: Date.now() - 86400000 * 9
  }
];

export const INITIAL_TASTINGS: TastingEntry[] = [
  {
    id: 'tasting-1',
    beanId: 'bean-1',
    beanName: 'Ethiopia Yirgacheffe Chelchele',
    roaster: 'Tasty Coffee',
    date: '2026-11-06',
    methodName: 'V60 — Метод 4:6 (Tetsu Kasuya)',
    coffeeGrams: 20,
    waterGrams: 300,
    grindSize: '24 клика Comandante (средне-крупный)',
    waterTempC: 93,
    brewTimeSeconds: 210,
    rating: 5,
    flavorProfile: {
      acidity: 9,
      sweetness: 8,
      bitterness: 2,
      body: 6,
      aftertaste: 9,
      clarity: 10
    },
    descriptors: ['Жасмин', 'Персик', 'Бергамот'],
    verdictNotes: 'Идеальная чашка! На 60°C раскрылся сладкий персик в сиропе, жасминовый шлейф держался еще полчаса.'
  },
  {
    id: 'tasting-2',
    beanId: 'bean-2',
    beanName: 'Colombia El Paraiso Lychee',
    roaster: 'Submarine Coffee',
    date: '2026-11-08',
    methodName: 'AeroPress — Инвертированный метод',
    coffeeGrams: 16,
    waterGrams: 220,
    grindSize: '15 кликов Comandante',
    waterTempC: 88,
    brewTimeSeconds: 135,
    rating: 5,
    flavorProfile: {
      acidity: 8,
      sweetness: 10,
      bitterness: 1,
      body: 7,
      aftertaste: 10,
      clarity: 8
    },
    descriptors: ['Манго', 'Маракуйя', 'Липовый мёд'],
    verdictNotes: 'Тропическая бомба. Никакой терпкости или сухости, тело очень сливочное.'
  }
];
