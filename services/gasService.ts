
import { EnglishEntry } from '../types';
import { GAS_WEB_APP_URL } from '../constants';

export const gasService = {
  async fetchEntries(): Promise<EnglishEntry[]> {
    if (GAS_WEB_APP_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE')) {
      console.warn('Please set GAS_WEB_APP_URL in constants.ts');
      return [];
    }
    
    try {
      const response = await fetch(GAS_WEB_APP_URL);
      if (!response.ok) throw new Error('Failed to fetch entries');
      return await response.json();
    } catch (error) {
      console.error('Error fetching entries:', error);
      throw error;
    }
  },

  async addEntry(entry: EnglishEntry): Promise<void> {
    try {
      await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(entry),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error adding/updating entry:', error);
      throw error;
    }
  },

  async toggleBookmark(date: string, sentence: string): Promise<void> {
    try {
      await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'toggleBookmark', date, sentence }),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    }
  }
};
