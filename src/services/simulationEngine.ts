/**
 * Project BioVolt: Electrochemical Simulation Engine
 * Translates and extends the Python mathematical model of the Lead-Carbon Bio-Battery (EMHC)
 */

import { BatteryParameters, SimulationStepResult, StorageChemistry } from '../types/biovolt';

export class BioVoltSimulator {
  private params: BatteryParameters;
  private vCell: number;
  private socFaradaic: number;
  private qCapacitive: number;
  private accumulatedWh: number;

  // Biological Temperature Constants (simulator_v2.py)
  private readonly tOpt = 35.0; // Optimal biological temperature (°C)
  private readonly tMax = 45.0; // Upper thermal death limit (°C)
  private readonly tMin = 4.0;  // Lower metabolic freezing limit (°C)
  private readonly iBase35C = 1.2; // Reference current at 35°C (Amps)

  constructor(params: BatteryParameters) {
    this.params = { ...params };
    this.socFaradaic = 0.20; // 20% initial Faradaic SoC
    this.qCapacitive = 0.0;
    this.accumulatedWh = 0.0;
    this.vCell = this.computeInitialVoltage();
  }

  private computeInitialVoltage(): number {
    if (this.params.chemistry === 'lifepo4') {
      return 3.10;
    }
    return 1.80; // Lead-Carbon initial resting voltage
  }

  /**
   * Calculates biological current scaling multiplier based on Arrhenius asymmetric bell curve
   */
  public calculateMetabolicFactor(tempC: number): number {
    if (tempC <= this.tMin || tempC >= this.tMax) {
      return 0.0;
    }
    const numerator = (tempC - this.tMin) * (this.tMax - tempC);
    const denominator = (this.tOpt - this.tMin) * (this.tMax - this.tOpt);
    return Math.max(0.0, numerator / denominator);
  }

  public reset(params?: BatteryParameters) {
    if (params) {
      this.params = { ...params };
    }
    this.socFaradaic = 0.20;
    this.qCapacitive = 0.0;
    this.accumulatedWh = 0.0;
    this.vCell = this.computeInitialVoltage();
  }

  public step(timeSec: number, dtSeconds: number): SimulationStepResult {
    const minuteOfDay = (timeSec / 60) % (24 * 60);
    const hourOfDay = (timeSec / 3600) % 24;

    // Subterranean Temperature & Compost Spike Simulation
    let currentTempC = this.params.ambientTempC;
    if (this.params.simulateNoonCompostSpike && hourOfDay >= 12.0 && hourOfDay <= 14.0) {
      currentTempC = 35.0; // Thermal spike due to fresh raw compost dumping
    }

    // 1. Determine active inputs and SOFC burns
    let isSofcActive = false;
    if (this.params.sofcBurnMode === 'dual') {
      // Cycle 1: Hour 6:00 (for 20 min) | Cycle 2: Hour 18:00 (for 20 min) (plot_simulation.py)
      const burn1 = hourOfDay >= 6.0 && hourOfDay <= 6.333;
      const burn2 = hourOfDay >= 18.0 && hourOfDay <= 18.333;
      isSofcActive = burn1 || burn2;
    } else {
      isSofcActive =
        minuteOfDay >= this.params.sofcBurnStartMin &&
        minuteOfDay < (this.params.sofcBurnStartMin + this.params.sofcBurnDurationMin);
    }

    const isLoadActive =
      this.params.loadBurstA > 0 &&
      minuteOfDay >= this.params.loadBurstStartMin &&
      minuteOfDay < (this.params.loadBurstStartMin + this.params.loadBurstDurationMin);

    // Calculate bio-anode current (Arrhenius vs constant)
    let iBio = this.params.iBioAnode;
    if (this.params.enableArrhenius) {
      const bioMultiplier = this.calculateMetabolicFactor(currentTempC);
      iBio = this.iBase35C * bioMultiplier;
    }

    const iSofc = isSofcActive ? this.params.iSofc : 0.0;
    const iLoad = isLoadActive ? this.params.loadBurstA : 0.0;

    const iTotalIn = iBio + iSofc;
    const iNet = iTotalIn - iLoad;

    // 2. Capacitive matrix instantaneous capture/release (fast double layer)
    const deltaQ = iNet * dtSeconds;
    this.qCapacitive = Math.max(0.0, this.qCapacitive + deltaQ);
    const vCapContribution = this.qCapacitive / this.params.cCapacitive;

    // 3. Charge transfer from Capacitive Matrix to Faradaic Core
    let chargeTransferRate = 0.0;
    const maxVoltageLimit = this.params.chemistry === 'lifepo4' ? 3.65 : 2.45;
    const nominalCeiling = this.params.chemistry === 'lifepo4' ? 3.60 : 2.40;

    if (this.vCell < nominalCeiling && this.qCapacitive > 0) {
      // Temperature compensation
      const tempFactor = 1.0 + (currentTempC - 15) * 0.015;
      const transferCoeff = this.params.chemistry === 'lifepo4' ? 0.08 : 0.06;
      chargeTransferRate = transferCoeff * (vCapContribution + 0.1) * tempFactor;

      const chargeTransfer = Math.min(this.qCapacitive, chargeTransferRate * dtSeconds);

      // Convert Coulombs to Ampere-hours for Faradaic core
      const ahTransfer = chargeTransfer / 3600.0;
      this.socFaradaic = Math.min(1.0, this.socFaradaic + (ahTransfer / this.params.maxFaradaicAh));

      // Deduct from capacitive reserve
      this.qCapacitive = Math.max(0.0, this.qCapacitive - chargeTransfer);
    } else if (iNet < 0 && this.qCapacitive <= 0.1 && this.socFaradaic > 0.05) {
      // Discharge pulls directly from Faradaic core when capacitor is drained
      const ahDrained = (Math.abs(iNet) * dtSeconds) / 3600.0;
      this.socFaradaic = Math.max(0.0, this.socFaradaic - (ahDrained / this.params.maxFaradaicAh));
    }

    // 4. Recalculate dynamic cell voltage
    if (this.params.chemistry === 'lifepo4') {
      const baseV = 3.0 + 0.35 * Math.pow(this.socFaradaic, 0.4);
      this.vCell = baseV + (this.qCapacitive / this.params.cCapacitive) + (iNet * this.params.rInternal);
    } else {
      // Lead-Carbon model: V_cell = 1.9 + (0.4 * soc) + (q_cap / C_cap) + (IR)
      this.vCell = 1.9 + (0.4 * this.socFaradaic) + (this.qCapacitive / this.params.cCapacitive);
      this.vCell += iNet * this.params.rInternal;
    }

    // Voltage clamping at gassing/safety limit
    this.vCell = Math.min(maxVoltageLimit, Math.max(1.5, this.vCell));

    // Power and energy accounting
    const powerNetW = this.vCell * iNet;
    if (powerNetW > 0) {
      this.accumulatedWh += (powerNetW * dtSeconds) / 3600.0;
    }

    const hours = Math.floor(timeSec / 3600);
    const minutes = Math.floor((timeSec % 3600) / 60);
    const seconds = Math.floor(timeSec % 60);
    const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const timeHours = Number((timeSec / 3600).toFixed(2));

    return {
      step: Math.floor(timeSec / dtSeconds),
      timestampSec: timeSec,
      timeHours,
      timeFormatted,
      vCell: Number(this.vCell.toFixed(4)),
      socFaradaic: Number(this.socFaradaic.toFixed(4)),
      socPercent: Number((this.socFaradaic * 100).toFixed(2)),
      qCapacitive: Number(this.qCapacitive.toFixed(2)),
      vCapContribution: Number(vCapContribution.toFixed(4)),
      iBio: Number(iBio.toFixed(3)),
      iSofc,
      iLoad,
      iTotalIn: Number(iTotalIn.toFixed(3)),
      temperatureC: Number(currentTempC.toFixed(1)),
      powerNetW: Number(powerNetW.toFixed(2)),
      accumulatedWh: Number(this.accumulatedWh.toFixed(2)),
      chargeTransferRate: Number(chargeTransferRate.toFixed(4)),
      isSofcActive,
      isLoadActive,
    };
  }
}

/**
 * Runs a full simulation over a specified number of hours and returns sample points for charts
 */
export function runSimulationBatch(
  params: BatteryParameters,
  totalHours: number = 24,
  samplePoints: number = 240
): SimulationStepResult[] {
  const sim = new BioVoltSimulator(params);
  const totalSeconds = totalHours * 3600;
  const dt = 1.0; // 1 second physics step
  const sampleInterval = Math.max(1, Math.floor(totalSeconds / samplePoints));

  const results: SimulationStepResult[] = [];

  for (let sec = 0; sec <= totalSeconds; sec += dt) {
    const stepResult = sim.step(sec, dt);
    if (sec % sampleInterval === 0 || sec === totalSeconds) {
      results.push(stepResult);
    }
  }

  return results;
}

/**
 * Generates plot_simulation.py matching user's exact specification
 */
export function generatePlotSimulationScript(params: BatteryParameters): string {
  return `"""
BioVolt UE-EMG: Simulation Plotting Engine
Generates high-resolution performance curves for the Lead-Carbon Hybrid Matrix.
Integrates dual SOFC burn cycles (Hour 6 and Hour 18).
"""
import numpy as np
import matplotlib.pyplot as plt

class LeadCarbonBioBattery:
    def __init__(self):
        self.C_capacitive = ${params.cCapacitive}.0   # Double-layer capacitance of carbon matrix (Farads)
        self.Max_Faradaic_Ah = ${params.maxFaradaicAh}.0 # Capacity of lead-acid core (Ampere-hours)
        self.R_internal = ${params.rInternal}      # Internal resistance (Ohms)
        self.v_cell = 1.8            # Initial cell voltage (Volts)
        self.soc_faradaic = 0.20     # Initial Faradaic State of Charge (20%)
        self.q_capacitive = 0.0      # Initial stored capacitive charge (Coulombs)
        
    def step_simulation(self, i_bio_anode, i_sofc, dt_seconds):
        i_total_in = i_bio_anode + i_sofc
        delta_q = i_total_in * dt_seconds
        self.q_capacitive += delta_q
        v_cap_contribution = self.q_capacitive / self.C_capacitive
        
        if self.v_cell < 2.45 and self.q_capacitive > 0:
            transfer_rate = 0.06 * (v_cap_contribution + 0.1)
            charge_transfer = min(self.q_capacitive, transfer_rate * dt_seconds)
            ah_transfer = charge_transfer / 3600.0
            self.soc_faradaic = min(1.0, self.soc_faradaic + (ah_transfer / self.Max_Faradaic_Ah))
            self.q_capacitive = max(0.0, self.q_capacitive - charge_transfer)
            
        self.v_cell = 1.9 + (0.4 * self.soc_faradaic) + (self.q_capacitive / self.C_capacitive)
        self.v_cell += i_total_in * self.R_internal
        self.v_cell = min(2.45, self.v_cell)
        return self.v_cell, self.soc_faradaic, self.q_capacitive

def run_and_plot_simulation():
    sim_hours = 24
    dt = 1.0  # 1-second intervals
    total_steps = int((sim_hours * 3600) / dt)
    battery = LeadCarbonBioBattery()
    
    time_hours = np.linspace(0, sim_hours, total_steps)
    voltage_log = np.zeros(total_steps)
    soc_log = np.zeros(total_steps)
    input_current_log = np.zeros(total_steps)
    
    i_bio = ${params.iBioAnode}
    
    print("Running electrochemical simulation loop with SOFC burns...")
    for step in range(total_steps):
        hour_now = step / 3600.0
        # Cycle 1: Hour 6 (for 20 mins) | Cycle 2: Hour 18 (for 20 mins)
        if (6.0 <= hour_now <= 6.33) or (18.0 <= hour_now <= 18.33):
            i_sofc = ${params.iSofc}.0
        else:
            i_sofc = 0.0
            
        battery.step_simulation(i_bio, i_sofc, dt)
        voltage_log[step] = battery.v_cell
        soc_log[step] = battery.soc_faradaic * 100.0
        input_current_log[step] = i_bio + i_sofc

    plt.style.use('seaborn-v0_8-darkgrid' if 'seaborn-v0_8-darkgrid' in plt.style.available else 'default')
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 7), sharex=True)
    fig.suptitle('Project BioVolt: Under-Earth Hybrid Cell Dynamic Performance', fontsize=14, fontweight='bold')

    # Plot 1: Voltage Curve & Total Input Current
    color = '#1f77b4'
    ax1.set_ylabel('Cell Voltage (V)', color=color, fontweight='bold')
    ax1.plot(time_hours, voltage_log, color=color, linewidth=2, label='Dynamic Cell Voltage')
    ax1.tick_params(axis='y', labelcolor=color)
    ax1.set_ylim(1.8, 2.5)

    ax1_twin = ax1.twinx()
    color = '#ff7f0e'
    ax1_twin.set_ylabel('Total Input Current (A)', color=color, fontweight='bold')
    ax1_twin.fill_between(time_hours, input_current_log, color=color, alpha=0.15, label='SOFC + Bio Charge Input')
    ax1_twin.plot(time_hours, input_current_log, color=color, linewidth=1, alpha=0.7)
    ax1_twin.tick_params(axis='y', labelcolor=color)
    ax1.grid(False)

    # Plot 2: Faradaic Lead Core SoC
    color = '#2ca02c'
    ax2.set_xlabel('Simulation Timeline (Hours)', fontweight='bold')
    ax2.set_ylabel('Lead-Core SoC (%)', color=color, fontweight='bold')
    ax2.plot(time_hours, soc_log, color=color, linewidth=2.5, label='Faradaic State of Charge')
    ax2.tick_params(axis='y', labelcolor=color)
    ax2.set_ylim(0, 100)

    ax1.legend(loc='upper left')
    ax2.legend(loc='upper left')
    plt.xlim(0, sim_hours)
    plt.tight_layout()
    plt.savefig('ue_emg_performance_curves.png', dpi=300)
    print("Plot compiled successfully. Asset saved as 'ue_emg_performance_curves.png'.")
    plt.show()

if __name__ == "__main__":
    run_and_plot_simulation()
`;
}

/**
 * Generates simulator_v2.py (Arrhenius temperature-dependent kinetics)
 */
export function generateSimulatorV2Script(): string {
  return `"""
BioVolt UE-EMG: Temperature-Dependent Electrochemical Simulator (v2)
Integrates Arrhenius biological kinetics with Lead-Carbon storage chemistry.
"""
import numpy as np
import matplotlib.pyplot as plt

class BioVoltSystemV2:
    def __init__(self):
        self.C_capacitive = 5000.0   # Double-layer carbon capacitance (F)
        self.Max_Faradaic_Ah = 120.0 # Lead core storage capacity (Ah)
        self.soc_faradaic = 0.20     # Initial SoC (20%)
        self.q_capacitive = 0.0      # Stored capacitive charge (C)
        self.v_cell = 1.8            # Initial Voltage (V)
        
        # Biological Temperature Constants
        self.T_opt = 35.0            # Optimal biological temperature (°C)
        self.T_max = 45.0            # Upper thermal death limit (°C)
        self.T_min = 4.0             # Lower metabolic freezing limit (°C)
        self.I_base_35C = 1.2        # Reference current at 35°C (Amps)

    def calculate_metabolic_factor(self, temp_c):
        if temp_c <= self.T_min or temp_c >= self.T_max:
            return 0.0
        return max(0.0, ((temp_c - self.T_min) * (self.T_max - temp_c)) / ((self.T_opt - self.T_min) * (self.T_max - self.T_opt)))

    def step_simulation(self, temp_c, i_sofc, dt_seconds):
        bio_multiplier = self.calculate_metabolic_factor(temp_c)
        i_bio_anode = self.I_base_35C * bio_multiplier
        i_total_in = i_bio_anode + i_sofc
        self.q_capacitive += i_total_in * dt_seconds
        
        if self.v_cell < 2.45:
            transfer_rate = 0.06 * ((self.q_capacitive / self.C_capacitive) + 0.1)
            charge_transfer = min(self.q_capacitive, transfer_rate * dt_seconds)
            self.soc_faradaic = min(1.0, self.soc_faradaic + ((charge_transfer / 3600.0) / self.Max_Faradaic_Ah))
            self.q_capacitive = max(0.0, self.q_capacitive - charge_transfer)
            
        self.v_cell = 1.9 + (0.4 * self.soc_faradaic) + (self.q_capacitive / self.C_capacitive)
        return i_bio_anode, self.v_cell

if __name__ == "__main__":
    system = BioVoltSystemV2()
    hours = 24
    time_steps = hours * 3600
    temperatures = np.full(time_steps, 15.0) 
    temperatures[12*3600 : 14*3600] = 35.0 # Noon compost thermal spike
    
    bio_current_log = []
    voltage_log = []
    
    for t in range(time_steps):
        i_bio, v_out = system.step_simulation(temperatures[t], 0.0, 1.0)
        bio_current_log.append(i_bio)
        voltage_log.append(v_out)
        
    print(f"Subterranean Simulation Complete.")
    print(f"Max Biological Current Extracted at 35°C Spike: {max(bio_current_log):.3f} A")
    print(f"Stable Sub-Earth Current Extracted at 15°C Ambient: {bio_current_log[0]:.3f} A")
`;
}

