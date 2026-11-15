const SOLAR_CONSTANT = 0.082
const DEGREES_TO_RADIANS = Math.PI / 180
const LATENT_HEAT_FACTOR = 0.408

export const extraterrestrialRadiation = (latitudeDegrees: number, dayOfYear: number): number => {
  const latitude = latitudeDegrees * DEGREES_TO_RADIANS
  const angle = (2 * Math.PI * dayOfYear) / 365
  const inverseDistance = 1 + 0.033 * Math.cos(angle)
  const declination = 0.409 * Math.sin(angle - 1.39)
  const sunsetArgument = Math.min(1, Math.max(-1, -Math.tan(latitude) * Math.tan(declination)))
  const sunsetAngle = Math.acos(sunsetArgument)
  return (
    ((24 * 60) / Math.PI) *
    SOLAR_CONSTANT *
    inverseDistance *
    (sunsetAngle * Math.sin(latitude) * Math.sin(declination) +
      Math.cos(latitude) * Math.cos(declination) * Math.sin(sunsetAngle))
  )
}

export const hargreavesEt0 = (tmax: number, tmin: number, radiation: number): number => {
  const range = Math.max(0, tmax - tmin)
  const meanTemp = (tmax + tmin) / 2
  return Math.max(0, 0.0023 * LATENT_HEAT_FACTOR * radiation * (meanTemp + 17.8) * Math.sqrt(range))
}