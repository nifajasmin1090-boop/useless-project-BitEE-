/**
 * OPTIMAL BITE CALCULATOR - Main Application Controller
 */

import { analyzeSandwich, IDEAL_RATIOS, TERMINOLOGY } from './calculator.js';
import { PRESET_SANDWICHES, QUICK_ADD_INGREDIENTS, INGREDIENT_ICONS, INGREDIENT_COLORS } from './presets.js';
import { SandwichVisualizer } from './visualizer.js';
import { FlavorRadarChart } from './radar.js';
import { runHackathonDemoSequence, generateRandomAnalysis } from './telemetry.js';
import { generateEngineeringReport, downloadCertificateCanvas, copyShareResult, generateSerialNumber } from './certificate.js';
import { sound } from './audio.js';

class App {
  constructor() {
    // Initial State
    this.layers = JSON.parse(JSON.stringify(PRESET_SANDWICHES.classic.layers));
    this.currentSandwichName = "Classic Burger";
    this.isAerodynamic = false;
    this.analysis = null;

    // Audio & Telemetry state tracking
    this.prevCategoryPercentages = null;
    this.prevWarningsCount = null;
    this.prevEfficiencyScore = null;
    this.isFirstLoad = true;

    // DOM Elements Cache
    this.dom = {
      // Audio & Mode Switches
      audioToggleBtn: document.getElementById('audioToggleBtn'),
      audioIcon: document.getElementById('audioIcon'),
      aeroModeSwitch: document.getElementById('aeroModeSwitch'),
      aeroSwitchThumb: document.getElementById('aeroSwitchThumb'),
      aeroBanner: document.getElementById('aeroBanner'),

      // Navigation
      mobileMenuBtn: document.getElementById('mobileMenuBtn'),
      mobileMenu: document.getElementById('mobileMenu'),

      // Dynamic UI text labels (Aerodynamic terminology)
      builderHeading: document.getElementById('builderHeading'),
      builderSubtitle: document.getElementById('builderSubtitle'),
      visualizerTitle: document.getElementById('visualizerTitle'),
      cardEfficiencyTitle: document.getElementById('cardEfficiencyTitle'),
      cardAngleTitle: document.getElementById('cardAngleTitle'),
      cardAngleSubtitle: document.getElementById('cardAngleSubtitle'),
      cardThicknessTitle: document.getElementById('cardThicknessTitle'),
      cardLiftTitle: document.getElementById('cardLiftTitle'),

      // Builder & Layers
      layersListContainer: document.getElementById('layersListContainer'),
      layerCountBadge: document.getElementById('layerCountBadge'),
      resetSandwichBtn: document.getElementById('resetSandwichBtn'),
      clearAllLayersBtn: document.getElementById('clearAllLayersBtn'),
      openAddModalBtn: document.getElementById('openAddModalBtn'),

      // Presets
      presetButtons: document.querySelectorAll('.preset-btn'),

      // Visualizer & Canvas
      sandwichSvg: document.getElementById('sandwichSvg'),
      calculatedAngleBadge: document.getElementById('calculatedAngleBadge'),
      trajectoryAngleCallout: document.getElementById('trajectoryAngleCallout'),
      centerOfFlavorCallout: document.getElementById('centerOfFlavorCallout'),

      // Results Display
      recalculateBtn: document.getElementById('recalculateBtn'),
      efficiencyScoreDisplay: document.getElementById('efficiencyScoreDisplay'),
      efficiencyRatingBadge: document.getElementById('efficiencyRatingBadge'),
      speakBiteBtn: document.getElementById('speakBiteBtn'),
      biteAngleDisplay: document.getElementById('biteAngleDisplay'),
      biteAngleRatingBadge: document.getElementById('biteAngleRatingBadge'),
      totalThicknessDisplay: document.getElementById('totalThicknessDisplay'),
      clearanceRatingBadge: document.getElementById('clearanceRatingBadge'),
      flavorLiftDisplay: document.getElementById('flavorLiftDisplay'),
      balanceRatingBadge: document.getElementById('balanceRatingBadge'),

      // Ratio & Radar
      ratioBarsContainer: document.getElementById('ratioBarsContainer'),
      totalErrorVarianceDisplay: document.getElementById('totalErrorVarianceDisplay'),
      radarSvg: document.getElementById('radarSvg'),

      // Warnings
      warningsSection: document.getElementById('warningsSection'),

      // Actions
      openReportBtn: document.getElementById('openReportBtn'),
      openCertificateBtn: document.getElementById('openCertificateBtn'),
      shareBiteBtn: document.getElementById('shareBiteBtn'),
      randomAnalysisBtn: document.getElementById('randomAnalysisBtn'),
      randomAnalysisPanel: document.getElementById('randomAnalysisPanel'),
      randomMetricsGrid: document.getElementById('randomMetricsGrid'),
      openDemoModeBtn: document.getElementById('openDemoModeBtn'),
      heroDemoModeBtn: document.getElementById('heroDemoModeBtn'),

      // Modals
      addLayerModal: document.getElementById('addLayerModal'),
      closeAddModalBtn: document.getElementById('closeAddModalBtn'),
      cancelAddModalBtn: document.getElementById('cancelAddModalBtn'),
      addLayerForm: document.getElementById('addLayerForm'),
      layerNameInput: document.getElementById('layerNameInput'),
      layerCategorySelect: document.getElementById('layerCategorySelect'),
      layerThicknessInput: document.getElementById('layerThicknessInput'),
      quickIngredientsContainer: document.getElementById('quickIngredientsContainer'),

      reportModal: document.getElementById('reportModal'),
      closeReportModalBtn: document.getElementById('closeReportModalBtn'),
      reportPre: document.getElementById('reportPre'),
      copyReportBtn: document.getElementById('copyReportBtn'),

      certificateModal: document.getElementById('certificateModal'),
      closeCertificateModalBtn: document.getElementById('closeCertificateModalBtn'),
      certSandwichName: document.getElementById('certSandwichName'),
      certEfficiency: document.getElementById('certEfficiency'),
      certAngle: document.getElementById('certAngle'),
      certStability: document.getElementById('certStability'),
      certSerial: document.getElementById('certSerial'),
      downloadCertPngBtn: document.getElementById('downloadCertPngBtn'),

      demoModal: document.getElementById('demoModal'),
      closeDemoModalBtn: document.getElementById('closeDemoModalBtn'),
      demoConsoleLog: document.getElementById('demoConsoleLog'),
      demoCurrentStatus: document.getElementById('demoCurrentStatus'),
      demoProgressPercent: document.getElementById('demoProgressPercent'),
      demoProgressBar: document.getElementById('demoProgressBar'),
      demoResultReveal: document.getElementById('demoResultReveal'),
      dismissDemoBtn: document.getElementById('dismissDemoBtn'),

      toastNotification: document.getElementById('toastNotification'),
      toastMessage: document.getElementById('toastMessage')
    };

    // Instantiate Visualizer and Radar chart engines
    this.visualizer = new SandwichVisualizer(this.dom.sandwichSvg, { isAerodynamic: this.isAerodynamic });
    this.radar = new FlavorRadarChart(this.dom.radarSvg);

    this.init();
  }

  init() {
    this.renderQuickIngredientChips();
    this.bindEvents();

    // Check URL parameters for deep-linking (e.g. ?preset=breadMonster&aero=1&modal=certificate)
    const urlParams = new URLSearchParams(window.location.search);
    const presetParam = urlParams.get('preset');
    const aeroParam = urlParams.get('aero');
    const modalParam = urlParams.get('modal');

    if (presetParam === 'empty') {
      this.layers = [];
      this.currentSandwichName = "Empty Airframe";
    } else if (presetParam && PRESET_SANDWICHES[presetParam]) {
      const p = PRESET_SANDWICHES[presetParam];
      this.layers = JSON.parse(JSON.stringify(p.layers));
      this.currentSandwichName = p.name;
    }

    if (aeroParam === '1' || aeroParam === 'true') {
      this.isAerodynamic = true;
      this.dom.aeroModeSwitch.setAttribute('aria-checked', true);
      this.dom.aeroModeSwitch.classList.remove('bg-slate-700');
      this.dom.aeroModeSwitch.classList.add('bg-cyan-600');
      this.dom.aeroSwitchThumb.classList.remove('translate-x-0');
      this.dom.aeroSwitchThumb.classList.add('translate-x-5');
    }

    this.update();

    if (modalParam === 'certificate') {
      this.dom.openCertificateBtn.click();
    } else if (modalParam === 'demo') {
      this.dom.openDemoModeBtn.click();
    } else if (modalParam === 'report') {
      this.dom.openReportBtn.click();
    } else if (modalParam === 'add') {
      this.dom.openAddModalBtn.click();
    }
  }

  /**
   * Main recalculation and view update pipeline
   */
  update(animate = false, options = {}) {
    // 1. Run mathematical simulation engine
    this.analysis = analyzeSandwich(this.layers);

    // 2. Audio Triggers Evaluation
    const currentPercentages = this.analysis.categoryPercentages;
    let exceededCategory = null;
    if (this.prevCategoryPercentages) {
      for (const [cat, idealPct] of Object.entries(IDEAL_RATIOS)) {
        const curPct = currentPercentages[cat] || 0;
        const prevPct = this.prevCategoryPercentages[cat] || 0;
        // Trigger if category ratio is above ideal target and it increased
        if (curPct > idealPct && curPct > prevPct + 0.05) {
          exceededCategory = cat;
          break;
        }
      }
    }

    const currentWarnCount = this.analysis.warnings.length;
    const warningsIncreased = this.prevWarningsCount !== null && currentWarnCount > this.prevWarningsCount;
    const isStalled = this.analysis.isStalled;
    const hasCritical = isStalled || this.analysis.warnings.some(w => w.level === 'critical');
    const isPerfect = this.analysis.efficiency.score >= 90;
    const becamePerfect = isPerfect && (this.prevEfficiencyScore === null || this.prevEfficiencyScore < 90);

    // Play sounds only after initial hydration
    if (!this.isFirstLoad) {
      if (isPerfect && (becamePerfect || options.forceCelebrate)) {
        sound.speakPerfectBite();
        this.showToast("🎉 WOW BITE IS READY KADICHOO! 🎉");
      } else if (exceededCategory) {
        sound.ratioExceeded(exceededCategory);
        this.showToast(`⚠️ Ratio Alert: ${exceededCategory} exceeded ideal ${IDEAL_RATIOS[exceededCategory]}% (${currentPercentages[exceededCategory].toFixed(1)}%)`);
      } else if (warningsIncreased || options.triggerAlarm) {
        if (currentWarnCount > 0) {
          sound.alarm(hasCritical);
        }
      } else if (!options.silent) {
        sound.click();
      }
    }

    // Save previous state for delta detection
    this.prevCategoryPercentages = { ...currentPercentages };
    this.prevWarningsCount = currentWarnCount;
    this.prevEfficiencyScore = this.analysis.efficiency.score;
    this.isFirstLoad = false;

    // 3. Render layer list in builder
    this.renderLayerList();

    // 4. Render SVG cross-section visualizer
    this.visualizer.setAerodynamicMode(this.isAerodynamic);
    this.visualizer.render(this.analysis);

    // 5. Update Results Dashboard metrics
    this.renderResults(animate);

    // 6. Render Ratio Bars & 5-Axis Radar Chart
    this.renderRatioBars();
    this.radar.render(this.analysis.categoryPercentages);

    // 7. Render Warnings
    this.renderWarnings();

    // 8. Update Terminology
    this.updateTerminology();
  }

  /**
   * Renders the interactive layer list with reordering and sliders
   */
  renderLayerList() {
    this.dom.layersListContainer.innerHTML = '';
    this.dom.layerCountBadge.textContent = `${this.layers.length} layers`;

    if (this.layers.length === 0) {
      this.dom.layersListContainer.innerHTML = `
        <div class="text-center py-8 px-4 rounded-xl border border-dashed border-slate-300 text-slate-400">
          <p class="text-2xl mb-1">🍽️</p>
          <p class="text-sm font-semibold text-slate-700">No layers in this airframe</p>
          <p class="text-xs text-slate-500 mt-1">Click "+ ADD LAYER" or choose a preset above.</p>
        </div>
      `;
      return;
    }

    this.layers.forEach((layer, index) => {
      const item = document.createElement('div');
      item.className = "layer-item flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow transition-all group";
      item.dataset.index = index;

      const catColor = INGREDIENT_COLORS[layer.category] || INGREDIENT_COLORS.Other;

      item.innerHTML = `
        <!-- Left: Drag / Move & Details -->
        <div class="flex items-center space-x-3 min-w-0">
          <!-- Move up / down controls -->
          <div class="flex flex-col space-y-0.5">
            <button class="btn-move-up p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-cyan-600 disabled:opacity-20 text-[10px]" ${index === 0 ? 'disabled' : ''} title="Move layer up">▲</button>
            <button class="btn-move-down p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-cyan-600 disabled:opacity-20 text-[10px]" ${index === this.layers.length - 1 ? 'disabled' : ''} title="Move layer down">▼</button>
          </div>

          <!-- Icon & Name -->
          <div class="w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0" style="background-color: ${catColor.light}; border: 1px solid ${catColor.border};">
            ${layer.icon || INGREDIENT_ICONS[layer.category] || '▫️'}
          </div>

          <div class="min-w-0">
            <div class="text-sm font-semibold text-slate-900 truncate flex items-center space-x-1.5">
              <span>${layer.name}</span>
            </div>
            <div class="flex items-center space-x-2 mt-0.5">
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold" style="background-color: ${catColor.light}; color: ${catColor.border};">
                ${layer.category}
              </span>
              <span class="text-[11px] font-mono text-slate-500">${layer.thickness} mm</span>
            </div>
          </div>
        </div>

        <!-- Right: Thickness Stepper & Delete -->
        <div class="flex items-center space-x-3 ml-2 flex-shrink-0">
          <div class="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
            <button class="btn-thickness-dec w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 text-xs font-bold shadow-xs flex items-center justify-center">-</button>
            <input type="number" min="1" max="60" value="${layer.thickness}" class="layer-thickness-input w-11 text-center bg-transparent text-xs font-mono font-bold text-slate-900 focus:outline-none">
            <button class="btn-thickness-inc w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 text-xs font-bold shadow-xs flex items-center justify-center">+</button>
            <span class="text-[10px] font-mono text-slate-400 pr-1">mm</span>
          </div>

          <!-- Delete Button -->
          <button class="btn-delete-layer p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Remove Layer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      `;

      // Event bindings on layer item
      const moveUpBtn = item.querySelector('.btn-move-up');
      const moveDownBtn = item.querySelector('.btn-move-down');
      const decBtn = item.querySelector('.btn-thickness-dec');
      const incBtn = item.querySelector('.btn-thickness-inc');
      const thicknessInput = item.querySelector('.layer-thickness-input');
      const deleteBtn = item.querySelector('.btn-delete-layer');

      if (moveUpBtn) {
        moveUpBtn.addEventListener('click', () => {
          sound.click();
          const temp = this.layers[index];
          this.layers[index] = this.layers[index - 1];
          this.layers[index - 1] = temp;
          this.update();
        });
      }

      if (moveDownBtn) {
        moveDownBtn.addEventListener('click', () => {
          sound.click();
          const temp = this.layers[index];
          this.layers[index] = this.layers[index + 1];
          this.layers[index + 1] = temp;
          this.update();
        });
      }

      if (decBtn) {
        decBtn.addEventListener('click', () => {
          if (this.layers[index].thickness > 1) {
            this.layers[index].thickness -= 1;
            this.update();
          }
        });
      }

      if (incBtn) {
        incBtn.addEventListener('click', () => {
          if (this.layers[index].thickness < 60) {
            this.layers[index].thickness += 1;
            this.update();
          }
        });
      }

      if (thicknessInput) {
        thicknessInput.addEventListener('change', (e) => {
          const val = Math.max(1, Math.min(60, parseInt(e.target.value) || 1));
          this.layers[index].thickness = val;
          this.update();
        });
      }

      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          sound.click();
          this.layers.splice(index, 1);
          this.update();
        });
      }

      this.dom.layersListContainer.appendChild(item);
    });
  }

  /**
   * Renders the Results Dashboard Cards with optional animated counting
   */
  renderResults(animate = false) {
    const { efficiency, biteAngle, totalThickness, flavorLift, centerOfFlavor } = this.analysis;

    // Card 1: Efficiency
    if (animate) {
      this.animateNumber(this.dom.efficiencyScoreDisplay, 0, efficiency.score, 800, '%');
    } else {
      this.dom.efficiencyScoreDisplay.textContent = `${efficiency.score}%`;
    }
    this.dom.efficiencyRatingBadge.textContent = efficiency.rating;
    
    // Set Efficiency Badge Colors
    this.dom.efficiencyRatingBadge.className = `mt-3 inline-block px-2.5 py-1 rounded-md text-xs font-bold font-mono ${
      efficiency.score >= 75 ? 'bg-emerald-100 text-emerald-800' :
      efficiency.score >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
    }`;
    this.dom.efficiencyScoreDisplay.className = `text-4xl sm:text-5xl font-extrabold font-mono ${
      efficiency.score >= 75 ? 'text-emerald-600' :
      efficiency.score >= 50 ? 'text-amber-600' : 'text-red-600'
    }`;

    // Card 2: Bite Angle
    this.dom.biteAngleDisplay.textContent = `${biteAngle}°`;
    const angleStability = biteAngle <= 20 ? "STABLE INTAKE" : biteAngle <= 35 ? "INCREASED SHEAR" : "CRITICAL STALL";
    this.dom.biteAngleRatingBadge.textContent = angleStability;
    this.dom.biteAngleRatingBadge.className = `mt-3 inline-block px-2.5 py-1 rounded-md text-xs font-bold font-mono ${
      biteAngle <= 20 ? 'bg-cyan-100 text-cyan-800' :
      biteAngle <= 35 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
    }`;

    // Card 3: Total Thickness
    this.dom.totalThicknessDisplay.textContent = `${totalThickness} mm`;
    const clearanceStatus = totalThickness > 100 ? "CLEARANCE FAIL" : totalThickness < 15 ? "UNDERSIZED" : "CLEARANCE PASS";
    this.dom.clearanceRatingBadge.textContent = clearanceStatus;
    this.dom.clearanceRatingBadge.className = `mt-3 inline-block px-2.5 py-1 rounded-md text-xs font-bold font-mono ${
      clearanceStatus === "CLEARANCE PASS" ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
    }`;

    // Card 4: Flavor Lift
    this.dom.flavorLiftDisplay.textContent = `${flavorLift} FL`;
    const balanceStatus = efficiency.score >= 80 ? "OPTIMAL" : efficiency.score >= 50 ? "STABLE" : "DEGRADED";
    this.dom.balanceRatingBadge.textContent = balanceStatus;

    // Callout Badges on Visualizer
    this.dom.calculatedAngleBadge.textContent = `${biteAngle}° ENTRY`;
    this.dom.trajectoryAngleCallout.textContent = `${biteAngle}° (${angleStability})`;
    this.dom.centerOfFlavorCallout.textContent = `${centerOfFlavor}% from Apex`;
  }

  /**
   * Renders the Horizontal Ratio Comparison Bars
   */
  renderRatioBars() {
    this.dom.ratioBarsContainer.innerHTML = '';
    const { categoryPercentages, totalError } = this.analysis;

    this.dom.totalErrorVarianceDisplay.textContent = `${totalError.toFixed(1)}%`;

    const categories = [
      { key: 'Bread', name: 'Bread', icon: '🍞', ideal: IDEAL_RATIOS.Bread, color: 'bg-amber-500' },
      { key: 'Protein', name: 'Protein', icon: '🥩', ideal: IDEAL_RATIOS.Protein, color: 'bg-rose-700' },
      { key: 'Vegetable', name: 'Vegetables', icon: '🥬', ideal: IDEAL_RATIOS.Vegetable, color: 'bg-emerald-500' },
      { key: 'Cheese', name: 'Cheese', icon: '🧀', ideal: IDEAL_RATIOS.Cheese, color: 'bg-yellow-400' },
      { key: 'Sauce', name: 'Sauce', icon: '🥫', ideal: IDEAL_RATIOS.Sauce, color: 'bg-orange-500' }
    ];

    categories.forEach(cat => {
      const actualPct = categoryPercentages[cat.key] || 0;
      const idealPct = cat.ideal;
      const diff = actualPct - idealPct;
      const diffSign = diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`;

      const barRow = document.createElement('div');
      barRow.className = "space-y-1.5";
      barRow.innerHTML = `
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center space-x-1.5 font-semibold text-slate-800">
            <span>${cat.icon}</span>
            <span>${cat.name}</span>
          </div>
          <div class="flex items-center space-x-3 font-mono">
            <span class="text-slate-500 text-[11px]">Ideal: ${idealPct}%</span>
            <span class="font-bold text-slate-900">Actual: ${actualPct.toFixed(1)}%</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded font-bold ${
              Math.abs(diff) < 3 ? 'bg-emerald-100 text-emerald-800' :
              Math.abs(diff) < 8 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
            }">${diffSign}</span>
          </div>
        </div>

        <!-- Visual Bar Track -->
        <div class="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <!-- Actual Fill Bar -->
          <div class="h-full ${cat.color} rounded-full transition-all duration-500" style="width: ${Math.min(100, actualPct)}%"></div>
          <!-- Ideal Marker Line -->
          <div class="absolute top-0 bottom-0 w-0.5 bg-cyan-600 z-10" style="left: ${idealPct}%;" title="Target: ${idealPct}%"></div>
        </div>
      `;
      this.dom.ratioBarsContainer.appendChild(barRow);
    });
  }

  /**
   * Renders the Warnings & Bite Stall Alerts
   */
  renderWarnings() {
    this.dom.warningsSection.innerHTML = '';
    const { warnings } = this.analysis;

    if (!warnings || warnings.length === 0) {
      // Nominal status
      const okDiv = document.createElement('div');
      okDiv.className = "p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center space-x-3 text-emerald-300 text-xs font-mono";
      okDiv.innerHTML = `
        <span class="text-xl">✅</span>
        <div>
          <strong class="font-bold">ALL TELEMETRY NOMINAL:</strong> Flavor airframe conforms to theoretical aerodynamic tolerances. No bite stalls predicted.
        </div>
      `;
      this.dom.warningsSection.appendChild(okDiv);
      return;
    }

    warnings.forEach(warn => {
      const card = document.createElement('div');
      const isCritical = warn.level === 'critical';

      card.className = `p-4 rounded-xl border flex items-start space-x-3 text-xs shadow-sm transition-all ${
        isCritical 
          ? 'bg-red-950/50 border-red-500/60 text-red-200 animate-warning-pulse' 
          : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
      }`;

      card.innerHTML = `
        <div class="text-2xl flex-shrink-0 pt-0.5">${warn.icon || '⚠️'}</div>
        <div class="space-y-1 flex-grow min-w-0">
          <div class="font-bold font-mono tracking-wide ${isCritical ? 'text-red-400' : 'text-amber-400'}">
            ${warn.title}
          </div>
          <div class="text-slate-300 leading-relaxed whitespace-pre-line font-sans">
            ${warn.description}
          </div>
        </div>
      `;
      this.dom.warningsSection.appendChild(card);
    });
  }

  /**
   * Updates UI terminology based on Aerodynamic Mode toggle
   */
  updateTerminology() {
    const terms = this.isAerodynamic ? TERMINOLOGY.aerodynamic : TERMINOLOGY.standard;

    this.dom.builderHeading.textContent = this.isAerodynamic ? "CONFIGURE FLAVOR AIRFRAME" : "BUILD YOUR SANDWICH";
    this.dom.builderSubtitle.textContent = this.isAerodynamic 
      ? "Calibrate aerodynamic camber, fluid payload, and primary load-bearing strata."
      : "Configure your flavor airframe layer by layer. Millimeter tolerances dictate bite stability.";
    this.dom.visualizerTitle.innerHTML = `
      <span>${this.isAerodynamic ? "AERODYNAMIC AIRFRAME PROFILE" : "FLAVOR AIRFRAME ANALYSIS"}</span>
      <span class="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono">${this.isAerodynamic ? 'AERO HUD' : 'SVG 2.0'}</span>
    `;

    this.dom.cardEfficiencyTitle.textContent = terms.efficiency.toUpperCase();
    this.dom.cardAngleTitle.textContent = terms.biteAngle.toUpperCase();
    this.dom.cardAngleSubtitle.textContent = this.isAerodynamic ? "Critical flight intake vector." : "Recommended mouth entry angle.";
    this.dom.cardThicknessTitle.textContent = terms.thickness.toUpperCase();
    this.dom.cardLiftTitle.textContent = terms.flavorLift.toUpperCase();

    if (this.isAerodynamic) {
      this.dom.aeroBanner.classList.remove('hidden');
    } else {
      this.dom.aeroBanner.classList.add('hidden');
    }
  }

  /**
   * Renders quick-add ingredient preset chips in the Add Layer modal
   */
  renderQuickIngredientChips() {
    this.dom.quickIngredientsContainer.innerHTML = '';
    QUICK_ADD_INGREDIENTS.forEach(ing => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = "px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-cyan-100 hover:text-cyan-800 text-slate-700 border border-slate-200 transition-colors flex items-center space-x-1";
      chip.innerHTML = `<span>${ing.icon}</span><span>${ing.name}</span>`;
      chip.addEventListener('click', () => {
        sound.click();
        this.dom.layerNameInput.value = ing.name;
        this.dom.layerCategorySelect.value = ing.category;
        this.dom.layerThicknessInput.value = ing.thickness;
      });
      this.dom.quickIngredientsContainer.appendChild(chip);
    });
  }

  /**
   * Sets up all DOM event listeners
   */
  bindEvents() {
    // 1. Audio Sound Toggle
    this.dom.audioToggleBtn.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      this.dom.audioIcon.textContent = isMuted ? '🔇' : '🔊';
      if (!isMuted) sound.click();
      this.showToast(isMuted ? "Sound Telemetry Muted" : "Sound Telemetry Enabled");
    });

    // 2. Aerodynamic Mode Switch
    this.dom.aeroModeSwitch.addEventListener('click', () => {
      this.isAerodynamic = !this.isAerodynamic;
      sound.toggle();
      
      this.dom.aeroModeSwitch.setAttribute('aria-checked', this.isAerodynamic);
      if (this.isAerodynamic) {
        this.dom.aeroModeSwitch.classList.remove('bg-slate-700');
        this.dom.aeroModeSwitch.classList.add('bg-cyan-600');
        this.dom.aeroSwitchThumb.classList.remove('translate-x-0');
        this.dom.aeroSwitchThumb.classList.add('translate-x-5');
      } else {
        this.dom.aeroModeSwitch.classList.remove('bg-cyan-600');
        this.dom.aeroModeSwitch.classList.add('bg-slate-700');
        this.dom.aeroSwitchThumb.classList.remove('translate-x-5');
        this.dom.aeroSwitchThumb.classList.add('translate-x-0');
      }
      this.update(true);
      this.showToast(this.isAerodynamic ? "AERODYNAMIC FLIGHT MODE ACTIVATED" : "STANDARD FLAVOR MODE ACTIVATED");
    });

    // 3. Mobile Menu Toggle
    this.dom.mobileMenuBtn.addEventListener('click', () => {
      this.dom.mobileMenu.classList.toggle('hidden');
    });

    // 4. Presets
    this.dom.presetButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        sound.click();
        const presetKey = e.currentTarget.dataset.preset;
        const preset = PRESET_SANDWICHES[presetKey];
        if (preset) {
          this.layers = JSON.parse(JSON.stringify(preset.layers));
          this.currentSandwichName = preset.name;
          const isDream = presetKey === 'engineersDream';
          const isWarningPreset = presetKey === 'tomatoDisaster' || presetKey === 'sauceFlood' || presetKey === 'breadMonster';
          this.update(true, { 
            forceCelebrate: isDream, 
            triggerAlarm: isWarningPreset 
          });
          this.showToast(`Loaded preset: ${preset.name}`);
        }
      });
    });

    // 5. Reset & Clear Sandwich
    this.dom.resetSandwichBtn.addEventListener('click', () => {
      sound.click();
      this.layers = JSON.parse(JSON.stringify(PRESET_SANDWICHES.classic.layers));
      this.currentSandwichName = "Classic Burger";
      this.update(true);
      this.showToast("Sandwich reset to standard airframe");
    });

    this.dom.clearAllLayersBtn.addEventListener('click', () => {
      sound.click();
      this.layers = [];
      this.currentSandwichName = "Empty Airframe";
      this.update(false, { triggerAlarm: true });
      this.showToast("Airframe cleared");
    });

    // 6. Recalculate & Speak Kadichoo
    this.dom.recalculateBtn.addEventListener('click', () => {
      sound.calculate();
      const isPerfect = this.analysis && this.analysis.efficiency.score >= 90;
      setTimeout(() => {
        this.update(true, { forceCelebrate: isPerfect });
        this.showToast(isPerfect ? "🎉 WOW BITE IS READY KADICHOO! 🎉" : "Recalculation complete");
      }, 350);
    });

    if (this.dom.speakBiteBtn) {
      this.dom.speakBiteBtn.addEventListener('click', () => {
        sound.speakPerfectBite();
        this.showToast("🗣️ WOW BITE IS READY KADICHOO!");
      });
    }

    // 7. Add Layer Modal
    this.dom.openAddModalBtn.addEventListener('click', () => {
      sound.click();
      this.dom.addLayerModal.classList.remove('hidden');
      this.dom.layerNameInput.focus();
    });

    const closeAddModal = () => {
      this.dom.addLayerModal.classList.add('hidden');
    };
    this.dom.closeAddModalBtn.addEventListener('click', closeAddModal);
    this.dom.cancelAddModalBtn.addEventListener('click', closeAddModal);

    this.dom.addLayerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sound.click();
      const name = this.dom.layerNameInput.value.trim();
      const category = this.dom.layerCategorySelect.value;
      const thickness = parseFloat(this.dom.layerThicknessInput.value) || 5;

      this.layers.push({
        id: `custom_${Date.now()}`,
        name: name,
        category: category,
        thickness: thickness,
        icon: INGREDIENT_ICONS[category] || '▫️'
      });

      closeAddModal();
      this.dom.addLayerForm.reset();
      this.update(true);
      this.showToast(`Added ${name} (${thickness}mm)`);
    });

    // 8. Engineering Report Modal
    this.dom.openReportBtn.addEventListener('click', () => {
      sound.click();
      const report = generateEngineeringReport(this.analysis, this.currentSandwichName, this.isAerodynamic);
      this.dom.reportPre.textContent = report;
      this.dom.reportModal.classList.remove('hidden');
    });

    this.dom.closeReportModalBtn.addEventListener('click', () => {
      this.dom.reportModal.classList.add('hidden');
    });

    this.dom.copyReportBtn.addEventListener('click', async () => {
      sound.click();
      try {
        await navigator.clipboard.writeText(this.dom.reportPre.textContent);
        this.showToast("Engineering Report copied to clipboard!");
      } catch (err) {
        this.showToast("Failed to copy to clipboard.");
      }
    });

    // 9. Bite Certificate Modal
    this.dom.openCertificateBtn.addEventListener('click', () => {
      sound.targetLock();
      this.dom.certSandwichName.textContent = `“${this.currentSandwichName.toUpperCase()}”`;
      this.dom.certEfficiency.textContent = `${this.analysis.efficiency.score}%`;
      this.dom.certAngle.textContent = `${this.analysis.biteAngle}°`;
      this.dom.certStability.textContent = this.analysis.efficiency.score >= 75 ? "HIGH" : this.analysis.efficiency.score >= 50 ? "MODERATE" : "LOW";
      this.dom.certSerial.textContent = `SERIAL: ${generateSerialNumber()}`;
      this.dom.certificateModal.classList.remove('hidden');
    });

    this.dom.closeCertificateModalBtn.addEventListener('click', () => {
      this.dom.certificateModal.classList.add('hidden');
    });

    this.dom.downloadCertPngBtn.addEventListener('click', () => {
      sound.click();
      downloadCertificateCanvas(this.analysis, this.currentSandwichName);
      this.showToast("Certificate PNG generated and downloaded!");
    });

    // 10. Share Bite
    this.dom.shareBiteBtn.addEventListener('click', async () => {
      sound.click();
      const success = await copyShareResult(this.analysis, this.currentSandwichName, this.isAerodynamic);
      if (success) {
        this.showToast("Bite result copied! Ready to share.");
      }
    });

    // 11. Random Unnecessary Analysis
    this.dom.randomAnalysisBtn.addEventListener('click', () => {
      const metrics = generateRandomAnalysis();
      this.dom.randomMetricsGrid.innerHTML = '';

      metrics.forEach(m => {
        const div = document.createElement('div');
        div.className = "p-3 rounded-xl bg-slate-900 border border-slate-800 text-center";
        div.innerHTML = `
          <div class="text-[10px] font-mono text-slate-400 truncate uppercase">${m.label}</div>
          <div class="text-base font-bold font-mono text-purple-300 mt-1">${m.value}</div>
          <div class="text-[9px] font-mono font-bold text-cyan-400 mt-0.5">${m.status}</div>
        `;
        this.dom.randomMetricsGrid.appendChild(div);
      });

      this.dom.randomAnalysisPanel.classList.remove('hidden');
      this.showToast("Random telemetry sensors refreshed");
    });

    // 12. Hackathon Live Demo Mode
    const triggerDemo = () => {
      this.dom.demoModal.classList.remove('hidden');
      this.dom.demoConsoleLog.innerHTML = '<div>&gt; INITIATING HARDWARE HANDSHAKE...</div>';
      this.dom.demoResultReveal.classList.add('hidden');

      runHackathonDemoSequence(
        (text, progress) => {
          this.dom.demoCurrentStatus.textContent = text;
          this.dom.demoProgressPercent.textContent = `${progress}%`;
          this.dom.demoProgressBar.style.width = `${progress}%`;
          
          const logLine = document.createElement('div');
          logLine.textContent = `> ${text} [${progress}%]`;
          this.dom.demoConsoleLog.appendChild(logLine);
          this.dom.demoConsoleLog.scrollTop = this.dom.demoConsoleLog.scrollHeight;
        },
        () => {
          this.dom.demoResultReveal.classList.remove('hidden');
          this.update(true, { forceCelebrate: true });
        }
      );
    };

    this.dom.openDemoModeBtn.addEventListener('click', triggerDemo);
    this.dom.heroDemoModeBtn.addEventListener('click', triggerDemo);

    this.dom.closeDemoModalBtn.addEventListener('click', () => {
      this.dom.demoModal.classList.add('hidden');
    });

    this.dom.dismissDemoBtn.addEventListener('click', () => {
      this.dom.demoModal.classList.add('hidden');
      const visualizerEl = document.getElementById('visualizerSection');
      if (visualizerEl) visualizerEl.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /**
   * Helper: Animate number counter from start to end
   */
  animateNumber(element, start, end, duration, suffix = '') {
    const range = end - start;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + range * eased);
      element.textContent = `${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = `${end}${suffix}`;
      }
    };

    requestAnimationFrame(step);
  }

  /**
   * Displays toast notification
   */
  showToast(message) {
    this.dom.toastMessage.textContent = message;
    this.dom.toastNotification.classList.remove('translate-y-24', 'opacity-0');
    this.dom.toastNotification.classList.add('translate-y-0', 'opacity-100');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.dom.toastNotification.classList.remove('translate-y-0', 'opacity-100');
      this.dom.toastNotification.classList.add('translate-y-24', 'opacity-0');
    }, 2800);
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
