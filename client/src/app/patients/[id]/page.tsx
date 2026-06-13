"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function PatientDetailPage() {
  const { id } = useParams();

  // Fetch patient data by ID (replace with real API call)
  // Mock data for demonstration
  const patient = {
    id: Number(id),
    first_name: "John",
    last_name: "Doe",
    date_of_birth: "1945-03-12",
    gender: "M",
    medical_record_number: "MRN-001",
    scans: [
      { id: 1, date: "2025-03-15", stage: "Mild Demented", confidence: 87 },
      { id: 2, date: "2025-02-10", stage: "Very Mild", confidence: 76 },
    ],
  };

  return (
    <div className="bg-[#F8FAFB] min-h-screen">
      <div className="border-b border-[#E8EDF2] bg-white px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/patients" className="text-sm text-[#0EA472] hover:underline inline-flex items-center gap-1">
            ← Back to Patients
          </Link>
          <h1 className="text-2xl font-bold text-[#0D1B2A] mt-2">
            {patient.first_name} {patient.last_name}
          </h1>
          <p className="text-sm text-[#64748B]">MRN: {patient.medical_record_number}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="bg-white border border-[#E8EDF2] rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0D1B2A] mb-4">Patient Information</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-[#64748B]">Date of Birth</dt>
                <dd className="text-sm text-[#0D1B2A]">{new Date(patient.date_of_birth).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#64748B]">Gender</dt>
                <dd className="text-sm text-[#0D1B2A]">{patient.gender}</dd>
              </div>
            </dl>
            <button className="mt-6 w-full border border-[#E8EDF2] text-[#0D1B2A] py-2 rounded-xl text-sm hover:bg-[#F8FAFB] transition">
              Edit Details
            </button>
          </div>

          {/* Scans History */}
          <div className="lg:col-span-2 bg-white border border-[#E8EDF2] rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#0D1B2A]">Scan History</h2>
              <Link
                href={`/scan/upload?patient_id=${patient.id}`}
                className="text-sm text-[#0EA472] hover:underline"
              >
                + New Scan
              </Link>
            </div>
            {patient.scans.length === 0 ? (
              <p className="text-center text-[#94A3B8] py-8">No scans recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {patient.scans.map((scan) => (
                  <div key={scan.id} className="flex justify-between items-center p-3 bg-[#F8FAFB] rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-[#0D1B2A]">{new Date(scan.date).toLocaleDateString()}</p>
                      <p className="text-xs text-[#64748B]">
                        Stage: <span className="font-medium text-[#0EA472]">{scan.stage}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#0D1B2A]">Confidence {scan.confidence}%</p>
                      <Link href={`/scan/${scan.id}`} className="text-xs text-[#0EA472] hover:underline">
                        View Analysis →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}