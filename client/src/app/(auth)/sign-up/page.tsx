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
  User,
  Stethoscope,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ── Types ─────────────────────────────────────────────────────
type Role = "doctor" | "radiologist" | "";

interface FormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
}
interface FieldError {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

// ── Validation ────────────────────────────────────────────────
function validate(form: FormState): FieldError {
  const e: FieldError = {};
  if (!form.fullName.trim()) e.fullName = "Full name is required.";
  else if (form.fullName.trim().length < 3) e.fullName = "Name must be at least 3 characters.";
  if (!form.email) e.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
  if (!form.password) e.password = "Password is required.";
  else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
  if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
  else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
  if (!form.role) e.role = "Please select a role.";
  return e;
}

// ── Password strength ──────────────────────────────────────────
function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "", color: "" },
    { label: "Weak", color: "bg-red-400" },
    { label: "Fair", color: "bg-amber-400" },
    { label: "Good", color: "bg-blue-400" },
    { label: "Strong", color: "bg-[#0EA472]" },
  ];
  return { score, ...map[score] };
}

// ── Role option card ───────────────────────────────────────────
interface RoleCardProps {
  value: Role;
  label: string;
  description: string;
  selected: boolean;
  onSelect: (v: Role) => void;
}
function RoleCard({ value, label, description, selected, onSelect }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`
        flex-1 relative flex flex-col items-start gap-1 px-4 py-3.5 rounded-xl border text-left transition-all
        ${selected
          ? "border-[#0EA472] bg-[#EDF7F3] ring-1 ring-[#0EA472]"
          : "border-[#E8EDF2] bg-white hover:border-[#CBD5E1]"
        }
      `}
    >
      {selected && (
        <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#0EA472] flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        </span>
      )}
      <span className={`text-sm font-semibold ${selected ? "text-[#047857]" : "text-[#0D1B2A]"}`}>
        {label}
      </span>
      <span className="text-xs text-[#94A3B8] leading-tight">{description}</span>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm]         = useState<FormState>({ fullName: "", email: "", password: "", confirmPassword: "", role: "" });
  const [errors, setErrors]     = useState<FieldError>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const strength = getStrength(form.password);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FieldError])
      setErrors((p) => ({ ...p, [name]: undefined }));
    setApiError(null);
  };

  const handleRole = (role: Role) => {
    setForm((p) => ({ ...p, role }));
    if (errors.role) setErrors((p) => ({ ...p, role: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: form.fullName, email: form.email, password: form.password, role: form.role }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail ?? "Registration failed. Please try again.");
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex">

      {/* ── Left visual panel ── */}
      <aside className="hidden lg:flex flex-col justify-between w-[380px] flex-shrink-0 bg-[#0D1B2A] px-10 py-12">
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
        <div className="flex flex-col gap-7">
          <div>
            <p className="text-xs font-semibold text-[#0EA472] tracking-widest mb-3">
              JOIN THE PLATFORM
            </p>
            <h2 className="text-3xl font-extrabold text-white leading-tight tracking-tight mb-4">
              Start detecting<br />Alzheimer's with<br />
              <span className="text-[#0EA472]">confidence.</span>
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-xs">
              Create your account to access the full NeuroSight platform — MRI analysis,
              patient management, and AI-assisted clinical reporting.
            </p>
          </div>

          {/* What you get */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-semibold text-[#475569] tracking-widest mb-1">WHAT YOU GET</p>
            {[
              "Unlimited MRI scan uploads",
              "Grad-CAM explainability heatmaps",
              "LangChain AI clinical assistant",
              "Patient history and progression tracking",
              "Auto-generated PDF clinical reports",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-md bg-[#0EA472] flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
                <span className="text-sm text-[#CBD5E1]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#475569]">
          For research purposes only · Not a certified medical device
        </p>
      </aside>

      {/* ── Right form panel ── */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-12 overflow-y-auto">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#0EA472] to-[#059669] flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.4} />
          </div>
          <span className="text-base font-bold text-[#0D1B2A] tracking-tight">
            Neuro<span className="text-[#0EA472]">Sight</span>
          </span>
        </div>

        <div className="w-full max-w-[420px]">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-[#0D1B2A] tracking-tight mb-1.5">
              Create your account
            </h1>
            <p className="text-sm text-[#64748B]">
              Set up your NeuroSight account in under a minute.
            </p>
          </div>

          {/* API error */}
          {apiError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-3 bg-[#EDF7F3] border border-[#A7F3D0] rounded-xl px-4 py-3 mb-5">
              <CheckCircle2 className="w-4 h-4 text-[#0EA472] flex-shrink-0" />
              <p className="text-sm text-[#047857] font-medium">Account created — redirecting to login…</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fullName" className="text-xs font-semibold text-[#0D1B2A] tracking-wide">
                Full name
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Dr. Navkirat Singh"
                  value={form.fullName}
                  onChange={handleChange}
                  disabled={loading || success}
                  className={`pl-10 h-11 text-sm rounded-xl border bg-white text-[#0D1B2A] placeholder:text-[#CBD5E1] focus-visible:ring-1 focus-visible:ring-[#0EA472] focus-visible:border-[#0EA472] transition-colors ${errors.fullName ? "border-red-300 focus-visible:ring-red-400" : "border-[#E8EDF2] hover:border-[#CBD5E1]"}`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-500 flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />{errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
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
            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-[#0D1B2A] tracking-wide">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <Input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 8 characters"
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

              {/* Strength meter */}
              {form.password && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.score ? strength.color : "bg-[#E8EDF2]"}`}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <span className="text-xs font-medium text-[#64748B]">{strength.label}</span>
                  )}
                </div>
              )}

              {errors.password && (
                <p className="text-xs text-red-500 flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />{errors.password}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold text-[#0D1B2A] tracking-wide">
                Confirm password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={loading || success}
                  className={`pl-10 pr-11 h-11 text-sm rounded-xl border bg-white text-[#0D1B2A] placeholder:text-[#CBD5E1] focus-visible:ring-1 focus-visible:ring-[#0EA472] focus-visible:border-[#0EA472] transition-colors ${errors.confirmPassword ? "border-red-300 focus-visible:ring-red-400" : form.confirmPassword && form.password === form.confirmPassword ? "border-[#0EA472]" : "border-[#E8EDF2] hover:border-[#CBD5E1]"}`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {/* Match indicator */}
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle2 className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0EA472]" />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />{errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || success}
              className="h-11 w-full bg-[#0D1B2A] hover:bg-[#1E3A5F] text-white text-sm font-semibold rounded-xl gap-2 transition-colors disabled:opacity-60 mt-1"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>Create account <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <Separator className="flex-1 bg-[#E8EDF2]" />
            <span className="text-xs text-[#94A3B8]">or</span>
            <Separator className="flex-1 bg-[#E8EDF2]" />
          </div>

          {/* Login link */}
          <p className="text-sm text-center text-[#64748B]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0EA472] font-semibold hover:underline underline-offset-2">
              Sign in
            </Link>
          </p>

          {/* Disclaimer */}
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