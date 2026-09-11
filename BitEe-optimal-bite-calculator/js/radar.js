/**
 * OPTIMAL BITE CALCULATOR - 5-Axis Flavor Balance Radar Chart (SVG)
 * Compares Actual Category % against Ideal Category %
 */

import { IDEAL_RATIOS } from './calculator.js';

export class FlavorRadarChart {
  constructor(svgElement) {
    this.svg = svgElement;
    this.categories = ['Bread', 'Protein', 'Vegetable', 'Cheese', 'Sauce'];
    this.axisLabels = {
      Bread: 'Bread 🍞',
      Protein: 'Protein 🥩',
      Vegetable: 'Veg 🥬',
      Cheese: 'Cheese 🧀',
      Sauce: 'Sauce 🥫'
    };
  }

  render(percentages) {
    if (!this.svg) return;
    this.svg.innerHTML = '';

    const width = 340;
    const height = 300;
    const cx = width / 2;
    const cy = height / 2 + 5;
    const radius = 95;

    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Concentric grid circles / pentagons (10%, 20%, 30%, 40%, 50%)
    const rings = [0.2, 0.4, 0.6, 0.8, 1.0];
    const ringGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    ringGroup.setAttribute('class', 'radar-rings');

    rings.forEach((scale, idx) => {
      const pts = [];
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius * scale;
        const y = cy + Math.sin(angle) * radius * scale;
        pts.push(`${x},${y}`);
      }
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', pts.join(' '));
      polygon.setAttribute('fill', idx === rings.length - 1 ? 'rgba(15, 23, 42, 0.6)' : 'none');
      polygon.setAttribute('stroke', '#334155');
      polygon.setAttribute('stroke-width', '1');
      polygon.setAttribute('stroke-dasharray', idx === rings.length - 1 ? 'none' : '2 2');
      ringGroup.appendChild(polygon);

      // Percentage tick label on top axis
      const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      labelText.setAttribute('x', cx + 4);
      labelText.setAttribute('y', cy - radius * scale + 10);
      labelText.setAttribute('fill', '#64748b');
      labelText.setAttribute('font-size', '8');
      labelText.setAttribute('font-family', 'monospace');
      labelText.textContent = `${Math.round(scale * 50)}%`;
      ringGroup.appendChild(labelText);
    });

    g.appendChild(ringGroup);

    // Spoke axes & category labels
    const axesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    axesGroup.setAttribute('class', 'radar-axes');

    this.categories.forEach((cat, i) => {
      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      // Axis spoke
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', cx);
      line.setAttribute('y1', cy);
      line.setAttribute('x2', x);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', '#475569');
      line.setAttribute('stroke-width', '1');
      axesGroup.appendChild(line);

      // Label at end of spoke
      const labelDist = radius + 22;
      const lx = cx + Math.cos(angle) * labelDist;
      const ly = cy + Math.sin(angle) * labelDist;

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', lx);
      label.setAttribute('y', ly + 4);
      label.setAttribute('fill', '#94a3b8');
      label.setAttribute('font-size', '10');
      label.setAttribute('font-family', 'Space Grotesk, sans-serif');
      label.setAttribute('font-weight', 'bold');
      label.setAttribute('text-anchor', Math.abs(Math.cos(angle)) < 0.2 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end');
      label.textContent = this.axisLabels[cat];
      axesGroup.appendChild(label);
    });

    g.appendChild(axesGroup);

    // Max scale capped at 50% for radar
    const maxVal = 50;

    // Ideal Polygon (Cyan dashed)
    const idealPts = [];
    this.categories.forEach((cat, i) => {
      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
      const val = IDEAL_RATIOS[cat] || 0;
      const ratio = Math.min(1.1, val / maxVal);
      const x = cx + Math.cos(angle) * radius * ratio;
      const y = cy + Math.sin(angle) * radius * ratio;
      idealPts.push(`${x},${y}`);
    });

    const idealPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    idealPoly.setAttribute('points', idealPts.join(' '));
    idealPoly.setAttribute('fill', 'rgba(6, 182, 212, 0.08)');
    idealPoly.setAttribute('stroke', '#06b6d4');
    idealPoly.setAttribute('stroke-width', '1.5');
    idealPoly.setAttribute('stroke-dasharray', '4 3');
    g.appendChild(idealPoly);

    // Actual Polygon (Emerald/Amber/Crimson filled with glowing markers)
    const actualPts = [];
    this.categories.forEach((cat, i) => {
      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
      const val = percentages ? (percentages[cat] || 0) : 0;
      const ratio = Math.min(1.15, val / maxVal);
      const x = cx + Math.cos(angle) * radius * ratio;
      const y = cy + Math.sin(angle) * radius * ratio;
      actualPts.push(`${x},${y}`);
    });

    const actualPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    actualPoly.setAttribute('points', actualPts.join(' '));
    actualPoly.setAttribute('fill', 'rgba(16, 185, 129, 0.3)');
    actualPoly.setAttribute('stroke', '#10b981');
    actualPoly.setAttribute('stroke-width', '2');
    actualPoly.setAttribute('class', 'transition-all duration-500');
    g.appendChild(actualPoly);

    // Actual Data points (Circles)
    this.categories.forEach((cat, i) => {
      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
      const val = percentages ? (percentages[cat] || 0) : 0;
      const ratio = Math.min(1.15, val / maxVal);
      const x = cx + Math.cos(angle) * radius * ratio;
      const y = cy + Math.sin(angle) * radius * ratio;

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', '#10b981');
      circle.setAttribute('stroke', '#064e3b');
      circle.setAttribute('stroke-width', '1.5');
      g.appendChild(circle);
    });

    this.svg.appendChild(g);
  }
}
