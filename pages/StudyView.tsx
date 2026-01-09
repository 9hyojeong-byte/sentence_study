
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import { EnglishEntry } from '../types';
import { gasService } from '../services/gasService';
import { format, isValid } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';

interface StudyViewProps {
  entries: EnglishEntry[];
  onRefresh?: () => void;
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

const StudyView: React.FC<StudyViewProps> = ({ entries, onRefresh }) => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  const isAll = date === 'all';
  const isMarked = date === 'marked';

  const dayEntries = useMemo(() => {
    let source = entries;
    if (isMarked) {
      source = entries.filter(e => e.bookmark);
    } else if (!isAll) {
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
    return shuffle(source);
  }, [entries, date, isAll, isMarked]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  if (dayEntries.length === 0) {
    return (
      <div className="text-center py-20 flex flex-col items-center px-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">학습할 문장이 없습니다.</h3>
        <p className="text-slate-500 mb-8">북마크된 문장이 없거나 해당 날짜의 데이터가 비어있습니다.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg w-full"
        >
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  const currentEntry = dayEntries[currentIndex];

  const handleToggleBookmark = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    // Optimistic UI update
    const previousState = currentEntry.bookmark;
    currentEntry.bookmark = !previousState;

    try {
      await gasService.toggleBookmark(currentEntry.date, currentEntry.sentence);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to update bookmark status", err);
      // Rollback on error
      currentEntry.bookmark = previousState;
      alert("북마크 업데이트에 실패했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

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
              {isMarked ? '북마크 학습' : (isAll ? '전체 학습' : date)}
            </h2>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
              {isMarked ? 'Bookmark Mode' : 'Review Session'}
            </p>
          </div>
        </div>
        <div className="bg-white px-3 py-1 rounded-full text-sm font-bold text-indigo-600 border border-indigo-100">
          {currentIndex + 1} / {dayEntries.length}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center gap-8">
        <Flashcard entry={currentEntry} key={`${date}-${currentIndex}-${currentEntry.sentence.substring(0, 5)}`} />
        
        <div className="flex items-center gap-4 w-full">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`
              flex-1 py-4 px-2 rounded-2xl flex items-center justify-center gap-1 transition-all
              ${currentIndex === 0 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-white text-slate-700 hover:bg-indigo-50 border border-slate-200 shadow-sm'}
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-bold text-sm">Prev</span>
          </button>

          {/* Bookmark Toggle Button (Star) */}
          <button
            onClick={handleToggleBookmark}
            disabled={isUpdating}
            title="Bookmark this sentence"
            className={`
              w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md transform active:scale-90
              ${currentEntry.bookmark 
                ? 'bg-amber-100 text-amber-500 border-2 border-amber-300 shadow-amber-100' 
                : 'bg-white text-slate-300 border border-slate-200 hover:text-slate-400'}
            `}
          >
            {isUpdating ? (
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-8 h-8" fill={currentEntry.bookmark ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentIndex === dayEntries.length - 1}
            className={`
              flex-1 py-4 px-2 rounded-2xl flex items-center justify-center gap-1 transition-all
              ${currentIndex === dayEntries.length - 1 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'}
            `}
          >
            <span className="font-bold text-sm">Next</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-center p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <p className="text-amber-700 text-xs font-medium">Tip: 별표 버튼을 눌러 중요한 문장을 북마크하세요!</p>
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
