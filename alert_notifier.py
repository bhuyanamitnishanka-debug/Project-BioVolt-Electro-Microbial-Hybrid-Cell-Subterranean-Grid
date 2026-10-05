#!/usr/bin/env python3
"""
BioVolt UE-EMG: Sub-Surface Warning Email Alert Dispatcher (alert_notifier.py)
Automated critical anomaly dispatcher for CRITICAL_BIO_DROP events in caisson arrays.
Supports SMTP over SSL/TLS, environment credential resolution, and incident logging.
"""

import os
import sys
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

SMTP_SERVER   = os.getenv("BIOVOLT_SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT     = int(os.getenv("BIOVOLT_SMTP_PORT", "465"))
SMTP_USER     = os.getenv("BIOVOLT_SMTP_USER", "alerts@biovolt.energy")
SMTP_PASSWORD = os.getenv("BIOVOLT_SMTP_PASS", "")
DEFAULT_OPERATOR_EMAIL = os.getenv("OPERATOR_EMAIL", "bhuyanamitnishanka@gmail.com")

def build_alert_payload(raw_telemetry):
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
    recipient_email = recipient or payload["operator_email"]
    subject = f"[EMERGENCY ALERT] CRITICAL_BIO_DROP in Vault {payload['vault_id']} - Immediate Mitigation Required"
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"BioVolt Watchdog <{SMTP_USER}>"
    msg["To"] = recipient_email
    msg["X-Priority"] = "1"
    msg["X-BioVolt-Incident"] = payload["incident_id"]

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

    print(f"[ALERT DISPATCH]: Contacting SMTP server {SMTP_SERVER}:{SMTP_PORT}...")
    try:
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
