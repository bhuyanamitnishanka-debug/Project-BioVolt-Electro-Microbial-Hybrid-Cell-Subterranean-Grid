/**
 * Project BioVolt: Multimodal Graphic Novel Sequence & Visual Prompt Studio
 * Sequential 4-Panel Hard-Sci-Fi Visual Storyboard & AI Studio Prompt Generator
 */

import React, { useState } from 'react';
import {
  Film,
  Copy,
  Check,
  Sparkles,
  Maximize2,
  Sliders,
  Eye,
  Terminal,
  BookOpen,
  Atom,
  Cpu,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { GraphicNovelPanelData } from '../types/biovolt';
import { generateBioVoltAnalysis } from '../services/geminiService';

const PANELS: GraphicNovelPanelData[] = [
  {
    id: 1,
    title: 'Panel 1: The Macro View',
    subtitle: 'EMHC Dual-Compartment Isometric Cutaway',
    visualStyle: 'Technical blueprint sketch mixed with gritty cyberpunk dieselpunk aesthetic. Deep indigo blueprints, crisp white schematics, and bioluminescent amber accents.',
    sceneDescription:
      'An isometric cutaway diagram of the BioVolt EMHC casing. One half shows the organic anaerobic chamber filled with dense, fibrous carbon-cloth arrays dripping with specialized microbial biofilms. The other half shows a sharply defined, layered crystalline lithium-iron / lead-carbon storage block. Thick copper conduits run from the bio-anode through a micro-controller circuit board into the storage cell.',
    dialogueCaption:
      '"BIOVOLT CORE S-01: Merging metabolic respiration with solid-state chemistry. The bridge between the organic and the digital."',
    technicalOverlay: [
      { label: 'ANODE CASSETTE', reading: '145 m² CNT-Cloth', description: 'Anaerobic bio-chamber' },
      { label: 'STORAGE CORE', reading: '120 Ah Pb-C', description: 'Double-layer capacitor matrix' },
      { label: 'ENERGY HARVESTER', reading: 'LTC3108 Boost', description: '20mV cold-start circuitry' },
    ],
    promptText: `[System Instruction: You are an expert industrial designer, biomedical engineer, and acclaimed sci-fi graphic novel illustrator specializing in hard-scientific speculative fiction.]
[Task: High-contrast comic book panel. Isometric cutaway diagram of the BioVolt EMHC battery core. One half reveals a dark organic anaerobic chamber with fibrous carbon-cloth arrays dripping with amber bioluminescent microbial biofilms. The other half reveals a sharply etched, layered metallic lead-carbon intercalated capacitor bank. Heavy copper busbars run through a central micro-controller circuit board glowing with cyan trace lights. Deep indigo blueprint background, crisp white engineering dimension lines, gritty dieselpunk industrial finish.]`,
  },
  {
    id: 2,
    title: 'Panel 2: The Microscopic Layer',
    subtitle: 'SEM Perspective of Geobacter Nanowire DET',
    visualStyle: 'Scanning Electron Microscope (SEM) perspective with false-color enhancements. Cinematic depth of field, dramatic low-angle lighting.',
    sceneDescription:
      'Extreme close-up of an individual carbon nanotube thread. Millions of microscopic Geobacter rod-shaped bacterial cells are clinging to the carbon fiber. Tiny, glowing golden threads (microbial nanowires) are visibly branching out from the bacteria, physically welding themselves onto the black metallic surface of the nanotube, transferring individual packets of light (electrons).',
    dialogueCaption:
      '"At the biofilm boundary, Geobacter colonies treat the carbon matrix as an infinite respiratory sink. They don\'t breathe air; they breathe our grid."',
    technicalOverlay: [
      { label: 'MICROBIAL STRAIN', reading: 'G. sulfurreducens KN400', description: 'Exoelectrogenic catalyst' },
      { label: 'NANOWIRE DIAMETER', reading: '3.2 nm OmcS/OmcZ', description: 'Conductive cytochromic pili' },
      { label: 'ELECTRON FLUX', reading: '8e- per acetate ion', description: 'Direct extracellular transfer' },
    ],
    promptText: `[System Instruction: You are an elite scientific illustrator and hard-sci-fi artist.]
[Task: Extreme microscopic close-up in false-color Scanning Electron Microscope (SEM) aesthetic. A single textured, cylindrical carbon nanotube thread spans diagonally across the frame. Clustered tightly along its surface are rod-shaped Geobacter bacteria glowing with deep bioluminescent emerald. Microscopic golden-amber conductive nanowires (protein pili) branch out from the bacterial cell walls, fusing directly into the carbon nanotube matrix. Sparks of cyan electron energy visibly transfer across the junctions. Pitch black background with cinematic studio rim lighting.]`,
  },
  {
    id: 3,
    title: 'Panel 3: The Chemical Nexus',
    subtitle: 'Split-Screen Proton Exchange & Ion Intercalation',
    visualStyle: 'High-contrast chemical engineering diagram overlaying a dynamic cross-section view.',
    sceneDescription:
      'A split-screen depiction of the Proton Exchange Membrane (PEM). On the left side, protons flow across a translucent synthetic polymer barrier. On the right side, within the chemical storage zone, sulfate ions and double-layer capacitive charges intercalate into an activated carbon-lead molecular lattice structure, showing the gradual transition from a depleted state to a fully saturated, charged configuration.',
    dialogueCaption:
      '"The continuous metabolic trickle feeds the chemical capacitor. Organic waste is converted atom-by-atom into stable, high-density energy."',
    technicalOverlay: [
      { label: 'PEM SELECTIVITY', reading: '>99.2% H+ Permeable', description: 'Prevents heavy metal poisoning' },
      { label: 'DOUBLE LAYER', reading: 'C_dl = 5000 Farads', description: 'Fast capacitive buffering' },
      { label: 'FARADAIC CORE', reading: 'Pb + HSO4- <-> PbSO4', description: 'High-density electron capture' },
    ],
    promptText: `[System Instruction: You are an expert scientific diagram artist.]
[Task: Dynamic split-screen comic panel. On the left: a translucent polymeric Proton Exchange Membrane (PEM) with glowing blue spheres representing hydrogen protons (H+) streaming through molecular pores. On the right: an atomic-scale cutaway of a Lead-Carbon plate lattice, showing glowing amber exoelectrons and sulfate ions seamlessly slotting into activated carbon nanostructures and transforming metallic lead sheets into charged states. High-contrast sci-fi chemistry visualization with clean technical arrows and molecular annotations.]`,
  },
  {
    id: 4,
    title: 'Panel 4: The Deployment Node',
    subtitle: 'Deep Subterranean Basalt Vault & AI Edge Node',
    visualStyle: 'Wide atmospheric shot, industrial realism, dramatic subterranean lighting.',
    sceneDescription:
      'A massive subterranean concrete cylindrical chamber, 20 meters underground, carved out of dark basalt rock. Glowing amber bioluminescent pipelines twist along the ceiling like technological veins, transferring organic waste. In the center sits a towering, monolithic industrial battery bank labeled "PB-C HYBRID CORE". Heavy power lines run out from the unit directly into a rugged computing terminal labeled Google AI Edge.',
    dialogueCaption:
      '"Infinite operational lifespan. No recharging docks. No fuel inputs. The machine lives as long as the biome breathes."',
    technicalOverlay: [
      { label: 'AMBIENT VAULT', reading: '15.0°C Constant', description: 'Geothermal bedrock buffer' },
      { label: 'OUTPUT TELEMETRY', reading: '450mA Bio / 45A Burst', description: 'Co-gen dual vector' },
      { label: 'EDGE TERMINAL', reading: 'Google AI Edge Online', description: 'Autonomous remote baseload' },
    ],
    promptText: `[System Instruction: You are an acclaimed concept artist specializing in subterranean industrial dieselpunk.]
[Task: Cinematic wide graphic novel panel. A massive subterranean concrete cylinder chamber, 20 meters underground, carved into dark basalt rock. Glowing amber bioluminescent pipelines twist across the damp rock ceiling like veins, feeding organic waste down into the vault. In the center stands a towering monolithic battery bank labeled "PB-C HYBRID CORE" with crisp white diagnostic screens displaying "SYSTEM OPTIMAL | BIO-ANODE 450mA | OUTPUT: ONLINE". Heavy industrial copper cables feed directly into an adjacent computing terminal labeled "Google AI Edge". Atmospheric steam, wet stone reflections, moody chiaroscuro lighting.]`,
  },
];

export const GraphicNovel: React.FC = () => {
  const [activePanelId, setActivePanelId] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'storyboard' | 'prompts' | 'blueprint'>('storyboard');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [enhancedAnalysis, setEnhancedAnalysis] = useState<string | null>(null);

  const activePanel = PANELS.find((p) => p.id === activePanelId) || PANELS[0];

  const handleCopyPrompt = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleEnhanceWithAI = async () => {
    setIsEnhancing(true);
    setEnhancedAnalysis(null);
    try {
      const res = await generateBioVoltAnalysis(
        activePanel.title,
        `Visual Style: ${activePanel.visualStyle}\nScene: ${activePanel.sceneDescription}\nTechnical: ${JSON.stringify(activePanel.technicalOverlay)}`
      );
      setEnhancedAnalysis(res);
    } catch {
      setEnhancedAnalysis('Unable to query generative engine.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#0D121D] border border-slate-800 rounded-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Film className="w-4 h-4" />
            <span>MULTIMODAL GRAPHIC NOVEL SEQUENCE // SCRIPT &amp; BLUEPRINTS</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-tech)' }}>
            Project BioVolt: 4-Panel Technical Graphic Novel
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hard-scientific speculative comic sequence illustrating the boot-up and molecular architecture of the EMHC core.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
          <button
            onClick={() => setViewMode('storyboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
              viewMode === 'storyboard'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Comic Panels</span>
          </button>
          <button
            onClick={() => setViewMode('blueprint')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
              viewMode === 'blueprint'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Technical Blueprints</span>
          </button>
          <button
            onClick={() => setViewMode('prompts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
              viewMode === 'prompts'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Google AI Studio Prompts</span>
          </button>
        </div>
      </div>

      {/* Main Comic Viewer Mode */}
      {viewMode === 'storyboard' && (
        <div className="flex flex-col gap-6">
          {/* Panel Navigation Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PANELS.map((p) => {
              const isSelected = p.id === activePanelId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePanelId(p.id);
                    setEnhancedAnalysis(null);
                  }}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-900/90 border-amber-400 text-white shadow-lg'
                      : 'bg-[#0D121D] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                    PANEL 0{p.id}
                  </span>
                  <span className="text-xs font-bold text-white font-mono block mt-0.5 truncate">
                    {p.title.split(': ')[1]}
                  </span>
                  <span className="text-[11px] text-slate-500 block truncate mt-0.5">{p.subtitle}</span>
                </button>
              );
            })}
          </div>

          {/* Active Panel Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Stage: Illustrated Vector Visual Graphic (lg:col-span-8) */}
            <div className="lg:col-span-8 p-5 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-amber-400 text-slate-950 rounded">
                    PANEL 0{activePanel.id}
                  </span>
                  <h3 className="text-sm font-bold text-white font-mono tracking-wide">
                    {activePanel.subtitle.toUpperCase()}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyPrompt(activePanel.promptText, activePanel.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors"
                  >
                    {copiedIndex === activePanel.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy AI Studio Prompt</span>
                  </button>
                </div>
              </div>

              {/* Dynamic SVG Illustrated Art Frame */}
              <div className="relative w-full aspect-[4/3] bg-[#070A11] rounded-lg border-2 border-slate-700 overflow-hidden shadow-2xl flex items-center justify-center p-4">
                {activePanel.id === 1 && (
                  /* Panel 1: Isometric Macro Cutaway */
                  <svg viewBox="0 0 600 450" className="w-full h-full select-none">
                    <defs>
                      <linearGradient id="bioGlow" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#D97706" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#78350F" stopOpacity="0.2" />
                      </linearGradient>
                      <linearGradient id="metalLead" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="50%" stopColor="#64748B" />
                        <stop offset="100%" stopColor="#334155" />
                      </linearGradient>
                    </defs>
                    {/* Isometric Blueprint Grid */}
                    <g opacity="0.15">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <line
                          key={i}
                          x1="0"
                          y1={i * 35}
                          x2="600"
                          y2={i * 35 + 150}
                          stroke="#38BDF8"
                          strokeWidth="1"
                        />
                      ))}
                      {Array.from({ length: 15 }).map((_, i) => (
                        <line
                          key={i}
                          x1="600"
                          y1={i * 35}
                          x2="0"
                          y2={i * 35 + 150}
                          stroke="#38BDF8"
                          strokeWidth="1"
                        />
                      ))}
                    </g>
                    {/* Left Compartment: Bio-Anode Anaerobic Cloth Array */}
                    <polygon points="120,240 280,160 280,340 120,420" fill="url(#bioGlow)" stroke="#F59E0B" strokeWidth="2" />
                    {/* Fibrous woven carbon texture */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <line
                        key={i}
                        x1="140"
                        y1={240 + i * 20}
                        x2="260"
                        y2={180 + i * 20}
                        stroke="#FBBF24"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                      />
                    ))}
                    {/* Bacterial clusters */}
                    <circle cx="180" cy="260" r="12" fill="#D97706" fillOpacity="0.7" />
                    <circle cx="220" cy="240" r="16" fill="#F59E0B" fillOpacity="0.5" />
                    <circle cx="200" cy="300" r="14" fill="#B45309" fillOpacity="0.8" />

                    {/* Central Proton Exchange Barrier & Microcontroller */}
                    <polygon points="280,160 320,140 320,320 280,340" fill="#0284C7" fillOpacity="0.4" stroke="#38BDF8" strokeWidth="2" />
                    <rect x="290" y="210" width="20" height="40" fill="#0F172A" stroke="#22D3EE" strokeWidth="1.5" />

                    {/* Right Compartment: Lead-Carbon Solid-State Storage Core */}
                    <polygon points="320,140 480,220 480,400 320,320" fill="url(#metalLead)" stroke="#94A3B8" strokeWidth="2" />
                    {/* Layered plate laminates */}
                    {Array.from({ length: 6 }).map((_, i) => (
                      <polygon
                        key={i}
                        points={`340,${160 + i * 30} 460,${220 + i * 30} 460,${235 + i * 30} 340,${175 + i * 30}`}
                        fill="#1E293B"
                        stroke="#A78BFA"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Heavy Copper Conduits */}
                    <path d="M 200,180 L 290,130 L 400,170" fill="none" stroke="#F97316" strokeWidth="4" />
                    <circle cx="200" cy="180" r="5" fill="#F97316" />
                    <circle cx="400" cy="170" r="5" fill="#F97316" />

                    {/* Schematic Annotations */}
                    <text x="140" y="390" fill="#FDE68A" fontSize="12" fontFamily="monospace" fontWeight="bold">
                      STAGE 1: BIO-ANODE BIOFILM
                    </text>
                    <text x="350" y="370" fill="#DDD6FE" fontSize="12" fontFamily="monospace" fontWeight="bold">
                      STAGE 2: LEAD-CARBON MATRIX
                    </text>
                  </svg>
                )}

                {activePanel.id === 2 && (
                  /* Panel 2: SEM Perspective of Geobacter Nanowires */
                  <svg viewBox="0 0 600 450" className="w-full h-full select-none">
                    {/* Deep Blue Vacuum Background */}
                    <rect x="0" y="0" width="600" height="450" fill="#050B14" />
                    {/* Carbon Nanotube Thread (Diagonal textured cylinder) */}
                    <path
                      d="M -50,400 L 500,-50 L 650,-20 L 100,430 Z"
                      fill="#111827"
                      stroke="#374151"
                      strokeWidth="2"
                    />
                    {/* Nanotube Chirality Ridges */}
                    {Array.from({ length: 14 }).map((_, i) => (
                      <line
                        key={i}
                        x1={i * 45 - 20}
                        y1={380 - i * 30}
                        x2={i * 45 + 130}
                        y2={410 - i * 30}
                        stroke="#4B5563"
                        strokeWidth="2"
                      />
                    ))}

                    {/* Geobacter Rod-Shaped Bacterial Cells */}
                    {/* Cell 1 */}
                    <ellipse cx="220" cy="240" rx="35" ry="18" fill="#059669" stroke="#34D399" strokeWidth="2.5" transform="rotate(-25 220 240)" />
                    {/* Cell 2 */}
                    <ellipse cx="360" cy="140" rx="42" ry="20" fill="#047857" stroke="#6EE7B7" strokeWidth="2.5" transform="rotate(-35 360 140)" />
                    {/* Cell 3 */}
                    <ellipse cx="140" cy="300" rx="38" ry="18" fill="#065F46" stroke="#34D399" strokeWidth="2.5" transform="rotate(-15 140 300)" />

                    {/* Glowing Golden Nanowires (Conductive Pili) Branching to Nanotube */}
                    <path
                      d="M 240,245 Q 280,260 300,290 T 340,310"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="3"
                      strokeDasharray="4 2"
                    />
                    <path
                      d="M 210,250 Q 230,290 250,330"
                      fill="none"
                      stroke="#FBBF24"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 370,155 Q 410,180 430,220"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="3"
                    />

                    {/* Sparkling Exoelectron Packets */}
                    <circle cx="300" cy="290" r="4" fill="#38BDF8" />
                    <circle cx="250" cy="330" r="5" fill="#38BDF8" />
                    <circle cx="430" cy="220" r="4" fill="#38BDF8" />

                    {/* Scientific SEM HUD Overlay */}
                    <text x="30" y="40" fill="#10B981" fontSize="12" fontFamily="monospace">
                      SEM MAG: 45,000X // ACCEL: 15.0 kV // FIELD: DET EXTRACTION
                    </text>
                    <line x1="30" y1="420" x2="130" y2="420" stroke="#F59E0B" strokeWidth="3" />
                    <text x="140" y="424" fill="#F59E0B" fontSize="11" fontFamily="monospace">
                      SCALE: 500 nm
                    </text>
                  </svg>
                )}

                {activePanel.id === 3 && (
                  /* Panel 3: Chemical Nexus Split-Screen */
                  <svg viewBox="0 0 600 450" className="w-full h-full select-none">
                    <rect x="0" y="0" width="600" height="450" fill="#090E17" />
                    {/* Central Vertical PEM Barrier */}
                    <rect x="290" y="0" width="20" height="450" fill="#0284C7" fillOpacity="0.5" stroke="#38BDF8" strokeWidth="2" />

                    {/* Left: Proton Stream (H+) */}
                    <rect x="0" y="0" width="290" height="450" fill="#0C1524" />
                    <text x="30" y="40" fill="#38BDF8" fontSize="13" fontFamily="monospace" fontWeight="bold">
                      PROTON EXCHANGE BARRIER (PEM)
                    </text>
                    <text x="30" y="65" fill="#94A3B8" fontSize="11" fontFamily="monospace">
                      H+ Cation Migration from Bio-Anode
                    </text>
                    {/* Migrating Protons */}
                    {[
                      { x: 70, y: 140 },
                      { x: 140, y: 200 },
                      { x: 90, y: 270 },
                      { x: 190, y: 160 },
                      { x: 230, y: 240 },
                      { x: 160, y: 340 },
                    ].map((pt, i) => (
                      <g key={i}>
                        <circle cx={pt.x} cy={pt.y} r="14" fill="#0284C7" fillOpacity="0.4" stroke="#38BDF8" strokeWidth="2" />
                        <text x={pt.x} y={pt.y + 4} fill="#FFFFFF" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                          H+
                        </text>
                        {/* Direction Arrow */}
                        <path d={`M ${pt.x + 16},${pt.y} L ${pt.x + 36},${pt.y} M ${pt.x + 30},${pt.y - 4} L ${pt.x + 36},${pt.y} L ${pt.x + 30},${pt.y + 4}`} stroke="#38BDF8" strokeWidth="1.5" />
                      </g>
                    ))}

                    {/* Right: Lead-Carbon Double-Layer Intercalation */}
                    <rect x="310" y="0" width="290" height="450" fill="#151226" />
                    <text x="330" y="40" fill="#C084FC" fontSize="13" fontFamily="monospace" fontWeight="bold">
                      LEAD-CARBON INTERCALATION
                    </text>
                    <text x="330" y="65" fill="#94A3B8" fontSize="11" fontFamily="monospace">
                      Fast C_dl Adsorption + Faradaic Pb
                    </text>
                    {/* Molecular Plate Grid */}
                    {Array.from({ length: 4 }).map((_, r) => (
                      <g key={r}>
                        <rect x="340" y={110 + r * 75} width="220" height="45" rx="4" fill="#3B0764" stroke="#A855F7" strokeWidth="1.5" />
                        <text x="355" y={138 + r * 75} fill="#E9D5FF" fontSize="11" fontFamily="monospace">
                          [Pb Plate] + HSO4- ↔ PbSO4
                        </text>
                        {/* Fast electrons dancing on carbon matrix */}
                        <circle cx="510" cy={125 + r * 75} r="5" fill="#F59E0B" />
                        <circle cx="530" cy={140 + r * 75} r="4" fill="#38BDF8" />
                      </g>
                    ))}
                  </svg>
                )}

                {activePanel.id === 4 && (
                  /* Panel 4: Subterranean Deployment Node & AI Edge */
                  <svg viewBox="0 0 600 450" className="w-full h-full select-none">
                    <rect x="0" y="0" width="600" height="450" fill="#0A0D14" />
                    {/* Basalt Rock Cavern Arch */}
                    <path d="M 0,0 L 200,60 L 400,50 L 600,0 L 600,450 L 0,450 Z" fill="#0D111A" />
                    {/* Glowing Amber Organic Waste Pipelines */}
                    <path d="M 0,80 Q 250,110 600,80" fill="none" stroke="#D97706" strokeWidth="8" />
                    <path d="M 0,80 Q 250,110 600,80" fill="none" stroke="#FDE68A" strokeWidth="2" strokeDasharray="6 4" />

                    {/* Massive Monolithic Battery Core Bank */}
                    <rect x="80" y="160" width="220" height="240" rx="6" fill="#111827" stroke="#374151" strokeWidth="3" />
                    <rect x="95" y="180" width="190" height="60" rx="3" fill="#064E3B" stroke="#059669" strokeWidth="2" />
                    <text x="110" y="205" fill="#6EE7B7" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      PB-C HYBRID CORE S-01
                    </text>
                    <text x="110" y="225" fill="#34D399" fontSize="10" fontFamily="monospace">
                      OUTPUT: 450mA BIO // 98% FARADAIC
                    </text>

                    {/* Heavy Industrial Power Cables */}
                    <path d="M 300,280 C 350,280 370,320 420,320" fill="none" stroke="#F59E0B" strokeWidth="6" />
                    <path d="M 300,310 C 350,310 370,340 420,340" fill="none" stroke="#0284C7" strokeWidth="6" />

                    {/* Rugged Computing Terminal (Google AI Edge) */}
                    <rect x="420" y="220" width="140" height="180" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
                    <rect x="435" y="240" width="110" height="70" rx="2" fill="#030712" />
                    <text x="445" y="265" fill="#38BDF8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      GOOGLE AI EDGE
                    </text>
                    <text x="445" y="285" fill="#10B981" fontSize="9" fontFamily="monospace">
                      ONLINE // BASELOAD OK
                    </text>

                    {/* Venting steam mist */}
                    <path d="M 280,160 Q 300,120 340,110" fill="none" stroke="#E2E8F0" strokeWidth="2" opacity="0.4" />
                    <path d="M 290,165 Q 310,135 360,130" fill="none" stroke="#E2E8F0" strokeWidth="1.5" opacity="0.3" />
                  </svg>
                )}
              </div>

              {/* Hard-Sci-Fi Speech Dialogue & Narration Caption Box */}
              <div className="p-4 bg-slate-900/90 border-l-4 border-amber-400 rounded-r-lg">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider block mb-1">
                  NARRATIVE SCRIPT // SCENE CAPTION
                </span>
                <p className="text-sm font-mono text-slate-100 italic leading-relaxed">
                  {activePanel.dialogueCaption}
                </p>
              </div>

              {/* Technical Telemetry Readout Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {activePanel.technicalOverlay.map((item, i) => (
                  <div key={i} className="p-3 bg-slate-900/60 border border-slate-800 rounded">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">{item.label}</span>
                    <span className="text-xs font-mono font-bold text-cyan-400 block mt-0.5">{item.reading}</span>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{item.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Stage: Prompt Refinement & AI Director Console (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="p-5 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-semibold text-white uppercase font-mono tracking-wide">
                      AI Studio Multimodal Prompt
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">Google GenAI Ready</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-mono text-slate-400">STRUCTURED GENERATION PROMPT</label>
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-slate-300 max-h-56 overflow-y-auto leading-relaxed select-all">
                    {activePanel.promptText}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => handleCopyPrompt(activePanel.promptText, activePanel.id)}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs font-mono transition-colors"
                  >
                    {copiedIndex === activePanel.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedIndex === activePanel.id ? 'Copied to Clipboard' : 'Copy Prompt for Studio'}</span>
                  </button>

                  <button
                    onClick={handleEnhanceWithAI}
                    disabled={isEnhancing}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-400/40 rounded text-xs font-mono transition-colors"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
                    <span>{isEnhancing ? 'Querying Gemini...' : 'Analyze Scene with Gemini'}</span>
                  </button>
                </div>

                {/* Gemini AI Feedback Output */}
                {enhancedAnalysis && (
                  <div className="mt-2 p-3 bg-slate-900/90 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
                    <span className="text-[10px] text-amber-400 uppercase font-bold block mb-1">
                      Gemini Engineering Insights
                    </span>
                    {enhancedAnalysis}
                  </div>
                )}
              </div>

              {/* Visual Style Guidelines Card */}
              <div className="p-4 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-2 text-xs font-mono">
                <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">
                  VISUAL STYLE &amp; LIGHTING RIG
                </span>
                <p className="text-slate-300 leading-relaxed">{activePanel.visualStyle}</p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col gap-1">
                  <div>Color Dominance: 60% Deep Basalt / 30% Blueprint Slate / 10% Amber &amp; Cyan</div>
                  <div>Aspect Ratio: 4:3 Standard Comic Plate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompts Catalog Mode */}
      {viewMode === 'prompts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PANELS.map((p) => (
            <div key={p.id} className="p-5 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-400 text-slate-950 rounded">
                    PANEL 0{p.id}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{p.subtitle}</span>
                </div>
                <h4 className="text-sm font-bold text-white font-mono">{p.title}</h4>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
                  {p.promptText}
                </div>
              </div>

              <button
                onClick={() => handleCopyPrompt(p.promptText, p.id)}
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-xs font-mono text-amber-400 transition-colors"
              >
                {copiedIndex === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === p.id ? 'Copied' : 'Copy AI Prompt'}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Blueprint Mode */}
      {viewMode === 'blueprint' && (
        <div className="p-6 bg-[#070A12] border border-cyan-500/30 rounded-lg flex flex-col gap-5 text-mono">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase">SCHEMATIC COMPONENT LAYERS</span>
              <h3 className="text-lg font-bold text-white font-mono">EMHC Core S-01 Master Blueprint</h3>
            </div>
            <span className="px-2.5 py-1 text-xs font-mono text-cyan-400 bg-cyan-950 border border-cyan-800 rounded">
              REV 3.2 - OPEN HARDWARE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded flex flex-col gap-2">
              <span className="text-amber-400 font-bold">LAYER 1: BIOLOGICAL SUBSYSTEM</span>
              <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px]">
                <li>Geobacter sulfurreducens biofilm matrix</li>
                <li>Conductive OmcS cytochromic nanowires</li>
                <li>High-surface-area CNT-doped carbon cloth</li>
                <li>Acetate organic COD feed manifold</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded flex flex-col gap-2">
              <span className="text-cyan-400 font-bold">LAYER 2: IONIC ISOLATION &amp; HARVESTING</span>
              <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px]">
                <li>Proton Exchange Membrane (PEM) barrier</li>
                <li>Sulfonated polyarylene heavy metal shield</li>
                <li>TI BQ25570 nano-power boost harvester</li>
                <li>Cold-start amplifier functional from 20mV</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded flex flex-col gap-2">
              <span className="text-purple-400 font-bold">LAYER 3: HYBRID CAPACITOR BANK</span>
              <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px]">
                <li>Activated carbon negative plate double layer</li>
                <li>C_dl = 5000 Farads instantaneous buffer</li>
                <li>Faradaic Lead-Acid / LiFePO4 chemical core</li>
                <li>Subterranean 15°C geothermal heat sink</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
