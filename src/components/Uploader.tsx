import React, { useRef, useState } from 'react';
import { UploadIcon } from './Icons';

interface UploaderProps {
  onImageSelected: (file: File, preview: string) => void;
}

const Uploader: React.FC<UploaderProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    const preview = URL.createObjectURL(file);
    onImageSelected(file, preview);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-accent bg-accent/10 scale-105'
            : 'border-neutral-700 hover:border-neutral-600 hover:bg-neutral-900/50'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-6">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors ${
            isDragging ? 'bg-accent/20' : 'bg-neutral-800'
          }`}>
            <UploadIcon className={`w-8 h-8 ${isDragging ? 'text-accent' : 'text-neutral-400'}`} />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">
              {isDragging ? 'Drop your image here' : 'Upload your image'}
            </h3>
            <p className="text-neutral-400 text-sm">
              Drag & drop or click to browse
              <br />
              Supports JPG, PNG, WebP (max 10MB)
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(file);
          }
        }}
        className="hidden"
      />
    </div>
  );
};

export default Uploader;