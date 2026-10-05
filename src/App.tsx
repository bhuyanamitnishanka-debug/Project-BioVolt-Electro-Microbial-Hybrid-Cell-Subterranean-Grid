/**
 * Project BioVolt: Architecting the Electro-Microbial Hybrid Cell (EMHC)
 * Under-Earth Electro-Microbial Grid (UE-EMG) Master Application
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Simulator } from './components/Simulator';
import { CaissonArchitecture } from './components/CaissonArchitecture';
import { GraphicNovel } from './components/GraphicNovel';
import { FirmwareStudio } from './components/FirmwareStudio';
import { BiochemicalCalculator } from './components/BiochemicalCalculator';
import { PortfolioSuite } from './components/PortfolioSuite';
import { TelemetryTestingStudio } from './components/TelemetryTestingStudio';
import { CncManufacturingStudio } from './components/CncManufacturingStudio';
import { AutomationOtaStudio } from './components/AutomationOtaStudio';
import { CareerPortfolioHub } from './components/CareerPortfolioHub';
import { ReadmeGenerator } from './components/ReadmeGenerator';
import { TroubleshootingCliStudio } from './components/TroubleshootingCliStudio';
import { generatePlotSimulationScript } from './services/simulationEngine';


export default function App() {
  const [activeTab, setActiveTab] = useState<string>('simulator');

  const handleExportPython = () => {
    const defaultParams = {
      chemistry: 'lead_carbon' as const,
      cCapacitive: 5000.0,
      maxFaradaicAh: 120.0,
      rInternal: 0.015,
      iBioAnode: 0.85,
      iSofc: 50.0,
      sofcBurnMode: 'dual' as const,
      sofcBurnStartMin: 360,
      sofcBurnDurationMin: 20,
      loadBurstA: 0.0,
      loadBurstStartMin: 1080,
      loadBurstDurationMin: 20,
      ambientTempC: 15.0,
      enableArrhenius: true,
      simulateNoonCompostSpike: true,
    };
    const script = generatePlotSimulationScript(defaultParams);
    const blob = new Blob([script], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plot_simulation.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 flex flex-col">
      {/* Strict 3-Zone Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportPython={handleExportPython}
        liveStatus="nominal"
      />

      {/* Main Content Workspace Container (1440px desktop baseline) */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'simulator' && <Simulator />}
        {activeTab === 'caisson' && <CaissonArchitecture />}
        {activeTab === 'diagnostics' && <TroubleshootingCliStudio />}
        {activeTab === 'cnc' && <CncManufacturingStudio />}
        {activeTab === 'ota' && <AutomationOtaStudio />}
        {activeTab === 'telemetry' && <TelemetryTestingStudio />}
        {activeTab === 'careers' && <CareerPortfolioHub />}
        {activeTab === 'readme_gen' && <ReadmeGenerator />}
        {activeTab === 'comic' && <GraphicNovel />}

        {activeTab === 'firmware' && <FirmwareStudio />}
        {activeTab === 'calculator' && <BiochemicalCalculator />}
        {activeTab === 'portfolio' && <PortfolioSuite />}
      </main>

      {/* Clean Scientific Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#070A10] px-6 py-5 text-xs font-mono text-slate-500">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold">Project BioVolt</span>
            <span aria-hidden="true">·</span>
            <span>Electro-Microbial Hybrid Cell (EMHC)</span>
            <span aria-hidden="true">·</span>
            <span>Subterranean Co-Generation (UE-EMG)</span>
            <span aria-hidden="true">·</span>
            <span>MIT Open Source</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Dual SOFC Burns 50A</span>
            <span aria-hidden="true">·</span>
            <span>Geobacter DET 0.85A</span>
            <span aria-hidden="true">·</span>
            <span>3-Axis CNC Casing G-Code</span>
            <span aria-hidden="true">·</span>
            <span>ESP32 OTA Secure</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
