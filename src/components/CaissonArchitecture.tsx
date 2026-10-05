/**
 * Project BioVolt: Under-Earth Electro-Microbial Grid (UE-EMG)
 * Subterranean Co-Generation Caisson Architectural Inspector
 */

import React, { useState } from 'react';
import {
  Layers,
  Thermometer,
  ShieldCheck,
  Flame,
  Zap,
  Droplets,
  ArrowDown,
  Info,
  ChevronRight,
  Gauge
} from 'lucide-react';
import { CaissonComponent } from '../types/biovolt';

const CAISSON_STAGES: CaissonComponent[] = [
  {
    id: 'stage-surface',
    depthRange: '0m to 5m',
    depthMeters: 2.5,
    title: 'Gravity-Fed Urban/Agricultural Waste Intake',
    category: 'waste',
    subtitle: 'Surface collection portal & passive hydrostatic feed column',
    description:
      'Urban food waste, agricultural cellulose slurries, and municipal greywater drop down a 400mm reinforced stainless column. The vertical head generates natural hydrostatic pressure without parasitical pump losses.',
    technicalSpecs: {
      'Feed Rate': '120 kg/day organic COD',
      'Hydrostatic Head': '0.48 bar passive compression at base',
      'Structural Material': 'Precast C50/60 sulfate-resistant concrete',
      'Oxygen Exclusion': 'Dual-gate airlock flapper valve prevents O2 ingress',
    },
    advantages: [
      'Zero-energy gravity transport for viscous slurry feeds',
      'Completely sealed to eliminate surface odor and methane leakage',
      'Thermal insulation layer protects subsequent stages from surface weather swings',
    ],
    operationalRole: 'Continuous unpowered organic substrate delivery to anaerobic digester.',
  },
  {
    id: 'stage-digester',
    depthRange: '5m to 12m',
    depthMeters: 8.5,
    title: 'Deep Anaerobic Digester & Biogas Compression Chamber',
    category: 'digester',
    subtitle: 'Thermophilic methanogenic decomposition under passive pressure',
    description:
      'Methanogenic archaea break down complex organic carbon under anaerobic conditions ($35^\\circ\\text{C}$ to $38^\\circ\\text{C}$). High passive head pressure naturally compresses biogas (65% $\\text{CH}_4$, 35% $\\text{CO}_2$) directly into the SOFC fuel manifold.',
    chemicalEquations: [
      '\\text{Acidogenesis: } \\text{C}_6\\text{H}_{12}\\text{O}_6 \\to 2\\text{CH}_3\\text{CH}_2\\text{COOH} + 2\\text{CO}_2 + 2\\text{H}_2',
      '\\text{Methanogenesis: } \\text{CH}_3\\text{COOH} \\to \\text{CH}_4 + \\text{CO}_2',
    ],
    technicalSpecs: {
      'Working Volume': '18.5 m³ subterranean vault',
      'Internal Temp': '37.0°C (buffered by SOFC exhaust jacket)',
      'Biogas Yield': '14.2 Nm³/day compressed methane mix',
      'Effluent Discharge': 'Liquid acetate-rich digestate directed to bio-anode',
    },
    advantages: [
      'Subterranean rock prevents heat dissipation during winter',
      'Hydrostatic weight eliminates mechanical gas booster pumps',
      'Effluent is pre-digested volatile fatty acid soup ideal for Geobacter',
    ],
    operationalRole: 'Dual-phase generation: supplies gas to SOFC and acetate to bio-anode.',
  },
  {
    id: 'stage-sofc',
    depthRange: '12m to 16m',
    depthMeters: 14.0,
    title: 'High-Temperature Solid-Oxide Fuel Cell (SOFC) Vault',
    category: 'sofc',
    subtitle: 'Thermal co-generation unit converting methane to high-burst DC',
    description:
      'High-efficiency ceramic solid-oxide fuel cell operating at $750^\\circ\\text{C}$ within an aerogel vacuum-jacketed chamber. Converts biogas into high-amperage (45A-80A) DC current during peak grid demand windows. Waste heat directly recirculates to keep the upper anaerobic digester at $37^\\circ\\text{C}$.',
    chemicalEquations: [
      '\\text{Anode: } \\text{CH}_4 + 4\\text{O}^{2-} \\to \\text{CO}_2 + 2\\text{H}_2\\text{O} + 8e^-',
      '\\text{Cathode: } 2\\text{O}_2 + 8e^- \\to 4\\text{O}^{2-}',
    ],
    technicalSpecs: {
      'Electrical Efficiency': '62% LHV (85% combined heat & power)',
      'Rated Output': '5.2 kW continuous / 12 kW burst',
      'Thermal Shielding': 'Pyrogel aerogel vacuum jacket (0.015 W/m·K)',
      'Exhaust Recovery': 'Closed counterflow heat exchange to Digester',
    },
    advantages: [
      'Internal steam reforming handles biogas without external reforming stations',
      'Zero greenhouse venting — clean exhaust $\\text{CO}_2$ sequestered in basalt',
      'Provides high-burst recharging pulses to the Lead-Carbon storage array',
    ],
    operationalRole: 'High-power generation vector complementing the biological micro-current.',
  },
  {
    id: 'stage-bioanode',
    depthRange: '16m to 20m',
    depthMeters: 18.0,
    title: 'Exoelectrogenic Bio-Anode Compartment (EMHC Phase 1)',
    category: 'bioanode',
    subtitle: 'Living Geobacter sulfurreducens biofilm on CNT-carbon cloth array',
    description:
      'The liquid effluent from the digester flows into a dense vertical cassette array of carbon nanotube-decorated carbon cloth. Millions of Geobacter bacteria oxidize acetate ions and transfer metabolic electrons directly through conductive protein nanowires (OmcS/OmcZ cytochromes) to the electrical grid.',
    chemicalEquations: [
      '\\text{Bio-Anode: } \\text{CH}_3\\text{COO}^- + 2\\text{H}_2\\text{O} \\xrightarrow{Geobacter} 2\\text{CO}_2 + 7\\text{H}^+ + 8e^-',
      '\\text{PEM Flux: } \\text{H}^+ \\text{ migrates across sulfonated polyarylene membrane}',
    ],
    technicalSpecs: {
      'Biofilm Catalyst': 'Geobacter sulfurreducens KN400 sub-strain variant',
      'Specific Surface Area': '145 m² active CNT-carbon cloth weave',
      'Det Current Density': '8.2 A/m² continuous det trickle',
      'Coulombic Efficiency': '88.4% electron harvest from COD',
    },
    advantages: [
      'Runs 24/7/365 without mechanical wear, lubricants, or battery replacement',
      'Cleans the digester wastewater before discharge',
      'Conductive pili act as biological metallic conduits into the carbon matrix',
    ],
    operationalRole: 'Continuous baseline micro-current harvest directly from organic waste.',
  },
  {
    id: 'stage-storage',
    depthRange: '20m to 25m',
    depthMeters: 22.5,
    title: 'Lead-Carbon (Pb-C) Intercalated Capacitor & Storage Core',
    category: 'storage',
    subtitle: 'Asymmetric hybrid chemical capacitor bank in 15°C bedrock vault',
    description:
      'The heavy electrical storage stage. By embedding high-surface-area activated carbon directly into the lead negative plate, the matrix forms an in-situ double-layer capacitor ($C_{\\text{dl}} = 5000\\text{F}$). Weak biological currents are absorbed instantly without plate sulfation, while the dense lead-acid core handles high-burst grid exports.',
    chemicalEquations: [
      '\\text{Capacitive Fast Capture: } \\text{C}_{\\text{dl}}[\\text{HSO}_4^-] \\leftrightarrow \\text{C}_{\\text{dl}} + \\text{HSO}_4^- + e^-',
      '\\text{Faradaic High Capacity: } \\text{Pb} + \\text{HSO}_4^- \\leftrightarrow \\text{PbSO}_4 + \\text{H}^+ + 2e^-',
    ],
    technicalSpecs: {
      'Total Bank Energy': '48 kWh Faradaic core / 1.2 kWh Capacitive burst',
      'Internal Resistance': '0.015 Ω ultra-low IR',
      'Operating Voltage': '1.80V to 2.40V nominal per cell module',
      'Cycle Durability': '8,500 cycles at 80% DoD (Partial State of Charge safe)',
    },
    advantages: [
      'Zero thermal runaway hazard (unlike lithium-ion in deep underground chambers)',
      'Subterranean 15°C bedrock acts as a passive, non-degrading heat sink',
      'Absorbs weak fluctuating bio-currents without sulfating battery plates',
    ],
    operationalRole: 'Localized chemical capacitor and long-duration baseload stabilizer.',
  },
];

export const CaissonArchitecture: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<CaissonComponent>(CAISSON_STAGES[3]); // Default to bio-anode

  return (
    <div className="flex flex-col gap-5">
      {/* Top Banner & Spatial Overview */}
      <div className="p-6 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Gauge className="w-4 h-4" />
            <span>SUBTERRANEAN CIVIL SPECIFICATION // CAISSON S-01</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-tech)' }}>
            Under-Earth Electro-Microbial Grid (UE-EMG) Architecture
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            A modular 25-meter precast concrete caisson sunk deep into crystalline basalt rock. Leverages
            isothermal deep-earth conditions (constant 15°C) and passive hydrostatic compression to achieve
            perpetual co-generation and un-degradable energy storage.
          </p>
        </div>

        <div className="flex items-center gap-4 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">BEDROCK AMBIENT</span>
            <span className="text-base font-bold text-cyan-400">15.0°C CONSTANT</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">TOTAL CAISSON DEPTH</span>
            <span className="text-base font-bold text-amber-400">25.0 METERS</span>
          </div>
        </div>
      </div>

      {/* Main Structural Cross-Section: Left SVG Interactive Cutaway + Right Spec Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Subterranean SVG Cross-Section (lg:col-span-5) */}
        <div className="lg:col-span-5 p-5 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span>SCHEMATIC CUTAWAY (0m to 25m)</span>
            <span>CLICK STAGE TO INSPECT</span>
          </div>

          <div className="relative w-full overflow-hidden bg-[#070A10] rounded-lg border border-slate-800/90 p-2">
            <svg
              viewBox="0 0 400 680"
              className="w-full h-auto select-none"
              style={{ maxHeight: '680px' }}
            >
              <defs>
                {/* Patterns */}
                <pattern id="basaltPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 0,20 L 20,0 M 0,0 L 20,20" stroke="#161F30" strokeWidth="1" />
                </pattern>
                <linearGradient id="concreteWall" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="50%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>
              </defs>

              {/* Surrounding Basalt Rock Background */}
              <rect x="0" y="40" width="400" height="640" fill="url(#basaltPattern)" />
              <rect x="0" y="0" width="400" height="40" fill="#1E293B" />
              <text x="20" y="25" fill="#94A3B8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                SURFACE GROUND LEVEL (0.0m)
              </text>

              {/* Concrete Cylindrical Caisson Outer Walls */}
              <rect x="60" y="40" width="16" height="630" fill="url(#concreteWall)" />
              <rect x="324" y="40" width="16" height="630" fill="url(#concreteWall)" />
              <rect x="60" y="660" width="280" height="15" fill="url(#concreteWall)" />

              {/* Depth Ticks & Labels on Left Side */}
              {[0, 5, 12, 16, 20, 25].map((d, i) => {
                const yPos = 40 + (d / 25) * 620;
                return (
                  <g key={i}>
                    <line x1="30" y1={yPos} x2="56" y2={yPos} stroke="#475569" strokeWidth="1.5" />
                    <text
                      x="25"
                      y={yPos + 4}
                      fill="#94A3B8"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      -{d}m
                    </text>
                  </g>
                );
              })}

              {/* Stage 1: Surface Intake & Gravity Column (0m - 5m) */}
              <g
                className="cursor-pointer transition-opacity hover:opacity-90"
                onClick={() => setSelectedStage(CAISSON_STAGES[0])}
              >
                <rect
                  x="80"
                  y="45"
                  width="240"
                  height="80"
                  rx="4"
                  fill={selectedStage.id === 'stage-surface' ? '#1E293B' : '#0F172A'}
                  stroke={selectedStage.id === 'stage-surface' ? '#F59E0B' : '#334155'}
                  strokeWidth={selectedStage.id === 'stage-surface' ? 2 : 1}
                />
                <circle cx="200" cy="85" r="16" fill="#3B82F6" fillOpacity="0.2" stroke="#3B82F6" />
                <path d="M 200,75 L 200,95 M 194,89 L 200,95 L 206,89" stroke="#60A5FA" strokeWidth="2" />
                <text x="95" y="70" fill="#E2E8F0" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  STAGE 1: WASTE INTAKE
                </text>
                <text x="95" y="105" fill="#94A3B8" fontSize="9" fontFamily="monospace">
                  Hydrostatic Drop Column (0-5m)
                </text>
              </g>

              {/* Stage 2: Deep Anaerobic Digester (5m - 12m) */}
              <g
                className="cursor-pointer transition-opacity hover:opacity-90"
                onClick={() => setSelectedStage(CAISSON_STAGES[1])}
              >
                <rect
                  x="80"
                  y="135"
                  width="240"
                  height="140"
                  rx="4"
                  fill={selectedStage.id === 'stage-digester' ? '#271B0B' : '#141824'}
                  stroke={selectedStage.id === 'stage-digester' ? '#F59E0B' : '#451A03'}
                  strokeWidth={selectedStage.id === 'stage-digester' ? 2 : 1}
                />
                {/* Organic Slurry Wave & Bubble Effect */}
                <path
                  d="M 90,200 Q 150,185 200,200 T 310,200 L 310,265 L 90,265 Z"
                  fill="#78350F"
                  fillOpacity="0.4"
                />
                <circle cx="140" cy="180" r="4" fill="#F59E0B" fillOpacity="0.6" />
                <circle cx="180" cy="165" r="6" fill="#F59E0B" fillOpacity="0.7" />
                <circle cx="250" cy="175" r="5" fill="#F59E0B" fillOpacity="0.6" />
                <text x="95" y="160" fill="#FDE68A" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  STAGE 2: ANAEROBIC DIGESTER
                </text>
                <text x="95" y="180" fill="#F59E0B" fontSize="9" fontFamily="monospace">
                  CH4 Gas Vector (37°C Chamber)
                </text>
                <text x="95" y="240" fill="#D97706" fontSize="9" fontFamily="monospace">
                  Compressed Biogas + Liquid Effluent
                </text>
              </g>

              {/* Stage 3: SOFC Vault (12m - 16m) */}
              <g
                className="cursor-pointer transition-opacity hover:opacity-90"
                onClick={() => setSelectedStage(CAISSON_STAGES[2])}
              >
                <rect
                  x="80"
                  y="285"
                  width="240"
                  height="90"
                  rx="4"
                  fill={selectedStage.id === 'stage-sofc' ? '#2A1715' : '#171D2D'}
                  stroke={selectedStage.id === 'stage-sofc' ? '#EF4444' : '#7F1D1D'}
                  strokeWidth={selectedStage.id === 'stage-sofc' ? 2 : 1}
                />
                {/* Fuel cell graphic */}
                <rect x="180" y="300" width="40" height="35" fill="#991B1B" rx="2" />
                <path d="M 170,317 L 180,317 M 220,317 L 230,317" stroke="#F87171" strokeWidth="2" />
                <text x="95" y="310" fill="#FECACA" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  STAGE 3: SOFC FUEL CELL
                </text>
                <text x="95" y="330" fill="#EF4444" fontSize="9" fontFamily="monospace">
                  Biogas Burn &amp; Thermal Co-Gen
                </text>
                <text x="95" y="355" fill="#F87171" fontSize="9" fontFamily="monospace">
                  High-Burst DC (45A-80A)
                </text>
              </g>

              {/* Stage 4: Bio-Anode Geobacter Compartment (16m - 20m) */}
              <g
                className="cursor-pointer transition-opacity hover:opacity-90"
                onClick={() => setSelectedStage(CAISSON_STAGES[3])}
              >
                <rect
                  x="80"
                  y="385"
                  width="240"
                  height="110"
                  rx="4"
                  fill={selectedStage.id === 'stage-bioanode' ? '#0F2625' : '#0B1E1E'}
                  stroke={selectedStage.id === 'stage-bioanode' ? '#14B8A6' : '#115E59'}
                  strokeWidth={selectedStage.id === 'stage-bioanode' ? 2 : 1}
                />
                {/* Carbon cloth fibers & bacterial clusters */}
                <line x1="120" y1="400" x2="120" y2="480" stroke="#0D9488" strokeWidth="3" />
                <line x1="160" y1="400" x2="160" y2="480" stroke="#0D9488" strokeWidth="3" />
                <line x1="200" y1="400" x2="200" y2="480" stroke="#0D9488" strokeWidth="3" />
                <line x1="240" y1="400" x2="240" y2="480" stroke="#0D9488" strokeWidth="3" />
                <line x1="280" y1="400" x2="280" y2="480" stroke="#0D9488" strokeWidth="3" />
                <text x="95" y="415" fill="#99F6E4" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  STAGE 4: BIO-ELECTROGENIC ANODE
                </text>
                <text x="95" y="440" fill="#2DD4BF" fontSize="9" fontFamily="monospace">
                  Geobacter Biofilm on CNT-Cloth
                </text>
                <text x="95" y="475" fill="#14B8A6" fontSize="9" fontFamily="monospace">
                  Continuous DET Exoelectron Trickle
                </text>
              </g>

              {/* Stage 5: Lead-Carbon Intercalated Storage Matrix (20m - 25m) */}
              <g
                className="cursor-pointer transition-opacity hover:opacity-90"
                onClick={() => setSelectedStage(CAISSON_STAGES[4])}
              >
                <rect
                  x="80"
                  y="505"
                  width="240"
                  height="145"
                  rx="4"
                  fill={selectedStage.id === 'stage-storage' ? '#1A182D' : '#11101E'}
                  stroke={selectedStage.id === 'stage-storage' ? '#8B5CF6' : '#4C1D95'}
                  strokeWidth={selectedStage.id === 'stage-storage' ? 2 : 1}
                />
                {/* Heavy battery bank array graphics */}
                <rect x="100" y="530" width="30" height="50" fill="#6D28D9" rx="2" />
                <rect x="140" y="530" width="30" height="50" fill="#6D28D9" rx="2" />
                <rect x="180" y="530" width="30" height="50" fill="#6D28D9" rx="2" />
                <rect x="220" y="530" width="30" height="50" fill="#6D28D9" rx="2" />
                <rect x="260" y="530" width="30" height="50" fill="#6D28D9" rx="2" />
                <text x="95" y="605" fill="#DDD6FE" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  STAGE 5: LEAD-CARBON MATRIX
                </text>
                <text x="95" y="625" fill="#A78BFA" fontSize="9" fontFamily="monospace">
                  C_dl Hybrid Chemical Capacitor
                </text>
                <text x="95" y="640" fill="#8B5CF6" fontSize="9" fontFamily="monospace">
                  15°C Chilled Bedrock Heat Sink
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Right Column: Detailed Engineering Inspector (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="p-6 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-5">
            {/* Header Lockup */}
            <div className="flex flex-col gap-1 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded">
                  DEPTH: {selectedStage.depthRange}
                </span>
                <span className="text-xs font-mono text-slate-500 uppercase">
                  CATEGORY: {selectedStage.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight mt-1" style={{ fontFamily: 'var(--font-tech)' }}>
                {selectedStage.title}
              </h3>
              <p className="text-xs text-amber-400 font-mono">{selectedStage.subtitle}</p>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed">{selectedStage.description}</p>

            {/* Chemical Equations (if available) */}
            {selectedStage.chemicalEquations && selectedStage.chemicalEquations.length > 0 && (
              <div className="p-4 bg-[#080B10] border border-slate-800 rounded-lg flex flex-col gap-2">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
                  THERMODYNAMIC &amp; BIOCHEMICAL REACTIONS
                </span>
                <div className="flex flex-col gap-1.5 font-mono text-xs text-cyan-300">
                  {selectedStage.chemicalEquations.map((eq, i) => (
                    <div key={i} className="p-2 bg-slate-900/60 rounded border border-slate-800/80">
                      <code>{eq}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Specifications Grid */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
                ENGINEERING SPECIFICATIONS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(selectedStage.technicalSpecs).map(([label, val], i) => (
                  <div key={i} className="p-3 bg-slate-900/60 border border-slate-800 rounded flex flex-col gap-0.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{label}</span>
                    <span className="text-xs font-mono font-semibold text-slate-200">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Structural Advantages & Trade-Offs */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
                SUBTERRANEAN MECHANICAL ADVANTAGES
              </span>
              <ul className="flex flex-col gap-1.5 text-xs text-slate-300">
                {selectedStage.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
