import React, { useState } from 'react';
import { AppState, AnalysisResult } from './types';
import { extractColorsFromImage } from './utils';
import Uploader from './components/Uploader';
import AnalysisDisplay from './components/AnalysisDisplay';
import { RefreshIcon } from './components/Icons';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleImageSelected = async (file: File, preview: string) => {
    setPreviewUrl(preview);
    setAppState(AppState.ANALYZING);
    setErrorMsg('');

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = preview;
      });

      const result = await extractColorsFromImage(img);
      setAnalysisData(result);
      setAppState(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
      setErrorMsg("Unable to analyze image. Please try another file.");
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setAnalysisData(null);
    setPreviewUrl('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-background text-primary selection:bg-accent selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
            <h1 className="text-xl font-bold tracking-tighter">CHROMA<span className="text-neutral-500 font-light">AVANT</span></h1>
          </div>
          {appState === AppState.SUCCESS && (
            <button 
              onClick={handleReset}
              className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest hover:text-accent transition-colors"
            >
              <RefreshIcon className="w-4 h-4" />
              <span>New Analysis</span>
            </button>
          )}
        </div>
      </header>

      <main className="pt-32 px-6 pb-12">
        {/* Intro / Idle State */}
        {appState === AppState.IDLE && (
          <div className="max-w-2xl mx-auto text-center space-y-12 animate-fade-in">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-600">
                Visualize.<br/>Analyze.<br/>Create.
              </h2>
              <p className="text-neutral-400 text-lg max-w-md mx-auto leading-relaxed">
                Upload your inspiration. We analyze the pixels, extract the dominant colors, and provide design insights.
              </p>
            </div>
            
            <Uploader onImageSelected={handleImageSelected} />
            
            <div className="grid grid-cols-3 gap-4 pt-12 border-t border-neutral-900">
               <div className="text-center">
                 <div className="text-2xl font-bold mb-1">RGB</div>
                 <div className="text-[10px] uppercase tracking-widest text-neutral-500">Analysis</div>
               </div>
               <div className="text-center border-l border-neutral-900">
                 <div className="text-2xl font-bold mb-1">HEX</div>
                 <div className="text-[10px] uppercase tracking-widest text-neutral-500">Precision</div>
               </div>
               <div className="text-center border-l border-neutral-900">
                 <div className="text-2xl font-bold mb-1">HSL</div>
                 <div className="text-[10px] uppercase tracking-widest text-neutral-500">Harmony</div>
               </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-fade-in">
             <div className="relative w-24 h-24">
               <div className="absolute inset-0 border-4 border-neutral-800 rounded-full"></div>
               <div className="absolute inset-0 border-t-4 border-white rounded-full animate-spin"></div>
               <div className="absolute inset-8 bg-white/10 rounded-full animate-pulse"></div>
             </div>
             <div className="text-center space-y-2">
                <h3 className="text-xl font-bold tracking-tight">Analyzing Colors...</h3>
                <p className="font-mono text-sm text-neutral-500">Processing pixels, extracting palette.</p>
             </div>
          </div>
        )}

        {/* Error State */}
        {appState === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-red-900/20 text-red-500 rounded-full flex items-center justify-center border border-red-900/50">
              <span className="text-2xl font-bold">!</span>
            </div>
            <h3 className="text-xl font-bold text-white">{errorMsg}</h3>
            <button 
              onClick={handleReset}
              className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-neutral-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Success / Display State */}
        {appState === AppState.SUCCESS && analysisData && (
          <div className="animate-slide-up">
            <AnalysisDisplay data={analysisData} imagePreview={previewUrl} />
          </div>
        )}
      </main>
      
      {/* Background Noise/Gradient */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }}>
      </div>
    </div>
  );
};

export default App;