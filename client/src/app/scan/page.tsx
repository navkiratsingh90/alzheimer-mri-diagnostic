"use client";

import {
  useState,
  useRef,
  useCallback,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  Upload,
  X,
  ImageIcon,
  Info,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ScanLine,
  ShieldCheck,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// ─── Types ────────────────────────────────────────────────────
type PageState = "idle" | "preview" | "analysing" | "done" | "error";

interface FileInfo {
  name: string;
  sizeLabel: string;
  preview: string;
}

// ─── Helpers ──────────────────────────────────────────────────
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const PROGRESS_STEPS = [
  { at: 0,  text: "Preparing your scan…"          },
  { at: 20, text: "Reading the MRI image…"         },
  { at: 45, text: "Looking for patterns…"          },
  { at: 68, text: "Building your result…"          },
  { at: 88, text: "Almost there…"                  },
];

function getProgressLabel(pct: number): string {
  for (let i = PROGRESS_STEPS.length - 1; i >= 0; i--) {
    if (pct >= PROGRESS_STEPS[i].at) return PROGRESS_STEPS[i].text;
  }
  return PROGRESS_STEPS[0].text;
}

// ─── What to upload guide ─────────────────────────────────────
const UPLOAD_TIPS = [
  { ok: true,  text: "Axial brain MRI scan"     },
  { ok: true,  text: "JPG or PNG format"         },
  { ok: true,  text: "Clear, well-lit image"     },
  { ok: false, text: "X-rays or CT scans"        },
  { ok: false, text: "Blurry or rotated images"  },
];

// ─── Page ──────────────────────────────────────────────────────
export default function ScanPage() {
  const router    = useRouter();
  const inputRef  = useRef<HTMLInputElement>(null);

  const [state,    setState]    = useState<PageState>("idle");
  const [dragging, setDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [file,     setFile]     = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error,    setError]    = useState<string | null>(null);

  // ── File validation + preview ──────────────────────────────
  const processFile = useCallback((f: File) => {
    setError(null);

    if (!["image/jpeg", "image/png"].includes(f.type)) {
      setError("Only JPG and PNG images are accepted. Please choose a brain MRI scan.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File is too large. Please upload an image under 10 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileInfo({
        name:      f.name,
        sizeLabel: formatBytes(f.size),
        preview:   e.target?.result as string,
      });
      setFile(f);
      setState("preview");
    };
    reader.readAsDataURL(f);
  }, []);

  // ── Drag handlers ──────────────────────────────────────────
  const onDragOver  = (e: DragEvent) => { e.preventDefault(); setDragging(true);  };
  const onDragLeave = (e: DragEvent) => { e.preventDefault(); setDragging(false); };
  const onDrop      = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };

  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const openPicker = () => inputRef.current?.click();

  // ── Reset ──────────────────────────────────────────────────
  const reset = () => {
    setState("idle");
    setFileInfo(null);
    setFile(null);
    setProgress(0);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── Analyse ────────────────────────────────────────────────
  const handleAnalyse = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setState("analysing");
    setProgress(0);
    setError(null);

    // Increment progress while waiting for the API
    const tick = setInterval(() => {
      setProgress((p) => (p >= 88 ? p : p + Math.random() * 10));
    }, 380);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("http://localhost:8000/api/v1/predict", {
        method:  "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
        body:    form,
      });

      clearInterval(tick);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail ?? `Server error (${res.status})`);
      }

      const result = await res.json();
      setProgress(100);
      setState("done");

      // Store for result page
      localStorage.setItem("scanResult", JSON.stringify(result));

      // Small pause so the user sees the 100 % state
      setTimeout(() => router.push("/result"), 700);
    } catch (err: unknown) {
      clearInterval(tick);
      setState("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please check your connection and try again."
      );
    }
  };

  // ── Derived states ─────────────────────────────────────────
  const showDropZone  = state === "idle"  || (state === "error" && !fileInfo);
  const showPreview   = state === "preview" || (state === "error" && !!fileInfo);
  const showAnalysing = state === "analysing";
  const showDone      = state === "done";

  return (
    <div
      className="min-h-screen bg-[#FAFAF8]"
      style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}
    >

      {/* ── Topbar ── */}
      <header className="sticky top-0 z-40 border-b border-[#E4E8EC] bg-[#FAFAF8]/95 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #E8A838, #D4922A)" }}>
              <Brain className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
            </div>
            <span className="text-sm font-bold text-[#1C2B3A]">MindCheck</span>
          </Link>

          {/* Step pills */}
          <div className="flex items-center gap-1.5">
            {["Upload", "Result", "Chat"].map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`
                  flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium
                  ${i === 0
                    ? "bg-[#1C2B3A] text-white"
                    : "bg-[#F0F0EE] text-[#8B9EB0]"
                  }
                `}>
                  <span className={`
                    w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold
                    ${i === 0 ? "bg-white/20 text-white" : ""}
                  `}>
                    {i + 1}
                  </span>
                  {label}
                </div>
                {i < 2 && (
                  <ChevronRight className="w-3 h-3 text-[#CBD5E1]" />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs text-[#8B9EB0] hover:text-[#1C2B3A] transition-colors"
          >
            Cancel
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-2xl mx-auto px-6 pt-10 pb-20">

        {/* Page heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ScanLine className="w-4 h-4 text-[#8B9EB0]" />
            <span className="text-[11px] font-semibold text-[#8B9EB0] tracking-widest">
              STEP 1 OF 3
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1C2B3A] tracking-tight mb-1.5">
            Upload your MRI scan
          </h1>
          <p className="text-sm text-[#8B9EB0] leading-relaxed max-w-sm">
            We'll analyse it in seconds and give you a clear, plain-English
            explanation of what it shows.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700 leading-relaxed">{error}</p>
              {state === "error" && fileInfo && (
                <button
                  onClick={() => { setError(null); setState("preview"); }}
                  className="text-xs text-red-600 font-medium underline underline-offset-2 mt-1"
                >
                  Try again with this file
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── UPLOAD ZONE ── */}
        {showDropZone && (
          <div>
            <div
              onClick={openPicker}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openPicker()}
              aria-label="Upload MRI scan — click or drag a file here"
              className={`
                relative flex flex-col items-center justify-center gap-5
                rounded-2xl border-2 border-dashed h-64 cursor-pointer
                select-none transition-all outline-none
                focus-visible:ring-2 focus-visible:ring-[#E8A838] focus-visible:ring-offset-2
                ${dragging
                  ? "border-[#E8A838] bg-[#FEF9EE]"
                  : "border-[#E4E8EC] bg-white hover:border-[#E8A838] hover:bg-[#FFFDF7]"
                }
              `}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={onFileInput}
                aria-hidden="true"
              />

              {/* Upload icon */}
              <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center transition-colors
                ${dragging ? "bg-[#E8A838]" : "bg-[#F5F4F2]"}
              `}>
                <Upload
                  className={`w-7 h-7 transition-colors ${dragging ? "text-white" : "text-[#CBD5E1]"}`}
                />
              </div>

              <div className="text-center px-6">
                <p className="text-sm font-semibold text-[#1C2B3A] mb-1">
                  {dragging ? "Drop your scan here" : "Drag your MRI scan here"}
                </p>
                <p className="text-xs text-[#8B9EB0]">
                  or{" "}
                  <span
                    className="font-semibold underline underline-offset-2"
                    style={{ color: "#E8A838" }}
                  >
                    browse files
                  </span>
                  {" "}— JPG or PNG, up to 10 MB
                </p>
              </div>
            </div>

            {/* Guide */}
            <Card className="mt-4 border-[#E4E8EC] shadow-none">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-3.5 h-3.5 text-[#8B9EB0]" />
                  <span className="text-[11px] font-semibold text-[#8B9EB0] tracking-widest">
                    WHAT TO UPLOAD
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {UPLOAD_TIPS.map(({ ok, text }) => (
                    <div key={text} className="flex items-center gap-2">
                      <div className={`
                        w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                        ${ok ? "bg-[#F4FAF6]" : "bg-red-50"}
                      `}>
                        {ok
                          ? <CheckCircle2 className="w-3 h-3" style={{ color: "#7BAF8A" }} />
                          : <X className="w-3 h-3 text-red-400" />
                        }
                      </div>
                      <span className="text-xs text-[#64748B]">{text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── PREVIEW ── */}
        {showPreview && fileInfo && (
          <form onSubmit={handleAnalyse} className="flex flex-col gap-4">
            <Card className="border-[#E4E8EC] shadow-none overflow-hidden">
              {/* Image viewer */}
              <div className="relative bg-[#0F1923] h-72 flex items-center justify-center">
                <img
                  src={fileInfo.preview}
                  alt="Your MRI scan preview"
                  className="h-full w-full object-contain"
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Remove file"
                  className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center backdrop-blur-sm transition-colors"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>

                {/* File badge */}
                <div className="absolute bottom-3 left-3">
                  <Badge
                    className="border-0 text-[10px] font-medium px-2 py-0.5"
                    style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
                  >
                    Brain MRI · Axial
                  </Badge>
                </div>
              </div>

              {/* File meta strip */}
              <CardContent className="p-0">
                <div className="flex items-center justify-between px-5 py-4 bg-white border-t border-[#E4E8EC]">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "#FEF3DC" }}
                    >
                      <ImageIcon className="w-4 h-4" style={{ color: "#E8A838" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1C2B3A] leading-tight truncate max-w-[230px]">
                        {fileInfo.name}
                      </p>
                      <p className="text-xs text-[#8B9EB0] mt-0.5">{fileInfo.sizeLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: "#7BAF8A" }} />
                    <span className="text-xs font-medium" style={{ color: "#7BAF8A" }}>
                      Ready
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action row */}
            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 h-12 text-sm font-semibold rounded-xl gap-2 text-[#1C2B3A]"
                style={{ background: "#E8A838" }}
              >
                <Brain className="w-4 h-4" />
                Analyse my scan
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={reset}
                className="h-12 px-5 rounded-xl border-[#E4E8EC] text-[#8B9EB0] hover:text-[#1C2B3A] text-sm"
              >
                Remove
              </Button>
            </div>
          </form>
        )}

        {/* ── ANALYSING ── */}
        {showAnalysing && fileInfo && (
          <Card className="border-[#E4E8EC] shadow-none overflow-hidden">
            {/* Dimmed MRI with overlay */}
            <div className="relative bg-[#0F1923] h-72 flex items-center justify-center">
              <img
                src={fileInfo.preview}
                alt="Analysing your scan"
                className="h-full w-full object-contain opacity-20"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                {/* Pulsing amber ring */}
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(232,168,56,0.15)", border: "1px solid rgba(232,168,56,0.4)" }}
                  >
                    <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#E8A838" }} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white text-sm font-semibold">
                    {getProgressLabel(progress)}
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    {Math.round(progress)}% complete
                  </p>
                </div>
              </div>
            </div>

            {/* Progress strip */}
            <CardContent className="p-0">
              <div className="px-5 py-4 bg-white border-t border-[#E4E8EC]">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="text-[#8B9EB0]">{getProgressLabel(progress)}</span>
                  <span className="font-bold text-[#1C2B3A]">{Math.round(progress)}%</span>
                </div>
                <Progress
                  value={progress}
                  className="h-1.5 bg-[#F0F0EE] [&>div]:bg-[#E8A838] [&>div]:transition-all [&>div]:duration-300"
                />
                <p className="text-[10px] text-[#CBD5E1] mt-2.5 text-center">
                  Do not close this tab while analysis is running
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── DONE ── */}
        {showDone && (
          <Card className="border-[#E4E8EC] shadow-none overflow-hidden">
            <div className="h-72 bg-white flex flex-col items-center justify-center gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "#F4FAF6" }}
              >
                <CheckCircle2 className="w-7 h-7" style={{ color: "#7BAF8A" }} />
              </div>
              <p className="text-sm font-semibold text-[#1C2B3A]">Analysis complete</p>
              <p className="text-xs text-[#8B9EB0]">Taking you to your result…</p>
            </div>
          </Card>
        )}

        {/* ── Trust / privacy footer ── */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center justify-center gap-6">
            {[
              { icon: Clock,       text: "Result in under 2 minutes" },
              { icon: ShieldCheck, text: "Your scan stays private"   },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-[#CBD5E1]" />
                <span className="text-[11px] text-[#CBD5E1]">{text}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-[#CBD5E1] leading-relaxed">
            This is a screening tool, not a medical diagnosis.
            Always consult a qualified doctor with your results.
          </p>
        </div>

      </main>
    </div>
  );
}