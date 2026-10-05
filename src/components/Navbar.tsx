/**
 * Strict Top Bar Contract Implementation
 * Zone 1: Brand Wordmark (Single text element)
 * Zone 2: Nav Links (4-6 single-line labels)
 * Zone 3: 1-2 Primary Actions
 */

import React from 'react';
import { Download, ChevronDown } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExportPython: () => void;
  liveStatus: 'nominal' | 'running' | 'paused';
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onExportPython,
  liveStatus,
}) => {
  const primaryNavItems = [
    { id: 'simulator', label: 'Cell Simulator' },
    { id: 'caisson', label: 'Subterranean Vault' },
    { id: 'diagnostics', label: 'Diagnostics & CLI' },
    { id: 'cnc', label: 'CNC Toolpaths' },
    { id: 'ota', label: 'OTA & Automation' },
    { id: 'telemetry', label: 'Telemetry & PMIC' },
  ];

  const secondaryNavItems = [
    { id: 'careers', label: 'Enterprise Hub' },
    { id: 'readme_gen', label: 'README Generator' },
    { id: 'comic', label: 'Graphic Novel' },
    { id: 'calculator', label: 'Biochemistry' },
    { id: 'portfolio', label: 'Technical Paper' },
  ];


  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3.5 bg-[#080B10]/95 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Single text element wordmark in display face */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setActiveTab('simulator');
        }}
        className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap"
        style={{ fontFamily: 'var(--font-tech)' }}
      >
        Project BioVolt
      </a>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
        {primaryNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`transition-colors whitespace-nowrap py-1 relative ${
                isActive
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          );
        })}

        {/* Secondary dropdown items */}
        <div className="relative group">
          <button className="flex items-center gap-1 text-slate-400 hover:text-slate-200 py-1 transition-colors whitespace-nowrap text-xs font-mono">
            <span>More Specs</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <div className="absolute right-0 top-full mt-1 w-44 bg-[#0D121D] border border-slate-800 rounded-lg shadow-xl py-1 hidden group-hover:block z-50">
            {secondaryNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-3.5 py-2 text-xs font-mono transition-colors ${
                  activeTab === item.id
                    ? 'text-amber-400 bg-slate-900 font-bold'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <span
            className={`w-2 h-2 rounded-full ${
              liveStatus === 'running'
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-amber-400'
            }`}
          />
          <span className="uppercase text-[11px] tracking-wider text-slate-400">
            NOMINAL
          </span>
        </div>

        <button
          onClick={onExportPython}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-md transition-all whitespace-nowrap shadow-sm font-mono"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Python</span>
        </button>
      </div>
    </header>
  );
};
