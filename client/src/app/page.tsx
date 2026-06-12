"use client";

import Link from "next/link";

// ── Inline SVG icons (no extra deps needed) ───────────────────
const BrainIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2a2.5 2.5 0 0 1 5 0v.5"/>
    <path d="M12 2.5C8 2.5 5 5.5 5 9c0 1.5.5 2.8 1.3 3.9"/>
    <path d="M12 2.5c4 0 7 3 7 6.5 0 1.5-.5 2.8-1.3 3.9"/>
    <path d="M6.3 12.9C5.5 14 5 15.4 5 17a5 5 0 0 0 10 0c0-1.6-.5-3-1.3-4.1"/>
    <path d="M12 22v-5"/>
    <path d="M9 17h6"/>
  </svg>
);

const ScanIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
    <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
    <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
    <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
    <line x1="7" y1="12" x2="17" y2="12"/>
    <line x1="12" y1="7" x2="12" y2="17"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const HeatmapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ── Types ─────────────────────────────────────────────────────
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface StatProps {
  value: string;
  label: string;
}

interface StepProps {
  number: string;
  title: string;
  description: string;
}

// ── Sub-components ────────────────────────────────────────────
const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white border border-[#E8EDF2] rounded-2xl p-7 flex flex-col gap-3.5">
    <div className="w-11 h-11 rounded-xl bg-[#EDF7F3] flex items-center justify-center text-[#0EA472]">
      {icon}
    </div>
    <div>
      <h3 className="m-0 mb-1.5 text-[15px] font-semibold text-[#0D1B2A]">{title}</h3>
      <p className="m-0 text-[13.5px] text-[#64748B] leading-relaxed">{description}</p>
    </div>
  </div>
);

const Stat = ({ value, label }: StatProps) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[22px] font-bold text-[#0D1B2A] tracking-[-0.5px]">{value}</span>
    <span className="text-xs text-[#64748B] font-normal">{label}</span>
  </div>
);

const Step = ({ number, title, description }: StepProps) => (
  <div className="flex gap-5 items-start">
    <div className="w-9 h-9 rounded-xl bg-[#0EA472] text-white flex items-center justify-center text-[13px] font-bold flex-shrink-0">
      {number}
    </div>
    <div>
      <h4 className="m-0 mb-1 text-[15px] font-semibold text-[#0D1B2A]">{title}</h4>
      <p className="m-0 text-[13.5px] text-[#64748B] leading-relaxed">{description}</p>
    </div>
  </div>
);

// ── Floating result card (hero visual) ────────────────────────
const ResultCard = () => (
  <div className="bg-white border border-[#E8EDF2] rounded-[20px] p-5 w-[260px] shadow-lg absolute right-0 top-1/2 -translate-y-1/2">
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-9 h-9 rounded-xl bg-[#FFF7ED] flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
      <div>
        <p className="m-0 text-[11px] text-[#94A3B8]">MRI Scan · Axial</p>
        <p className="m-0 text-xs font-semibold text-[#0D1B2A]">Patient #A-2047</p>
      </div>
    </div>

    <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-2.5 px-3.5 mb-3.5">
      <p className="m-0 mb-0.5 text-[10px] text-[#92400E] font-medium">PREDICTION</p>
      <p className="m-0 text-[15px] font-bold text-[#92400E]">Mild Demented</p>
    </div>

    {[
      { label: "NonDemented", pct: 4, color: "#0EA472" },
      { label: "Very Mild", pct: 12, color: "#3B82F6" },
      { label: "Mild", pct: 78, color: "#F59E0B" },
      { label: "Moderate", pct: 6, color: "#EF4444" },
    ].map(({ label, pct, color }) => (
      <div key={label} className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-[11px] text-[#64748B]">{label}</span>
          <span className="text-[11px] font-semibold text-[#0D1B2A]">{pct}%</span>
        </div>
        <div className="h-1 rounded-[2px] bg-[#F1F5F9]">
          <div className="h-1 rounded-[2px]" style={{ background: color, width: `${pct}%` }} />
        </div>
      </div>
    ))}

    <div className="mt-3.5 pt-3 border-t border-[#F1F5F9] flex justify-between items-center">
      <span className="text-[11px] text-[#94A3B8]">Confidence</span>
      <span className="text-[13px] font-bold text-[#0EA472]">78.4%</span>
    </div>
  </div>
);

// ── Floating doctor badge ─────────────────────────────────────
const DoctorBadge = () => (
  <div className="bg-white border border-[#E8EDF2] rounded-xl p-3 px-4 flex items-center gap-3 shadow-md absolute left-0 bottom-10 w-[200px]">
    <div className="w-9 h-9 rounded-full bg-[#0EA472] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
      Dr
    </div>
    <div>
      <p className="m-0 text-xs font-semibold text-[#0D1B2A]">Dr. Sharma</p>
      <p className="m-0 text-[11px] text-[#94A3B8]">Neurologist · PGIMER</p>
    </div>
  </div>
);

// ── Main page ─────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="font-['Inter',-apple-system,BlinkMacSystemFont,sans-serif] bg-[#F8FAFB] min-h-screen">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(248,250,251,0.92)] backdrop-blur-md border-b border-[#E8EDF2] px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0EA472] to-[#059669] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <span className="text-base font-bold text-[#0D1B2A] tracking-[-0.3px]">
            Neuro<span className="text-[#0EA472]">Sight</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-8">
          {["Home", "Features", "How it works", "Research"].map((item) => (
            <a key={item} href="#" className="text-sm text-[#64748B] no-underline font-normal">
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex gap-2.5 items-center">
          <Link href="/login" className="text-[13.5px] text-[#0D1B2A] no-underline font-medium py-2 px-4">
            Login
          </Link>
          <Link href="/dashboard" className="text-[13.5px] font-semibold text-white no-underline bg-[#0D1B2A] rounded-xl py-2.5 px-5">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-24 px-12 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#EDF7F3] border border-[#A7F3D0] rounded-full py-1.5 px-3 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0EA472]" />
            <span className="text-xs font-medium text-[#047857]">
              AI-POWERED ALZHEIMER'S DETECTION
            </span>
          </div>

          <h1 className="m-0 mb-5 text-[52px] font-extrabold text-[#0D1B2A] leading-tight tracking-[-1.5px]">
            Detect Alzheimer's<br />
            <span className="text-[#0EA472]">Early.</span> Act Fast.
          </h1>

          <p className="m-0 mb-9 text-base text-[#64748B] leading-relaxed max-w-[420px]">
            Upload an MRI scan and get instant AI-powered classification across
            4 Alzheimer's stages — with visual explainability and a clinical AI
            assistant to guide next steps.
          </p>

          <div className="flex gap-3 mb-12">
            <Link href="/upload" className="inline-flex items-center gap-2 bg-[#0D1B2A] text-white no-underline py-3.5 px-6 rounded-xl text-sm font-semibold">
              Analyse a Scan
              <ArrowRight />
            </Link>
            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white text-[#0D1B2A] no-underline py-3.5 px-6 rounded-xl text-sm font-medium border border-[#E8EDF2]">
              View Dashboard
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 pt-8 border-t border-[#E8EDF2]">
            <Stat value="93.2%" label="Classification accuracy" />
            <div className="w-px bg-[#E8EDF2]" />
            <Stat value="4 Stages" label="Alzheimer's classes" />
            <div className="w-px bg-[#E8EDF2]" />
            <Stat value="&lt; 2s" label="Inference time" />
          </div>
        </div>

        {/* Right — floating cards */}
        <div className="relative h-[440px]">
          {/* Brain MRI illustration placeholder */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-gradient-to-br from-[#EDF7F3] to-[#DBEAFE] flex items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#A7F3D0] to-[#BAE6FD] flex items-center justify-center">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#0EA472" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
                <path d="M9.5 2a2.5 2.5 0 0 1 5 0"/>
                <path d="M12 2.5C8 2.5 5 5.5 5 9c0 2 .8 3.8 2 5"/>
                <path d="M12 2.5c4 0 7 3 7 6.5 0 2-.8 3.8-2 5"/>
                <path d="M7 14c-1 1.3-2 2.8-2 5 0 2.8 2.2 5 5 5s5-2.2 5-5c0-2.2-1-3.7-2-5"/>
                <line x1="12" y1="19" x2="12" y2="24"/>
                <line x1="9.5" y1="21.5" x2="14.5" y2="21.5"/>
              </svg>
            </div>
          </div>

          {/* Result card */}
          <ResultCard />

          {/* Doctor badge */}
          <DoctorBadge />

          {/* Heatmap badge */}
          <div className="absolute top-5 left-5 bg-white border border-[#E8EDF2] rounded-xl py-2.5 px-3.5 shadow-md flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0EA472]" />
            <span className="text-xs font-medium text-[#0D1B2A]">Grad-CAM active</span>
          </div>
        </div>
      </section>

      {/* ── Trusted by banner ── */}
      <div className="border-y border-[#E8EDF2] bg-white py-5 px-12 flex items-center justify-center gap-12 flex-wrap">
        <span className="text-xs text-[#94A3B8] font-medium">RESEARCH BACKED BY</span>
        {["ADNI Dataset", "NIH Guidelines", "WHO Dementia Report", "PubMed RAG", "EfficientNetV2"].map((item) => (
          <span key={item} className="text-[13px] text-[#64748B] font-medium">{item}</span>
        ))}
      </div>

      {/* ── Features ── */}
      <section className="py-24 px-12 max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <p className="m-0 mb-2 text-xs font-semibold text-[#0EA472] tracking-[0.08em]">
            CAPABILITIES
          </p>
          <h2 className="m-0 mb-3 text-4xl font-extrabold text-[#0D1B2A] tracking-[-0.8px]">
            Everything a neurologist needs
          </h2>
          <p className="m-0 mx-auto text-[15px] text-[#64748B] max-w-[440px] leading-relaxed">
            From raw MRI to clinical report — fully automated, explainable, and backed by medical literature.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard
            icon={<ScanIcon />}
            title="4-Stage Classification"
            description="Classifies MRI into NonDemented, Very Mild, Mild, and Moderate Alzheimer's with probability scores."
          />
          <FeatureCard
            icon={<HeatmapIcon />}
            title="Grad-CAM Heatmap"
            description="Visual heatmap overlay showing exactly which brain regions influenced the classification decision."
          />
          <FeatureCard
            icon={<ChatIcon />}
            title="AI Clinical Assistant"
            description="LangChain-powered agent that explains results, searches PubMed, and recommends next clinical steps."
          />
          <FeatureCard
            icon={<BrainIcon />}
            title="Longitudinal Tracking"
            description="Track a patient's scan history over time and chart disease progression with automatic reporting."
          />
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-white border-y border-[#E8EDF2] py-24 px-12">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Left — steps */}
          <div>
            <p className="m-0 mb-2 text-xs font-semibold text-[#0EA472] tracking-[0.08em]">
              HOW IT WORKS
            </p>
            <h2 className="m-0 mb-10 text-3xl font-extrabold text-[#0D1B2A] tracking-[-0.6px]">
              Diagnosis in three steps
            </h2>
            <div className="flex flex-col gap-7">
              <Step number="01" title="Upload the MRI scan" description="Drag and drop any axial brain MRI image — JPG or PNG. The system accepts both clinical and research-grade scans." />
              <Step number="02" title="AI analyses the scan" description="EfficientNetV2B0 classifies the scan across 4 stages in under 2 seconds. Grad-CAM highlights the critical brain regions." />
              <Step number="03" title="Review with AI assistant" description="Chat with the LangChain agent to understand the result, get treatment context, and generate a clinical PDF report." />
            </div>
          </div>

          {/* Right — visual panel */}
          <div className="bg-[#F8FAFB] border border-[#E8EDF2] rounded-[20px] p-8">
            <p className="m-0 mb-5 text-[13px] font-semibold text-[#0D1B2A]">
              Sample output
            </p>

            {/* Stage timeline */}
            <div className="mb-6">
              <p className="m-0 mb-3 text-[11px] text-[#94A3B8] font-medium">ALZHEIMER'S STAGE</p>
              <div className="flex gap-1.5">
                {[
                  { label: "Non", color: "#0EA472", active: false },
                  { label: "Very Mild", color: "#3B82F6", active: false },
                  { label: "Mild", color: "#F59E0B", active: true },
                  { label: "Moderate", color: "#EF4444", active: false },
                ].map(({ label, color, active }) => (
                  <div key={label} className={`flex-1 py-2 px-1.5 rounded-lg text-center ${active ? `bg-[${color}] border-[1.5px] border-[${color}]` : "bg-[#F1F5F9] border-[1.5px] border-transparent"}`}>
                    <span className={`text-[10px] font-${active ? 'bold' : 'medium'} ${active ? 'text-white' : 'text-[#94A3B8]'}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence */}
            <div className="mb-5">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-[#64748B]">Model confidence</span>
                <span className="text-xs font-bold text-[#0D1B2A]">78.4%</span>
              </div>
              <div className="h-1.5 rounded-[3px] bg-[#E8EDF2]">
                <div className="h-1.5 rounded-[3px] bg-[#F59E0B] w-[78.4%]" />
              </div>
            </div>

            {/* AI message */}
            <div className="bg-[#EDF7F3] rounded-xl p-3.5 px-4">
              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 rounded-lg bg-[#0EA472] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">AI</div>
                <p className="m-0 text-[12.5px] text-[#064E3B] leading-relaxed">
                  This result indicates <strong>Mild Cognitive Impairment</strong>. I recommend scheduling an MMSE test and PET scan. Would you like to see relevant treatment options from PubMed?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why early detection matters ── */}
      <section className="py-24 px-12 max-w-[1200px] mx-auto">
        <div className="bg-gradient-to-br from-[#0D1B2A] to-[#1E3A5F] rounded-3xl p-14 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="m-0 mb-2.5 text-xs font-semibold text-[#0EA472] tracking-[0.08em]">
              THE PROBLEM
            </p>
            <h2 className="m-0 mb-4 text-[30px] font-extrabold text-white tracking-[-0.6px] leading-tight">
              75% of Alzheimer's cases go undiagnosed globally
            </h2>
            <p className="m-0 mb-7 text-sm text-[#94A3B8] leading-relaxed">
              In India, 90% of patients never receive a formal diagnosis. A full clinical workup costs ₹80,000–₹1,20,000 and requires specialist infrastructure most patients cannot access.
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                "Detects atrophy 6–10 years before clinical symptoms",
                "Works on standard hospital MRI — no specialist scanner needed",
                "Near-zero marginal cost per screening",
                "Deployable in low-resource clinical settings",
              ].map((point) => (
                <div key={point} className="flex gap-2.5 items-start">
                  <div className="w-5 h-5 rounded-md bg-[#0EA472] flex items-center justify-center flex-shrink-0 mt-px">
                    <CheckIcon />
                  </div>
                  <span className="text-[13.5px] text-[#CBD5E1] leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "55M+", label: "People affected globally", accent: "#0EA472" },
              { value: "10M", label: "New cases every year", accent: "#3B82F6" },
              { value: "153M", label: "Projected cases by 2050", accent: "#F59E0B" },
              { value: "$1T+", label: "Annual global care cost", accent: "#EF4444" },
            ].map(({ value, label, accent }) => (
              <div key={value} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="m-0 mb-1 text-[28px] font-extrabold tracking-[-0.5px]" style={{ color: accent }}>{value}</p>
                <p className="m-0 text-xs text-[#94A3B8] leading-relaxed">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-12 pb-24 max-w-[1200px] mx-auto text-center">
        <div className="bg-[#EDF7F3] border border-[#A7F3D0] rounded-3xl py-16 px-12">
          <div className="inline-flex items-center gap-1.5 mb-4">
            <ShieldIcon />
            <span className="text-xs font-semibold text-[#047857]">RESEARCH TOOL — NOT A MEDICAL DEVICE</span>
          </div>
          <h2 className="m-0 mb-3 text-4xl font-extrabold text-[#0D1B2A] tracking-[-0.8px]">
            Ready to analyse your first scan?
          </h2>
          <p className="m-0 mx-auto mb-8 text-[15px] text-[#64748B] max-w-[400px] leading-relaxed">
            Upload an MRI image and get a full classification result with explainability heatmap in under 2 seconds.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/upload" className="inline-flex items-center gap-2 bg-[#0D1B2A] text-white no-underline py-3.5 px-7 rounded-xl text-sm font-semibold">
              Upload MRI Scan
              <ArrowRight />
            </Link>
            <Link href="/dashboard" className="inline-flex items-center bg-white text-[#0D1B2A] no-underline py-3.5 px-7 rounded-xl text-sm font-medium border border-[#E8EDF2]">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#E8EDF2] bg-white py-8 px-12 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6.5 h-6.5 rounded-[7px] bg-gradient-to-br from-[#0EA472] to-[#059669] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <span className="text-sm font-bold text-[#0D1B2A]">
            Neuro<span className="text-[#0EA472]">Sight</span>
          </span>
        </div>
        <p className="m-0 text-xs text-[#94A3B8]">
          Built with TensorFlow · FastAPI · LangChain · Next.js
        </p>
        <p className="m-0 text-xs text-[#94A3B8]">
          For research purposes only · Not a certified medical device
        </p>
      </footer>

    </div>
  );
}