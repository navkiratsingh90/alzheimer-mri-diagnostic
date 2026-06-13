"use client";

import Link from "next/link";

// ── Inline SVG icons (same style) ────────────────────────────
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ScanIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <line x1="7" y1="12" x2="17" y2="12" />
    <line x1="12" y1="7" x2="12" y2="17" />
  </svg>
);

const BrainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9.5 2a2.5 2.5 0 0 1 5 0v.5" />
    <path d="M12 2.5C8 2.5 5 5.5 5 9c0 1.5.5 2.8 1.3 3.9" />
    <path d="M12 2.5c4 0 7 3 7 6.5 0 1.5-.5 2.8-1.3 3.9" />
    <path d="M6.3 12.9C5.5 14 5 15.4 5 17a5 5 0 0 0 10 0c0-1.6-.5-3-1.3-4.1" />
    <line x1="12" y1="22" x2="12" y2="17" />
    <line x1="9" y1="17" x2="15" y2="17" />
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <rect x="2" y="2" width="20" height="20" rx="2" />
  </svg>
);

const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── Stat Card Component ──────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change?: string;
}

const StatCard = ({ icon, title, value, change }: StatCardProps) => (
  <div className="bg-white border border-[#E8EDF2] rounded-xl p-5 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <div className="w-9 h-9 rounded-xl bg-[#EDF7F3] flex items-center justify-center text-[#0EA472]">
        {icon}
      </div>
      {change && <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{change}</span>}
    </div>
    <p className="m-0 text-xs text-[#64748B]">{title}</p>
    <p className="m-0 mt-1 text-2xl font-bold text-[#0D1B2A]">{value}</p>
  </div>
);

// ── Main User Dashboard ───────────────────────────────────────
export default function UserDashboard() {
  // Mock data (replace with real API calls)
  const user = {
    name: "Dr. Priya Sharma",
    role: "Neurologist",
    institution: "Apollo Hospitals, Delhi",
    avatarInitials: "PS",
  };

  const myStats = {
    patients: 24,
    scans: 86,
    analyses: 86,
    avgAccuracy: 94.2,
  };

  const recentScans = [
    { id: 1, patient: "John Doe", date: "2025-03-15", stage: "Mild Demented", confidence: 87 },
    { id: 2, patient: "Jane Smith", date: "2025-03-14", stage: "Very Mild", confidence: 92 },
    { id: 3, patient: "Robert Brown", date: "2025-03-12", stage: "Non-Demented", confidence: 96 },
    { id: 4, patient: "Emily Davis", date: "2025-03-10", stage: "Moderate", confidence: 78 },
  ];

  const recentActivity = [
    { id: 1, action: "You uploaded a new scan for John Doe", time: "2 hours ago" },
    { id: 2, action: "Analysis completed: Mild Demented (87%)", time: "Yesterday" },
    { id: 3, action: "You added a new patient: Emily Davis", time: "2 days ago" },
  ];

  return (
    <div className="bg-[#F8FAFB] min-h-screen font-['Inter',-apple-system,sans-serif]">
      {/* Header */}
      <div className="border-b border-[#E8EDF2] bg-white px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0D1B2A]">My Dashboard</h1>
            <p className="text-sm text-[#64748B] mt-1">
              Welcome back, <span className="font-semibold text-[#0D1B2A]">{user.name.split(" ")[0]}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/scan/upload"
              className="inline-flex items-center gap-2 bg-[#0D1B2A] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#1A2C3E] transition"
            >
              <UploadIcon />
              Upload MRI
            </Link>
            <Link
              href="/patients/new"
              className="inline-flex items-center gap-2 border border-[#E8EDF2] bg-white text-[#0D1B2A] px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#F8FAFB] transition"
            >
              <PlusIcon />
              Add Patient
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* User Profile Card (Personal) */}
        <div className="bg-white border border-[#E8EDF2] rounded-xl p-5 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0EA472] to-[#059669] flex items-center justify-center text-white font-bold text-lg">
              {user.avatarInitials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0D1B2A]">{user.name}</h2>
              <p className="text-sm text-[#64748B]">{user.role} · {user.institution}</p>
            </div>
          </div>
          <Link
            href="/settings"
            className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0D1B2A] transition"
          >
            <SettingsIcon />
            Account Settings
          </Link>
        </div>

        {/* Stats Grid (My data) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon={<UsersIcon />} title="My Patients" value={myStats.patients.toString()} change="+3 this month" />
          <StatCard icon={<ScanIcon />} title="My Scans" value={myStats.scans.toString()} change="+12" />
          <StatCard icon={<BrainIcon />} title="My Analyses" value={myStats.analyses.toString()} change="100%" />
          <StatCard icon={<ChartIcon />} title="My Avg. Accuracy" value={`${myStats.avgAccuracy}%`} change="+2.1%" />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Recent Scans Table (only my scans) */}
          <div className="lg:col-span-2 bg-white border border-[#E8EDF2] rounded-xl overflow-hidden shadow-sm">
            <div className="flex justify-between items-center px-5 pt-5 pb-3 border-b border-[#E8EDF2]">
              <h2 className="text-lg font-semibold text-[#0D1B2A]">My Recent Scans</h2>
              <Link href="/scans" className="text-xs text-[#0EA472] hover:underline flex items-center gap-1">
                View all <ArrowRight />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F8FAFB] border-b border-[#E8EDF2]">
                  <tr className="text-left text-[#64748B]">
                    <th className="px-5 py-3 font-medium">Patient</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Stage</th>
                    <th className="px-5 py-3 font-medium">Confidence</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentScans.map((scan) => (
                    <tr key={scan.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFB] transition">
                      <td className="px-5 py-3 text-[#0D1B2A]">{scan.patient}</td>
                      <td className="px-5 py-3 text-[#64748B] text-xs">{scan.date}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          scan.stage === "Mild Demented" ? "bg-orange-100 text-orange-700" :
                          scan.stage === "Very Mild" ? "bg-yellow-100 text-yellow-700" :
                          scan.stage === "Non-Demented" ? "bg-green-100 text-green-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {scan.stage}
                        </span>
                       </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-[#E8EDF2] rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-[#0EA472]" style={{ width: `${scan.confidence}%` }} />
                          </div>
                          <span className="text-xs font-medium text-[#0D1B2A]">{scan.confidence}%</span>
                        </div>
                       </td>
                      <td className="px-5 py-3">
                        <Link href={`/scan/${scan.id}`} className="text-[#0EA472] hover:underline">
                          <EyeIcon />
                        </Link>
                       </td>
                    </tr>
                  ))}
                </tbody>
               </table>
            </div>
          </div>

          {/* Right Column: Quick Actions + My Recent Activity */}
          <div className="space-y-6">
            <div className="bg-white border border-[#E8EDF2] rounded-xl p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-[#0D1B2A] mb-3">Quick Actions</h2>
              <div className="flex flex-col gap-2">
                <Link href="/scan/upload" className="flex items-center justify-between p-3 bg-[#F8FAFB] rounded-xl hover:bg-[#EDF7F3] transition">
                  <span className="text-sm text-[#0D1B2A]">Upload new MRI scan</span>
                  <UploadIcon />
                </Link>
                <Link href="/patients/new" className="flex items-center justify-between p-3 bg-[#F8FAFB] rounded-xl hover:bg-[#EDF7F3] transition">
                  <span className="text-sm text-[#0D1B2A]">Add new patient record</span>
                  <PlusIcon />
                </Link>
                <Link href="/chat" className="flex items-center justify-between p-3 bg-[#F8FAFB] rounded-xl hover:bg-[#EDF7F3] transition">
                  <span className="text-sm text-[#0D1B2A]">Ask AI assistant</span>
                  <ChatIcon />
                </Link>
              </div>
            </div>

            <div className="bg-white border border-[#E8EDF2] rounded-xl p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-[#0D1B2A] mb-3">My Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#0EA472] mt-2" />
                    <div>
                      <p className="text-sm text-[#0D1B2A]">{activity.action}</p>
                      <p className="text-xs text-[#94A3B8]">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}