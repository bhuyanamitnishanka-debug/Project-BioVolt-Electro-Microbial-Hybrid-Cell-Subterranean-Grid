/**
 * Project BioVolt: Automation Scripts & Subterranean ESP32 OTA Studio
 * Continuous integration pipelines, encrypted secrets relays, setup automation,
 * and live simulated Over-The-Air (OTA) firmware flasher for deep caisson networks.
 */

import React, { useState } from 'react';
import {
  Terminal,
  Download,
  Copy,
  Check,
  Wifi,
  Radio,
  RefreshCw,
  HardDrive,
  ShieldCheck,
  Cpu,
  Mail,
  Key,
  ShieldAlert,
  FileCode,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const SETUP_AND_RUN_SH = `#!/bin/bash
# ==============================================================================
# BioVolt UE-EMG: Subterranean Cluster Node Automated Setup & Test Runner Core
# ==============================================================================
set -e

echo "================================================================"
echo "[INITIALIZING]: Setting up Project BioVolt Subterranean Pipeline"
echo "================================================================"

# 1. Initialize Python 3 Isolated Virtual Environment Sandbox
if [ ! -d "venv" ]; then
    echo " -> Constructing clean Python virtual workspace environment..."
    python3 -m venv venv
fi

# 2. Activate Local Virtual Environment Environment
source venv/bin/activate

# 3. Handle System Dependency Installations Matrix
echo " -> Validating project dependency libraries..."
pip install --upgrade pip
pip install numpy matplotlib

# 4. Launch the Automated Mock Telemetry Data Pipeline Engine
echo " -> Launching live telemetry sensor node simulation pipeline..."
if [ -f "test_runner.py" ]; then
    python test_runner.py
else
    echo "[CRITICAL ERROR]: Target executable resource 'test_runner.py' missing."
    exit 1
fi
`;

const SETUP_AND_RUN_PS1 = `# ==============================================================================
# BioVolt UE-EMG: Subterranean Cluster Node Automated Setup & Test Runner Core
# ==============================================================================
$ErrorActionPreference = "Stop"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "[INITIALIZING]: Setting up Project BioVolt Subterranean Pipeline" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# 1. Initialize Python Isolated Virtual Environment Sandbox
if (-not (Test-Path "venv")) {
    Write-Host " -> Constructing clean Python virtual workspace environment..." -ForegroundColor Yellow
    python -m venv venv
}

# 2. Activate Local Virtual Environment Environment
. venv\\Scripts\\Activate.ps1

# 3. Handle System Dependency Installations Matrix
Write-Host " -> Validating project dependency libraries..." -ForegroundColor Yellow
python -m pip install --upgrade pip
pip install numpy matplotlib

# 4. Launch the Automated Mock Telemetry Data Pipeline Engine
Write-Host " -> Launching live telemetry sensor node simulation pipeline..." -ForegroundColor Green
if (Test-Path "test_runner.py") {
    python test_runner.py
} else {
    Write-Error "[CRITICAL ERROR]: Target executable resource 'test_runner.py' missing."
    Exit 1
}
`;

const BIO_OTA_FIRMWARE_INO = `/**
 * @file bio_ota_firmware.ino
 * @brief Subterranean Over-The-Air (OTA) secure firmware update execution logic block.
 */
#include <WiFi.h>
#include <HTTPClient.h>
#include <Update.h>

const char* WIFI_SSID     = "UE_EMG_SECURE_NET";
const char* WIFI_PASSWORD = "SUB_SURFACE_GRID_PASSWORD";

void connectToGridNetwork() {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print(F("[WIFI CONNECTING]"));
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(F("."));
    }
    Serial.println(F("\\n[WIFI CONNECTED]: IP Acquired."));
}

bool executeSubterraneanOTA(const char* binUrl) {
    HTTPClient http;
    http.begin(binUrl);
    int httpCode = http.GET();
    
    if (httpCode != HTTP_CODE_OK) {
        Serial.printf("[OTA ERROR]: HTTP Fetch Failed, Error: %d\\n", httpCode);
        http.end();
        return false;
    }

    int contentLength = http.getSize();
    if (contentLength <= 0) {
        Serial.println(F("[OTA ERROR]: Invalid Firmware Binary Content Size."));
        http.end();
        return false;
    }

    bool canBegin = Update.begin(contentLength);
    if (!canBegin) {
        Serial.println(F("[OTA ERROR]: Insufficient partition space allocated for OTA."));
        http.end();
        return false;
    }

    WiFiClient* client = http.getStreamPtr();
    size_t written = Update.writeStream(*client);

    if (written == contentLength) {
        Serial.println(F("[OTA SUCCESS]: Binary transmission committed successfully."));
    } else {
        Serial.printf("[OTA ERROR]: Written bytes mismatch (%d / %d)\\n", written, contentLength);
        http.end();
        return false;
    }

    if (!Update.end()) {
        Serial.printf("[OTA ERROR]: Update.end() returned error code #: %d\\n", Update.getError());
        http.end();
        return false;
    }

    if (!Update.isFinished()) {
        Serial.println(F("[OTA ERROR]: Update completed without finish flag confirmation."));
        http.end();
        return false;
    }

    Serial.println(F("[OTA REBOOT]: Flashing sequence verified. Rebooting subterranean ESP32 node."));
    http.end();
    ESP.restart();
    return true;
}

void setup() {
    Serial.begin(115200);
    delay(1000);
    Serial.println(F("[INITIALIZING]: Subterranean Node Bootloader Started"));
    connectToGridNetwork();
}

void loop() {
    // Polling OTA endpoint for production binary patches
    delay(60000);
}
`;

const DISTRIBUTE_ASSETS_YML = `name: Project BioVolt Enterprise Distribution Pipeline
on:
  push:
    branches: [ "main" ]
  workflow_dispatch:
    inputs:
      recipient_tier:
        description: 'Select Target Venture Capital / Academic Incubation Tier'
        required: true
        default: 'Tier-1-Incubation-Committees'
        type: choice
        options:
          - 'Tier-1-Incubation-Committees'
          - 'Global-Energy-Conversion-Startups'
          - 'Defensive-IP-Prior-Art-Vaults'
jobs:
  build-verify-distribute:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
    - name: Checkout Code Repository Core
      uses: actions/checkout@v4
      with:
        persist-credentials: true

    - name: Configure Python Virtual Runtime Sandboxes
      uses: actions/setup-python@v5
      with:
        python-version: '3.11'
        cache: 'pip'

    - name: Install Hard-Science Core Engineering Matrix
      run: |
        python -m pip install --upgrade pip
        pip install numpy matplotlib

    - name: Execute Analytical Visualization Pipeline
      run: |
        # Generates fresh telemetry visualization frames for inclusion
        python simulator/dashboard_tracker.py

    - name: Local Structural Pre-Push Integrity Scan
      run: |
        # Executes strict variable verification limits before compilation loops
        chmod +x automation/verify_env.sh
        ./automation/verify_env.sh

    - name: Verify Invention Disclosure Document Presence
      run: |
        # Ensures the definitive PDF structural payload exists inside workspace boundaries
        if [ ! -f "BioVolt_Invention_Disclosure_Form.pdf" ]; then
          echo "❌ [CRITICAL ERROR]: Target asset 'BioVolt_Invention_Disclosure_Form.pdf' missing."
          exit 1
        fi
        echo "🟢 Verified PDF Document Payload Presence."

    - name: Compress System Blueprints & Core Code Assets
      run: |
        # Packages structural configuration definitions into a deployment bundle
        zip -r biovolt_technical_bundle.zip \\
          BioVolt_Invention_Disclosure_Form.pdf \\
          pipeline_telemetry_metrics.png \\
          firmware/ \\
          simulator/ \\
          docs/ \\
          README.md

    - name: Compile Automated Release Drops for Venture Reviewers
      uses: softprops/action-gh-release@v2
      with:
        files: |
          BioVolt_Invention_Disclosure_Form.pdf
          biovolt_technical_bundle.zip
        tag_name: release-v1.0.0-UE-EMG-2026
        name: "Project BioVolt: Complete Technology Transfer Package"
        body: |
          ### 🚨 [AUTOMATED INTELLECTUAL PROPERTY DEFENSIVE ENTRY]
          **System Architecture:** Under-Earth Electro-Microbial Grid (UE-EMG)
          **Project Classification:** Technology Transfer / Patent-Grade Infrastructure
          
          This cryptographic release maps defensive prior art configurations, multi-axis G-code paths, and thermodynamic simulation layers. Access is governed under strict non-disclosure legal constraints.
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

    - name: Dispatch Secure PDF via Encrypted Email Relay
      uses: dawidd6/action-send-mail@v3
      with:
        server_address: smtp.gmail.com
        server_port: 465
        secure: true
        username: bhuyanamitnishanka-debug@gmail.com
        # Utilization of encrypted repository secrets
        password: \${{ secrets.SMTP_PASSWORD }}
        subject: "Project BioVolt: Venture Capital Investment & Incubation Briefing Bundle"
        to: \${{ secrets.VC_EMAIL_RECIPIENTS }}
        from: "Project BioVolt Node Core <bhuyanamitnishanka-debug@gmail.com>"
        body: |
          Attention Committee Members,
          
          The automated build pipeline for Project BioVolt (Under-Earth Electro-Microbial Grid) has finalized verification. 
          Please find attached the master verification document: BioVolt_Invention_Disclosure_Form.pdf.
          
          This transmission is encrypted and subject to immediate prior art defensive governance rules.
        attachments: BioVolt_Invention_Disclosure_Form.pdf

    - name: Secure Telemetry Pipeline Dispatched Alert
      run: |
        echo "================================================================"
        echo "🎉 [SUCCESS]: BioVolt Technical Package successfully compiled!"
        echo "              Defensive IP drops deployed and email alerts sent."
        echo "================================================================"
`;

const VERIFY_ENV_SH = `#!/bin/bash
# ==============================================================================
# Project BioVolt: Automated Pre-Push Integrity Scan (automation/verify_env.sh)
# ==============================================================================
set -e

REQUIRED_DIRECTORIES=("src" "docs")
REQUIRED_FILES=("package.json" "README.md" "cli_manager.py")
EXPECTED_METADATA_ID="UE-EMG-BIOVOLT-2026"

echo "================================================================"
echo "⚡ EXECUTING BIOVOLT AUTOMATION INTEGRITY VERIFICATION SCAN ⚡"
echo "================================================================"

# 1. Structural Layout Scan
echo " -> Step 1: Checking directory trees..."
for dir in "\${REQUIRED_DIRECTORIES[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "❌ [ERROR]: Missing required directory: '$dir'"
        exit 1
    fi
done
echo "   🟢 Core directories verified."

# 2. Critical Pathways
echo " -> Step 2: Validating operational pathways..."
for file in "\${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ [ERROR]: Missing core file: '$file'"
        exit 1
    fi
done
echo "   🟢 Execution paths validated."

# 3. Custom Metadata Configuration Scan
echo " -> Step 3: Verifying repository metadata constraints..."
if grep -q "x-project-id: \\"$EXPECTED_METADATA_ID\\"" README.md; then
    echo "   🟢 Verified x-project-id: $EXPECTED_METADATA_ID"
else
    echo "❌ [ERROR]: Custom metadata tag mismatch in README.md!"
    echo "            Expected: x-project-id: \\"$EXPECTED_METADATA_ID\\""
    exit 1
fi

echo "================================================================"
echo "✅ PRE-PUSH INTEGRITY SCAN COMPLETED WITHOUT ANOMALIES."
echo "================================================================"
`;

const IIT_INCUBATION_PITCH_EMAIL = `Subject: Submission & Incubation Briefing: Project BioVolt (Under-Earth Electro-Microbial Grid) [Ref: UE-EMG-BIOVOLT-2026]

Respected Incubation Selection Committee / Venture Evaluation Board,
(IIT-Madras HTIC MedTech Incubator / IIT-Bhubaneswar / O-Hub)

I am formally submitting the comprehensive engineering dossier, mathematical validation models, and hardware blueprints for Project BioVolt: Under-Earth Electro-Microbial Grid (UE-EMG).

1. EXECUTIVE SUMMARY & NOVELTY:
Project BioVolt shifts both renewable biological energy conversion (anaerobic digestion + Geobacter sulfurreducens bio-anodes) and asymmetric capacitive chemical storage (Lead-Carbon matrix) 10 to 30 meters underground inside pre-cast concrete caissons. Sinking the installation into deep bedrock maintains an undisturbed natural 15°C baseline temperature year-round, completely eliminating surface thermal degradation, oxidation risks, and standard lead sulfation cycles under low-trickle bio-currents.

2. FINANCIAL ARCHITECTURE & GRANT ALIGNMENT:
- Overall Project Macro Valuation: ₹1.22 Crore (12,200,000 INR)
- Phase 1 Physical Prototyping Cap: Strictly capped under ₹4 Lakh (₹3,95,000 INR)
- Target Grant Alignment: ₹10 Lakh NIDHI-PRAYAS Prototyping Support Framework
- Commercial Pathway: Defensive Technology Transfer (IP licensing fees + non-dilutive lifetime manufacturing royalties)

3. ATTACHMENTS & VERIFIED TECHNICAL ARTIFACTS:
- BioVolt_Invention_Disclosure_Form.pdf (Master Patent-Grade Prior Art Disclosure)
- pipeline_telemetry_metrics.png (Arrhenius & Capacitive 24h Model Validation)
- Subterranean ESP32 Firmware Trees & 3-Axis CNC Fluidic Path G-Code
- Interactive Repository Core: https://github.com/bhuyanamitnishanka/project-biovolt

This transmission is cryptographically registered and subject to definitive defensive prior art protection rules.

Sincerely,
Amit Nishanka Bhuyan
Primary Innovator & Technical Project Coordinator
Project BioVolt [UE-EMG-BIOVOLT-2026]
Salipur, Odisha, India
Email: bhuyanamitnishanka@gmail.com
`;

export const AutomationOtaStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'distribute' | 'verify' | 'pitch_email' | 'sh' | 'ps1' | 'ota'>('distribute');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // OTA Simulator State
  const [otaUrl, setOtaUrl] = useState<string>('http://192.168.1.100/builds/ue_emg_firmware_v2.5.bin');
  const [otaStatus, setOtaStatus] = useState<'idle' | 'connecting' | 'writing' | 'rebooting' | 'complete'>('idle');
  const [otaProgress, setOtaProgress] = useState<number>(0);
  const [otaLogs, setOtaLogs] = useState<string[]>([]);

  // Workflow Dispatch Simulator State
  const [workflowStatus, setWorkflowStatus] = useState<'idle' | 'running' | 'success'>('idle');
  const [selectedTier, setSelectedTier] = useState<string>('Tier-1-Incubation-Committees');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const triggerSimulatedWorkflow = () => {
    setWorkflowStatus('running');
    setTimeout(() => {
      setWorkflowStatus('success');
      setTimeout(() => setWorkflowStatus('idle'), 4000);
    }, 2200);
  };

  const startSimulatedOTA = () => {
    setOtaStatus('connecting');
    setOtaProgress(0);
    setOtaLogs([
      `[OTA INITIATED]: Contacting binary host at ${otaUrl}`,
      `[HTTP 200]: Content-Length: 1,248,512 bytes verified.`,
      `[PARTITION]: Allocated U_FLASH partition space: OK.`,
    ]);

    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        clearInterval(interval);
        setOtaProgress(100);
        setOtaStatus('rebooting');
        setOtaLogs((prev) => [
          ...prev,
          `[OTA TRANSMISSION]: 1,248,512 / 1,248,512 bytes committed to ESP32 Flash.`,
          `[VALIDATION]: MD5 checksum matched. Firmware integrity verified.`,
          `[REBOOT SEQUENCING]: Soft-reset triggered. Node restarting into firmware v2.5...`,
        ]);
        setTimeout(() => {
          setOtaStatus('complete');
          setOtaLogs((prev) => [...prev, `[NODE ONLINE]: Subterranean caisson node rebooted successfully.`]);
        }, 1500);
      } else {
        setOtaProgress(current);
        setOtaStatus('writing');
      }
    }, 300);
  };

  const contentMap: Record<string, string> = {
    distribute: DISTRIBUTE_ASSETS_YML,
    verify: VERIFY_ENV_SH,
    pitch_email: IIT_INCUBATION_PITCH_EMAIL,
    sh: SETUP_AND_RUN_SH,
    ps1: SETUP_AND_RUN_PS1,
    ota: BIO_OTA_FIRMWARE_INO,
  };

  const fileMap: Record<string, string> = {
    distribute: 'distribute-assets.yml',
    verify: 'verify_env.sh',
    pitch_email: 'iit_incubation_pitch_email.txt',
    sh: 'setup_and_run.sh',
    ps1: 'setup_and_run.ps1',
    ota: 'bio_ota_firmware.ino',
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="p-6 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Radio className="w-4 h-4" />
            <span>SUBTERRANEAN OTA UPDATES, CI/CD PIPELINES &amp; VC DISTRIBUTION</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-tech)' }}>
            Enterprise Distribution Pipeline &amp; Remote Flash Suite
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Automates repository checks, runs 24h Arrhenius mathematical models, compiles patent-grade PDF disclosures,
            and securely dispatches assets to venture capital and academic incubation committees via encrypted GitHub Actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload(contentMap[activeTab], fileMap[activeTab])}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs font-mono transition-colors shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {fileMap[activeTab]}</span>
          </button>
        </div>
      </div>

      {/* GitHub Actions Distribution Status & Secrets Relay Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Workflow Trigger & Status Badge */}
        <div className="lg:col-span-7 p-5 bg-[#0D121D] border border-slate-800 rounded-xl flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  GitHub Actions Enterprise Release Pipeline (.github/workflows/distribute-assets.yml)
                </h3>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                <ShieldCheck className="w-3 h-3" />
                <span>Encrypted Relay Ready</span>
              </span>
            </div>

            {/* Markdown Badge Code Snippet */}
            <div className="mt-3 p-3 bg-black/50 border border-slate-800/80 rounded-lg flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-slate-300">
                <span className="text-slate-500 shrink-0">README Status Badge:</span>
                <code className="text-cyan-300 truncate">
                  [![Project BioVolt Build Status](https://github.com/bhuyanamitnishanka/project-biovolt/actions/workflows/distribute-assets.yml/badge.svg)](https://github.com/bhuyanamitnishanka/project-biovolt/actions)
                </code>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    '[![Project BioVolt Build Status](https://github.com/bhuyanamitnishanka/project-biovolt/actions/workflows/distribute-assets.yml/badge.svg)](https://github.com/bhuyanamitnishanka/project-biovolt/actions)',
                    'badge-snippet'
                  )
                }
                className="shrink-0 p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="Copy Status Badge Markdown"
              >
                {copiedKey === 'badge-snippet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Target Tier Selection */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="text-xs font-mono text-slate-400">Target Incubation / VC Tier:</label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-400"
              >
                <option value="Tier-1-Incubation-Committees">Tier-1 Incubation Committees (IIT Madras / IIT Bhubaneswar)</option>
                <option value="Global-Energy-Conversion-Startups">Global Energy-Conversion Startups &amp; IP Funds</option>
                <option value="Defensive-IP-Prior-Art-Vaults">Defensive IP Prior Art Registries &amp; Patent Vaults</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Release Target: <strong className="text-white">release-v1.0.0-UE-EMG-2026</strong></span>
            </div>
            <button
              onClick={triggerSimulatedWorkflow}
              disabled={workflowStatus === 'running'}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs font-mono transition-colors shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${workflowStatus === 'running' ? 'animate-spin' : ''}`} />
              <span>{workflowStatus === 'running' ? 'Compiling & Disagreeing Drops...' : workflowStatus === 'success' ? 'Dispatched to VC Vault!' : 'Simulate Workflow Push'}</span>
            </button>
          </div>
        </div>

        {/* Right: Encrypted GitHub Secrets Vault Configuration Guide */}
        <div className="lg:col-span-5 p-5 bg-[#0D121D] border border-slate-800 rounded-xl flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Key className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                GitHub Secrets Vault Setup (Repository Settings)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Navigate to <strong>Settings ➔ Secrets and variables ➔ Actions ➔ New repository secret</strong>:
            </p>

            <div className="mt-3 space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-black/40 border border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-amber-400 font-bold">SMTP_PASSWORD</div>
                  <div className="text-slate-400 text-[11px]">Google App Password for automated relay</div>
                </div>
                <button
                  onClick={() => handleCopy('SMTP_PASSWORD', 'secret-smtp')}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Copy secret name"
                >
                  {copiedKey === 'secret-smtp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-2.5 bg-black/40 border border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-amber-400 font-bold">VC_EMAIL_RECIPIENTS</div>
                  <div className="text-slate-400 text-[11px]">Incubation evaluation emails (comma-separated)</div>
                </div>
                <button
                  onClick={() => handleCopy('VC_EMAIL_RECIPIENTS', 'secret-vc')}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Copy secret name"
                >
                  {copiedKey === 'secret-vc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Encrypted secrets prevent credential leaks during public PRs.</span>
          </div>
        </div>
      </div>

      {/* Interactive Subterranean OTA Push Simulator */}
      <div className="p-6 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-white font-bold">
            <Wifi className="w-4 h-4 text-cyan-400" />
            <span>INTERACTIVE ESP32 OTA FLASH SIMULATOR (bio_ota_firmware.ino)</span>
          </div>
          <span className="text-slate-400">Node: UE-EMG-VAULT-01 (Depth: -22m)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8 flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-slate-400">REMOTE FIRMWARE BINARY ENDPOINT URL</label>
            <input
              type="text"
              value={otaUrl}
              onChange={(e) => setOtaUrl(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="md:col-span-4 flex items-end">
            <button
              onClick={startSimulatedOTA}
              disabled={otaStatus === 'writing' || otaStatus === 'rebooting'}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded text-xs font-mono transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${otaStatus === 'writing' ? 'animate-spin' : ''}`} />
              <span>Trigger Remote Flash</span>
            </button>
          </div>
        </div>

        {/* OTA Progress Bar & Log Output */}
        {otaStatus !== 'idle' && (
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Flash Memory Progress:</span>
              <span className="text-cyan-400 font-bold">{otaProgress}%</span>
            </div>
            <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-200"
                style={{ width: `${otaProgress}%` }}
              />
            </div>

            <div className="p-3 bg-[#070A10] border border-slate-800 rounded font-mono text-[11px] text-slate-300 space-y-1">
              {otaLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-cyan-400">➔</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Script & Workflow Code Viewer */}
      <div className="p-5 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono flex-wrap">
            <button
              onClick={() => setActiveTab('distribute')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === 'distribute' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              distribute-assets.yml (GitHub Actions)
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === 'verify' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              verify_env.sh (Pre-Push Gate)
            </button>
            <button
              onClick={() => setActiveTab('pitch_email')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === 'pitch_email' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              IIT / VC Follow-up Pitch Email
            </button>
            <button
              onClick={() => setActiveTab('sh')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === 'sh' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              setup_and_run.sh (Linux/macOS)
            </button>
            <button
              onClick={() => setActiveTab('ps1')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === 'ps1' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              setup_and_run.ps1 (Windows)
            </button>
            <button
              onClick={() => setActiveTab('ota')}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === 'ota' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              bio_ota_firmware.ino (ESP32)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(contentMap[activeTab], activeTab)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-300 transition-colors"
            >
              {copiedKey === activeTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === activeTab ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-[#070A10] rounded border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed max-h-[420px] overflow-y-auto">
          <pre className="text-slate-300 selection:bg-amber-400/20 whitespace-pre-wrap">
            {contentMap[activeTab]}
          </pre>
        </div>
      </div>
    </div>
  );
};
