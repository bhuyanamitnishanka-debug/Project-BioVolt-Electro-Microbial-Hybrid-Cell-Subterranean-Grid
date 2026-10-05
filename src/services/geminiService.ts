/**
 * Project BioVolt: Gemini API Service
 * Multimodal scene prompt refinement & electrochemical engineering analysis
 */

import { GoogleGenAI } from '@google/genai';

export async function generateBioVoltAnalysis(
  topic: string,
  contextData: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
  
  if (!apiKey) {
    return `[Local Simulation Engine Note: GEMINI_API_KEY not detected in client environment. To enable real-time generative AI technical analysis and prompt refinement, add GEMINI_API_KEY to your secrets or .env. Running in offline deterministic mode.]\n\n### Analytical Summary: ${topic}\n\n${getDefaultAnalysis(topic)}`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are the lead biochemical engineer and sci-fi graphic novel consultant for Project BioVolt (Electro-Microbial Hybrid Cell & Under-Earth Electro-Microbial Grid).
Task: Provide a concise, hard-scientific yet visionary analysis for: "${topic}".
Context Data:
${contextData}

Keep the tone authoritative, citing Geobacter direct electron transfer, lead-carbon double-layer capacitive mechanics, subterranean thermal buffering, and engineering trade-offs. Format with clean markdown headers and bullet points.`,
    });

    return response.text || 'No response generated from model.';
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return `Analysis query failed: ${message}\n\nFalling back to deterministic engineering reference:\n${getDefaultAnalysis(topic)}`;
  }
}

function getDefaultAnalysis(topic: string): string {
  if (topic.includes('Microbial') || topic.includes('Geobacter')) {
    return `- Electron Transfer Efficiency: Direct Extracellular Electron Transfer (DET) via conductive OmcS/OmcZ cytochromic filaments achieves ~85% coulometric efficiency on CNT-doped carbon cloth.\n- Riboflavin Shuttling: Secondary mediated transport enhances micro-current yields at sub-optimal temperatures below 20°C.\n- Biofilm Longevity: Anaerobic wastewater provides continuous acetate COD flux, preventing bacterial starvation over multi-year cycles.`;
  }
  if (topic.includes('Lead-Carbon') || topic.includes('Capacitor')) {
    return `- Dynamic Buffering: The activated carbon negative plate provides 5000+ Farads of electrical double-layer capacitance (EDLC), instantly absorbing high-frequency micro-trickle without lead plate sulfation.\n- High-Burst Discharge: Unlike Lithium-ion cells that suffer high-C thermal runaway risks underground, Pb-C delivers 50A-100A burst pulses safely in cold bedrock vaults.\n- Cycle Life: Eliminates partial-state-of-charge (PSoC) degradation common in off-grid renewable energy installations.`;
  }
  return `- Thermal Equilibrium: Underground caissons at 20m maintain a stable 15°C baseline, providing ideal cooling for the Pb-C arrays while preventing bacterial overheating.\n- Hydrostatic Gas Compression: Gravity-fed organic slurry creates passive head pressure, increasing biogas concentration without parasitical compressor pump losses.`;
}
