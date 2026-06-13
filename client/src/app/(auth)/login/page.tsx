"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Brain,
  Scan,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ── Types ─────────────────────────────────────────────────────
interface FormState {
  email: string;
  password: string;
}
interface FieldError {
  email?: string;
  password?: string;
}

// ── Validation ────────────────────────────────────────────────
function validate(form: FormState): FieldError {
  const errors: FieldError = {};
  if (!form.email) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address.";
  if (!form.password) errors.password = "Password is required.";
  else if (form.password.length < 6)
    errors.password = "Password must be at least 6 characters.";
  return errors;
}

// ── Panel data ────────────────────────────────────────────────
const STATS = [
  { value: "93.2%", label: "Classification accuracy" },
  { value: "< 2s",  label: "Inference per scan"      },
  { value: "4",     label: "Alzheimer stages"         },
];
const FEATURES = [
  { Icon: Brain,         text: "EfficientNetV2B0 CNN model"           },
  { Icon: Scan,          text: "Grad-CAM explainability heatmaps"     },
  { Icon: MessageSquare, text: "LangChain AI clinical assistant"       },
  { Icon: ShieldCheck,   text: "Research-grade, not a medical device" },
];

// ── Page ──────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]         = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors]     = useState<FieldError>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FieldError])
      setErrors((p) => ({ ...p, [name]: undefined }));
    setApiError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail ?? "Invalid email or password.");
      }
      const { access_token } = await res.json();
      localStorage.setItem("token", access_token);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 800);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex">

      {/* ── Left visual panel ── */}
      <aside className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 bg-[#0D1B2A] px-10 py-12">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#0EA472] to-[#059669] flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.4} />
          </div>
          <span className="text-base font-bold text-white tracking-tight">
            Neuro<span className="text-[#0EA472]">Sight</span>
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-xs font-semibold text-[#0EA472] tracking-widest mb-3">
              ALZHEIMER'S DETECTION PLATFORM
            </p>
            <h2 className="text-3xl font-extrabold text-white leading-tight tracking-tight mb-4">
              AI-powered MRI<br />classification for<br />
              <span className="text-[#0EA472]">earlier diagnosis.</span>
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-xs">
              Upload a brain MRI scan and get instant stage classification,
              Grad-CAM heatmaps, and an AI clinical assistant — all in one platform.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {STATS.map(({ value, label }) => (
              <div key={label} className="bg-white/5 border border-white/[0.08] rounded-xl px-3 py-4 text-center">
                <p className="text-xl font-bold text-[#0EA472] tracking-tight mb-0.5">{value}</p>
                <p className="text-[10px] text-[#94A3B8] leading-tight">{label}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="flex flex-col gap-3">
            {FEATURES.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#0EA472]" />
                </div>
                <span className="text-sm text-[#CBD5E1]">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#475569]">
          For research purposes only · Not a certified medical device
        </p>
      </aside>

      {/* ── Right form panel ── */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-12">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#0EA472] to-[#059669] flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.4} />
          </div>
          <span className="text-base font-bold text-[#0D1B2A] tracking-tight">
            Neuro<span className="text-[#0EA472]">Sight</span>
          </span>
        </div>

        <div className="w-full max-w-[400px]">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-[#0D1B2A] tracking-tight mb-1.5">
              Welcome back
            </h1>
            <p className="text-sm text-[#64748B]">
              Sign in to your NeuroSight account to continue.
            </p>
          </div>

          {/* API error banner */}
          {apiError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          )}

          {/* Success banner */}
          {success && (
            <div className="flex items-center gap-3 bg-[#EDF7F3] border border-[#A7F3D0] rounded-xl px-4 py-3 mb-5">
              <CheckCircle2 className="w-4 h-4 text-[#0EA472] flex-shrink-0" />
              <p className="text-sm text-[#047857] font-medium">Signed in — redirecting…</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-[#0D1B2A] tracking-wide">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="doctor@hospital.in"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading || success}
                  className={`pl-10 h-11 text-sm rounded-xl border bg-white text-[#0D1B2A] placeholder:text-[#CBD5E1] focus-visible:ring-1 focus-visible:ring-[#0EA472] focus-visible:border-[#0EA472] transition-colors ${errors.email ? "border-red-300 focus-visible:ring-red-400" : "border-[#E8EDF2] hover:border-[#CBD5E1]"}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />{errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-[#0D1B2A] tracking-wide">
                  Password
                </Label>
                <button type="button" className="text-xs text-[#0EA472] font-medium hover:underline underline-offset-2">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <Input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading || success}
                  className={`pl-10 pr-11 h-11 text-sm rounded-xl border bg-white text-[#0D1B2A] placeholder:text-[#CBD5E1] focus-visible:ring-1 focus-visible:ring-[#0EA472] focus-visible:border-[#0EA472] transition-colors ${errors.password ? "border-red-300 focus-visible:ring-red-400" : "border-[#E8EDF2] hover:border-[#CBD5E1]"}`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />{errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || success}
              className="h-11 w-full bg-[#0D1B2A] hover:bg-[#1E3A5F] text-white text-sm font-semibold rounded-xl gap-2 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <Separator className="flex-1 bg-[#E8EDF2]" />
            <span className="text-xs text-[#94A3B8]">or</span>
            <Separator className="flex-1 bg-[#E8EDF2]" />
          </div>

          {/* Register link */}
          <p className="text-sm text-center text-[#64748B]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#0EA472] font-semibold hover:underline underline-offset-2">
              Create one
            </Link>
          </p>

          {/* Disclaimer card */}
          <Card className="mt-8 border-[#E8EDF2] shadow-none bg-[#F8FAFB]">
            <CardContent className="flex items-start gap-2.5 p-4">
              <ShieldCheck className="w-4 h-4 text-[#94A3B8] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                NeuroSight is a research tool. Results should not replace
                professional neurological assessment.
              </p>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}