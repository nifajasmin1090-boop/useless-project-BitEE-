/**
 * OPTIMAL BITE CALCULATOR - Engineering Report & Official Bite Certificate Generator
 */

export function generateSerialNumber() {
  const hex = Math.floor(1000 + Math.random() * 9000);
  return `OB-2026-${hex}`;
}

/**
 * Builds formatted ASCII engineering report
 */
export function generateEngineeringReport(analysis, sandwichName = "Custom Airframe", isAerodynamic = false) {
  const date = new Date().toISOString().replace('T', ' ').substring(0, 19) + " UTC";
  const serial = generateSerialNumber();
  const angleLabel = isAerodynamic ? "Angle of Attack" : "Optimal Bite Angle";
  const nameLabel = isAerodynamic ? "Flavor Airframe" : "Sandwich";

  return `
========================================================================
             BitEe: ADVANCED SANDWICH OPTIMIZATION SYSTEM (v2.6)
                        USELESS ENGINEERING DIVISION
========================================================================
SERIAL NO:          ${serial}
TIMESTAMP:          ${date}
CONFIGURATION:      ${sandwichName} (${nameLabel})
STATUS:             SYSTEM VERIFIED / TELEMETRY ACQUIRED
------------------------------------------------------------------------
[ PHYSICAL AIRFRAME SPECIFICATIONS ]
Total Thickness:    ${analysis.totalThickness} mm
Active Layers:      ${analysis.layers.length} components
Center of Flavor:   ${analysis.centerOfFlavor}% relative to apex
Fluid Load:         ${analysis.categoryPercentages.Sauce.toFixed(1)}% (${analysis.categoryThicknesses.Sauce} mm)
Structural Core:    ${analysis.categoryPercentages.Protein.toFixed(1)}% (${analysis.categoryThicknesses.Protein} mm)

[ AERODYNAMIC & BITE METRICS ]
Bite Efficiency:    ${analysis.efficiency.score}% [${analysis.efficiency.rating}]
${angleLabel}:      ${analysis.biteAngle}°
Flavor Lift:        ${analysis.flavorLift} FL (Flavor Lift Units)
Structural Risk:    ${analysis.isStalled ? "BITE STALL HAZARD (CRITICAL)" : "AERODYNAMICALLY STABLE"}
Flavor Distribution: ${analysis.totalError < 15 ? "OPTIMAL HARMONY" : analysis.totalError < 30 ? "ACCEPTABLE" : "IMBALANCED"}

[ SYSTEM DIAGNOSTICS & WARNINGS ]
${analysis.warnings.map(w => `• [${w.level.toUpperCase()}] ${w.title}: ${w.description.replace(/\n/g, ' ')}`).join('\n')}

------------------------------------------------------------------------
RECOMMENDED ACTION:  ${analysis.efficiency.score >= 50 ? (isAerodynamic ? "CLEARED FOR FLAVOR INTAKE" : "PROCEED WITH BITE") : "RECALIBRATE FLAVOR AIRFRAME"}
CERTIFICATION:       ${analysis.efficiency.score >= 50 ? "APPROVED FOR FLAVOR INTAKE" : "CONDITIONAL REJECTION"}
INSPECTOR:           Chief Bite Architect, Useless Engineering Division
========================================================================
  "Engineering the perfect bite, because apparently eating a sandwich
                     wasn't complicated enough."
========================================================================
  `.trim();
}

/**
 * Draws the high-resolution certificate on an HTML5 canvas and triggers download
 */
export function downloadCertificateCanvas(analysis, sandwichName = "Custom Airframe") {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  // Background Dark Navy Blueprint
  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer Border Double Gold / Cyan Frame
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);

  // Corner Ornaments
  const drawCorner = (x, y, flipX, flipY) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX, flipY);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.lineTo(0, 0);
    ctx.lineTo(30, 0);
    ctx.stroke();
    ctx.restore();
  };
  drawCorner(55, 55, 1, 1);
  drawCorner(canvas.width - 55, 55, -1, 1);
  drawCorner(55, canvas.height - 55, 1, -1);
  drawCorner(canvas.width - 55, canvas.height - 55, -1, -1);

  // Watermark Seal in Background
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Header Subtitle
  ctx.textAlign = 'center';
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = '#06b6d4';
  ctx.letterSpacing = '4px';
  ctx.fillText('USELESS ENGINEERING DIVISION • DEPARTMENT OF GASTRONOMIC AERODYNAMICS', canvas.width / 2, 105);

  // Certificate Title
  ctx.font = 'bold 44px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('🏆 OFFICIAL BITE CERTIFICATE', canvas.width / 2, 165);

  // Subtitle
  ctx.font = 'italic 18px Georgia, serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('This certifies that the flavor airframe configuration', canvas.width / 2, 215);

  // Sandwich Name Banner
  ctx.font = 'bold 36px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`“${sandwichName.toUpperCase()}”`, canvas.width / 2, 275);

  // Body Text
  ctx.font = '16px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('has been rigorously simulated and calibrated by the BitEe Engine,', canvas.width / 2, 325);
  ctx.fillText('satisfying all fictional parameters of flavor trajectory, lift, and aerodynamic stability.', canvas.width / 2, 355);

  // Metrics Display Grid Cards
  const cardY = 405;
  const cardW = 240;
  const cardH = 105;
  const cardGap = 35;
  const startX = (canvas.width - (cardW * 3 + cardGap * 2)) / 2;

  const metrics = [
    { label: 'BITE EFFICIENCY', val: `${analysis.efficiency.score}%`, sub: analysis.efficiency.rating, color: '#10b981' },
    { label: 'ANGLE OF ATTACK', val: `${analysis.biteAngle}°`, sub: 'RECOMMENDED ENTRY', color: '#06b6d4' },
    { label: 'FLAVOR LIFT', val: `${analysis.flavorLift} FL`, sub: 'THEORETICAL THRUST', color: '#f59e0b' }
  ];

  metrics.forEach((m, idx) => {
    const cx = startX + idx * (cardW + cardGap);
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx, cardY, cardW, cardH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(m.label, cx + cardW / 2, cardY + 28);

    ctx.font = 'bold 32px monospace';
    ctx.fillStyle = m.color;
    ctx.fillText(m.val, cx + cardW / 2, cardY + 68);

    ctx.font = 'bold 10px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(m.sub, cx + cardW / 2, cardY + 92);
  });

  // Stamp: APPROVED FOR CONSUMPTION
  ctx.save();
  ctx.translate(canvas.width / 2, 595);
  ctx.rotate(-0.06);

  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.strokeRect(-180, -26, 360, 52);

  ctx.font = 'bold 22px monospace';
  ctx.fillStyle = '#10b981';
  ctx.textAlign = 'center';
  ctx.fillText('APPROVED FOR CONSUMPTION', 0, 8);
  ctx.restore();

  // Footer Signatures & Serial
  const serial = generateSerialNumber();
  ctx.textAlign = 'left';
  ctx.font = '12px monospace';
  ctx.fillStyle = '#64748b';
  ctx.fillText(`SERIAL NO: ${serial}`, 80, 715);
  ctx.fillText(`VERIFIED: ${new Date().toLocaleDateString()}`, 80, 735);

  ctx.textAlign = 'right';
  ctx.fillText('CERTIFIED BY: Useless Engineering Division', canvas.width - 80, 715);
  ctx.fillText('CHIEF GASTRONOMIC ARCHITECT: 🍔 Certified', canvas.width - 80, 735);

  // Trigger Download
  const link = document.createElement('a');
  link.download = `Bite-Certificate-${serial}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Copies share text to clipboard
 */
export async function copyShareResult(analysis, sandwichName = "Custom Airframe", isAerodynamic = false) {
  const angleLabel = isAerodynamic ? "Angle of Attack" : "Bite Angle";
  const shareText = `I achieved ${analysis.efficiency.score}% Bite Efficiency with a ${analysis.biteAngle}° ${angleLabel} on my "${sandwichName}". My sandwich is officially flavor-optimized! 🍔✈️📐\n\nTry BitEe (The Optimal Bite Calculator): Engineering the perfect bite because eating wasn't complicated enough!`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "BitEe - Optimal Bite Calculator Result",
        text: shareText
      });
      return true;
    } catch (e) {
      // fallback to clipboard
    }
  }

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(shareText);
    return true;
  }
  return false;
}
