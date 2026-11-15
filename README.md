# Farm Climetech: Climate-Resilient Rotation Advisor

**Eyes in the sky, in the farmer's hands.**

A decision-support tool for agricultural producers to compare crop rotation strategies using NASA Earth observation data and local climate analysis.

## Challenge

**NASA Space Apps Challenge 2026 - Field Shift: Adapting Farms with NASA Data**

In Uruguay, agriculture depends on rainfall and soil moisture. Climate variability—including severe droughts—threatens productivity. Farmers need a way to understand how their climate is changing and which crop rotations best adapt to those changes.

## Solution

FarmClimTech combines:
- **NASA satellite data** (POWER, MODIS NDVI, GPM, SMAP)
- **Local soil properties** (SoilGrids global dataset)
- **Crop agronomic requirements** (FAO database)
- **Simple decision scoring** (water, soil, income, resilience)

To answer: **"With the climate changing in my zone, is my current rotation still optimal?"**

## Key Features

### 1. Interactive Map & Climate Overview
- Select location by map click or search by name
- View NASA satellite imagery (NDVI, temperature, moisture)
- Download POWER climate data (daily records since 1991)
- Display monthly climate metrics and trends

### 2. Rotation Analysis
Compare 4 strategies:
- **R0**: Continuous Soya (current baseline)
- **R1**: Soya + Wheat + Cover Crop (minimize bare soil)
- **R2**: Soya + Maize + Wheat (diversified crops)
- **R3**: Agriculture + Pasture (highest resilience)

Each rotation scored on:
- **Water security**: balance hídrico, tolerancia a sequía
- **Soil health**: cobertura vegetal, erosión, materia orgánica
- **Income potential**: rendimiento estimado, acceso a mercados
- **Climate resilience**: adaptación a tendencias y extremos

### 3. Crop Suitability Finder
Discover which crops thrive in your location:
- Suitability score (0–100)
- Optimal sowing months
- Risk factors (frost, heat, water)
- Recommendations for each crop

### 4. Soil Analysis
Global soil properties from SoilGrids:
- Texture classification (clay, sand, loam)
- Organic matter content
- pH level
- Suitability score
- Management recommendations

### 5. Climate Alerts
Monthly risk alerts:
- Frost risk
- Dry spells
- Heat stress
- Erosion risk
- Data source attribution

### 6. Comprehensive Farm Report
Downloadable PDF/CSV with:
- Location climate summary
- Soil profile
- Current rotation assessment
- Top recommended rotations
- Key risks
- Actionable next steps
- Data quality & uncertainties

## Data Sources

| Layer | Source | Resolution | Latency |
|-------|--------|-----------|---------|
| Daily climate (T, rain, ET) | NASA POWER | ~50 km | ~1 day |
| Vegetation index (NDVI) | MODIS | 250 m | 1–2 days |
| Soil moisture anomalies | SMAP | 9–36 km | 2–3 days |
| Rainfall | GPM IMERG | 0.1° | 30 min |
| Soil texture, OM, pH | SoilGrids (ISRIC) | 250 m | Static 2023 |

## Architecture

```
Frontend (React + TypeScript)
├── Components
│   ├── Map & satellite layers (Leaflet)
│   ├── Rotation comparison cards
│   ├── Crop suitability grid
│   ├── Soil analysis panel
│   ├── Climate alerts list
│   └── Farm report exporter
├── Hooks
│   ├── useClimateData() — fetch POWER
│   ├── useRotationScoring() — score strategies
│   └── useCropSuitability() — assess crops
├── Domain Logic
│   ├── rotationScoring.ts — 4-dimensional scoring engine
│   ├── cropSuitability.ts — crop assessment
│   ├── cropDatabase.ts — 10 crop profiles
│   └── rotationDefinitions.ts — R0–R3 scenarios
└── Services
    ├── powerService.ts — POWER API client
    ├── gibsService.ts — NASA GIBS layers
    ├── soilGridsService.ts — SoilGrids API
    └── reportService.ts — Report generation

Backend (Optional for hackaton MVP)
- None required; all APIs public
- For production: add user accounts, saved farms, email alerts
```

## Tech Stack

- **Frontend**: React 19, TypeScript, TailwindCSS
- **Maps**: Leaflet, React-Leaflet
- **Charts**: Chart.js, react-chartjs-2
- **Build**: Vite
- **External APIs**: NASA POWER, NASA GIBS, SoilGrids, OpenCage Geocoding

## Installation & Running

### Prerequisites
- Node.js ≥ 18
- npm or yarn

### Setup

```bash
git clone https://github.com/alearecuest/NASA_Space_Challenge2026.git
cd NASA_Space_Challenge2026
npm install
```

### Development Server

```bash
npm run dev
```

Open http://localhost:5173

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

1. **Select a location** by clicking the map or searching by name
2. **View climate** trends and current conditions
3. **Compare rotations** with interactive cards; click to see detailed explanation
4. **Explore crop suitability** for your location
5. **Review alerts** for monthly risks (frost, drought, heat, erosion)
6. **Check soil** properties and recommendations
7. **Generate report** with all analysis and export as JSON/CSV

## Data Limitations & Uncertainties

- **Climate model resolution**: ~50 km; microclimates may vary
- **Soil data**: SoilGrids approximation; no local soil survey
- **Crop prices**: Historical averages; market fluctuates
- **Rotation validation**: Agronomist review recommended
- **Offline data**: Latest satellite updates may lag 1–3 days

## How to Validate Locally

The scoring engine is transparent:
1. Each rotation gets a score for water, soil, income, resilience
2. Click "See why" to read the explanation
3. Evidence links show the NASA data supporting each score
4. Risk checklist identifies what to verify with your agronomist

## Future Enhancements

- User accounts & saved farms
- Scenario modeling (e.g., "+1°C, -20% rain")
- Pesticide-pest cycle analysis
- Market price integration
- Mobile app (iOS/Android)
- Offline mode (for low-bandwidth areas)
- Multi-language support
- Integration with farm management software

## Credits & Attribution

- **Challenge**: NASA Space Apps Challenge 2026, ClimaUY team
- **Climate Data**: NASA POWER, MODIS, GPM, SMAP
- **Soil Data**: SoilGrids (ISRIC)
- **Mapping**: Leaflet, OpenStreetMap contributors
- **Inspiration**: Apollo 8 Earthrise photograph—"to look at Earth from above to care for it"

## License

MIT License. Open for non-commercial and educational use. See LICENSE file.

## Contact & Support

For questions or feedback:
- GitHub Issues: [Link to repo issues]
- Email: [Team contact]

---

**Disclaimer**: This tool supports decision-making but does not replace agricultural advice. Always consult with local agronomists and consider your farm's unique constraints before adopting new rotations.
