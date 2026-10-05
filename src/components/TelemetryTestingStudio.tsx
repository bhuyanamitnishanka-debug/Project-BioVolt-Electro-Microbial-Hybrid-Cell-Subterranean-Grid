/**
 * Project BioVolt: Telemetry & Continuous Integration Studio
 * ArduinoJson Telemetry Encoder, Command Decoder, Test Runner & GitHub Actions
 */

import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Activity,
  Download,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Send,
  ShieldAlert,
  GitBranch,
  Cpu
} from 'lucide-react';

const BIO_HARVEST_PMIC_INO = `/**
 * @file bio_harvest_pmic.ino
 * @brief Ultra-Low Power Energy Harvesting & Dynamic MPPT Controller for BioVolt Anodes.
 * Handles micro-current accumulation from Geobacter biofilms into Lead-Carbon storage.
 */
#include <Arduino.h>

// Pin Configurations
#define BIO_ANODE_VOLTAGE_PIN A0  // Analog reading from the exoelectrogenic biofilm
#define BURST_MODE_GATE_PIN   12  // PWM/Gate control output to step-up converter
#define CRITICAL_ALARM_PIN    13  // Status alert LED for system degradation

// Engineering Limits
const float GLUCOSE_EXHAUSTION_LIMIT = 0.35; // Volts: Lower boundary indicates dying biofilm
const float MAXIMUM_GASSING_VOLTAGE  = 2.40; // Volts: Upper charging ceiling for Pb-C array
const int   SAMPLE_WINDOW            = 100;  // Iterations for filtering analog noise

// System State
enum SystemState { HARVESTING, TRICKLE_CHARGE, BIO_CRITICAL, STANDBY };
SystemState currentState = STANDBY;

/**
 * @brief Reads filtered millivolts from the organic bioreactor matrix.
 */
float readBioAnodeVoltage() {
    long rawSum = 0;
    for(int i = 0; i < SAMPLE_WINDOW; i++) {
        rawSum += analogRead(BIO_ANODE_VOLTAGE_PIN);
        delayMicroseconds(50);
    }
    float averageRaw = (float)rawSum / SAMPLE_WINDOW;
    // Converts 12-bit ADC reading (0-4095) to absolute voltage scale (3.3V ref)
    return (averageRaw / 4095.0) * 3.3;
}

void setup() {
    Serial.begin(115200);
    pinMode(BURST_MODE_GATE_PIN, OUTPUT);
    pinMode(CRITICAL_ALARM_PIN, OUTPUT);
    
    digitalWrite(BURST_MODE_GATE_PIN, LOW);
    digitalWrite(CRITICAL_ALARM_PIN, LOW);
    
    Serial.println("[SYSTEM INITIALIZATION]: Under-Earth BioVolt PMIC Online.");
}

void loop() {
    float bioVoltage = readBioAnodeVoltage();
    
    Serial.print("[DATA LOG] Biological Anode Potential: ");
    Serial.print(bioVoltage, 3);
    Serial.println(" V");

    // Dynamic State Machine Logic for Metabolic Energy Harvesting
    if (bioVoltage < GLUCOSE_EXHAUSTION_LIMIT) {
        currentState = BIO_CRITICAL;
    } else if (bioVoltage >= MAXIMUM_GASSING_VOLTAGE) {
        currentState = TRICKLE_CHARGE;
    } else {
        currentState = HARVESTING;
    }

    switch(currentState) {
        case HARVESTING:
            digitalWrite(CRITICAL_ALARM_PIN, LOW);
            // Engage low-frequency burst mode modulation (MPPT tracking at 80% Open Circuit Voltage)
            analogWrite(BURST_MODE_GATE_PIN, 204); // ~80% Duty cycle on 8-bit PWM scale
            Serial.println("[STATE]: HARVESTING active. Bio-trickle routing to Lead-Carbon matrix.");
            break;
            
        case TRICKLE_CHARGE:
            digitalWrite(CRITICAL_ALARM_PIN, LOW);
            analogWrite(BURST_MODE_GATE_PIN, 25);  // Minimal duty cycle maintenance charge
            Serial.println("[STATE]: TARGET BUFFER FULL. Throttling harvesting loop to trickle threshold.");
            break;
            
        case BIO_CRITICAL:
            digitalWrite(BURST_MODE_GATE_PIN, LOW); // Isolate the battery to protect cell health
            digitalWrite(CRITICAL_ALARM_PIN, HIGH);
            Serial.println("[ALERT!!]: BIO-CRITICAL THRESHOLD REACHED. Substrate nutrition depleted or pH imbalanced.");
            break;
            
        case STANDBY:
        default:
            digitalWrite(BURST_MODE_GATE_PIN, LOW);
            break;
    }
    
    // Subterranean optimization loop cadence: Check metabolic levels every 5 seconds
    delay(5000); 
}
`;

const TELEMETRY_ENCODER_INO = `/**
 * @file telemetry_encoder.ino
 * @brief Serializes under-earth reactor telemetry into standardized JSON payloads.
 */
#include <Arduino.h>
#include <ArduinoJson.h> // Requires ArduinoJson v6 or v7

const int SENSOR_PIN_VOLTAGE     = 34; // ESP32 GPIO for Bio-Anode OCV
const int SENSOR_PIN_THERMISTOR   = 35; // ESP32 GPIO for Caisson Bedrock Temp

void setup() {
    Serial.begin(115200);
    pinMode(SENSOR_PIN_VOLTAGE, INPUT);
    pinMode(SENSOR_PIN_THERMISTOR, INPUT);
    Serial.println("[NODE BOOTUP]: JSON Telemetry Wrapper Online.");
}

void loop() {
    // Read raw sensor data streams
    float rawVoltage = (analogRead(SENSOR_PIN_VOLTAGE) / 4095.0) * 3.3;
    float rawTempReading = analogRead(SENSOR_PIN_THERMISTOR);
    float coreTemperature = 15.0 + (rawTempReading * 0.01);

    // Instantiate static memory pool allocation for the JSON document
    StaticJsonDocument<256> doc;
    
    // Structure telemetry architecture parameters
    doc["device_id"] = "UE-EMG-VAULT-01";
    doc["timestamp_ms"] = millis();
    
    JsonObject metrics = doc.createNestedObject("metrics");
    metrics["anode_ocv_v"] = serialized(String(rawVoltage, 3));
    metrics["caisson_temp_c"] = serialized(String(coreTemperature, 1));
    metrics["storage_soc_pct"] = 74.2;
    
    doc["status_flag"] = (rawVoltage < 0.35) ? "CRITICAL_BIO_DROP" : "NOMINAL";

    // Serialize payload directly into standard outgoing string
    String outputBuffer;
    serializeJson(doc, outputBuffer);
    
    // Dispatch telemetry payload across the communication bus
    Serial.println(outputBuffer);
    
    delay(10000); // 10-second heartbeat window
}
`;

const COMMAND_DECODER_INO = `/**
 * @file command_decoder.ino
 * @brief Parses incoming server JSON commands to dynamically adjust PMIC harvesting parameters.
 */
#include <Arduino.h>
#include <ArduinoJson.h>

extern int BURST_MODE_GATE_PIN;
extern float GLUCOSE_EXHAUSTION_LIMIT;
extern enum SystemState { HARVESTING, TRICKLE_CHARGE, BIO_CRITICAL, STANDBY } currentState;

void handleIncomingServerCommands(String jsonInput) {
    StaticJsonDocument<384> doc;
    DeserializationError error = deserializeJson(doc, jsonInput);
    
    if (error) {
        Serial.print(F("[COMMAND ERROR]: JSON Deserialization failed: "));
        Serial.println(error.f_str());
        return;
    }

    // 1. Verify Target Host Node Authorization
    if (doc.containsKey("target_vault")) {
        const char* target = doc["target_vault"];
        if (strcmp(target, "UE-EMG-VAULT-01") != 0) {
            return; // Drop packet silently
        }
    }

    Serial.println(F("[NETWORK INBOUND]: Command packet validated for this node. Processing..."));

    // 2. Parse and Apply Configuration Overrides
    if (doc.containsKey("set_mppt_floor_v")) {
        float oldLimit = GLUCOSE_EXHAUSTION_LIMIT;
        GLUCOSE_EXHAUSTION_LIMIT = doc["set_mppt_floor_v"];
        Serial.print(F(" -> Config updated: Metabolic floor changed from "));
        Serial.print(oldLimit, 2);
        Serial.print(F("V to "));
        Serial.print(GLUCOSE_EXHAUSTION_LIMIT, 2);
        Serial.println("V");
    }

    // 3. Process Remote Overrides (e.g., Emergency Forced Isolation)
    if (doc.containsKey("emergency_override")) {
        const char* systemCommand = doc["emergency_override"];
        
        if (strcmp(systemCommand, "FORCE_ISOLATE") == 0) {
            digitalWrite(BURST_MODE_GATE_PIN, LOW); // Cut connection to Lead-Carbon matrix
            currentState = STANDBY;
            Serial.println(F(" -> [CRITICAL WARNING]: Remote manual override received. Isolating biological matrix immediately."));
        } 
        else if (strcmp(systemCommand, "RESUME_HARVEST") == 0) {
            currentState = HARVESTING;
            Serial.println(F(" -> [SYSTEM ACTION]: Remote clear received. Resuming exoelectrogen harvesting loop."));
        }
    }
}
`;

const GITHUB_ACTIONS_YML = `name: Project BioVolt Simulation Testing Suite
on:
  push:
    branches: [ "main", "dev" ]
  pull_request:
    branches: [ "main" ]

jobs:
  validate-electrochemical-engine:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code Repository
      uses: actions/checkout@v4

    - name: Set Up Python Runtime Environments
      uses: actions/setup-python@v5
      with:
        python-version: '3.11'
        cache: 'pip'

    - name: Install Hard-Science Core Engineering Matrix
      run: |
        python -m pip install --upgrade pip
        pip install numpy matplotlib

    - name: Execute Arrhenius-Lead-Carbon System Models
      run: |
        python simulator_v2.py

    - name: Verify Telemetry Plot Generations
      run: |
        python plot_simulation.py
        if [ ! -f ue_emg_performance_curves.png ]; then
          echo "Error: High-resolution plot generation failed script evaluation."
          exit 1
        fi
`;

export const TelemetryTestingStudio: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'pmic' | 'encoder' | 'decoder' | 'ci'>('pmic');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  // Live Mock Sensor State
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamLogs, setStreamLogs] = useState<string[]>([]);
  const [stepCount, setStepCount] = useState<number>(0);

  // Simulated Node State
  const [mpptFloor, setMpptFloor] = useState<number>(0.35);
  const [simState, setSimState] = useState<'HARVESTING' | 'STANDBY' | 'BIO_CRITICAL'>('HARVESTING');
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  // Telemetry stream generator
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setStepCount((prev) => {
        const nextStep = prev + 1;
        const diurnal = Math.sin(nextStep / 10.0) * 0.4;
        const temp = 15.0 + diurnal + (Math.random() * 0.2 - 0.1);
        const ocv = 0.752 + Math.cos(nextStep / 5.0) * 0.015 + (Math.random() * 0.006 - 0.003);
        const soc = Math.min(100.0, 45.0 + nextStep * 0.05);

        const frame = {
          device_id: 'UE-EMG-VAULT-01',
          timestamp_ms: Date.now(),
          metrics: {
            anode_ocv_v: Number(ocv.toFixed(3)),
            caisson_temp_c: Number(temp.toFixed(1)),
            storage_soc_pct: Number(soc.toFixed(2)),
          },
          status_flag: ocv < mpptFloor ? 'CRITICAL_BIO_DROP' : 'NOMINAL',
        };

        const logLine = JSON.stringify(frame);
        setStreamLogs((logs) => [logLine, ...logs.slice(0, 19)]);
        return nextStep;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isStreaming, mpptFloor]);

  const handleCopyCode = (content: string, key: string) => {
    navigator.clipboard.writeText(content);
    setCopiedTab(key);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleSendCommand = (cmdObj: object) => {
    const rawJson = JSON.stringify(cmdObj);
    if ((cmdObj as any).set_mppt_floor_v !== undefined) {
      setMpptFloor((cmdObj as any).set_mppt_floor_v);
      setCommandFeedback(
        `[APPLIED]: Metabolic floor threshold updated to ${(cmdObj as any).set_mppt_floor_v}V`
      );
    }
    if ((cmdObj as any).emergency_override === 'FORCE_ISOLATE') {
      setSimState('STANDBY');
      setCommandFeedback(
        `[CRITICAL ALERT]: Force isolate received. BURST_MODE_GATE_PIN pulled LOW.`
      );
    } else if ((cmdObj as any).emergency_override === 'RESUME_HARVEST') {
      setSimState('HARVESTING');
      setCommandFeedback(
        `[SYSTEM RESUMED]: Exoelectrogen harvesting loop active (~80% PWM MPPT duty cycle).`
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="p-6 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Terminal className="w-4 h-4" />
            <span>ARDUINOJSON TELEMETRY, COMMAND DECODING &amp; CI AUTOMATION</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-tech)' }}>
            Subterranean Node Firmware &amp; Test Suite
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Production ArduinoJson v6/v7 encoders, command decoders for ESP32/Nordic microcontrollers,
            and an in-browser mock sensor node streaming live JSON telemetry frames to test server dashboards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-slate-300">
            Node ID: <strong className="text-amber-400">UE-EMG-VAULT-01</strong>
          </span>
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-slate-300">
            State:{' '}
            <strong
              className={
                simState === 'HARVESTING'
                  ? 'text-emerald-400'
                  : simState === 'STANDBY'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }
            >
              {simState}
            </strong>
          </span>
        </div>
      </div>

      {/* Live Mock Sensor Streamer & Interactive Command Dispatcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Live JSON Stream Terminal (lg:col-span-7) */}
        <div className="lg:col-span-7 p-5 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2 text-white">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>LIVE SUB-SURFACE TELEMETRY STREAM (test_runner.py)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsStreaming(!isStreaming)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold font-mono transition-colors ${
                  isStreaming
                    ? 'bg-rose-500 hover:bg-rose-400 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {isStreaming ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Halt Stream</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Live Stream</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setStreamLogs([])}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                title="Clear Logs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Terminal Box */}
          <div className="h-64 bg-[#070A10] border border-slate-800 rounded p-3 font-mono text-xs overflow-y-auto space-y-1.5">
            {streamLogs.length === 0 ? (
              <div className="text-slate-500 flex flex-col items-center justify-center h-full">
                <span>[STREAM BUFFER EMPTY]</span>
                <span className="text-[11px] text-slate-600">
                  Click "Start Live Stream" to begin emitting mock JSON frames from UE-EMG-VAULT-01.
                </span>
              </div>
            ) : (
              streamLogs.map((line, idx) => (
                <div key={idx} className="text-slate-300 hover:text-emerald-300 font-mono text-[11px] break-all">
                  <span className="text-emerald-500 mr-2">➔</span>
                  {line}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Remote Command Injection Simulator (lg:col-span-5) */}
        <div className="lg:col-span-5 p-5 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span>COMMAND DECODER INJECTION (command_decoder.ino)</span>
            <span>ESP32 PARSER</span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono text-slate-300">
              Test sending inbound JSON commands to the subterranean node:
            </span>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() =>
                  handleSendCommand({
                    target_vault: 'UE-EMG-VAULT-01',
                    emergency_override: 'FORCE_ISOLATE',
                  })
                }
                className="flex items-center justify-between px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/80 rounded text-xs font-mono text-rose-300 transition-colors"
              >
                <span>Emergency: FORCE_ISOLATE</span>
                <Send className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() =>
                  handleSendCommand({
                    target_vault: 'UE-EMG-VAULT-01',
                    emergency_override: 'RESUME_HARVEST',
                  })
                }
                className="flex items-center justify-between px-3 py-2 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/80 rounded text-xs font-mono text-emerald-300 transition-colors"
              >
                <span>Command: RESUME_HARVEST</span>
                <Send className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() =>
                  handleSendCommand({
                    target_vault: 'UE-EMG-VAULT-01',
                    set_mppt_floor_v: 0.40,
                  })
                }
                className="flex items-center justify-between px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-xs font-mono text-cyan-300 transition-colors"
              >
                <span>Set MPPT Floor: 0.40 V</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {commandFeedback && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-amber-300 mt-2">
                {commandFeedback}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Repository Inspector */}
      <div className="p-5 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            <button
              onClick={() => setActiveCodeTab('pmic')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeCodeTab === 'pmic'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              bio_harvest_pmic.ino
            </button>
            <button
              onClick={() => setActiveCodeTab('encoder')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeCodeTab === 'encoder'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              telemetry_encoder.ino
            </button>
            <button
              onClick={() => setActiveCodeTab('decoder')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeCodeTab === 'decoder'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              command_decoder.ino
            </button>
            <button
              onClick={() => setActiveCodeTab('ci')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeCodeTab === 'ci'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              verify-models.yml
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const codeMap = {
                  pmic: BIO_HARVEST_PMIC_INO,
                  encoder: TELEMETRY_ENCODER_INO,
                  decoder: COMMAND_DECODER_INO,
                  ci: GITHUB_ACTIONS_YML,
                };
                handleCopyCode(codeMap[activeCodeTab], activeCodeTab);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-300 transition-colors"
            >
              {copiedTab === activeCodeTab ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedTab === activeCodeTab ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-[#070A10] rounded border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed max-h-96 overflow-y-auto">
          <pre className="text-slate-300 selection:bg-amber-400/20">
            {activeCodeTab === 'pmic' && BIO_HARVEST_PMIC_INO}
            {activeCodeTab === 'encoder' && TELEMETRY_ENCODER_INO}
            {activeCodeTab === 'decoder' && COMMAND_DECODER_INO}
            {activeCodeTab === 'ci' && GITHUB_ACTIONS_YML}
          </pre>
        </div>
      </div>
    </div>
  );
};
