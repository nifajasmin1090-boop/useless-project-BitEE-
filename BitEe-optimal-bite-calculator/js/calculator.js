/**
 * OPTIMAL BITE CALCULATOR - Optimization & Calculation Engine
 * 
 * Fictional Optimization Model for Entertainment & Hackathon demonstration.
 * Not scientifically validated food science.
 */

// Fictional Target Ideal Ratios (%)
export const IDEAL_RATIOS = {
  Bread: 40,
  Protein: 25,
  Vegetable: 20,
  Cheese: 10,
  Sauce: 5
};

// Aerodynamic Mode Terminology Dictionary
export const TERMINOLOGY = {
  standard: {
    sandwich: "Sandwich",
    biteAngle: "Optimal Bite Angle",
    sauce: "Sauce",
    patty: "Patty",
    lettuce: "Lettuce",
    bite: "Bite",
    badConfig: "Imbalanced Configuration",
    perfectConfig: "Flavor Optimized",
    biteTrajectory: "Bite Trajectory Vector",
    entryPoint: "Optimal Ingestion Point",
    thickness: "Total Thickness",
    efficiency: "Bite Efficiency Score",
    flavorLift: "Flavor Lift Units",
    recommendedAction: "READY TO CONSUME"
  },
  aerodynamic: {
    sandwich: "Flavor Airframe",
    biteAngle: "Angle of Attack (AoA)",
    sauce: "Fluid Load (Hydrodynamic Sauce)",
    patty: "Primary Load-Bearing Protein Component",
    lettuce: "Flexible Surface Aerofoil Leaf",
    bite: "Gastronomic Ingestion Event",
    badConfig: "Aerodynamic Instability",
    perfectConfig: "Zero-Vibration Laminar Setup",
    biteTrajectory: "Angle of Attack Ingestion Vector",
    entryPoint: "Stagnation Ingestion Point",
    thickness: "Airframe Camber Thickness",
    efficiency: "Aero-Flavor Efficiency",
    flavorLift: "Aerodynamic Thrust Lift",
    recommendedAction: "CLEARED FOR INGESTION"
  }
};

/**
 * Calculates sum of all layer thicknesses in mm
 * @param {Array} layers
 * @returns {number}
 */
export function calculateTotalThickness(layers) {
  if (!layers || layers.length === 0) return 0;
  return layers.reduce((acc, layer) => acc + (parseFloat(layer.thickness) || 0), 0);
}

/**
 * Calculates thickness and percentage breakdown per category
 * @param {Array} layers
 * @returns {Object} { thicknesses: {}, percentages: {}, totalThickness: number }
 */
export function calculateCategoryRatios(layers) {
  const totalThickness = calculateTotalThickness(layers);
  
  const thicknesses = {
    Bread: 0,
    Protein: 0,
    Vegetable: 0,
    Cheese: 0,
    Sauce: 0,
    Other: 0
  };

  layers.forEach(layer => {
    const category = layer.category in thicknesses ? layer.category : 'Other';
    thicknesses[category] += (parseFloat(layer.thickness) || 0);
  });

  const percentages = {};
  for (const cat of Object.keys(thicknesses)) {
    percentages[cat] = totalThickness > 0 ? (thicknesses[cat] / totalThickness) * 100 : 0;
  }

  return { thicknesses, percentages, totalThickness };
}

/**
 * Computes difference from ideal ratios and total error
 * @param {Object} percentages
 * @returns {Object} { differences: {}, totalError: number }
 */
export function calculateError(percentages) {
  const differences = {};
  let totalError = 0;

  for (const [cat, targetPct] of Object.entries(IDEAL_RATIOS)) {
    const actualPct = percentages[cat] || 0;
    const diff = Math.abs(actualPct - targetPct);
    differences[cat] = diff;
    totalError += diff;
  }

  // Factor in 'Other' category as additional entropy
  if (percentages.Other && percentages.Other > 0) {
    totalError += percentages.Other * 0.75;
  }

  return { differences, totalError: Math.round(totalError * 10) / 10 };
}

/**
 * Computes Bite Efficiency Score (0 - 100) and rating string
 * @param {number} totalError
 * @returns {Object} { score: number, rating: string, color: string, level: string }
 */
export function calculateEfficiency(totalError) {
  const rawScore = 100 - totalError;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  let rating = "CRITICAL FAILURE (IMBALANCED)";
  let color = "red";
  let level = "critical";

  if (score >= 90) {
    rating = "OPTIMAL BITE (FLAVOR OPTIMIZED)";
    color = "emerald";
    level = "optimal";
  } else if (score >= 75) {
    rating = "EXCELLENT BITE (AERODYNAMIC)";
    color = "cyan";
    level = "excellent";
  } else if (score >= 50) {
    rating = "ACCEPTABLE BITE (STABLE)";
    color = "yellow";
    level = "acceptable";
  } else if (score >= 25) {
    rating = "STRUCTURAL CONCERN (IMBALANCED)";
    color = "orange";
    level = "warning";
  }

  return { score, rating, color, level };
}

/**
 * Calculates optimal bite angle according to error brackets
 * @param {number} totalError
 * @returns {number} Angle in degrees (max 45°)
 */
export function calculateBiteAngle(totalError) {
  if (totalError < 10) return 5;
  if (totalError < 20) return 15;
  if (totalError < 30) return 25;
  if (totalError < 40) return 35;
  return 40; // Max calculated per specs, capped at 45°
}

/**
 * Calculates humorous fictional Flavor Lift (FL)
 * @param {number} efficiency
 * @returns {number}
 */
export function calculateFlavorLift(efficiency) {
  return Math.round(efficiency * 1.37);
}

/**
 * Generates aerospace and structural warnings based on sandwich composition
 * @param {Array} layers
 * @param {Object} percentages
 * @param {number} totalThickness
 * @param {number} angle
 * @returns {Array} List of warning objects { type, title, description, level, icon }
 */
export function generateWarnings(layers, percentages, totalThickness, angle) {
  const warnings = [];

  if (!layers || layers.length === 0) {
    return [{
      type: "ERROR_001",
      title: "ERROR 001: EMPTY AIRFRAME DETECTED!",
      description: "The plate is empty! Construct a flavor airframe before attempting bite trajectory simulation.",
      level: "critical",
      icon: "🚫"
    }];
  }

  // Check for zero or negative thicknesses
  const hasZero = layers.some(l => parseFloat(l.thickness) === 0);
  const hasNegative = layers.some(l => parseFloat(l.thickness) < 0);

  if (hasNegative) {
    warnings.push({
      type: "ERROR_003",
      title: "ERROR 003: NEGATIVE THICKNESS DETECTED!",
      description: "Anti-matter bread detected! Laws of gastronomic quantum mechanics severely violated.",
      level: "critical",
      icon: "⚛️"
    });
  }

  if (hasZero) {
    warnings.push({
      type: "ERROR_002",
      title: "ERROR 002: ZERO-THICKNESS INGREDIENT!",
      description: "Quantum lettuce detected! Cannot optimize airframe with two-dimensional food strata.",
      level: "critical",
      icon: "🔬"
    });
  }

  // Compositional Warnings in English Satire
  if (percentages.Bread > 50) {
    warnings.push({
      type: "BREAD_DOMINANCE",
      title: "🚨 BREAD OVERLOAD DETECTED!",
      description: `Excessive bread stratum (${percentages.Bread.toFixed(1)}% vs target 40%). Suffocating all secondary flavor components. Structural carb overkill!`,
      level: "warning",
      icon: "🍞"
    });
  }

  const hasTomato = layers.some(l => l.name.toLowerCase().includes('tomato'));
  if (percentages.Tomato > 25 || (percentages.Vegetable > 35 && hasTomato)) {
    warnings.push({
      type: "TOMATO_DOMINANCE",
      title: "🍅 TOMATO DISASTER DETECTED!",
      description: "Aqueous red-matter overload! High probability of boundary layer slippage and high-velocity lateral ejection upon first bite.",
      level: "warning",
      icon: "🍅"
    });
  }

  if (percentages.Sauce > 15) {
    warnings.push({
      type: "SAUCE_FLOOD",
      title: "🌊 SAUCE TSUNAMI WARNING!",
      description: `Fluid load (${percentages.Sauce.toFixed(1)}%) exceeds hydrodynamic retention threshold. Lateral squirt and clothing contamination imminent!`,
      level: "critical",
      icon: "🌊"
    });
  }

  if (percentages.Vegetable < 5) {
    warnings.push({
      type: "VEGETABLE_DEFICIENCY",
      title: "🥬 VEGETATION DEFICIENCY!",
      description: "Vegetational contribution dangerously low. Zero crisp boundary layers detected for acoustic chew response.",
      level: "warning",
      icon: "🥬"
    });
  }

  if (percentages.Protein < 10) {
    warnings.push({
      type: "PROTEIN_UNDERLOAD",
      title: "🥩 PROTEIN UNDERLOAD!",
      description: "Primary load-bearing protein component missing! Caloric thrust insufficient for stable aerodynamic mastication.",
      level: "warning",
      icon: "🥩"
    });
  }

  if (totalThickness > 100) {
    warnings.push({
      type: "EXCESSIVE_THICKNESS",
      title: "📏 MANDIBULAR HAZARD! (EXCESSIVE THICKNESS)",
      description: `Total thickness (${totalThickness} mm) exceeds maximum human jaw clearance. Mandibular dislocation and lockjaw hazard imminent!`,
      level: "critical",
      icon: "⚠️"
    });
  } else if (totalThickness < 15 && totalThickness > 0) {
    warnings.push({
      type: "UNDERSIZED_AIRFRAME",
      title: "⚠️ UNDERSIZED AIRFRAME!",
      description: `Microscopic sandwich airframe (${totalThickness} mm). This is a cracker, not a sandwich. Re-evaluate life choices.`,
      level: "warning",
      icon: "🤏"
    });
  }

  // Bite Stall Detection
  if (angle > 35) {
    warnings.push({
      type: "BITE_STALL",
      title: "🔴 CRITICAL BITE STALL WARNING!",
      description: "Angle of attack exceeds critical stall threshold (35°)!\n• Lettuce separation: HIGH\n• Tomato escape velocity: SEVERE\n• Overall bite stability: CATASTROPHIC",
      level: "critical",
      icon: "✈️"
    });
  }

  return warnings;
}

/**
 * Full sandwich analysis wrapper
 * @param {Array} layers
 * @returns {Object}
 */
export function analyzeSandwich(layers) {
  const { thicknesses, percentages, totalThickness } = calculateCategoryRatios(layers);
  const { differences, totalError } = calculateError(percentages);
  const efficiency = calculateEfficiency(totalError);
  const biteAngle = calculateBiteAngle(totalError);
  const flavorLift = calculateFlavorLift(efficiency.score);
  const warnings = generateWarnings(layers, percentages, totalThickness, biteAngle);

  // Center of mass / flavor center estimation
  let centerOfFlavor = 50;
  if (layers && layers.length > 0 && totalThickness > 0) {
    let accumulated = 0;
    let weightedPosition = 0;
    let totalWeight = 0;
    layers.forEach(layer => {
      const th = parseFloat(layer.thickness) || 0;
      const mid = accumulated + th / 2;
      const weight = layer.category === 'Protein' ? 2.5 : layer.category === 'Cheese' ? 1.8 : 1.0;
      weightedPosition += mid * weight;
      totalWeight += weight;
      accumulated += th;
    });
    if (accumulated > 0 && totalWeight > 0) {
      centerOfFlavor = Math.round((weightedPosition / (accumulated * (totalWeight / layers.length))) * 100);
      centerOfFlavor = Math.max(20, Math.min(80, centerOfFlavor));
    }
  }

  return {
    layers,
    totalThickness,
    categoryThicknesses: thicknesses,
    categoryPercentages: percentages,
    differences,
    totalError,
    efficiency,
    biteAngle,
    flavorLift,
    centerOfFlavor,
    warnings,
    isStalled: biteAngle > 35
  };
}
