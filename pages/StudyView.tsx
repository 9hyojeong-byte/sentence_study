
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import { EnglishEntry } from '../types';
// Fixed: parseISO is not exported from the root 'date-fns' module in some versions; using sub-path import.
import { format, isValid } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';

interface StudyViewProps {
  entries: EnglishEntry[];
}

// Fisher-Yates Shuffle Algorithm
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const StudyView: React.FC<StudyViewProps> = ({ entries }) => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  const isAll = date === 'all';

  const dayEntries = useMemo(() => {
    let source = entries;
    if (!isAll) {
      source = entries.filter(entry => {
        if (!entry.date) return false;
        const entryDateStr = String(entry.date).trim();
        let normalized = '';
        if (entryDateStr.includes('T')) {
          const parsed = parseISO(entryDateStr);
          if (isValid(parsed)) normalized = format(parsed, 'yyyy-MM-dd');
        } else {
          normalized = entryDateStr.substring(0, 10);
        }
        return normalized === date;
      });
    }
    // Randomize the order for the study session
    return shuffle(source);
  }, [entries, date, isAll]);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (dayEntries.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold text-slate-800 mb-4">No entries to study.</h3>
        <button 
          onClick={() => navigate('/')}
          className="text-indigo-600 font-semibold underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentEntry = dayEntries[currentIndex];

  const handleNext = () => {
    if (currentIndex < dayEntries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/list/${date}`)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {isAll ? '전체 학습' : date}
            </h2>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
              {isAll ? 'Random Mix' : 'Daily Review'}
            </p>
          </div>
        </div>
        <div className="bg-white px-3 py-1 rounded-full text-sm font-bold text-indigo-600 border border-indigo-100">
          {currentIndex + 1} / {dayEntries.length}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center gap-8">
        <Flashcard entry={currentEntry} key={`${date}-${currentIndex}-${currentEntry.sentence.substring(0, 5)}`} />
        
        <div className="flex items-center gap-6 w-full">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`
              flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all
              ${currentIndex === 0 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-white text-slate-700 hover:bg-indigo-50 border border-slate-200 shadow-sm'}
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-bold">Prev</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === dayEntries.length - 1}
            className={`
              flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all
              ${currentIndex === dayEntries.length - 1 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'}
            `}
          >
            <span className="font-bold">Next</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-center p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <p className="text-amber-700 text-xs font-medium">Tip: 문장은 랜덤한 순서로 노출됩니다!</p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>달력 화면으로 돌아가기</span>
        </button>
      </div>
    </div>
  );
};

export default StudyView;
