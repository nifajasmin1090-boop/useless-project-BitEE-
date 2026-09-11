/**
 * OPTIMAL BITE CALCULATOR - Dynamic SVG Sandwich Visualizer
 * Renders proportional cross-section, trajectory vector, and targeting crosshairs.
 */

export class SandwichVisualizer {
  constructor(svgElement, options = {}) {
    this.svg = svgElement;
    this.isAerodynamic = options.isAerodynamic || false;
    this.currentAngle = 15;
  }

  setAerodynamicMode(enabled) {
    this.isAerodynamic = enabled;
  }

  /**
   * Main render function
   * @param {Object} analysis Result from calculator.analyzeSandwich
   */
  render(analysis) {
    if (!this.svg) return;
    const { layers, totalThickness, biteAngle, centerOfFlavor } = analysis;

    this.currentAngle = biteAngle || 15;
    this.svg.innerHTML = ''; // Clear canvas

    if (!layers || layers.length === 0 || totalThickness <= 0) {
      this.renderEmptyState();
      return;
    }

    const width = 640;
    const height = 480;
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // SVG Defs: Gradients, Patterns, and Drop Shadows
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <!-- Bun Gradient -->
      <linearGradient id="bunTopGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="50%" stop-color="#d97706" />
        <stop offset="100%" stop-color="#b45309" />
      </linearGradient>
      <linearGradient id="bunBotGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#b45309" />
        <stop offset="80%" stop-color="#d97706" />
        <stop offset="100%" stop-color="#f59e0b" />
      </linearGradient>

      <!-- Patty Texture -->
      <linearGradient id="pattyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#451a03" />
        <stop offset="50%" stop-color="#542407" />
        <stop offset="100%" stop-color="#2c0f02" />
      </linearGradient>

      <!-- Cheese Gradient -->
      <linearGradient id="cheeseGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#fbbf24" />
        <stop offset="50%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#fbbf24" />
      </linearGradient>

      <!-- Tomato Gradient -->
      <linearGradient id="tomatoGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ef4444" />
        <stop offset="60%" stop-color="#dc2626" />
        <stop offset="100%" stop-color="#b91c1c" />
      </linearGradient>

      <!-- Lettuce Gradient -->
      <linearGradient id="lettuceGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#22c55e" />
        <stop offset="100%" stop-color="#15803d" />
      </linearGradient>

      <!-- Sauce Gradient -->
      <linearGradient id="sauceGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#f97316" />
        <stop offset="50%" stop-color="#ea580c" />
        <stop offset="100%" stop-color="#c2410c" />
      </linearGradient>

      <!-- Filter Glow for Crosshairs -->
      <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <!-- Trajectory Arrow Marker -->
      <marker id="trajectoryArrow" viewBox="0 0 10 10" refX="6" refY="5"
              markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
      </marker>
    `;
    this.svg.appendChild(defs);

    // Group for background telemetry grid
    const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gridGroup.setAttribute('class', 'telemetry-grid opacity-20');
    gridGroup.innerHTML = `
      <line x1="50" y1="40" x2="590" y2="40" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 4" />
      <line x1="50" y1="440" x2="590" y2="440" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 4" />
      <line x1="200" y1="30" x2="200" y2="450" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 4" />
      <line x1="440" y1="30" x2="440" y2="450" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 4" />
    `;
    this.svg.appendChild(gridGroup);

    // Dynamic vertical layout scaling
    // We allocate 280px of vertical space for the sandwich layers
    const availableHeight = 270;
    const sandwichWidth = 240;
    const startX = 130;
    const startY = 95;

    // Minimum visual height per layer is 7px for visibility, scaled proportionally
    const minHeightPerLayer = 8;
    const scaleFactor = Math.min(6, Math.max(1.8, (availableHeight - layers.length * minHeightPerLayer) / totalThickness));
    
    // Calculate display heights
    const layerDisplayHeights = layers.map(layer => {
      const th = Math.max(1, parseFloat(layer.thickness) || 1);
      return Math.max(minHeightPerLayer, th * scaleFactor);
    });

    const totalRenderedHeight = layerDisplayHeights.reduce((a, b) => a + b, 0);
    const offsetY = startY + Math.max(0, (availableHeight - totalRenderedHeight) / 2);

    // Create Main Sandwich Layers Container
    const sandwichGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    sandwichGroup.setAttribute('id', 'sandwichLayersGroup');

    let currentY = offsetY;

    layers.forEach((layer, index) => {
      const lHeight = layerDisplayHeights[index];
      const isTop = index === 0;
      const isBottom = index === layers.length - 1;
      const category = layer.category;

      const layerG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      layerG.setAttribute('class', 'sandwich-layer-rect transition-all duration-300');

      let layerPathOrRect = '';

      if (category === 'Bread') {
        if (isTop) {
          // Rounded top bun with sesame seeds
          layerPathOrRect = `
            <path d="M ${startX} ${currentY + lHeight} 
                     C ${startX} ${currentY - 10}, ${startX + sandwichWidth} ${currentY - 10}, ${startX + sandwichWidth} ${currentY + lHeight} Z" 
                  fill="url(#bunTopGrad)" stroke="#92400e" stroke-width="2" />
            <!-- Sesame seeds -->
            <ellipse cx="${startX + 60}" cy="${currentY + lHeight * 0.3}" rx="3" ry="1.5" fill="#fef3c7" transform="rotate(-15 ${startX + 60} ${currentY + lHeight * 0.3})" />
            <ellipse cx="${startX + 120}" cy="${currentY + lHeight * 0.2}" rx="3" ry="1.5" fill="#fef3c7" transform="rotate(5 ${startX + 120} ${currentY + lHeight * 0.2})" />
            <ellipse cx="${startX + 180}" cy="${currentY + lHeight * 0.35}" rx="3" ry="1.5" fill="#fef3c7" transform="rotate(20 ${startX + 180} ${currentY + lHeight * 0.35})" />
            <ellipse cx="${startX + 90}" cy="${currentY + lHeight * 0.5}" rx="3" ry="1.5" fill="#fef3c7" />
            <ellipse cx="${startX + 150}" cy="${currentY + lHeight * 0.55}" rx="3" ry="1.5" fill="#fef3c7" transform="rotate(-10 ${startX + 150} ${currentY + lHeight * 0.55})" />
          `;
        } else if (isBottom) {
          // Rounded bottom bun
          layerPathOrRect = `
            <rect x="${startX}" y="${currentY}" width="${sandwichWidth}" height="${lHeight}" rx="8" fill="url(#bunBotGrad)" stroke="#92400e" stroke-width="2" />
          `;
        } else {
          // Middle bread deck
          layerPathOrRect = `
            <rect x="${startX}" y="${currentY}" width="${sandwichWidth}" height="${lHeight}" rx="4" fill="url(#bunTopGrad)" stroke="#92400e" stroke-width="1.5" />
          `;
        }
      } else if (category === 'Vegetable') {
        const isTomato = layer.name.toLowerCase().includes('tomato');
        if (isTomato) {
          // Tomato with slice compartments
          layerPathOrRect = `
            <rect x="${startX + 8}" y="${currentY}" width="${sandwichWidth - 16}" height="${lHeight}" rx="4" fill="url(#tomatoGrad)" stroke="#991b1b" stroke-width="1.5" />
            <ellipse cx="${startX + 60}" cy="${currentY + lHeight / 2}" rx="14" ry="${Math.min(6, lHeight / 3)}" fill="#7f1d1d" opacity="0.6" />
            <ellipse cx="${startX + 120}" cy="${currentY + lHeight / 2}" rx="16" ry="${Math.min(6, lHeight / 3)}" fill="#7f1d1d" opacity="0.6" />
            <ellipse cx="${startX + 180}" cy="${currentY + lHeight / 2}" rx="14" ry="${Math.min(6, lHeight / 3)}" fill="#7f1d1d" opacity="0.6" />
            <circle cx="${startX + 60}" cy="${currentY + lHeight / 2}" r="1.5" fill="#fef08a" />
            <circle cx="${startX + 120}" cy="${currentY + lHeight / 2}" r="1.5" fill="#fef08a" />
            <circle cx="${startX + 180}" cy="${currentY + lHeight / 2}" r="1.5" fill="#fef08a" />
          `;
        } else {
          // Lettuce leaf with wavy rippled edge
          const pts = [];
          const segments = 12;
          const segW = (sandwichWidth + 24) / segments;
          for (let i = 0; i <= segments; i++) {
            const x = (startX - 12) + i * segW;
            const wave = (i % 2 === 0) ? -2 : 3;
            pts.push(`${x},${currentY + wave}`);
          }
          for (let i = segments; i >= 0; i--) {
            const x = (startX - 12) + i * segW;
            const wave = (i % 2 === 0) ? 2 : -2;
            pts.push(`${x},${currentY + lHeight + wave}`);
          }
          layerPathOrRect = `
            <polygon points="${pts.join(' ')}" fill="url(#lettuceGrad)" stroke="#166534" stroke-width="1.5" />
          `;
        }
      } else if (category === 'Protein') {
        // Patty with grill marks
        layerPathOrRect = `
          <rect x="${startX - 4}" y="${currentY}" width="${sandwichWidth + 8}" height="${lHeight}" rx="6" fill="url(#pattyGrad)" stroke="#1c0a02" stroke-width="2" />
          <line x1="${startX + 30}" y1="${currentY + 2}" x2="${startX + 50}" y2="${currentY + lHeight - 2}" stroke="#170601" stroke-width="3" stroke-linecap="round" />
          <line x1="${startX + 90}" y1="${currentY + 2}" x2="${startX + 110}" y2="${currentY + lHeight - 2}" stroke="#170601" stroke-width="3" stroke-linecap="round" />
          <line x1="${startX + 150}" y1="${currentY + 2}" x2="${startX + 170}" y2="${currentY + lHeight - 2}" stroke="#170601" stroke-width="3" stroke-linecap="round" />
          <line x1="${startX + 200}" y1="${currentY + 2}" x2="${startX + 220}" y2="${currentY + lHeight - 2}" stroke="#170601" stroke-width="3" stroke-linecap="round" />
        `;
      } else if (category === 'Cheese') {
        // Cheese with dripping points
        layerPathOrRect = `
          <rect x="${startX - 6}" y="${currentY}" width="${sandwichWidth + 12}" height="${lHeight}" rx="3" fill="url(#cheeseGrad)" stroke="#b45309" stroke-width="1" />
          <path d="M ${startX + 40} ${currentY + lHeight} Q ${startX + 45} ${currentY + lHeight + 8} ${startX + 50} ${currentY + lHeight} Z" fill="#f59e0b" />
          <path d="M ${startX + 160} ${currentY + lHeight} Q ${startX + 166} ${currentY + lHeight + 10} ${startX + 172} ${currentY + lHeight} Z" fill="#f59e0b" />
        `;
      } else if (category === 'Sauce') {
        // Fluid sauce layer with wavy beads
        layerPathOrRect = `
          <rect x="${startX + 10}" y="${currentY}" width="${sandwichWidth - 20}" height="${lHeight}" rx="4" fill="url(#sauceGrad)" opacity="0.95" />
          <circle cx="${startX + 30}" cy="${currentY + lHeight / 2}" r="${Math.min(5, lHeight / 2)}" fill="#ea580c" />
          <circle cx="${startX + 210}" cy="${currentY + lHeight / 2}" r="${Math.min(5, lHeight / 2)}" fill="#ea580c" />
        `;
      } else {
        // Generic / Other category
        layerPathOrRect = `
          <rect x="${startX}" y="${currentY}" width="${sandwichWidth}" height="${lHeight}" rx="4" fill="#8b5cf6" stroke="#6d28d9" stroke-width="1.5" />
        `;
      }

      // Layer annotation line & label on the right
      const labelY = currentY + lHeight / 2;
      const annotationX = startX + sandwichWidth + 16;
      const labelText = `
        <g class="layer-callout" opacity="0.9">
          <line x1="${startX + sandwichWidth + 2}" y1="${labelY}" x2="${annotationX + 15}" y2="${labelY}" stroke="#475569" stroke-width="1" stroke-dasharray="2 2" />
          <circle cx="${startX + sandwichWidth + 2}" cy="${labelY}" r="2.5" fill="#38bdf8" />
          <text x="${annotationX + 20}" y="${labelY + 4}" font-family="Space Grotesk, Inter, sans-serif" font-size="11" fill="#cbd5e1" font-weight="500">
            ${layer.icon || '▫️'} ${layer.name} <tspan fill="#38bdf8" font-family="monospace">(${layer.thickness}mm)</tspan>
          </text>
        </g>
      `;

      layerG.innerHTML = layerPathOrRect + labelText;
      sandwichGroup.appendChild(layerG);

      currentY += lHeight;
    });

    this.svg.appendChild(sandwichGroup);

    // Left Measurement Caliper (Total Height in mm)
    const caliperX = startX - 35;
    const caliperGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    caliperGroup.setAttribute('class', 'measurement-caliper');
    caliperGroup.innerHTML = `
      <!-- Top caliper tick -->
      <line x1="${caliperX - 10}" y1="${offsetY}" x2="${caliperX + 15}" y2="${offsetY}" stroke="#38bdf8" stroke-width="1.5" />
      <!-- Bottom caliper tick -->
      <line x1="${caliperX - 10}" y1="${offsetY + totalRenderedHeight}" x2="${caliperX + 15}" y2="${offsetY + totalRenderedHeight}" stroke="#38bdf8" stroke-width="1.5" />
      <!-- Vertical caliper dimension line -->
      <line x1="${caliperX}" y1="${offsetY}" x2="${caliperX}" y2="${offsetY + totalRenderedHeight}" stroke="#38bdf8" stroke-width="1.5" />
      <!-- Dimension badge -->
      <rect x="${caliperX - 48}" y="${offsetY + totalRenderedHeight / 2 - 13}" width="42" height="24" rx="4" fill="#0f172a" stroke="#0284c7" stroke-width="1" />
      <text x="${caliperX - 27}" y="${offsetY + totalRenderedHeight / 2 + 3}" fill="#38bdf8" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">
        ${totalThickness}mm
      </text>
    `;
    this.svg.appendChild(caliperGroup);

    // Optimal Bite Trajectory Line & Angle Vector
    this.renderTrajectory(startX, sandwichWidth, offsetY, totalRenderedHeight, biteAngle, centerOfFlavor);
  }

  /**
   * Renders the rotated trajectory line and crosshair target
   */
  renderTrajectory(startX, sandwichWidth, offsetY, totalHeight, angle, centerOfFlavor) {
    const trajectoryGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    trajectoryGroup.setAttribute('id', 'trajectoryVectorGroup');

    // Calculate pivot point on entry edge (left side of sandwich)
    // Vertical entry position correlates with center of flavor
    const entryY = offsetY + (totalHeight * (centerOfFlavor / 100));
    const entryX = startX - 8;

    // Vector line length
    const lineLength = 340;
    const rad = (angle * Math.PI) / 180;
    
    // Trajectory vector heading down into the burger from upper-left
    const x1 = entryX - Math.cos(rad) * 110;
    const y1 = entryY - Math.sin(rad) * 110;
    const x2 = entryX + Math.cos(rad) * (lineLength - 110);
    const y2 = entryY + Math.sin(rad) * (lineLength - 110);

    const trajectoryLabel = this.isAerodynamic ? "ANGLE OF ATTACK VECTOR" : "BITE TRAJECTORY";
    const entryLabel = this.isAerodynamic ? "STAGNATION POINT" : "OPTIMAL ENTRY POINT";

    trajectoryGroup.innerHTML = `
      <!-- Rotated Trajectory Guideline -->
      <g id="animatedTrajectoryLine" class="transition-transform duration-500 origin-[${entryX}px_${entryY}px]">
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
              stroke="#06b6d4" stroke-width="3" stroke-dasharray="6 4" 
              marker-end="url(#trajectoryArrow)" filter="url(#neonGlow)" />

        <!-- Angle Arc Indicator -->
        <path d="M ${entryX - 60} ${entryY} A 60 60 0 0 1 ${entryX - 60 * Math.cos(rad)} ${entryY - 60 * Math.sin(rad)}" 
              fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="2 2" />
        <text x="${entryX - 75}" y="${entryY - 14}" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold">
          ${angle}°
        </text>

        <!-- Vector Floating Label -->
        <g transform="translate(${x2 - 10}, ${y2 - 12})">
          <rect x="-10" y="-14" width="165" height="22" rx="4" fill="#0369a1" opacity="0.9" />
          <text x="72" y="1" fill="#e0f2fe" font-family="Space Grotesk, Inter, sans-serif" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="0.05em">
            ← ${trajectoryLabel}
          </text>
        </g>
      </g>

      <!-- Target Crosshair on Entry Point -->
      <g id="targetCrosshairGroup" transform="translate(${entryX}, ${entryY})" filter="url(#neonGlow)">
        <!-- Outer pulsating ring -->
        <circle cx="0" cy="0" r="16" fill="none" stroke="#22d3ee" stroke-width="1.5" class="animate-ping opacity-75" />
        <circle cx="0" cy="0" r="12" fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" stroke-width="1.5" />
        <circle cx="0" cy="0" r="3" fill="#38bdf8" />
        
        <!-- Reticle Crosshair lines -->
        <line x1="-16" y1="0" x2="-6" y2="0" stroke="#38bdf8" stroke-width="1.5" />
        <line x1="6" y1="0" x2="16" y2="0" stroke="#38bdf8" stroke-width="1.5" />
        <line x1="0" y1="-16" x2="0" y2="-6" stroke="#38bdf8" stroke-width="1.5" />
        <line x1="0" y1="6" x2="0" y2="16" stroke="#38bdf8" stroke-width="1.5" />

        <!-- Target Locked Badge -->
        <g transform="translate(20, -18)">
          <rect x="0" y="0" width="130" height="20" rx="4" fill="#0f172a" stroke="#22d3ee" stroke-width="1" />
          <circle cx="10" cy="10" r="3" fill="#10b981" />
          <text x="20" y="14" fill="#22d3ee" font-family="Space Grotesk, monospace" font-size="9" font-weight="bold" letter-spacing="0.05em">
            TARGET LOCKED [${angle}°]
          </text>
        </g>

        <!-- Entry Point Subtitle -->
        <text x="22" y="15" fill="#94a3b8" font-family="Space Grotesk, sans-serif" font-size="9">
          ${entryLabel}
        </text>
      </g>
    `;

    this.svg.appendChild(trajectoryGroup);
  }

  /**
   * Renders empty blueprint plate state
   */
  renderEmptyState() {
    const width = 640;
    const height = 480;
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const emptyGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    emptyGroup.setAttribute('class', 'empty-plate-group');
    emptyGroup.innerHTML = `
      <!-- Technical Grid Background -->
      <rect x="20" y="20" width="600" height="440" rx="8" fill="none" stroke="#1e293b" stroke-width="2" stroke-dasharray="6 6" />
      
      <!-- Empty Blueprint Plate -->
      <ellipse cx="320" cy="270" rx="180" ry="70" fill="#0f172a" stroke="#334155" stroke-width="3" />
      <ellipse cx="320" cy="270" rx="140" ry="50" fill="none" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6" />
      
      <!-- Crosshairs on empty plate -->
      <line x1="320" y1="210" x2="320" y2="330" stroke="#0ea5e9" stroke-width="1" stroke-dasharray="2 2" opacity="0.4" />
      <line x1="170" y1="270" x2="470" y2="270" stroke="#0ea5e9" stroke-width="1" stroke-dasharray="2 2" opacity="0.4" />

      <!-- Fork & Knife Icons in Blueprint style -->
      <text x="100" y="280" font-size="36" opacity="0.3">🍴</text>
      <text x="500" y="280" font-size="36" opacity="0.3">📐</text>

      <!-- Status Text -->
      <text x="320" y="150" fill="#ef4444" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle" letter-spacing="0.1em">
        [ SYSTEM WARNING: NO INGREDIENT MASS DETECTED ]
      </text>
      <text x="320" y="180" fill="#f8fafc" font-family="Space Grotesk, sans-serif" font-size="20" font-weight="bold" text-anchor="middle">
        YOUR FLAVOR AIRFRAME IS EMPTY
      </text>
      <text x="320" y="380" fill="#94a3b8" font-family="Space Grotesk, sans-serif" font-size="13" text-anchor="middle">
        Select a preset or add structural layers to initiate aerodynamics calculation.
      </text>
    `;
    this.svg.appendChild(emptyGroup);
  }
}
