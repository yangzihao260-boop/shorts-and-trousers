import { PantsVariant } from '../types';

export const TROUSERS_VARIANTS: PantsVariant[] = [
  {
    id: 'trousers-classic-denim',
    type: 'trousers',
    material: 'denim',
    name: 'Classic Jeans',
    chineseName: '经典牛仔长裤',
    primaryColor: '#1e40af', // Indigo blue
    secondaryColor: '#172554', // Dark denim
    accentColor: '#f59e0b', // Gold stitch
    patternType: 'denim-stitch',
  },
  {
    id: 'trousers-sport-track',
    type: 'trousers',
    material: 'sport',
    name: 'Track Pants',
    chineseName: '运动侧条长裤',
    primaryColor: '#dc2626', // Red
    secondaryColor: '#991b1b',
    accentColor: '#ffffff', // White side stripe
    patternType: 'side-stripe',
  },
  {
    id: 'trousers-khaki-chino',
    type: 'trousers',
    material: 'khaki',
    name: 'Khaki Chinos',
    chineseName: '卡其休闲长裤',
    primaryColor: '#d97706', // Warm amber / khaki
    secondaryColor: '#b45309',
    accentColor: '#78350f',
    patternType: 'crease',
  },
  {
    id: 'trousers-heather-sweatpants',
    type: 'trousers',
    material: 'sweatpants',
    name: 'Grey Joggers',
    chineseName: '运动卫裤长裤',
    primaryColor: '#64748b', // Slate grey
    secondaryColor: '#475569',
    accentColor: '#f8fafc', // White drawstring
    patternType: 'jogger-cuff',
  },
  {
    id: 'trousers-plaid-tartan',
    type: 'trousers',
    material: 'plaid',
    name: 'Plaid Trousers',
    chineseName: '苏格兰英伦长裤',
    primaryColor: '#047857', // Emerald green
    secondaryColor: '#064e3b',
    accentColor: '#fbbf24', // Gold grid
    patternType: 'plaid-grid',
  },
  {
    id: 'trousers-camo-cargo',
    type: 'trousers',
    material: 'camo',
    name: 'Cargo Trousers',
    chineseName: '多袋工装长裤',
    primaryColor: '#4d7c0f', // Olive green
    secondaryColor: '#365314',
    accentColor: '#65a30d',
    patternType: 'cargo-pocket',
  },
  {
    id: 'trousers-velvet-royal',
    type: 'trousers',
    material: 'velvet',
    name: 'Royal Purple Slacks',
    chineseName: '紫罗兰长裤',
    primaryColor: '#7c3aed', // Violet
    secondaryColor: '#5b21b6',
    accentColor: '#c084fc',
    patternType: 'velvet-sheen',
  },
  {
    id: 'trousers-striped-navy',
    type: 'trousers',
    material: 'stripes',
    name: 'Striped Trousers',
    chineseName: '细条纹西装长裤',
    primaryColor: '#0f172a', // Midnight navy
    secondaryColor: '#334155',
    accentColor: '#94a3b8',
    patternType: 'pin-stripes',
  },
];

export const SHORTS_VARIANTS: PantsVariant[] = [
  {
    id: 'shorts-denim-cutoff',
    type: 'shorts',
    material: 'denim',
    name: 'Denim Shorts',
    chineseName: '牛仔卷边短裤',
    primaryColor: '#38bdf8', // Light denim blue
    secondaryColor: '#0284c7',
    accentColor: '#f59e0b', // Gold stitch & rolled hem
    patternType: 'cuff-denim',
  },
  {
    id: 'shorts-hawaiian-beach',
    type: 'shorts',
    material: 'floral',
    name: 'Beach Shorts',
    chineseName: '夏日印花沙滩短裤',
    primaryColor: '#0d9488', // Teal
    secondaryColor: '#115e59',
    accentColor: '#fb7185', // Tropical coral floral
    patternType: 'tropical-print',
  },
  {
    id: 'shorts-athletic-running',
    type: 'shorts',
    material: 'sport',
    name: 'Running Shorts',
    chineseName: '荧光透气运动短裤',
    primaryColor: '#84cc16', // Lime green
    secondaryColor: '#4d7c0f',
    accentColor: '#ffffff', // White curved trim
    patternType: 'curved-trim',
  },
  {
    id: 'shorts-summer-stripes',
    type: 'shorts',
    material: 'stripes',
    name: 'Yellow Striped Shorts',
    chineseName: '亮黄条纹短裤',
    primaryColor: '#facc15', // Vibrant yellow
    secondaryColor: '#ca8a04',
    accentColor: '#ffffff', // White bold stripes
    patternType: 'bold-stripes',
  },
  {
    id: 'shorts-polka-pink',
    type: 'shorts',
    material: 'polka',
    name: 'Polka Dot Shorts',
    chineseName: '波点粉嫩短裤',
    primaryColor: '#ec4899', // Pink
    secondaryColor: '#be185d',
    accentColor: '#ffffff', // White dots
    patternType: 'polka-dots',
  },
  {
    id: 'shorts-bermuda-khaki',
    type: 'shorts',
    material: 'khaki',
    name: 'Khaki Bermuda Shorts',
    chineseName: '百慕大卡其短裤',
    primaryColor: '#eab308', // Sandy amber
    secondaryColor: '#a16207',
    accentColor: '#713f12',
    patternType: 'bermuda-crease',
  },
  {
    id: 'shorts-red-soccer',
    type: 'shorts',
    material: 'sport',
    name: 'Soccer Shorts',
    chineseName: '足球队运动短裤',
    primaryColor: '#ef4444', // Vibrant red
    secondaryColor: '#b91c1c',
    accentColor: '#fbbf24', // Gold side stripe
    patternType: 'side-split',
  },
  {
    id: 'shorts-plaid-casual',
    type: 'shorts',
    material: 'plaid',
    name: 'Checkered Shorts',
    chineseName: '格纹休闲短裤',
    primaryColor: '#6366f1', // Indigo
    secondaryColor: '#4338ca',
    accentColor: '#a5b4fc',
    patternType: 'check-pattern',
  },
];

export function getRandomVariant(type?: 'trousers' | 'shorts'): PantsVariant {
  const pool = type === 'trousers' 
    ? TROUSERS_VARIANTS 
    : type === 'shorts' 
      ? SHORTS_VARIANTS 
      : (Math.random() > 0.5 ? TROUSERS_VARIANTS : SHORTS_VARIANTS);
  return pool[Math.floor(Math.random() * pool.length)];
}
