
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Fixed: parseISO is not exported from the root 'date-fns' module in some versions; using sub-path import.
import { format, isValid } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';
import { EnglishEntry } from '../types';

interface DateListProps {
  entries: EnglishEntry[];
}

const DateList: React.FC<DateListProps> = ({ entries }) => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  const isAll = date === 'all';

  const dayEntries = useMemo(() => {
    if (isAll) return entries;
    return entries.filter(entry => {
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
  }, [entries, date, isAll]);

  const hasData = dayEntries.length > 0;

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {isAll ? '전체 문장 목록' : date}
          </h2>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
            {isAll ? 'All Recorded Sentences' : 'Selected Date Sentences'}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">No saved sentences found.</p>
          </div>
        ) : (
          dayEntries.map((entry, idx) => (
            <div 
              key={idx} 
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1 hover:border-indigo-200 transition-all"
            >
              <div className="flex justify-between items-start">
                <span className="text-indigo-600 font-bold text-sm">{entry.meaning}</span>
                {isAll && <span className="text-[10px] text-slate-400 font-medium">{String(entry.date).substring(0, 10)}</span>}
              </div>
              <p className="text-slate-500 text-sm line-clamp-2 italic">"{entry.sentence}"</p>
            </div>
          ))
        )}
      </div>

      {hasData && (
        <div className="sticky bottom-0 bg-slate-50 pt-2 pb-4">
          <button
            onClick={() => navigate(`/study/${date}`)}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>학습 시작하기</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DateList;
