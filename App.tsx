
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddEntry from './pages/AddEntry';
import StudyView from './pages/StudyView';
import DateList from './pages/DateList';
import { EnglishEntry } from './types';
import { gasService } from './services/gasService';

const App: React.FC = () => {
  const [entries, setEntries] = useState<EnglishEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await gasService.fetchEntries();
      setEntries(data);
    } catch (err) {
      console.error("Failed to refresh data", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <Router>
      <div className="min-h-screen max-w-lg mx-auto bg-slate-50 relative shadow-xl overflow-hidden flex flex-col">
        <header className="bg-indigo-600 text-white p-4 sticky top-0 z-20 shadow-md">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-tight">영어회화 복습하기</h1>
            <button 
              onClick={() => refreshData()}
              className="p-1 hover:bg-indigo-500 rounded-full transition-colors"
              title="Refresh Data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-24">
          <Routes>
            <Route path="/" element={<Home entries={entries} loading={isLoading} />} />
            <Route path="/add" element={<AddEntry onSave={refreshData} />} />
            <Route path="/list/:date" element={<DateList entries={entries} />} />
            <Route path="/study/:date" element={<StudyView entries={entries} onRefresh={refreshData} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
