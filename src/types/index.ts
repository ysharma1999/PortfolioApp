export type ZodiacSign = 
  | 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo'

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalState {
  selectedZodiac: ZodiacSign;
  currentHoroscope: string;
  journalEntries: Record<string, JournalEntry>;
  loading: boolean;
  error: string | null;
}

export interface HoroscopeResponse {
  sign: ZodiacSign;
  horoscope: string;
  date: string;
}