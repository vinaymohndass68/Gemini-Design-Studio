
import React, { useState } from 'react';
import { DesignType, DesignState } from '../types';
import { getContrastColor } from '../utils/colorUtils';

interface DesignFormProps {
  onSubmit: (data: DesignState) => void;
}

const PRESET_COLORS = [
  '#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea', '#0891b2', '#1e293b'
];

export const DesignForm: React.FC<DesignFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<DesignState>({
    type: DesignType.BANNER,
    width: 1200,
    height: 600,
    purpose: '',
    themeColor: '#2563eb'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.purpose.trim()) return;
    onSubmit(formData);
  };

  const btnTextColor = getContrastColor(formData.themeColor);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">Start Your Creation</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">I want to create a...</label>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: DesignType.BANNER })}
                className={`flex-1 py-2.5 px-4 rounded-lg font-bold transition-all ${
                  formData.type === DesignType.BANNER 
                    ? 'bg-white text-slate-950 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Banner
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: DesignType.LOGO })}
                className={`flex-1 py-2.5 px-4 rounded-lg font-bold transition-all ${
                  formData.type === DesignType.LOGO 
                    ? 'bg-white text-slate-950 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Logo
              </button>
            </div>
          </div>
          <div className="space-y-2">
             <label className="text-sm font-bold text-slate-800">Dimensions (px)</label>
             <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Width"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-950 font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <span className="text-slate-400 font-bold">×</span>
                <input
                  type="number"
                  placeholder="Height"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-950 font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
             </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-800">Theme Color</label>
          <div className="flex flex-wrap gap-3 items-center">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, themeColor: color })}
                className={`w-10 h-10 rounded-full border-4 transition-all transform hover:scale-110 active:scale-95 ${
                  formData.themeColor === color ? 'border-slate-900 shadow-lg' : 'border-white'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 hover:border-slate-400 transition-colors">
              <input 
                type="color" 
                value={formData.themeColor}
                onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer border-none p-0"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-800">What is the purpose or vision?</label>
          <textarea
            required
            rows={4}
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            placeholder="Describe your project, e.g. A futuristic gaming banner for a YouTube channel called 'CyberPulse'..."
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-950 font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none leading-relaxed"
          />
        </div>

        <button
          type="submit"
          style={{ 
            backgroundColor: formData.themeColor,
            color: btnTextColor === 'white' ? '#fff' : '#000'
          }}
          className="w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] shadow-lg hover:brightness-110"
        >
          Begin Consultation
        </button>
      </form>
    </div>
  );
};
