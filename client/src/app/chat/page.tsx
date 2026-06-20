"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Brain,
  ChevronRight,
  Send,
  RotateCcw,
  ChevronLeft,
  Sparkles,
  AlertCircle,
  FileText,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// ─── Types (matching ChatRequest / ChatMessageResponse schema) ─
interface Message {
  id:        string;
  role:      "user" | "assistant";
  content:   string;
  streaming: boolean; // true only while SSE is writing this message
}

interface ScanResult {
  predicted_class:      string;
  confidence:           number;
  class_probabilities:  Record<string, number>;
  severity_score:       number;
}

// ─── Stage label helpers ───────────────────────────────────────
const STAGE_LABELS: Record<string, string> = {
  NonDemented:      "No signs detected",
  VeryMildDemented: "Very early changes",
  MildDemented:     "Mild changes",
  ModerateDemented: "Moderate changes",
};

const STAGE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  NonDemented:      { bg: "#EDF7F2", text: "#1A6B3A", dot: "#7BAF8A" },
  VeryMildDemented: { bg: "#FEF9EE", text: "#8B6315", dot: "#E8A838" },
  MildDemented:     { bg: "#FFF4E8", text: "#7A3C00", dot: "#D97706" },
  ModerateDemented: { bg: "#FFF0F0", text: "#7A1C1C", dot: "#DC2626" },
};

// ─── Suggested opening questions ──────────────────────────────
// Tailored per stage so they feel personal, not generic
const SUGGESTIONS: Record<string, string[]> = {
  NonDemented: [
    "What can I do to keep my brain healthy long-term?",
    "Are there early warning signs I should watch for?",
    "How often should I get an MRI scan?",
    "What lifestyle habits protect against Alzheimer's?",
  ],
  VeryMildDemented: [
    "What does 'very early changes' mean for my daily life?",
    "Can this stage be reversed or slowed down?",
    "What activities help the most right now?",
    "Should I tell my family about this result?",
  ],
  MildDemented: [
    "What does mild memory change mean day to day?",
    "Should I see a doctor about this?",
    "What questions should I ask my GP?",
    "What support is available to me?",
  ],
  ModerateDemented: [
    "What does this result mean for my independence?",
    "Who should I contact first?",
    "How can my family support me?",
    "What treatment options are available?",
  ],
};

// ─── Opening message from the AI (stage-aware) ────────────────
function getOpeningMessage(stage: string): string {
  const intros: Record<string, string> = {
    NonDemented:
      "Hi — your scan came back with no signs of Alzheimer's disease, which is good news. I'm here to answer any questions you have: what this result means, how to keep your brain healthy, or what to look out for going forward. What would you like to know?",
    VeryMildDemented:
      "Hi — your scan showed very early signs of memory change. That can feel unsettling to read, but this stage is actually when you have the most options. I'm here to answer your questions clearly and honestly. What's on your mind?",
    MildDemented:
      "Hi — your scan showed mild memory changes. I know that's not easy to read, and you probably have a lot of questions. I'll do my best to give you clear, straightforward answers. Ask me anything — what this means, what to do next, or anything else.",
    ModerateDemented:
      "Hi — your scan showed moderate memory changes. This is an important result and I want to help you understand it and know what to do. I'm here to answer your questions honestly and help you figure out next steps. What would you like to know first?",
  };
  return intros[stage] ?? intros.NonDemented;
}

// ─── Unique ID generator ──────────────────────────────────────
let idCounter = 0;
function uid() {
  return `msg-${Date.now()}-${++idCounter}`;
}

// ─── Typing indicator ─────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1 px-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full animate-bounce"
          style={{
            background: "#CBD5E1",
            animationDelay: `${i * 150}ms`,
            animationDuration: "900ms",
          }}
        />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function ChatPage() {
  const router    = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  const [messages,   setMessages]   = useState<Message[]>([]);
  const [input,      setInput]      = useState("");
  const [streaming,  setStreaming]  = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [apiError,   setApiError]   = useState<string | null>(null);

  // ── Load scan result + opening message on mount ────────────
  useEffect(() => {
    const raw = localStorage.getItem("scanResult");
    let stage = "NonDemented";

    if (raw) {
      const parsed: ScanResult = JSON.parse(raw);
      setScanResult(parsed);
      stage = parsed.predicted_class;
    }

    setMessages([
      {
        id:        uid(),
        role:      "assistant",
        content:   getOpeningMessage(stage),
        streaming: false,
      },
    ]);
  }, []);

  // ── Auto-scroll on new message ─────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Auto-grow textarea ─────────────────────────────────────
  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Reset height then set to scrollHeight so it grows naturally
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
  };

  // ── Core send function ─────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    setInput("");
    setApiError(null);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    // Add user message
    const userMsg: Message = { id: uid(), role: "user", content: trimmed, streaming: false };
    setMessages((prev) => [...prev, userMsg]);
    setStreaming(true);

    // Add empty AI message to stream into
    const aiId = uid();
    setMessages((prev) => [
      ...prev,
      { id: aiId, role: "assistant", content: "", streaming: true },
    ]);

    try {
      const res = await fetch("http://localhost:8000/api/v1/chat/message", {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: JSON.stringify({
          message:     trimmed,
          scan_id:     scanResult ? undefined : undefined,
          scan_result: scanResult ?? null,
        } satisfies { message: string; scan_id?: string; scan_result: ScanResult | null }),
      });

      if (!res.ok) {
        throw new Error(`Server error (${res.status})`);
      }

      // Read SSE stream token by token
      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value, { stream: true }).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") break;

          try {
            const { token } = JSON.parse(payload) as { token: string };
            if (token) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiId
                    ? { ...m, content: m.content + token }
                    : m
                )
              );
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }

      // Mark AI message as done streaming
      setMessages((prev) =>
        prev.map((m) => (m.id === aiId ? { ...m, streaming: false } : m))
      );
    } catch (err: unknown) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId
            ? {
                ...m,
                content:   "I couldn't connect right now. Please check your connection and try again.",
                streaming: false,
              }
            : m
        )
      );
      setApiError(
        err instanceof Error ? err.message : "Connection failed."
      );
    } finally {
      setStreaming(false);
    }
  }, [streaming, scanResult]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    const stage = scanResult?.predicted_class ?? "NonDemented";
    setMessages([
      {
        id:        uid(),
        role:      "assistant",
        content:   "Chat cleared — what else would you like to know?",
        streaming: false,
      },
    ]);
    setApiError(null);
  };

  const suggestions =
    SUGGESTIONS[scanResult?.predicted_class ?? "NonDemented"] ??
    SUGGESTIONS.NonDemented;

  const showSuggestions =
    messages.length === 1 && !streaming;

  const stageColor =
    STAGE_COLORS[scanResult?.predicted_class ?? "NonDemented"] ??
    STAGE_COLORS.NonDemented;

  return (
    <div
      className="flex flex-col h-screen bg-[#FAFAF8]"
      style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}
    >

      {/* ── Topbar ── */}
      <header className="flex-shrink-0 border-b border-[#E4E8EC] bg-[#FAFAF8]/95 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Back + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className="w-8 h-8 rounded-xl border border-[#E4E8EC] flex items-center justify-center text-[#8B9EB0] hover:text-[#1C2B3A] hover:border-[#CBD5E1] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #E8A838, #D4922A)" }}
              >
                <Brain className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1C2B3A] leading-none">AI Assistant</p>
                <p className="text-[10px] text-[#8B9EB0] mt-0.5">
                  {streaming ? "Typing…" : "Online"}
                </p>
              </div>
            </Link>
          </div>

          {/* Step pills */}
          <div className="hidden sm:flex items-center gap-1.5">
            {["Upload", "Result", "Chat"].map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className={`
                    flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium
                    ${i === 2
                      ? "bg-[#1C2B3A] text-white"
                      : "bg-[#F0F0EE] text-[#8B9EB0]"
                    }
                  `}
                >
                  <span className="text-[9px] font-bold">
                    {i < 2 ? "✓" : "3"}
                  </span>
                  {label}
                </div>
                {i < 2 && <ChevronRight className="w-3 h-3 text-[#CBD5E1]" />}
              </div>
            ))}
          </div>

          {/* Clear */}
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 text-xs text-[#8B9EB0] hover:text-[#1C2B3A] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </header>

      {/* ── Scan context strip (pinned below topbar) ── */}
      {scanResult && (
        <div
          className="flex-shrink-0 border-b border-[#E4E8EC]"
          style={{ background: "#fff" }}
        >
          <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#E8A838" }} />
              <p className="text-xs text-[#64748B] truncate">
                Answering about your scan —
              </p>
              <div
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background: stageColor.bg }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: stageColor.dot }}
                />
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: stageColor.text }}
                >
                  {STAGE_LABELS[scanResult.predicted_class] ?? scanResult.predicted_class}
                </span>
              </div>
              <span className="text-[11px] text-[#CBD5E1] flex-shrink-0">
                {(scanResult.confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
            <button
              onClick={() => router.push("/result")}
              className="text-[11px] font-medium flex-shrink-0 hover:underline underline-offset-2 transition-colors"
              style={{ color: "#E8A838" }}
            >
              See result
            </button>
          </div>
        </div>
      )}

      {/* ── Message thread ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-6 flex flex-col gap-5">

          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            const isLast = index === messages.length - 1;

            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2.5`}
              >
                {/* AI avatar — only on assistant messages */}
                {!isUser && (
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "linear-gradient(135deg, #E8A838, #D4922A)" }}
                    aria-hidden="true"
                  >
                    <Brain className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
                  </div>
                )}

                <div
                  className={`
                    max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                    ${isUser
                      ? "rounded-br-md text-white"
                      : "rounded-bl-md text-[#1C2B3A] border border-[#E4E8EC]"
                    }
                  `}
                  style={{
                    background: isUser ? "#1C2B3A" : "#fff",
                  }}
                >
                  {/* Show typing dots if streaming and content is empty */}
                  {msg.streaming && !msg.content
                    ? <TypingDots />
                    : msg.content
                  }

                  {/* Streaming cursor — only on the last AI message while streaming */}
                  {msg.streaming && msg.content && isLast && (
                    <span
                      className="inline-block w-0.5 h-3.5 ml-0.5 rounded-full align-middle animate-pulse"
                      style={{ background: "#E8A838" }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
            );
          })}

          {/* Suggested questions — shown only at the start */}
          {showSuggestions && (
            <div className="flex flex-col gap-2 pl-9">
              <p className="text-[11px] text-[#CBD5E1] font-medium mb-0.5">
                Things people ask:
              </p>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left text-xs border border-[#E4E8EC] rounded-xl px-4 py-2.5 text-[#1C2B3A] hover:border-[#E8A838] hover:bg-[#FFFDF7] transition-all"
                  style={{ background: "#fff" }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* API error inline */}
          {apiError && (
            <div className="flex items-start gap-2.5 pl-9">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-500">{apiError}</p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Quick links (report + result) above input ── */}
      <div className="flex-shrink-0" style={{ background: "#fff" }}>
        <div className="max-w-2xl mx-auto px-6 pt-3">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => router.push("/result")}
              className="flex items-center gap-1.5 text-[11px] text-[#8B9EB0] hover:text-[#1C2B3A] transition-colors px-2.5 py-1 rounded-lg border border-[#E4E8EC] hover:border-[#CBD5E1]"
              style={{ background: "#FAFAF8" }}
            >
              <MessageCircle className="w-3 h-3" />
              Back to result
            </button>
            <button
              onClick={() => router.push("/report")}
              className="flex items-center gap-1.5 text-[11px] text-[#8B9EB0] hover:text-[#1C2B3A] transition-colors px-2.5 py-1 rounded-lg border border-[#E4E8EC] hover:border-[#CBD5E1]"
              style={{ background: "#FAFAF8" }}
            >
              <FileText className="w-3 h-3" />
              Get full report
            </button>
          </div>
          <Separator className="bg-[#E4E8EC]" />
        </div>
      </div>

      {/* ── Input bar ── */}
      <div className="flex-shrink-0 pb-safe" style={{ background: "#fff" }}>
        <div className="max-w-2xl mx-auto px-6 py-4">
          <form onSubmit={onSubmit}>
            <div
              className="flex items-end gap-3 rounded-2xl border px-4 py-3 transition-colors focus-within:border-[#E8A838]"
              style={{ background: "#FAFAF8", borderColor: "#E4E8EC" }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                placeholder="Ask anything about your result…"
                disabled={streaming}
                rows={1}
                aria-label="Message input"
                className="flex-1 resize-none bg-transparent text-sm text-[#1C2B3A] placeholder:text-[#CBD5E1] outline-none leading-relaxed disabled:opacity-50"
                style={{ minHeight: "24px", maxHeight: "128px" }}
              />

              <Button
                type="submit"
                disabled={!input.trim() || streaming}
                size="icon"
                aria-label="Send message"
                className="w-9 h-9 rounded-xl flex-shrink-0 disabled:opacity-30 transition-opacity"
                style={{ background: "#E8A838" }}
              >
                <Send className="w-4 h-4 text-[#1C2B3A]" />
              </Button>
            </div>

            <p className="text-[10px] text-[#CBD5E1] text-center mt-2">
              Enter to send · Shift + Enter for a new line
            </p>
          </form>
        </div>
      </div>

    </div>
  );
}