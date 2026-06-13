"use client";

import { useState } from "react";
import Link from "next/link";

// ── Inline Icons (same style) ────────────────────────────────
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 3l4 4-7 7H10v-4l7-7z" />
    <path d="M4 20h16" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Type for patient ─────────────────────────────────────────
interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  medical_record_number: string;
  last_scan_date?: string;
}

// ── Modal Component for Add/Edit ─────────────────────────────
interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Patient | null;
}

const PatientModal = ({ isOpen, onClose, onSubmit, initialData }: PatientModalProps) => {
  const [formData, setFormData] = useState(
    initialData || {
      first_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      medical_record_number: "",
    }
  );

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E8EDF2]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#0D1B2A]">
            {initialData ? "Edit Patient" : "Add New Patient"}
          </h2>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#0D1B2A]">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full border border-[#E8EDF2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA472]/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full border border-[#E8EDF2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA472]/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full border border-[#E8EDF2] rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-[#E8EDF2] rounded-xl px-3 py-2 text-sm"
            >
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#0D1B2A] mb-1">Medical Record #</label>
            <input
              type="text"
              name="medical_record_number"
              value={formData.medical_record_number}
              onChange={handleChange}
              className="w-full border border-[#E8EDF2] rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#E8EDF2] text-[#64748B] py-2 rounded-xl text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#0D1B2A] text-white py-2 rounded-xl text-sm font-semibold hover:bg-[#1A2C3E]"
            >
              {initialData ? "Update" : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Patient Page ─────────────────────────────────────────
export default function PatientsPage() {
  // Mock data – replace with real API
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      date_of_birth: "1945-03-12",
      gender: "M",
      medical_record_number: "MRN-001",
      last_scan_date: "2025-03-15",
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Smith",
      date_of_birth: "1950-07-22",
      gender: "F",
      medical_record_number: "MRN-002",
      last_scan_date: "2025-03-14",
    },
    {
      id: 3,
      first_name: "Robert",
      last_name: "Brown",
      date_of_birth: "1938-11-05",
      gender: "M",
      medical_record_number: "MRN-003",
      last_scan_date: "2025-03-10",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const filteredPatients = patients.filter(
    (p) =>
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.medical_record_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = (data: any) => {
    const newPatient: Patient = {
      id: patients.length + 1,
      ...data,
      last_scan_date: undefined,
    };
    setPatients([...patients, newPatient]);
    setIsModalOpen(false);
  };

  const handleEditPatient = (data: any) => {
    if (!editingPatient) return;
    const updated = patients.map((p) =>
      p.id === editingPatient.id ? { ...p, ...data } : p
    );
    setPatients(updated);
    setEditingPatient(null);
    setIsModalOpen(false);
  };

  const handleDeletePatient = (id: number) => {
    if (confirm("Are you sure you want to delete this patient? All associated scans will also be removed.")) {
      setPatients(patients.filter((p) => p.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingPatient(null);
    setIsModalOpen(true);
  };

  const openEditModal = (patient: Patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#F8FAFB] min-h-screen font-['Inter',-apple-system,sans-serif]">
      {/* Header */}
      <div className="border-b border-[#E8EDF2] bg-white px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0D1B2A]">Patients</h1>
            <p className="text-sm text-[#64748B] mt-1">Manage patient records and view scan history</p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#0D1B2A] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#1A2C3E] transition"
          >
            <PlusIcon />
            Add Patient
          </button>
        </div>
      </div>

      {/* Search + Table */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6 relative max-w-md">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by name or MRN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-[#E8EDF2] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA472]/20"
          />
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E8EDF2] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFB] border-b border-[#E8EDF2]">
                <tr className="text-left text-[#64748B]">
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">DOB</th>
                  <th className="px-6 py-3 font-semibold">Gender</th>
                  <th className="px-6 py-3 font-semibold">MRN</th>
                  <th className="px-6 py-3 font-semibold">Last Scan</th>
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#94A3B8]">
                      No patients found. Click "Add Patient" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFB] transition">
                      <td className="px-6 py-3 font-medium text-[#0D1B2A]">
                        {patient.first_name} {patient.last_name}
                      </td>
                      <td className="px-6 py-3 text-[#64748B]">
                        {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-3 text-[#64748B]">{patient.gender || "-"}</td>
                      <td className="px-6 py-3 text-[#64748B] font-mono text-xs">{patient.medical_record_number || "-"}</td>
                      <td className="px-6 py-3 text-[#64748B]">{patient.last_scan_date || "No scans"}</td>
                      <td className="px-6 py-3">
                        <div className="flex gap-3">
                          <Link
                            href={`/patients/${patient.id}`}
                            className="text-[#0EA472] hover:text-[#059669]"
                            title="View Details"
                          >
                            <EyeIcon />
                          </Link>
                          <button
                            onClick={() => openEditModal(patient)}
                            className="text-[#3B82F6] hover:text-[#2563EB]"
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleDeletePatient(patient.id)}
                            className="text-[#EF4444] hover:text-[#DC2626]"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                       </td>
                     </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <PatientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPatient(null);
        }}
        onSubmit={editingPatient ? handleEditPatient : handleAddPatient}
        initialData={editingPatient}
      />
    </div>
  );
}