"use client";

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Scan,
  Image,
  X,
  Check,
  AlertCircle,
  Loader2,
  Brain,
  Activity,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────
type UploadState = "idle" | "preview" | "analysing" | "done" | "error";

interface FileInfo {
  name: string;
  size: string;
  preview: string;
}

// ── Helpers ───────────────────────────────────────────────────
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Step indicator ────────────────────────────────────────────
const steps = ["Upload", "Analyse", "Results"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-3">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`
                w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors
                ${done ? "bg-[#0EA472] text-white" : active ? "bg-[#0D1B2A] text-white" : "bg-[#F1F5F9] text-[#94A3B8]"}
              `}>
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-sm font-medium ${active ? "text-[#0D1B2A]" : done ? "text-[#0EA472]" : "text-[#94A3B8]"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-10 h-px ${done ? "bg-[#0EA472]" : "bg-[#E8EDF2]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Guidelines sidebar card ───────────────────────────────────
function GuidelinesCard() {
  const tips = [
    { label: "Accepted formats", value: "JPG, PNG" },
    { label: "Recommended size", value: "176 × 208 px or larger" },
    { label: "Scan type", value: "Axial brain MRI" },
    { label: "Max file size", value: "10 MB" },
  ];

  return (
    <Card className="border-[#E8EDF2] shadow-none">
      <CardContent className="p-5">
        <p className="text-xs font-semibold text-[#0EA472] tracking-widest mb-4">SCAN GUIDELINES</p>
        <div className="flex flex-col gap-3">
          {tips.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-xs text-[#94A3B8] font-medium">{label}</span>
              <span className="text-sm text-[#0D1B2A] font-medium">{value}</span>
            </div>
          ))}
        </div>

        <Separator className="my-4 bg-[#E8EDF2]" />

        <p className="text-xs font-semibold text-[#94A3B8] tracking-widest mb-3">WHAT HAPPENS NEXT</p>
        <div className="flex flex-col gap-2.5">
          {[
            "EfficientNetV2B0 classifies the scan",
            "Grad-CAM heatmap is generated",
            "Confidence scores for all 4 stages",
            "AI clinical report is ready",
          ].map((step, i) => (
            <div key={step} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-md bg-[#EDF7F3] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[9px] font-bold text-[#0EA472]">{i + 1}</span>
              </div>
              <span className="text-xs text-[#64748B] leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<UploadState>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  // Progress label per step
  const progressLabel =
    progress < 30 ? "Preprocessing image..." :
    progress < 60 ? "Running EfficientNetV2B0..." :
    progress < 85 ? "Generating Grad-CAM heatmap..." :
    "Preparing results...";

  // ── File validation + preview ──────────────────────────────
  const processFile = useCallback((file: File) => {
    setError(null);

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Only JPG and PNG files are accepted. Please upload a valid MRI image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds 10 MB. Please upload a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileInfo({
        name: file.name,
        size: formatBytes(file.size),
        preview: e.target?.result as string,
      });
      setCurrentFile(file);
      setState("preview");
    };
    reader.readAsDataURL(file);
  }, []);

  // ── Drag handlers ──────────────────────────────────────────
  const onDragOver = (e: DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e: DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // ── Analyse ────────────────────────────────────────────────
  const handleAnalyse = async () => {
    if (!currentFile) return;
    setState("analysing");
    setProgress(0);

    // Simulate progress ticks while API call runs
    const tick = setInterval(() => {
      setProgress((p) => (p >= 88 ? p : p + Math.random() * 12));
    }, 400);

    try {
      const form = new FormData();
      form.append("file", currentFile);

      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: form,
      });

      clearInterval(tick);

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setProgress(100);
      setState("done");

      // Store and navigate after a brief moment
      localStorage.setItem("lastResult", JSON.stringify(data));
      setTimeout(() => router.push("/result"), 600);
    } catch (err) {
      clearInterval(tick);
      setState("error");
      setError("Analysis failed. Make sure the backend is running at localhost:8000.");
    }
  };

  const handleReset = () => {
    setState("idle");
    setFileInfo(null);
    setCurrentFile(null);
    setProgress(0);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── Current step index for the step indicator ──────────────
  const stepIndex = state === "idle" || state === "preview" || state === "error" ? 0
    : state === "analysing" ? 1
    : 2;

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-sans">

      {/* ── Topbar ── */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-[#F8FAFB]/90 backdrop-blur-md border-b border-[#E8EDF2] flex items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#0EA472] to-[#059669] flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-[#0D1B2A] tracking-tight">
            Neuro<span className="text-[#0EA472]">Sight</span>
          </span>
        </div>

        <StepIndicator current={stepIndex} />

        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-[#64748B] hover:text-[#0D1B2A] font-medium transition-colors"
        >
          Cancel
        </button>
      </header>

      {/* ── Main content ── */}
      <main className="pt-24 pb-16 px-8 max-w-5xl mx-auto">

        {/* Page heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-md bg-[#EDF7F3] flex items-center justify-center text-[#0EA472]">
              <Scan className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-[#0EA472] tracking-widest">MRI ANALYSIS</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0D1B2A] tracking-tight mb-1.5">
            Upload a brain MRI scan
          </h1>
          <p className="text-sm text-[#64748B] max-w-md leading-relaxed">
            Upload an axial MRI image to classify Alzheimer's stage, generate a
            Grad-CAM heatmap, and get an AI clinical summary.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-[1fr_268px] gap-6 items-start">

          {/* ── Left: upload area ── */}
          <div className="flex flex-col gap-4">

            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700 leading-relaxed">{error}</p>
              </div>
            )}

            {/* Drop zone / preview / analysing */}
            <Card className="border-[#E8EDF2] shadow-none overflow-hidden">
              <CardContent className="p-0">

                {/* ── IDLE — drop zone ── */}
                {(state === "idle" || (state === "error" && !fileInfo)) && (
                  <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`
                      relative flex flex-col items-center justify-center gap-4
                      h-72 cursor-pointer select-none transition-colors rounded-xl
                      border-2 border-dashed
                      ${isDragging
                        ? "border-[#0EA472] bg-[#EDF7F3]"
                        : "border-[#E8EDF2] bg-white hover:border-[#0EA472] hover:bg-[#F8FAFB]"
                      }
                    `}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      className="hidden"
                      onChange={onInputChange}
                    />
                    <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center transition-colors
                      ${isDragging ? "bg-[#0EA472] text-white" : "bg-[#F1F5F9] text-[#94A3B8]"}
                    `}>
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[#0D1B2A] mb-1">
                        {isDragging ? "Drop to upload" : "Drag and drop your MRI scan"}
                      </p>
                      <p className="text-xs text-[#94A3B8]">
                        or{" "}
                        <span className="text-[#0EA472] font-medium underline underline-offset-2">
                          browse files
                        </span>
                        {" "}— JPG or PNG, up to 10 MB
                      </p>
                    </div>
                  </div>
                )}

                {/* ── PREVIEW — image selected ── */}
                {(state === "preview" || (state === "error" && fileInfo)) && fileInfo && (
                  <div className="bg-white rounded-xl">
                    {/* Image area */}
                    <div className="relative bg-[#0D1B2A] rounded-t-xl overflow-hidden h-64 flex items-center justify-center">
                      <img
                        src={fileInfo.preview}
                        alt="MRI preview"
                        className="h-full w-full object-contain"
                      />
                      {/* Remove button */}
                      <button
                        onClick={handleReset}
                        className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      {/* Format badge */}
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-white/10 backdrop-blur-sm text-white border-0 text-[10px] font-medium px-2 py-0.5">
                          MRI · Axial
                        </Badge>
                      </div>
                    </div>

                    {/* File meta strip */}
                    <div className="px-5 py-4 flex items-center justify-between border-t border-[#E8EDF2]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#EDF7F3] flex items-center justify-center text-[#0EA472]">
                          <Image className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0D1B2A] leading-tight truncate max-w-[240px]">
                            {fileInfo.name}
                          </p>
                          <p className="text-xs text-[#94A3B8] mt-0.5">{fileInfo.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#0EA472]" />
                        <span className="text-xs font-medium text-[#0EA472]">Ready</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── ANALYSING — progress view ── */}
                {state === "analysing" && fileInfo && (
                  <div className="bg-white rounded-xl">
                    {/* Dimmed image with overlay */}
                    <div className="relative bg-[#0D1B2A] rounded-t-xl overflow-hidden h-64 flex items-center justify-center">
                      <img
                        src={fileInfo.preview}
                        alt="MRI being analysed"
                        className="h-full w-full object-contain opacity-30"
                      />
                      {/* Scanning overlay lines */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white">
                          <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                        <div className="text-center">
                          <p className="text-white text-sm font-semibold">{progressLabel}</p>
                          <p className="text-white/50 text-xs mt-1">{Math.round(progress)}% complete</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress strip */}
                    <div className="px-5 py-4 border-t border-[#E8EDF2]">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-medium text-[#64748B]">{progressLabel}</span>
                        <span className="text-xs font-bold text-[#0D1B2A]">{Math.round(progress)}%</span>
                      </div>
                      <Progress
                        value={progress}
                        className="h-1.5 bg-[#F1F5F9] [&>div]:bg-[#0EA472] [&>div]:transition-all [&>div]:duration-300"
                      />
                    </div>
                  </div>
                )}

                {/* ── DONE ── */}
                {state === "done" && (
                  <div className="bg-white rounded-xl h-72 flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#EDF7F3] flex items-center justify-center text-[#0EA472]">
                      <Check className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-semibold text-[#0D1B2A]">Analysis complete</p>
                    <p className="text-xs text-[#94A3B8]">Redirecting to results…</p>
                  </div>
                )}

              </CardContent>
            </Card>

            {/* ── Action buttons ── */}
            {state === "preview" && (
              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyse}
                  className="flex-1 h-11 bg-[#0D1B2A] hover:bg-[#1E3A5F] text-white text-sm font-semibold rounded-xl gap-2 transition-colors"
                >
                  <Scan className="w-4 h-4" />
                  Analyse Scan
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="h-11 px-5 border-[#E8EDF2] text-[#64748B] hover:text-[#0D1B2A] text-sm font-medium rounded-xl transition-colors"
                >
                  Remove
                </Button>
              </div>
            )}

            {state === "error" && fileInfo && (
              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyse}
                  className="flex-1 h-11 bg-[#0D1B2A] hover:bg-[#1E3A5F] text-white text-sm font-semibold rounded-xl gap-2"
                >
                  Retry Analysis
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="h-11 px-5 border-[#E8EDF2] text-[#64748B] text-sm font-medium rounded-xl"
                >
                  Change file
                </Button>
              </div>
            )}

            {state === "idle" && (
              <Button
                onClick={() => inputRef.current?.click()}
                variant="outline"
                className="w-full h-11 border-[#E8EDF2] text-[#64748B] hover:text-[#0D1B2A] hover:border-[#0EA472] text-sm font-medium rounded-xl transition-colors"
              >
                Browse files instead
              </Button>
            )}

            {/* ── What the model detects ── */}
            <Card className="border-[#E8EDF2] shadow-none">
              <CardContent className="p-5">
                <p className="text-xs font-semibold text-[#94A3B8] tracking-widest mb-4">
                  CLASSIFICATION STAGES
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Non Demented", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                    { label: "Very Mild", color: "bg-blue-50 border-blue-200 text-blue-700" },
                    { label: "Mild", color: "bg-amber-50 border-amber-200 text-amber-700" },
                    { label: "Moderate", color: "bg-red-50 border-red-200 text-red-700" },
                  ].map(({ label, color }) => (
                    <div key={label} className={`border rounded-lg px-3 py-2.5 text-center ${color}`}>
                      <span className="text-xs font-medium leading-tight block">{label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#94A3B8] mt-3 leading-relaxed">
                  The model returns a probability for each stage. The highest probability determines the predicted class.
                </p>
              </CardContent>
            </Card>

          </div>

          {/* ── Right sidebar ── */}
          <div className="flex flex-col gap-4">
            <GuidelinesCard />

            {/* Model info card */}
            <Card className="border-[#E8EDF2] shadow-none">
              <CardContent className="p-5">
                <p className="text-xs font-semibold text-[#94A3B8] tracking-widest mb-4">MODEL</p>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-0.5">Architecture</p>
                    <p className="text-sm font-semibold text-[#0D1B2A]">EfficientNetV2B0</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-0.5">Validation accuracy</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#0D1B2A]">93.2%</p>
                      <Progress value={93.2} className="flex-1 h-1.5 bg-[#F1F5F9] [&>div]:bg-[#0EA472]" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-0.5">Trained on</p>
                    <p className="text-sm font-semibold text-[#0D1B2A]">Kaggle · 6,400 MRI scans</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-0.5">Inference time</p>
                    <p className="text-sm font-semibold text-[#0D1B2A]">{"< 2 seconds"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                For research use only. Not a certified medical device. Always consult a qualified neurologist.
              </p>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}