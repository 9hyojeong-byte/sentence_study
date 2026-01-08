
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Using individual sub-path import for parseISO to resolve export issue
import { format, isValid } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';
import Calendar from '../components/Calendar';
import { EnglishEntry } from '../types';

interface HomeProps {
  entries: EnglishEntry[];
  loading: boolean;
}

const Home: React.FC<HomeProps> = ({ entries, loading }) => {
  const navigate = useNavigate();

  const handleDateClick = (clickedDate: string) => {
    // Navigate to the list view for the selected date
    navigate(`/list/${clickedDate}`);
  };

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

      {/* Stats Summary */}
      {!loading && entries.length > 0 && (
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
      )}
    </div>
  );
};

export default Home;
