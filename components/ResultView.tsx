
import React, { useState } from 'react';
import { DesignState } from '../types';
import { getContrastColor } from '../utils/colorUtils';

interface ResultViewProps {
  imageUrl: string;
  designContext: DesignState;
  onReset: () => void;
}

type PreviewBG = 'white' | 'slate' | 'black' | 'grid';

export const ResultView: React.FC<ResultViewProps> = ({ imageUrl, designContext, onReset }) => {
  const [bg, setBg] = useState<PreviewBG>('slate');

  const bgClasses: Record<PreviewBG, string> = {
    white: 'bg-white',
    slate: 'bg-slate-800',
    black: 'bg-black',
    grid: 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] bg-white'
  };

  const currentBgHex = bg === 'white' ? '#ffffff' : bg === 'black' ? '#000000' : bg === 'slate' ? '#1e293b' : '#ffffff';
  const overlayText = getContrastColor(currentBgHex);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `gemini-${designContext.type.toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Your Design is Ready!</h2>
          <p className="text-slate-500 font-medium">
            {designContext.type} • {designContext.width}px × {designContext.height}px
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Preview Background</span>
          <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
            {(['white', 'slate', 'black', 'grid'] as PreviewBG[]).map((type) => (
              <button
                key={type}
                onClick={() => setBg(type)}
                className={`w-8 h-8 rounded-md border-2 transition-all ${
                  bg === type ? 'border-blue-500 scale-110 shadow-sm' : 'border-transparent'
                } ${type === 'white' ? 'bg-white' : type === 'black' ? 'bg-black' : type === 'slate' ? 'bg-slate-800' : 'bg-slate-200'}`}
                title={type.charAt(0).toUpperCase() + type.slice(1)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={`relative group rounded-xl overflow-hidden shadow-inner flex items-center justify-center min-h-[400px] transition-colors duration-300 ${bgClasses[bg]}`}>
        <img 
          src={imageUrl} 
          alt="Generated Design" 
          className="max-w-full max-h-[70vh] h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />
        
        {/* Overlay Labels */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <span 
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-black/10 backdrop-blur-sm"
            style={{ color: overlayText === 'white' ? '#fff' : '#000' }}
          >
            {bg === 'grid' ? 'Transparency Preview' : `${bg} background`}
          </span>
        </div>

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
           <button 
             onClick={handleDownload}
             className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform"
           >
             Download PNG
           </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleDownload}
          className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
        >
          Download Assets
        </button>
        <button
          onClick={onReset}
          className="px-8 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
        >
          Create New
        </button>
      </div>
    </div>
  );
};
