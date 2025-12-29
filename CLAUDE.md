# Nova Sei Press Website

## Technical Architecture
This project is a static single-page website built with 11ty using no JavaScript—only vanilla HTML and CSS with 11ty as a template engine. The goal is to maximize page speed performance while following best SEO and UI/UX design practices. The design should feel custom and intentional, not cookie-cutter, evoking warmth and trust.

## About Nova Sei Press
Nova Sei Press is a publishing service business that provides proofreading, editing, and self-publishing consultation services.

## Design System

### Color Palette
- **Primary**: Royal Purple `#5B3A8F` — Brand color for headings, CTAs, and primary elements
- **Primary Dark**: Deep Purple `#4A2E73` — Hover states and emphasis
- **Accent**: Antique Gold `#D4AF37` — Highlights, dividers, and visual accents
- **Text Primary**: Charcoal `#1a1a1a` — Main text and headers
- **Text Secondary**: Slate Gray `#666666` — Secondary text and captions
- **Background**: Pure White `#FFFFFF` — Cards, sections, content blocks
- **Background Base**: Off-White `#FAFAFA` — Page background for subtle contrast
- **Border**: Light Gray `#F0F0F0` — Borders, dividers, and subtle elements

### Typography
- **Headings**: Lora (serif) — A contemporary serif optimized for screen readability with brushed curves and moderate contrast. Use for all headings, hero text, and section titles.
  - Google Fonts: `family=Lora:wght@400;500;600;700`
- **Body**: Inter (sans-serif) — Modern, highly legible sans-serif for body text, navigation, and UI elements.
  - Google Fonts: `family=Inter:wght@300;400;500;600`

### Design Principles
1. **Spacious & Light** — Generous whitespace and breathing room. Content should never feel cramped.
2. **Warm & Trustworthy** — Professional yet approachable. Build confidence without intimidation.
3. **Refined Simplicity** — Clean layouts where every element serves a purpose.
4. **Smooth Interactions** — Subtle transitions (0.3s ease) and smooth scrolling for anchor links.
5. **No Linear Gradients** — Avoid predictable gradient patterns to maintain uniqueness.

### Component Patterns
- **Buttons**: Rounded corners (50px border-radius), smooth transitions, subtle elevation on hover
- **Cards**: White background, subtle shadows, gold accent borders
- **Spacing**: Use consistent rem-based spacing (multiples of 0.5rem)
- **Transitions**: Standard timing of 0.3s ease for all interactive elements

### Mobile Optimization
- **Mobile-First Approach**: Optimized for mobile devices with responsive breakpoints at 768px and 480px
- **Hamburger Menu**: Animated CSS-only hamburger menu on mobile that slides down smoothly
- **Touch-Friendly**: Larger tap targets and appropriate spacing for mobile interactions
- **Performance**: Optimized assets and minimal CSS for fast loading on mobile networks
- **Readable Typography**: Font sizes scale appropriately across all devices
- **No JavaScript Required**: Pure CSS hamburger menu using checkbox technique for maximum performance

## Site Hierarchy
Expound on each section freely with clean and professional copy, this will likely be updated later anyway. Feel free to pull in relevant stock photographs to make the design feel more cohesive and vibrant.

- Navigation bar
- Hero with CTA button that takes the user to the contact form
- About Us
- Our Services
    - Proofreading
    - Editing
    - Self-publishing Consulting
- Contact Us
