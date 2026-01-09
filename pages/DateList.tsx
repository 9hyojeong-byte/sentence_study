
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const isMarked = date === 'marked';

  const dayEntries = useMemo(() => {
    if (isMarked) {
      return entries.filter(e => e.bookmark);
    }
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
  }, [entries, date, isAll, isMarked]);

  const hasData = dayEntries.length > 0;

  const getTitle = () => {
    if (isMarked) return '북마크 문장 목록';
    if (isAll) return '전체 문장 목록';
    return date;
  };

  const getSubtitle = () => {
    if (isMarked) return 'Sentences You Want to Remember';
    if (isAll) return 'Full Learning History';
    return 'Daily Lesson Items';
  };

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
            {getTitle()}
          </h2>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
            {getSubtitle()}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">북마크된 문장이 없습니다.</p>
          </div>
        ) : (
          dayEntries.map((entry, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(`/study/${date}`)}
              className={`bg-white p-4 rounded-2xl border shadow-sm flex flex-col gap-1 transition-all cursor-pointer hover:border-indigo-200 ${entry.bookmark ? 'border-amber-200 bg-amber-50/20' : 'border-slate-100'}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {entry.bookmark && (
                    <span className="text-amber-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                  )}
                  <span className="text-indigo-600 font-bold text-sm">{entry.meaning}</span>
                </div>
                {(isAll || isMarked) && <span className="text-[10px] text-slate-400 font-medium">{String(entry.date).substring(0, 10)}</span>}
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
            <span>{isMarked ? '북마크 학습 시작' : '학습 시작하기'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DateList;
