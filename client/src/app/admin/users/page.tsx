"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  ArrowLeft,
  LogOut,
  Shield,
  ShieldOff,
  User,
  UserCog,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  MoreVertical,
} from "lucide-react";
// import api from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────
interface UserType {
  id: number;
  username: string;
  role: "user" | "admin";
}

// ── Main Component ──────────────────────────────────────────
export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([{
	id : 1,
	username : "navkirat singh",
	role : "user",
  }]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  // ── Fetch users and verify admin ──────────────────────────
  useEffect(() => {
    const fetchData = async () => {
    //   try {
    //     // Get current user to verify admin
    //     const meRes = await api.get("/auth/me");
    //     const user = meRes.data;
    //     setCurrentUser(user);
    //     if (user.role !== "admin") {
    //       router.push("/dashboard");
    //       return;
    //     }

    //     // Fetch all users
    //     const usersRes = await api.get("/admin/users");
    //     setUsers(usersRes.data);
    //   } catch (error) {
    //     setError("Failed to load users. Please try again.");
    //   } finally {
    //     setLoading(false);
    //   }
    };
    fetchData();
  }, [router]);

  // ── Toggle user role (promote/demote) ─────────────────────
  const toggleRole = async (userId: number, currentRole: string) => {
    if (!window.confirm(`Are you sure you want to change this user's role?`)) return;
    setActionLoading(userId);
    setError(null);
    // try {
    //   const newRole = currentRole === "admin" ? "user" : "admin";
    //   await api.patch(`/admin/users/${userId}/role`, { role: newRole });
    //   // Update local state
    //   setUsers((prev) =>
    //     prev.map((u) =>
    //       u.id === userId ? { ...u, role: newRole } : u
    //     )
    //   );
    // } catch (err: any) {
    //   setError(err.response?.data?.detail || "Failed to update role.");
    // } finally {
    //   setActionLoading(null);
    // }
  };

  // ── Delete user ────────────────────────────────────────────
  const deleteUser = async (userId: number, username: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`))
      return;
    setActionLoading(userId);
    setError(null);
    // try {
    //   await api.delete(`/admin/users/${userId}`);
    //   setUsers((prev) => prev.filter((u) => u.id !== userId));
    // } catch (err: any) {
    //   setError(err.response?.data?.detail || "Failed to delete user.");
    // } finally {
    //   setActionLoading(null);
    // }
  };

  // ── Logout ──────────────────────────────────────────────────
  const handleLogout = async () => {
    // await api.get("/auth/logout");
    // router.push("/login");
  };

  // ── Loading ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#0EA472]" />
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFB] font-['Inter',-apple-system,sans-serif]">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E8EDF2] px-8 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0D1B2A] transition"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="w-px h-6 bg-[#E8EDF2]" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0EA472] to-[#059669] flex items-center justify-center">
              <Users size={16} className="text-white" />
            </div>
            <span className="text-base font-bold text-[#0D1B2A] tracking-[-0.3px]">
              Neuro<span className="text-[#0EA472]">Sight</span>
              <span className="ml-1 text-sm font-normal text-[#64748B]">
                Admin · Users
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-[#0D1B2A] font-medium hidden sm:inline">
            {currentUser?.username} (Admin)
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0D1B2A] transition"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* ── Main content ── */}
      <div className="pt-20 px-8 pb-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0D1B2A] tracking-[-0.5px]">
              User Management
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              {users.length} registered user{users.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#EDF7F3] text-[#0EA472] rounded-full">
              <Shield size={14} />
              Admin Access
            </span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 text-sm text-[#EF4444] bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-2.5 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Users table */}
        {users.length === 0 ? (
          <div className="bg-white border border-[#E8EDF2] rounded-2xl p-12 text-center shadow-sm">
            <Users size={48} className="mx-auto text-[#94A3B8] mb-3" />
            <h3 className="text-lg font-semibold text-[#0D1B2A]">No users found</h3>
            <p className="text-sm text-[#64748B] mt-1">There are no registered users yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-[#E8EDF2] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFB] border-b border-[#E8EDF2]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isAdmin = user.role === "admin";
                    const isCurrentUser = currentUser?.id === user.id;
                    return (
                      <tr
                        key={user.id}
                        className={`border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFB] transition ${
                          isCurrentUser ? "bg-[#EDF7F3]/30" : ""
                        }`}
                      >
                        <td className="px-4 py-3 text-[#64748B] text-xs">#{user.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-[#94A3B8]" />
                            <span className="font-medium text-[#0D1B2A]">{user.username}</span>
                            {isCurrentUser && (
                              <span className="text-[10px] font-medium text-[#0EA472] bg-[#D1FAE5] px-1.5 py-0.5 rounded">
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              isAdmin
                                ? "bg-[#EDF7F3] text-[#0EA472]"
                                : "bg-[#F1F5F9] text-[#64748B]"
                            }`}
                          >
                            {isAdmin ? <Shield size={12} /> : <UserCog size={12} />}
                            {isAdmin ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!isCurrentUser && (
                              <>
                                <button
                                  onClick={() => toggleRole(user.id, user.role)}
                                  disabled={actionLoading === user.id}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                                    isAdmin
                                      ? "bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A]"
                                      : "bg-[#EDF7F3] text-[#0EA472] hover:bg-[#A7F3D0]"
                                  }`}
                                >
                                  {actionLoading === user.id ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : isAdmin ? (
                                    "Demote"
                                  ) : (
                                    "Promote"
                                  )}
                                </button>
                                <button
                                  onClick={() => deleteUser(user.id, user.username)}
                                  disabled={actionLoading === user.id}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#EF4444] bg-[#FEF2F2] hover:bg-[#FEE2E2] transition"
                                >
                                  {actionLoading === user.id ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <Trash2 size={14} />
                                  )}
                                </button>
                              </>
                            )}
                            {isCurrentUser && (
                              <span className="text-xs text-[#94A3B8]">Self</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}