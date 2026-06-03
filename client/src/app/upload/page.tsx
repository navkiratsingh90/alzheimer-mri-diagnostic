'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UploadZone from '@/components/UploadZone';
import ConfidenceChart from '@/components/ConfidenceChart';
import GradCAMViewer from '@/components/GradCAMViewer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { predictMRI } from '@/lib/api';
import { PredictResponse } from '@/types';
import { Brain, RotateCcw } from 'lucide-react';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileAccepted = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await predictMRI(selectedFile);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent">
            MRI Analysis
          </h1>
          <p className="text-slate-500 mt-2">
            Upload a brain MRI scan – AI will classify Alzheimer's stage and highlight key regions
          </p>
        </div>

        {/* Upload Zone */}
        {!result && (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 p-6">
            <UploadZone onFileAccepted={handleFileAccepted} isUploading={isLoading} />
            
            {previewUrl && (
              <div className="mt-6 text-center">
                <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all disabled:opacity-50"
                >
                  <Brain className="w-4 h-4" />
                  {isLoading ? 'Analyzing...' : 'Analyze MRI'}
                </button>
                <button
                  onClick={handleReset}
                  className="mt-2 ml-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            )}

            {isLoading && <LoadingSpinner />}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-slate-100 p-6">
            <div className="flex justify-between items-start flex-wrap gap-4 border-b border-slate-100 pb-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Prediction: {result.predicted_class}
                </h2>
                <p className="text-slate-500">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> New Analysis
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-700 mb-3">Confidence per Stage</h3>
                <ConfidenceChart confidences={result.all_confidences} />
              </div>
              <div>
                <GradCAMViewer imageBase64={result.gradcam_base64} originalPreview={previewUrl || undefined} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}