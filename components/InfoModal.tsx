import React, { useState, useEffect } from 'react';

interface InfoModalProps {
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'how-to' | 'pedagogy'>('how-to');

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#00274C]/10 flex justify-between items-center bg-[#00274C] text-white">
          <h2 id="info-modal-title" className="text-2xl font-black uppercase tracking-widest">Application Info</h2>
          <button 
            onClick={onClose} 
            className="text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFCB05] rounded"
            aria-label="Close Info"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex bg-slate-100 p-1 mx-8 mt-6 rounded-xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('how-to')}
            className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'how-to' ? 'bg-white text-[#00274C] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            How to Use
          </button>
          <button 
            onClick={() => setActiveTab('pedagogy')}
            className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'pedagogy' ? 'bg-white text-[#00274C] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Pedagogy
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto flex-1 bg-slate-50">
          {activeTab === 'how-to' ? (
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-2xl font-black text-[#00274C] mb-4 uppercase tracking-widest border-b-2 border-[#FFCB05] pb-2 inline-block">How to Use</h3>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p><strong>1. Choose a Person:</strong> Select a professional or academic authority from the main dashboard.</p>
                <p><strong>2. Set Context:</strong> Define the high-stakes situation for simulation by picking a scenario.</p>
                <p><strong>3. Engage:</strong> Converse via Text (deliberate, turn-based interaction) or Voice (natural flow, real-time interaction).</p>
                <p><strong>4. Study & Save:</strong> Flag key AI responses and download your Portfolio (Audio/Transcript) to share with your instructor or review later.</p>
              </div>
            </section>
          ) : (
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-2xl font-black text-[#00274C] mb-4 uppercase tracking-widest border-b-2 border-[#FFCB05] pb-2 inline-block">Pedagogy Design Document</h3>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  The <strong>Practice High-Stakes Academic English Simulator</strong> is grounded in experiential learning and situated cognition. 
                  It provides international scholars with a safe, low-stakes environment to practice high-stakes professional communication.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Authentic Contexts:</strong> Scenarios are designed to mirror real-world academic and professional challenges, such as grant reviews, ethics board meetings, and salary negotiations.</li>
                  <li><strong>Scaffolded Interaction:</strong> Users can choose between Text Mode (allowing for deliberate planning and review of alternatives) and Voice Mode (for real-time fluency practice).</li>
                  <li><strong>Immediate Feedback:</strong> The AI personas are programmed to respond realistically, providing immediate, naturalistic feedback on the user's communication strategies.</li>
                  <li><strong>Metacognitive Reflection:</strong> Features like flagging key points and downloading transcripts encourage users to review their performance and identify areas for improvement.</li>
                </ul>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
