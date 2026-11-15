# FarmClimTech Development Guide

## Project Structure

```
src/
├── components/          # React UI components
│   ├── RotationComparison.tsx
│   ├── RotationDetail.tsx
│   ├── CropSuitabilityGrid.tsx
│   ├── SoilAnalysis.tsx
│   ├── AlertsList.tsx
│   ├── FarmReportView.tsx
│   ├── MapView.tsx
│   ├── ClimatePanel.tsx
│   └── ...
├── domain/              # Business logic & scoring engines
│   ├── rotationScoring.ts
│   ├── cropSuitability.ts
│   ├── cropDatabase.ts
│   ├── rotationDefinitions.ts
│   ├── climateIndicators.ts
│   └── ...
├── services/            # External API integrations
│   ├── powerService.ts
│   ├── soilGridsService.ts
│   ├── gibsService.ts
│   ├── geocodingService.ts
│   └── reportService.ts
├── hooks/               # Custom React hooks
│   ├── useClimateData.ts
│   ├── useRotationScoring.ts
│   └── useSelectedLocation.ts
├── types/               # TypeScript type definitions
│   ├── rotation.ts
│   ├── climate.ts
│   ├── location.ts
│   └── gibs.ts
├── config/              # Configuration & constants
│   ├── climate.ts
│   ├── constants.ts
│   ├── gibsLayers.ts
│   └── appConfig.ts
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## Adding a New Crop

1. Edit `src/domain/cropDatabase.ts`:
   - Add crop ID to `CropName` type in `src/types/rotation.ts`
   - Add profile to `CROP_PROFILES` object with:
     - `sowingMonths`: Array of 1–12
     - `harvestMonths`: Array of 1–12
     - `cycleLength`: Months from sowing to harvest
     - `waterRequirement`: mm/season
     - `fruitDegreeDaysMin/Max`: Growing degree days
     - `frostTolerance`: Min temp tolerated (°C)
     - `heatTolerance`: Max temp tolerated (°C)
     - `soilCoverageScore`: 0–1 (how much soil covered)
     - `nitrogenFixing`: true if legume
     - `targetMarket`: commodity/local/both
     - `estimatedYield`: tons/ha

2. Scoring engine automatically includes new crop in:
   - Crop suitability assessment
   - Rotation comparisons

## Adjusting Rotation Scores

Edit `src/domain/rotationScoring.ts`:

- `calculateWaterScore()`: Balance water availability vs crop demand
- `calculateSoilScore()`: Coverage + erosion + fertility
- `calculateIncomeScore()`: Yield × price
- `calculateResilienceScore()`: Diversity + trends + adaptation

All calculations are transparent—each returns a score (0–100) + explanation.

## Adding a New Data Source

1. Create a new service in `src/services/`:
   ```typescript
   export const fetchMyData = async (params) => { ... }
   export const MyDataError extends Error { ... }
   ```

2. Create a hook in `src/hooks/` if data needs caching:
   ```typescript
   export const useMyData = () => useMemo(() => { ... }, [deps])
   ```

3. Integrate into components and update types in `src/types/`

## Testing Locally

### With NASA POWER API (real data)

1. Requires internet connection
2. First request ~5s (downloading 30+ years of climate data)
3. Data cached in-memory (lasts session)

### With mock data

Edit `src/services/powerService.ts` or use development API response cache.

## Styling

Uses **Tailwind CSS**. Key classes:
- Colors: emerald (primary), slate (neutral), amber (warning), red (error)
- Sizing: rem-based, prefer `px-4 py-2` patterns
- Layout: `grid gap-4 md:grid-cols-2 lg:grid-cols-3`
- Dark mode: Default is light; can add dark variant if needed

## Performance Optimization

- **API Caching**: `powerService`, `soilGridsService` cache in Map
- **Memoization**: `useRotationScoring`, `useCropSuitability` use useMemo
- **Lazy loading**: Map tiles load on demand via GIBS
- **No SSR**: All rendering client-side

For production, consider:
- Backend caching layer
- CDN for static assets
- Service workers for offline

## Debugging Tips

- Use browser DevTools Network tab to monitor API calls
- Check Console for TypeScript errors
- `window.powerService.cache` to inspect cached climate data
- `localStorage` available for persistence (not currently used)

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

Env vars needed:
- `VITE_OPENCAGE_API_KEY` (optional; if using paid tier)

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes with descriptive commits
4. Ensure code lints: `npm run lint`
5. Open PR with description of changes

Code standards:
- TypeScript strict mode
- No `any` types without justification
- English identifiers & comments only
- Functional components (React 19)
- ESM imports

## Common Issues

| Issue | Solution |
|-------|----------|
| NASA POWER API timeout | Check internet; retry. API has rate limits (~2 req/s) |
| SoilGrids 404 | Location may be off-grid (ocean, poles). Use fallback values |
| Chart.js not rendering | Check chart setup in `src/config/chartSetup.ts` |
| Geocoding fails | Internet issue or OCK key expired |

## Resources

- [NASA POWER Documentation](https://power.larc.nasa.gov/docs/)
- [SoilGrids API](https://www.isric.org/explore/soilgrids)
- [GIBS Imagery Layers](https://wiki.earthdata.nasa.gov/display/GIBS)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React 19 Docs](https://react.dev)

---

**Last updated**: 2026-11-15
