/**
 * Project BioVolt: Sub-Surface Diagnostics, PEM Troubleshooting & CLI Terminal Studio
 * Interactive cli_manager.py terminal, PEM troubleshooting index, and automated
 * sub-surface warning email alert function block for CRITICAL_BIO_DROP events.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  AlertTriangle,
  Mail,
  ShieldAlert,
  Download,
  Copy,
  Check,
  Send,
  RotateCcw,
  Zap,
  Play,
  FileText,
  Search,
  CheckCircle,
  ExternalLink,
  Flame,
  Info,
  Radio,
  Sliders
} from 'lucide-react';
import {
  generateCriticalBioDropEmail,
  generatePythonEmailDispatcherScript,
  generateNodeMailerScript,
  EmailAlertPayload,
  DispatchLogEntry
} from '../services/alertEmailService';
import {
  PEM_FAULT_INDEX,
  PEM_TROUBLESHOOTING_MD,
  PemFaultDefinition
} from '../data/pemTroubleshootingData';
import { CLI_MANAGER_PY } from '../data/cliManagerScript';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'warning' | 'success' | 'system';
  text: string;
  timestamp: string;
}

export interface AlertThresholdConfig {
  ocvCriticalV: number;
  ocvWarningV: number;
  tempCriticalHighC: number;
  tempCriticalLowC: number;
  tempOptimalBaselineC: number;
  internalResMaxMOhm: number;
  minHarvestCurrentA: number;
  autoEmailDispatch: boolean;
  soundAlarmEnabled: boolean;
  visualStrobeEnabled: boolean;
}

export const DEFAULT_THRESHOLDS: AlertThresholdConfig = {
  ocvCriticalV: 0.350,
  ocvWarningV: 0.420,
  tempCriticalHighC: 28.0,
  tempCriticalLowC: 8.0,
  tempOptimalBaselineC: 15.0,
  internalResMaxMOhm: 500.0,
  minHarvestCurrentA: 0.150,
  autoEmailDispatch: true,
  soundAlarmEnabled: true,
  visualStrobeEnabled: true,
};

export type SystemHealthState =
  | 'NOMINAL'
  | 'WARNING_METABOLIC_SLOWDOWN'
  | 'CRITICAL_BIO_DROP'
  | 'THERMAL_STALL_HIGH'
  | 'THERMAL_STALL_LOW';

export const evaluateSystemHealth = (
  vAnode: number,
  tempC: number,
  iBio: number,
  tLimits: AlertThresholdConfig
): {
  status: SystemHealthState;
  severity: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  label: string;
  description: string;
  badgeClass: string;
  fieldAction: string;
} => {
  if (vAnode < tLimits.ocvCriticalV) {
    return {
      status: 'CRITICAL_BIO_DROP',
      severity: 'CRITICAL',
      label: 'CRITICAL BIO DROP',
      description: `Bio-Anode OCV (${vAnode.toFixed(3)}V) has breached critical limit (< ${tLimits.ocvCriticalV.toFixed(3)}V). Microbial metabolic electron flux collapse.`,
      badgeClass: 'bg-red-500 text-white animate-pulse',
      fieldAction: "Deploy 'FORCE_ISOLATE' immediately via CLI terminal to prevent Lead-Carbon battery polarity inversion."
    };
  }
  if (tempC > tLimits.tempCriticalHighC) {
    return {
      status: 'THERMAL_STALL_HIGH',
      severity: 'CRITICAL',
      label: 'THERMAL STALL HIGH',
      description: `Caisson bedrock temperature (${tempC.toFixed(1)}°C) exceeds upper safety threshold (> ${tLimits.tempCriticalHighC.toFixed(1)}°C). Bedrock heat saturation.`,
      badgeClass: 'bg-orange-500 text-white animate-pulse',
      fieldAction: 'Throttle SOFC burn cycle down to 8 minutes; engage borehole geothermal pump at 100% duty cycle.'
    };
  }
  if (tempC < tLimits.tempCriticalLowC) {
    return {
      status: 'THERMAL_STALL_LOW',
      severity: 'CRITICAL',
      label: 'THERMAL STALL LOW',
      description: `Caisson bedrock temperature (${tempC.toFixed(1)}°C) fell below minimum metabolic window (< ${tLimits.tempCriticalLowC.toFixed(1)}°C). Bacterial kinetics stalled.`,
      badgeClass: 'bg-blue-500 text-white animate-pulse',
      fieldAction: 'Engage auxiliary thermophilic heating loop in the anaerobic digester manifold.'
    };
  }
  if (vAnode < tLimits.ocvWarningV) {
    return {
      status: 'WARNING_METABOLIC_SLOWDOWN',
      severity: 'WARNING',
      label: 'METABOLIC WARNING',
      description: `Bio-Anode OCV (${vAnode.toFixed(3)}V) has entered warning band (< ${tLimits.ocvWarningV.toFixed(3)}V). Biofilm substrate depletion detected.`,
      badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
      fieldAction: 'Prepare automated 50mM sodium acetate electron-donor replenishment batch.'
    };
  }
  return {
    status: 'NOMINAL',
    severity: 'NOMINAL',
    label: 'NOMINAL',
    description: 'All subterranean biological, electrochemical, and thermal parameters are strictly within nominal envelopes.',
    badgeClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    fieldAction: 'Continuous 0.85A exoelectrogen trickle current flowing into Lead-Carbon capacitive matrix.'
  };
};

export const TroubleshootingCliStudio: React.FC = () => {
  // Navigation tabs within studio
  const [activeStudioTab, setActiveStudioTab] = useState<'cli' | 'email_alert' | 'thresholds' | 'pem_index' | 'code_exports'>('cli');

  // Simulated Hardware State
  const [operatorEmail, setOperatorEmail] = useState<string>('bhuyanamitnishanka@gmail.com');
  const [bioAnodeV, setBioAnodeV] = useState<number>(0.540);
  const [bioAnodeI, setBioAnodeI] = useState<number>(0.852);
  const [caissonTempC, setCaissonTempC] = useState<number>(15.2);
  const [batteryV, setBatteryV] = useState<number>(2.140);
  const [batterySoc, setBatterySoc] = useState<number>(82.4);
  const [isIsolated, setIsIsolated] = useState<boolean>(false);
  const [mpptFloorV, setMpptFloorV] = useState<number>(0.35);
  const [sofcActive, setSofcActive] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Custom Alert Threshold Configuration
  const [thresholds, setThresholds] = useState<AlertThresholdConfig>(DEFAULT_THRESHOLDS);
  const [selectedProfile, setSelectedProfile] = useState<string>('basalt_default');
  const [saveConfirmation, setSaveConfirmation] = useState<boolean>(false);

  // Dynamic status evaluation
  const healthEvaluation = evaluateSystemHealth(bioAnodeV, caissonTempC, bioAnodeI, thresholds);
  const statusFlag = healthEvaluation.status;

  // Email Alert State
  const [emailAlertsLog, setEmailAlertsLog] = useState<DispatchLogEntry[]>([
    {
      id: 'DISP-INIT-001',
      timestamp: new Date(Date.now() - 3600000).toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      recipient: 'bhuyanamitnishanka@gmail.com',
      subject: '[EMERGENCY ALERT] CRITICAL_BIO_DROP Detected in Caisson Vault UE-EMG-VAULT-01',
      status: 'SENT_MOCK',
      deliveryLatencyMs: 412,
      incidentPayload: {
        incidentId: 'INC-BASELINE-01',
        timestamp: new Date().toISOString(),
        vaultId: 'UE-EMG-VAULT-01',
        cellBlock: 'CAISSON-04-PFSA',
        faultCode: 'PEM-E02',
        statusFlag: 'CRITICAL_BIO_DROP',
        bioAnodeVoltageV: 0.285,
        bioAnodeCurrentA: 0.082,
        internalResistanceMOhm: 580.0,
        caissonTempC: 15.2,
        sofcStatus: 'STANDBY',
        operatorEmail: 'bhuyanamitnishanka@gmail.com',
        rootCause: 'Anaerobic substrate starvation causing sudden metabolic electron collapse.',
        recommendedActions: [
          'Deploy FORCE_ISOLATE immediately via cli_manager.py',
          'Inject 50mM sodium acetate substrate replenishment slug',
          'Activate low-frequency 40Hz acoustic de-fouling transducer'
        ]
      }
    }
  ]);
  const [emailPreviewMode, setEmailPreviewMode] = useState<'html' | 'text'>('html');
  const [selectedFaultCode, setSelectedFaultCode] = useState<string>('PEM-E02');
  const [pemSearchQuery, setPemSearchQuery] = useState<string>('');

  // Terminal State
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'system',
      text: 'Project BioVolt: Under-Earth Electro-Microbial Grid (UE-EMG) CLI v2.4.0-PROD',
      timestamp: '00:00:01'
    },
    {
      id: 'init-2',
      type: 'system',
      text: 'Connected to Subterranean Node: UE-EMG-VAULT-01 (Caisson-04 Array)',
      timestamp: '00:00:02'
    },
    {
      id: 'init-3',
      type: 'output',
      text: 'Type "help" for command matrix, "status" for telemetry, or "scan" to test diagnostic triggers.',
      timestamp: '00:00:03'
    }
  ]);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleDownload = (filename: string, content: string, mimeType: string = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to trigger automated sub-surface warning email alert
  const triggerWarningEmailAlert = (customVoltage?: number, customCurrent?: number) => {
    const volt = customVoltage !== undefined ? customVoltage : bioAnodeV;
    const curr = customCurrent !== undefined ? customCurrent : bioAnodeI;

    const payload: EmailAlertPayload = {
      incidentId: `INC-${Date.now().toString().slice(-6)}-BIO`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      vaultId: 'UE-EMG-VAULT-01',
      cellBlock: 'CAISSON-04-PFSA',
      faultCode: 'PEM-E02',
      statusFlag: 'CRITICAL_BIO_DROP',
      bioAnodeVoltageV: volt,
      bioAnodeCurrentA: curr,
      internalResistanceMOhm: 580.0,
      caissonTempC: 15.2,
      sofcStatus: sofcActive ? 'ACTIVE (50A)' : 'STANDBY',
      operatorEmail: operatorEmail,
      rootCause:
        'Anaerobic metabolic electron flux collapse below sustained threshold. Microbial biofilm on carbon-nanotube cloth experiencing substrate exhaustion or shear detachment. Voltage drop below 0.35V risks capacitive matrix inversion.',
      recommendedActions: [
        "Deploy 'FORCE_ISOLATE' via cli_manager.py to disconnect Lead-Carbon capacitive matrix.",
        'Verify anaerobic digester fluid pH (must be between 6.8 and 7.4).',
        'Trigger automated 50mM sodium acetate electron-donor replenishment batch.',
        'Inspect PFSA Proton Exchange Membrane for crossover sulfate contamination.'
      ]
    };

    const newLogEntry: DispatchLogEntry = {
      id: `DISP-${Date.now().toString().slice(-6)}`,
      timestamp: payload.timestamp,
      recipient: operatorEmail,
      subject: `[EMERGENCY ALERT] CRITICAL_BIO_DROP in Caisson Vault ${payload.vaultId} - Immediate Mitigation Required`,
      status: 'SENT_MOCK',
      deliveryLatencyMs: Math.floor(Math.random() * 250) + 320,
      incidentPayload: payload
    };

    setEmailAlertsLog(prev => [newLogEntry, ...prev]);

    return { payload, newLogEntry };
  };

  // Command Execution Engine for the Interactive CLI
  const executeCommand = (cmdString: string) => {
    const trimmed = cmdString.trim();
    if (!trimmed) return;

    // Add to history
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const timeStr = new Date().toTimeString().substring(0, 8);
    const newLines: TerminalLine[] = [
      {
        id: `cmd-${Date.now()}`,
        type: 'input',
        text: `biovolt@UE-EMG-VAULT-01:~/caisson-04$ ${trimmed}`,
        timestamp: timeStr
      }
    ];

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        newLines.push({
          id: `out-${Date.now()}-1`,
          type: 'output',
          text: `
AVAILABLE HARDWARE CLI COMMANDS:
  status                  Display real-time telemetry, voltages, and caisson states.
  scan                    Run electrochemical diagnostic scan. Detects CRITICAL_BIO_DROP.
  isolate                 Send emergency FORCE_ISOLATE command (cuts Lead-Carbon gate).
  reconnect               Send RESUME_HARVEST command to restore bio-current loop.
  alert [email]           Dispatch sub-surface warning email alert to operator.
  drop                    Simulate a metabolic voltage crash to 0.280V (<0.35V).
  sofc [burn|stop]        Control subterranean Solid-Oxide Fuel Cell co-generation burns.
  mppt <volts>            Adjust bio-anode MPPT floor voltage (default: 0.35V).
  pem [code]              Query PEM Block Troubleshooting Index (e.g., 'pem PEM-E02').
  email-test              Test email alert dispatch to ${operatorEmail}.
  export                  Export active telemetry snapshot to JSON file.
  clear                   Clear the interactive console screen.
`,
          timestamp: timeStr
        });
        break;

      case 'status':
        newLines.push({
          id: `out-${Date.now()}-status`,
          type: statusFlag === 'CRITICAL_BIO_DROP' ? 'warning' : 'output',
          text: `
--- SUBTERRANEAN NODE TELEMETRY: UE-EMG-VAULT-01 ---
  System Health:       ${statusFlag}
  Circuit Topology:    ${isIsolated ? 'ISOLATED (Bursts Gate LOW)' : 'COUPLED (Lead-Carbon Matrix)'}
  Biofilm Harvesting:  ${isIsolated ? 'HALTED' : 'ENABLED'}
  Bio-Anode OCV:       ${bioAnodeV.toFixed(3)} V (Floor: ${mpptFloorV.toFixed(2)} V)
  Bio Harvest Current: ${bioAnodeI.toFixed(3)} A
  Storage Terminal V:  ${batteryV.toFixed(3)} V
  Faradaic SoC:        ${batterySoc.toFixed(1)} %
  Internal Impedance:  ${bioAnodeV < 0.35 ? '580.0 mΩ (ELEVATED)' : '15.0 mΩ (NOMINAL)'}
  Bedrock Temp:        15.2 °C (15m depth basalt)
  SOFC Burn State:     ${sofcActive ? 'ACTIVE (50A Co-Gen)' : 'STANDBY (0A)'}
  Operator Contact:    ${operatorEmail}
  Active Watchdog:     READY
`,
          timestamp: timeStr
        });
        break;

      case 'scan':
        newLines.push({
          id: `out-${Date.now()}-scan1`,
          type: 'output',
          text: 'Initiating high-frequency electrochemical impedance diagnostic scan...',
          timestamp: timeStr
        });
        newLines.push({
          id: `out-${Date.now()}-scan2`,
          type: 'output',
          text: ' -> Interrogating Geobacter sulfurreducens bio-anode boundary...',
          timestamp: timeStr
        });
        newLines.push({
          id: `out-${Date.now()}-scan3`,
          type: 'output',
          text: ' -> Checking PFSA membrane differential pressure and hydration balance...',
          timestamp: timeStr
        });

        if (bioAnodeV < mpptFloorV) {
          const { newLogEntry } = triggerWarningEmailAlert(bioAnodeV, bioAnodeI);
          newLines.push({
            id: `out-${Date.now()}-alert1`,
            type: 'error',
            text: `[DIAGNOSTIC ALARM]: ANOMALY DETECTED IN CELL BLOCK CAISSON-04-PFSA`,
            timestamp: timeStr
          });
          newLines.push({
            id: `out-${Date.now()}-alert2`,
            type: 'warning',
            text: ` Code: PEM-E02 - Biofilm Starvation or Nanowire Disconnection`,
            timestamp: timeStr
          });
          newLines.push({
            id: `out-${Date.now()}-alert3`,
            type: 'warning',
            text: ` Measured Bio-Anode OCV: ${bioAnodeV.toFixed(3)} V [THRESHOLD: < ${mpptFloorV.toFixed(2)} V]`,
            timestamp: timeStr
          });
          newLines.push({
            id: `out-${Date.now()}-alert4`,
            type: 'success',
            text: `✔ AUTOMATED SUB-SURFACE WARNING EMAIL DISPATCHED to ${operatorEmail}`,
            timestamp: timeStr
          });
          newLines.push({
            id: `out-${Date.now()}-alert5`,
            type: 'system',
            text: `  Incident ID: ${newLogEntry.incidentPayload.incidentId} | Latency: ${newLogEntry.deliveryLatencyMs}ms | Action: Run "isolate"`,
            timestamp: timeStr
          });
        } else {
          newLines.push({
            id: `out-${Date.now()}-nom`,
            type: 'success',
            text: `✔ DIAGNOSTIC SCAN COMPLETE: All subterranean telemetry within nominal parameters. (OCV: ${bioAnodeV.toFixed(3)}V, Current: ${bioAnodeI.toFixed(3)}A)`,
            timestamp: timeStr
          });
        }
        break;

      case 'drop':
      case 'simulate_drop':
        setBioAnodeV(0.280);
        setBioAnodeI(0.095);
        newLines.push({
          id: `out-${Date.now()}-drop1`,
          type: 'warning',
          text: '[SIMULATING METABOLIC FAILURE]: Inducing acetate substrate starvation...',
          timestamp: timeStr
        });
        newLines.push({
          id: `out-${Date.now()}-drop2`,
          type: 'error',
          text: 'Bio-Anode OCV crashed to: 0.280 V (< 0.350 V limit)',
          timestamp: timeStr
        });
        newLines.push({
          id: `out-${Date.now()}-drop3`,
          type: 'output',
          text: 'Run "scan" to trigger the automated alert dispatcher, or run "alert" directly.',
          timestamp: timeStr
        });
        break;

      case 'alert':
      case 'email-test':
        {
          const recipient = args[0] || operatorEmail;
          const { newLogEntry } = triggerWarningEmailAlert(0.285, 0.082);
          newLines.push({
            id: `out-${Date.now()}-test1`,
            type: 'warning',
            text: `[EMERGENCY ALERT TRIGGERED]: Sub-surface warning email dispatch initiated...`,
            timestamp: timeStr
          });
          newLines.push({
            id: `out-${Date.now()}-test2`,
            type: 'success',
            text: `✔ ALERT DISPATCHED SUCCESSFULLY to ${recipient}`,
            timestamp: timeStr
          });
          newLines.push({
            id: `out-${Date.now()}-test3`,
            type: 'system',
            text: `  Incident ID: ${newLogEntry.incidentPayload.incidentId} | Delivery Latency: ${newLogEntry.deliveryLatencyMs}ms`,
            timestamp: timeStr
          });
          newLines.push({
            id: `out-${Date.now()}-test4`,
            type: 'output',
            text: `  Recommended mitigation: Type "isolate" to disconnect Lead-Carbon matrix.`,
            timestamp: timeStr
          });
        }
        break;

      case 'isolate':
      case 'force_isolate':
        setIsIsolated(true);
        newLines.push({
          id: `out-${Date.now()}-iso1`,
          type: 'warning',
          text: '[DISPATCHING EMERGENCY COMMAND]: FORCE_ISOLATE -> UE-EMG-VAULT-01...',
          timestamp: timeStr
        });
        newLines.push({
          id: `out-${Date.now()}-iso2`,
          type: 'success',
          text: '✔ PIN 12 (BURST_MODE_GATE_PIN) pulled LOW.',
          timestamp: timeStr
        });
        newLines.push({
          id: `out-${Date.now()}-iso3`,
          type: 'output',
          text: '  Biological compartment decoupled from Lead-Carbon capacitive matrix.',
          timestamp: timeStr
        });
        newLines.push({
          id: `out-${Date.now()}-iso4`,
          type: 'output',
          text: '  Cell voltage inversion risk neutralized. System state: STANDBY.',
          timestamp: timeStr
        });
        break;

      case 'reconnect':
      case 'resume_harvest':
        setIsIsolated(false);
        setBioAnodeV(0.540);
        setBioAnodeI(0.852);
        newLines.push({
          id: `out-${Date.now()}-rec1`,
          type: 'system',
          text: '[DISPATCHING COMMAND]: RESUME_HARVEST -> UE-EMG-VAULT-01...',
          timestamp: timeStr
        });
        newLines.push({
          id: `out-${Date.now()}-rec2`,
          type: 'success',
          text: '✔ Gate enabled. Exoelectrogen trickle current flowing into solid-state matrix.',
          timestamp: timeStr
        });
        newLines.push({
          id: `out-${Date.now()}-rec3`,
          type: 'output',
          text: '  Bio-anode OCV restored to 0.540V. Telemetry status: NOMINAL.',
          timestamp: timeStr
        });
        break;

      case 'sofc':
        {
          const sub = (args[0] || 'status').toLowerCase();
          if (sub === 'burn' || sub === 'start') {
            setSofcActive(true);
            setBatteryV(2.38);
            setBatterySoc(prev => Math.min(100, prev + 5.0));
            newLines.push({
              id: `out-${Date.now()}-sofc1`,
              type: 'warning',
              text: '[IGNITING SOFC CO-GENERATION BURN]: 50A current injection for 20 minutes...',
              timestamp: timeStr
            });
            newLines.push({
              id: `out-${Date.now()}-sofc2`,
              type: 'success',
              text: '✔ Methane fuel cell online. Stored Lead-Carbon charge rising rapidly.',
              timestamp: timeStr
            });
          } else if (sub === 'stop' || sub === 'abort') {
            setSofcActive(false);
            setBatteryV(2.14);
            newLines.push({
              id: `out-${Date.now()}-sofc3`,
              type: 'system',
              text: '[HALTING SOFC BURN]: Valve closed. Thermal recovery initiated...',
              timestamp: timeStr
            });
          } else {
            newLines.push({
              id: `out-${Date.now()}-sofc4`,
              type: 'output',
              text: `SOFC Burn State: ${sofcActive ? 'ACTIVE (50A injection)' : 'STANDBY (0A)'}`,
              timestamp: timeStr
            });
          }
        }
        break;

      case 'mppt':
        if (args[0]) {
          const val = parseFloat(args[0]);
          if (!isNaN(val)) {
            setMpptFloorV(val);
            newLines.push({
              id: `out-${Date.now()}-mppt`,
              type: 'success',
              text: `✔ MPPT voltage floor updated to: ${val.toFixed(2)} V`,
              timestamp: timeStr
            });
          } else {
            newLines.push({
              id: `out-${Date.now()}-mppt-err`,
              type: 'error',
              text: 'Invalid voltage value. Usage: mppt 0.35',
              timestamp: timeStr
            });
          }
        } else {
          newLines.push({
            id: `out-${Date.now()}-mppt-cur`,
            type: 'output',
            text: `Current MPPT voltage floor: ${mpptFloorV.toFixed(2)} V`,
            timestamp: timeStr
          });
        }
        break;

      case 'pem':
        {
          const code = (args[0] || 'all').toUpperCase();
          const fault = PEM_FAULT_INDEX.find(f => f.code === code);
          if (fault) {
            newLines.push({
              id: `out-${Date.now()}-pem-match`,
              type: 'output',
              text: `
[${fault.code}]: ${fault.title}
  Severity:     ${fault.severity}
  Root Cause:   ${fault.rootCause}
  Mitigation:   ${fault.immediateFieldMitigation[0]}
`,
              timestamp: timeStr
            });
          } else {
            newLines.push({
              id: `out-${Date.now()}-pem-list`,
              type: 'output',
              text: `
--- PEM TROUBLESHOOTING INDEX (System Block UE-EMG-PEM-04) ---
  PEM-E01: Localized Hydration Leaks (Cross-Over Contamination)
  PEM-E02: Biofilm Bio-Fouling & Nanowire Disconnection (CRITICAL_BIO_DROP)
  PEM-E03: Thermal Boundary Inversion (Bedrock Dissipation Stall)
  PEM-E04: Sulfation Bridging at Lead-Carbon Intercalated Matrix
`,
              timestamp: timeStr
            });
          }
        }
        break;

      case 'clear':
        setTerminalLines([]);
        setTerminalInput('');
        return;

      case 'export':
        {
          const exportData = {
            vault_id: 'UE-EMG-VAULT-01',
            cell_block: 'CAISSON-04-PFSA',
            system_status: statusFlag,
            bio_anode_v: bioAnodeV,
            bio_anode_i: bioAnodeI,
            battery_v: batteryV,
            battery_soc: batterySoc,
            isolated: isIsolated,
            mppt_floor_v: mpptFloorV,
            sofc_active: sofcActive,
            timestamp: new Date().toISOString()
          };
          handleDownload(`telemetry_snapshot_${Date.now()}.json`, JSON.stringify(exportData, null, 2), 'application/json');
          newLines.push({
            id: `out-${Date.now()}-exp`,
            type: 'success',
            text: '✔ Active telemetry snapshot exported to JSON file.',
            timestamp: timeStr
          });
        }
        break;

      default:
        newLines.push({
          id: `out-${Date.now()}-unk`,
          type: 'error',
          text: `Unknown command: "${command}". Type "help" to view the available commands.`,
          timestamp: timeStr
        });
        break;
    }

    setTerminalLines(prev => [...prev, ...newLines]);
    setTerminalInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(terminalInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < commandHistory.length) {
          setHistoryIndex(nextIdx);
          setTerminalInput(commandHistory[commandHistory.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setTerminalInput(commandHistory[commandHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setTerminalInput('');
      }
    }
  };

  // Filtered PEM Faults
  const filteredPemFaults = PEM_FAULT_INDEX.filter(fault => {
    if (!pemSearchQuery) return true;
    const query = pemSearchQuery.toLowerCase();
    return (
      fault.code.toLowerCase().includes(query) ||
      fault.title.toLowerCase().includes(query) ||
      fault.statusFlag.toLowerCase().includes(query) ||
      fault.rootCause.toLowerCase().includes(query)
    );
  });

  const activeEmailPayload = emailAlertsLog[0]?.incidentPayload || {
    incidentId: 'INC-DEMO-001',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    vaultId: 'UE-EMG-VAULT-01',
    cellBlock: 'CAISSON-04-PFSA',
    faultCode: 'PEM-E02',
    statusFlag: 'CRITICAL_BIO_DROP',
    bioAnodeVoltageV: bioAnodeV,
    bioAnodeCurrentA: bioAnodeI,
    internalResistanceMOhm: 580.0,
    caissonTempC: 15.2,
    sofcStatus: sofcActive ? 'ACTIVE (50A)' : 'STANDBY',
    operatorEmail: operatorEmail,
    rootCause:
      'Anaerobic metabolic electron flux collapse below sustained threshold. Microbial biofilm on carbon-nanotube cloth experiencing substrate exhaustion or shear detachment.',
    recommendedActions: [
      "Deploy 'FORCE_ISOLATE' via cli_manager.py to disconnect Lead-Carbon capacitive matrix.",
      'Verify anaerobic digester fluid pH (must be between 6.8 and 7.4).',
      'Trigger automated 50mM sodium acetate electron-donor replenishment batch.',
      'Inspect PFSA Proton Exchange Membrane for crossover sulfate contamination.'
    ]
  };

  const emailGenerated = generateCriticalBioDropEmail(activeEmailPayload);

  return (
    <div className="space-y-6">
      {/* Top Banner / System Telemetry Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#0D121D] border border-slate-800 shadow-lg">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${
            healthEvaluation.severity === 'CRITICAL'
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
              : healthEvaluation.severity === 'WARNING'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-tech)' }}>
                DIAGNOSTICS & HARDWARE CLI TERMINAL
              </h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${healthEvaluation.badgeClass}`}>
                {healthEvaluation.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              System Block ID: [UE-EMG-PEM-04] &bull; Vault: UE-EMG-VAULT-01 &bull; Alert Thresholds Engine Active
            </p>
          </div>
        </div>

        {/* Global Action & Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Bio OCV: </span>
            <span className={`font-bold ${
              bioAnodeV < thresholds.ocvCriticalV
                ? 'text-red-400'
                : bioAnodeV < thresholds.ocvWarningV
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}>
              {bioAnodeV.toFixed(3)}V
            </span>
            <span className="text-[10px] text-slate-500 ml-1">(Crit: &lt;{thresholds.ocvCriticalV.toFixed(2)}V)</span>
          </div>

          <div className="px-3 py-1.5 rounded bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Bedrock T: </span>
            <span className={`font-bold ${
              caissonTempC > thresholds.tempCriticalHighC
                ? 'text-orange-400'
                : caissonTempC < thresholds.tempCriticalLowC
                ? 'text-blue-400'
                : 'text-emerald-400'
            }`}>
              {caissonTempC.toFixed(1)}°C
            </span>
            <span className="text-[10px] text-slate-500 ml-1">({thresholds.tempCriticalLowC}°-{thresholds.tempCriticalHighC}°)</span>
          </div>

          <div className="px-3 py-1.5 rounded bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Gate: </span>
            <span className={`font-bold ${isIsolated ? 'text-amber-400' : 'text-cyan-400'}`}>
              {isIsolated ? 'ISOLATED' : 'COUPLED'}
            </span>
          </div>

          <button
            onClick={() => handleDownload('cli_manager.py', CLI_MANAGER_PY, 'text/x-python')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>cli_manager.py</span>
          </button>

          <button
            onClick={() => handleDownload('pem_troubleshooting.md', PEM_TROUBLESHOOTING_MD, 'text/markdown')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>pem_troubleshooting.md</span>
          </button>
        </div>
      </div>

      {/* Anomaly Notification Banner if Status not NOMINAL */}
      {healthEvaluation.severity !== 'NOMINAL' && (
        <div className={`p-4 rounded-xl border-2 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          healthEvaluation.severity === 'CRITICAL'
            ? 'bg-red-950/40 border-red-600/70'
            : 'bg-amber-950/30 border-amber-600/60'
        }`}>
          <div className="flex items-start gap-3">
            <ShieldAlert className={`w-6 h-6 shrink-0 mt-0.5 ${
              healthEvaluation.severity === 'CRITICAL' ? 'text-red-400 animate-bounce' : 'text-amber-400'
            }`} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                  THRESHOLD TRIGGER: {healthEvaluation.label}
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold text-white ${
                  healthEvaluation.severity === 'CRITICAL' ? 'bg-red-600' : 'bg-amber-600'
                }`}>
                  {healthEvaluation.severity === 'CRITICAL' ? 'LEVEL 1 EMERGENCY' : 'PREVENTATIVE WARNING'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {healthEvaluation.description} Action required: <strong className="text-amber-300 underline">{healthEvaluation.fieldAction}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {healthEvaluation.status === 'CRITICAL_BIO_DROP' && !isIsolated && (
              <button
                onClick={() => executeCommand('isolate')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md"
              >
                Execute FORCE_ISOLATE
              </button>
            )}
            <button
              onClick={() => setActiveStudioTab('thresholds')}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              Adjust Thresholds
            </button>
            <button
              onClick={() => setActiveStudioTab('email_alert')}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-white bg-red-800/80 hover:bg-red-700 transition-colors"
            >
              Inspect Alerts
            </button>
          </div>
        </div>
      )}

      {/* Primary Studio Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveStudioTab('cli')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
            activeStudioTab === 'cli'
              ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Interactive CLI Terminal (cli_manager.py)</span>
        </button>

        <button
          onClick={() => setActiveStudioTab('email_alert')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all relative ${
            activeStudioTab === 'email_alert'
              ? 'bg-red-400/10 text-red-400 border border-red-400/30 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Warning Email Alert Console</span>
          {healthEvaluation.status === 'CRITICAL_BIO_DROP' && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute top-1.5 right-1.5" />
          )}
        </button>

        <button
          onClick={() => setActiveStudioTab('thresholds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all relative ${
            activeStudioTab === 'thresholds'
              ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Alert Thresholds</span>
          {healthEvaluation.severity !== 'NOMINAL' && (
            <span
              className={`w-2 h-2 rounded-full ${
                healthEvaluation.severity === 'CRITICAL' ? 'bg-red-500 animate-ping' : 'bg-amber-400'
              } absolute top-1.5 right-1.5`}
            />
          )}
        </button>

        <button
          onClick={() => setActiveStudioTab('pem_index')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
            activeStudioTab === 'pem_index'
              ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>PEM Block Troubleshooting Index</span>
        </button>

        <button
          onClick={() => setActiveStudioTab('code_exports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
            activeStudioTab === 'code_exports'
              ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Dispatch Scripts & SMTPLib</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE CLI TERMINAL */}
      {activeStudioTab === 'cli' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Terminal Window (8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-[#070A10] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0D121D] border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2">
                  bash: python3 cli_manager.py --target=UE-EMG-VAULT-01
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => executeCommand('clear')}
                  className="text-[11px] font-mono text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
                >
                  Clear Screen
                </button>
                <button
                  onClick={() => handleDownload('cli_manager.py', CLI_MANAGER_PY, 'text/x-python')}
                  className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download .py</span>
                </button>
              </div>
            </div>

            {/* Scrollable Terminal Output Body */}
            <div className="p-4 font-mono text-xs overflow-y-auto max-h-[500px] min-h-[380px] space-y-1.5 leading-relaxed bg-[#06080E]">
              {terminalLines.map((line) => {
                let colorClass = 'text-slate-300';
                if (line.type === 'input') colorClass = 'text-amber-400 font-semibold';
                else if (line.type === 'error') colorClass = 'text-red-400 font-bold';
                else if (line.type === 'warning') colorClass = 'text-amber-300';
                else if (line.type === 'success') colorClass = 'text-emerald-400 font-semibold';
                else if (line.type === 'system') colorClass = 'text-cyan-400 font-mono';

                return (
                  <div key={line.id} className="whitespace-pre-wrap break-words">
                    <span className="text-slate-600 text-[10px] mr-2 select-none">[{line.timestamp}]</span>
                    <span className={colorClass}>{line.text}</span>
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>

            {/* Interactive Input Prompt Line */}
            <div className="flex items-center px-4 py-3 bg-[#0A0E17] border-t border-slate-800/80">
              <span className="text-emerald-400 font-mono text-xs font-semibold select-none mr-1.5 whitespace-nowrap">
                biovolt@UE-EMG-VAULT-01:~/caisson-04${' '}
              </span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type 'status', 'scan', 'isolate', 'drop', 'alert', or 'help'..."
                className="flex-1 bg-transparent text-slate-100 font-mono text-xs focus:outline-none placeholder:text-slate-600"
                autoFocus
              />
              <button
                onClick={() => executeCommand(terminalInput)}
                className="ml-2 px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded text-xs font-mono font-medium flex items-center gap-1 transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>Send</span>
              </button>
            </div>
          </div>

          {/* Quick Command Launcher & Hardware State (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Quick Actions Panel */}
            <div className="p-4 rounded-xl bg-[#0D121D] border border-slate-800">
              <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Hardware Dispatch Presets</span>
              </h3>
              <p className="text-[11px] text-slate-400 mb-3">
                Click any shortcut to trigger real-time command execution inside the CLI terminal:
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => executeCommand('scan')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-cyan-300 hover:text-cyan-200 transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>scan (Diags)</span>
                </button>

                <button
                  onClick={() => executeCommand('status')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white transition-colors"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>status (Telemetry)</span>
                </button>

                <button
                  onClick={() => executeCommand('drop')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-red-950/50 hover:bg-red-900/60 border border-red-800/80 text-xs font-mono text-red-300 hover:text-red-100 transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>drop (&lt;0.35V)</span>
                </button>

                <button
                  onClick={() => executeCommand('alert')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/80 text-xs font-mono text-amber-300 hover:text-amber-100 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>alert (Send Email)</span>
                </button>

                <button
                  onClick={() => executeCommand('isolate')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-xs font-mono text-amber-400 font-bold hover:text-amber-300 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>FORCE_ISOLATE</span>
                </button>

                <button
                  onClick={() => executeCommand('reconnect')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-xs font-mono text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>RESUME_HARVEST</span>
                </button>

                <button
                  onClick={() => executeCommand('sofc burn')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>sofc burn (50A)</span>
                </button>

                <button
                  onClick={() => executeCommand('pem PEM-E02')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-purple-300 hover:text-purple-200 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>pem PEM-E02</span>
                </button>
              </div>
            </div>

            {/* Live Caisson Node Status Card */}
            <div className="p-4 rounded-xl bg-[#0D121D] border border-slate-800">
              <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider mb-3">
                Sub-Surface Telemetry Monitor
              </h3>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Biofilm OCV (Pin A0)</span>
                  <span className={`font-bold ${bioAnodeV < 0.35 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {bioAnodeV.toFixed(3)} V
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Harvest Current</span>
                  <span className="font-bold text-slate-200">{bioAnodeI.toFixed(3)} A</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Lead-Carbon Cell V</span>
                  <span className="font-bold text-slate-200">{batteryV.toFixed(3)} V</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Lead-Core SoC</span>
                  <span className="font-bold text-cyan-400">{batterySoc.toFixed(1)} %</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Gate Isolation PIN 12</span>
                  <span className={`font-bold ${isIsolated ? 'text-amber-400' : 'text-slate-400'}`}>
                    {isIsolated ? 'LOW (ISOLATED)' : 'HIGH (ENABLED)'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Operator Recipient</span>
                  <span className="text-amber-400 text-[11px] truncate max-w-[150px]" title={operatorEmail}>
                    {operatorEmail}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">Watchdog Daemon</span>
                <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ACTIVE</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WARNING EMAIL ALERT CONSOLE */}
      {activeStudioTab === 'email_alert' && (
        <div className="space-y-6">
          {/* Email Settings & Dispatch Trigger Bar */}
          <div className="p-5 rounded-xl bg-[#0D121D] border border-slate-800 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-4 h-4 text-red-400" />
                  <span>Sub-Surface Warning Email Alert Function Block</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Automated notification daemon triggered when subterranean diagnostic scans detect a{' '}
                  <code className="text-red-400 font-mono">CRITICAL_BIO_DROP</code> in Caisson Array 04.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => triggerWarningEmailAlert(0.285, 0.082)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Test Warning Email</span>
                </button>
              </div>
            </div>

            {/* Operator Configuration Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-800/80">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Operator Recipient Email:
                </label>
                <input
                  type="email"
                  value={operatorEmail}
                  onChange={(e) => setOperatorEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Metabolic OCV Trigger Floor:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.20"
                    max="0.60"
                    value={mpptFloorV}
                    onChange={(e) => setMpptFloorV(parseFloat(e.target.value) || 0.35)}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-xs font-mono text-slate-500">Volts</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Simulated Anode Voltage:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0.20"
                    max="0.60"
                    step="0.01"
                    value={bioAnodeV}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setBioAnodeV(v);
                    }}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <span className={`text-xs font-mono font-bold ${bioAnodeV < mpptFloorV ? 'text-red-400' : 'text-emerald-400'}`}>
                    {bioAnodeV.toFixed(3)}V
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Preview & Incident Log Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Rendered Email Preview (7 cols) */}
            <div className="lg:col-span-7 bg-[#070A10] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-4 py-3 bg-[#0D121D] border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    Dispatched Email Notification Preview
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded bg-slate-900 border border-slate-800 p-0.5 text-[11px] font-mono">
                    <button
                      onClick={() => setEmailPreviewMode('html')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        emailPreviewMode === 'html' ? 'bg-amber-400 text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      HTML View
                    </button>
                    <button
                      onClick={() => setEmailPreviewMode('text')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        emailPreviewMode === 'text' ? 'bg-amber-400 text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Plain Text
                    </button>
                  </div>

                  <button
                    onClick={() => handleCopy(emailGenerated.textBody, 'email-text')}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    title="Copy Email Text"
                  >
                    {copiedCode === 'email-text' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Email Content Container */}
              <div className="p-5 max-h-[560px] overflow-y-auto">
                {emailPreviewMode === 'html' ? (
                  <div className="bg-[#111827] border border-red-600/80 rounded-lg overflow-hidden shadow-2xl text-slate-200 font-sans">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 p-4 border-b-2 border-red-500">
                      <span className="inline-block bg-red-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        CRITICAL PRIORITY ALERT
                      </span>
                      <h4 className="text-base font-bold text-white mt-2">
                        Sub-Surface Biofilm Failure Alarm
                      </h4>
                      <p className="text-xs text-red-200 font-mono mt-0.5">
                        Node: {activeEmailPayload.vaultId} &bull; Block: {activeEmailPayload.cellBlock} &bull; Code: {activeEmailPayload.faultCode}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-4 text-xs">
                      {/* Alert banner */}
                      <div className="bg-red-950/60 border-l-4 border-red-500 p-3 rounded">
                        <strong className="text-red-200 block text-xs">ANOMALY FLAG: CRITICAL_BIO_DROP</strong>
                        <p className="text-red-300/90 text-[11px] mt-1">
                          Subterranean Geobacter sulfurreducens bio-anode has breached minimal metabolic open-circuit voltage threshold (&lt; 0.350V). Electrochemical isolation required immediately to prevent solid-state battery inversion.
                        </p>
                      </div>

                      {/* Telemetry Grid */}
                      <div className="grid grid-cols-2 gap-2 font-mono">
                        <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">Bio-Anode OCV</div>
                          <div className="text-sm font-bold text-red-400 mt-1">
                            {activeEmailPayload.bioAnodeVoltageV.toFixed(3)} V
                          </div>
                        </div>

                        <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">Bio Harvest Current</div>
                          <div className="text-sm font-bold text-red-400 mt-1">
                            {activeEmailPayload.bioAnodeCurrentA.toFixed(3)} A
                          </div>
                        </div>

                        <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">Internal Impedance (Rct)</div>
                          <div className="text-sm font-bold text-amber-400 mt-1">
                            {activeEmailPayload.internalResistanceMOhm.toFixed(1)} mΩ
                          </div>
                        </div>

                        <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase">Bedrock Temp (15m)</div>
                          <div className="text-sm font-bold text-emerald-400 mt-1">
                            {activeEmailPayload.caissonTempC.toFixed(1)} °C
                          </div>
                        </div>
                      </div>

                      {/* Root cause */}
                      <div>
                        <h5 className="font-mono text-[11px] uppercase font-bold text-red-300">
                          Root Cause Diagnostic:
                        </h5>
                        <p className="text-slate-300 text-[11px] mt-1 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800">
                          {activeEmailPayload.rootCause}
                        </p>
                      </div>

                      {/* Required actions */}
                      <div>
                        <h5 className="font-mono text-[11px] uppercase font-bold text-red-300">
                          Required Operator Actions:
                        </h5>
                        <ol className="list-decimal list-inside space-y-1 text-slate-200 text-[11px] mt-1">
                          {activeEmailPayload.recommendedActions.map((action, i) => (
                            <li key={i} className="leading-snug">
                              <strong>{action}</strong>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="text-center pt-2">
                        <button
                          onClick={() => {
                            executeCommand('isolate');
                            setActiveStudioTab('cli');
                          }}
                          className="px-4 py-2 rounded-lg text-xs font-mono font-bold text-slate-900 bg-red-400 hover:bg-red-300 transition-colors shadow-md"
                        >
                          Execute FORCE_ISOLATE in Terminal
                        </button>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-3 bg-[#0D121D] border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
                      <span>Recipient: {activeEmailPayload.operatorEmail}</span>
                      <span>BioVolt Watchdog v2.4</span>
                    </div>
                  </div>
                ) : (
                  <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-[#0D121D] p-4 rounded-lg border border-slate-800">
                    {emailGenerated.textBody}
                  </pre>
                )}
              </div>
            </div>

            {/* Right: Dispatch Audit Log & SMTP Config (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Audit Log */}
              <div className="p-4 rounded-xl bg-[#0D121D] border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dispatched Alert Audit Log</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">
                    {emailAlertsLog.length} Records
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {emailAlertsLog.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono space-y-1 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-red-400 font-bold text-[11px]">{log.incidentPayload.faultCode} ({log.incidentPayload.statusFlag})</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                          {log.deliveryLatencyMs}ms DELIVERED
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 truncate">
                        To: {log.recipient}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Incident: {log.incidentPayload.incidentId} &bull; {log.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SMTP / Webhook Relay Info */}
              <div className="p-4 rounded-xl bg-[#0D121D] border border-slate-800 text-xs font-mono space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Production Relay Architecture</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  In production caisson nodes, the watchdog daemon runs as an isolated systemd service communicating with the ESP32 RS-485 bus. Upon detecting <code className="text-red-300">CRITICAL_BIO_DROP</code>, it initiates:
                </p>
                <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
                  <li>Direct SSL/TLS SMTP dispatch (port 465)</li>
                  <li>Local hardware alarm pin 13 assertion</li>
                  <li>Emergency FORCE_ISOLATE command to PMIC</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ALERT THRESHOLDS CONFIGURATION */}
      {activeStudioTab === 'thresholds' && (
        <div className="space-y-6">
          {/* Header & Status Beacon */}
          <div className="p-5 rounded-xl bg-[#0D121D] border border-slate-800 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Alert Thresholds & Visual Status Configuration
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Define custom open-circuit voltage (OCV) limits, geothermal temperature boundaries, and dispatch rules that trigger visual status updates.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {saveConfirmation && (
                  <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800 animate-fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>Thresholds Saved</span>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSaveConfirmation(true);
                    setTimeout(() => setSaveConfirmation(false), 2500);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply &amp; Save</span>
                </button>
                <button
                  onClick={() => {
                    const jsonStr = JSON.stringify(thresholds, null, 2);
                    handleDownload('threshold_config.json', jsonStr, 'application/json');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => {
                    const jsonStr = JSON.stringify(thresholds, null, 2);
                    handleCopy(jsonStr, 'thresholds-json');
                  }}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors border border-slate-800"
                  title="Copy Thresholds JSON"
                >
                  {copiedCode === 'thresholds-json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Profile Presets Bar */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>Engineering Preset Profiles:</span>
              </span>
              <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                <button
                  onClick={() => {
                    setSelectedProfile('basalt_default');
                    setThresholds(DEFAULT_THRESHOLDS);
                  }}
                  className={`px-3 py-1 rounded transition-colors ${
                    selectedProfile === 'basalt_default'
                      ? 'bg-amber-400 text-slate-900 font-bold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  Subterranean Basalt Field (Nominal)
                </button>
                <button
                  onClick={() => {
                    setSelectedProfile('lab_sensor');
                    setThresholds({
                      ocvCriticalV: 0.400,
                      ocvWarningV: 0.480,
                      tempCriticalHighC: 22.0,
                      tempCriticalLowC: 12.0,
                      tempOptimalBaselineC: 16.5,
                      internalResMaxMOhm: 300.0,
                      minHarvestCurrentA: 0.300,
                      autoEmailDispatch: true,
                      soundAlarmEnabled: true,
                      visualStrobeEnabled: true,
                    });
                  }}
                  className={`px-3 py-1 rounded transition-colors ${
                    selectedProfile === 'lab_sensor'
                      ? 'bg-amber-400 text-slate-900 font-bold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  Strict Laboratory Bio-Sensor (High Sensitivity)
                </button>
                <button
                  onClick={() => {
                    setSelectedProfile('industrial_cogen');
                    setThresholds({
                      ocvCriticalV: 0.300,
                      ocvWarningV: 0.370,
                      tempCriticalHighC: 35.0,
                      tempCriticalLowC: 5.0,
                      tempOptimalBaselineC: 15.0,
                      internalResMaxMOhm: 750.0,
                      minHarvestCurrentA: 0.080,
                      autoEmailDispatch: true,
                      soundAlarmEnabled: false,
                      visualStrobeEnabled: true,
                    });
                  }}
                  className={`px-3 py-1 rounded transition-colors ${
                    selectedProfile === 'industrial_cogen'
                      ? 'bg-amber-400 text-slate-900 font-bold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  Industrial Co-Gen Bursts (High Tolerance)
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Visual Status Engine & Live Beacon */}
          <div className={`p-5 rounded-xl border-2 shadow-2xl transition-all ${
            healthEvaluation.severity === 'CRITICAL'
              ? 'bg-gradient-to-r from-red-950/80 via-[#180A0A] to-[#0D121D] border-red-600/80'
              : healthEvaluation.severity === 'WARNING'
              ? 'bg-gradient-to-r from-amber-950/70 via-[#19130A] to-[#0D121D] border-amber-600/70'
              : 'bg-gradient-to-r from-emerald-950/60 via-[#0A1812] to-[#0D121D] border-emerald-600/60'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${
                  healthEvaluation.severity === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                    : healthEvaluation.severity === 'WARNING'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Live Threshold Evaluation:
                    </span>
                    <span className={`text-xs font-mono px-2.5 py-0.5 rounded font-bold uppercase ${healthEvaluation.badgeClass}`}>
                      {healthEvaluation.label}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Severity: <strong className="text-slate-200">{healthEvaluation.severity}</strong>
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">
                    {healthEvaluation.description}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 font-mono">
                    <span className="text-slate-400">Triggered Field Action: </span>
                    <span className="text-amber-300 font-semibold">{healthEvaluation.fieldAction}</span>
                  </p>
                </div>
              </div>

              {/* Beacon Pulse Visualizer */}
              <div className="flex items-center gap-3 bg-black/40 p-3 rounded-lg border border-slate-800 shrink-0">
                <div className="relative flex items-center justify-center w-10 h-10">
                  <span className={`w-8 h-8 rounded-full ${
                    healthEvaluation.severity === 'CRITICAL'
                      ? 'bg-red-500/40 animate-ping'
                      : healthEvaluation.severity === 'WARNING'
                      ? 'bg-amber-500/40 animate-ping'
                      : 'bg-emerald-500/30'
                  }`} />
                  <span className={`w-4 h-4 rounded-full ${
                    healthEvaluation.severity === 'CRITICAL'
                      ? 'bg-red-500'
                      : healthEvaluation.severity === 'WARNING'
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`} />
                </div>
                <div className="text-[11px] font-mono">
                  <div className="text-slate-400 uppercase text-[10px]">Visual Strobe</div>
                  <div className={`font-bold ${
                    healthEvaluation.severity === 'CRITICAL' ? 'text-red-400 animate-pulse' : 'text-slate-200'
                  }`}>
                    {thresholds.visualStrobeEnabled ? (healthEvaluation.severity === 'CRITICAL' ? 'STROBING (5Hz)' : 'ARMED') : 'MUTED'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dual Visual Zone Gauges (Live Real-Time Indicators) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Bio-Anode OCV Gauge */}
            <div className="p-5 rounded-xl bg-[#0D121D] border border-slate-800 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    Bio-Anode OCV Range Gauge (0.00V &ndash; 0.70V)
                  </h4>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  bioAnodeV < thresholds.ocvCriticalV
                    ? 'bg-red-500 text-white'
                    : bioAnodeV < thresholds.ocvWarningV
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  Current: {bioAnodeV.toFixed(3)} V
                </span>
              </div>

              {/* Progress Zone Track */}
              <div className="relative pt-6 pb-2">
                <div className="h-4 rounded-full overflow-hidden flex bg-slate-900 border border-slate-700">
                  {/* Critical Red Zone */}
                  <div
                    style={{ width: `${(thresholds.ocvCriticalV / 0.70) * 100}%` }}
                    className="bg-red-600/80 relative group"
                    title={`Critical Zone: < ${thresholds.ocvCriticalV}V`}
                  />
                  {/* Warning Amber Zone */}
                  <div
                    style={{ width: `${((thresholds.ocvWarningV - thresholds.ocvCriticalV) / 0.70) * 100}%` }}
                    className="bg-amber-500/80 relative group"
                    title={`Warning Zone: ${thresholds.ocvCriticalV}V - ${thresholds.ocvWarningV}V`}
                  />
                  {/* Nominal Green Zone */}
                  <div
                    style={{ width: `${((0.70 - thresholds.ocvWarningV) / 0.70) * 100}%` }}
                    className="bg-emerald-500/80 relative group"
                    title={`Nominal Zone: > ${thresholds.ocvWarningV}V`}
                  />
                </div>

                {/* Live Needle Marker */}
                <div
                  className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                  style={{ left: `${Math.min(100, Math.max(0, (bioAnodeV / 0.70) * 100))}%` }}
                >
                  <span className="text-[10px] font-mono font-bold text-white bg-slate-900 border border-amber-400 px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap">
                    {bioAnodeV.toFixed(3)}V
                  </span>
                  <div className="w-0.5 h-6 bg-white shadow-glow" />
                </div>
              </div>

              {/* Threshold Labels */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span className="text-red-400">Critical: &lt; {thresholds.ocvCriticalV.toFixed(2)}V</span>
                <span className="text-amber-400">Warning: &lt; {thresholds.ocvWarningV.toFixed(2)}V</span>
                <span className="text-emerald-400">Nominal: &gt; {thresholds.ocvWarningV.toFixed(2)}V</span>
              </div>
            </div>

            {/* 2. Caisson Bedrock Temperature Gauge */}
            <div className="p-5 rounded-xl bg-[#0D121D] border border-slate-800 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    Caisson Bedrock Temperature (0°C &ndash; 40°C)
                  </h4>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  caissonTempC > thresholds.tempCriticalHighC
                    ? 'bg-orange-500 text-white'
                    : caissonTempC < thresholds.tempCriticalLowC
                    ? 'bg-blue-500 text-white'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  Current: {caissonTempC.toFixed(1)} °C
                </span>
              </div>

              {/* Progress Zone Track */}
              <div className="relative pt-6 pb-2">
                <div className="h-4 rounded-full overflow-hidden flex bg-slate-900 border border-slate-700">
                  {/* Low Thermal Stall Blue Zone */}
                  <div
                    style={{ width: `${(thresholds.tempCriticalLowC / 40.0) * 100}%` }}
                    className="bg-blue-600/80 relative"
                    title={`Freezing Stall: < ${thresholds.tempCriticalLowC}°C`}
                  />
                  {/* Nominal Geothermal Green Zone */}
                  <div
                    style={{ width: `${((thresholds.tempCriticalHighC - thresholds.tempCriticalLowC) / 40.0) * 100}%` }}
                    className="bg-emerald-500/80 relative"
                    title={`Basalt Buffer: ${thresholds.tempCriticalLowC}°C - ${thresholds.tempCriticalHighC}°C`}
                  />
                  {/* High Heat Saturation Orange/Red Zone */}
                  <div
                    style={{ width: `${((40.0 - thresholds.tempCriticalHighC) / 40.0) * 100}%` }}
                    className="bg-orange-600/80 relative"
                    title={`Vapor Lock Stall: > ${thresholds.tempCriticalHighC}°C`}
                  />
                </div>

                {/* Optimal 15°C Reference Line */}
                <div
                  className="absolute top-2 transform -translate-x-1/2 flex flex-col items-center pointer-events-none"
                  style={{ left: `${(thresholds.tempOptimalBaselineC / 40.0) * 100}%` }}
                >
                  <div className="w-0.5 h-6 bg-cyan-400/80 border-dashed" />
                  <span className="text-[9px] font-mono text-cyan-300">15°C opt</span>
                </div>

                {/* Live Needle Marker */}
                <div
                  className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                  style={{ left: `${Math.min(100, Math.max(0, (caissonTempC / 40.0) * 100))}%` }}
                >
                  <span className="text-[10px] font-mono font-bold text-white bg-slate-900 border border-orange-400 px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap">
                    {caissonTempC.toFixed(1)}°C
                  </span>
                  <div className="w-0.5 h-6 bg-white shadow-glow" />
                </div>
              </div>

              {/* Threshold Labels */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span className="text-blue-400">Freeze Stall: &lt; {thresholds.tempCriticalLowC}°C</span>
                <span className="text-emerald-400">15°C Basalt Buffer</span>
                <span className="text-orange-400">Vapor Lock: &gt; {thresholds.tempCriticalHighC}°C</span>
              </div>
            </div>
          </div>

          {/* Interactive Limit Controls & Live Simulator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Custom Threshold Parameter Controls (7 cols) */}
            <div className="lg:col-span-7 bg-[#0D121D] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Custom Threshold Limits Definition</span>
              </h4>

              <div className="space-y-4 text-xs font-mono">
                {/* 1. OCV Critical Floor */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-semibold">
                      Bio-Anode OCV Critical Floor ($V_{'{'}crit{'}'}$)
                    </label>
                    <span className="text-red-400 font-bold">{thresholds.ocvCriticalV.toFixed(3)} V</span>
                  </div>
                  <input
                    type="range"
                    min="0.200"
                    max="0.500"
                    step="0.005"
                    value={thresholds.ocvCriticalV}
                    onChange={(e) => setThresholds(prev => ({ ...prev, ocvCriticalV: parseFloat(e.target.value) }))}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0.200 V (Permissive)</span>
                    <span className="text-slate-400">Triggers CRITICAL_BIO_DROP</span>
                    <span>0.500 V (Hypersensitive)</span>
                  </div>
                </div>

                {/* 2. OCV Warning Threshold */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-semibold">
                      Bio-Anode OCV Warning Threshold ($V_{'{'}warn{'}'}$)
                    </label>
                    <span className="text-amber-400 font-bold">{thresholds.ocvWarningV.toFixed(3)} V</span>
                  </div>
                  <input
                    type="range"
                    min="0.300"
                    max="0.600"
                    step="0.005"
                    value={thresholds.ocvWarningV}
                    onChange={(e) => setThresholds(prev => ({ ...prev, ocvWarningV: parseFloat(e.target.value) }))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0.300 V</span>
                    <span className="text-slate-400">Triggers WARNING_METABOLIC_SLOWDOWN</span>
                    <span>0.600 V</span>
                  </div>
                </div>

                {/* 3. Temperature Limits (High & Low) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 font-semibold">
                        Max Bedrock Temp ($T_{'{'}max{'}'}$)
                      </label>
                      <span className="text-orange-400 font-bold">{thresholds.tempCriticalHighC.toFixed(1)} °C</span>
                    </div>
                    <input
                      type="range"
                      min="20.0"
                      max="45.0"
                      step="0.5"
                      value={thresholds.tempCriticalHighC}
                      onChange={(e) => setThresholds(prev => ({ ...prev, tempCriticalHighC: parseFloat(e.target.value) }))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block">SOFC Thermal Dissipation Ceiling</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 font-semibold">
                        Min Bedrock Temp ($T_{'{'}min{'}'}$)
                      </label>
                      <span className="text-blue-400 font-bold">{thresholds.tempCriticalLowC.toFixed(1)} °C</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="15.0"
                      step="0.5"
                      value={thresholds.tempCriticalLowC}
                      onChange={(e) => setThresholds(prev => ({ ...prev, tempCriticalLowC: parseFloat(e.target.value) }))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block">Arrhenius Kinetic Stall Window</span>
                  </div>
                </div>

                {/* 4. Automated Notification Options */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                  <span className="text-slate-300 font-semibold block text-xs">
                    Automated Alert Dispatch Enforcements:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-slate-800/60 border border-slate-700/60">
                      <input
                        type="checkbox"
                        checked={thresholds.autoEmailDispatch}
                        onChange={(e) => setThresholds(prev => ({ ...prev, autoEmailDispatch: e.target.checked }))}
                        className="rounded accent-amber-400"
                      />
                      <span className="text-[11px] text-slate-300">Auto-Email Dispatch</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-slate-800/60 border border-slate-700/60">
                      <input
                        type="checkbox"
                        checked={thresholds.visualStrobeEnabled}
                        onChange={(e) => setThresholds(prev => ({ ...prev, visualStrobeEnabled: e.target.checked }))}
                        className="rounded accent-amber-400"
                      />
                      <span className="text-[11px] text-slate-300">Visual Strobe Alarm</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-slate-800/60 border border-slate-700/60">
                      <input
                        type="checkbox"
                        checked={thresholds.soundAlarmEnabled}
                        onChange={(e) => setThresholds(prev => ({ ...prev, soundAlarmEnabled: e.target.checked }))}
                        className="rounded accent-amber-400"
                      />
                      <span className="text-[11px] text-slate-300">Acoustic SCADA Pulse</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Live Telemetry Interactive Test Simulator (5 cols) */}
            <div className="lg:col-span-5 bg-[#0D121D] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Live Simulator: Drag Telemetry</span>
                </h4>
                <button
                  onClick={() => {
                    setBioAnodeV(0.540);
                    setCaissonTempC(15.2);
                    setBioAnodeI(0.852);
                  }}
                  className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 underline"
                >
                  Reset Telemetry
                </button>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Adjust simulated subsurface readings in real time to observe how your configured thresholds trigger status transitions across the entire console:
              </p>

              <div className="space-y-3 font-mono text-xs">
                {/* Drag OCV Slider */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Simulate Bio-Anode OCV:</span>
                    <span className={`font-bold ${
                      bioAnodeV < thresholds.ocvCriticalV
                        ? 'text-red-400'
                        : bioAnodeV < thresholds.ocvWarningV
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}>
                      {bioAnodeV.toFixed(3)} V
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.150"
                    max="0.650"
                    step="0.005"
                    value={bioAnodeV}
                    onChange={(e) => setBioAnodeV(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Drag Temperature Slider */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Simulate Caisson Bedrock Temp:</span>
                    <span className={`font-bold ${
                      caissonTempC > thresholds.tempCriticalHighC
                        ? 'text-orange-400'
                        : caissonTempC < thresholds.tempCriticalLowC
                        ? 'text-blue-400'
                        : 'text-emerald-400'
                    }`}>
                      {caissonTempC.toFixed(1)} °C
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="40.0"
                    step="0.5"
                    value={caissonTempC}
                    onChange={(e) => setCaissonTempC(parseFloat(e.target.value))}
                    className="w-full accent-orange-400 cursor-pointer"
                  />
                </div>

                {/* Drag Current Slider */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Simulate Harvest DET Current:</span>
                    <span className="font-bold text-slate-200">{bioAnodeI.toFixed(3)} A</span>
                  </div>
                  <input
                    type="range"
                    min="0.050"
                    max="1.200"
                    step="0.010"
                    value={bioAnodeI}
                    onChange={(e) => setBioAnodeI(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Scenario Trigger Buttons */}
                <div className="pt-2 space-y-2">
                  <span className="text-[10px] text-slate-500 uppercase block">One-Click Fault Inductions:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setBioAnodeV(0.280);
                        setBioAnodeI(0.090);
                      }}
                      className="px-2.5 py-1.5 rounded bg-red-950/60 hover:bg-red-900 border border-red-800 text-[11px] font-mono text-red-200 transition-colors"
                    >
                      OCV Crash (0.280V)
                    </button>
                    <button
                      onClick={() => {
                        setCaissonTempC(32.5);
                      }}
                      className="px-2.5 py-1.5 rounded bg-orange-950/60 hover:bg-orange-900 border border-orange-800 text-[11px] font-mono text-orange-200 transition-colors"
                    >
                      Overheat (32.5°C)
                    </button>
                    <button
                      onClick={() => {
                        setCaissonTempC(5.0);
                      }}
                      className="px-2.5 py-1.5 rounded bg-blue-950/60 hover:bg-blue-900 border border-blue-800 text-[11px] font-mono text-blue-200 transition-colors"
                    >
                      Sub-Cooling (5.0°C)
                    </button>
                    <button
                      onClick={() => {
                        setBioAnodeV(0.540);
                        setCaissonTempC(15.2);
                        setBioAnodeI(0.852);
                      }}
                      className="px-2.5 py-1.5 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-[11px] font-mono text-emerald-200 transition-colors"
                    >
                      Restore Nominal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PEM BLOCK TROUBLESHOOTING INDEX */}
      {activeStudioTab === 'pem_index' && (
        <div className="space-y-6">
          {/* Header & Search */}
          <div className="p-5 rounded-xl bg-[#0D121D] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>PEM Block Troubleshooting Index (System Block UE-EMG-PEM-04)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Subterranean Proton Exchange Membrane Matrix Anomalies & Mitigation Protocols
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter fault code or symptom..."
                  value={pemSearchQuery}
                  onChange={(e) => setPemSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 w-56"
                />
              </div>

              <button
                onClick={() => handleDownload('pem_troubleshooting.md', PEM_TROUBLESHOOTING_MD, 'text/markdown')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .md</span>
              </button>
            </div>
          </div>

          {/* Fault Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPemFaults.map((fault) => {
              const isSelected = selectedFaultCode === fault.code;
              let severityBadge = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
              if (fault.severity === 'CRITICAL') {
                severityBadge = 'bg-red-500/20 text-red-400 border border-red-500/30';
              } else if (fault.severity === 'MEDIUM') {
                severityBadge = 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
              }

              return (
                <div
                  key={fault.code}
                  className={`p-5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#0E1524] border-cyan-500/80 shadow-xl'
                      : 'bg-[#0A0E17] border-slate-800 hover:border-slate-700'
                  }`}
                  onClick={() => setSelectedFaultCode(fault.code)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold font-mono text-white">
                      {fault.code}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${severityBadge}`}>
                        {fault.severity}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {fault.scadaPriority}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-200 mb-2">
                    {fault.title}
                  </h4>

                  <div className="text-xs font-mono text-slate-400 mb-3 bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                    <strong className="text-slate-300 block mb-1">Status Flag: <code>{fault.statusFlag}</code></strong>
                    <span className="text-slate-400 text-[11px]">{fault.rootCause}</span>
                  </div>

                  {/* Telemetry Indicators */}
                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-mono uppercase font-bold text-slate-400">
                      Telemetry Indicators:
                    </span>
                    <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5 font-mono">
                      {fault.telemetryIndicators.slice(0, 2).map((ind, i) => (
                        <li key={i} className="truncate">{ind}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Immediate Mitigation Action */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold truncate max-w-[260px]">
                      {fault.immediateFieldMitigation[0]}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (fault.code === 'PEM-E02') {
                          executeCommand('drop');
                          setActiveStudioTab('cli');
                        } else {
                          executeCommand(`pem ${fault.code}`);
                          setActiveStudioTab('cli');
                        }
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors shrink-0"
                    >
                      Test in CLI &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Markdown Preview Collapsible / Viewer */}
          <div className="p-5 rounded-xl bg-[#0D121D] border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Full Technical Reference: pem_troubleshooting.md
              </h4>
              <button
                onClick={() => handleCopy(PEM_TROUBLESHOOTING_MD, 'pem-full-md')}
                className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800"
              >
                {copiedCode === 'pem-full-md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Markdown</span>
              </button>
            </div>

            <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-[#070A10] p-4 rounded-lg border border-slate-800 max-h-72 overflow-y-auto">
              {PEM_TROUBLESHOOTING_MD}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: DISPATCH SCRIPTS & CODE EXPORTS */}
      {activeStudioTab === 'code_exports' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-[#0D121D] border border-slate-800 shadow-xl">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Sub-Surface Warning Email Notification Code Blocks</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Production scripts for dispatching emergency alert emails upon detecting CRITICAL_BIO_DROP via Python smtplib and Node.js.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Python SMTPLib Alert Script */}
            <div className="bg-[#070A10] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 bg-[#0D121D] border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-amber-400">
                  Python: alert_notifier.py (smtplib over SSL)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(generatePythonEmailDispatcherScript(operatorEmail), 'py-alert')}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                  >
                    {copiedCode === 'py-alert' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDownload('alert_notifier.py', generatePythonEmailDispatcherScript(operatorEmail), 'text/x-python')}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <pre className="p-4 font-mono text-xs text-slate-300 overflow-y-auto max-h-[480px] bg-[#06080E] whitespace-pre leading-relaxed">
                {generatePythonEmailDispatcherScript(operatorEmail)}
              </pre>
            </div>

            {/* Node.js Nodemailer Script */}
            <div className="bg-[#070A10] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 bg-[#0D121D] border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  Node.js / TypeScript: sendCriticalBioDropEmail.ts
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(generateNodeMailerScript(operatorEmail), 'node-alert')}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                  >
                    {copiedCode === 'node-alert' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDownload('sendCriticalBioDropEmail.ts', generateNodeMailerScript(operatorEmail), 'text/typescript')}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <pre className="p-4 font-mono text-xs text-slate-300 overflow-y-auto max-h-[480px] bg-[#06080E] whitespace-pre leading-relaxed">
                {generateNodeMailerScript(operatorEmail)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
