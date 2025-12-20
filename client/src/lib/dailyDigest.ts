// client/src/lib/dailyDigest.ts
import dailyDigestData from '@/daily_digest.json';

export interface NewsItem {
  id: number;
  newsletterId?: number | null;
  title?: string | null;
  snippet?: string | null;
  category?: string | null;
  source?: string | null;
  url?: string | null;
  imageUrl?: string | null;
  createdAt: string;
}

export function getDailyDigest(): NewsItem[] {
  return dailyDigestData as NewsItem[];
}

