'use client';

import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface Props {
  onFileAccepted: (file: File) => void;
  isUploading?: boolean;
}

export default function UploadZone({ onFileAccepted, isUploading }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxFiles: 1,
    onDropAccepted: (files) => onFileAccepted(files[0]),
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-300 hover:border-blue-400 bg-slate-50'
      } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-10 h-10 mx-auto text-slate-400 mb-3" />
      {isDragActive ? (
        <p className="text-blue-600">Drop the MRI image here...</p>
      ) : (
        <>
          <p className="text-slate-600">Drag & drop an MRI image</p>
          <p className="text-sm text-slate-400 mt-1">or click to select (JPG, PNG)</p>
        </>
      )}
    </div>
  );
}