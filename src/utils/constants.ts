import { ZodiacSign } from '../types';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',

];

export const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  aries: '♈',
  taurus: '♉',
  gemini: '♊',
  cancer: '♋',
  leo: '♌',
  virgo: '♍',
};

export const ZODIAC_NAMES: Record<ZodiacSign, string> = {
  aries: 'Aries',
  taurus: 'Taurus',
  gemini: 'Gemini',
  cancer: 'Cancer',
  leo: 'Leo',
  virgo: 'Virgo',
};
