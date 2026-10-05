/**
 * Project BioVolt: CNC Manufacturing & Toolpath Simulation Studio
 * Visualizes 3-Axis CNC G-Code milling of custom multi-well acrylic casing for cell physical prototyping
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Wrench,
  Download,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Settings,
  ShieldCheck,
  Activity
} from 'lucide-react';

const CASING_MILLING_GCODE = `(====================================================================)
( PROJECT BIOVOLT: SUBTERRANEAN HYBRID CELL ENCLOSURE GENERATION     )
( MACHINE: 3-AXIS CNC MILL | MATERIAL: 15mm INDUSTRIAL ACRYLIC       )
( TOOL: 4mm FLAT-BOTTOM TWO-FLUTE CARBIDE END MILL                   )
( SAFETY CONDITIONS: CONTINUOUS FLOOD COOLANT ACTIVE TO PREVENT MELT )
(====================================================================)

G21 (Set dimensions to Metric - millimeters)
G90 (Absolute Positioning mode system configuration)
G17 (Select XY working plane coordinate matrix)

(--- SAFETY START & MACHINE INITIALIZATION ---)
G28 G91 Z0     (Retract Z-axis home to safety position relative to stock)
G90            (Return cleanly to Absolute mode)
M03 S2400      (Engage spindle clockwise at 2400 RPM optimization threshold)
M08            (Activate flood coolant loop to prevent acrylic welding)
G00 X0 Y0 Z5   (Rapid traverse to workpiece origin coordinate, floating 5mm clear)

(--- TOOLPATH SEQUENCE 01: MILLING WELL ALPHA ---)
G00 X30 Y40          (Rapid position tool over the center-point of Well Alpha)
G01 Z-2 F150         (Plunge cut step into stock matrix down to -2mm at 150 mm/min)
G01 X70 F400         (Linear feed cut to form the primary pocket base)
G01 Y80              (Milling top edge boundary path)
G01 X30              (Milling left return structural boundary)
G01 Y40              (Finalize Well Alpha layer perimeter trace)

(--- DEEPENING PLUNGE PASS 02: WELL ALPHA STABILITY DEEPENING ---)
G01 Z-5 F120         (Plunge step down to -5mm depth ceiling)
G01 X70 F450         (Execute clean profiling pass along layout walls)
G01 Y80
G01 X30
G01 Y40              (Well Alpha internal relief cavity pass complete)
G00 Z5               (Retract mill clear of part to safety height)

(--- TOOLPATH SEQUENCE 02: MILLING WELL BETA ---)
G00 X110 Y40         (Rapid offset transition across material to Well Beta origin)
G01 Z-2 F150         (Plunge cut step down into material face)
G01 X150 F400        (Linear milling sequence to trace secondary pocket frame)
G01 Y80
G01 X110
G01 Y40              (Finalize layer perimeter trace)

(--- DEEPENING PLUNGE PASS 02: WELL BETA STABILITY DEEPENING ---)
G01 Z-5 F120         (Plunge deeper to mirror structural capacity constraints)
G01 X150 F450        (Execute clean matching clearance profile)
G01 Y80
G01 X110
G01 Y40              (Well Beta structural chamber complete)

(--- SYSTEM SHUTDOWN & MACHINE RETRACTION ---)
G00 Z15              (Retract spindle 15mm clear of physical fixtures)
M09                  (Deactivate liquid coolant flow loop)
M05                  (Bring spindle to complete stop)
G00 X0 Y0            (Return table tool to standard part extraction home coordinate)
M30                  (End of program file execution block)
`;

export const CncManufacturingStudio: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(0);
  const [spindleRpm, setSpindleRpm] = useState<number>(2400);
  const [coolantActive, setCoolantActive] = useState<boolean>(true);
  const [currentToolPos, setCurrentToolPos] = useState<{ x: number; y: number; z: number }>({
    x: 0,
    y: 0,
    z: 5,
  });

  // Simulation loop for CNC tool movement
  useEffect(() => {
    if (!isSimulating) return;

    const toolpathWaypoints = [
      { x: 0, y: 0, z: 5 },
      { x: 30, y: 40, z: 5 },
      { x: 30, y: 40, z: -2 },
      { x: 70, y: 40, z: -2 },
      { x: 70, y: 80, z: -2 },
      { x: 30, y: 80, z: -2 },
      { x: 30, y: 40, z: -5 },
      { x: 70, y: 40, z: -5 },
      { x: 70, y: 80, z: -5 },
      { x: 30, y: 80, z: -5 },
      { x: 30, y: 40, z: 5 },
      { x: 110, y: 40, z: 5 },
      { x: 110, y: 40, z: -2 },
      { x: 150, y: 40, z: -2 },
      { x: 150, y: 80, z: -2 },
      { x: 110, y: 80, z: -2 },
      { x: 110, y: 40, z: -5 },
      { x: 150, y: 40, z: -5 },
      { x: 150, y: 80, z: -5 },
      { x: 110, y: 80, z: -5 },
      { x: 110, y: 40, z: 15 },
      { x: 0, y: 0, z: 15 },
    ];

    const interval = setInterval(() => {
      setSimProgress((prev) => {
        const next = (prev + 1) % toolpathWaypoints.length;
        setCurrentToolPos(toolpathWaypoints[next]);
        return next;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CASING_MILLING_GCODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadGcode = () => {
    const blob = new Blob([CASING_MILLING_GCODE], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'casing_milling.gcode';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="p-6 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Wrench className="w-4 h-4" />
            <span>CNC PRECISION MACHINING // G-CODE GENERATOR</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-tech)' }}>
            Physical Prototype Enclosure Machining (casing_milling.gcode)
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            3-Axis CNC milling toolpaths programmed for 15mm optical-grade cast acrylic. Features dual
            symmetrical anaerobic digestion and lead-carbon storage wells with continuous flood coolant loops.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-300 transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy G-Code'}</span>
          </button>
          <button
            onClick={handleDownloadGcode}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs font-mono transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .gcode</span>
          </button>
        </div>
      </div>

      {/* CNC Virtual Bed & Live Coordinate Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 2D Toolpath Visualizer Canvas (lg:col-span-6) */}
        <div className="lg:col-span-6 p-5 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
            <span className="text-white font-bold">CNC BED WORKPIECE VIEW (180mm x 120mm)</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold transition-colors ${
                  isSimulating
                    ? 'bg-rose-500 hover:bg-rose-400 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {isSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isSimulating ? 'Pause Toolpath' : 'Simulate Mill'}</span>
              </button>
              <button
                onClick={() => {
                  setIsSimulating(false);
                  setSimProgress(0);
                  setCurrentToolPos({ x: 0, y: 0, z: 5 });
                }}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative w-full aspect-[4/3] bg-[#070A10] border border-slate-800 rounded-lg p-3 overflow-hidden">
            <svg viewBox="0 0 200 140" className="w-full h-full select-none font-mono">
              {/* Acrylic Stock Boundary (180x120mm centered) */}
              <rect x="10" y="10" width="180" height="120" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
              <text x="15" y="22" fill="#64748B" fontSize="6">
                15mm CAST ACRYLIC STOCK
              </text>

              {/* Grid markings */}
              {[30, 70, 110, 150].map((x, i) => (
                <line key={i} x1={x} y1="10" x2={x} y2="130" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="2 2" />
              ))}
              {[40, 80].map((y, i) => (
                <line key={i} x1="10" y1={y} x2="190" y2={y} stroke="#1E293B" strokeWidth="0.5" strokeDasharray="2 2" />
              ))}

              {/* Well Alpha (Bio-Anode Well: X30 to X70, Y40 to Y80) */}
              <rect
                x="30"
                y="40"
                width="40"
                height="40"
                rx="3"
                fill="#164E63"
                fillOpacity="0.4"
                stroke="#06B6D4"
                strokeWidth="1.5"
              />
              <text x="50" y="58" fill="#67E8F9" fontSize="6" textAnchor="middle" fontWeight="bold">
                WELL ALPHA
              </text>
              <text x="50" y="66" fill="#22D3EE" fontSize="5" textAnchor="middle">
                Bio-Anode 40x40mm
              </text>
              <text x="50" y="73" fill="#A5F3FC" fontSize="4.5" textAnchor="middle">
                Depth: -5.0mm
              </text>

              {/* Well Beta (Lead-Carbon Matrix Well: X110 to X150, Y40 to Y80) */}
              <rect
                x="110"
                y="40"
                width="40"
                height="40"
                rx="3"
                fill="#581C87"
                fillOpacity="0.4"
                stroke="#C084FC"
                strokeWidth="1.5"
              />
              <text x="130" y="58" fill="#E9D5FF" fontSize="6" textAnchor="middle" fontWeight="bold">
                WELL BETA
              </text>
              <text x="130" y="66" fill="#D8B4FE" fontSize="5" textAnchor="middle">
                Lead-Carbon 40x40mm
              </text>
              <text x="130" y="73" fill="#F3E8FF" fontSize="4.5" textAnchor="middle">
                Depth: -5.0mm
              </text>

              {/* Center Channel Bridge / PEM Slot */}
              <line x1="70" y1="60" x2="110" y2="60" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 1" />
              <text x="90" y="56" fill="#FDE68A" fontSize="5" textAnchor="middle">
                PEM GASKET SLOT
              </text>

              {/* Animated Milling End Mill Tool Indicator */}
              <circle
                cx={currentToolPos.x}
                cy={currentToolPos.y}
                r="4"
                fill={currentToolPos.z < 0 ? '#EF4444' : '#F59E0B'}
                fillOpacity="0.6"
                stroke="#FFFFFF"
                strokeWidth="1"
              />
              {currentToolPos.z < 0 && (
                <circle cx={currentToolPos.x} cy={currentToolPos.y} r="8" fill="none" stroke="#EF4444" strokeWidth="0.5" className="animate-ping" />
              )}
            </svg>
          </div>

          {/* Real-Time Machine Telemetry Ribbon */}
          <div className="grid grid-cols-4 gap-2 text-xs font-mono pt-1">
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
              <span className="text-[10px] text-slate-500 uppercase block">TOOL X</span>
              <span className="text-white font-bold">{currentToolPos.x.toFixed(1)} mm</span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
              <span className="text-[10px] text-slate-500 uppercase block">TOOL Y</span>
              <span className="text-white font-bold">{currentToolPos.y.toFixed(1)} mm</span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
              <span className="text-[10px] text-slate-500 uppercase block">DEPTH Z</span>
              <span className={currentToolPos.z < 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {currentToolPos.z.toFixed(1)} mm
              </span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
              <span className="text-[10px] text-slate-500 uppercase block">SPINDLE</span>
              <span className="text-amber-400 font-bold">{spindleRpm} RPM</span>
            </div>
          </div>
        </div>

        {/* Right: G-Code Program Viewer (lg:col-span-6) */}
        <div className="lg:col-span-6 p-5 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span>TOOLPATH G-CODE SCRIPT</span>
            <span>4mm CARBIDE END MILL</span>
          </div>

          <div className="p-4 bg-[#070A10] rounded border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed max-h-[380px] overflow-y-auto">
            <pre className="text-slate-300 selection:bg-cyan-500/20">{CASING_MILLING_GCODE}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
