
import React, { useState, useEffect } from 'react';
import { Feedback } from '../types';

interface FeedbackFormProps {
  initialFeedback?: Feedback;
  onSave: (feedback: Feedback) => void;
  onCancel: () => void;
  messageText: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ initialFeedback, onSave, onCancel, messageText }) => {
  const [rating, setRating] = useState(initialFeedback?.rating || 0);
  const [clarity, setClarity] = useState(initialFeedback?.clarity || false);
  const [relevance, setRelevance] = useState(initialFeedback?.relevance || false);
  const [helpfulness, setHelpfulness] = useState(initialFeedback?.helpfulness || false);
  const [comments, setComments] = useState(initialFeedback?.comments || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      rating,
      clarity,
      relevance,
      helpfulness,
      comments,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300" role="form" aria-labelledby="feedback-title">
      <div className="p-6 border-b border-[#00274C]/10 flex items-center justify-between bg-white sticky top-0 z-10">
        <h3 id="feedback-title" className="text-sm font-black text-[#00274C] uppercase tracking-widest">Self-Assessment</h3>
        <button 
          onClick={onCancel} 
          className="text-[#00274C]/30 hover:text-[#00274C] transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-[#00274C] rounded"
          aria-label="Close Self-Assessment"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-8 bg-[#F8F9FA]">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-[#00274C]/40 uppercase tracking-widest">Evaluating Message</span>
          <div className="bg-white p-4 rounded-xl border border-[#00274C]/5 text-xs font-medium text-slate-600 italic leading-relaxed">
            "{messageText}"
          </div>
        </div>

        <div className="space-y-4">
          <label id="rating-label" className="text-[10px] font-black text-[#00274C] uppercase tracking-widest block">Overall Impact</label>
          <div className="flex gap-2" role="group" aria-labelledby="rating-label">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#FFCB05] rounded-full ${rating >= star ? 'text-[#FFCB05]' : 'text-slate-200'}`}
                aria-label={`${star} star${star > 1 ? 's' : ''}`}
                aria-pressed={rating >= star}
              >
                <svg className="w-8 h-8 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label id="competencies-label" className="text-[10px] font-black text-[#00274C] uppercase tracking-widest block">Communication Competencies</label>
          <div className="grid grid-cols-1 gap-3" role="group" aria-labelledby="competencies-label">
            {[
              { label: 'Clarity', state: clarity, setter: setClarity, desc: 'Did I understand the point?' },
              { label: 'Relevance', state: relevance, setter: setRelevance, desc: 'Was it appropriate for the context?' },
              { label: 'Helpfulness', state: helpfulness, setter: setHelpfulness, desc: 'Did it move the dialogue forward?' }
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => item.setter(!item.state)}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-[#FFCB05] ${
                  item.state 
                    ? 'bg-[#00274C] border-[#00274C] text-[#FFCB05]' 
                    : 'bg-white border-[#00274C]/5 text-[#00274C]/60 hover:border-[#00274C]/20'
                }`}
                aria-pressed={item.state}
                aria-label={`${item.label}: ${item.desc}`}
              >
                <div>
                  <div className={`text-[11px] font-black uppercase tracking-wider ${item.state ? 'text-[#FFCB05]' : 'text-[#00274C]'}`}>
                    {item.label}
                  </div>
                  <div className={`text-[9px] font-medium opacity-60 ${item.state ? 'text-white/80' : 'text-slate-500'}`}>
                    {item.desc}
                  </div>
                </div>
                {item.state && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label htmlFor="feedback-comments" className="text-[10px] font-black text-[#00274C] uppercase tracking-widest block">Linguistic & Professional Notes</label>
          <textarea
            id="feedback-comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Reflect on tone, vocabulary choice, or cultural nuances..."
            className="w-full p-4 text-xs bg-white border-2 border-[#00274C]/5 rounded-xl focus:border-[#00274C] outline-none resize-none h-32 transition-all font-medium text-[#00274C] shadow-sm"
          />
        </div>
      </div>

      <div className="p-6 bg-white border-t border-[#00274C]/10 sticky bottom-0 z-10">
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full bg-[#00274C] hover:bg-[#003d77] disabled:bg-slate-300 text-[#FFCB05] py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#00274C]/50"
          aria-label={initialFeedback ? 'Update Assessment' : 'Save to Portfolio'}
        >
          {initialFeedback ? 'Update Assessment' : 'Save to Portfolio'}
        </button>
      </div>
    </div>
  );
};
