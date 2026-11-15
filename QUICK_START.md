# Farm Climetech - Ready to Launch

**Status:** All core features implemented and building successfully

## Quick Start (3 steps)

### 1. Create `.env` file
```bash
cp .env.example .env
```

Then edit `.env` and add your API keys:
```
VITE_GEMINI_API_KEY=your_gemini_key
VITE_METEOMATICS_USERNAME=your_username
VITE_METEOMATICS_PASSWORD=your_password
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open browser to **http://localhost:5173**

---

## What's Ready

### **AI-Powered Analysis**
- Gemini API integration for intelligent field assessment
- Automatic crop suitability scoring
- Smart alert generation
- Runs whenever field data changes

**Usage in code:**
```typescript
import { useAIAnalysis } from './hooks/useAIAnalysis'

const { analysis, alerts, suggestedRotations } = useAIAnalysis(fieldData, rotations)
```

### **Custom Rotations**
- Users can add unlimited custom crop rotations
- Auto-scoring: diversity (30%) + nitrogen (40%) + water balance (30%)
- Persisted in browser localStorage
- Pre-loaded with 4 recommended rotations

**Available crops:**
- Soy, Wheat, Maize, Cover crop, Pasture, Barley, Sunflower

**Usage:**
```typescript
import { customRotationManager } from './services/customRotationStorage'

customRotationManager.addCustomRotation('userId', 'My Rotation', ['Soy', 'Wheat', 'Cover crop'])
```

### **CONEAT Integration (Local Uruguayan Data)**
- 6 agricultural zones mapped
- Climate, soil, frost/drought risk per zone
- Suitable crops for each zone
- Departments mapped to zones

**Zones:**
- Norte Oriental (Tacuarembó, Rivera, Cerro Largo)
- Este (Maldonado, Lavalleja)
- Litoral Norte (Paysandú, Río Negro)
- Litoral Oeste (Soriano, Colonia)
- Sur Central (Florida, San José, Flores)
- Sur Este (Canelones, Montevideo)

### **Offline Mode**
- All data cached in localStorage
- Shows "Last synced at: HH:MM"
- Works perfectly without internet
- Automatic sync when connection restored

### **Report Export**
- **JSON Export:** Full technical data for analysis
- **CSV Export:** Human-readable spreadsheet format
- Includes: climate, soil, rotations, risks, recommendations
- Timestamped with location info

**Usage:**
```typescript
import { downloadReportAsJSON, downloadReportAsCSV } from './services/reportService'

downloadReportAsJSON(farmReport)
downloadReportAsCSV(farmReport)
```

### **Meteomatics Weather API**
- 10-day weather forecast
- Historical climate analysis
- Precipitation prediction
- All weather parameters (temp, humidity, wind, solar radiation)

**Usage:**
```typescript
import { getMeteomaticsWeather, predictPrecipitation } from './services/meteomaticsService'

const weather = await getMeteomaticsWeather(lat, lon)
const rainfall10days = await predictPrecipitation(lat, lon, 10)
```

### **Logo Integration**
- Farm Climetech logo (`v3.1`) added to `/public/logo.png`
- Use in components:
```tsx
<img src="/logo.png" alt="Farm Climetech" style={{ maxWidth: '200px' }} />
```

---

## File Structure

```
src/
├── services/
│   ├── aiAnalysisService.ts        ← Gemini AI integration
│   ├── customRotationStorage.ts    ← User rotations manager
│   ├── coneatService.ts            ← CONEAT zones data
│   ├── offlineService.ts           ← Offline caching
│   ├── reportService.ts            ← JSON/CSV export
│   └── meteomaticsService.ts       ← Weather API
├── hooks/
│   └── useAIAnalysis.ts            ← React hook for AI + offline
├── types/
│   ├── field.ts                    ← FieldData type
│   └── rotation.ts                 ← RotationScore type
└── components/                     ← UI components
    ├── Header.tsx                  ← App header
    ├── FieldDashboard.tsx          ← Main dashboard
    ├── RotationComparison.tsx      ← Rotation comparison
    ├── AlertsList.tsx              ← Alerts display
    └── ...
```

---

## Configuration

### Environment Variables
```env
VITE_GEMINI_API_KEY=          # Gemini API key (free from ai.google.dev)
VITE_METEOMATICS_USERNAME=    # Your Meteomatics account
VITE_METEOMATICS_PASSWORD=    # Your Meteomatics password
VITE_NASA_POWER_KEY=          # NASA POWER API (optional)
```

### Default Settings
- **Language:** English (all UI text)
- **Theme:** Dark mode (night blue background)
- **Update Frequency:** AI analysis runs on field data change
- **Offline Sync:** Automatic when connection restored
- **Storage:** Browser localStorage (no server required)

---

## Data Flow

```
User Input (Field Location)
        ↓
NASA APIs (POWER, GIBS, SMAP, NDVI)
        ↓
Meteomatics Weather API
        ↓
Gemini AI Analysis
        ↓
Scoring & Recommendations
        ↓
Offline Cache (localStorage)
        ↓
Export (JSON/CSV)
```

---

## Key Features Summary

| Feature | Status | Notes |
|---------|--------|-------|
| AI Analysis | ✅ | Gemini-powered |
| Custom Rotations | ✅ | Auto-scoring |
| CONEAT Integration | ✅ | All 6 Uruguayan zones |
| Offline Mode | ✅ | Full functionality without internet |
| Report Export | ✅ | JSON + CSV formats |
| Weather Integration | ✅ | Meteomatics API ready |
| Logo Branding | ✅ | v3.1 logo integrated |
| Mobile Responsive | ✅ | Works on all devices |
| WCAG AA Compliant | ✅ | High contrast & accessibility |

---

## 🎓 For Hackathon Judges

**Completed Features (All Requested):**
1. ✅ **Rotaciones personalizadas** - Usuarios pueden agregar sus propias rotaciones
2. ✅ **Datos de suelo locales** - CONEAT/DIEA integration completo
3. ✅ **Mejoras UI/UX** - Sistema de diseño completo con Dark Mode
4. ✅ **AI Agent** - Gemini-powered para análisis inteligente
5. ✅ **Exportación de reportes** - JSON/CSV con todos los datos
6. ✅ **Offline mode** - Funciona sin conexión a internet

**Tech Stack:**
- React + TypeScript (type-safe)
- Vite (fast builds)
- Gemini AI (intelligent analysis)
- NASA APIs (satellite data)
- Meteomatics (weather forecasts)
- localStorage (offline persistence)

---

## 🚢 Deployment Ready

### Build for production
```bash
npm run build
```

Output in `dist/` folder - ready to deploy:
- Vercel
- Netlify
- GitHub Pages
- Any static host

### Docker support
```bash
npm run build
docker build -t farmclimetech .
docker run -p 3000:80 farmclimetech
```

---


