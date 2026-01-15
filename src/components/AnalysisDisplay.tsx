import React from 'react';
import { AnalysisResult } from '../types';
import ColorSwatch from './ColorSwatch';
import { CopyIcon } from './Icons';

interface AnalysisDisplayProps {
  data: AnalysisResult;
  imagePreview: string;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ data, imagePreview }) => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-16 pb-20">

      {/* Section 1: Image & Analysis Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Source Image */}
        <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-neutral-700 to-neutral-800 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10">
              <img
                src={imagePreview}
                alt="Source"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-xs font-mono border border-white/10">
              SOURCE
            </div>
        </div>

        {/* Analysis Summary */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
           <div className="space-y-4">
             <div className="flex items-center space-x-2 text-accent">
               <span className="text-xs font-mono uppercase tracking-widest">Color Analysis</span>
             </div>
             <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-white tracking-tighter">
               Dominant: {data.dominantColor}
             </h2>
             <p className="text-neutral-400 text-lg">
               Color Harmony: {data.colorHarmony}
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="glass-panel p-6 rounded-lg">
               <h3 className="text-sm font-mono text-neutral-400 uppercase tracking-widest mb-4">Palette Size</h3>
               <p className="text-white text-lg font-medium">{data.palette.length} Colors</p>
             </div>
             <div className="glass-panel p-6 rounded-lg border-l-4 border-l-accent">
               <h3 className="text-sm font-mono text-neutral-400 uppercase tracking-widest mb-4">Analysis Method</h3>
               <p className="text-white text-lg font-medium">Pixel-based Extraction</p>
             </div>
           </div>
        </div>
      </div>

      {/* Section 2: Palette */}
      <div>
        <div className="flex items-end justify-between mb-8 border-b border-neutral-800 pb-4">
          <h3 className="text-2xl font-bold text-white tracking-tight">Extracted Palette</h3>
          <span className="font-mono text-neutral-500 text-xs">HEX CODES</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-8">
          {data.palette.map((color, index) => (
            <ColorSwatch key={color.hex} color={color} index={index} />
          ))}
        </div>
      </div>

      {/* Section 3: Contrast Suggestion */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="grid md:grid-cols-12 gap-0">
          <div
            className="md:col-span-4 h-48 md:h-auto flex items-center justify-center relative group cursor-pointer"
            style={{ backgroundColor: data.contrastSuggestion }}
            onClick={() => navigator.clipboard.writeText(data.contrastSuggestion)}
          >
             <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm p-2 rounded-full">
               <CopyIcon className="text-white" />
             </div>
             <span className="absolute bottom-4 left-4 font-mono text-xs font-bold bg-white/20 backdrop-blur px-2 py-1 rounded text-white mix-blend-difference">
               {data.contrastSuggestion}
             </span>
          </div>

          <div className="md:col-span-8 p-8 md:p-12 flex flex-col justify-center">
            <span className="text-xs font-mono uppercase tracking-widest text-accent mb-2">Suggested Contrast</span>
            <h3 className="text-2xl font-bold text-white mb-4">Perfect Complement</h3>
            <p className="text-neutral-400 leading-relaxed text-lg max-w-2xl">
              This color provides optimal contrast against your dominant color ({data.dominantColor}),
              ensuring excellent readability and visual impact in your designs.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AnalysisDisplay;