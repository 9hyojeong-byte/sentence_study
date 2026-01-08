
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gasService } from '../services/gasService';
import { EnglishEntry } from '../types';

interface AddEntryProps {
  onSave: () => void;
}

const AddEntry: React.FC<AddEntryProps> = ({ onSave }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preFilledDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<EnglishEntry>({
    date: preFilledDate,
    sentence: '',
    meaning: '',
    hint: '',
    referenceUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sentence || !formData.meaning) {
      alert("Please fill in both sentence and meaning.");
      return;
    }

    setIsSubmitting(true);
    try {
      await gasService.addEntry(formData);
      onSave();
      navigate(`/study/${formData.date}`);
    } catch (err) {
      alert("Failed to save entry. Make sure your GAS URL is correct.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-slate-800">Add New Entry</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Date</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">English Sentence</label>
          <textarea
            required
            placeholder="e.g. The quick brown fox jumps over the lazy dog."
            value={formData.sentence}
            onChange={(e) => setFormData({ ...formData, sentence: e.target.value })}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Meaning (Korean/Native)</label>
          <input
            type="text"
            required
            placeholder="의미를 입력하세요"
            value={formData.meaning}
            onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Hint (Optional)</label>
          <input
            type="text"
            placeholder="e.g. It's a pangram."
            value={formData.hint}
            onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Reference URL (Optional)</label>
          <input
            type="url"
            placeholder="https://..."
            value={formData.referenceUrl}
            onChange={(e) => setFormData({ ...formData, referenceUrl: e.target.value })}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-4 px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : null}
            <span>Save Entry</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEntry;
