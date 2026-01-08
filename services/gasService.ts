
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
    if (GAS_WEB_APP_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE')) {
      console.warn('Please set GAS_WEB_APP_URL in constants.ts');
      return;
    }

    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', // Standard fetch with GAS often requires no-cors if not handling headers perfectly
        body: JSON.stringify(entry),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // with no-cors, we can't read the response body, but usually it's fine for simple appends
    } catch (error) {
      console.error('Error adding entry:', error);
      throw error;
    }
  }
};
