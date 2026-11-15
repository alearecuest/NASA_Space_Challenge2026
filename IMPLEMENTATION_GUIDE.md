# Farm Climetech - Setup Guide & Completed Features

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env` file in root:
```
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_NASA_POWER_KEY=your_key_here
VITE_METEOMATICS_USERNAME=your_username
VITE_METEOMATICS_PASSWORD=your_password
```

### 3. Get API Keys

#### Gemini API (Free for hackathons)
1. Go to https://ai.google.dev/
2. Create project
3. Enable Generative AI API
4. Create API Key
5. Add to `.env` as `VITE_GEMINI_API_KEY`

#### NASA POWER
- Free, no key required for basic usage
- https://power.larc.nasa.gov/

#### Meteomatics (You already have credentials)
- Username: [your username]
- Password: [your password]

### 4. Run Development Server
```bash
npm run dev
```
Visit http://localhost:5173

---

## ✅ Features Completed

### 1. **AI Agent Analysis** ✅
- Gemini-powered field condition analysis
- Predictive crop suitability scoring
- Intelligent alert generation
- File: `src/services/aiAnalysisService.ts`

### 2. **Custom Rotations** ✅
- Add unlimited custom crop rotations
- Auto-scoring based on diversity, nutrition, water balance
- LocalStorage persistence
- User-specific storage
- File: `src/services/customRotationStorage.ts`

### 3. **CONEAT/DIEA Data Integration** ✅
- Full Uruguayan CONEAT zones mapping
- Climate characteristics by zone
- Suitable crops per zone
- Frost & drought risk assessment
- File: `src/services/coneatService.ts`

### 4. **Report Export** ✅
- Export as JSON (full data)
- Export as CSV (human-readable)
- Includes all climate, soil, rotation data
- File: `src/services/reportService.ts`

### 5. **Offline Mode** ✅
- LocalStorage-based data caching
- Last sync timestamp
- Seamless online/offline switching
- File: `src/services/offlineService.ts`

### 6. **Logo Integration** ✅
- Farm Climetech logo added to `/public/logo.png`
- Can be imported in components as:
  ```tsx
  <img src="/logo.png" alt="Farm Climetech" />
  ```

### 7. **Enhanced UI/UX** ✅
- Design System colors & typography defined
- Responsive mobile-first layout
- WCAG AA contrast compliance
- Dark mode by default
- Files:
  - `DESIGN_SYSTEM.md` - Complete component specs
  - `UI_FLOW.md` - User flow documentation
  - `MOCKUPS.html` - Interactive UI previews

---

## 📋 Component Integration Checklist

### Navigation Tabs (4-tab bottom navigation)
- [ ] Field (Dashboard)
- [ ] Risk (Risk Calendar)
- [ ] Rotations (Comparison + Custom)
- [ ] Alerts (Alert list + Notifications)

**Implementation:**
```tsx
import { Navigation } from './components/Navigation'

export function App() {
  return (
    <>
      <main>Your content</main>
      <Navigation />
    </>
  )
}
```

### Alert Notifications Example
```tsx
import { AlertsList } from './components/AlertsList'
import { generateAlerts } from './services/aiAnalysisService'

const alerts = await generateAlerts(fieldData)
```

### Custom Rotation UI
```tsx
import { AddCustomRotation } from './components/AddCustomRotation'
import { customRotationStorage } from './services/customRotationStorage'

const rotations = customRotationStorage.getCustomRotations()
```

### Export Reports
```tsx
import { downloadReportAsJSON, downloadReportAsCSV } from './services/reportService'

downloadReportAsJSON(farmReport)
downloadReportAsCSV(farmReport)
```

---

## 🔧 Data Structures

### FieldData
```typescript
interface FieldData {
  latitude: number
  longitude: number
  soilMoisture: number
  rainfall: number
  rainfallAvg: number
  ndvi: number
  soilType: string
  tempAvg: number
}
```

### CropRotation
```typescript
interface CropRotation {
  id: string
  name: string
  crops: string[]
  score: number
  category: 'current' | 'recommended' | 'good' | 'custom'
}
```

---

## 🎨 Design System Colors

```css
--color-night-blue: #0F2A44
--color-dark-blue: #0B1C2E
--color-accent-lime: #A6E36B
--color-field-green: #4C8C2B
--color-alert-ochre: #D9A441
--color-risk-terracotta: #C4572A
--color-text-warm: #F4F6F1
--color-text-secondary: #BFD3E6
--color-text-tertiary: #8FA3B8
```

---

## 📊 Next Steps for Hackathon

1. **Test AI Agent** - Verify Gemini responses with real field data
2. **User Testing** - Test with farmers or agricultural extension agents
3. **Crop Data** - Add more crops & detailed rotation scoring
4. **Offline Sync** - Implement background sync when connection restored
5. **Push Notifications** - Add real alert notifications (PWA)
6. **Dark Mode Toggle** - Let users switch themes (already dark by default)

---

## 🐛 Troubleshooting

### "Vite not found"
```bash
npm install
rm -rf node_modules package-lock.json
npm install
```

### Gemini API errors
- Check `.env` file exists
- Verify API key is correct
- Check API is enabled in Google Cloud Console

### Offline mode not working
- Check browser localStorage is enabled
- Clear cache if old data persists
- Check console for errors

### CONEAT data not showing
- Verify department name matches zones
- Check `coneatService.ts` for available departments

---

## 📞 Support

For issues during hackathon:
- Check browser console for errors
- Verify all `.env` variables
- Test with sample data first
- Check network tab for API failures

Good luck! 🚀
