export interface DescriptorCategory {
  name: string;
  color: string;
  textColor: string;
  borderColor: string;
  items: string[];
}

export const FLAVOR_CATEGORIES: DescriptorCategory[] = [
  {
    name: 'Ягоды и Цитрусы',
    color: 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    items: [
      'Лимон',
      'Лайм',
      'Грейпфрут',
      'Красная смородина',
      'Малина',
      'Черника',
      'Ежевика',
      'Клубника',
      'Шиповник'
    ]
  },
  {
    name: 'Фрукты и Тропики',
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    items: [
      'Зеленое яблоко',
      'Спелая груша',
      'Персик',
      'Абрикос',
      'Манго',
      'Маракуйя',
      'Ананас',
      'Инжир',
      'Финики'
    ]
  },
  {
    name: 'Цветы и Травы',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    items: [
      'Жасмин',
      'Бергамот',
      'Цветы апельсина',
      'Чёрный чай Эрл Грей',
      'Лаванда',
      'Ромашка',
      'Лемонграсс',
      'Мята'
    ]
  },
  {
    name: 'Сладость и Карамель',
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 hover:bg-yellow-500/30',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
    items: [
      'Тростниковый сахар',
      'Карамель',
      'Липовый мёд',
      'Кленовый сироп',
      'Сливочная ириска (Фаджи)',
      'Зефир / Маршмеллоу',
      'Ваниль'
    ]
  },
  {
    name: 'Шоколад и Орехи',
    color: 'bg-stone-500/25 text-amber-200 border-amber-700/40 hover:bg-stone-500/35',
    textColor: 'text-amber-300',
    borderColor: 'border-stone-500/40',
    items: [
      'Тёмный шоколад',
      'Молочный шоколад',
      'Какао-бобы',
      'Жареный фундук',
      'Миндаль',
      'Грецкий орех',
      'Кешью',
      'Пралине'
    ]
  },
  {
    name: 'Специи и Пряности',
    color: 'bg-orange-500/20 text-orange-300 border-orange-500/40 hover:bg-orange-500/30',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    items: [
      'Корица',
      'Кардамон',
      'Мускатный орех',
      'Гвоздика',
      'Имбирь',
      'Анис',
      'Душистый перец'
    ]
  },
  {
    name: 'Ферментация и Алкоголь',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    items: [
      'Красное сухое вино',
      'Бурбон / Виски',
      'Тёмный ром',
      'Ферментированная вишня',
      'Коньяк',
      'Пьяная вишня в шоколаде'
    ]
  }
];
