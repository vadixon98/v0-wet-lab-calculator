// Unit conversion factors
const MASS_CONVERSIONS = {
  g: 1,
  mg: 1e-3,
  µg: 1e-6,
  ng: 1e-9,
}

const VOLUME_CONVERSIONS = {
  L: 1,
  mL: 1e-3,
  µL: 1e-6,
}

const CONCENTRATION_CONVERSIONS = {
  M: 1,
  mM: 1e-3,
  µM: 1e-6,
  nM: 1e-9,
}

export function calculateMolarity(
  molecularWeight: number,
  concentration: number,
  concentrationUnit: string,
  volume: number,
  volumeUnit: string,
) {
  // Convert to base units
  const concInM =
    concentration * (CONCENTRATION_CONVERSIONS[concentrationUnit as keyof typeof CONCENTRATION_CONVERSIONS] || 1)
  const volInL = volume * (VOLUME_CONVERSIONS[volumeUnit as keyof typeof VOLUME_CONVERSIONS] || 1)

  // Calculate mass in grams
  const massInG = concInM * volInL * molecularWeight

  // Generate equivalents
  const equivalents = []

  if (massInG >= 1) {
    equivalents.push({ value: massInG, unit: "g" })
  }
  if (massInG * 1000 >= 0.1) {
    equivalents.push({ value: massInG * 1000, unit: "mg" })
  }
  if (massInG * 1e6 >= 0.1) {
    equivalents.push({ value: massInG * 1e6, unit: "µg" })
  }

  return {
    mass: massInG >= 1 ? massInG : massInG * 1000,
    massUnit: massInG >= 1 ? "g" : "mg",
    equivalents: equivalents.slice(1), // Don't duplicate the main result
  }
}

export function calculateDilution(
  stockConc: number,
  stockUnit: string,
  finalConc: number,
  finalUnit: string,
  finalVolume: number,
  volumeUnit: string,
) {
  // Convert concentrations to comparable units
  const { stockConcConverted, finalConcConverted } = convertConcentrations(stockConc, stockUnit, finalConc, finalUnit)

  // Convert final volume to liters for calculation
  const finalVolumeL = finalVolume * (VOLUME_CONVERSIONS[volumeUnit as keyof typeof VOLUME_CONVERSIONS] || 1)

  // C1V1 = C2V2, solve for V1
  const stockVolumeL = (finalConcConverted * finalVolumeL) / stockConcConverted
  const diluentVolumeL = finalVolumeL - stockVolumeL

  // Convert back to original volume unit
  const volumeConversion = VOLUME_CONVERSIONS[volumeUnit as keyof typeof VOLUME_CONVERSIONS] || 1
  const stockVolume = stockVolumeL / volumeConversion
  const diluentVolume = diluentVolumeL / volumeConversion

  return {
    stockVolume: Math.max(0, stockVolume),
    diluentVolume: Math.max(0, diluentVolume),
    volumeUnit,
    isValid: finalConcConverted < stockConcConverted,
  }
}

function convertConcentrations(
  stockConc: number,
  stockUnit: string,
  finalConc: number,
  finalUnit: string,
): { stockConcConverted: number; finalConcConverted: number } {
  // Handle molar concentrations
  if (["M", "mM", "µM", "nM"].includes(stockUnit) && ["M", "mM", "µM", "nM"].includes(finalUnit)) {
    const stockInM = stockConc * (CONCENTRATION_CONVERSIONS[stockUnit as keyof typeof CONCENTRATION_CONVERSIONS] || 1)
    const finalInM = finalConc * (CONCENTRATION_CONVERSIONS[finalUnit as keyof typeof CONCENTRATION_CONVERSIONS] || 1)
    return { stockConcConverted: stockInM, finalConcConverted: finalInM }
  }

  // Handle mass/volume concentrations
  if (["mg/mL", "µg/mL"].includes(stockUnit) && ["mg/mL", "µg/mL"].includes(finalUnit)) {
    const stockInMgMl = stockUnit === "mg/mL" ? stockConc : stockConc / 1000
    const finalInMgMl = finalUnit === "mg/mL" ? finalConc : finalConc / 1000
    return { stockConcConverted: stockInMgMl, finalConcConverted: finalInMgMl }
  }

  // Handle % w/v
  if (stockUnit === "% w/v" && finalUnit === "% w/v") {
    return { stockConcConverted: stockConc, finalConcConverted: finalConc }
  }

  // For mixed units, convert to mg/mL as common base
  const stockInMgMl = convertToMgMl(stockConc, stockUnit)
  const finalInMgMl = convertToMgMl(finalConc, finalUnit)

  return { stockConcConverted: stockInMgMl, finalConcConverted: finalInMgMl }
}

function convertToMgMl(concentration: number, unit: string): number {
  switch (unit) {
    case "mg/mL":
      return concentration
    case "µg/mL":
      return concentration / 1000
    case "% w/v":
      return concentration * 10 // 1% w/v = 10 mg/mL
    default:
      return concentration // Fallback for molar units (not ideal but prevents errors)
  }
}

export function calculateReconstitution(
  powderMass: number,
  massUnit: string,
  targetConc: number,
  concUnit: string,
  molecularWeight?: number,
) {
  // Convert mass to grams
  const massInG = powderMass * (MASS_CONVERSIONS[massUnit as keyof typeof MASS_CONVERSIONS] || 1)

  let solventVolumeL: number
  const isMolar = ["M", "mM", "µM", "nM"].includes(concUnit)

  if (isMolar && molecularWeight) {
    // For molar concentrations: volume = (mass / MW) / molarity
    const concInM = targetConc * (CONCENTRATION_CONVERSIONS[concUnit as keyof typeof CONCENTRATION_CONVERSIONS] || 1)
    const moles = massInG / molecularWeight
    solventVolumeL = moles / concInM
  } else {
    // For mass/volume concentrations: volume = mass / concentration
    const massInMg = massInG * 1000
    let concInMgMl: number

    switch (concUnit) {
      case "mg/mL":
        concInMgMl = targetConc
        break
      case "µg/mL":
        concInMgMl = targetConc / 1000
        break
      default:
        concInMgMl = targetConc // fallback
    }

    solventVolumeL = massInMg / concInMgMl / 1000 // Convert mL to L
  }

  // Generate volume equivalents
  const equivalents = []
  const solventVolumeMl = solventVolumeL * 1000
  const solventVolumeUl = solventVolumeL * 1e6

  if (solventVolumeL >= 0.001) {
    equivalents.push({ value: solventVolumeL, unit: "L" })
  }
  if (solventVolumeMl >= 0.1 && solventVolumeMl !== solventVolumeL) {
    equivalents.push({ value: solventVolumeMl, unit: "mL" })
  }
  if (solventVolumeUl >= 1 && solventVolumeUl !== solventVolumeMl) {
    equivalents.push({ value: solventVolumeUl, unit: "µL" })
  }

  // Determine best primary unit
  let primaryVolume: number
  let primaryUnit: string

  if (solventVolumeL >= 0.001) {
    primaryVolume = solventVolumeL
    primaryUnit = "L"
  } else if (solventVolumeMl >= 0.1) {
    primaryVolume = solventVolumeMl
    primaryUnit = "mL"
  } else {
    primaryVolume = solventVolumeUl
    primaryUnit = "µL"
  }

  return {
    solventVolume: primaryVolume,
    volumeUnit: primaryUnit,
    equivalents: equivalents.filter((eq) => eq.unit !== primaryUnit),
    isMolar,
  }
}

export function calculateConcentration(
  mass: number,
  massUnit: string,
  volume: number,
  volumeUnit: string,
  molecularWeight?: number,
) {
  // Convert mass to grams and mg
  const massInG = mass * (MASS_CONVERSIONS[massUnit as keyof typeof MASS_CONVERSIONS] || 1)
  const massInMg = massInG * 1000

  // Convert volume to mL and L
  const volumeInL = volume * (VOLUME_CONVERSIONS[volumeUnit as keyof typeof VOLUME_CONVERSIONS] || 1)
  const volumeInMl = volumeInL * 1000

  // Calculate basic concentrations
  const mgMl = massInMg / volumeInMl
  const ugMl = mgMl * 1000
  const percentWV = (massInG / volumeInMl) * 100

  // Calculate molarity if MW provided
  let molarity: number | undefined
  if (molecularWeight) {
    const moles = massInG / molecularWeight
    molarity = moles / volumeInL
  }

  // Generate equivalents for molarity
  const equivalents = []
  if (molarity !== undefined) {
    if (molarity >= 0.001) {
      equivalents.push({ value: molarity, unit: "M" })
    }
    if (molarity * 1000 >= 0.1) {
      equivalents.push({ value: molarity * 1000, unit: "mM" })
    }
    if (molarity * 1e6 >= 1) {
      equivalents.push({ value: molarity * 1e6, unit: "µM" })
    }
    if (molarity * 1e9 >= 1) {
      equivalents.push({ value: molarity * 1e9, unit: "nM" })
    }
  }

  return {
    mgMl,
    ugMl,
    percentWV,
    molarity,
    equivalents: equivalents.slice(1), // Don't duplicate the main molarity result
  }
}
