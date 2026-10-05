/**
 * Project BioVolt: Type Definitions
 * Electro-Microbial Hybrid Cell (EMHC) & Under-Earth Electro-Microbial Grid (UE-EMG)
 */

export type StorageChemistry = 'lead_carbon' | 'lifepo4';

export interface BatteryParameters {
  chemistry: StorageChemistry;
  cCapacitive: number;     // Farads (double-layer capacitance of carbon matrix)
  maxFaradaicAh: number;   // Ah (faradaic storage capacity)
  rInternal: number;       // Ohms
  iBioAnode: number;       // Amperes (continuous bio trickle, e.g. 0.85A base)
  iSofc: number;           // Amperes (high-burst SOFC current, e.g. 50A)
  sofcBurnMode: 'single' | 'dual'; // Dual cycle: 06:00 and 18:00 (plot_simulation.py)
  sofcBurnStartMin: number;// Minute of day when SOFC activates (e.g. 360 = 06:00)
  sofcBurnDurationMin: number; // Duration of SOFC burn in minutes (e.g. 20 min)
  sofcBurn2StartMin?: number;  // Second burn at 18:00 (1080 min)
  loadBurstA: number;      // High-demand discharge pulse in Amperes
  loadBurstStartMin: number;
  loadBurstDurationMin: number;
  ambientTempC: number;    // Subterranean baseline 15°C
  enableArrhenius: boolean;// Arrhenius temperature-dependent kinetics
  simulateNoonCompostSpike: boolean; // 35°C thermal spike at 12:00-14:00
}

export interface SimulationStepResult {
  step: number;
  timestampSec: number;
  timeHours: number;
  timeFormatted: string;
  vCell: number;           // Cell voltage in Volts
  socFaradaic: number;     // Faradaic state of charge (0.0 to 1.0)
  socPercent: number;      // Faradaic SoC in percent (0 to 100%)
  qCapacitive: number;     // Stored capacitive charge in Coulombs
  vCapContribution: number;// Voltage contribution from capacitive double layer
  iBio: number;            // Current incoming from bio-anode (A)
  iSofc: number;           // Current incoming from SOFC (A)
  iLoad: number;           // Discharged load current (A)
  iTotalIn: number;        // Total input current (A)
  temperatureC: number;    // Subterranean temperature (°C)
  powerNetW: number;       // Net power (W)
  accumulatedWh: number;   // Total accumulated energy (Wh)
  chargeTransferRate: number; // Coulombs/sec transferred to Faradaic core
  isSofcActive: boolean;
  isLoadActive: boolean;
}


export interface CaissonComponent {
  id: string;
  depthRange: string;
  depthMeters: number;
  title: string;
  category: 'waste' | 'digester' | 'sofc' | 'bioanode' | 'storage' | 'geothermal' | 'grid';
  subtitle: string;
  description: string;
  technicalSpecs: { [key: string]: string };
  chemicalEquations?: string[];
  advantages: string[];
  operationalRole: string;
}

export interface GraphicNovelPanelData {
  id: number;
  title: string;
  subtitle: string;
  visualStyle: string;
  sceneDescription: string;
  dialogueCaption: string;
  technicalOverlay: {
    label: string;
    reading: string;
    description: string;
  }[];
  promptText: string;
}
