
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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sentence || !formData.meaning) {
      alert("문장과 의미를 모두 입력해주세요.");
      return;
    }
    setShowPasswordModal(true);
    setPasswordError(false);
  };

  const handleFinalSubmit = async () => {
    if (password !== '1129') {
      setPasswordError(true);
      return;
    }

    setIsSubmitting(true);
    setShowPasswordModal(false);
    
    try {
      await gasService.addEntry(formData);
      onSave();
      navigate(`/study/${formData.date}`);
    } catch (err) {
      alert("데이터 저장에 실패했습니다. GAS URL 설정을 확인해주세요.");
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
        <h2 className="text-2xl font-bold text-slate-800">새 문장 추가</h2>
      </div>

      <form onSubmit={handleOpenModal} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">날짜</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">영어 문장</label>
          <textarea
            required
            placeholder="e.g. The quick brown fox jumps over the lazy dog."
            value={formData.sentence}
            onChange={(e) => setFormData({ ...formData, sentence: e.target.value })}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">의미 (한국어)</label>
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
          <label className="block text-sm font-semibold text-slate-600 mb-1">힌트 (선택)</label>
          <input
            type="text"
            placeholder="학습에 도움이 될 힌트를 적어주세요."
            value={formData.hint}
            onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">참고 URL (선택)</label>
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
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : null}
            <span>저장하기</span>
          </button>
        </div>
      </form>

      {/* Password Modal Overlay */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-8 space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">비밀번호 확인</h3>
              <p className="text-slate-500 text-sm">저장하려면 비밀번호를 입력해주세요.</p>
            </div>

            <div className="space-y-1">
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleFinalSubmit()}
                placeholder="Password"
                className={`w-full p-4 text-center text-xl tracking-widest bg-slate-50 border-2 rounded-2xl outline-none transition-all ${passwordError ? 'border-rose-400 bg-rose-50' : 'border-slate-100 focus:border-indigo-500 focus:bg-white'}`}
              />
              {passwordError && (
                <p className="text-center text-rose-500 text-xs font-semibold">비밀번호가 틀렸습니다.</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                }}
                className="flex-1 py-3 text-slate-500 font-bold rounded-xl hover:bg-slate-100 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all active:scale-95"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEntry;
