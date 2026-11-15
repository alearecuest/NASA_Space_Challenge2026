import type { RotationScenario } from '../types/rotation'

export const PREDEFINED_ROTATIONS: Record<string, RotationScenario> = {
  R0: {
    id: 'R0',
    label: 'Continuous Soya',
    description: 'Current baseline: soya-soya-soya',
    sequence: {
      years: [
        { year: 1, crop: 'soya' },
        { year: 2, crop: 'soya' },
        { year: 3, crop: 'soya' },
      ],
      description: 'Continuous soya cultivation without rotation',
    },
    isCustom: false,
    useCase: 'Current practice in many regions; high revenue but increased risk.',
  },
  R1: {
    id: 'R1',
    label: 'Cover Crop Intensive',
    description: 'Soya + wheat + cover crop',
    sequence: {
      years: [
        { year: 1, crop: 'soya' },
        { year: 2, crop: 'wheat' },
        { year: 3, crop: 'vetch' },
      ],
      description: 'Summer soya, winter wheat, spring cover crop (vetch). Reduces bare soil.',
    },
    isCustom: false,
    useCase: 'Minimizes soil exposure, improves soil health, reduces erosion risk.',
  },
  R2: {
    id: 'R2',
    label: 'Soya–Maize–Wheat',
    description: 'Diversified cash crops',
    sequence: {
      years: [
        { year: 1, crop: 'soya' },
        { year: 2, crop: 'maize' },
        { year: 3, crop: 'wheat' },
      ],
      description: 'Diverse cash crops over 3 years. Breaks pest cycles, varies water demand.',
    },
    isCustom: false,
    useCase: 'Balances revenue and risk; requires diverse markets and equipment.',
  },
  R3: {
    id: 'R3',
    label: 'Agriculture–Pasture Mix',
    description: '2 years crops + 2 years pasture',
    sequence: {
      years: [
        { year: 1, crop: 'soya' },
        { year: 2, crop: 'wheat' },
        { year: 3, crop: 'pasture' },
        { year: 4, crop: 'pasture' },
      ],
      description: 'Alternates agriculture with extended pasture. Restores soil, supports livestock.',
    },
    isCustom: false,
    useCase: 'Highest resilience; requires grazing infrastructure; diversifies income.',
  },
}

export const getRotationById = (rotationId: string): RotationScenario | undefined =>
  PREDEFINED_ROTATIONS[rotationId]

export const getAllRotations = (): RotationScenario[] => Object.values(PREDEFINED_ROTATIONS)

export const getRotationCropSequence = (rotationId: string): string[] => {
  const rotation = PREDEFINED_ROTATIONS[rotationId]
  return rotation ? rotation.sequence.years.map((y) => y.crop) : []
}
