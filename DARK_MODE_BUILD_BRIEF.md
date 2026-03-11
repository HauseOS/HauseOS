# HauseOS Dark Mode + Navigation Rebuild — Build Brief

## Overview
Add dark mode (default) to HauseOS while preserving light mode as a toggle option. Simultaneously restructure the navigation to reflect the correct information architecture.

## Design Direction (from Yeeling's moodboard)
**Aesthetic:** Dark, cinematic, premium tech. Think luxury SaaS meets editorial dark mode.

### Design Tokens (Dark Mode)
```css
/* Backgrounds - layered depth */
--bg-primary:        #0A0A0A;    /* Page background */
--bg-surface:        #111111;    /* Cards, panels */
--bg-elevated:       #1A1A1A;    /* Elevated surfaces, hover states */
--bg-overlay:        #222222;    /* Modals, dropdowns */

/* Accent - vibrant red (replacing coral #ff4e64) */
--accent-primary:    #E63030;    /* Primary accent */
--accent-hover:      #FF3D3D;    /* Hover state */
--accent-pressed:    #CC1122;    /* Active/pressed */
--accent-glow:       rgba(230, 48, 48, 0.15);  /* Ambient glow effect */
--accent-muted:      #C4727A;    /* Secondary/muted accent */

/* Text */
--text-primary:      #FFFFFF;    /* Headlines, key data */
--text-secondary:    #999999;    /* Body text, descriptions */
--text-tertiary:     #666666;    /* Captions, placeholders */
--text-disabled:     #444444;    /* Disabled states */

/* Borders */
--border-default:    #2A2A2A;    /* Standard borders */
--border-subtle:     rgba(255, 255, 255, 0.06);  /* Hairline borders */
--border-accent:     rgba(230, 48, 48, 0.4);     /* Accent borders */

/* Effects */
--glow-red:          0 0 40px rgba(230, 48, 48, 0.2);  /* Red ambient glow */
--glow-red-subtle:   0 0 20px rgba(230, 48, 48, 0.1);  /* Subtle glow */
```

### Design Tokens (Light Mode — preserve current with updates)
```css
--bg-primary:        #FFFFFF;
--bg-surface:        #F9FAFB;
--bg-elevated:       #F3F4F6;
--accent-primary:    #E63030;    /* Same red, not the old coral */
--text-primary:      #0A0A0A;
--text-secondary:    #6B7280;
--border-default:    #E5E7EB;
```

### Typography
- Font: Inter (add via Google Fonts or next/font)
- Strong size hierarchy: display headings large, body smaller
- Labels: uppercase, letter-spacing 0.05em, small (10-12px)

### Component Patterns
- **Cards:** `bg-surface` with `border-subtle`, rounded-xl (12-16px radius)
- **Cards hover:** subtle brightness increase + faint red border glow
- **Buttons primary:** solid `accent-primary` background, white text, rounded-lg
- **Buttons secondary:** ghost style with subtle border
- **Kanban columns:** darker background with subtle header accent
- **Status badges:** muted colored pills with low-opacity backgrounds
- **Active nav item:** red accent + subtle red glow underline

### Signature Effect: Red Ambient Glow
Use sparingly on key UI elements:
```css
.glow-accent {
  box-shadow: 0 0 40px rgba(230, 48, 48, 0.15);
}
```
Apply to: hero metrics, active deal cards, primary CTAs on hover.

## Navigation Restructure

### Current (broken):
```
Projects | Content Pipeline | Editorial
```
- Partnerships missing from nav
- Editorial vs Content Pipeline confusing
- No dashboard landing page

### New structure:
```
Dashboard | Content | Partnerships | Editorial | Projects
```

| Nav Item | Route | Purpose | Sub-routes |
|---|---|---|---|
| **Dashboard** | `/` | Overview: metrics, recent activity, pipeline snapshot | — |
| **Content** | `/content` | Video production engine | `/content/ideas`, `/content/pipeline`, `/content/research` |
| **Partnerships** | `/partnerships` | Sponsor revenue engine | `/partnerships` (deal kanban), `/partnerships/companies` |
| **Editorial** | `/editorial` | hause.co articles (Anders owns) | Keep existing pages |
| **Projects** | `/projects` | All Hause project status | Keep existing page |

### Navigation Component
Build a shared `<AppShell>` or `<Sidebar>` component:
- Left sidebar (collapsible) on desktop, bottom nav on mobile
- Logo "HauseOS" at top
- Nav items with icons
- Theme toggle (sun/moon) at bottom of sidebar
- Active state: red accent + left border highlight

OR simpler: sticky top nav bar with the 5 items + theme toggle. Either works — top nav is faster to build.

**Recommendation: Top nav** (simpler, matches current layout, less risk). Can evolve to sidebar later.

## Implementation Plan

### 1. Theme System (do this first)
- Install `next-themes` for dark/light toggle
- Update `tailwind.config.ts`: add `darkMode: 'class'`
- Define CSS variables in `globals.css` for both themes
- Add Inter font via `next/font/google`
- Add theme toggle button to nav

### 2. Shared Layout
- Create `app/components/AppNav.tsx` — shared navigation bar
  - Logo + app name
  - 5 nav items: Dashboard, Content, Partnerships, Editorial, Projects
  - Theme toggle (sun/moon icon)
  - Active state highlighting
- Update `app/layout.tsx` to include AppNav
- Remove per-page header/nav code (currently duplicated in each page)

### 3. Dashboard Page (new)
- Route: `/` (replace current redirect-to-projects)
- Quick stats: ideas in pipeline, active deals, total pipeline value
- Recent activity feed
- Quick links to key actions

### 4. Content Section (restructure)
- `/content` — landing with tabs or sub-nav: Ideas | Pipeline | Research
- `/content/ideas` — move from `/editorial/ideas` (rename route, keep component)
- `/content/pipeline` — move from `/content-pipeline` (rename route)
- `/content/research` — move from `/editorial/research`
- Add proper sub-navigation within Content section

### 5. Update All Pages for Dark Mode
For every page component:
- Replace hardcoded `bg-white`, `text-gray-900`, `border-gray-200` etc.
- Use Tailwind dark: prefix or CSS variables
- Cards: `bg-[var(--bg-surface)]` or `bg-white dark:bg-[#111111]`
- Text: `text-gray-900 dark:text-white`
- Borders: `border-gray-200 dark:border-[#2A2A2A]`

### 6. Component Updates
- `StatusBadge.tsx` — dark mode color variants
- `IdeaCard.tsx` — dark card styling
- `ProjectCard.tsx` — dark card styling
- `FilterBar.tsx` — dark input/select styling
- `TagPill.tsx` — dark pill styling
- `badge.tsx`, `card.tsx` — dark variants

### 7. Partnerships Pages
- Already built at `/partnerships` and `/partnerships/companies`
- Wire into new nav (they were missing from nav before)
- Apply dark mode classes

### 8. Polish
- Scrollbar styling for dark mode
- Red glow effects on key interactive elements
- Smooth theme transition (CSS transition on background-color, color)
- Ensure all hover states work in both themes
- Mobile responsive check

## File Structure After Build
```
app/
├── layout.tsx (updated: includes AppNav, next-themes provider, Inter font)
├── page.tsx (new: Dashboard)
├── globals.css (updated: CSS variables for dark/light)
├── components/
│   ├── AppNav.tsx (new: shared navigation)
│   ├── ThemeToggle.tsx (new: sun/moon toggle)
│   └── ProjectCard.tsx (updated: dark mode)
├── content/
│   ├── page.tsx (new: Content landing)
│   ├── ideas/page.tsx (moved from editorial/ideas)
│   ├── pipeline/page.tsx (moved from content-pipeline)
│   └── research/page.tsx (moved from editorial/research)
├── partnerships/
│   ├── page.tsx (existing: deal kanban, dark mode applied)
│   └── companies/page.tsx (existing: directory, dark mode applied)
├── editorial/
│   └── page.tsx (simplified: placeholder for Anders' article system)
├── projects/
│   └── page.tsx (existing: updated dark mode)
├── config/
│   └── projects.ts (existing)
├── mock-data.ts
└── mock-content-pipeline.ts
```

## Do NOT Change
- API routes (everything under `/api/` stays as-is)
- Database schema
- Mock data files (keep as fallback)
- `vercel.json` config
- `package.json` scripts

## Dependencies to Add
- `next-themes` (dark mode toggle)
- Inter font via `next/font/google` (no extra package needed)

## Testing
After build, verify:
1. Dark mode is default, toggle switches to light
2. All 5 nav items work and route correctly
3. Dashboard shows something useful (even if metrics are placeholder)
4. Content section has sub-navigation for Ideas/Pipeline/Research
5. Partnerships appears in main nav
6. All pages render correctly in both themes
7. Mobile responsive at 375px and 768px breakpoints

## Commit
After all changes, commit and push:
```
git add -A && git commit -m "feat: dark mode + navigation restructure

- Dark-first design with light mode toggle (next-themes)
- New IA: Dashboard | Content | Partnerships | Editorial | Projects
- Shared AppNav component with theme toggle
- Inter font, updated design tokens
- Red accent (#E63030) replaces coral
- Ambient red glow effects on key elements
- Content section consolidates Ideas + Pipeline + Research
- Partnerships promoted to main nav
- All pages updated for dark/light theming"
```

Then deploy:
```
npx vercel deploy --prod --yes --token $VERCEL_TOKEN
```
