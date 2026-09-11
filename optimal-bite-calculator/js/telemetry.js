/**
 * OPTIMAL BITE CALCULATOR - Hackathon Demo Mode & Unnecessary Analysis Telemetry
 */

import { sound } from './audio.js';

export const UNNECESSARY_METRICS_POOL = [
  { label: "Cheese Alignment (Ozhukkal)", format: (v) => `${v}%`, range: [78, 99], status: "SET SAANAM" },
  { label: "Tomato Escape (Thakkali Chattam)", format: (v) => `${v}%`, range: [8, 88], status: (v) => v > 50 ? "CHAADI POKUM" : "STABLE" },
  { label: "Lettuce Cooperation (Koottukettu)", format: (v) => v > 60 ? "COOPERATIVE (OK)" : v > 30 ? "RELUCTANT" : "KALYANAM KANJI", range: [10, 95] },
  { label: "Bread Structural (Appam Balam)", format: (v) => v > 80 ? "REINFORCED (PWOLI)" : "DEGRADED (POOF)", range: [40, 99] },
  { label: "Sauce Containment (Chaaru Control)", format: (v) => v > 65 ? "CONTAINED" : "QUESTIONABLE (VELLAPPOKKAM)", range: [15, 95] },
  { label: "Chew Reynolds Number (Re)", format: (v) => `${(v * 42.1).toFixed(1)} Re`, range: [12, 75], status: "TURBULENT" },
  { label: "Pickle Friction Coefficient (μ)", format: (v) => `0.${v}`, range: [12, 65], status: "LOW RESISTANCE" },
  { label: "Bacon Crisp Resonance (Hz)", format: (v) => `${v * 85} Hz`, range: [20, 60], status: "PWOLI SOUND" },
  { label: "Mayonnaise Surface Tension", format: (v) => `${(v * 0.8).toFixed(2)} mN/m`, range: [25, 80], status: "VISCOUS" },
  { label: "Zero-G Crumb Risk (Podi Paarel)", format: (v) => `${v}%`, range: [5, 95], status: (v) => v > 50 ? "SEVERE (PODIPARAKKUM)" : "SAFE" },
  { label: "Overall Sandwich Confidence", format: (v) => `${v}%`, range: [84, 99], status: "SCENE ILLA (PWOLI)" }
];

export function generateRandomAnalysis() {
  sound.calculate();
  const shuffled = [...UNNECESSARY_METRICS_POOL].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 6);

  return selected.map(metric => {
    const rawVal = Math.floor(Math.random() * (metric.range[1] - metric.range[0] + 1)) + metric.range[0];
    const displayVal = metric.format(rawVal);
    let statusText = typeof metric.status === 'function' ? metric.status(rawVal) : (metric.status || "OK");
    return {
      label: metric.label,
      value: displayVal,
      status: statusText
    };
  });
}

/**
 * Runs theatrical Hackathon Demo presentation sequence
 */
export async function runHackathonDemoSequence(onStepUpdate, onComplete) {
  const steps = [
    { text: "INITIALIZING FLAVOR ENGINE... [Engine choodaakkunnu]", progress: 15, delay: 600 },
    { text: "CALIBRATING BREAD CAMBER & MASS... [Bun balance test]", progress: 35, delay: 700 },
    { text: "MEASURING TOMATO BOUNDARY LAYER... [Thakkali slide inspection]", progress: 55, delay: 650 },
    { text: "ANALYZING SAUCE HYDRODYNAMICS... [Sauce ozhukku checking]", progress: 75, delay: 700 },
    { text: "CALCULATING BITE TRAJECTORY VECTORS... [Perfect kadi angle locking]", progress: 92, delay: 800 },
    { text: "OPTIMIZING ANGLE OF ATTACK... [Ente ponno! Kadichoo aliya!]", progress: 100, delay: 600 }
  ];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    sound.click();
    onStepUpdate(step.text, step.progress);
    await new Promise(res => setTimeout(res, step.delay));
  }

  sound.targetLock();
  onComplete();
}
