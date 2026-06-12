"use client";

import Link from "next/link";
import { useState } from "react";

// Icons (same as above plus user icon)
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 7L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswords()) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Sign up demo – connect to your backend");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col justify-center py-12 px-6 font-['Inter',-apple-system,BlinkMacSystemFont,sans-serif]">
      <div className="max-w-md w-full mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[#64748B] text-sm mb-6 hover:text-[#0D1B2A] transition">
          <ArrowLeft />
          Back to home
        </Link>

        <div className="bg-white border border-[#E8EDF2] rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA472] to-[#059669] flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#0D1B2A] tracking-[-0.5px]">Create an account</h1>
            <p className="text-sm text-[#64748B] mt-1">Start using NeuroSight today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-xs font-semibold text-[#0D1B2A] mb-1.5">Full name</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <UserIcon />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2.5 border border-[#E8EDF2] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA472]/20 focus:border-[#0EA472] transition"
                  placeholder="Dr. Jane Smith"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#0D1B2A] mb-1.5">Email address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <EnvelopeIcon />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2.5 border border-[#E8EDF2] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA472]/20 focus:border-[#0EA472] transition"
                  placeholder="doctor@hospital.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#0D1B2A] mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <LockIcon />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 border border-[#E8EDF2] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA472]/20 focus:border-[#0EA472] transition"
                  placeholder="•••••••• (min. 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0D1B2A]"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#0D1B2A] mb-1.5">Confirm password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <LockIcon />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2.5 border border-[#E8EDF2] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA472]/20 focus:border-[#0EA472] transition"
                  placeholder="Confirm your password"
                />
              </div>
              {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0D1B2A] text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1A2C3E] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#64748B]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#0EA472] font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E8EDF2] text-center">
            <p className="text-[11px] text-[#94A3B8]">
              By signing up, you agree to our{" "}
              <a href="#" className="text-[#0EA472] hover:underline">Terms</a> and{" "}
              <a href="#" className="text-[#0EA472] hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}