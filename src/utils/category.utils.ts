import skincareAcne from '../assets/images/concerns/skincare_acne.png';
import skincareAntiAging from '../assets/images/concerns/skincare_anti_aging.png';
import skincareHydration from '../assets/images/concerns/skincare_hydration.png';
import skincareBrightening from '../assets/images/concerns/skincare_brightening.png';
import skincareSensitive from '../assets/images/concerns/skincare_sensitive.png';

export const CONCERN_IMAGES: Record<string, string> = {
  'acne & blemish': skincareAcne,
  'anti-aging': skincareAntiAging,
  'hydration': skincareHydration,
  'brightening': skincareBrightening,
  'sensitive skin': skincareSensitive,
};

export const getConcernImage = (goal: string): string | null => {
  return CONCERN_IMAGES[goal.toLowerCase()] || null;
};

export const COSMETICS_CATEGORIES = [
  'skin care',
  'hair care',
  'intimate',
  'kids care',
  'oral care',
  'muscles & joints',
  'antiseptics',
  'anti scar'
];

export const NUTRIENTS_CATEGORIES = [
  'vitamins',
  'supplements',
  'wellness'
];

export const ALL_CATEGORIES = [...COSMETICS_CATEGORIES, ...NUTRIENTS_CATEGORIES];

export const CATEGORY_HEALTH_GOALS: Record<string, string[]> = {
  'skin care': ['Acne & Blemish', 'Anti-Aging', 'Hydration', 'Brightening', 'Sensitive Skin'],
  'hair care': ['Hair Loss', 'Anti-Dandruff', 'Dry & Damaged', 'Volumizing'],
  'intimate': ['Daily Freshness', 'pH Balance', 'Sensitive Care'],
  'kids care': ['Gentle Protection', 'Rash & Eczema Relief', 'Nourishing'],
  'oral care': ['Teeth Whitening', 'Gum Care', 'Fresh Breath', 'Sensitive Teeth'],
  'muscles & joints': ['Pain Relief', 'Joint Support', 'Muscle Recovery'],
  'antiseptics': ['First Aid', 'Infection Protection', 'Sanitization'],
  'anti scar': ['Scar Reduction', 'Stretch Marks', 'Skin Healing'],
  'vitamins': ['Immunity Boost', 'Energy Support', 'Daily Wellness', 'Bone & Joint'],
  'supplements': ['Muscle Building', 'Weight Management', 'Heart Health', 'Digestive Health'],
  'wellness': ['Sleep Support', 'Stress Relief', 'Relaxation & Calm'],
};

export const getParentCategory = (category: string): 'cosmetics' | 'nutrients' => {
  const normalized = category?.toLowerCase();
  if (COSMETICS_CATEGORIES.includes(normalized)) {
    return 'cosmetics';
  }
  return 'nutrients';
};

export const slugify = (str: string): string => {
  return str ? str.toLowerCase().trim().replace(/\s+/g, '-') : '';
};

export const unslugify = (str: string): string => {
  return str ? str.replace(/-/g, ' ') : '';
};

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};
