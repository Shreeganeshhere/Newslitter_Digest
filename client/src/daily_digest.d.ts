declare module '@/digests/*.json' {
  const data: Array<{
    id: number;
    newsletterId?: number | null;
    title?: string | null;
    snippet?: string | null;
    category?: string | null;
    source?: string | null;
    url?: string | null;
    imageUrl?: string | null;
    createdAt: string;
  }>;
  export default data;
}

// Keep the old declaration for backward compatibility
declare module '@/daily_digest.json' {
  const data: Array<{
    id: number;
    newsletterId?: number | null;
    title?: string | null;
    snippet?: string | null;
    category?: string | null;
    source?: string | null;
    url?: string | null;
    imageUrl?: string | null;
    createdAt: string;
  }>;
  export default data;
}

