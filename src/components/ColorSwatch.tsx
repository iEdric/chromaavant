import React, { useState } from 'react';
import { ColorData } from '../types';
import { CopyIcon } from './Icons';

interface ColorSwatchProps {
  color: ColorData;
  index: number;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="group relative flex flex-col animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Color Box */}
      <button
        onClick={handleCopy}
        className="relative w-full aspect-[3/4] rounded-lg overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        <div
          className="w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundColor: color.hex }}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 text-white">
            <CopyIcon />
          </div>
        </div>

        {/* Copied Feedback */}
        {copied && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
            <span className="font-mono text-xs text-white font-bold tracking-widest uppercase">Copied</span>
          </div>
        )}
      </button>

      {/* Info */}
      <div className="mt-4 space-y-1">
        <div className="flex justify-between items-center">
          <h4 className="text-white font-bold text-lg tracking-tight">Color {index + 1}</h4>
          <span className="text-neutral-500 text-xs">{color.percentage}%</span>
        </div>
        <p className="font-mono text-neutral-500 text-xs uppercase tracking-wider">{color.hex}</p>
        <p className="text-neutral-400 text-sm leading-tight pt-2 border-t border-neutral-800 mt-2">
          RGB({color.rgb.join(', ')}) • HSL({color.hsl.join(', ')})
        </p>
      </div>
    </div>
  );
};

export default ColorSwatch;