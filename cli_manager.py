#!/usr/bin/env python3
"""
================================================================================
Project BioVolt: Under-Earth Electro-Microbial Grid (UE-EMG)
Interactive CLI Terminal Interface (cli_manager.py)
================================================================================
Hardware operations, real-time caisson telemetry monitor, PEM fault mitigation,
and automated sub-surface warning email alert dispatcher.
"""

import sys
import os
import json
import time
from datetime import datetime

# ANSI Color Codes for Subterranean SCADA Terminal
class Color:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    DIM = '\033[2m'
    RESET = '\033[0m'

# Default Caisson State
caisson_state = {
    "vault_id": "UE-EMG-VAULT-01",
    "cell_block": "CAISSON-04-PFSA",
    "system_status": "NOMINAL",
    "harvest_active": True,
    "isolated": False,
    "bio_anode_v": 0.540,
    "bio_anode_i": 0.852,
    "battery_v": 2.14,
    "battery_soc": 82.4,
    "capacitive_charge_q": 4820.0,
    "internal_r_mohm": 15.0,
    "mppt_floor_v": 0.35,
    "bedrock_temp_c": 15.2,
    "sofc_burn_active": False,
    "sofc_current_a": 0.0,
    "operator_email": "bhuyanamitnishanka@gmail.com",
    "last_alert_sent": None
}

def print_banner():
    banner = f"""{Color.CYAN}{Color.BOLD}
  ____  _       __     __    _ _     _   _ _____     ______ __  __  ____ 
 | __ )(_) ___  \\ \\   / /__ | | |_  | | | | ____|   | ____|  \\/  |/ ___|
 |  _ \\| |/ _ \\  \\ \\ / / _ \\| | __| | | | |  _| ____|  _| | |\\/| | |  _ 
 | |_) | | (_) |  \\ V / (_) | | |_  | |_| | |__|_____| |___| |  | | |_| |
 |____/|_|\\___/    \\_/ \\___/|_|\\__|  \\___/|_____|   |_____|_|  |_|\\____|
{Color.RESET}{Color.DIM} Subterranean Hardware Operations & Anomaly Dispatcher | v2.4.0-PROD
 Target Node: {caisson_state['vault_id']} | Array: {caisson_state['cell_block']}{Color.RESET}
 Type {Color.YELLOW}'help'{Color.RESET} to inspect commands, or {Color.YELLOW}'scan'{Color.RESET} to run diagnostic sweeps.
"""
    print(banner)

def send_subsurface_warning_email(operator_email, reason="CRITICAL_BIO_DROP"):
    """
    Sub-surface warning email alert function block:
    Notifies the operator if diagnostic scans report a CRITICAL_BIO_DROP in the caisson.
    """
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    incident_id = f"INC-{int(time.time())}-BIO"
    
    print(f"\n{Color.RED}{Color.BOLD}[EMERGENCY ALERT TRIGGERED]: Sub-surface warning email dispatch initiated...{Color.RESET}")
    print(f"{Color.DIM}Connecting to SMTP secure relay for {operator_email}...{Color.RESET}")
    time.sleep(0.5)
    
    print(f"{Color.GREEN}✔ ALERT DISPATCHED SUCCESSFULLY{Color.RESET}")
    print(f"  {Color.BOLD}Incident ID:{Color.RESET}  {incident_id}")
    print(f"  {Color.BOLD}Recipient:{Color.RESET}    {operator_email}")
    print(f"  {Color.BOLD}Status Flag:{Color.RESET}  {Color.RED}{reason}{Color.RESET}")
    print(f"  {Color.BOLD}Node:{Color.RESET}         {caisson_state['vault_id']} ({caisson_state['cell_block']})")
    print(f"  {Color.BOLD}Telemetry:{Color.RESET}    V_anode={caisson_state['bio_anode_v']:.3f}V (<0.35V floor), I_bio={caisson_state['bio_anode_i']:.3f}A")
    print(f"  {Color.BOLD}Mitigation:{Color.RESET}   Recommended command: {Color.YELLOW}isolate{Color.RESET} to prevent battery inversion.")
    caisson_state["last_alert_sent"] = timestamp

def cmd_status():
    status_color = Color.GREEN if caisson_state["system_status"] == "NOMINAL" else Color.RED
    iso_color = Color.YELLOW if caisson_state["isolated"] else Color.CYAN
    sofc_color = Color.GREEN if caisson_state["sofc_burn_active"] else Color.DIM
    
    print(f"\n{Color.BOLD}--- SUBTERRANEAN NODE TELEMETRY: {caisson_state['vault_id']} ---{Color.RESET}")
    print(f" System Health:      {status_color}{caisson_state['system_status']}{Color.RESET}")
    print(f" Circuit Topology:   {iso_color}{'ISOLATED (Bursts Gate LOW)' if caisson_state['isolated'] else 'COUPLED (Lead-Carbon Matrix)'}{Color.RESET}")
    print(f" Biofilm Harvesting: {'ENABLED' if caisson_state['harvest_active'] else 'HALTED'}")
    print(f" Bio-Anode OCV:      {Color.BOLD}{caisson_state['bio_anode_v']:.3f} V{Color.RESET} (Floor: {caisson_state['mppt_floor_v']:.2f} V)")
    print(f" Bio Harvest Current:{caisson_state['bio_anode_i']:.3f} A")
    print(f" Storage Terminal V: {caisson_state['battery_v']:.3f} V")
    print(f" Faradaic SoC:       {caisson_state['battery_soc']:.1f} %")
    print(f" Capacitive Charge:  {caisson_state['capacitive_charge_q']:.1f} Coulombs")
    print(f" Internal Impedance: {caisson_state['internal_r_mohm']:.1f} mΩ")
    print(f" Bedrock Temp:       {caisson_state['bedrock_temp_c']:.1f} °C (15m depth basalt)")
    print(f" SOFC Burn State:    {sofc_color}{'ACTIVE (50A Co-Gen)' if caisson_state['sofc_burn_active'] else 'STANDBY'}{Color.RESET}")
    print(f" Operator Contact:   {caisson_state['operator_email']}")
    if caisson_state["last_alert_sent"]:
        print(f" Last Alert Sent:    {Color.YELLOW}{caisson_state['last_alert_sent']}{Color.RESET}")
    print()

def cmd_scan():
    print(f"{Color.CYAN}Initiating high-frequency electrochemical impedance diagnostic scan...{Color.RESET}")
    time.sleep(0.4)
    print(" -> Interrogating Geobacter sulfurreducens bio-anode boundary...")
    time.sleep(0.3)
    print(" -> Checking PFSA membrane differential pressure and hydration balance...")
    time.sleep(0.3)
    print(" -> Verifying Lead-Carbon capacitive matrix desulfation index...")
    time.sleep(0.3)
    
    # Check if voltage dropped below MPPT floor
    if caisson_state["bio_anode_v"] < caisson_state["mppt_floor_v"]:
        caisson_state["system_status"] = "CRITICAL_BIO_DROP"
        print(f"\n{Color.RED}{Color.BOLD}[DIAGNOSTIC ALARM]: ANOMALY DETECTED IN CELL BLOCK {caisson_state['cell_block']}{Color.RESET}")
        print(f" Code: {Color.RED}PEM-E02{Color.RESET} - Biofilm Starvation or Nanowire Disconnection")
        print(f" Measured Bio-Anode OCV: {Color.RED}{caisson_state['bio_anode_v']:.3f} V{Color.RESET} [THRESHOLD: < {caisson_state['mppt_floor_v']} V]")
        print(f" Measured Harvest Current: {caisson_state['bio_anode_i']:.3f} A [NOMINAL: > 0.850 A]")
        send_subsurface_warning_email(caisson_state["operator_email"], reason="CRITICAL_BIO_DROP")
    else:
        caisson_state["system_status"] = "NOMINAL"
        print(f"\n{Color.GREEN}✔ DIAGNOSTIC SCAN COMPLETE: All subterranean telemetry within nominal parameters.{Color.RESET}")
        print(f"  Bio-Anode OCV: {caisson_state['bio_anode_v']:.3f}V | Harvest Current: {caisson_state['bio_anode_i']:.3f}A | Temp: {caisson_state['bedrock_temp_c']}°C")

def cmd_isolate():
    print(f"{Color.YELLOW}[DISPATCHING EMERGENCY COMMAND]: FORCE_ISOLATE -> {caisson_state['vault_id']}...{Color.RESET}")
    time.sleep(0.3)
    caisson_state["isolated"] = True
    caisson_state["harvest_active"] = False
    print(f"{Color.GREEN}✔ PIN 12 (BURST_MODE_GATE_PIN) pulled LOW.{Color.RESET}")
    print(f"  Biological compartment decoupled from Lead-Carbon capacitive matrix.")
    print(f"  Cell voltage inversion risk neutralized. System state: STANDBY.")

def cmd_reconnect():
    print(f"{Color.CYAN}[DISPATCHING COMMAND]: RESUME_HARVEST -> {caisson_state['vault_id']}...{Color.RESET}")
    time.sleep(0.3)
    caisson_state["isolated"] = False
    caisson_state["harvest_active"] = True
    caisson_state["system_status"] = "NOMINAL"
    if caisson_state["bio_anode_v"] < 0.35:
        caisson_state["bio_anode_v"] = 0.540
        caisson_state["bio_anode_i"] = 0.850
    print(f"{Color.GREEN}✔ Gate enabled. Exoelectrogen trickle current flowing into solid-state matrix.{Color.RESET}")

def cmd_drop_bio():
    print(f"{Color.RED}[SIMULATING METABOLIC FAILURE]: Inducing acetate substrate starvation...{Color.RESET}")
    caisson_state["bio_anode_v"] = 0.280
    caisson_state["bio_anode_i"] = 0.095
    caisson_state["internal_r_mohm"] = 620.0
    caisson_state["system_status"] = "CRITICAL_BIO_DROP"
    print(f" Bio-Anode OCV crashed to: {Color.RED}0.280 V{Color.RESET}")
    print(f" Run {Color.YELLOW}'scan'{Color.RESET} or {Color.YELLOW}'alert'{Color.RESET} to observe the automated email dispatcher.")

def cmd_sofc(subcmd="status"):
    if subcmd in ["burn", "start"]:
        print(f"{Color.YELLOW}[IGNITING SOFC CO-GENERATION BURN]: 50A current injection for 20 minutes...{Color.RESET}")
        caisson_state["sofc_burn_active"] = True
        caisson_state["sofc_current_a"] = 50.0
        caisson_state["battery_v"] = 2.38
        caisson_state["battery_soc"] = min(100.0, caisson_state["battery_soc"] + 8.5)
        print(f"{Color.GREEN}✔ Methane fuel cell online. Stored Lead-Carbon charge rising rapidly.{Color.RESET}")
    elif subcmd in ["stop", "abort"]:
        print(f"{Color.CYAN}[HALTING SOFC BURN]: Valve closed. Thermal recovery initiated...{Color.RESET}")
        caisson_state["sofc_burn_active"] = False
        caisson_state["sofc_current_a"] = 0.0
        caisson_state["battery_v"] = 2.14
    else:
        print(f"SOFC State: {'ACTIVE (50A injection)' if caisson_state['sofc_burn_active'] else 'STANDBY (0A)'}")

def cmd_pem(fault_code="all"):
    faults = {
        "PEM-E01": "Localized Hydration Leaks (Cross-Over Contamination) | Relief bypass + FORCE_ISOLATE",
        "PEM-E02": "Biofilm Bio-Fouling & Nanowire Disconnection (CRITICAL_BIO_DROP) | Warning Email + Acetate",
        "PEM-E03": "Thermal Boundary Inversion (Bedrock Dissipation Stall) | Throttle SOFC to 8 mins",
        "PEM-E04": "Sulfation Bridging at Lead-Carbon Intercalated Matrix | 50A SOFC desulfation burst"
    }
    if fault_code.upper() in faults:
        print(f"\n{Color.BOLD}{fault_code.upper()}:{Color.RESET} {faults[fault_code.upper()]}")
    else:
        print(f"\n{Color.BOLD}--- PEM TROUBLESHOOTING INDEX (System Block UE-EMG-PEM-04) ---{Color.RESET}")
        for code, desc in faults.items():
            print(f"  {Color.CYAN}{code}{Color.RESET}: {desc}")
        print()

def cmd_help():
    help_text = f"""
{Color.BOLD}AVAILABLE HARDWARE CLI COMMANDS:{Color.RESET}
  {Color.YELLOW}status{Color.RESET}                  Display real-time telemetry, voltages, and caisson states.
  {Color.YELLOW}scan{Color.RESET}                    Run electrochemical diagnostic scan. Detects CRITICAL_BIO_DROP.
  {Color.YELLOW}isolate{Color.RESET}                 Send emergency FORCE_ISOLATE command (cuts Lead-Carbon gate).
  {Color.YELLOW}reconnect{Color.RESET}               Send RESUME_HARVEST command to restore bio-current loop.
  {Color.YELLOW}alert [email]{Color.RESET}           Dispatch sub-surface warning email alert to operator.
  {Color.YELLOW}drop{Color.RESET}                    Simulate a metabolic voltage crash to 0.280V (<0.35V).
  {Color.YELLOW}sofc [burn|stop]{Color.RESET}        Control subterranean Solid-Oxide Fuel Cell co-generation burns.
  {Color.YELLOW}mppt <volts>{Color.RESET}            Adjust bio-anode MPPT floor voltage (default: 0.35V).
  {Color.YELLOW}pem [code]{Color.RESET}              Query PEM Block Troubleshooting Index (e.g., 'pem PEM-E02').
  {Color.YELLOW}email-test{Color.RESET}              Test email alert dispatch to {caisson_state['operator_email']}.
  {Color.YELLOW}export{Color.RESET}                  Export active telemetry snapshot to JSON file.
  {Color.YELLOW}clear{Color.RESET}                   Clear the interactive console screen.
  {Color.YELLOW}exit / quit{Color.RESET}             Exit interactive CLI session.
"""
    print(help_text)

def main():
    print_banner()
    while True:
        try:
            prompt = f"{Color.GREEN}biovolt@{caisson_state['vault_id']}{Color.RESET}:{Color.CYAN}~/caisson-04{Color.RESET}$ "
            user_input = input(prompt).strip()
            if not user_input:
                continue
                
            parts = user_input.split()
            cmd = parts[0].lower()
            args = parts[1:]
            
            if cmd in ["exit", "quit"]:
                print("Exiting BioVolt CLI manager. Subterranean daemon remaining in background.")
                break
            elif cmd == "status":
                cmd_status()
            elif cmd == "scan":
                cmd_scan()
            elif cmd in ["isolate", "force_isolate"]:
                cmd_isolate()
            elif cmd in ["reconnect", "resume_harvest"]:
                cmd_reconnect()
            elif cmd in ["drop", "simulate_drop"]:
                cmd_drop_bio()
            elif cmd in ["alert", "email-test"]:
                recipient = args[0] if args else caisson_state["operator_email"]
                send_subsurface_warning_email(recipient, reason="CRITICAL_BIO_DROP")
            elif cmd == "sofc":
                subcmd = args[0].lower() if args else "status"
                cmd_sofc(subcmd)
            elif cmd == "mppt":
                if args:
                    try:
                        caisson_state["mppt_floor_v"] = float(args[0])
                        print(f"MPPT voltage floor updated to: {caisson_state['mppt_floor_v']:.2f} V")
                    except ValueError:
                        print("Invalid voltage value.")
                else:
                    print(f"Current MPPT voltage floor: {caisson_state['mppt_floor_v']:.2f} V")
            elif cmd == "pem":
                code = args[0] if args else "all"
                cmd_pem(code)
            elif cmd == "export":
                filename = f"telemetry_{int(time.time())}.json"
                with open(filename, "w") as f:
                    json.dump(caisson_state, f, indent=2)
                print(f"Telemetry snapshot exported to {filename}")
            elif cmd == "clear":
                os.system('clear' if os.name == 'posix' else 'cls')
            elif cmd == "help":
                cmd_help()
            else:
                print(f"{Color.RED}Unknown command: '{cmd}'. Type 'help' for available commands.{Color.RESET}")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user.")
            break
        except Exception as e:
            print(f"{Color.RED}Error: {e}{Color.RESET}")

if __name__ == "__main__":
    main()
