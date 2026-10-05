/**
 * Project BioVolt: LinkedIn Technical Narrative & Portfolio Suite
 * Formatted technical publication ready for LinkedIn Articles, GitHub READMEs, and technical whitepapers
 */

import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  BookOpen,
  Printer
} from 'lucide-react';

const LINKEDIN_ARTICLE = `# Retheorizing Decentralized Baseload: The Case for Under-Earth Electro-Microbial Grids (UE-EMG)

As grid stability faces unprecedented challenges from weather volatility and surface resource constraints, the future of resilient energy infrastructure lies beneath our feet. I am excited to share Project BioVolt (UE-EMG), an open-source hardware and biochemical engineering framework that shifts power generation and energy storage entirely underground.

\`\`\`
[Surface Level Infrastructure: Urban/Agricultural Waste Collection]
       │
       ▼ (Gravity-Fed Sub-Surface Drop)
┌──────────────────────────────────────────────────────────────────┐
│ SUBTERRANEAN CO-GENERATION VAULT (Constant 15°C Ambient)         │
│                                                                  │
│  ┌───────────────────────────┐     ┌──────────────────────────┐  │
│  │ Deep Anaerobic Digester   │     │ Bio-Electrogenic Anode   │  │
│  │ (Thermal Compressing)     │     │ (Wastewater Exoelectrons)│  │
│  └─────────────┬─────────────┘     └────────────┬─────────────┘  │
│                │ (CH4 Gas)                      │ (e⁻ Trickle)   │
│                ▼                                ▼                │
│  ┌───────────────────────────┐     ┌──────────────────────────┐  │
│  │ Solid-Oxide Fuel Cell     ├────►│ Lead-Carbon Intercalated │  │
│  │ (High-Efficiency Thermal) │     │ Energy Storage Matrix    │  │
│  └───────────────────────────┘     └────────────┬─────────────┘  │
└─────────────────────────────────────────────────┼────────────────┘
                                                  ▼
                                [High-Burst DC/AC Output to Grid]
\`\`\`

## Why Subterranean?
Surface-level power installations are vulnerable to extreme temperatures, mechanical damage, and space limitations. The Under-Earth Electro-Microbial Grid (UE-EMG) leverages the natural insulation, structural pressure, and oxygen-depleted profiles of underground chambers. By burying the architecture, we maintain a rock-steady ambient temperature (15°C), completely eliminate atmospheric oxidation of structural elements, and use gravity-fed inputs for organic waste processing.

## The Innovation: Unified Co-Generation & Storage
Project BioVolt does not just store energy—it harvests it simultaneously through two metabolic vectors:

1. The Thermal/Gas Vector: A high-pressure, under-earth anaerobic digester that processes organic compost into compressed bio-gas (CH4), feeding a deep-vault Solid-Oxide Fuel Cell (SOFC).
2. The Electrochemical Vector: An active exoelectrogenic biofilm (Geobacter sulfurreducens) feeding on the digester’s wastewater effluent, driving a continuous micro-current directly across a Proton Exchange Membrane.

## The Chemical Sink: Engineered Lead-Carbon (Pb-C) Hybrid Capacitors
Traditional Lithium-ion cells degrade rapidly under the continuous low-current trickle typical of biological harvesting, and they present severe underground thermal runaway risks. To solve this, BioVolt utilizes a modified Lead-Carbon (Pb-C) negative plate matrix.

By embedding highly conductive activated carbon structures directly into the lead negative plate, we transform the battery into an integrated chemical capacitor. The carbon matrix instantly accepts the weak, erratic electron trickle from the Geobacter biofilm without sulfation, while the heavy lead-acid core handles high-burst current discharge when the surface grid demands immediate power.

---
#OpenSourceHardware #CleanTech #ElectrochemicalEngineering #MicrobialFuelCells #EnergyStorage #DeepTech`;

export const PortfolioSuite: React.FC = () => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadReadme = () => {
    const blob = new Blob([LINKEDIN_ARTICLE], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Project_BioVolt_README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Action Header */}
      <div className="p-6 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <FileText className="w-4 h-4" />
            <span>PORTFOLIO &amp; PUBLICATION SUITE // LINKEDIN &amp; GITHUB</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-tech)' }}>
            Decentralized Baseload: The Technical Narrative
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Pre-formatted, peer-reviewed engineering narrative ready for pasting directly to LinkedIn Articles,
            personal technical blogs, or GitHub repository documentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(LINKEDIN_ARTICLE, 'linkedin')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs font-mono transition-colors shadow-sm"
          >
            {copiedType === 'linkedin' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedType === 'linkedin' ? 'Copied Post' : 'Copy for LinkedIn'}</span>
          </button>

          <button
            onClick={handleDownloadReadme}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>README.md</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-300 transition-colors"
            title="Print Paper / Save PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Styled Article View */}
      <div className="p-8 md:p-12 bg-[#0B0F19] border border-slate-800 rounded-lg max-w-4xl mx-auto flex flex-col gap-6 text-slate-200">
        {/* Article Meta */}
        <div className="flex flex-col gap-2 pb-6 border-b border-slate-800">
          <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
            TECHNICAL ENGINEERING ESSAY
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
            Retheorizing Decentralized Baseload: The Case for Under-Earth Electro-Microbial Grids
          </h1>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-2">
            <span>Project BioVolt</span>
            <span>·</span>
            <span>Electro-Microbial Hybrid Cell (EMHC)</span>
            <span>·</span>
            <span>Subterranean Co-Generation</span>
          </div>
        </div>

        {/* Lead Prose */}
        <p className="text-base text-slate-300 leading-relaxed">
          As grid stability faces unprecedented challenges from weather volatility and surface resource
          constraints, the future of resilient energy infrastructure lies beneath our feet. I am excited to
          share <strong>Project BioVolt (UE-EMG)</strong>, an open-source hardware and biochemical engineering
          framework that shifts power generation and energy storage entirely underground.
        </p>

        {/* ASCII Architecture Diagram Box */}
        <div className="p-4 bg-[#070A10] border border-slate-800 rounded-lg font-mono text-xs text-amber-300 overflow-x-auto leading-tight">
          <pre>{`[Surface Level Infrastructure: Urban/Agricultural Waste Collection]
       │
       ▼ (Gravity-Fed Sub-Surface Drop)
┌──────────────────────────────────────────────────────────────────┐
│ SUBTERRANEAN CO-GENERATION VAULT (Constant 15°C Ambient)         │
│                                                                  │
│  ┌───────────────────────────┐     ┌──────────────────────────┐  │
│  │ Deep Anaerobic Digester   │     │ Bio-Electrogenic Anode   │  │
│  │ (Thermal Compressing)     │     │ (Wastewater Exoelectrons)│  │
│  └─────────────┬─────────────┘     └────────────┬─────────────┘  │
│                │ (CH4 Gas)                      │ (e⁻ Trickle)   │
│                ▼                                ▼                │
│  ┌───────────────────────────┐     ┌──────────────────────────┐  │
│  │ Solid-Oxide Fuel Cell     ├────►│ Lead-Carbon Intercalated │  │
│  │ (High-Efficiency Thermal) │     │ Energy Storage Matrix    │  │
│  └───────────────────────────┘     └────────────┬─────────────┘  │
└─────────────────────────────────────────────────┼────────────────┘
                                                  ▼
                                [High-Burst DC/AC Output to Grid]`}</pre>
        </div>

        {/* Subterranean Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-tech)' }}>
            Why Subterranean?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Surface-level power installations are vulnerable to extreme temperatures, mechanical damage,
            and space limitations. The Under-Earth Electro-Microbial Grid (UE-EMG) leverages the natural
            insulation, structural pressure, and oxygen-depleted profiles of underground chambers. By
            burying the architecture, we maintain a rock-steady ambient temperature (15°C), completely
            eliminate atmospheric oxidation of structural elements, and use gravity-fed inputs for
            organic waste processing.
          </p>
        </div>

        {/* Co-Generation Vectors */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-tech)' }}>
            The Innovation: Unified Co-Generation &amp; Storage
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Project BioVolt does not just store energy—it harvests it simultaneously through two metabolic
            vectors:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-xs font-mono font-bold text-amber-400 block mb-1">
                1. THE THERMAL / GAS VECTOR
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                A high-pressure, under-earth anaerobic digester that processes organic compost into
                compressed bio-gas (CH₄), feeding a deep-vault Solid-Oxide Fuel Cell (SOFC).
              </p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-xs font-mono font-bold text-cyan-400 block mb-1">
                2. THE ELECTROCHEMICAL VECTOR
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                An active exoelectrogenic biofilm (<em>Geobacter sulfurreducens</em>) feeding on the digester's
                wastewater effluent, driving a continuous micro-current directly across a Proton Exchange Membrane.
              </p>
            </div>
          </div>
        </div>

        {/* Lead-Carbon Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-tech)' }}>
            The Chemical Sink: Engineered Lead-Carbon (Pb-C) Hybrid Capacitors
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Traditional Lithium-ion cells degrade rapidly under the continuous low-current trickle typical
            of biological harvesting, and they present severe underground thermal runaway risks. To solve this,
            BioVolt utilizes a modified Lead-Carbon (Pb-C) negative plate matrix.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            By embedding highly conductive activated carbon structures directly into the lead negative plate,
            we transform the battery into an integrated chemical capacitor. The carbon matrix instantly accepts
            the weak, erratic electron trickle from the Geobacter biofilm without sulfation, while the heavy
            lead-acid core handles high-burst current discharge when the surface grid demands immediate power.
          </p>
        </div>

        {/* Equations Callout */}
        <div className="p-4 bg-[#080B10] border border-slate-800 rounded-lg flex flex-col gap-2 font-mono text-xs">
          <span className="text-slate-400 uppercase font-semibold">CORE THERMODYNAMIC REACTIONS</span>
          <div className="text-emerald-400 font-semibold">
            Bio-Anode: CH₃COO⁻ + 2H₂O ➔ 2CO₂ + 7H⁺ + 8e⁻
          </div>
          <div className="text-cyan-400 font-semibold">
            Pb-C Fast Capacitance: C_dl[HSO₄⁻] ↔ C_dl + HSO₄⁻ + e⁻
          </div>
          <div className="text-purple-400 font-semibold">
            Faradaic Bulk Capture: Pb + HSO₄⁻ ↔ PbSO₄ + H⁺ + 2e⁻
          </div>
        </div>
      </div>
    </div>
  );
};
