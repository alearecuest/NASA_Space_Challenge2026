# Farm Clim Tech — Complete UI/UX Flow

## Overview
Farm Clim Tech is a mobile-first decision support system that converts NASA Earth observation data into actionable insights for Uruguayan farmers. The interface is designed for use in outdoor settings with high sun exposure and variable connectivity.

---

## 7-Screen User Journey

### Screen 1: Onboarding
**Purpose:** Welcome new users and set expectations  
**Key Elements:**
- Earthrise-inspired hero illustration (Earth rising over Moon)
- App title: "Farm Clim Tech" (32px, ExtraBold, warm white)
- Tagline: "Eyes in the sky, in the farmer's hands" (lime green accent)
- Brief value proposition in simple language
- Primary CTA: "Pin your field" button (lime green)
- Data attribution footer

**User Action:** Click "Pin your field" → Navigate to Screen 2

---

### Screen 2: Pin Your Field (Map)
**Purpose:** Enable user to define their field location  
**Key Elements:**
- Full-screen GIBS satellite map (searchable, pannable, clickable)
- Location search bar at top
- Field name input field (auto-filled from location)
- Department/Zone label display (e.g., "Soriano")
- Confirm button (lime green)
- Cancel button (ghost style)

**Data Layer:** NASA GIBS satellite imagery (customizable dates, true color or NDVI)

**User Action:**
- Search location OR click on map
- Confirm location → Navigate to Screen 3

---

### Screen 3: Field Dashboard (Main Screen)
**Purpose:** Display current field status at a glance  
**Key Elements:**

#### Header Section
- Title: "My field"
- Location badge: "My field · Soriano" (secondary text)

#### 3 Large Status Cards (Stacked, full-width)

**Card 1: Soil Moisture**
- Semaphore (circular indicator): 65% (green for healthy)
- Status: "Healthy"
- Explanation: "Current moisture level in topsoil (0–30 cm)"
- Data source: NASA SMAP

**Card 2: Rainfall (Last 30 days)**
- Semaphore: 45 mm (caution color)
- Comparison: "Above average (38mm avg). Good water supply."
- Data source: NASA GPM

**Card 3: Vegetation Health (NDVI)**
- Semaphore: 72% (green)
- Status: "Healthy — Biomass and photosynthetic activity"
- Data source: NASA MODIS

#### Footer
- Last update timestamp (e.g., "Today at 14:32 UTC")
- "Illustrative prototype" disclaimer

**Data:**
- Refreshes every 6 hours from NASA APIs
- Falls back to cached data in offline mode
- Each value includes plain-language interpretation

**User Action:**
- View current status
- Tap cards for more detail (optional)
- Swipe or tap tab bar to navigate to other screens

---

### Screen 4: Risk Calendar
**Purpose:** Show monthly drought/heat risk trends  
**Key Elements:**

#### Title & Label
- Label: "RISK CALENDAR" (uppercase, lime, 1px letter-spacing)

#### Month Grid
- 12 blocks in a horizontal scrollable row
- Each month labeled (Jan–Dec)
- Color intensity indicates risk level:
  - Soft ocre (#D4A574) = Low risk
  - Ocre (#D9A441) = Medium risk
  - Terracotta (#C4572A) = High risk

#### Interaction
- Tap any month → Expand detail panel below
- Show risk type, magnitude, and recommended actions
- Example: "August: High drought risk. Ensure irrigation. Frost risk also likely."

#### Legend
- Color scale with labels: Low | Medium | High
- Footnote: "Thresholds are indicative; confirm with local agronomist"

**Data:**
- Calculated from 30-year climate normals (NASA POWER)
- Combined with seasonal drought indices (SPI, NDVI trends)
- Uruguay-specific risk patterns

**User Action:**
- Tap month to see detail
- Tap again to collapse
- Navigate to next screen (Risk → Rotations)

---

### Screen 5: Compare 4 Crop Rotations
**Purpose:** Help farmer choose the most climate-resilient rotation  
**Key Elements:**

#### Title
- "Choose a rotation"

#### 4 Rotation Cards (Ranked by Overall Score)

**Card 1 (Recommended):**
- Border: 2px lime green (highlighted)
- Background: Subtle lime tint
- Title: "R1 Cover crop"
- Score: 78 (large, lime green)
- Description: "Best for your climate zone. High resilience."
- Status badge: "Recommended"

**Cards 2–4:**
- Standard card style
- Same layout: Name, Score, Description
- E.g., "R3 Crop + pasture · 74", "R2 Soy–maize–wheat · 69", "R0 Current · 58"

#### CTA Button
- "+ Add custom rotation" (primary button)
- Opens modal form for user to define 3-year crop sequence

#### Scoring Methodology
Each rotation is scored on 4 dimensions (0–100 each):
1. **Water resilience** — Drought tolerance, irrigation efficiency
2. **Soil health** — Organic matter, structure, microbial activity
3. **Income stability** — Market volatility, diversification
4. **Climate adaptation** — Heat stress tolerance, pest risk

Overall score = weighted average (all 4 equal weight)

**User Action:**
- Review rotations
- Tap recommended rotation or scroll to compare others
- Click on a rotation → Navigate to Screen 6

---

### Screen 6: See Why (Rotation Detail)
**Purpose:** Explain why the chosen rotation is recommended  
**Key Elements:**

#### Highlight Box (Lime border)
- Rotation name: "R1 Cover crop"
- Overall score: 78 (large, lime)
- "Recommended rotation" label

#### Section: "Why This Rotation"
- 3 numbered explanation cards:
  1. "Reduces drought risk by 40% in dry months. Cover crops improve soil water retention."
  2. "Increases soil organic matter, improving fertility and structure."
  3. "Better income resilience in volatile markets due to diversified crops."

Each card displays:
- Numbered circle (1, 2, 3) with lime background
- Explanation text (plain language, <100 words)
- Data-backed insight

#### Section: "What to Check in Your Field"
- Interactive checklist with 3–5 actionable items:
  - ☐ Soil pH suitable for legumes (6.0–7.5)
  - ☐ Seedbed preparation for cover crop in March
  - ☐ Equipment for inter-row management
  - ☐ Pest monitoring plan for legume crops

User can check items off as they complete in-field verification.

#### Footer
- Data attribution: "Data: NASA SMAP, GPM, MODIS, NASA POWER"

**User Action:**
- Review explanation
- Check off field verification items
- Return to Screen 5 to explore other rotations
- Proceed to Screen 7 to view alerts

---

### Screen 7: Alerts
**Purpose:** Deliver critical, actionable notifications  
**Key Elements:**

#### Title & Description
- "Alerts"
- "Real-time notifications based on NASA data and 7-day forecasts."

#### Alert Cards (Stacked, newest first)
Each alert card includes:

**Alert 1 (Critical – Red):**
- Status indicator: Pulsing red dot
- Title: "Dry spell likely in the next 10 days"
- Message: "Check soil moisture in the north plot — irrigation may be needed. Based on 7-day precipitation forecast."
- Timestamp: "Today at 14:32"
- Background: Subtle red tint with red border

**Alert 2 (Warning – Ocre):**
- Status indicator: Static ocre dot
- Title: "High temperature risk next month"
- Message: "Heat stress risk in January. Consider shade crops or irrigation timing. Relevant for soy and corn."
- Timestamp: "2 days ago"

**Alert 3 (Info – Lime):**
- Status indicator: Static lime dot
- Title: "Soil moisture recovering"
- Message: "Recent rains have improved topsoil moisture. Good conditions for early planting."
- Timestamp: "3 days ago"

#### No-Alerts State
- Friendly message: "No active alerts. Your field is in good condition."

#### Footer Note
- "Alerts refresh every 6 hours. Enable push notifications in Settings to stay updated."

**Alert Types:**
- Drought alert (7-day precipitation < 20mm)
- Heat stress alert (max temp > 32°C forecasted)
- Frost risk alert (min temp < 0°C forecasted)
- Moisture recovery (recent rain + soil moisture improving)
- Vegetation stress (NDVI declining > 10% week-over-week)

**User Action:**
- Review active alerts
- Tap alert to see related map/climate data
- Dismiss alert (swipe left or tap X)

---

## Bottom Navigation (All Screens)

**4 Persistent Tabs** (always visible):
1. 🗺️ **Field** → Screen 3 (Dashboard)
2. 📅 **Risk** → Screen 4 (Risk Calendar)
3. 🔄 **Rotations** → Screen 5 (Compare Rotations)
4. 🔔 **Alerts** → Screen 7 (Alerts)

**Tab States:**
- Active tab: Icon + label in lime green (#A6E36B)
- Inactive: Icon + label in tertiary gray (#8FA3B8)
- Underline indicator (2px) on active tab

---

## Interaction Patterns

### Touch/Click Targets
- Minimum 48px height for buttons and interactive elements
- 8px minimum spacing between targets
- Clear hover/active states with visual feedback

### Animations
- Tab transitions: 200ms fade + slide
- Button hover: 100ms scale (1.02x) + shadow expand
- Alert appearance: 300ms slide-down + fade-in
- Semaphore value: smooth number transitions (1s)

### Offline Mode
- Cached data remains accessible
- "Last update" indicator shows timestamp of last successful sync
- Sync button appears when connection restored
- Critical alerts remain visible

### Error Handling
- Network error: "Unable to fetch data. Using cached information from [date]."
- Location not found: "Location not recognized. Try searching again or pinning on map."
- Data unavailable: "Weather data not yet available for this region. Check back later."

---

## Accessibility & Usability

### Contrast Ratios
- All text ≥ 4.5:1 contrast (WCAG AA)
- Status colors paired with icons/text (not relying on color alone)
- Interactive elements have clear focus states

### Readability
- Minimum 12px font size (14px preferred for body)
- Line height ≥ 1.5 for paragraphs
- Short, simple explanations (8th-grade reading level)
- Each number accompanied by plain-language interpretation

### Touch Optimization
- Large buttons (48px+ height)
- Adequate spacing between tappable elements
- Swipe gestures only as secondary options

### Dark Mode
- Dark theme throughout (designed for outdoor sunlight readability)
- High contrast for glare conditions
- No light mode toggle

---

## Data Attribution & Disclaimers

All screens include discrete footer text:
> **"Data: NASA SMAP, GPM, MODIS, NASA POWER"**

Mockup screens display:
> **"Illustrative prototype — values for demonstration only"**

Never display:
- NASA logo, seal, or official insignia
- Statement that NASA endorses the project

---

## Technical Implementation

### Components
- `OnboardingScreen.tsx` → Screen 1
- MapView + LocationSearch → Screen 2
- `FieldDashboard.tsx` → Screen 3
- `RiskCalendar.tsx` → Screen 4
- `RotationComparison.tsx` → Screen 5
- `RotationDetailView.tsx` → Screen 6
- `AlertsScreen.tsx` → Screen 7

### State Management
- `useSelectedLocation()` — Field location (lat/lon, label)
- `useClimateData()` — NASA data fetch status & summary
- `useRotationScoring()` — All rotation scores & rankings
- `useCustomRotations()` — User-created rotations (localStorage)
- App-level tab navigation

### API Integration
- **Climate:** NASA POWER (monthly/annual climate data)
- **Soil:** SoilGrids (global) + CONEAT (local Uruguay zones)
- **Satellite:** GIBS (true color, NDVI, false color layers)
- **Forecast:** External weather API (when integrated)

---

## Responsive Behavior

### Mobile (< 640px)
- Single-column layout
- Full-width cards
- Bottom tab navigation (sticky)
- Horizontal scroll for month grid

### Tablet (640px – 1024px)
- 2-column layout (map + info)
- Side navigation optional

### Desktop (> 1024px)
- 3-column layout (search + map + data panels)
- Top/side navigation
- Wider cards and controls

---

## Future Enhancements

1. **Multi-field management** — Pin multiple fields, switch between them
2. **Seasonal forecasting** — 3-month outlook for key metrics
3. **PDF/CSV export** — Generate reports for agronomist consultation
4. **Push notifications** — Alert user to urgent conditions
5. **User accounts** — Cloud sync, preferences, historical data
6. **Crop-specific guidance** — Tailored recommendations per crop
7. **Mobile app** — React Native or Flutter deployment
8. **Multi-language** — ES, PT, EN versions

---

**Design Version:** 1.0  
**Last Updated:** Nov 2026  
**Status:** Production-Ready for NASA Space Apps Challenge 2026
