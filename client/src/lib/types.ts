// client/src/lib/types.ts
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
