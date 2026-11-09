import type { BrewStep } from './index';

export type TeaCategory =
  | 'green'
  | 'white'
  | 'yellow'
  | 'oolong'
  | 'red'
  | 'puer'
  | 'matcha';

export type TeaMethodId =
  | 'gongfu-cha'
  | 'teapot-western'
  | 'matcha'
  | 'lu-yu'
  | 'cold-brew-tea';

export interface TeaMethod {
  id: TeaMethodId;
  name: string;
  category: 'proliv' | 'western' | 'matcha' | 'fire' | 'cold';
  shortDesc: string;
  fullDesc: string;
  difficulty: 'Легко' | 'Средне' | 'Мастер';
  icon: string;
  defaultLeafGrams: number;
  defaultWaterGrams: number;
  defaultRatio: number; // e.g. 20 for 1:20 (5g / 100ml)
  recommendedTempC: number;
  vessel: string;
  totalTimeEstimate: string;
  steps: BrewStep[];
  tips: string[];
}

export interface TeaItem {
  id: string;
  name: string;
  chineseName?: string;
  category: 'Зеленый (Люй Ча)' | 'Белый (Бай Ча)' | 'Улун (Цин Ча)' | 'Красный (Хун Ча)' | 'Шу Пуэр' | 'Шэн Пуэр' | 'Матча';
  province: string;
  harvestYear?: string;
  grade?: string;
  userRating: number;
  descriptors: string[];
  notes?: string;
  createdAt: number;
}

export interface TeaTastingEntry {
  id: string;
  teaName: string;
  category: string;
  province?: string;
  date: string;
  methodName: string;
  leafGrams: number;
  waterGrams: number;
  waterTempC: number;
  steepsCount: number;
  rating: number; // 1-5
  flavorProfile: {
    aroma: number; // Аромат сухого/прогретого листа
    huigan: number; // Хуэй Гань (сладкое возвратное послевкусие)
    chaqi: number; // Ча Ци (энергия и глубина состояния)
    body: number; // Плотность и бархатистость настоя
    freshness: number; // Свежесть / минеральность
    astringency: number; // Терпкость
  };
  descriptors: string[];
  verdictNotes: string;
}

export interface TeaFamousVariety {
  name: string;
  zh: string;
  region: string;
  flavorNotes: string;
}

export interface TeaCategoryInfo {
  id: TeaCategory;
  nameRu: string;
  nameZh: string;
  pinyin: string;
  fermentationLevel: string;
  recommendedTempC: string;
  steepTime: string;
  description: string;
  famousTeas: TeaFamousVariety[];
  vessels: string;
  accentColor: string;
  borderColor: string;
}
