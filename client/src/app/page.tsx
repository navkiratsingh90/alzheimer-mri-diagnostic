'use client';

import Link from 'next/link';
import { Brain, Sparkles, MessageSquare, Activity, Clock, Shield } from 'lucide-react';

// If you don't want to install lucide-react, replace each <Icon /> with:
// <span className="text-4xl">🧠</span> etc.

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        {/* Animated background blob */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Medical Imaging</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">
            NeuroSight
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mt-6">
            Alzheimer's MRI Staging & Clinical Co‑pilot
          </p>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mt-4">
            Upload a brain MRI – get instant 4‑stage classification, heatmap explanations,
            and a medical agent that answers clinical questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <Brain className="w-5 h-5" />
              Start Analysis
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-slate-700 font-semibold px-8 py-3 rounded-xl border border-slate-200 transition-all shadow-sm hover:shadow"
            >
              <MessageSquare className="w-5 h-5" />
              Chat with AI
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white/70 backdrop-blur-sm border-y border-slate-100 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-600">98.2%</p>
            <p className="text-slate-500">Classification Accuracy</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">99.6%</p>
            <p className="text-slate-500">AUC (Area Under Curve)</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">&lt;2 sec</p>
            <p className="text-slate-500">Average Inference Time</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4">
          Why NeuroSight?
        </h2>
        <p className="text-center text-slate-500 max-w-2xl mx-auto mb-12">
          Built for clinicians, researchers, and AI enthusiasts – transparent, fast, and clinically relevant.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">4‑Stage Alzheimer's Staging</h3>
            <p className="text-slate-500 mt-2">
              Non‑Demented / Very Mild / Mild / Moderate – with confidence scores for each.
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Grad‑CAM Explainability</h3>
            <p className="text-slate-500 mt-2">
              Heatmaps show exactly which brain regions influenced the decision – no black box.
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Clinical AI Agent</h3>
            <p className="text-slate-500 mt-2">
              LangChain + PubMed RAG – ask questions, get evidence‑based answers and draft reports.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works (simple steps) */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 flex items-center justify-center text-2xl font-bold mb-3">1</div>
              <p className="font-semibold">Upload MRI</p>
              <p className="text-sm text-slate-300 mt-1">Drag & drop brain scan (JPG/PNG)</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 flex items-center justify-center text-2xl font-bold mb-3">2</div>
              <p className="font-semibold">AI Analysis</p>
              <p className="text-sm text-slate-300 mt-1">EfficientNet‑B4 predicts stage + heatmap</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 flex items-center justify-center text-2xl font-bold mb-3">3</div>
              <p className="font-semibold">Chat & Explore</p>
              <p className="text-sm text-slate-300 mt-1">Ask clinical questions, get literature support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Ready to try it?</h2>
        <p className="text-slate-500 mt-2 mb-8">No installation – just upload an MRI and see the results instantly.</p>
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg"
        >
          <Brain className="w-5 h-5" />
          Upload Your First MRI
        </Link>
      </section>

      {/* Custom CSS for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}