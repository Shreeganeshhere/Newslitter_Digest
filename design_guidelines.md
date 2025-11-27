# Design Guidelines: ML Newsletter Landing Page

## Design Approach
**Reference-Based:** Drawing inspiration from modern tech newsletter platforms (Substack, The Information) combined with ML/tech aesthetics (Linear, Hugging Face, OpenAI). Clean, sophisticated, data-forward design that conveys intelligence and credibility.

## Typography System
- **Headings:** Inter or Space Grotesk - Bold (700) for hero, Semi-bold (600) for sections
  - Hero: text-6xl md:text-7xl
  - Section headers: text-4xl md:text-5xl
  - Subsections: text-2xl md:text-3xl
- **Body:** Inter Regular (400) - text-lg for primary content, text-base for secondary
- **Accents:** Mono font (JetBrains Mono) for ML-specific callouts, code snippets, metrics

## Layout System
**Spacing Primitives:** Tailwind units of 4, 8, 12, 16, 20, 24
- Section padding: py-20 md:py-24
- Component spacing: gap-8 md:gap-12
- Container: max-w-7xl with px-4 md:px-8

## Page Structure (6 Sections)

### 1. Hero Section (80vh)
- Full-width with subtle gradient mesh background
- Two-column layout (md:grid-cols-2)
- Left: Headline + subheadline + inline email form with primary CTA
- Right: Abstract ML visualization (neural network diagram, data flow illustration)
- Trust indicator below form: "Join 10,000+ ML practitioners"

### 2. Value Proposition Grid (3 columns on desktop)
- Icon + headline + description cards
- Layout: grid-cols-1 md:grid-cols-3 gap-8
- Icons: Use Heroicons (academic-cap, chart-bar, bolt)
- Cards with subtle border, rounded-2xl, p-8
- Examples: "Weekly ML Insights", "Industry Trends", "Code Examples"

### 3. Newsletter Preview/Sample
- Two-column asymmetric (40/60 split)
- Left: Large framed mockup image of newsletter email
- Right: Stacked content blocks showing sample topics/headlines
- Section title: "What You'll Get Every Week"
- Use prose max-w-none for content formatting

### 4. Social Proof Wall
- Testimonial cards in masonry-style grid (2-3 columns)
- Each card: Quote + name + role/company
- Varied heights for visual interest
- Use quotation marks as decorative element
- Include small avatar placeholders (w-12 h-12 rounded-full)

### 5. Statistics Bar
- Four-column metric display (grid-cols-2 md:grid-cols-4)
- Large numbers (text-5xl font-bold) + labels below
- Examples: "10K+ Subscribers", "5 Years Running", "98% Open Rate", "Weekly Delivery"
- Full-width section with subtle background treatment

### 6. Final CTA Section
- Centered, focused design
- Headline reinforcing value
- Email form (larger, more prominent than hero)
- Supporting text about privacy/frequency
- Newsletter frequency badge (e.g., "Every Monday, 5min read")

## Core Components

### Email Subscription Form
- Single-line horizontal layout on desktop, stacked on mobile
- Input: rounded-full, px-6 py-4, text-lg, flex-1
- Button: rounded-full, px-8 py-4, font-semibold
- Validation: inline error states below input
- Success state: Replace form with confirmation message

### Cards (Multiple Uses)
- Base: rounded-2xl, p-8, border treatment
- Hover: subtle lift (transform translate-y-1)
- Grid layouts maintain consistent heights with flex-col

### Navigation Header
- Sticky top-0, backdrop-blur-lg
- Logo left, "Subscribe" CTA button right
- Minimal, transparent background with subtle border-bottom
- Height: h-16 md:h-20

### Footer
- Three-column grid on desktop (logo/about, quick links, social)
- Newsletter info snippet
- Copyright + privacy/terms links
- Restrained, informational (not marketing-heavy)

## Images

### Hero Image (Required)
- Abstract ML visualization: neural network nodes, data flow diagram, or geometric pattern suggesting AI/algorithms
- Placement: Right side of hero section (50% width on desktop)
- Style: Modern, clean illustration with depth
- Format: SVG or high-quality PNG with transparency

### Newsletter Preview (Required)
- Screenshot/mockup of actual newsletter email
- Placement: Left side of preview section
- Frame it with device mockup (email client window)
- Shows actual content structure and formatting

### Decorative Elements
- Subtle grid/dot patterns in backgrounds
- Abstract geometric shapes as section dividers
- No stock photography of people typing on laptops

## Interactions
- Minimal animation: Subtle fade-in on scroll for section headers only
- Form button: Standard hover/active states (no custom animations)
- Card hover: Slight elevation change
- No parallax, no scroll-triggered animations beyond basic reveals

## Accessibility
- Form labels: aria-label on input, visible helper text
- Focus states: Prominent outline for keyboard navigation
- Contrast: Ensure text meets WCAG AA standards
- Semantic HTML: Proper heading hierarchy (h1 → h2 → h3)