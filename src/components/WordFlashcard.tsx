import React from 'react';
import { X, Volume2, Sparkles, Check } from 'lucide-react';
import { sound } from '../utils/sound';
import { PantsVisual } from './PantsVisual';
import { TROUSERS_VARIANTS, SHORTS_VARIANTS } from '../data/pantsVariants';

interface WordFlashcardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WordFlashcard: React.FC<WordFlashcardProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const playWord = (word: 'trousers' | 'shorts') => {
    sound.speakWord(word);
    sound.playPop();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          title="关闭"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-kids font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> 备课教学闪卡 / Vocabulary Flashcards
          </div>
          <h2 className="text-2xl sm:text-3xl font-kids font-bold text-slate-800">
            Trousers 与 Shorts 区分与发音
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            点击喇叭图标听真人发音，观察长短裤特征帮助孩子们快速记忆！
          </p>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Trousers Card */}
          <div className="bg-amber-50/60 rounded-2xl p-5 border-2 border-amber-300 flex flex-col items-center text-center relative hover:shadow-lg transition-shadow">
            <div className="w-24 h-36 mb-3 flex items-center justify-center">
              <PantsVisual variant={TROUSERS_VARIANTS[0]} />
            </div>

            <div className="w-full">
              <div className="flex items-center justify-center gap-2">
                <h3 className="font-kids text-2xl font-extrabold text-amber-950 tracking-wide">
                  trousers
                </h3>
                <button
                  onClick={() => playWord('trousers')}
                  className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-sm transition-transform active:scale-90"
                  title="朗读 trousers"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="font-mono text-xs text-amber-700 font-medium mt-0.5">
                [ˈtraʊzəz]
              </div>
              <div className="text-sm font-bold text-amber-900 mt-1">
                长裤 (复数名词)
              </div>

              <div className="mt-3 text-xs text-left bg-white/80 p-2.5 rounded-xl border border-amber-200/70 text-slate-700 space-y-1">
                <div className="font-semibold text-amber-900 flex items-center gap-1">
                  <Check className="w-3 h-3 text-amber-600" /> 特征：裤腿长，垂到脚踝
                </div>
                <div>💡 例句：He wears long blue trousers.</div>
                <div className="text-slate-500">记忆法：Trousers 很长 (Long!)</div>
              </div>
            </div>
          </div>

          {/* Shorts Card */}
          <div className="bg-sky-50/60 rounded-2xl p-5 border-2 border-sky-300 flex flex-col items-center text-center relative hover:shadow-lg transition-shadow">
            <div className="w-24 h-36 mb-3 flex items-center justify-center">
              <PantsVisual variant={SHORTS_VARIANTS[0]} />
            </div>

            <div className="w-full">
              <div className="flex items-center justify-center gap-2">
                <h3 className="font-kids text-2xl font-extrabold text-sky-950 tracking-wide">
                  shorts
                </h3>
                <button
                  onClick={() => playWord('shorts')}
                  className="p-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-sm transition-transform active:scale-90"
                  title="朗读 shorts"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="font-mono text-xs text-sky-700 font-medium mt-0.5">
                [ʃɔːts]
              </div>
              <div className="text-sm font-bold text-sky-900 mt-1">
                短裤 (复数名词)
              </div>

              <div className="mt-3 text-xs text-left bg-white/80 p-2.5 rounded-xl border border-sky-200/70 text-slate-700 space-y-1">
                <div className="font-semibold text-sky-900 flex items-center gap-1">
                  <Check className="w-3 h-3 text-sky-600" /> 特征：裤腿短，膝盖以上
                </div>
                <div>💡 例句：I wear cool shorts in summer.</div>
                <div className="text-slate-500">记忆法：Shorts 本身就是 short (短)!</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom classroom tip */}
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-600">
          <span className="font-medium">
            💡 教师小建议：两个单词均为复数形式（两只裤腿），需搭配 are 或 pair of 使用。
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-kids font-bold rounded-xl shadow-sm transition-all text-xs"
          >
            开始游戏！
          </button>
        </div>
      </div>
    </div>
  );
};
