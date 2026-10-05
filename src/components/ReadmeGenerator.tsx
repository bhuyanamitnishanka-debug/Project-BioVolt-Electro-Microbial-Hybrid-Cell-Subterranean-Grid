/**
 * Project BioVolt: Structured Markdown README Generator Utility
 * Dynamically generates, customizes, previews, and exports a production-grade README.md
 * with technical architecture, installation steps, and hardware blueprints.
 */

import React, { useState, useMemo } from 'react';
import {
  FileCode2,
  Copy,
  Check,
  Download,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  Wrench,
  Cpu,
  Terminal,
  Printer
} from 'lucide-react';

interface ReadmeOptions {
  includeBadges: boolean;
  includeArchitecture: boolean;
  includeInstallation: boolean;
  includeHardwareBlueprints: boolean;
  includeFirmwareSpecs: boolean;
  includePemSpecs: boolean;
  includeSimulationMath: boolean;
  includeTroubleshooting: boolean;
  includeCapitalLedger: boolean;
  includeMultilingual: boolean;
  includeInterviewCheatSheet: boolean;
  repoUrl: string;
  caissonDepthMeters: number;
  batteryAh: number;
}

const DEFAULT_OPTIONS: ReadmeOptions = {
  includeBadges: true,
  includeArchitecture: true,
  includeInstallation: true,
  includeHardwareBlueprints: true,
  includeFirmwareSpecs: true,
  includePemSpecs: true,
  includeSimulationMath: true,
  includeTroubleshooting: true,
  includeCapitalLedger: true,
  includeMultilingual: true,
  includeInterviewCheatSheet: true,
  repoUrl: 'https://github.com/bhuyanamitnishanka/project-biovolt',
  caissonDepthMeters: 25,
  batteryAh: 120,
};

export const ReadmeGenerator: React.FC = () => {
  const [options, setOptions] = useState<ReadmeOptions>(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'preview' | 'raw'>('preview');

  // Generate the dynamic Markdown string
  const markdownContent = useMemo(() => {
    let md = '';

    // Title & Header Badges
    md += `# Project BioVolt: Under-Earth Electro-Microbial Grid (UE-EMG)\n`;
    md += `### Subterranean Co-Generation Infrastructure Using Deep-Compost Bio-Gas Matrix & Lead-Carbon Intercalated Capacitive Storage\n\n`;

    if (options.includeBadges) {
      md += `[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT) `;
      md += `[![Hardware: Open-Source](https://img.shields.io/badge/Hardware-CERN--OHL-blue.svg)](https://ohwr.org) `;
      md += `[![CI: Testing Suite](https://img.shields.io/badge/CI-Automated_Testing-emerald.svg)](${options.repoUrl}/actions) `;
      md += `[![Python: 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/) `;
      md += `[![C++: Arduino/ESP32](https://img.shields.io/badge/Firmware-ESP32%2FArduino-purple.svg)](https://espressif.com)\n\n`;
    }

    md += `Project BioVolt is an open-source hardware, embedded telemetry, and biochemical engineering framework designed to bridge organic metabolic energy harvesting (*Geobacter sulfurreducens*) with high-rate **Asymmetric Lead-Carbon (Pb-C) chemical capacitor storage**. Sinking both generation and storage into deep subterranean pre-cast concrete caissons (${options.caissonDepthMeters}m depth) maintains an isothermal baseline ambient temperature ($15^\\circ\\text{C}$), completely eliminates structural atmospheric oxidation, and leverages passive hydrostatic compression for organic waste slurry processing.\n\n`;

    md += `---\n\n`;

    // 1. Technical Architecture
    if (options.includeArchitecture) {
      md += `## 🏗️ 1. Technical System Architecture & Co-Generation Topology\n\n`;
      md += `Project BioVolt shifts baseload energy harvesting underground through two unified metabolic co-generation vectors:\n\n`;
      md += `\`\`\`
[Surface Level Infrastructure: Urban/Agricultural Waste Intake]
       │
       ▼ (Gravity-Fed Sub-Surface Drop & Hydrostatic Compression)
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
\`\`\`\n\n`;

      md += `### Subterranean Caisson Vertical Stratification (0m to ${options.caissonDepthMeters}m)
| Depth Window | Functional Module | Working Substrate / Component | Engineering Role |
| :--- | :--- | :--- | :--- |
| **0m – 5m** | Waste Intake Portal | Dual-gate sealed drop column | Gravity-fed hydrostatic compression (0.48 bar) |
| **5m – 12m** | Deep Anaerobic Digester | Methanogenic archaea ($37^\\circ\\text{C}$) | Produces compressed biogas mix (65% $\\text{CH}_4$) |
| **12m – 16m** | Solid-Oxide Fuel Cell (SOFC) | Aerogel-jacketed ceramic stack | Thermal co-gen converting methane to 50A burst DC |
| **16m – 20m** | Exoelectrogenic Bio-Anode | *Geobacter sulfurreducens* on CNT-cloth | Continuous metabolic electron trickle via conductive pili |
| **20m – ${options.caissonDepthMeters}m** | Lead-Carbon (Pb-C) Matrix | Asymmetric activated carbon plate | $C_{\\text{dl}} = 5000\\text{F}$ capacitor + ${options.batteryAh}\\text{Ah}$ Faradaic lead core |
| **${options.caissonDepthMeters}m** | Bedrock Heat Exchanger | Basalt crust geothermal sink | Maintains constant $15^\\circ\\text{C}$ isothermal stability |\n\n`;
    }

    // 2. Hardware Blueprints & PEM Nanoscale Specs
    if (options.includeHardwareBlueprints) {
      md += `## 🔬 2. Hardware Blueprints & Physical Fabrication\n\n`;
      md += `### A. Prototype Casing CNC Toolpaths (\`casing_milling.gcode\`)
The physical laboratory prototype utilizes an optical-grade 15mm cast acrylic enclosure milled on a 3-axis CNC router:
- **Spindle Speed:** 2400 RPM optimization ceiling with continuous flood coolant loop
- **Tooling:** 4mm flat-bottom two-flute carbide end mill
- **Chambers:** Dual symmetrical pockets:
  - *Well Alpha (Bio-Anode):* $40\\text{mm} \\times 40\\text{mm} \\times 5\\text{mm}$
  - *Well Beta (Lead-Carbon Matrix):* $40\\text{mm} \\times 40\\text{mm} \\times 5\\text{mm}$
  - *Central Channel:* Machined bridge for the Proton Exchange Membrane (PEM) gasket slot

Execute toolpaths via standard CNC G-code senders (Universal Gcode Sender, bCNC, or LinuxCNC):
\`\`\`gcode
G21 (Metric)
G90 (Absolute)
M03 S2400 (Spindle On)
M08 (Flood Coolant Active)
G00 X30 Y40 Z5 (Rapid to Well Alpha)
G01 Z-5 F120 (Plunge pass to -5mm)
\`\`\`\n\n`;
    }

    if (options.includePemSpecs) {
      md += `### B. Nanoscale Proton Transport & Anodic Isolation Interface [BLOCK: UE-EMG-PEM-04]
- **Membrane Substrate:** Perfluorosulfonic acid (PFSA) fluoropolymer matrix (Nafion-class standard), thermally cross-linked.
- **Hydrophilic Nanopores:** Sulfonic acid ($-SO_3^-H^+$) side-chain clusters along a hydrophobic PTFE backbone.
- **Transport Kinetics:** Protons migrate via the **Grotthuss hop mechanism** ($H_3O^+$ dynamic hydrogen-bond cleavage) and vehicular diffusion.
- **Cytotoxic Shielding:** Completely prevents the reverse-migration of heavy metallic lead ions ($Pb^{2+}$) or sulfate anions ($SO_4^{2-}$), mitigating bacterial poisoning.\n\n`;
    }

    // 3. Embedded Firmware & Telemetry Architecture
    if (options.includeFirmwareSpecs) {
      md += `## 📡 3. Embedded Firmware & Telemetry Pipeline\n\n`;
      md += `The embedded microcontroller layer (Nordic nRF52840 / ESP32-S3 / STM32) executes autonomous Maximum Power Point Tracking (MPPT) and Over-The-Air (OTA) firmware updates:\n\n`;
      md += `- **\`bio_harvest_pmic.ino\`**: Dynamically tracks bio-anode voltage on Pin A0. Clamps open-circuit voltage at an 80% threshold ($V_{\\text{OCV}}$) using burst-mode PWM modulation (Pin 12) to prevent microbial gradient collapse. Includes glucose exhaustion cutoff ($0.35\\text{V}$).
- **\`telemetry_encoder.ino\`**: Encodes raw analog biological voltage, cell IR, and bedrock thermistor temperatures into lightweight nested JSON strings via \`ArduinoJson\`.
- **\`command_decoder.ino\`**: Parses incoming network commands over Serial/MQTT to execute emergency remote hardware actions (\`"FORCE_ISOLATE"\`, \`"RESUME_HARVEST"\`, \`"set_mppt_floor_v"\`).
- **\`bio_ota_firmware.ino\`**: Subterranean Over-The-Air (OTA) binary updates using native ESP32 \`Update.h\`, validating partition space and MD5 checksums before triggering hot-resets.\n\n`;
    }

    // 4. Mathematical Modeling & Simulation
    if (options.includeSimulationMath) {
      md += `## 🧮 4. Electrochemical Storage & Arrhenius Kinetics Math\n\n`;
      md += `### Thermodynamic & Double-Layer Equations:
$$\\text{Bio-Anode Oxidation: } \\text{CH}_3\\text{COO}^- + 2\\text{H}_2\\text{O} \\xrightarrow{\\text{Geobacter}} 2\\text{CO}_2 + 7\\text{H}^+ + 8e^-$$
$$\\text{Lead-Carbon Double Layer: } \\text{C}_{\\text{dl}}[\\text{HSO}_4^-] \\leftrightarrow \\text{C}_{\\text{dl}} + \\text{HSO}_4^- + e^-$$
$$\\text{Faradaic Core Conversion: } \\text{Pb} + \\text{HSO}_4^- \\leftrightarrow \\text{PbSO}_4 + \\text{H}^+ + 2e^-$$

### Arrhenius Asymmetric Thermal Factor:
$$f(T) = \\frac{(T - T_{\\min})(T_{\\max} - T)}{(T_{\\text{opt}} - T_{\\min})(T_{\\max} - T_{\\text{opt}})}$$
Where $T_{\\text{opt}} = 35^\\circ\\text{C}$, $T_{\\max} = 45^\\circ\\text{C}$, $T_{\\min} = 4^\\circ\\text{C}$. Constant bedrock maintains $15^\\circ\\text{C}$, scaling biological current reliably.\n\n`;
    }

    // 5. Step-by-Step Installation
    if (options.includeInstallation) {
      md += `## 🚀 5. Local Workspace Setup & Automation\n\n`;
      md += `Deploy the simulation suite, test runners, and telemetry parsers locally in an isolated sandbox:\n\n`;
      md += `### Linux / macOS (Unix Bash):
\`\`\`bash
git clone ${options.repoUrl}.git
cd project-biovolt
chmod +x automation/setup_and_run.sh
./automation/setup_and_run.sh
\`\`\`

### Windows (PowerShell):
\`\`\`powershell
git clone ${options.repoUrl}.git
cd project-biovolt
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
.\\automation\\setup_and_run.ps1
\`\`\`

### Running the Dual-Axis 24h Performance Plotter:
\`\`\`bash
python simulator/plot_simulation.py
\`\`\`
Generates high-resolution performance curves with dual SOFC burn cycles saved as \`ue_emg_performance_curves.png\`.\n\n`;
    }

    // 6. Troubleshooting & Operations
    if (options.includeTroubleshooting) {
      md += `## 🔍 6. Subterranean Exception Index & Hardware Operations (\`pem_troubleshooting.md\` & \`cli_manager.py\`)\n\n`;
      md += `### Sub-Surface PEM Fault Code Matrix (Block UE-EMG-PEM-04)\n\n`;
      md += `| Fault Code | Anomaly | Telemetry Indicator | Immediate Remediation | Automated Action |
| :--- | :--- | :--- | :--- | :--- |
| **PEM-E01** | Hydration Cross-Over Leak | OCV drops $<0.35\\text{V}$ abruptly | Dispatch \`FORCE_ISOLATE\`; engage pressure-relief bypass | SCADA High Alert |
| **PEM-E02** | Biofilm Bio-Fouling (\`CRITICAL_BIO_DROP\`) | $V_{\\text{bio}} < 0.35\\text{V}$, $I_{\\text{bio}} < 0.15\\text{A}$ | Deploy \`FORCE_ISOLATE\`; dose 50mM sodium acetate | **Instant Sub-Surface Warning Email Dispatched** |
| **PEM-E03** | Thermal Boundary Inversion | Caisson bedrock $T > 28^\\circ\\text{C}$ | Throttle SOFC burn cycle down to 8 minutes | Thermal Loop Bypass |
| **PEM-E04** | Sulfation Bridging at Pb-C Matrix | Double-layer capacitance $C_{dl} < 2200\\text{F}$ | Trigger 50A SOFC desulfation burst pulse | De-passivation Pulse Train |\n\n`;
      md += `### Interactive Hardware CLI Operations (\`cli_manager.py\`)\n\n`;
      md += `\`\`\`bash
# Launch interactive subterranean terminal
python cli_manager.py

# Run automated diagnostic sweep (triggers warning email if CRITICAL_BIO_DROP)
biovolt@UE-EMG-VAULT-01:~$ scan

# Emergency biological isolation
biovolt@UE-EMG-VAULT-01:~$ isolate
\`\`\`\n\n`;
    }

    // 7. Capital Ledger & Component Costing Matrix
    if (options.includeCapitalLedger) {
      md += `## 📊 7. Project Capital Ledger & Component Costing Matrix\n\n`;
      md += `| Component ID | Hardware System Category | Unit Specification | Qty | Unit Cost (INR) | Total Allocation (INR) | Procurement Stream / Spec Status |\n`;
      md += `|---|---|---|---|---|---|---|\n`;
      md += `| **SYS-C01** | Structural Vault Enclosure | Pre-cast Reinforced Caisson (15m x 4m) | 1 | 4,50,000 | 4,50,000 | Civil Engineering Contract |\n`;
      md += `| **MEC-W02** | Fluidic Containment Core | 15mm Industrial Acrylic Block (CNC-Milled) | 4 | 22,500 | 90,000 | IndiaMART / Open Toolpath |\n`;
      md += `| **BIO-A01** | Bio-Anode Substrate Matrix | Carbon Cloth with CNT Layering | 12 | 14,000 | 1,68,000 | Advanced Materials Supplier |\n`;
      md += `| **CHM-C03** | Asymmetric Storage Matrix | Composite Lead-Carbon Enhanced Negative Plates | 24 | 8,500 | 2,04,000 | Custom Industrial Battery Fabricator |\n`;
      md += `| **MEM-P04** | Proton Gating Interface | Perfluorosulfonic Acid (PFSA) Membrane Sheet | 2 | 45,000 | 90,000 | Nafion-Grade Spec Material |\n`;
      md += `| **EMB-M01** | Instrumentation & Control | ESP32-DevCore + Low-Power Harvesting PMIC | 2 | 3,800 | 7,600 | Electronics Components Distributor |\n`;
      md += `| **FME-S02** | Software Delivery Matrix | Automation Framework, Dashboards, & Scripts | 1 | -- | -- | Open Source (MIT License Repository) |\n`;
      md += `| **MISC-01** | System Fluidic Spares | High-Pressure Seals, Valves, and Fittings | 1 | 45,000 | 45,000 | Standard Fluid Control Hardware |\n`;
      md += `| **TOTAL** | **Estimated Prototype Budget** | **Full Vault Cluster Component Group** | -- | -- | **10,54,600** | **Net Capital Deployment Requirement** |\n\n`;
    }

    // 8. Multilingual Regional Engineering Specifications
    if (options.includeMultilingual) {
      md += `## 🌐 8. Multilingual Regional Engineering Specifications\n\n`;
      md += `### 🇮🇳 Hindi Technical Overview (हिंदी तकनीकी विवरण)\n`;
      md += `**अंडर-अर्थ इलेक्ट्रो-माइक्रोबियल ग्रिड (UE-EMG)** एक भूमिगत सह-उत्पादन (Co-generation) हार्डवेयर ढांचा है। यह ऊर्जा संचयन और कैपेसिटिव स्टोरेज दोनों को 10 से 30 मीटर गहरे कांक्रीट कैसॉन में स्थापित करता है, जिससे 15°C का स्थिर तापमान और शून्य ऑक्सीजन क्षरण प्राप्त होता है।\n\n`;
      md += `### 🇮🇳 Odia Technical Overview (ଓଡ଼ିଆ ବୈଜ୍ଞାନିକ ବିବରଣୀ)\n`;
      md += `**ଅଣ୍ଡର-ଆର୍ଥ ଇଲେକ୍ଟ୍ରୋ-ମାଇକ୍ରୋବିଆଲ୍ ଗ୍ରିଡ୍ (UE-EMG)** ହେଉଛି ଭୂତଳ ଶକ୍ତି ସହ-ଉତ୍ପାଦନ (Co-generation) ଏବଂ ସାଇତି ରଖିବା ପାଇଁ ଏକ ଓପନ୍-ସୋର୍ସ ହାର୍ଡୱେର ଢାଞ୍ଚା। ଏହା ୧୦ ରୁ ୩୦ ମିଟର ଗଭୀର କଂକ୍ରିଟ୍ କାଇସନ ମଧ୍ୟରେ ସ୍ଥିର ୧୫°C ତାପମାତ୍ରା ବଜାୟ ରଖି ନିରନ୍ତର ଶକ୍ତି ଉତ୍ପାଦନ ସୁନିଶ୍ଚିତ କରେ।\n\n`;
    }

    // 9. Interview Cheat Sheet
    if (options.includeInterviewCheatSheet) {
      md += `## 🧠 9. Technical Interview Cheat Sheet (60-Second Pitch)\n\n`;
      md += `> "Project BioVolt (UE-EMG) is a subterranean co-generation power architecture that merges living exoelectrogenic biofilms (*Geobacter sulfurreducens*) with an asymmetric Lead-Carbon (Pb-C) chemical capacitor storage matrix. By burying the core 25 meters deep in pre-cast concrete caissons, the grid eliminates surface weather vulnerabilities and maintains a permanent 15°C baseline ambient temperature ideal for bacterial metabolism and prolonged battery cycle durability."\n\n`;
      md += `**ATS Core Keywords:** Asymmetric Lead-Carbon Batteries, Maximum Power Point Tracking (MPPT), Proton Exchange Membrane, Embedded Telemetry Design, 3-Axis CNC G-Code Optimization, Continuous Integration (CI/CD), Arrhenius Biological Kinetics.\n\n`;
    }

    md += `## 📜 License\nDistributed under the **MIT License**. See \`LICENSE\` for open-source hardware and software permissions.\n`;

    return md;
  }, [options]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="p-6 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <FileCode2 className="w-4 h-4" />
            <span>UTILITY ENGINE // STRUCTURED README.MD GENERATOR</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-tech)' }}>
            Project BioVolt Master Repository README Generator
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Generates a comprehensive, production-grade GitHub \`README.md\` incorporating technical architecture,
            installation instructions, hardware blueprints, G-code toolpaths, and nanoscale PEM specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-300 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs font-mono transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download README.md</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Controls (340px) + Right Document Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Customization Sidebar (lg:col-span-4) */}
        <div className="lg:col-span-4 p-5 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
            <span className="text-white font-bold uppercase">SECTION CONFIGURATOR</span>
            <span className="text-slate-400">MODULAR BLOCKS</span>
          </div>

          <div className="flex flex-col gap-3 text-xs font-mono">
            <label className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <span className="text-slate-300">Header Badges &amp; License</span>
              <input
                type="checkbox"
                checked={options.includeBadges}
                onChange={(e) => setOptions({ ...options, includeBadges: e.target.checked })}
                className="accent-amber-400 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <span className="text-slate-300">Technical System Architecture</span>
              <input
                type="checkbox"
                checked={options.includeArchitecture}
                onChange={(e) => setOptions({ ...options, includeArchitecture: e.target.checked })}
                className="accent-amber-400 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <span className="text-slate-300">Hardware &amp; CNC Blueprints</span>
              <input
                type="checkbox"
                checked={options.includeHardwareBlueprints}
                onChange={(e) => setOptions({ ...options, includeHardwareBlueprints: e.target.checked })}
                className="accent-amber-400 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <span className="text-slate-300">PEM Nanoscale Specifications</span>
              <input
                type="checkbox"
                checked={options.includePemSpecs}
                onChange={(e) => setOptions({ ...options, includePemSpecs: e.target.checked })}
                className="accent-amber-400 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <span className="text-slate-300">Embedded Firmware Matrix</span>
              <input
                type="checkbox"
                checked={options.includeFirmwareSpecs}
                onChange={(e) => setOptions({ ...options, includeFirmwareSpecs: e.target.checked })}
                className="accent-amber-400 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <span className="text-slate-300">Electrochemical &amp; Arrhenius Math</span>
              <input
                type="checkbox"
                checked={options.includeSimulationMath}
                onChange={(e) => setOptions({ ...options, includeSimulationMath: e.target.checked })}
                className="accent-amber-400 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <span className="text-slate-300">Installation &amp; Setup Scripts</span>
              <input
                type="checkbox"
                checked={options.includeInstallation}
                onChange={(e) => setOptions({ ...options, includeInstallation: e.target.checked })}
                className="accent-amber-400 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <span className="text-slate-300">Troubleshooting Exception Index</span>
              <input
                type="checkbox"
                checked={options.includeTroubleshooting}
                onChange={(e) => setOptions({ ...options, includeTroubleshooting: e.target.checked })}
                className="accent-amber-400 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <span className="text-slate-300">Capital Ledger &amp; Budget Matrix</span>
              <input
                type="checkbox"
                checked={options.includeCapitalLedger}
                onChange={(e) => setOptions({ ...options, includeCapitalLedger: e.target.checked })}
                className="accent-amber-400 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <span className="text-slate-300">Multilingual Specifications (Hindi/Odia)</span>
              <input
                type="checkbox"
                checked={options.includeMultilingual}
                onChange={(e) => setOptions({ ...options, includeMultilingual: e.target.checked })}
                className="accent-amber-400 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <span className="text-slate-300">Interview Elevator Pitch Cheat Sheet</span>
              <input
                type="checkbox"
                checked={options.includeInterviewCheatSheet}
                onChange={(e) => setOptions({ ...options, includeInterviewCheatSheet: e.target.checked })}
                className="accent-amber-400 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>

          {/* Dimension Tweaks */}
          <div className="flex flex-col gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Caisson Depth:</span>
                <span className="text-amber-400 font-bold">{options.caissonDepthMeters}m</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="5"
                value={options.caissonDepthMeters}
                onChange={(e) => setOptions({ ...options, caissonDepthMeters: parseInt(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Pb-C Core Capacity:</span>
                <span className="text-emerald-400 font-bold">{options.batteryAh} Ah</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={options.batteryAh}
                onChange={(e) => setOptions({ ...options, batteryAh: parseInt(e.target.value) })}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Right: Markdown Preview / Raw Output Stage (lg:col-span-8) */}
        <div className="lg:col-span-8 p-5 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
            <span className="text-white font-bold">README.MD DOCUMENT STAGE</span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded">
              <button
                onClick={() => setActiveView('preview')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeView === 'preview'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Rendered View
              </button>
              <button
                onClick={() => setActiveView('raw')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeView === 'raw'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Raw Markdown
              </button>
            </div>
          </div>

          {activeView === 'raw' ? (
            <div className="p-4 bg-[#070A10] rounded border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed max-h-[640px] overflow-y-auto select-all">
              <pre className="whitespace-pre-wrap">{markdownContent}</pre>
            </div>
          ) : (
            <div className="p-6 md:p-8 bg-[#0B0F19] rounded border border-slate-800 text-slate-200 leading-relaxed max-h-[640px] overflow-y-auto prose prose-invert prose-amber max-w-none text-xs font-sans">
              <div className="flex flex-col gap-4">
                <h1 className="text-xl font-bold text-white tracking-tight pb-2 border-b border-slate-800">
                  Project BioVolt: Under-Earth Electro-Microbial Grid (UE-EMG)
                </h1>
                <p className="text-slate-400 text-xs italic">
                  Subterranean Co-Generation Infrastructure Using Deep-Compost Bio-Gas Matrix &amp; Lead-Carbon Intercalated Capacitive Storage
                </p>

                {options.includeBadges && (
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                    <span className="px-2 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-800 rounded">MIT License</span>
                    <span className="px-2 py-0.5 bg-blue-950/80 text-blue-300 border border-blue-800 rounded">Hardware CERN-OHL</span>
                    <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-800 rounded">CI Testing Passed</span>
                    <span className="px-2 py-0.5 bg-purple-950/80 text-purple-300 border border-purple-800 rounded">Python 3.10+ / C++ ESP32</span>
                  </div>
                )}

                <div className="p-4 bg-[#070A10] border border-slate-800 rounded font-mono text-[11px] text-amber-300 overflow-x-auto">
                  <pre>{`[Surface Level Infrastructure: Waste Collection] ──► Gravity Drop (0-${options.caissonDepthMeters}m)
├── Anaerobic Digester (37°C CH4) ──► Solid-Oxide Fuel Cell (SOFC 50A Burst)
└── Bio-Anode Geobacter Biofilm ──► Lead-Carbon Double Layer (5000F / ${options.batteryAh}Ah)`}</pre>
                </div>

                <div className="space-y-4 text-xs text-slate-300">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-1">
                    System Architecture &amp; Stratification
                  </h3>
                  <p>
                    Modular cylindrical precast concrete caissons sunk {options.caissonDepthMeters} meters into dark basalt
                    earth maintain an isothermal baseline of 15°C, ensuring optimal bacterial viability and battery lifespan.
                  </p>

                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-1 pt-2">
                    Installation &amp; Automated Pipeline
                  </h3>
                  <div className="p-3 bg-slate-950 rounded font-mono text-[11px] text-slate-300">
                    <div>git clone {options.repoUrl}.git</div>
                    <div>chmod +x automation/setup_and_run.sh &amp;&amp; ./automation/setup_and_run.sh</div>
                  </div>

                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-1 pt-2">
                    Hardware Blueprints &amp; Toolpaths
                  </h3>
                  <p>
                    Includes 3-axis CNC G-code toolpaths (<code>casing_milling.gcode</code>) milling dual symmetrical 40x40mm
                    acrylic fluidic chambers at 2400 RPM with active coolant.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
