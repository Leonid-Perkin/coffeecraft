export type BrewMethodId =
  | 'espresso-machine'
  | 'v60-hoffmann'
  | 'v60-kasuya'
  | 'aeropress-inverted'
  | 'aeropress-standard'
  | 'chemex'
  | 'french-press'
  | 'moka-pot'
  | 'cold-brew'
  | 'cezve'
  | 'clever';

export interface BrewStep {
  title: string;
  description: string;
  timeSeconds: number; // Duration of this specific step in seconds
  targetWaterGrams: number; // Target accumulated water at the end of this step
  pourType?: 'circular' | 'center' | 'swirl' | 'wait' | 'plunge' | 'stir';
}

export interface BrewMethod {
  id: BrewMethodId;
  name: string;
  category: 'pourover' | 'immersion' | 'pressure' | 'cold' | 'traditional';
  shortDesc: string;
  fullDesc: string;
  difficulty: 'Легко' | 'Средне' | 'Мастер';
  icon: string;
  defaultCoffeeGrams: number;
  defaultWaterGrams: number;
  defaultRatio: number; // e.g. 16 for 1:16
  recommendedGrind: string;
  recommendedTempC: number;
  totalTimeEstimate: string;
  steps: BrewStep[];
  tips: string[];
}

export interface Bean {
  id: string;
  name: string;
  roaster: string;
  originCountry: string;
  region?: string;
  altitudeMeters?: string;
  variety?: string;
  processing: 'Мытый (Washed)' | 'Натуральный (Natural)' | 'Анаэробный (Anaerobic)' | 'Хани (Honey)' | 'Экспериментальный';
  roastLevel: 'Светлая (Фильтр)' | 'Средне-светлая' | 'Средняя (Омни)' | 'Темная (Эспрессо)';
  roastDate?: string;
  descriptors: string[];
  userRating: number;
  notes?: string;
  createdAt: number;
}

export interface TastingEntry {
  id: string;
  beanId?: string;
  beanName: string;
  roaster?: string;
  date: string;
  methodName: string;
  coffeeGrams: number;
  waterGrams: number;
  grindSize: string;
  waterTempC: number;
  brewTimeSeconds: number;
  rating: number; // 1-5
  flavorProfile: {
    acidity: number; // 1-10
    sweetness: number; // 1-10
    bitterness: number; // 1-10
    body: number; // 1-10
    aftertaste: number; // 1-10
    clarity: number; // 1-10
  };
  descriptors: string[];
  verdictNotes: string;
}

export interface DrinkLayer {
  name: string;
  percentage: number; // percentage of cup height
  color: string;
  textColor?: string;
  description: string;
}

export interface DrinkRecipe {
  id: string;
  name: string;
  originalName: string;
  category: 'classic' | 'milk' | 'signature' | 'cold';
  description: string;
  origin: string;
  baseVolumeMl: number;
  baseCaffeineMg: number;
  baseCalories: number;
  layers: DrinkLayer[];
  ingredients: { item: string; amount: string }[];
  instructions: string[];
  baristaTip: string;
}

export interface GrinderModel {
  id: string;
  name: string;
  brand: string;
  type: 'hand' | 'electric';
  clicks: {
    cezve: string;
    espresso: string;
    aeropress: string;
    v60: string;
    chemex: string;
    frenchPress: string;
    coldBrew: string;
  };
}

export interface GrindLevel {
  id: string;
  nameRu: string;
  nameEn: string;
  particleSizeMicrons: string;
  tactileComparison: string;
  bestMethods: string[];
  description: string;
  color: string;
}
