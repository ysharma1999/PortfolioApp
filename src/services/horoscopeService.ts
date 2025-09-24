import { HoroscopeResponse, ZodiacSign } from '../types';

class HoroscopeService {
  private mockHoroscopes: Record<ZodiacSign, string> = {
    aries: "Today brings dynamic energy and new opportunities. Trust your instincts and take bold action towards your goals. The stars align to support your leadership qualities.",
    taurus: "Stability and patience will serve you well today. Focus on building solid foundations for your future endeavors. Material gains are possible through steady effort.",
    gemini: "Communication is key today. Express your thoughts clearly and listen to others with an open mind. Multiple opportunities may present themselves simultaneously.",
    cancer: "Your intuition is heightened today. Pay attention to your emotional responses and nurture meaningful relationships. Family matters may require attention.",
    leo: "Confidence shines through you today. Take center stage and let your creativity illuminate the path forward. Recognition for past efforts is likely.",
    virgo: "Attention to detail pays off today. Organize your thoughts and tackle tasks with precision and care. Health and wellness should be prioritized.",

  };

  async getHoroscope(zodiacSign: ZodiacSign): Promise<HoroscopeResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    if (Math.random() < 0.1) {
      throw new Error('Failed to connect to horoscope service');
    }
    return {
      sign: zodiacSign,
      horoscope: this.mockHoroscopes[zodiacSign],
      date: new Date().toISOString().split('T')[0],
    };
  }
}

export const horoscopeService = new HoroscopeService();
