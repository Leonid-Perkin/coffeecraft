import type { GrinderModel, GrindLevel } from '../types';

export const GRIND_LEVELS: GrindLevel[] = [
  {
    id: 'extra-fine',
    nameRu: 'Ультратонкий (в пудру)',
    nameEn: 'Extra Fine',
    particleSizeMicrons: '< 150 мкм',
    tactileComparison: 'Пшеничная мука или сахарная пудра без крупинок',
    bestMethods: ['Джезва (Турка / Ибрик)', 'Кофе по-арабски'],
    description: 'Кофе смалывается в пыль. При сжатии между пальцами образует плотный комочек с отпечатком кожи.',
    color: '#854d0e'
  },
  {
    id: 'fine',
    nameRu: 'Тонкий (Эспрессо)',
    nameEn: 'Fine',
    particleSizeMicrons: '200 – 400 мкм',
    tactileComparison: 'Мелкая столовая соль «Экстра» или песок для песчаных часов',
    bestMethods: ['Эспрессо', 'Леверные кофемашины', 'Нанопрессо'],
    description: 'Оптимальное сопротивление для помпы эспрессо-машины под давлением 9 бар за 25-30 секунд.',
    color: '#a16207'
  },
  {
    id: 'medium-fine',
    nameRu: 'Средне-мелкий',
    nameEn: 'Medium-Fine',
    particleSizeMicrons: '400 – 600 мкм',
    tactileComparison: 'Обычная поваренная соль',
    bestMethods: ['Гейзерная кофеварка (Moka Pot)', 'AeroPress (быстрый пролив 1 мин)'],
    description: 'Обеспечивает интенсивную экстракцию без перегорания в гейзере и забивания фильтра в Аэропрессе.',
    color: '#c2410c'
  },
  {
    id: 'medium',
    nameRu: 'Средний',
    nameEn: 'Medium',
    particleSizeMicrons: '600 – 800 мкм',
    tactileComparison: 'Речной чистый песок',
    bestMethods: ['V60 (метод Хоффманна)', 'Kalita Wave', 'Капельные кофеварки (Batch Brew)'],
    description: 'Золотой стандарт для большинства воронок и капельных фильтр-кофеварок.',
    color: '#d97706'
  },
  {
    id: 'medium-coarse',
    nameRu: 'Средне-крупный',
    nameEn: 'Medium-Coarse',
    particleSizeMicrons: '800 – 1000 мкм',
    tactileComparison: 'Крупная морская соль или измельченный сушеный розмарин',
    bestMethods: ['Chemex (Кемекс)', 'V60 метод 4:6 (Касуя)', 'Clever Dripper'],
    description: 'Используется для толстых бумажных фильтров Кемекса и многоступенчатых проливов воронки.',
    color: '#ea580c'
  },
  {
    id: 'coarse',
    nameRu: 'Крупный',
    nameEn: 'Coarse',
    particleSizeMicrons: '1000 – 1400 мкм',
    tactileComparison: 'Крупная каменная соль или дробленый черный перец',
    bestMethods: ['French Press', 'Каппинг (Cupping)'],
    description: 'Частицы не проскальзывают сквозь металлическую сетку френч-пресса, обеспечивая чистоту настоя.',
    color: '#b45309'
  },
  {
    id: 'extra-coarse',
    nameRu: 'Очень крупный',
    nameEn: 'Extra Coarse',
    particleSizeMicrons: '> 1400 мкм',
    tactileComparison: 'Измельченные косточки или крупная гималайская соль',
    bestMethods: ['Cold Brew (Холодное настаивание)', 'Ковбойский кофе'],
    description: 'Для длительной экстракции в холодной воде (12-24 часа), предотвращает горечь и излишний шлам.',
    color: '#78350f'
  }
];

export const GRINDERS: GrinderModel[] = [
  {
    id: 'timemore-c3',
    name: 'Chestnut C2 / C3',
    brand: 'Timemore',
    type: 'hand',
    clicks: {
      cezve: 'Не рекомендуется (<6 кликов)',
      espresso: '7 – 9 кликов',
      aeropress: '10 – 12 кликов',
      v60: '13 – 16 кликов',
      chemex: '17 – 19 кликов',
      frenchPress: '19 – 22 клика',
      coldBrew: '23 – 26 кликов'
    }
  },
  {
    id: 'comandante-c40',
    name: 'C40 MK3 / MK4 Nitro Blade',
    brand: 'Comandante',
    type: 'hand',
    clicks: {
      cezve: '5 – 8 кликов',
      espresso: '9 – 13 кликов (с Red Clix 18-26)',
      aeropress: '14 – 18 кликов',
      v60: '22 – 27 кликов',
      chemex: '28 – 32 клика',
      frenchPress: '28 – 33 клика',
      coldBrew: '34 – 38 кликов'
    }
  },
  {
    id: '1zpresso-k-ultra',
    name: 'K-Ultra / K-Max',
    brand: '1Zpresso',
    type: 'hand',
    clicks: {
      cezve: '2.5 – 3.0 (25-30 кликов)',
      espresso: '3.0 – 4.0 (30-40 кликов)',
      aeropress: '5.0 – 6.5 (50-65 кликов)',
      v60: '7.0 – 8.5 (70-85 кликов)',
      chemex: '8.5 – 9.5 (85-95 кликов)',
      frenchPress: '8.5 – 9.5',
      coldBrew: '9.5 – 10.0+'
    }
  },
  {
    id: 'kingrinder-k6',
    name: 'Kingrinder K6',
    brand: 'Kingrinder',
    type: 'hand',
    clicks: {
      cezve: '25 – 35 кликов',
      espresso: '35 – 50 кликов',
      aeropress: '60 – 75 кликов',
      v60: '85 – 105 кликов',
      chemex: '105 – 120 кликов',
      frenchPress: '110 – 125 кликов',
      coldBrew: '125 – 140 кликов'
    }
  },
  {
    id: 'fellow-ode-gen2',
    name: 'Ode Brew Grinder Gen 2',
    brand: 'Fellow',
    type: 'electric',
    clicks: {
      cezve: 'Не поддерживается',
      espresso: 'Не поддерживается (только фильтр)',
      aeropress: 'Деление 2 – 3',
      v60: 'Деление 4 – 5.5',
      chemex: 'Деление 6 – 7',
      frenchPress: 'Деление 8 – 9',
      coldBrew: 'Деление 10 – 11'
    }
  },
  {
    id: 'baratza-encore',
    name: 'Encore / Encore ESP',
    brand: 'Baratza',
    type: 'electric',
    clicks: {
      cezve: 'Не рекомендуется',
      espresso: 'Деление 8 – 12 (на ESP)',
      aeropress: 'Деление 12 – 14',
      v60: 'Деление 15 – 18',
      chemex: 'Деление 20 – 22',
      frenchPress: 'Деление 28 – 30',
      coldBrew: 'Деление 32 – 36'
    }
  }
];
