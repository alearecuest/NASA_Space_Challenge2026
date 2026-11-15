# Farm Clim Tech — Design System v1.0

## Brand & Concept

**Name:** Farm Clim Tech  
**Team:** ClimaUY  
**Challenge:** NASA Space Apps Challenge 2026 — "Field Shift: Adapting Farms with NASA Data"  
**Tagline:** "Eyes in the sky, in the farmer's hands"  

**Core Purpose:** Convert NASA satellite data (soil moisture SMAP, rainfall GPM, vegetation NDVI MODIS, climate NASA POWER) into simple, actionable farming decisions for Uruguayan producers.

---

## Color Palette

### Primary Colors (Dark Night Sky)
- **Darkest Night:** `#0F2A44` — Main background
- **Dark Blue:** `#163A5C` — Gradient accent
- **Very Dark:** `#08182A` — Deep background shadow

### Surface & Glass
- **Dark Surface:** `#0B1C2E` — Cards, panels
- **Dark Translucent:** `rgba(15,42,68,0.75)` — Semi-transparent overlays

### Accent Colors
- **Lime Bright:** `#A6E36B` — Primary action, recommended, positive data
- **Field Green:** `#4C8C2B` — Healthy status, vegetation

### Alert & Risk Spectrum
- **Ocre (Low-Medium Risk):** `#D9A441`
- **Terracotta (High Risk):** `#C4572A`

### Text Colors
- **Warm White (Primary):** `#F4F6F1` — Headings, main text
- **Secondary (Grayish Blue):** `#BFD3E6` — Body text
- **Tertiary:** `#8FA3B8` — Hints, timestamps, disabled

### UI
- **Border Subtle:** `rgba(255,255,255,0.15)`
- **Border Light:** `rgba(255,255,255,0.25)`

---

## Typography

**Font Family:** Inter (all weights)

### Font Scales
- **Display/Headlines:** Inter Display ExtraBold (800)
  - Sizes: 28px–32px with tracking -0.5px
  - Used for: Screen titles, main headings

- **Body/Content:** Inter SemiBold (600)
  - Sizes: 13px–16px with standard letter-spacing
  - Used for: Cards, descriptions, body copy

- **Labels/Metadata:** Inter SemiBold (600)
  - Sizes: 11px–12px
  - Text Transform: UPPERCASE
  - Letter-spacing: 0.5px–1px
  - Color: Lime Bright (#A6E36B)
  - Used for: Section labels (e.g., "PHASE 2 · IN THE FARMER'S HANDS")

---

## Spacing Scale

```
xs:  4px
sm:  8px
md:  12px
lg:  16px
xl:  20px
xxl: 24px
```

**Usage:**
- Gutters: lg (16px)
- Card padding: lg (16px)
- Gap between elements: lg–xl
- Text margins: sm–md

---

## Border Radius

```
sm:  8px
md:  12px
lg:  16px
xl:  24px
```

**Defaults:**
- Cards: lg (16px)
- Buttons: md (12px)
- Badges: sm (8px)
- Large containers: xl (24px)

---

## Shadows

```
sm:   0 2px 4px rgba(0,0,0,0.1)
md:   0 4px 12px rgba(0,0,0,0.15)
lg:   0 8px 24px rgba(0,0,0,0.2)
deep: 0 12px 32px rgba(0,0,0,0.3)
```

**Elevation Hierarchy:**
- Surface cards: md
- Highlighted cards / tooltips: lg
- Modals / dropdowns: deep

---

## Component Library

### 1. Card (`Card.tsx`)
```
Background: #0B1C2E with 1px border rgba(255,255,255,0.15)
Padding: 16px
Border Radius: 16px
Shadow: 0 4px 12px rgba(0,0,0,0.15)

Variants:
- default: standard card
- elevated: shadow lg
- highlight: border #A6E36B
```

### 2. Button (`Button.tsx`)
```
Base:
- Height: 48px minimum (touch-friendly)
- Padding: 12–16px vertical, 16–24px horizontal
- Border Radius: 12px
- Font: Inter SemiBold 600, 14–16px

Variants:
- primary: bg #A6E36B, text #0F2A44, hover: scale 1.02 + shadow lg
- secondary: bg transparent, border #A6E36B, text #A6E36B
- danger: bg #C4572A, text #fff
- ghost: bg transparent, text #BFD3E6, hover: bg rgba(255,255,255,0.05)
```

### 3. Badge (`Badge.tsx`)
```
Background: #0B1C2E with solid color border (2px)
Padding: 4px 8px
Border Radius: 8px
Font: Inter SemiBold 600, 11–12px, uppercase

Color Variants:
- lime: border #A6E36B, text #A6E36B
- ocre: border #D9A441, text #D9A441
- terracotta: border #C4572A, text #C4572A
- green: border #4C8C2B, text #4C8C2B
```

### 4. Semaphore (Status Indicator)
```
Shape: Circle (60px diameter for cards, 24px for inline)
Colors (by value):
  - Healthy (≥70%): #4C8C2B (Field Green)
  - Caution (40–69%): #D9A441 (Ocre)
  - Critical (<40%): #C4572A (Terracotta)

Text Inside: Bold value (e.g., "65%"), white, centered
```

### 5. Navigation (Bottom Tabs)
```
Base:
- Height: 64px
- Background: #0B1C2E with top border 1px rgba(255,255,255,0.15)
- Position: Fixed, bottom, full width
- Padding: 8px, safe area on mobile

Tabs (4 total):
1. Field (map icon)
2. Risk (calendar icon)
3. Rotations (shuffle icon)
4. Alerts (bell icon)

Active Tab:
- Icon color: #A6E36B
- Label color: #A6E36B
- Underline: 2px #A6E36B

Inactive Tab:
- Icon color: #8FA3B8
- Label color: #8FA3B8
```

### 6. Input Field
```
Background: rgba(15,42,68,0.5)
Border: 1px #8FA3B8
Border Radius: 12px
Padding: 12px 16px
Font: Inter SemiBold 600, 14px, #F4F6F1
Focus: border-color #A6E36B, box-shadow 0 0 0 3px rgba(166,227,107,0.2)
```

### 7. Modal / Overlay
```
Background: rgba(0,0,0,0.7) (dark overlay)
Content Background: #0B1C2E
Border: 1px rgba(255,255,255,0.15)
Border Radius: 24px
Padding: 24px
Shadow: deep (0 12px 32px rgba(0,0,0,0.3))
```

### 8. Risk Calendar Block (Month)
```
Base:
- Size: Square (adaptive to screen width, ~70–80px)
- Border Radius: 12px
- Font: Inter SemiBold 600, 11px (month label)

Color Levels:
  - Low Risk: #D4A574 (soft ocre)
  - Medium: #D9A441 (ocre)
  - High: #C4572A (terracotta)

Interaction:
- Hover: scale 1.05, shadow lg
- Selected: 2px border #A6E36B, shadow lg
```

---

## Icons

**Style:** Minimal, monoline, 24px default size  
**Color:** Match context (lime for active, secondary for inactive, white for alt)

### Required Icons
1. **Map** — location pin outline
2. **Risk** — calendar or warning
3. **Rotations** — shuffle or cycle
4. **Alerts** — bell or notification
5. **Settings** — gear
6. **Check** — checkmark (for lists)
7. **Close** — X (for dismissals)
8. **Info** — info circle

**Source:** Use SVG inline or icon library (Feather, Heroicons recommended)

---

## Screen Flows & Components

### Screen 1: Onboarding
- **Layout:** Full viewport, centered column
- **Hero:** SVG Earthrise illustration (120px)
- **Title:** "Farm Clim Tech" (32px, ExtraBold, #F4F6F1)
- **Tagline:** "Eyes in the sky, in the farmer's hands" (16px, SemiBold, #A6E36B)
- **Body:** Explanation paragraph (13px, SemiBold, #BFD3E6)
- **CTA Button:** "Pin your field" (primary)
- **Footer:** "Data: NASA SMAP, GPM, MODIS, NASA POWER" (11px, tertiary)

### Screen 2: Pin Your Field
- **Map Container:** Full height, GIBS satellite layer, draggable/clickable
- **Info Card (Bottom):** Field name + Department/Zone
- **Buttons:** Confirm, Cancel

### Screen 3: Field Dashboard
- **Title:** "My field" (24px)
- **Location Badge:** "Location · Department" (13px, secondary)
- **3 Cards (Stacked):**
  - Soil Moisture (semaphore + explanation)
  - Rainfall 30d vs. Avg (semaphore + comparison)
  - Vegetation Health NDVI (semaphore + health status)
- **Footer:** Last update timestamp + "Illustrative prototype"

### Screen 4: Risk Calendar
- **Title:** "Risk Calendar" (uppercase label)
- **Month Grid:** 12 blocks in scrollable row
- **Selected Month Detail:** Expandable panel with risk explanation
- **Legend:** Color scale (low → medium → high)

### Screen 5: Compare Rotations
- **Title:** "Choose a rotation"
- **4 Rotation Cards** (ranked by score):
  - R1: Best (lime border highlight)
  - R2, R3, R4: Standard cards
  - Each: Name, Score, Brief description
- **Custom Rotation Option:** "+ Add custom rotation" button

### Screen 6: See Why
- **Recommended Rotation Highlight:** Name + Score (lime box)
- **3 Reasons Section:** Numbered cards with explanations
- **Field Checklist:** Interactive checkboxes for verification tasks
- **Data Attribution:** Footer

### Screen 7: Alerts
- **Title:** "Alerts"
- **Alert Cards:**
  - Critical/Warning/Info with color-coded status dot
  - Title, message, timestamp
  - Each card: full width, stacked
- **No Alerts State:** Friendly message

---

## Accessibility & Usability

### Contrast Ratios
- Text on background: ≥4.5:1 (WCAG AA)
- Interactive elements: ≥3:1 on hover/focus
- Status indicators: color + icon/text redundancy

### Touch Targets
- Minimum 48×48px for all interactive elements
- Minimum 8px padding between targets

### Readability
- No text smaller than 12px
- Line height ≥1.5 for body text
- All numbers paired with plain-language explanation
- No reliance on color alone for status (semaphore + label)

### Dark Mode
- Default dark theme (no light mode toggle)
- High contrast for outdoor use (sunlight readability)
- Sufficient brightness for glare conditions

### Offline Support
- "Last satellite update" indicator
- Cached data fallback message
- Manual refresh button

---

## Visual Style Essence

**Theme:** Space mission control + warm, human-centered agriculture  
**Tone:** Technical but accessible, authoritative but friendly  
**Mood:** Trust, clarity, action-ready  

**Key Design Rules:**
1. Deep, dark backgrounds (night sky aesthetic) with bright lime accents
2. Clear information hierarchy: big numbers, short explanations
3. Semaphores over complex graphs (simplicity for non-tech users)
4. Rounded corners (24px max) for approachability, not stark rectangles
5. Generous padding and spacing for outdoor/gloved-hand usage
6. No ornamental graphics; every element has a function
7. Color is functional: lime = action, ocre/terra = caution, green = healthy

---

## Usage Notes

- **Not included:** NASA logo, branding (only data attribution)
- **Images:** Illustrative only; use placeholder fields or real Uruguayan agricultural scenes
- **Data labels:** All mockup numbers marked "Illustrative prototype"
- **Responsive:** Mobile-first design (tablet/desktop secondary consideration)
- **RTL:** Not required (Spanish/English only)
- **Animations:** Subtle transitions (0.2–0.3s), no distracting motion

---

## Files

- `src/config/theme.ts` — Centralized color, spacing, radius, shadows, fonts
- `src/components/Card.tsx` — Reusable card wrapper
- `src/components/Button.tsx` — Button variants
- `src/components/Badge.tsx` — Status badge component
- `src/components/Navigation.tsx` — Bottom tab navigation
- `src/components/OnboardingScreen.tsx` — Onboarding flow
- `src/components/FieldDashboard.tsx` — Main dashboard with 3 cards
- `src/components/RiskCalendar.tsx` — Month risk visualization
- `src/components/RotationDetailView.tsx` — Rotation detail + checklist
- `src/components/AlertsScreen.tsx` — Alerts list

---

**Version:** 1.0  
**Last Updated:** Nov 2026  
**Status:** Production-ready for NASA Space Apps Challenge 2026
