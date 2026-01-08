
import React, { useState, useMemo } from 'react';
// Grouping date-fns imports: using individual imports for members reported as missing from the root
import { 
  format, 
  addMonths, 
  endOfMonth, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval,
  isValid
} from 'date-fns';
import { subMonths } from 'date-fns/subMonths';
import { startOfMonth } from 'date-fns/startOfMonth';
import { startOfWeek } from 'date-fns/startOfWeek';
import { parseISO } from 'date-fns/parseISO';
import { EnglishEntry } from '../types';

interface CalendarProps {
  entries: EnglishEntry[];
  onDateClick: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ entries, onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Normalize entry dates to a set of 'YYYY-MM-DD' strings for reliable lookups
  const entryDates = useMemo(() => {
    const dates = new Set<string>();
    entries.forEach(entry => {
      if (!entry.date) return;
      
      let normalizedDate = '';
      const dateStr = String(entry.date).trim();

      // Handle common formats: ISO, YYYY-MM-DD, or simple date strings
      if (dateStr.includes('T')) {
        const parsed = parseISO(dateStr);
        if (isValid(parsed)) normalizedDate = format(parsed, 'yyyy-MM-dd');
      } else if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        // Already YYYY-MM-DD or starts with it
        normalizedDate = dateStr.substring(0, 10);
      } else {
        // Fallback for other potential formats from Sheets
        const parsed = new Date(dateStr);
        if (isValid(parsed)) normalizedDate = format(parsed, 'yyyy-MM-dd');
      }

      if (normalizedDate) {
        dates.add(normalizedDate);
      }
    });
    return dates;
  }, [entries]);

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          aria-label="Previous Month"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-slate-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          aria-label="Next Month"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-1">
        {allDays.map((d, i) => {
          const dateStr = format(d, 'yyyy-MM-dd');
          const hasEntries = entryDates.has(dateStr);
          const isSelected = isSameDay(d, new Date());
          const isInCurrentMonth = isSameMonth(d, monthStart);

          return (
            <div
              key={i}
              onClick={() => onDateClick(dateStr)}
              className={`
                aspect-square flex flex-col items-center justify-center relative cursor-pointer rounded-lg transition-all
                ${!isInCurrentMonth ? 'text-slate-300 pointer-events-none opacity-40' : 'text-slate-700 hover:bg-indigo-50'}
                ${isSelected && isInCurrentMonth ? 'bg-indigo-100 text-indigo-700 font-bold ring-1 ring-indigo-200' : ''}
              `}
            >
              <span className="text-sm z-10">{format(d, 'd')}</span>
              {hasEntries && isInCurrentMonth && (
                <div 
                  className="absolute bottom-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-sm animate-pulse"
                  title="Recorded Entry"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
