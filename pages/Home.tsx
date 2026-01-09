
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../components/Calendar';
import { EnglishEntry } from '../types';

interface HomeProps {
  entries: EnglishEntry[];
  loading: boolean;
}

const Home: React.FC<HomeProps> = ({ entries, loading }) => {
  const navigate = useNavigate();

  const handleDateClick = (clickedDate: string) => {
    navigate(`/list/${clickedDate}`);
  };

  const bookmarkedEntriesCount = entries.filter(e => e.bookmark).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-800 text-center">영어회화 복습</h2>
        <p className="text-slate-500 text-sm text-center">날짜를 클릭해서 그 날의 문장을 복습해보자!</p>
      </div>

      <Calendar entries={entries} onDateClick={handleDateClick} />

      {loading && (
        <div className="flex flex-col items-center justify-center p-8 space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Syncing with Sheets...</p>
        </div>
      )}

      {/* Action Buttons */}
      {!loading && (
        <div className="flex flex-col gap-3">
          {bookmarkedEntriesCount > 0 && (
            <button
              onClick={() => navigate('/list/marked')}
              className="w-full py-5 bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>북마크된 문장 모아보기 ({bookmarkedEntriesCount}개)</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => navigate('/list/all')}
              className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex flex-col items-center cursor-pointer hover:bg-indigo-100 transition-all hover:scale-105 active:scale-95"
            >
              <span className="text-indigo-600 font-bold text-3xl">{entries.length}</span>
              <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Total Sentences</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex flex-col items-center">
              <span className="text-emerald-600 font-bold text-3xl">
                {new Set(entries.map(e => String(e.date).substring(0, 10))).size}
              </span>
              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">study days</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => navigate('/add')}
        className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-all transform hover:scale-110 active:scale-90 z-30"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
};

export default Home;
