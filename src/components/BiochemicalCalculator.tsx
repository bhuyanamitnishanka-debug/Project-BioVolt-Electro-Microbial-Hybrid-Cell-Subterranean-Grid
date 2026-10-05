/**
 * Project BioVolt: Biochemical Mass Balance & Cell Dimensioning Tool
 * Computes acetate electron flux, required carbon cloth area, and biogas co-gen output
 */

import React, { useState } from 'react';
import { Atom, Scale, Droplet, Flame, Zap, CheckCircle2, ChevronRight } from 'lucide-react';

export const BiochemicalCalculator: React.FC = () => {
  const [wasteCodKgPerDay, setWasteCodKgPerDay] = useState<number>(120); // 120 kg COD/day
  const [coulombicEffPct, setCoulombicEffPct] = useState<number>(88); // 88%
  const [currentDensityAm2, setCurrentDensityAm2] = useState<number>(8.2); // 8.2 A/m²
  const [sofcEffPct, setSofcEffPct] = useState<number>(60); // 60% electrical efficiency

  // Calculations
  // 1 kg COD generates ~0.35 Nm³ of CH4
  const dailyMethaneNm3 = (wasteCodKgPerDay * 0.35 * 0.70); // 70% converted to biogas
  const methaneLhvKwhPerNm3 = 9.94; // kWh per Nm³ of CH4
  const sofcDailyKwh = dailyMethaneNm3 * methaneLhvKwhPerNm3 * (sofcEffPct / 100);
  const sofcAvgKw = sofcDailyKwh / 24;

  // Liquid effluent with remaining 30% COD fed to Bio-Anode (acetate flux)
  const bioCodKgPerDay = wasteCodKgPerDay * 0.30;
  // Faraday's Constant F = 96485 C/mol. Acetate: 1 mol COD ~ 32 g O2 equivalent, 4 mol e- per mol O2 equiv = 4 * 96485 C/32g = 12,060,625 C/kg COD
  const coulombsPerKgCod = 12060625;
  const theoreticalBioCoulombsPerDay = bioCodKgPerDay * coulombsPerKgCod * (coulombicEffPct / 100);
  const avgBioCurrentA = theoreticalBioCoulombsPerDay / 86400; // Average continuous current in Amperes
  const requiredClothAreaM2 = avgBioCurrentA / currentDensityAm2;

  // Daily energy harvested from bio-anode at nominal 0.6V operating potential
  const bioDailyKwh = (avgBioCurrentA * 0.6 * 24) / 1000;
  const totalCombinedKwhPerDay = sofcDailyKwh + bioDailyKwh;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="p-6 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Atom className="w-4 h-4" />
            <span>BIOCHEMICAL MASS-BALANCE &amp; SIZING CALCULATOR</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-tech)' }}>
            Cell Dimensioning &amp; Stoichiometric Dynamics
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Determine the physical volume of subterranean anaerobic digesters, active CNT-carbon cloth
            biofilm surface areas, and dual-phase power outputs for any deployment scale.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
          <span className="text-slate-400">TOTAL COMBINED OUTPUT:</span>
          <span className="text-base font-bold text-emerald-400">
            {totalCombinedKwhPerDay.toFixed(1)} kWh/day
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Parameters (lg:col-span-5) */}
        <div className="lg:col-span-5 p-5 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span>INPUT FEEDSTOCK &amp; ELECTROLYTE</span>
            <span>STOICHIOMETRIC CONTROLS</span>
          </div>

          <div className="flex flex-col gap-4 text-xs font-mono">
            {/* Daily Waste Feed (kg COD/day) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-300">Daily Organic Waste Input:</span>
                <span className="text-amber-400 font-bold tabular-nums">{wasteCodKgPerDay} kg COD/day</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={wasteCodKgPerDay}
                onChange={(e) => setWasteCodKgPerDay(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">Urban food compost or agricultural slurry</span>
            </div>

            {/* Coulombic Efficiency */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-300">Geobacter Coulombic Efficiency:</span>
                <span className="text-emerald-400 font-bold tabular-nums">{coulombicEffPct}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="98"
                step="1"
                value={coulombicEffPct}
                onChange={(e) => setCoulombicEffPct(parseFloat(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">Percentage of electrons harvested from COD</span>
            </div>

            {/* Current Density */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-300">Bio-Anode DET Current Density:</span>
                <span className="text-cyan-400 font-bold tabular-nums">{currentDensityAm2.toFixed(1)} A/m²</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="15.0"
                step="0.2"
                value={currentDensityAm2}
                onChange={(e) => setCurrentDensityAm2(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">Based on CNT-doped conductive carbon cloth</span>
            </div>

            {/* SOFC Efficiency */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-300">SOFC Electrical Efficiency:</span>
                <span className="text-purple-400 font-bold tabular-nums">{sofcEffPct}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="75"
                step="1"
                value={sofcEffPct}
                onChange={(e) => setSofcEffPct(parseFloat(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">Lower Heating Value (LHV) conversion</span>
            </div>
          </div>
        </div>

        {/* Right: Sizing Outputs & Thermodynamic Breakdown (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Sizing Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-[#0D121D] border border-slate-800 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                REQUIRED CNT CLOTH AREA
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-cyan-400 tabular-nums">
                  {requiredClothAreaM2.toFixed(1)}
                </span>
                <span className="text-xs font-mono text-slate-400">m²</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                Cassette stack volume ~{(requiredClothAreaM2 * 0.015).toFixed(2)} m³
              </span>
            </div>

            <div className="p-4 bg-[#0D121D] border border-slate-800 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                CONTINUOUS BIO-CURRENT
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-amber-400 tabular-nums">
                  {avgBioCurrentA.toFixed(1)}
                </span>
                <span className="text-xs font-mono text-slate-400">Amperes</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                24/7/365 metabolic DET trickle
              </span>
            </div>

            <div className="p-4 bg-[#0D121D] border border-slate-800 rounded-lg">
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                SOFC PEAK GENERATION
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-purple-400 tabular-nums">
                  {sofcAvgKw.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-400">kW avg</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                {dailyMethaneNm3.toFixed(1)} Nm³ CH4/day
              </span>
            </div>
          </div>

          {/* Chemical Reaction Breakdown Card */}
          <div className="p-5 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-3">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              FUNDAMENTAL REACTION STOICHIOMETRY
            </span>
            <div className="p-3 bg-[#080B10] border border-slate-800 rounded text-xs font-mono text-slate-300 leading-relaxed space-y-2">
              <div className="text-amber-400 font-semibold">
                Anode: CH₃COO⁻ + 2H₂O ➔ 2CO₂ + 7H⁺ + 8e⁻
              </div>
              <p className="text-[11px] text-slate-400">
                Each mole of acetate provides 8 moles of electrons transferred through outer-membrane
                cytochromes directly into the carbon nanotube matrix. 
              </p>
              <div className="text-cyan-400 font-semibold pt-1 border-t border-slate-800/80">
                Cathode: O₂ + 4H⁺ + 4e⁻ ➔ 2H₂O (or Pb-C Intercalation)
              </div>
              <p className="text-[11px] text-slate-400">
                In hybrid mode, electrons migrate into the asymmetric Lead-Carbon double-layer capacitor,
                eliminating reliance on atmospheric oxygen cathode reduction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
