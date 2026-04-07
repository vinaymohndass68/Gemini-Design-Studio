
import React, { useState } from 'react';
import { DesignForm } from './components/DesignForm';
import { ChatInterface } from './components/ChatInterface';
import { ResultView } from './components/ResultView';
import { DesignState } from './types';
import { generateFinalDesign } from './services/geminiService';

enum AppStep {
  FORM,
  CHAT,
  GENERATING,
  RESULT
}

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.FORM);
  const [designState, setDesignState] = useState<DesignState | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartConsultation = (state: DesignState) => {
    setDesignState(state);
    setStep(AppStep.CHAT);
  };

  const handleGenerate = async (fullPrompt: string) => {
    if (!designState) return;
    setStep(AppStep.GENERATING);
    setError(null);
    try {
      const imageUrl = await generateFinalDesign(designState, fullPrompt);
      if (imageUrl) {
        setGeneratedImage(imageUrl);
        setStep(AppStep.RESULT);
      } else {
        throw new Error("Could not generate image");
      }
    } catch (err) {
      setError("Failed to generate design. Please try again or refine your prompt.");
      setStep(AppStep.CHAT);
    }
  };

  const handleReset = () => {
    setStep(AppStep.FORM);
    setDesignState(null);
    setGeneratedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Gemini Design Studio
            </h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <span className="text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer">Explore</span>
            <span className="text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer">Templates</span>
            <span className="text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer">Pricing</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col py-12 px-6">
        <div className="max-w-7xl mx-auto w-full">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          {step === AppStep.FORM && (
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  Professional Designs, <span className="text-blue-600">Powered by Gemini.</span>
                </h2>
                <p className="text-lg text-slate-600">
                  Custom banners and logos created through a collaborative AI experience.
                </p>
              </div>
              <DesignForm onSubmit={handleStartConsultation} />
            </div>
          )}

          {step === AppStep.CHAT && designState && (
            <div className="max-w-2xl mx-auto">
              <ChatInterface 
                designContext={designState} 
                onReadyToGenerate={handleGenerate}
                onReset={handleReset}
              />
            </div>
          )}

          {step === AppStep.GENERATING && (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 border-8 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Creating Your Masterpiece</h2>
                <p className="text-slate-500 max-w-xs mx-auto mt-2">
                  Gemini is blending your ideas into a high-quality visual asset. This usually takes 10-20 seconds.
                </p>
              </div>
              <div className="flex gap-2">
                 <div className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase">Synthesizing</div>
                 <div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase">Rendering</div>
              </div>
            </div>
          )}

          {step === AppStep.RESULT && generatedImage && designState && (
            <ResultView 
              imageUrl={generatedImage} 
              designContext={designState} 
              onReset={handleReset} 
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
        <p>&copy; 2024 Gemini Design Studio. All assets generated are yours to use.</p>
      </footer>
    </div>
  );
};

export default App;
