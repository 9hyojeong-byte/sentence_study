
import React, { useState } from 'react';
import { EnglishEntry } from '../types';

interface FlashcardProps {
  entry: EnglishEntry;
}

const Flashcard: React.FC<FlashcardProps> = ({ entry }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="w-full h-80 perspective cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front Side: Meaning & Hint */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center text-center border-2 border-indigo-50">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">의미 (Meaning)</span>
          <h3 className="text-2xl font-medium text-slate-800 leading-relaxed mb-8">
            {entry.meaning}
          </h3>
          
          {entry.hint && (
            <div className="mt-auto">
              <span className="text-xs font-semibold text-slate-400 block mb-1 uppercase">Hint</span>
              <p className="text-slate-500 italic text-sm">{entry.hint}</p>
            </div>
          )}

          <div className="absolute bottom-4 right-6 text-slate-300">
            <svg className="w-6 h-6 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            </svg>
          </div>
        </div>

        {/* Back Side: English Sentence */}
        <div className="absolute w-full h-full backface-hidden bg-indigo-600 rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center text-center rotate-y-180">
          <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-4">문장 (Sentence)</span>
          <h3 className="text-2xl font-bold text-white leading-snug mb-8">
            {entry.sentence}
          </h3>

          {entry.referenceUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card from flipping when clicking the link
                window.open(entry.referenceUrl, '_blank');
              }}
              className="px-6 py-2.5 bg-white text-indigo-600 hover:bg-indigo-50 rounded-full text-sm font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>참고 자료 보기</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          )}

          <div className="absolute bottom-4 left-6 text-indigo-400">
            <svg className="w-6 h-6 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Flashcard;
