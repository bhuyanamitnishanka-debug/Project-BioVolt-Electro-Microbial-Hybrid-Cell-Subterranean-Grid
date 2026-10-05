/**
 * Project BioVolt: Career & Enterprise Portfolio Hub
 * Tailored Engineering Cover Letters (Mahindra, Adani, Oracle), LinkedIn Announcement, and Application Tracker
 */

import React, { useState } from 'react';
import {
  Briefcase,
  FileText,
  Copy,
  Check,
  Download,
  Share2,
  Printer,
  Building,
  Plus,
  Trash2
} from 'lucide-react';

const COVER_LETTER_MAHINDRA = `Amit Nishanka Bhuyan
Jagatpur, Odisha, India
bhuyanamitnishanka-debug@github.com
October 5, 2026

To,
The Engineering Recruitment Team
Mahindra & Mahindra Ltd.
Automotive & Farm Equipment Sectors R&D Centre
Mahindra World City, Chengalpattu, India

Subject: Application for Product Design Engineer (R&D – Power Systems & Advanced Prototyping)

Dear Hiring Team,

I am writing to express my strong interest in the Product Design Engineer (R&D – Power Systems & Advanced Prototyping) position at Mahindra & Mahindra. As an independent researcher and hardware systems coordinator specializing in automated engineering workflows, I bring a unique blend of multidisciplinary CAD simulation modeling, precise CNC machining optimization (G-code parameters), and technical product management logic. I have built my professional foundation on the belief that true refinement in product design innovation comes from an immersive, end-to-end commitment to turning conceptual specifications into working structural models.

Mahindra’s reputation for engineering rugged, high-endurance power systems aligns perfectly with my approach to product development. I prioritize a workflow that transitions projects from high-level system design down to discrete mechanical attributes. My technical portfolio features the execution of multiple complex projects involving hardware-software integration, cloud-synced tracking systems, and clean-tech solutions. Recently, I spearheaded the deployment of Project BioVolt (Under-Earth Electro-Microbial Grid), an open-source subterranean framework integrating real-time telemetry, low-power micro-controller loop scripting, and asymmetric lead-carbon hybrid storage chemistry.

My core technical competencies align directly with the production requirements of your R&D teams:

* 3D CAD & Digital Twin Simulation: Experienced in using advanced CAD methodologies to conceptualize dense industrial systems, map component exploded sequences, and manage spatial constraints before manufacturing.
* Precision CNC Fabrication & G-Code Optimization: Proficient in designing production-ready multi-well enclosures and casing modules by writing custom, error-free 3-axis CNC G-code strings with optimal spindle speeds, feed rates, and multi-pass cutting routines.
* Cross-Functional Technical Management: Skilled at leveraging artificial intelligence modeling architectures to optimize programming code patterns (Python, JavaScript, embedded C++), build test runner telemetry suites, and translate complex research formulas into clean documentation for engineering teams.

I choose to approach complex technical milestones with caution, clarity, and an unwavering commitment to operational integrity. I am highly motivated to bring this structured, analytical mindset to Mahindra & Mahindra, where I can collaborate with your R&D teams to design next-generation hardware frameworks that provide real mutual benefits to the enterprise.

Thank you for your time, consideration, and evaluation of my professional profile. I welcome the opportunity to discuss my technical portfolio, project blueprints, and simulation workflows during a technical presentation session.

Sincerely,

Amit Nishanka Bhuyan
Lead AI Researcher & Project Coordinator
`;

const COVER_LETTER_ADANI = `Amit Nishanka Bhuyan
Jagatpur, Odisha, India
bhuyanamitnishanka-debug@github.com
October 5, 2026

To,
The Talent Acquisition Team
Adani Group (Digital & IT Division)
Adani Corporate House, Shantigram,
Ahmedabad, Gujarat, India

Subject: Application for AI Infrastructure & Process Automation Specialist

Dear Hiring Team,

I am writing to express my strong interest in the AI Infrastructure & Process Automation Specialist position within the Digital and IT division at Adani Group. As an experienced independent startup coordinator and full-stack AI systems designer, I bring a proven track record of orchestrating complex AI-driven workflows, optimizing structural software logic patterns, and managing end-to-end prototyping architectures. I believe that driving process efficiency across large-scale industrial operations requires a seamless blend of robust backend system logic and intelligent workflow automation.

My professional foundation has been forged through directing independent startup initiatives, where I served as the primary technical coordinator. In this role, I managed an active portfolio of production-grade repositories on GitHub, directed complex data workflows, and formulated comprehensive technical blueprints and patent roadmaps for regional incubation hubs like O-Hub and KIIT-TBI. This hands-on coordination experience has taught me how to effectively map abstract business objectives to structured software pipelines, deploy lightweight web application backends (Python-Flask/JavaScript), and scale technical infrastructure with minimal overhead.

My technical and leadership capabilities match the transformation goals of Adani Group:

* AI Implementation & Prompt Engineering: Highly proficient at utilizing advanced large language model application layers (Google AI Studio/Gemini API architectures) to write complex system logic, automate manual data-entry processes, and decode intricate software design strings.
* Startup Coordination & Technical Governance: Experienced in managing the entire lifecycle of multi-faceted engineering projects—handling system configurations, version control via Git, and drafting rigorous technical documentation for external stakeholders.
* Process Architecture Optimization: Strong ability to analyze existing operational gaps and design automated scripts to handle real-time data parsing, system telemetry logs, and structured JSON communication streams.

I approach large-scale technological goals with absolute clarity, caution, and an unwavering commitment to operational security. I am eager to bring this independent, solution-oriented drive to Adani Group, where I can help automate complex operations and strengthen your digital infrastructure.

Thank you for your time, consideration, and evaluation of my profile. I welcome the opportunity to present my technical portfolio and system automation scripts during a presentation or interview session.

Sincerely,

Amit Nishanka Bhuyan
Lead AI Researcher & Project Coordinator
`;

const COVER_LETTER_ORACLE = `Amit Nishanka Bhuyan
Jagatpur, Odisha, India
bhuyanamitnishanka-debug@github.com
October 5, 2026

To,
The Engineering Recruitment Team
Oracle India Development Centre
Oracle Technology Park,
Bengaluru, Karnataka, India

Subject: Application for Technical Project Coordinator – AI Solutions & DevOps Delivery

Dear Hiring Team,

I am writing to express my enthusiastic interest in the Technical Project Coordinator – AI Solutions & DevOps Delivery position at Oracle. As a self-taught AI systems designer and independent startup coordinator, I specialize in managing technical repository lifecycles, optimizing software logic patterns, and translating complex multi-cloud data parameters into clean, production-grade project layouts. My career is built on a cross-functional workflow where I bridge the gap between high-level system logic, structured code validation, and cross-team execution.

In my tenure coordinating independent deep-tech and software ventures, I successfully managed the software engineering pipelines for a large scale portfolio of over 20 concurrent projects. My responsibilities included maintaining continuous integration sandboxes, configuring environment setup architectures, and deploying cloud-synced database frameworks. Furthermore, my background in pitching and defending structural technical blueprints to tech business incubators has refined my ability to govern software development milestones and communicate technical data transformations clearly to stakeholders.

My core competencies map directly to the operational demands of Oracle's engineering divisions:

* System Logic Mastery & AI Integration: Advanced capability in prompt engineering, using Google AI Studio and specialized APIs to rapidly generate structural software solutions, troubleshoot syntax constraints, and optimize dynamic script execution.
* Agile Codebase & Repository Management: Extensive experience handling version control architectures (GitHub workflows), managing code modularity across Python, JavaScript, and C++, and structuring automated JSON data validation engines.
* Strategic Project Coordination: Proven ability to manage multi-tiered application roadmaps, oversee resource constraints without compromising code quality, and maintain cross-platform documentation.

I approach complex deployment paths with a structured, calculative-risk methodology and a strict adherence to corporate data principles. I am eager to apply my independent technical management experience to Oracle and help deliver scalable cloud and AI solutions.

Thank you for reviewing my qualifications. I look forward to discussing how my unique technical portfolio can drive success within your enterprise cloud teams.

Sincerely,

Amit Nishanka Bhuyan
Lead AI Researcher & Project Coordinator
`;

const LINKEDIN_POST = `⚡ Project Release: Bridging Living Biofilms with Solid-State Lead-Carbon Storage Arrays

I am thrilled to announce the completion of the latest development and prototyping cycle for Project BioVolt: The Under-Earth Electro-Microbial Grid (UE-EMG)! 🌍🔋

This open-source hardware project addresses a major barrier in energy harvesting: how to efficiently capture and store the continuous, low-current electron trickle generated by exoelectrogenic bacteria (Geobacter sulfurreducens) without degrading the storage media over time.

By moving the entire system architecture entirely underground into modular concrete caissons, the grid eliminates surface weather vulnerabilities and maintains a rock-steady ambient temperature baseline (15°C).

💡 Key Framework Innovations Completed in This Release Cycle:

* Asymmetric Lead-Carbon (Pb-C) Hybrid Battery Storage: Designed an asymmetric negative plate composite array that functions as an integrated chemical capacitor to instantly capture fluctuating metabolic currents without sulfation, while using a heavy lead core to handle high-burst current grid discharge.
* Closed-Loop PMIC Tracking Firmware: Implemented embedded C++ code to enforce strict Maximum Power Point Tracking (MPPT) at 80% open-circuit potential, preventing biofilm electrical collapse under heavy grid draw.
* Arrhenius Kinetic Simulator & JSON Telemetry Matrix: Built predictive Python modeling suites to calculate dynamic biological current output relative to sub-surface core temperature adjustments.
* Physical Prototype Machining Ready: Compiled precise 3-axis CNC G-Code toolpath routines to mill custom multi-well acrylic casing components for physical cell prototyping and fluid containment validation.

This multidisciplinary architecture merges electrochemical engineering, low-power embedded software design, and practical machining frameworks to create long-term baseload stability solutions.

📂 Explore the complete open-source codebase, math models, and hardware blueprints here: https://github.com

#BiochemicalEngineering #EnergyStorage #EmbeddedSystems #CNCMilling #CleanTech #Python #OpenSourceHardware #SystemDesign`;

interface JobApp {
  id: string;
  company: string;
  role: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offered';
  dateApplied: string;
  notes: string;
}

export const CareerPortfolioHub: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<'mahindra' | 'adani' | 'oracle'>('mahindra');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cover_letters' | 'linkedin' | 'tracker' | 'grants_valuation'>('cover_letters');
  const [pitchLang, setPitchLang] = useState<'en' | 'hi' | 'or'>('en');

  // Job Application Tracker State
  const [applications, setApplications] = useState<JobApp[]>([
    {
      id: '1',
      company: 'Mahindra & Mahindra Ltd.',
      role: 'Product Design Engineer (R&D – Power Systems)',
      status: 'Applied',
      dateApplied: '2026-10-05',
      notes: 'Submitted customized cover letter with CAD & CNC G-Code milestones.',
    },
    {
      id: '2',
      company: 'Adani Group',
      role: 'AI Infrastructure & Process Automation Specialist',
      status: 'Screening',
      dateApplied: '2026-10-04',
      notes: 'Highlighted startup incubator coordination and JSON telemetry pipeline.',
    },
    {
      id: '3',
      company: 'Oracle India Development Centre',
      role: 'Technical Project Coordinator – AI Solutions',
      status: 'Applied',
      dateApplied: '2026-10-05',
      notes: 'Emphasized GitHub CI/CD workflows and automated test runner engines.',
    },
  ]);

  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadLetter = (content: string, filename: string) => {
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

  const handleAddApplication = () => {
    if (!newCompany || !newRole) return;
    const newEntry: JobApp = {
      id: String(Date.now()),
      company: newCompany,
      role: newRole,
      status: 'Applied',
      dateApplied: new Date().toISOString().split('T')[0],
      notes: 'Submitted application through recruitment portal.',
    };
    setApplications([newEntry, ...applications]);
    setNewCompany('');
    setNewRole('');
  };

  const handleExportApplicationsCSV = () => {
    const headers = ['Company', 'Role', 'Status', 'Date_Applied', 'Notes'];
    const rows = applications.map((a) => [a.company, a.role, a.status, a.dateApplied, `"${a.notes}"`]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job_applications_tracker.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const letterMap = {
    mahindra: COVER_LETTER_MAHINDRA,
    adani: COVER_LETTER_ADANI,
    oracle: COVER_LETTER_ORACLE,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="p-6 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Briefcase className="w-4 h-4" />
            <span>ENTERPRISE RECRUITMENT &amp; PORTFOLIO HUB</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-tech)' }}>
            Professional Applications &amp; Deployment Documentation
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Tailored engineering cover letters for tier-1 enterprises (Mahindra, Adani, Oracle), LinkedIn release
            announcements, and an interactive job application status manager.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
          <button
            onClick={() => setActiveTab('cover_letters')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'cover_letters' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cover Letters
          </button>
          <button
            onClick={() => setActiveTab('linkedin')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'linkedin' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            LinkedIn Post
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'tracker' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Application Tracker
          </button>
          <button
            onClick={() => setActiveTab('grants_valuation')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'grants_valuation' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Valuation &amp; Grants (₹1.22 Cr)
          </button>
        </div>
      </div>

      {/* Mode 1: Tailored Cover Letters */}
      {activeTab === 'cover_letters' && (
        <div className="flex flex-col gap-5">
          {/* Company Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0D121D] border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-white uppercase">SELECT TARGET ENTERPRISE:</span>
            </div>

            <div className="flex items-center gap-2">
              {(['mahindra', 'adani', 'oracle'] as const).map((comp) => (
                <button
                  key={comp}
                  onClick={() => setSelectedCompany(comp)}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                    selectedCompany === comp
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {comp === 'mahindra' && 'Mahindra & Mahindra'}
                  {comp === 'adani' && 'Adani Group'}
                  {comp === 'oracle' && 'Oracle'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(letterMap[selectedCompany], selectedCompany)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-300 transition-colors"
              >
                {copiedKey === selectedCompany ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === selectedCompany ? 'Copied' : 'Copy Letter'}</span>
              </button>
              <button
                onClick={() => handleDownloadLetter(letterMap[selectedCompany], `Cover_Letter_${selectedCompany.toUpperCase()}.txt`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs font-mono transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>
            </div>
          </div>

          {/* Letter Body Display */}
          <div className="p-8 md:p-12 bg-[#0B0F19] border border-slate-800 rounded-lg max-w-4xl mx-auto flex flex-col gap-4 font-mono text-xs text-slate-200 leading-relaxed shadow-xl">
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300 leading-relaxed">
              {letterMap[selectedCompany]}
            </pre>
          </div>
        </div>
      )}

      {/* Mode 2: LinkedIn Announcement */}
      {activeTab === 'linkedin' && (
        <div className="p-6 md:p-10 bg-[#0B0F19] border border-slate-800 rounded-lg max-w-4xl mx-auto flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold uppercase">LINKEDIN POST TEMPLATE</span>
              <h3 className="text-base font-bold text-white mt-0.5">Project Release Announcement</h3>
            </div>
            <button
              onClick={() => handleCopy(LINKEDIN_POST, 'linkedin_post')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs font-mono transition-colors shadow-sm"
            >
              {copiedKey === 'linkedin_post' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'linkedin_post' ? 'Copied Post' : 'Copy for LinkedIn'}</span>
            </button>
          </div>

          <div className="p-5 bg-[#070A10] border border-slate-800 rounded font-sans text-sm text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
            {LINKEDIN_POST}
          </div>
        </div>
      )}

      {/* Mode 3: Application Tracker */}
      {activeTab === 'tracker' && (
        <div className="p-6 bg-[#0D121D] border border-slate-800 rounded-lg flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wide">
                JOB APPLICATION STATUS TRACKER (CSV BACKED)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Track status, follow-up dates, and recruiter presentations across target corporate pipelines
              </p>
            </div>
            <button
              onClick={handleExportApplicationsCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Tracker CSV</span>
            </button>
          </div>

          {/* Quick Add Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded text-xs font-mono">
            <input
              type="text"
              placeholder="Target Company (e.g. Tata Motors)"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-amber-400"
            />
            <input
              type="text"
              placeholder="Target Role (e.g. Lead Systems Engineer)"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={handleAddApplication}
              className="flex items-center justify-center gap-1.5 py-2 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Tracker</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Applied</th>
                  <th className="py-2.5 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-bold text-white">{app.company}</td>
                    <td className="py-3 px-3 text-slate-300">{app.role}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          app.status === 'Applied'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : app.status === 'Screening'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{app.dateApplied}</td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">{app.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
