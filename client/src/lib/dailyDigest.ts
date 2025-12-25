// client/src/lib/dailyDigest.ts
import { NewsItem } from './types';

// Function to get today's digest dynamically
async function loadTodayDigest(): Promise<NewsItem[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const digestModule = await import(`../digests/${today}.json`);
    return digestModule.default || digestModule;
  } catch (error) {
    console.warn(`Today's digest file (${new Date().toISOString().split('T')[0]}.json) not found`);
    return [];
  }
}

// Cache for today's digest
let todayDigestCache: NewsItem[] | null = null;
let cacheDate: string | null = null;

export async function getDailyDigest(): Promise<NewsItem[]> {
  const today = new Date().toISOString().split('T')[0];

  // Return cached data if it's for today
  if (todayDigestCache && cacheDate === today) {
    return todayDigestCache;
  }

  // Load fresh data
  todayDigestCache = await loadTodayDigest();
  cacheDate = today;

  return todayDigestCache;
}

// Synchronous version that returns empty array if not loaded
export function getDailyDigestSync(): NewsItem[] {
  return todayDigestCache || [];
}

// Helper function to get digest for a specific date
export async function getDigestForDate(date: string): Promise<NewsItem[]> {
  try {
    const digestModule = await import(`../digests/${date}.json`);
    return digestModule.default || digestModule;
  } catch (error) {
    console.warn(`Digest file for ${date} not found`);
    return [];
  }
}

