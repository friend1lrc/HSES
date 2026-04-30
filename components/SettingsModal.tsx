import React, { useRef, useState, useEffect } from 'react';
import { getApiKey } from '../services/api';
import { GoogleGenAI } from '@google/genai';

import { Persona } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  portraits: Record<string, string>;
  personas: Persona[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, portraits, personas }) => {
  const [useCustomKey, setUseCustomKey] = useState(() => localStorage.getItem('useCustomApiKey') === 'true');
  const [hasKey, setHasKey] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    if ((window as any).aistudio?.hasSelectedApiKey) {
      (window as any).aistudio.hasSelectedApiKey().then(setHasKey);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleToggleCustomKey = async () => {
    if (!useCustomKey) {
      if (!hasKey && (window as any).aistudio?.openSelectKey) {
        await (window as any).aistudio.openSelectKey();
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setHasKey(selected);
        if (selected) {
          setUseCustomKey(true);
          localStorage.setItem('useCustomApiKey', 'true');
        }
      } else {
        setUseCustomKey(true);
        localStorage.setItem('useCustomApiKey', 'true');
      }
    } else {
      setUseCustomKey(false);
      localStorage.setItem('useCustomApiKey', 'false');
    }
  };

  const handleSelectNewKey = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      const selected = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(selected);
      if (selected && !useCustomKey) {
        setUseCustomKey(true);
        localStorage.setItem('useCustomApiKey', 'true');
      }
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleDownloadAllPortraits = () => {
    Object.entries(portraits).forEach(([id, image]) => {
      const persona = personas.find(p => p.id === id);
      if (persona && typeof image === 'string') {
        const link = document.createElement('a');
        link.href = image;
        link.download = `${persona.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div className="bg-white rounded-none sm:rounded-3xl shadow-2xl w-full max-w-4xl h-full sm:h-auto max-h-full sm:max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 md:p-6 border-b border-[#00274C]/10 flex justify-between items-center bg-[#00274C] text-white shrink-0">
          <h2 id="settings-modal-title" className="text-base md:text-2xl font-black uppercase tracking-widest truncate mr-4">Settings</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-white/70 hover:text-white transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-[#FFCB05] rounded"
            aria-label="Close Settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-slate-50 custom-scrollbar space-y-6">
          <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-[#00274C] font-bold text-sm md:text-lg mb-2">API Key Settings</h3>
            <p className="text-[10px] md:text-sm text-slate-600 mb-4">
              Voice mode and image generation require an API key. You can use the free credits provided, or use your own Google Cloud API key for extended usage.
            </p>
            
            <div className="flex items-center justify-between bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100 mb-4">
              <div className="pr-2">
                <p className="font-semibold text-slate-800 text-xs md:text-base">Use my own API Key</p>
                <p className="text-[9px] md:text-xs text-slate-500">Switch between free credits and your own API key</p>
              </div>
              <button 
                onClick={handleToggleCustomKey}
                className={`relative inline-flex h-5 w-10 md:h-6 md:w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00274C] ${useCustomKey ? 'bg-[#00274C]' : 'bg-slate-300'}`}
                aria-label={useCustomKey ? "Disable custom API key" : "Enable custom API key"}
                aria-pressed={useCustomKey}
              >
                <span className={`inline-block h-3 w-3 md:h-4 md:w-4 transform rounded-full bg-white transition-transform ${useCustomKey ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {useCustomKey && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                <div className="flex-1 text-xs md:text-sm text-slate-600">
                  {hasKey ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                      API Key is selected and active
                    </span>
                  ) : (
                    <span className="text-amber-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                      No API Key selected
                    </span>
                  )}
                </div>
                <button 
                  onClick={handleSelectNewKey}
                  className="w-full sm:w-auto bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors"
                >
                  {hasKey ? 'Change API Key' : 'Select API Key'}
                </button>
              </div>
            )}
          </div>

          {/* Portrait & Avatar Management */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-[#00274C] mb-4 uppercase tracking-widest border-b-2 border-[#FFCB05] pb-2 inline-block">Asset Management</h3>
            <p className="text-xs text-slate-700 mb-6">
              Download all current portraits and avatars as PNG files. These can then be uploaded to the <code className="bg-slate-100 px-1 py-0.5 rounded">/public/portraits</code> and <code className="bg-slate-100 px-1 py-0.5 rounded">/public/avatars</code> folders of the project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleDownloadAllPortraits}
                disabled={Object.keys(portraits).length === 0}
                className="bg-[#FFCB05] text-[#00274C] py-3 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-md hover:bg-[#ffe066] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download Portraits
              </button>
              <button 
                onClick={() => {
                  personas.forEach(persona => {
                    const link = document.createElement('a');
                    link.href = `./avatars/${persona.id}.png`;
                    link.download = `${persona.id}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  });
                }}
                className="bg-[#00274C] text-[#FFCB05] py-3 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-md hover:bg-[#003d77] flex items-center justify-center gap-2 flex-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download Avatars
              </button>
            </div>
          </section>

          {/* PWA Install Button */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-start">
            <h3 className="text-lg font-black text-[#00274C] mb-4 uppercase tracking-widest border-b-2 border-[#FFCB05] pb-2 inline-block">Install App</h3>
            <p className="text-xs text-slate-700 mb-6">
              Install this application on your device for a seamless, app-like experience. You can access it directly from your home screen or desktop.
            </p>
            {isInstallable ? (
              <button 
                onClick={handleInstallClick}
                className="bg-[#00274C] text-[#FFCB05] py-3 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-md hover:bg-[#003d77] flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Install Application
              </button>
            ) : (
              <div className="bg-slate-100 text-slate-500 py-3 px-6 rounded-xl font-bold text-[10px] border border-slate-200">
                App is already installed or your browser does not support PWA installation.
              </div>
            )}
          </section>

        </div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #00274C20; border-radius: 10px; }`}</style>
    </div>
  );
};
