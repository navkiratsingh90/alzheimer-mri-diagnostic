"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  ChevronRight,
  MessageCircle,
  Download,
  RotateCcw,
  Eye,
  EyeOff,
  Activity,
  Moon,
  Users,
  BookOpen,
  Heart,
  Dumbbell,
  AlertTriangle,
  Info,
  ScanLine,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// ─── Types (matching PredictionResponse schema) ───────────────
interface ClassProbabilities {
  NonDemented: number;
  VeryMildDemented: number;
  MildDemented: number;
  ModerateDemented: number;
}

interface ScanResult {
  id: string;
  scan_id: string;
  predicted_class: keyof ClassProbabilities;
  confidence: number;
  class_probabilities: ClassProbabilities;
  severity_score: number;
  heatmap_base64: string | null;
  model_version: string;
  inference_ms: number | null;
}

// ─── Stage config ─────────────────────────────────────────────
// Maps each predicted_class to everything the UI needs to show.
// One place to change — every component reads from here.
const STAGE = {
  NonDemented: {
    headline:   "Your scan looks healthy.",
    subline:    "The AI found no patterns associated with Alzheimer's disease in your scan.",
    detail:     "This is a reassuring result. It doesn't replace a doctor's assessment — especially if you have ongoing memory concerns — but there are no warning signs visible in this scan.",
    badge:      "No signs detected",
    badgeBg:    "#EDF7F2",
    badgeColor: "#1A6B3A",
    barColor:   "#7BAF8A",
    tipTitle:   "Keep your brain healthy",
    tipColor:   "#7BAF8A",
    tipBg:      "#F4FAF6",
  },
  VeryMildDemented: {
    headline:   "Your scan shows very early signs of change.",
    subline:    "The AI found subtle patterns that can appear in the earliest stage of memory change.",
    detail:     "At this stage, most people are fully independent. You might occasionally misplace things or forget names — but daily life is mostly unaffected. Early awareness is genuinely useful: there's a lot you can do now.",
    badge:      "Very early changes",
    badgeBg:    "#FEF9EE",
    badgeColor: "#8B6315",
    barColor:   "#E8A838",
    tipTitle:   "Steps that help at this stage",
    tipColor:   "#E8A838",
    tipBg:      "#FEF9EE",
  },
  MildDemented: {
    headline:   "Your scan shows mild signs of memory change.",
    subline:    "The AI found patterns consistent with mild memory changes.",
    detail:     "This stage often involves more noticeable forgetfulness — like forgetting recent conversations or struggling with complex tasks — but most people remain largely independent. Speaking to a doctor is a good next step.",
    badge:      "Mild changes",
    badgeBg:    "#FFF4E8",
    badgeColor: "#7A3C00",
    barColor:   "#D97706",
    tipTitle:   "What to do next",
    tipColor:   "#D97706",
    tipBg:      "#FFF8F0",
  },
  ModerateDemented: {
    headline:   "Your scan shows moderate memory changes.",
    subline:    "The AI found patterns associated with moderate-stage memory changes.",
    detail:     "This stage can significantly affect daily life and independence. We'd strongly encourage you to speak with a doctor soon — care options and support are available and can make a real difference.",
    badge:      "Moderate changes",
    badgeBg:    "#FFF0F0",
    badgeColor: "#7A1C1C",
    barColor:   "#DC2626",
    tipTitle:   "Important steps to take",
    tipColor:   "#DC2626",
    tipBg:      "#FFF5F5",
  },
} as const;

// ─── Class display labels ─────────────────────────────────────
const CLASS_LABELS: Record<string, string> = {
  NonDemented:      "No signs",
  VeryMildDemented: "Very mild",
  MildDemented:     "Mild",
  ModerateDemented: "Moderate",
};

// ─── Lifestyle tips per stage ─────────────────────────────────
type Tip = { icon: React.ElementType; title: string; body: string };

const TIPS: Record<string, Tip[]> = {
  NonDemented: [
    { icon: Dumbbell, title: "Keep exercising",        body: "30 minutes of aerobic activity most days is the single strongest lifestyle factor for long-term brain health." },
    { icon: Moon,     title: "Protect your sleep",     body: "7–8 hours of quality sleep helps the brain clear harmful proteins that accumulate during waking hours." },
    { icon: Users,    title: "Stay socially connected", body: "Regular meaningful social contact preserves cognitive reserve more than many people realise." },
    { icon: BookOpen, title: "Stay mentally active",   body: "Reading, learning new skills, or playing an instrument builds cognitive resilience." },
  ],
  VeryMildDemented: [
    { icon: Dumbbell, title: "Daily physical activity", body: "Even 30 minutes of brisk walking per day has strong evidence for slowing cognitive decline at this stage." },
    { icon: Heart,    title: "Mediterranean-style diet", body: "Rich in olive oil, fish, vegetables, and nuts — this eating pattern is consistently linked to slower memory decline." },
    { icon: Moon,     title: "Sleep quality",           body: "Disrupted sleep accelerates amyloid buildup. Talk to your GP if you're struggling to sleep well." },
    { icon: BookOpen, title: "Mental stimulation",      body: "Puzzles, crosswords, reading, and learning new things all help maintain cognitive sharpness." },
  ],
  MildDemented: [
    { icon: Users,    title: "Talk to your GP soon",    body: "A doctor can confirm the result with proper tests and discuss medications that may help at this stage." },
    { icon: Activity, title: "Structured daily routine", body: "A consistent daily schedule reduces confusion and anxiety, and helps maintain independence longer." },
    { icon: BookOpen, title: "Memory aids",              body: "Calendars, reminder apps, and written notes are practical tools that make a real difference every day." },
    { icon: Heart,    title: "Caregiver support",        body: "Connecting with support groups — for you and your family — significantly improves quality of life." },
  ],
  ModerateDemented: [
    { icon: AlertTriangle, title: "See a doctor soon",     body: "At this stage, medical assessment is important. Your GP can refer you to a specialist and discuss care options." },
    { icon: Users,         title: "Involve family now",    body: "Including family members in care planning makes things much smoother as needs increase." },
    { icon: Heart,         title: "Dementia support",      body: "Organisations like the Alzheimer's Society offer practical help, helplines, and local support groups." },
    { icon: Moon,          title: "Safe home environment", body: "Good lighting, removing trip hazards, and labelling drawers meaningfully improve daily safety." },
  ],
};

// ─── Sub-components ───────────────────────────────────────────

// Stage badge
function StageBadge({ predicted_class }: { predicted_class: string }) {
  const cfg = STAGE[predicted_class as keyof typeof STAGE] ?? STAGE.NonDemented;
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: cfg.badgeBg, color: cfg.badgeColor }}
    >
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.badgeColor }} />
      {cfg.badge}
    </div>
  );
}

// Single probability bar row
function ProbBar({
  label,
  value,
  color,
  isTop,
}: {
  label: string;
  value: number;
  color: string;
  isTop: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-medium ${isTop ? "text-[#1C2B3A]" : "text-[#8B9EB0]"}`}>
          {label}
        </span>
        <span className={`text-xs font-bold tabular-nums ${isTop ? "text-[#1C2B3A]" : "text-[#CBD5E1]"}`}>
          {(value * 100).toFixed(0)}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#F0F0EE] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value * 100}%`, background: isTop ? color : "#E4E8EC" }}
        />
      </div>
    </div>
  );
}

// Lifestyle tip card
function TipCard({ icon: Icon, title, body }: Tip) {
  return (
    <Card className="border-[#E4E8EC] shadow-none">
      <CardContent className="p-4 flex items-start gap-3.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "#F4FAF6" }}
        >
          <Icon className="w-4 h-4" style={{ color: "#7BAF8A" }} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1C2B3A] mb-0.5">{title}</p>
          <p className="text-xs text-[#8B9EB0] leading-relaxed">{body}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function ResultPage() {
  const router = useRouter();

  const [result,      setResult]      = useState<ScanResult | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("scanResult");
    if (raw) {
      setResult(JSON.parse(raw));
    } else {
      // No result in storage — redirect to scan page
      router.replace("/scan");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E4E8EC] border-t-[#E8A838] rounded-full animate-spin" />
      </div>
    );
  }

  if (!result) return null;

  const cfg  = STAGE[result.predicted_class] ?? STAGE.NonDemented;
  const tips = TIPS[result.predicted_class]  ?? TIPS.NonDemented;

  // Build ordered class probability rows (highest first)
  const probRows = (
    Object.entries(result.class_probabilities) as [string, number][]
  ).sort(([, a], [, b]) => b - a);

  return (
    <div
      className="min-h-screen bg-[#FAFAF8]"
      style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}
    >

      {/* ── Topbar ── */}
      <header className="sticky top-0 z-40 border-b border-[#E4E8EC] bg-[#FAFAF8]/95 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #E8A838, #D4922A)" }}
            >
              <Brain className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
            </div>
            <span className="text-sm font-bold text-[#1C2B3A]">MindCheck</span>
          </Link>

          {/* Step pills */}
          <div className="flex items-center gap-1.5">
            {["Upload", "Result", "Chat"].map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className={`
                    flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium
                    ${i === 1 ? "bg-[#1C2B3A] text-white" : "bg-[#F0F0EE] text-[#8B9EB0]"}
                  `}
                >
                  <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold">
                    {i === 0 ? "✓" : i + 1}
                  </span>
                  {label}
                </div>
                {i < 2 && <ChevronRight className="w-3 h-3 text-[#CBD5E1]" />}
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/scan")}
            className="text-xs text-[#8B9EB0] hover:text-[#1C2B3A] transition-colors"
          >
            ← New scan
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="max-w-2xl mx-auto px-6 pt-10 pb-20 flex flex-col gap-5">

        {/* Step label */}
        <div className="flex items-center gap-2">
          <ScanLine className="w-4 h-4 text-[#8B9EB0]" />
          <span className="text-[11px] font-semibold text-[#8B9EB0] tracking-widest">
            STEP 2 OF 3 — YOUR RESULT
          </span>
        </div>

        {/* ── HEADLINE CARD ── */}
        <Card className="border-[#E4E8EC] shadow-none">
          <CardContent className="p-6">

            {/* Stage badge */}
            <div className="mb-4">
              <StageBadge predicted_class={result.predicted_class} />
            </div>

            {/* The big human sentence — most important thing on the page */}
            <h1 className="text-2xl font-extrabold text-[#1C2B3A] leading-snug tracking-tight mb-2">
              {cfg.headline}
            </h1>
            <p className="text-sm text-[#8B9EB0] leading-relaxed mb-1">
              {cfg.subline}
            </p>
            <p className="text-sm text-[#64748B] leading-relaxed">
              {cfg.detail}
            </p>

            <Separator className="my-5 bg-[#F0F0EE]" />

            {/* Confidence */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#8B9EB0] tracking-wide">
                  AI CONFIDENCE
                </span>
                <span className="text-sm font-bold text-[#1C2B3A] tabular-nums">
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <Progress
                value={result.confidence * 100}
                className="h-2 bg-[#F0F0EE] [&>div]:transition-all [&>div]:duration-700"
                style={{ ["--tw-progress-color" as string]: cfg.barColor }}
              />
              <p className="text-[10px] text-[#CBD5E1] mt-1.5">
                How confident the model is in this specific result
              </p>
            </div>

            {/* Model meta */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#F0F0EE]">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#7BAF8A]" />
                <span className="text-[11px] text-[#8B9EB0]">
                  EfficientNetV2B0 · {result.model_version}
                </span>
              </div>
              {result.inference_ms && (
                <span className="text-[11px] text-[#CBD5E1]">
                  {result.inference_ms} ms
                </span>
              )}
            </div>

          </CardContent>
        </Card>

        {/* ── PROBABILITY BREAKDOWN ── */}
        <Card className="border-[#E4E8EC] shadow-none">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-semibold text-[#8B9EB0] tracking-widest">
                BREAKDOWN BY STAGE
              </span>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-[#CBD5E1] cursor-help" />
                <div
                  className="absolute left-5 -top-1 w-52 bg-[#1C2B3A] text-white text-[11px] leading-relaxed
                              rounded-xl px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none
                              transition-opacity z-10 shadow-lg"
                >
                  All four values add up to 100%. The highest one is the predicted stage.
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              {probRows.map(([cls, prob]) => (
                <ProbBar
                  key={cls}
                  label={CLASS_LABELS[cls] ?? cls}
                  value={prob}
                  color={cfg.barColor}
                  isTop={cls === result.predicted_class}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── GRAD-CAM HEATMAP (show/hide) ── */}
        {result.heatmap_base64 && (
          <Card className="border-[#E4E8EC] shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-[11px] font-semibold text-[#8B9EB0] tracking-widest mb-0.5">
                    WHAT THE AI LOOKED AT
                  </p>
                  <p className="text-xs text-[#8B9EB0]">
                    Warmer colours show which brain regions influenced this result most.
                  </p>
                </div>
                <button
                  onClick={() => setShowHeatmap((v) => !v)}
                  className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                  style={{ color: "#E8A838" }}
                >
                  {showHeatmap
                    ? <><EyeOff className="w-3.5 h-3.5" /> Hide</>
                    : <><Eye className="w-3.5 h-3.5" /> Show</>
                  }
                </button>
              </div>

              {showHeatmap && (
                <div className="mt-4 rounded-xl overflow-hidden border border-[#E4E8EC]"
                  style={{ background: "#0F1923" }}>
                  <img
                    src={`data:image/png;base64,${result.heatmap_base64}`}
                    alt="Grad-CAM brain region heatmap"
                    className="w-full object-contain"
                  />
                  <div className="px-4 py-2.5 flex items-center justify-between">
                    <span className="text-[11px] text-white/40">
                      Red = high attention · Blue = low attention
                    </span>
                    <span className="text-[11px] text-white/40">Grad-CAM</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── LIFESTYLE TIPS ── */}
        <div>
          <div
            className="rounded-xl px-4 py-3 mb-3 flex items-center gap-2.5"
            style={{ background: cfg.tipBg }}
          >
            <div
              className="w-1 h-8 rounded-full flex-shrink-0"
              style={{ background: cfg.tipColor }}
            />
            <p className="text-sm font-semibold text-[#1C2B3A]">{cfg.tipTitle}</p>
          </div>

          <div className="flex flex-col gap-2.5">
            {tips.map((tip) => (
              <TipCard key={tip.title} {...tip} />
            ))}
          </div>
        </div>

        {/* ── AI ASSISTANT CTA ── */}
        <Card
          className="border shadow-none"
          style={{ background: "#FEF9EE", borderColor: "#F5D485" }}
        >
          <CardContent className="p-5">
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#E8A838" }}
              >
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1C2B3A] mb-0.5">
                  Have questions about this result?
                </p>
                <p className="text-xs text-[#8B9EB0] leading-relaxed">
                  Our AI assistant can explain what this means for your daily life,
                  what activities help, and how to prepare for a doctor's visit.
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/chat")}
              className="w-full h-11 text-sm font-semibold rounded-xl gap-2 text-[#1C2B3A]"
              style={{ background: "#E8A838" }}
            >
              <MessageCircle className="w-4 h-4" />
              Ask the AI assistant
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Button>
          </CardContent>
        </Card>

        {/* ── SECONDARY ACTIONS ── */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-11 text-sm rounded-xl border-[#E4E8EC] text-[#8B9EB0] hover:text-[#1C2B3A] gap-2"
            onClick={() => router.push("/scan")}
          >
            <RotateCcw className="w-4 h-4" />
            Scan again
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-11 text-sm rounded-xl border-[#E4E8EC] text-[#8B9EB0] hover:text-[#1C2B3A] gap-2"
            onClick={() => router.push("/report")}
          >
            <FileText className="w-4 h-4" />
            Get full report
          </Button>
          <Button
            variant="outline"
            className="h-11 px-4 text-sm rounded-xl border-[#E4E8EC] text-[#8B9EB0] hover:text-[#1C2B3A]"
            aria-label="Download result"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* ── DISCLAIMER ── */}
        <div
          className="rounded-xl border border-[#E4E8EC] p-4 flex items-start gap-3"
          style={{ background: "#fff" }}
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#CBD5E1]" />
          <p className="text-xs text-[#8B9EB0] leading-relaxed">
            This result is from an AI screening tool and is{" "}
            <strong className="font-semibold text-[#64748B]">not a medical diagnosis</strong>.
            If you are concerned about memory changes, please speak with your GP
            or a neurologist who can assess you properly.
          </p>
        </div>

      </main>
    </div>
  );
}