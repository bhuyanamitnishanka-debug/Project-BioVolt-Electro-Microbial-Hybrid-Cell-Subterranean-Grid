/**
 * Project BioVolt: Electrochemical Matrix Simulator
 * Interactive dynamic execution of the LeadCarbonBioBattery model with Recharts & SVG charting
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Activity,
  Layers,
  Thermometer,
  ShieldAlert,
  Download,
  Copy,
  Check,
  TrendingUp,
  Flame,
  Cpu,
  BarChart3
} from 'lucide-react';
import { BatteryParameters, SimulationStepResult } from '../types/biovolt';
import {
  BioVoltSimulator,
  runSimulationBatch,
  generatePlotSimulationScript,
  generateSimulatorV2Script,
} from '../services/simulationEngine';
import { RechartsBatteryCurves } from './RechartsBatteryCurves';

const DEFAULT_PARAMS: BatteryParameters = {
  chemistry: 'lead_carbon',
  cCapacitive: 5000.0,
  maxFaradaicAh: 120.0,
  rInternal: 0.015,
  iBioAnode: 0.85,
  iSofc: 50.0, // 50A high-burst feed from bio-gas combustion
  sofcBurnMode: 'dual', // Dual burn matching plot_simulation.py (Hour 6 and Hour 18)
  sofcBurnStartMin: 360, // 06:00
  sofcBurnDurationMin: 20, // 20 minutes
  sofcBurn2StartMin: 1080, // 18:00
  loadBurstA: 0.0,
  loadBurstStartMin: 1080,
  loadBurstDurationMin: 20,
  ambientTempC: 15.0, // Constant 15°C subterranean baseline
  enableArrhenius: true, // Arrhenius biological response
  simulateNoonCompostSpike: true, // 35°C spike at noon
};

export const Simulator: React.FC = () => {
  const [params, setParams] = useState<BatteryParameters>(DEFAULT_PARAMS);
  const [simResults, setSimResults] = useState<SimulationStepResult[]>([]);
  const [currentStep, setCurrentStep] = useState<SimulationStepResult | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(100);
  const [chartViewMode, setChartViewMode] = useState<'recharts' | 'raw_svg'>('recharts');
  const [showPythonModal, setShowPythonModal] = useState<boolean>(false);
  const [pythonScriptTab, setPythonScriptTab] = useState<'plot_sim' | 'sim_v2'>('plot_sim');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [selectedDurationHours, setSelectedDurationHours] = useState<number>(24);

  // Real-time animation ref
  const simulatorRef = useRef<BioVoltSimulator | null>(null);
  const simTimeSecRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Run initial batch simulation on parameter changes
  useEffect(() => {
    const results = runSimulationBatch(params, selectedDurationHours, 280);
    setSimResults(results);
    setCurrentStep(results[results.length - 1]);
    simulatorRef.current = new BioVoltSimulator(params);
    simTimeSecRef.current = 0;
  }, [params, selectedDurationHours]);

  // Real-time tick loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      const deltaSec = (now - lastTimestamp) / 1000.0;
      lastTimestamp = now;

      const virtualDelta = deltaSec * playbackSpeed;
      simTimeSecRef.current += virtualDelta;

      if (simulatorRef.current) {
        const stepRes = simulatorRef.current.step(simTimeSecRef.current, 1.0);
        setCurrentStep(stepRes);
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const handleReset = () => {
    setIsPlaying(false);
    simTimeSecRef.current = 0;
    const results = runSimulationBatch(params, selectedDurationHours, 280);
    setSimResults(results);
    setCurrentStep(results[0]);
    if (simulatorRef.current) {
      simulatorRef.current.reset(params);
    }
  };

  const handleCopyPython = () => {
    const script =
      pythonScriptTab === 'plot_sim'
        ? generatePlotSimulationScript(params)
        : generateSimulatorV2Script();
    navigator.clipboard.writeText(script);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadPython = () => {
    const script =
      pythonScriptTab === 'plot_sim'
        ? generatePlotSimulationScript(params)
        : generateSimulatorV2Script();
    const filename =
      pythonScriptTab === 'plot_sim' ? 'plot_simulation.py' : 'simulator_v2.py';
    const blob = new Blob([script], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const displayPoint = currentStep || (simResults.length ? simResults[simResults.length - 1] : null);

  return (
    <div className="flex flex-col gap-5">
      {/* Top Telemetry Precision Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3 bg-[#0D121D] border border-slate-800 rounded-lg text-xs font-mono">
        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400">STATUS:</span>
            <span className="text-white font-semibold">COUPLED NOMINAL</span>
          </div>
          <span className="text-slate-700" aria-hidden="true">|</span>
          <div>
            <span className="text-slate-400">BEDROCK VAULT:</span>{' '}
            <span className="text-amber-400 font-semibold">{displayPoint ? displayPoint.temperatureC : params.ambientTempC}°C</span>
          </div>
          <span className="text-slate-700 hidden sm:inline" aria-hidden="true">|</span>
          <div className="hidden sm:inline">
            <span className="text-slate-400">DOUBLE-LAYER MATRIX:</span>{' '}
            <span className="text-cyan-400 font-semibold">{params.cCapacitive} F</span>
          </div>
          <span className="text-slate-700 hidden md:inline" aria-hidden="true">|</span>
          <div className="hidden md:inline">
            <span className="text-slate-400">SOFC BURNS:</span>{' '}
            <span className="text-purple-400 font-semibold">
              {params.sofcBurnMode === 'dual' ? '2x BURNS (06:00 & 18:00)' : '1x BURN'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Chart View Mode Switcher */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded">
            <button
              onClick={() => setChartViewMode('recharts')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] rounded transition-colors ${
                chartViewMode === 'recharts'
                  ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              <span>Recharts View</span>
            </button>
            <button
              onClick={() => setChartViewMode('raw_svg')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] rounded transition-colors ${
                chartViewMode === 'raw_svg'
                  ? 'bg-amber-400/20 text-amber-400 font-bold border border-amber-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Real-Time SVG</span>
            </button>
          </div>

          <button
            onClick={() => setShowPythonModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 rounded transition-all"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Python Scripts</span>
          </button>
        </div>
      </div>

      {/* Asymmetric Split Console: Left Controls (340px) + Main Viewport (Flex-1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Control Column (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-5 p-5 bg-[#0D121D] border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
                Electrochemical Controls
              </h2>
            </div>
            <button
              onClick={handleReset}
              title="Reset to defaults"
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SOFC Burn Mode Toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-slate-400">SOFC BIO-GAS BURN SCHEDULE</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setParams({ ...params, sofcBurnMode: 'dual' })}
                className={`flex flex-col items-start p-2.5 rounded border text-left transition-all ${
                  params.sofcBurnMode === 'dual'
                    ? 'border-amber-400/60 bg-amber-400/10 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold font-mono">Dual-Burn Cycles</span>
                <span className="text-[10px] text-slate-400 mt-0.5">06:00 &amp; 18:00 (20m burns)</span>
              </button>
              <button
                onClick={() => setParams({ ...params, sofcBurnMode: 'single' })}
                className={`flex flex-col items-start p-2.5 rounded border text-left transition-all ${
                  params.sofcBurnMode === 'single'
                    ? 'border-cyan-400/60 bg-cyan-400/10 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold font-mono">Single Burn</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Custom Start Time</span>
              </button>
            </div>
          </div>

          {/* Parameter Sliders */}
          <div className="flex flex-col gap-4 text-xs font-mono">
            {/* SOFC Fuel Cell Burst */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-300">SOFC Burn Current:</span>
                <span className="text-amber-400 font-semibold tabular-nums">{params.iSofc.toFixed(1)} A</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="100.0"
                step="5.0"
                value={params.iSofc}
                onChange={(e) => setParams({ ...params, iSofc: parseFloat(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">
                High-burst feed from compressed bio-gas combustion
              </span>
            </div>

            {/* Capacitive Matrix (C_dl) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-300">Double-Layer Capacitance (C_dl):</span>
                <span className="text-cyan-400 font-semibold tabular-nums">{params.cCapacitive} Farads</span>
              </div>
              <input
                type="range"
                min="1000"
                max="15000"
                step="500"
                value={params.cCapacitive}
                onChange={(e) => setParams({ ...params, cCapacitive: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">
                Activated carbon structure cushions 50A influx without plate damage
              </span>
            </div>

            {/* Faradaic Core Capacity (Ah) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-300">Faradaic Storage Capacity:</span>
                <span className="text-emerald-400 font-semibold tabular-nums">{params.maxFaradaicAh} Ah</span>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                step="10"
                value={params.maxFaradaicAh}
                onChange={(e) => setParams({ ...params, maxFaradaicAh: parseFloat(e.target.value) })}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">
                High-capacity bulk lead core (Pb + HSO4- ↔ PbSO4)
              </span>
            </div>

            {/* Arrhenius Temperature Kinetics Toggles */}
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold">Arrhenius Kinetics:</span>
                <input
                  type="checkbox"
                  checked={params.enableArrhenius}
                  onChange={(e) => setParams({ ...params, enableArrhenius: e.target.checked })}
                  className="accent-amber-400 w-4 h-4 cursor-pointer"
                />
              </div>
              <span className="text-[10px] text-slate-500">
                Modulates Geobacter DET current across biological temperature window
              </span>

              {params.enableArrhenius && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400">12:00 Compost Heat Spike (35°C):</span>
                  <input
                    type="checkbox"
                    checked={params.simulateNoonCompostSpike}
                    onChange={(e) => setParams({ ...params, simulateNoonCompostSpike: e.target.checked })}
                    className="accent-amber-400 w-4 h-4 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Execution Controls */}
          <div className="flex flex-col gap-2 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-semibold font-mono transition-all ${
                  isPlaying
                    ? 'bg-rose-500 hover:bg-rose-400 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Real-Time</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Real-Time</span>
                  </>
                )}
              </button>

              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="px-2 py-2 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-400"
              >
                <option value={10}>10x</option>
                <option value={50}>50x</option>
                <option value={100}>100x</option>
                <option value={500}>500x</option>
                <option value={1000}>1000x</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Viewport Stage: Recharts Component (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Key Metric Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-[#0D121D] border border-slate-800 rounded-lg">
              <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 block mb-1">
                CELL VOLTAGE (V)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-cyan-400 tabular-nums">
                  {displayPoint ? displayPoint.vCell.toFixed(3) : '1.800'}
                </span>
                <span className="text-xs font-mono text-slate-500 uppercase">V</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                Ceiling: 2.45V (Pb-C safe)
              </span>
            </div>

            <div className="p-4 bg-[#0D121D] border border-slate-800 rounded-lg">
              <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 block mb-1">
                FARADAIC STATE OF CHARGE
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                  {displayPoint ? displayPoint.socPercent.toFixed(1) : '20.0'}
                </span>
                <span className="text-xs font-mono text-slate-500">%</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                {displayPoint ? (displayPoint.socFaradaic * params.maxFaradaicAh).toFixed(1) : '24.0'} / {params.maxFaradaicAh} Ah
              </span>
            </div>

            <div className="p-4 bg-[#0D121D] border border-slate-800 rounded-lg">
              <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 block mb-1">
                CAPACITOR CHARGE (Q_DL)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-amber-400 tabular-nums">
                  {displayPoint ? displayPoint.qCapacitive.toFixed(0) : '0'}
                </span>
                <span className="text-xs font-mono text-slate-500 uppercase">Coulombs</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                Fast EDLC cushion
              </span>
            </div>

            <div className="p-4 bg-[#0D121D] border border-slate-800 rounded-lg">
              <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 block mb-1">
                ACCUMULATED ENERGY
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold text-purple-400 tabular-nums">
                  {displayPoint ? displayPoint.accumulatedWh.toFixed(1) : '0.0'}
                </span>
                <span className="text-xs font-mono text-slate-500 uppercase">Wh</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                Net Harvested Co-Gen
              </span>
            </div>
          </div>

          {/* High-Resolution Recharts Battery Curves Component */}
          <RechartsBatteryCurves
            data={simResults}
            params={params}
            simHours={selectedDurationHours}
          />
        </div>
      </div>

      {/* Python Script Modal */}
      {showPythonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[85vh] flex flex-col bg-[#0B0F19] border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#0D121D]">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-amber-400" />
                <div className="flex items-center gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded text-xs font-mono">
                  <button
                    onClick={() => setPythonScriptTab('plot_sim')}
                    className={`px-3 py-1 rounded transition-colors ${
                      pythonScriptTab === 'plot_sim'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    plot_simulation.py (Matplotlib Dual-Axis)
                  </button>
                  <button
                    onClick={() => setPythonScriptTab('sim_v2')}
                    className={`px-3 py-1 rounded transition-colors ${
                      pythonScriptTab === 'sim_v2'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    simulator_v2.py (Arrhenius Kinetics)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPython}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadPython}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-950 bg-amber-400 hover:bg-amber-300 rounded font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .py</span>
                </button>
                <button
                  onClick={() => setShowPythonModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-[#070A10] font-mono text-xs text-slate-300 leading-relaxed">
              <pre className="text-slate-300 selection:bg-amber-400/20">
                {pythonScriptTab === 'plot_sim'
                  ? generatePlotSimulationScript(params)
                  : generateSimulatorV2Script()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
