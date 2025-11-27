# ML Insights - Machine Learning Newsletter

A professional landing page for an ML newsletter with email subscription functionality and an interactive 3D news carousel.

## Features

### Landing Page
- Professional hero section with email subscription form
- Value proposition grid highlighting newsletter benefits
- Newsletter preview mockup
- Social proof with testimonials
- Statistics bar showing subscriber metrics
- Final CTA section for conversions
- Responsive design optimized for all devices

### Email Subscriptions
- Email validation and duplicate checking
- PostgreSQL database storage for subscribers
- Success/error toast notifications
- Subscriber data persisted in `subscribers` table

### News Spaces
- Interactive 3D infinite menu carousel for news items
- Drag to rotate news items in 3D space
- Smooth momentum-based scrolling
- News data fetched from PostgreSQL database
- Each news item displays:
  - Title and summary
  - Source and time ago
  - External link (optional)

## Database Schema

### Tables

#### subscribers
- `id` (integer, auto-increment, primary key)
- `email` (text, unique, not null)
- `subscribedAt` (timestamp, default now)

#### news_items
- `id` (integer, auto-increment, primary key)
- `title` (text, not null)
- `summary` (text, not null)
- `source` (text, not null)
- `url` (text, optional)
- `publishedAt` (timestamp, default now)

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS + Shadcn UI components
- Wouter for routing
- TanStack Query for data fetching
- gl-matrix for 3D transformations
- Framer Motion for animations

### Backend
- Express.js
- PostgreSQL (Neon)
- Drizzle ORM
- Zod for validation

## API Routes

### POST /api/subscribers
Subscribe to the newsletter with an email address.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "subscribedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/news
Fetch all news items, ordered by most recent first.

**Response:**
```json
[
  {
    "id": 1,
    "title": "GPT-5 Released",
    "summary": "OpenAI announces...",
    "source": "AI Daily",
    "url": "https://example.com",
    "publishedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/news
Create a new news item.

**Request Body:**
```json
{
  "title": "News Title",
  "summary": "News summary...",
  "source": "Source Name",
  "url": "https://example.com",
  "publishedAt": "2024-01-01T00:00:00.000Z"
}
```

## Database Management

### Initial Setup
The database has been automatically provisioned and seeded with sample news items.

### Adding More News
Run the seed script to populate more news items:
```bash
npx tsx server/seed.ts
```

### Schema Changes
After modifying `shared/schema.ts`, push changes to the database:
```bash
npm run db:push
```

## Development

The application runs on port 5000 with:
- Frontend: Vite dev server
- Backend: Express API
- Database: PostgreSQL (DATABASE_URL from environment)

## Project Structure

```
client/
  src/
    components/
      InfiniteMenu.tsx        # 3D news carousel
      EmailSubscriptionForm.tsx
      Header.tsx
      Footer.tsx
      NewsCard.tsx
      HeroSection.tsx
      ValuePropositionGrid.tsx
      NewsletterPreview.tsx
      SocialProof.tsx
      StatisticsBar.tsx
      FinalCTA.tsx
    pages/
      home.tsx                # Landing page
      spaces.tsx              # News spaces page
server/
  db.ts                       # Database connection
  storage.ts                  # Database operations
  routes.ts                   # API routes
  seed.ts                     # Database seeding script
shared/
  schema.ts                   # Drizzle schema & types
```

## User Guide

### Subscribing to Newsletter
1. Visit the homepage
2. Enter your email in the subscription form
3. Click "Subscribe"
4. Receive confirmation toast notification
5. Email is saved to database (duplicate emails rejected)

### Viewing News Spaces
1. Click "Spaces" button in the header
2. Interactive 3D carousel displays
3. Drag horizontally to rotate news items
4. Click external link icon to open news in new tab
5. Momentum scrolling continues after release

## Notes

- The database is already seeded with 10 sample news items
- Email subscriptions are validated and stored in PostgreSQL
- All data persists across restarts
- The 3D infinite menu uses gl-matrix for efficient transformations
- The design follows modern ML/tech aesthetics with clean typography
