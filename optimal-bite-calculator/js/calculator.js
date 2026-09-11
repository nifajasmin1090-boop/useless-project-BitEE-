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
    sandwich: "Sandwich (Saanam)",
    biteAngle: "Bite Angle (Kadi Angle)",
    sauce: "Sauce (Chaaru)",
    patty: "Patty (Meat Kashnam)",
    lettuce: "Lettuce (Pacha Ila)",
    bite: "Bite (Kadi)",
    badConfig: "Pani Paali (Imbalanced)",
    perfectConfig: "Pwoli Saanam (Flavor Optimized)",
    biteTrajectory: "Kadi Trajectory Vector",
    entryPoint: "Aadyam Kadikkunna Spot",
    thickness: "Total Thickness (Katti)",
    efficiency: "Bite Efficiency (Adipoli Meter)",
    flavorLift: "Flavor Lift (Thallu Units)",
    recommendedAction: "DHAYRIYAMAAYI KADICHOO"
  },
  aerodynamic: {
    sandwich: "Flavor Airframe (Parakkum Saanam)",
    biteAngle: "Angle of Attack (Aero Kadi Angle)",
    sauce: "Fluid Load (Hydrodynamic Ozhukku)",
    patty: "Primary Load-Bearing Meat Component",
    lettuce: "Flexible Surface Leaf",
    bite: "Flavor Intake (Ul-kollal)",
    badConfig: "Aerodynamic Durantham",
    perfectConfig: "Theerumanam Aaya Setup",
    biteTrajectory: "Angle of Attack Vector",
    entryPoint: "Stagnation Kadi Point",
    thickness: "Airframe Camber Katti",
    efficiency: "Aero-Flavor Efficiency",
    flavorLift: "Aerodynamic Thrust Lift",
    recommendedAction: "CLEARED TO KADIKKAL"
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

  let rating = "DURANTHAM! (CRITICAL FAILURE)";
  let color = "red";
  let level = "critical";

  if (score >= 90) {
    rating = "PWOLI SAANAM! (FLAVOR OPTIMIZED)";
    color = "emerald";
    level = "optimal";
  } else if (score >= 75) {
    rating = "KIDILAN BITE (EXCELLENT)";
    color = "cyan";
    level = "excellent";
  } else if (score >= 50) {
    rating = "KUZHAPPAM ILLA (ACCEPTABLE)";
    color = "yellow";
    level = "acceptable";
  } else if (score >= 25) {
    rating = "PANI PAALI! (STRUCTURAL CONCERNS)";
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
      title: "ERROR 001: SANDWICH EVEDE ALIYA?",
      description: "Plate kaali aaanu makkale! Oru sandwich airframe undaakkiyittu bite simulate cheyyu.",
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
      description: "Ente ponno! Anti-bread kandupidicho? Physics laws motham thetti poyi aliya.",
      level: "critical",
      icon: "⚛️"
    });
  }

  if (hasZero) {
    warnings.push({
      type: "ERROR_002",
      title: "ERROR 002: ZERO-THICKNESS INGREDIENT!",
      description: "Ithu quantum lettuce aano? Kannaal kaanaatha layer vachu bite optimize cheyyaan pattilla.",
      level: "critical",
      icon: "🔬"
    });
  }

  // Compositional Warnings in Malayalam Slang
  if (percentages.Bread > 50) {
    warnings.push({
      type: "BREAD_DOMINANCE",
      title: "🚨 BREAD KOODIPPOYI ALIYA!",
      description: `Appam maathram thinnan aanengil bakeryil pokande? Bread (${percentages.Bread.toFixed(1)}% vs target 40%) koodi flavor motham theernnu. Structural overkill!`,
      level: "warning",
      icon: "🍞"
    });
  }

  const hasTomato = layers.some(l => l.name.toLowerCase().includes('tomato'));
  if (percentages.Tomato > 25 || (percentages.Vegetable > 35 && hasTomato)) {
    warnings.push({
      type: "TOMATO_DOMINANCE",
      title: "🍅 THAKKALI DURANTHAM DETECTED!",
      description: "Thakkali koodi! Aadyathe kadikku thanne thakkali chaadi pokum! Wet boundary layer slippery scene.",
      level: "warning",
      icon: "🍅"
    });
  }

  if (percentages.Sauce > 15) {
    warnings.push({
      type: "SAUCE_FLOOD",
      title: "🌊 SAUCE VELLAPPOKKAM ALERT!",
      description: `Chaaru ozhuki kuppayam motham theerum! Fluid load (${percentages.Sauce.toFixed(1)}%) exceeds hydrodynamic threshold. Lateral squirt guaranteed!`,
      level: "critical",
      icon: "🌊"
    });
  }

  if (percentages.Vegetable < 5) {
    warnings.push({
      type: "VEGETABLE_DEFICIENCY",
      title: "🥬 ORU PACHA POLUM ILLA!",
      description: "Vegetational contribution dangerously low. Oru kashnam ilayengilum vende aliya crispiness kittaan?",
      level: "warning",
      icon: "🥬"
    });
  }

  if (percentages.Protein < 10) {
    warnings.push({
      type: "PROTEIN_UNDERLOAD",
      title: "🥩 MEAT EVEDE MAKKOLE?",
      description: "Primary load-bearing meat component missing! Caloric thrust illaathe bite survive aavilla.",
      level: "warning",
      icon: "🥩"
    });
  }

  if (totalThickness > 100) {
    warnings.push({
      type: "EXCESSIVE_THICKNESS",
      title: "📏 VAA ADAYOOLA! (EXCESSIVE THICKNESS)",
      description: `Sandwich katti (${totalThickness} mm) koodi vaayil kollilla! Mandible dislocation hazard. Jaw lock aayi hospitalil pokenda varum.`,
      level: "critical",
      icon: "⚠️"
    });
  } else if (totalThickness < 15 && totalThickness > 0) {
    warnings.push({
      type: "UNDERSIZED_AIRFRAME",
      title: "⚠️ ITHU ENTHOOTTU APPATHUND?",
      description: `Kunjikkalipetti pole oru sandwich (${totalThickness} mm). Ithu sandwich aano atho Marie biscuit aano aliya?`,
      level: "warning",
      icon: "🤏"
    });
  }

  // Bite Stall Detection in Malayalam Slang
  if (angle > 35) {
    warnings.push({
      type: "BITE_STALL",
      title: "🔴 BITE STALL / CHORA SCENE!",
      description: "Angle of attack koodi poyi aliya (critical stall threshold 35°)!\n• Lettuce separation: HIGH (Chadippokum)\n• Tomato escape: MODERATE (Vazhuthi pokum)\n• Overall bite stability: FULL DURANTHAM",
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
