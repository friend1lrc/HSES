
import React from 'react';
import { Persona } from '../types';
import { Info } from 'lucide-react';

interface PersonaCardProps {
  persona: Persona;
  onSelect: (persona: Persona) => void;
  onShowProfile: (persona: Persona) => void;
  portrait?: string;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona, onSelect, onShowProfile, portrait }) => {
  const [imgError, setImgError] = React.useState(false);
  const portraitSrc = portrait || `./portraits/${persona.id}.png`;

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-2xl hover:border-[#FFCB05] transition-all cursor-pointer group flex flex-col h-full overflow-hidden relative focus:outline-none focus:ring-4 focus:ring-[#FFCB05]/50"
      onClick={() => onSelect(persona)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(persona);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Select ${persona.name}, ${persona.title}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-[#00274C]/5 border-2 border-[#00274C]/10 group-hover:border-[#FFCB05] transition-colors flex items-center justify-center text-3xl overflow-hidden">
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
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-black text-[#00274C] leading-tight">{persona.name}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowProfile(persona);
              }}
              className="p-1.5 text-[#00274C]/40 hover:text-[#00274C] hover:bg-[#00274C]/5 rounded-lg transition-all"
              title="View Profile"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] font-bold text-[#00274C]/60 uppercase tracking-widest">{persona.title}</p>
        </div>
      </div>
      
      <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
        {persona.description}
      </p>

      <div className="bg-[#00274C]/5 rounded-xl p-3 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-3 h-3 text-[#00274C]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          <span className="text-[10px] font-black text-[#00274C]/40 uppercase tracking-wider">Communication Goal</span>
        </div>
        <p className="text-[11px] text-[#00274C]/70 leading-tight italic font-medium">{persona.goal}</p>
      </div>

      <div className="mt-auto">
        <button className="w-full bg-[#00274C] text-[#FFCB05] py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest group-hover:bg-[#003d77] transition-colors flex items-center justify-center gap-2 shadow-sm">
          Talk to {persona.name} ({persona.title})
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};
