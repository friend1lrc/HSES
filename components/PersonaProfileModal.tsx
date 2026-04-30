import React, { useState, useEffect } from 'react';
import { Persona } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, User, Briefcase, MessageSquare, Target, Lightbulb, BookOpen, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { speakText, stopSpeech } from '../services/ttsService';

interface PersonaProfileModalProps {
  persona: Persona | null;
  portrait?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PersonaProfileModal: React.FC<PersonaProfileModalProps> = ({ persona, portrait, isOpen, onClose }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [persona]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen) {
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          handleSpeak();
        } else if (e.key === 'Escape') {
          handleClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSpeaking, persona]);

  if (!persona || !persona.profile) return null;

  const profile = persona.profile;
  const portraitSrc = portrait || `./portraits/${persona.id}.png`;

  const handleSpeak = async () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const textToRead = `
      Profile for ${profile.name}. 
      Title: ${profile.title}. 
      ${profile.department ? `Department: ${profile.department}.` : ''}
      Biography: ${profile.biography}
      Professional Background: ${profile.background}
      Communication Style: ${profile.communicationStyle}
    `;

    try {
      await speakText(textToRead, persona.voiceName || 'Zephyr');
    } catch (error) {
      console.error("Failed to speak profile:", error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleClose = () => {
    stopSpeech();
    setIsSpeaking(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#00274C]/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-[#00274C] p-6 text-white relative">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button 
                  onClick={handleSpeak}
                  className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#FFCB05] ${isSpeaking ? 'bg-[#FFCB05] text-[#00274C] animate-pulse' : 'hover:bg-white/10 text-white'}`}
                  title={isSpeaking ? "Stop Reading (S)" : "Listen to Profile (S)"}
                  aria-label={isSpeaking ? "Stop Reading Profile" : "Listen to Profile"}
                  aria-pressed={isSpeaking}
                >
                  {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = portraitSrc;
                    link.download = `${persona.id}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white focus:outline-none focus:ring-2 focus:ring-[#FFCB05]"
                  title="Download Portrait"
                  aria-label="Download Portrait"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                </button>
                <button 
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white focus:outline-none focus:ring-2 focus:ring-[#FFCB05]"
                  aria-label="Close Profile"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-4xl border border-white/20 overflow-hidden">
                  {!imgError ? (
                    <img 
                      src={portraitSrc} 
                      alt={persona.name} 
                      className="w-full h-full object-cover" 
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    persona.avatar
                  )}
                </div>
                <div>
                  <h2 id="modal-title" className="text-2xl font-black mb-1">{profile.name}</h2>
                  <p className="text-[#FFCB05] font-bold uppercase tracking-widest text-xs">
                    {profile.title}
                  </p>
                  {profile.department && (
                    <p className="text-white/60 text-xs mt-1 font-medium italic">
                      {profile.department}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Biography */}
              <section>
                <div className="flex items-center gap-2 mb-3 text-[#00274C]">
                  <User className="w-5 h-5" />
                  <h3 className="font-black uppercase tracking-wider text-sm">Biography</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {profile.biography}
                </p>
              </section>

              {/* Background & Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <div className="flex items-center gap-2 mb-3 text-[#00274C]">
                    <Briefcase className="w-5 h-5" />
                    <h3 className="font-black uppercase tracking-wider text-sm">Professional Background</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {profile.background}
                  </p>
                </section>
                <section>
                  <div className="flex items-center gap-2 mb-3 text-[#00274C]">
                    <MessageSquare className="w-5 h-5" />
                    <h3 className="font-black uppercase tracking-wider text-sm">Communication Style</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {profile.communicationStyle}
                  </p>
                </section>
              </div>

              {/* Key Concerns */}
              <section className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center gap-2 mb-4 text-[#00274C]">
                  <Target className="w-5 h-5" />
                  <h3 className="font-black uppercase tracking-wider text-sm">Key Concerns</h3>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.keyConcerns.map((concern, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFCB05] mt-1.5 shrink-0" />
                      {concern}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Tips for Interaction */}
              <section className="bg-[#00274C]/5 rounded-2xl p-5 border border-[#00274C]/10">
                <div className="flex items-center gap-2 mb-4 text-[#00274C]">
                  <Lightbulb className="w-5 h-5" />
                  <h3 className="font-black uppercase tracking-wider text-sm">Tips for Interaction</h3>
                </div>
                <div className="space-y-3">
                  {profile.tipsForInteraction.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-xl shadow-sm border border-[#00274C]/5">
                      <div className="w-6 h-6 rounded-lg bg-[#FFCB05]/20 flex items-center justify-center text-[#00274C] font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-slate-700 text-xs leading-normal font-medium">{tip}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#00274C] text-[#FFCB05] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#003d77] transition-colors shadow-sm"
              >
                Close Profile
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
