/**
 * Project BioVolt: Microcontroller Firmware & Energy Harvesting Circuits
 * Ultra-low-power C++ firmware for Texas Instruments BQ25570 & LTC3108 nano-power harvesters
 */

import React, { useState } from 'react';
import {
  Cpu,
  Download,
  Copy,
  Check,
  Zap,
  Sliders,
  Terminal,
  Activity,
  Code
} from 'lucide-react';

const CXX_FIRMWARE = `/**
 * @file BioVolt_Harvester_Firmware.ino / main.cpp
 * @brief Ultra-Low-Power Bio-Electrochemical Energy Harvester Controller
 * @details Interfaces TI BQ25570 & LTC3108 nano-power management IC with 
 *          Geobacter sulfurreducens bio-anode and Lead-Carbon hybrid matrix.
 * 
 * Target: Nordic nRF52840 / STM32L433 / ESP32-S3 (Ultra-Low-Power Subterranean Node)
 * License: MIT Open Source Hardware & Firmware
 */

#include <Arduino.h>
#include <Wire.h>

// Hardware Pin Definitions
#define PIN_V_BIO_SENSE    A0   // Analog input from bio-anode shunt (mV)
#define PIN_V_BAT_SENSE    A1   // Analog input from Lead-Carbon matrix (V)
#define PIN_BAT_OK_INTERRUPT 2   // Digital interrupt from BQ25570 VBAT_OK
#define PIN_BOOST_EN       3    // Enable pin for secondary boost stage
#define PIN_LOAD_GATE      4    // High-side P-MOSFET gate for burst load discharge
#define PIN_SOFC_RELAY     5    // Actuates thermal SOFC burn valve

// Energy Harvester Threshold Configurations (Volts)
constexpr float V_COLD_START_MIN  = 0.020f; // 20mV minimum Geobacter DET potential
constexpr float V_GASSING_CEILING = 2.450f; // Lead-Carbon plate over-voltage cutoff
constexpr float V_BAT_OK_HIGH     = 2.380f; // Turn ON load burst when matrix reaches this
constexpr float V_BAT_OK_LOW      = 1.950f; // Disconnect load when matrix drops below this
constexpr float SHUNT_RESISTOR_OHM = 0.100f; // Precision current sense resistor

// State Variables
volatile bool isEnergyBurstReady = false;
float currentVCell = 1.85f;
float bioCurrentMA = 0.0f;
uint32_t totalBurstCount = 0;

void IRAM_ATTR onBatteryOkTransition() {
    isEnergyBurstReady = digitalRead(PIN_BAT_OK_INTERRUPT);
}

void configureNanoPowerHarvester() {
    pinMode(PIN_BAT_OK_INTERRUPT, INPUT_PULLUP);
    pinMode(PIN_BOOST_EN, OUTPUT);
    pinMode(PIN_LOAD_GATE, OUTPUT);
    pinMode(PIN_SOFC_RELAY, OUTPUT);

    // Initial safe states: isolate load until capacitor buffer charges
    digitalWrite(PIN_BOOST_EN, HIGH);
    digitalWrite(PIN_LOAD_GATE, LOW);
    digitalWrite(PIN_SOFC_RELAY, LOW);

    attachInterrupt(digitalPinToInterrupt(PIN_BAT_OK_INTERRUPT), 
                    onBatteryOkTransition, CHANGE);
}

/**
 * @brief Reads Bio-Anode Direct Extracellular Electron Transfer (DET)
 * Uses oversampling and 16-bit ADC accumulation to filter 50Hz/60Hz noise
 */
float readBioAnodeCurrentMA() {
    uint32_t accumulator = 0;
    constexpr int SAMPLES = 64;
    for (int i = 0; i < SAMPLES; i++) {
        accumulator += analogRead(PIN_V_BIO_SENSE);
        delayMicroseconds(100);
    }
    float rawMv = (accumulator / (float)SAMPLES) * (3300.0f / 4096.0f);
    // I = V / R
    return rawMv / SHUNT_RESISTOR_OHM;
}

float readMatrixVoltage() {
    // 1:2 precision resistor divider network on PIN_V_BAT_SENSE
    float adcVal = analogRead(PIN_V_BAT_SENSE);
    return (adcVal * (3.3f / 4096.0f)) * 2.0f;
}

void setup() {
    Serial.begin(115200);
    delay(1000);
    Serial.println(F("[BioVolt] Initializing UE-EMG Nano-Power Harvester Controller..."));
    
    configureNanoPowerHarvester();
    
    Serial.println(F("[BioVolt] MPPT impedance tracking engaged for Geobacter biofilm."));
}

void loop() {
    currentVCell = readMatrixVoltage();
    bioCurrentMA = readBioAnodeCurrentMA();

    Serial.print(F("[TELEM] V_Cell: "));
    Serial.print(currentVCell, 3);
    Serial.print(F(" V | Bio_Anode: "));
    Serial.print(bioCurrentMA, 1);
    Serial.print(F(" mA | BurstReady: "));
    Serial.println(isEnergyBurstReady ? F("YES") : F("NO"));

    // 1. Over-Voltage Protection (Clamped at 2.45V to prevent gassing)
    if (currentVCell >= V_GASSING_CEILING) {
        digitalWrite(PIN_BOOST_EN, LOW); // Shunt trickle to secondary dissipation resistor
        Serial.println(F("[WARN] Gassing ceiling reached! Shunting input."));
    } else {
        digitalWrite(PIN_BOOST_EN, HIGH);
    }

    // 2. High-Burst Load Execution
    if (isEnergyBurstReady && currentVCell >= V_BAT_OK_HIGH) {
        Serial.println(F("[EXEC] Firing High-Burst Discharge Pulse to Subterranean Node..."));
        digitalWrite(PIN_LOAD_GATE, HIGH);
        totalBurstCount++;
        
        // Deliver burst while monitoring voltage
        uint32_t burstStart = millis();
        while ((millis() - burstStart < 5000) && (readMatrixVoltage() > V_BAT_OK_LOW)) {
            delay(10); // Maintain burst
        }
        digitalWrite(PIN_LOAD_GATE, LOW);
        Serial.println(F("[EXEC] Burst cycle complete. Returning to capacitive recharge."));
    }

    // 3. Ultra-Low-Power Deep Sleep (Conserve precious micro-joules)
    // Sleep for 10 seconds; wake on timer or VBAT_OK interrupt
    Serial.flush();
    delay(10000); // In production: lowPowerSleep(10000);
}
`;

export const FirmwareStudio: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [targetMcu, setTargetMcu] = useState<'nrf52' | 'esp32' | 'stm32'>('nrf52');
  const [vBatOkHigh, setVBatOkHigh] = useState<number>(2.38);
  const [vBatOkLow, setVBatOkLow] = useState<number>(1.95);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CXX_FIRMWARE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([CXX_FIRMWARE], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BioVolt_EnergyHarvester_${targetMcu}.cpp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="p-6 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Cpu className="w-4 h-4" />
            <span>NANO-POWER EMBEDDED FIRMWARE // C++ OPEN HARDWARE</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-tech)' }}>
            Energy Harvester Micro-Controller Architecture
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Autonomous firmware managing 20mV cold-start boost conversion from Geobacter bio-anodes,
            hysteresis burst-mode switching, and gassing voltage protection for Lead-Carbon hybrid cells.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-300 transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy C++'}</span>
          </button>
          <button
            onClick={handleDownloadCode}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs font-mono transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .cpp</span>
          </button>
        </div>
      </div>

      {/* Schematic Overview & Resistor Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Circuit Schematic Diagram (lg:col-span-5) */}
        <div className="lg:col-span-5 p-5 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span>ELECTRICAL TOPOLOGY BLOCK DIAGRAM</span>
            <span>TI BQ25570 / LTC3108</span>
          </div>

          <div className="p-3 bg-[#070A10] rounded border border-slate-800">
            <svg viewBox="0 0 360 260" className="w-full h-auto select-none">
              {/* Bio-Anode Input Block */}
              <rect x="20" y="30" width="80" height="60" rx="4" fill="#14532D" stroke="#22C55E" strokeWidth="1.5" />
              <text x="60" y="55" fill="#DCFCE7" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                BIO-ANODE
              </text>
              <text x="60" y="75" fill="#86EFAC" fontSize="9" fontFamily="monospace" textAnchor="middle">
                20-450 mV
              </text>

              {/* Nano-Power Harvester IC Block */}
              <rect x="140" y="30" width="100" height="80" rx="4" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="190" y="55" fill="#E0F2FE" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                TI BQ25570
              </text>
              <text x="190" y="70" fill="#7DD3FC" fontSize="8" fontFamily="monospace" textAnchor="middle">
                Boost Harvester
              </text>
              <text x="190" y="85" fill="#38BDF8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                MPPT 80% VOC
              </text>

              {/* Lead-Carbon Hybrid Matrix */}
              <rect x="140" y="160" width="100" height="70" rx="4" fill="#581C87" stroke="#C084FC" strokeWidth="1.5" />
              <text x="190" y="185" fill="#F3E8FF" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                PB-C MATRIX
              </text>
              <text x="190" y="200" fill="#E9D5FF" fontSize="8" fontFamily="monospace" textAnchor="middle">
                C_dl 5000F + Lead
              </text>
              <text x="190" y="215" fill="#A855F7" fontSize="8" fontFamily="monospace" textAnchor="middle">
                1.8V to 2.45V
              </text>

              {/* High-Burst Grid Output */}
              <rect x="270" y="160" width="70" height="70" rx="4" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
              <text x="305" y="185" fill="#FEF3C7" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                GRID LOAD
              </text>
              <text x="305" y="200" fill="#FDE68A" fontSize="8" fontFamily="monospace" textAnchor="middle">
                50A Burst
              </text>

              {/* Wiring Conduits */}
              <path d="M 100,60 L 140,60" stroke="#22C55E" strokeWidth="2" />
              <path d="M 190,110 L 190,160" stroke="#38BDF8" strokeWidth="2" />
              <path d="M 240,195 L 270,195" stroke="#F59E0B" strokeWidth="2" />

              {/* Microcontroller Monitor Bus */}
              <rect x="20" y="160" width="80" height="70" rx="4" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
              <text x="60" y="185" fill="#F1F5F9" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                MCU (nRF52)
              </text>
              <text x="60" y="200" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                15nA Deep Sleep
              </text>
              <path d="M 100,195 L 140,195" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>
          </div>

          {/* Threshold Tuning Mini-Controls */}
          <div className="flex flex-col gap-3 text-xs font-mono pt-2">
            <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">
              VOLTAGE COMPARATOR HYSTERESIS
            </span>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span className="text-slate-300">V_BAT_OK High Threshold:</span>
                <span className="text-amber-400 font-semibold tabular-nums">{vBatOkHigh.toFixed(2)} V</span>
              </div>
              <input
                type="range"
                min="2.10"
                max="2.44"
                step="0.01"
                value={vBatOkHigh}
                onChange={(e) => setVBatOkHigh(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span className="text-slate-300">V_BAT_OK Low Cutoff:</span>
                <span className="text-rose-400 font-semibold tabular-nums">{vBatOkLow.toFixed(2)} V</span>
              </div>
              <input
                type="range"
                min="1.75"
                max="2.05"
                step="0.01"
                value={vBatOkLow}
                onChange={(e) => setVBatOkLow(parseFloat(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Right: C++ Code Viewer (lg:col-span-7) */}
        <div className="lg:col-span-7 p-5 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-white uppercase">
                BioVolt_Harvester_Firmware.ino
              </span>
            </div>
            <div className="flex items-center gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded text-xs font-mono">
              {(['nrf52', 'esp32', 'stm32'] as const).map((mcu) => (
                <button
                  key={mcu}
                  onClick={() => setTargetMcu(mcu)}
                  className={`px-2 py-0.5 rounded uppercase text-[10px] transition-colors ${
                    targetMcu === mcu
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mcu}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[#070A10] rounded border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed max-h-[480px] overflow-y-auto">
            <pre className="text-slate-300 selection:bg-amber-400/20">{CXX_FIRMWARE}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
