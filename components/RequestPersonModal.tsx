
import React, { useState } from 'react';

interface RequestPersonModalProps {
  onClose: () => void;
  instructorEmail: string;
}

export const RequestPersonModal: React.FC<RequestPersonModalProps> = ({ onClose, instructorEmail }) => {
  const [formData, setFormData] = useState({
    name: '',
    who: '',
    scenarios: ''
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = encodeURIComponent("New Person Request - Academic Simulator");
    const body = encodeURIComponent(
      `New Person Request Details:\n\n` +
      `Suggested Name (Fictitious): ${formData.name}\n` +
      `Who they are: ${formData.who}\n` +
      `Suggested Scenarios: ${formData.scenarios}`
    );
    
    window.location.href = `mailto:${instructorEmail}?subject=${subject}&body=${body}`;
    setIsSent(true);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-person-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-[#00274C] p-6 flex justify-between items-center">
          <h2 id="request-person-modal-title" className="text-lg font-black text-white uppercase tracking-widest">Request New Person</h2>
          <button 
            onClick={onClose} 
            className="text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFCB05] rounded"
            aria-label="Close Request New Person"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {isSent ? (
            <div className="text-center py-8 space-y-4" role="alert">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <p className="text-[#00274C] font-bold">Request Prepared!</p>
              <p className="text-sm text-slate-500 italic">Your email client should open shortly.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="person-name" className="text-[10px] font-black text-[#00274C] uppercase tracking-widest">Name (Fictitious)</label>
                <input 
                  id="person-name"
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Dr. Sarah Jenkins"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#00274C]/10 focus:border-[#FFCB05] outline-none transition-all text-sm"
                />
                <p className="text-[9px] text-slate-400 italic">Please use a fictitious name.</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="person-who" className="text-[10px] font-black text-[#00274C] uppercase tracking-widest">Who they are</label>
                <textarea 
                  id="person-who"
                  required
                  value={formData.who}
                  onChange={(e) => setFormData({...formData, who: e.target.value})}
                  placeholder="Describe their role and personality..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#00274C]/10 focus:border-[#FFCB05] outline-none transition-all text-sm h-24 resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="person-scenarios" className="text-[10px] font-black text-[#00274C] uppercase tracking-widest">Suggested Scenarios</label>
                <textarea 
                  id="person-scenarios"
                  required
                  value={formData.scenarios}
                  onChange={(e) => setFormData({...formData, scenarios: e.target.value})}
                  placeholder="What challenges should they present?"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#00274C]/10 focus:border-[#FFCB05] outline-none transition-all text-sm h-24 resize-none"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-[#FFCB05] text-[#00274C] py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#00274C] hover:text-[#FFCB05] transition-all shadow-lg active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#FFCB05]/50"
              >
                Send Request
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
