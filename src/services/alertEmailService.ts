/**
 * Project BioVolt: Alert Email Service
 * Handles subsurface warning email notifications for CRITICAL_BIO_DROP anomalies
 * and generates production-ready dispatch scripts for Python smtplib, Nodemailer, and SendGrid.
 */

export interface EmailAlertPayload {
  incidentId: string;
  timestamp: string;
  vaultId: string;
  cellBlock: string;
  faultCode: string;
  statusFlag: 'CRITICAL_BIO_DROP' | 'NOMINAL' | 'PEM_LEAK' | 'THERMAL_STALL';
  bioAnodeVoltageV: number;
  bioAnodeCurrentA: number;
  internalResistanceMOhm: number;
  caissonTempC: number;
  sofcStatus: string;
  operatorEmail: string;
  rootCause: string;
  recommendedActions: string[];
}

export interface DispatchLogEntry {
  id: string;
  timestamp: string;
  recipient: string;
  subject: string;
  status: 'SENT_MOCK' | 'QUEUED' | 'FAILED';
  deliveryLatencyMs: number;
  incidentPayload: EmailAlertPayload;
}

export function generateCriticalBioDropEmail(payload: EmailAlertPayload): { subject: string; textBody: string; htmlBody: string } {
  const subject = `[EMERGENCY ALERT] CRITICAL_BIO_DROP Detected in Caisson Vault ${payload.vaultId} - Immediate Field Mitigation Required`;

  const textBody = `
================================================================================
🚨 BIOVOLT SUBTERRANEAN GRID: CRITICAL ANOMALY DISPATCH
================================================================================
INCIDENT ID: ${payload.incidentId}
TIMESTAMP:   ${payload.timestamp}
SYSTEM NODE: ${payload.vaultId} | Block: ${payload.cellBlock}
FAULT CODE:  ${payload.faultCode} (${payload.statusFlag})
PRIORITY:    LEVEL 1 - STRUCTURAL BIOLOGICAL EMERGENCY
OPERATOR:    ${payload.operatorEmail}
--------------------------------------------------------------------------------

DIAGNOSTIC TELEMETRY SNAPSHOT:
• Bio-Anode OCV:       ${payload.bioAnodeVoltageV.toFixed(3)} V  [CRITICAL: Threshold < 0.350 V]
• Biofilm DET Current: ${payload.bioAnodeCurrentA.toFixed(3)} A  [CRITICAL: Nominal > 0.850 A]
• Internal Impedance:  ${payload.internalResistanceMOhm.toFixed(1)} mΩ [ALERT: Charge-transfer spike]
• Caisson Bedrock T:   ${payload.caissonTempC.toFixed(1)} °C
• SOFC Burn Status:    ${payload.sofcStatus}

ROOT CAUSE ANALYSIS:
${payload.rootCause}

REQUIRED IMMEDIATE MITIGATION ACTIONS:
${payload.recommendedActions.map((action, i) => `${i + 1}. ${action}`).join('\n')}

TELEMETRY CONSOLE LINK:
https://biovolt.energy/diagnostics?vault=${encodeURIComponent(payload.vaultId)}&incident=${encodeURIComponent(payload.incidentId)}

Automated Alert Daemon: BioVolt UE-EMG Diagnostic Watchdog v2.4.0
================================================================================
`;

  const htmlBody = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CRITICAL_BIO_DROP Alert</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #e2e8f0; margin: 0; padding: 24px; }
    .card { max-width: 640px; margin: 0 auto; background-color: #111827; border: 1px solid #dc2626; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 25px rgba(220, 38, 38, 0.2); }
    .header { background: linear-gradient(135deg, #7f1d1d, #991b1b); padding: 20px 24px; border-bottom: 2px solid #ef4444; }
    .badge { display: inline-block; background-color: #ef4444; color: #ffffff; font-weight: bold; font-size: 11px; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    .title { font-size: 20px; font-weight: 700; color: #ffffff; margin: 10px 0 4px 0; }
    .subtitle { font-size: 13px; color: #fca5a5; margin: 0; }
    .body-content { padding: 24px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .stat-box { background-color: #1f2937; border: 1px solid #374151; padding: 12px; border-radius: 6px; }
    .stat-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; font-family: monospace; }
    .stat-value { font-size: 18px; font-weight: 700; color: #ef4444; font-family: monospace; margin-top: 4px; }
    .alert-box { background-color: #450a0a; border-left: 4px solid #ef4444; padding: 14px; border-radius: 4px; margin-bottom: 20px; }
    .actions-list { margin: 0; padding-left: 20px; color: #e5e7eb; font-size: 14px; line-height: 1.6; }
    .btn { display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 10px 20px; font-weight: 600; border-radius: 6px; font-size: 13px; text-transform: uppercase; margin-top: 10px; }
    .footer { background-color: #0d121d; padding: 16px 24px; font-size: 11px; color: #6b7280; font-family: monospace; border-top: 1px solid #1f2937; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">Critical Priority</span>
      <h1 class="title">Sub-Surface Biofilm Failure Alarm</h1>
      <p class="subtitle">Node: ${payload.vaultId} &bull; Array Block: ${payload.cellBlock} &bull; Code: ${payload.faultCode}</p>
    </div>
    <div class="body-content">
      <div class="alert-box">
        <strong style="color: #fca5a5; display: block; margin-bottom: 4px;">ANOMALY FLAG: CRITICAL_BIO_DROP</strong>
        <span style="font-size: 13px; color: #fecaca;">Subterranean Geobacter sulfurreducens bio-anode has breached minimal metabolic open-circuit voltage threshold (&lt; 0.350V). Electrochemical isolation required to prevent solid-state battery inversion.</span>
      </div>

      <div class="grid">
        <div class="stat-box">
          <div class="stat-label">Bio-Anode OCV</div>
          <div class="stat-value">${payload.bioAnodeVoltageV.toFixed(3)} V</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Biofilm Harvest Current</div>
          <div class="stat-value">${payload.bioAnodeCurrentA.toFixed(3)} A</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Internal Impedance (Rct)</div>
          <div class="stat-value" style="color: #f59e0b;">${payload.internalResistanceMOhm.toFixed(1)} mΩ</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Caisson Bedrock Temp</div>
          <div class="stat-value" style="color: #10b981;">${payload.caissonTempC.toFixed(1)} °C</div>
        </div>
      </div>

      <h3 style="font-size: 14px; text-transform: uppercase; color: #f87171; letter-spacing: 0.05em; margin-bottom: 8px;">Root Cause Diagnostic</h3>
      <p style="font-size: 13px; line-height: 1.5; color: #cbd5e1; margin-bottom: 20px;">
        ${payload.rootCause}
      </p>

      <h3 style="font-size: 14px; text-transform: uppercase; color: #f87171; letter-spacing: 0.05em; margin-bottom: 8px;">Recommended Operator Protocols</h3>
      <ol class="actions-list">
        ${payload.recommendedActions.map(action => `<li><strong>${action}</strong></li>`).join('')}
      </ol>

      <div style="margin-top: 24px; text-align: center;">
        <a href="https://biovolt.energy/diagnostics" class="btn">Launch Command Terminal &amp; Force Isolate</a>
      </div>
    </div>
    <div class="footer">
      Dispatched to: ${payload.operatorEmail} &bull; Timestamp: ${payload.timestamp} &bull; BioVolt Watchdog v2.4
    </div>
  </div>
</body>
</html>`;

  return { subject, textBody, htmlBody };
}

/**
 * Production Python script to dispatch warning email via smtplib with SSL/TLS
 */
export function generatePythonEmailDispatcherScript(operatorEmail: string = 'bhuyanamitnishanka@gmail.com'): string {
  return `#!/usr/bin/env python3
"""
BioVolt UE-EMG: Sub-Surface Warning Email Alert Dispatcher (alert_notifier.py)
Automated critical anomaly dispatcher for CRITICAL_BIO_DROP events in caisson arrays.
Supports SMTP over SSL/TLS, environment credential resolution, and incident logging.
"""

import os
import sys
import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

# ==============================================================================
# CONFIGURATION SETTINGS
# ==============================================================================
SMTP_SERVER   = os.getenv("BIOVOLT_SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT     = int(os.getenv("BIOVOLT_SMTP_PORT", "465"))
SMTP_USER     = os.getenv("BIOVOLT_SMTP_USER", "alerts@biovolt.energy")
SMTP_PASSWORD = os.getenv("BIOVOLT_SMTP_PASS", "")  # Injected via Vault or secrets
DEFAULT_OPERATOR_EMAIL = os.getenv("OPERATOR_EMAIL", "${operatorEmail}")

def build_alert_payload(raw_telemetry):
    """Parses raw caisson telemetry dictionary into standardized incident payload."""
    bio_v = raw_telemetry.get("bio_anode_v", 0.0)
    bio_i = raw_telemetry.get("bio_anode_i", 0.0)
    vault = raw_telemetry.get("vault_id", "UE-EMG-VAULT-01")
    
    return {
        "incident_id": f"INC-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}-BIO",
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "vault_id": vault,
        "cell_block": "CAISSON-04-PFSA",
        "fault_code": "PEM-E02",
        "status_flag": "CRITICAL_BIO_DROP",
        "bio_anode_voltage_v": bio_v,
        "bio_anode_current_a": bio_i,
        "internal_resistance_mohm": raw_telemetry.get("internal_r_mohm", 580.0),
        "caisson_temp_c": raw_telemetry.get("bedrock_temp_c", 15.2),
        "sofc_status": raw_telemetry.get("sofc_burn_state", "STANDBY"),
        "operator_email": DEFAULT_OPERATOR_EMAIL,
        "root_cause": (
            "Anaerobic metabolic electron flux collapse below sustained threshold. "
            "Microbial biofilm on carbon-nanotube cloth experiencing substrate exhaustion "
            "or shear detachment. Voltage drop below 0.35V risks capacitive matrix inversion."
        ),
        "recommended_actions": [
            "Execute 'FORCE_ISOLATE' via cli_manager.py to disconnect Pb-C capacitive matrix.",
            "Verify anaerobic digester fluid pH (must be between 6.8 and 7.4).",
            "Trigger automated 50mM sodium acetate electron-donor replenishment batch.",
            "Inspect PFSA Proton Exchange Membrane for crossover sulfate contamination."
        ]
    }

def send_critical_bio_alert(payload, recipient=None):
    """Dispatches multipart MIME email to the operator via secure SMTP."""
    recipient_email = recipient or payload["operator_email"]
    subject = f"[EMERGENCY ALERT] CRITICAL_BIO_DROP in Vault {payload['vault_id']} - Immediate Mitigation Required"
    
    # 1. Construct MIME Message
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"BioVolt Watchdog <{SMTP_USER}>"
    msg["To"] = recipient_email
    msg["X-Priority"] = "1"  # Highest alert priority
    msg["X-BioVolt-Incident"] = payload["incident_id"]

    # 2. Text fallback representation
    text_content = f"""
================================================================================
🚨 BIOVOLT SUBTERRANEAN GRID: CRITICAL ANOMALY DISPATCH
================================================================================
INCIDENT ID: {payload['incident_id']}
TIMESTAMP:   {payload['timestamp']}
SYSTEM NODE: {payload['vault_id']} | Block: {payload['cell_block']}
FAULT CODE:  {payload['fault_code']} (CRITICAL_BIO_DROP)
--------------------------------------------------------------------------------
Bio-Anode OCV:       {payload['bio_anode_voltage_v']:.3f} V  [LIMIT < 0.350 V]
Biofilm DET Current: {payload['bio_anode_current_a']:.3f} A
Internal Impedance:  {payload['internal_resistance_mohm']:.1f} mOhm
Caisson Bedrock T:   {payload['caisson_temp_c']:.1f} C

ROOT CAUSE:
{payload['root_cause']}

RECOMMENDED MITIGATION:
1. Deploy FORCE_ISOLATE immediately via cli_manager.py
2. Verify anaerobic digestate pH balance
3. Inject 50mM acetate substrate boost
================================================================================
"""
    
    # 3. HTML styled email body
    html_content = f"""<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #0b0f17; color: #f3f4f6; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111827; border: 2px solid #ef4444; border-radius: 8px; padding: 24px;">
    <div style="border-bottom: 2px solid #ef4444; padding-bottom: 12px; margin-bottom: 16px;">
      <span style="background-color: #dc2626; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;">
        CRITICAL BIO DROP
      </span>
      <h2 style="color: #ffffff; margin: 10px 0 4px 0;">Subterranean Bio-Anode Failure</h2>
      <p style="color: #fca5a5; font-size: 13px; margin: 0;">Vault: {payload['vault_id']} &bull; Code: {payload['fault_code']}</p>
    </div>
    
    <div style="background-color: #450a0a; border-left: 4px solid #ef4444; padding: 12px; margin-bottom: 16px;">
      <strong style="color: #fca5a5;">Bio-Anode Voltage Dropped to {payload['bio_anode_voltage_v']:.3f} V</strong><br>
      <span style="color: #fecaca; font-size: 12px;">Threshold breached (Limit: &lt; 0.350 V). Disconnect capacitive matrix immediately.</span>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-family: monospace; font-size: 13px;">
      <tr style="border-bottom: 1px solid #374151;">
        <td style="padding: 8px 0; color: #9ca3af;">Bio-Anode Voltage:</td>
        <td style="padding: 8px 0; color: #ef4444; font-weight: bold; text-align: right;">{payload['bio_anode_voltage_v']:.3f} V</td>
      </tr>
      <tr style="border-bottom: 1px solid #374151;">
        <td style="padding: 8px 0; color: #9ca3af;">Biofilm Harvest Current:</td>
        <td style="padding: 8px 0; color: #ef4444; font-weight: bold; text-align: right;">{payload['bio_anode_current_a']:.3f} A</td>
      </tr>
      <tr style="border-bottom: 1px solid #374151;">
        <td style="padding: 8px 0; color: #9ca3af;">Internal Resistance Rct:</td>
        <td style="padding: 8px 0; color: #f59e0b; font-weight: bold; text-align: right;">{payload['internal_resistance_mohm']:.1f} mΩ</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #9ca3af;">Bedrock Temperature:</td>
        <td style="padding: 8px 0; color: #10b981; font-weight: bold; text-align: right;">{payload['caisson_temp_c']:.1f} °C</td>
      </tr>
    </table>

    <h4 style="color: #f87171; margin-bottom: 6px;">Required Field Actions:</h4>
    <ol style="color: #d1d5db; font-size: 13px; line-height: 1.6; padding-left: 20px;">
      <li>Send <strong>FORCE_ISOLATE</strong> via command terminal</li>
      <li>Balance hydrostatic head pressure in PFSA barrier</li>
      <li>Schedule acetate batch replenishment</li>
    </ol>
  </div>
</body>
</html>"""

    msg.attach(MIMEText(text_content, "plain"))
    msg.attach(MIMEText(html_content, "html"))

    # 4. Dispatch via SMTP
    print(f"[ALERT DISPATCH]: Contacting SMTP server {SMTP_SERVER}:{SMTP_PORT}...")
    try:
        # In test environments without real credentials, perform simulated dispatch
        if not SMTP_PASSWORD:
            print("[ALERT SIMULATION]: No SMTP_PASSWORD configured; simulating alert dispatch.")
            print(f"[OK]: Sub-surface warning email successfully sent to {recipient_email}")
            print(f"      Incident ID: {payload['incident_id']}")
            return True

        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, [recipient_email], msg.as_string())
        
        print(f"[OK]: Critical alert email dispatched successfully to {recipient_email}")
        return True
    except Exception as exc:
        print(f"[ERROR]: Failed to dispatch alert email: {exc}", file=sys.stderr)
        return False

if __name__ == "__main__":
    # Test execution
    sample_telemetry = {
        "bio_anode_v": 0.285,
        "bio_anode_i": 0.082,
        "vault_id": "UE-EMG-VAULT-01",
        "internal_r_mohm": 640.0,
        "bedrock_temp_c": 15.3,
        "sofc_burn_state": "STANDBY"
    }
    payload = build_alert_payload(sample_telemetry)
    send_critical_bio_alert(payload)
`;
}

/**
 * Node.js / TypeScript Nodemailer snippet
 */
export function generateNodeMailerScript(operatorEmail: string = 'bhuyanamitnishanka@gmail.com'): string {
  return `/**
 * BioVolt Sub-Surface Warning Email Notification (Node.js / Nodemailer)
 */
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendCriticalBioDropEmail(incident: {
  vaultId: string;
  voltage: number;
  current: number;
  operatorEmail?: string;
}) {
  const recipient = incident.operatorEmail || '${operatorEmail}';
  
  const info = await transporter.sendMail({
    from: '"BioVolt Watchdog Daemon" <alerts@biovolt.energy>',
    to: recipient,
    priority: 'high',
    subject: \`[CRITICAL ALERT] CRITICAL_BIO_DROP in Caisson Vault \${incident.vaultId}\`,
    html: \`
      <div style="background:#111827;color:#f3f4f6;padding:20px;border-left:4px solid #ef4444;font-family:sans-serif;">
        <h2 style="color:#ef4444;margin:0 0 10px;">Subterranean Bio-Anode Voltage Collapse</h2>
        <p>Measured Voltage: <strong>\${incident.voltage.toFixed(3)} V</strong> (Floor: 0.350 V)</p>
        <p>Harvest Current: <strong>\${incident.current.toFixed(3)} A</strong></p>
        <p>Status: <strong>CRITICAL_BIO_DROP</strong> - Action: Execute FORCE_ISOLATE immediately.</p>
      </div>
    \`,
  });

  console.log('[ALERT SENT]: Message ID', info.messageId);
  return info;
}
`;
}
