/**
 * Project BioVolt: Recharts Electrochemical Visualization Component
 * Dual-Panel High-Resolution Technical Charting for 24-Hour Battery Voltage, SoC, and SOFC Burns
 */

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
  CartesianGrid,
} from 'recharts';
import { SimulationStepResult, BatteryParameters } from '../types/biovolt';
import { Zap, Activity, Flame, ShieldAlert } from 'lucide-react';

interface RechartsBatteryCurvesProps {
  data: SimulationStepResult[];
  params: BatteryParameters;
  simHours: number;
}

export const RechartsBatteryCurves: React.FC<RechartsBatteryCurvesProps> = ({
  data,
  params,
  simHours,
}) => {
  // Format data for Recharts
  const chartData = data.map((d) => ({
    hour: d.timeHours,
    formattedTime: d.timeFormatted,
    vCell: d.vCell,
    socPercent: d.socPercent,
    inputCurrent: d.iTotalIn,
    iBio: d.iBio,
    iSofc: d.iSofc,
    qCapacitive: d.qCapacitive,
    temperatureC: d.temperatureC,
    isSofcActive: d.isSofcActive,
  }));

  const gassingCeiling = params.chemistry === 'lifepo4' ? 3.65 : 2.45;
  const vMin = params.chemistry === 'lifepo4' ? 2.8 : 1.75;
  const vMax = params.chemistry === 'lifepo4' ? 3.75 : 2.52;

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-[#0B0F19]/95 border border-slate-700 p-3 rounded shadow-2xl text-xs font-mono text-slate-200 backdrop-blur-md">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-slate-400">
            <span className="text-amber-400 font-semibold">T+{p.formattedTime} ({p.hour}h)</span>
            <span className="text-[11px]">{p.temperatureC}°C Vault</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-cyan-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Cell Voltage:
              </span>
              <span className="font-bold text-white tabular-nums">{p.vCell.toFixed(3)} V</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Lead-Core SoC:
              </span>
              <span className="font-bold text-white tabular-nums">{p.socPercent.toFixed(1)}%</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Input Current:
              </span>
              <span className="font-bold text-white tabular-nums">{p.inputCurrent.toFixed(2)} A</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-purple-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Capacitor Buffer (Q):
              </span>
              <span className="font-bold text-white tabular-nums">{p.qCapacitive.toFixed(0)} C</span>
            </div>

            {p.isSofcActive && (
              <div className="pt-1 mt-1 border-t border-amber-500/30 text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                <Flame className="w-3 h-3" />
                <span>SOFC BIO-GAS BURN ENGAGED ({params.iSofc}A)</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-5 p-5 bg-[#0D121D] border border-slate-800 rounded-lg">
      {/* Title & Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wide">
              RECHARTS DUAL-AXIS PERFORMANCE CURVES // 24-HOUR PROFILE
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Observing how the Lead-Carbon double-layer buffer cushions high-burst SOFC current without spiking voltage
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-amber-500/20 border border-amber-500/60 rounded" />
            <span>SOFC Burn (Cycle 1 &amp; 2)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500" />
            <span>Gassing Limit ({gassingCeiling}V)</span>
          </div>
        </div>
      </div>

      {/* Plot 1: Voltage Curve & Total Input Current */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300 px-2">
          <span className="font-bold text-cyan-400 flex items-center gap-1.5">
            <span className="w-2.5 h-1 bg-cyan-400 rounded-full" />
            PLOT 1: DYNAMIC CELL VOLTAGE (V) &amp; INPUT CURRENT (A)
          </span>
          <span className="text-[11px] text-slate-500">Left: Voltage (1.8V - 2.5V) · Right: Current (A)</span>
        </div>

        <div className="h-64 w-full bg-[#070A10] rounded border border-slate-800/80 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 15, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />

              <XAxis
                dataKey="hour"
                stroke="#64748B"
                fontSize={10}
                fontFamily="monospace"
                tickFormatter={(v) => `T+${Math.floor(v)}h`}
                domain={[0, simHours]}
              />

              {/* Left Y Axis: Cell Voltage */}
              <YAxis
                yAxisId="left"
                stroke="#06B6D4"
                fontSize={10}
                fontFamily="monospace"
                domain={[vMin, vMax]}
                tickFormatter={(v) => `${v.toFixed(2)}V`}
                width={50}
              />

              {/* Right Y Axis: Input Current */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#F59E0B"
                fontSize={10}
                fontFamily="monospace"
                domain={[0, Math.max(60, params.iSofc + 10)]}
                tickFormatter={(v) => `${v.toFixed(0)}A`}
                width={45}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Gassing Ceiling Reference Line */}
              <ReferenceLine
                yAxisId="left"
                y={gassingCeiling}
                stroke="#EF4444"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Gassing Ceiling ${gassingCeiling}V`,
                  fill: '#EF4444',
                  fontSize: 10,
                  fontFamily: 'monospace',
                  position: 'insideTopRight',
                }}
              />

              {/* Highlight SOFC Burn Zones */}
              {params.sofcBurnMode === 'dual' ? (
                <>
                  <ReferenceArea
                    yAxisId="left"
                    x1={6.0}
                    x2={6.333}
                    fill="#F59E0B"
                    fillOpacity={0.12}
                    label={{ value: 'SOFC BURN #1', fill: '#F59E0B', fontSize: 9, fontFamily: 'monospace', position: 'top' }}
                  />
                  <ReferenceArea
                    yAxisId="left"
                    x1={18.0}
                    x2={18.333}
                    fill="#F59E0B"
                    fillOpacity={0.12}
                    label={{ value: 'SOFC BURN #2', fill: '#F59E0B', fontSize: 9, fontFamily: 'monospace', position: 'top' }}
                  />
                </>
              ) : (
                <ReferenceArea
                  yAxisId="left"
                  x1={params.sofcBurnStartMin / 60}
                  x2={(params.sofcBurnStartMin + params.sofcBurnDurationMin) / 60}
                  fill="#F59E0B"
                  fillOpacity={0.12}
                  label={{ value: 'SOFC BURN', fill: '#F59E0B', fontSize: 9, fontFamily: 'monospace', position: 'top' }}
                />
              )}

              {/* Input Current Shaded Area on Right Axis */}
              <Area
                yAxisId="right"
                type="stepAfter"
                dataKey="inputCurrent"
                name="Total Input Current"
                fill="#F59E0B"
                fillOpacity={0.18}
                stroke="#F59E0B"
                strokeWidth={1}
                dot={false}
              />

              {/* Dynamic Cell Voltage Line on Left Axis */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="vCell"
                name="Dynamic Cell Voltage"
                stroke="#06B6D4"
                strokeWidth={2.4}
                dot={false}
                activeDot={{ r: 5, fill: '#06B6D4', stroke: '#FFFFFF' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plot 2: Faradaic Lead-Core SoC (%) & Capacitive Stored Coulombs */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300 px-2">
          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2.5 h-1 bg-emerald-400 rounded-full" />
            PLOT 2: FARADAIC STATE OF CHARGE (%) &amp; CAPACITIVE STORED CHARGE (Q)
          </span>
          <span className="text-[11px] text-slate-500">Left: SoC (0% - 100%) · Right: Coulombs (C)</span>
        </div>

        <div className="h-64 w-full bg-[#070A10] rounded border border-slate-800/80 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 15, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />

              <XAxis
                dataKey="hour"
                stroke="#64748B"
                fontSize={10}
                fontFamily="monospace"
                tickFormatter={(v) => `T+${Math.floor(v)}h`}
                domain={[0, simHours]}
              />

              {/* Left Y Axis: SoC % */}
              <YAxis
                yAxisId="left"
                stroke="#10B981"
                fontSize={10}
                fontFamily="monospace"
                domain={[0, 100]}
                tickFormatter={(v) => `${v.toFixed(0)}%`}
                width={50}
              />

              {/* Right Y Axis: Q Capacitive */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#A855F7"
                fontSize={10}
                fontFamily="monospace"
                domain={[0, 'auto']}
                tickFormatter={(v) => `${v.toFixed(0)}C`}
                width={50}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Capacitive Stored Charge Line on Right Axis */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="qCapacitive"
                name="Capacitor Stored Charge (Q)"
                stroke="#A855F7"
                strokeWidth={1.5}
                strokeDasharray="4 2"
                dot={false}
              />

              {/* Faradaic SoC Line on Left Axis */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="socPercent"
                name="Faradaic State of Charge"
                stroke="#10B981"
                strokeWidth={2.6}
                dot={false}
                activeDot={{ r: 5, fill: '#10B981', stroke: '#FFFFFF' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
