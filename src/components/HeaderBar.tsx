import React from 'react';
import { GameMode, SpeedLevel, GameStats } from '../types';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  Pause,
  Play,
  Maximize2,
  Sparkles,
  Flame,
  CheckCircle2,
  Volume1,
  Music,
} from 'lucide-react';
import { sound } from '../utils/sound';

interface HeaderBarProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  speedLevel: SpeedLevel;
  onSpeedChange: (speed: SpeedLevel) => void;
  stats: GameStats;
  isPaused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
  onOpenCardModal: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  isBgmPlaying: boolean;
  onToggleBgm: () => void;
  showHints: boolean;
  onToggleHints: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentMode,
  onModeChange,
  speedLevel,
  onSpeedChange,
  stats,
  isPaused,
  onTogglePause,
  onReset,
  onOpenCardModal,
  soundMuted,
  onToggleSound,
  isBgmPlaying,
  onToggleBgm,
  showHints,
  onToggleHints,
}) => {
  const isTrousersMode = currentMode === 'trousers';

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleSpeakCurrentWord = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.speakWord(currentMode);
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-sm z-30 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Mode Switcher & Educational Word Target */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shadow-inner">
            <button
              id="mode-btn-trousers"
              onClick={() => onModeChange('trousers')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-kids text-sm font-semibold transition-all ${
                isTrousersMode
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span className="text-base">👖</span>
              <span>模式一：抓长裤</span>
              <span className="hidden sm:inline text-xs opacity-90">(Trousers)</span>
            </button>

            <button
              id="mode-btn-shorts"
              onClick={() => onModeChange('shorts')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-kids text-sm font-semibold transition-all ${
                !isTrousersMode
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span className="text-base">🩳</span>
              <span>模式二：抓短裤</span>
              <span className="hidden sm:inline text-xs opacity-90">(Shorts)</span>
            </button>
          </div>

          {/* Active Target Banner with audio repetition */}
          <div
            onClick={handleSpeakCurrentWord}
            title="点击收听标准发音 Click to pronounce"
            className={`cursor-pointer group flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all active:scale-95 shadow-sm ${
              isTrousersMode
                ? 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100/80'
                : 'bg-sky-50 border-sky-300 text-sky-950 hover:bg-sky-100/80'
            }`}
          >
            <span className="text-xs uppercase tracking-wider font-semibold opacity-70">
              当前目标:
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-kids text-lg font-bold tracking-wide">
                {isTrousersMode ? 'TROUSERS' : 'SHORTS'}
              </span>
              <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                {isTrousersMode ? '[ˈtraʊzəz]' : '[ʃɔːts]'}
              </span>
              <span className="text-xs font-medium text-slate-600">
                ({isTrousersMode ? '长裤' : '短裤'})
              </span>
            </div>
            <Volume1 className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors animate-pulse" />
          </div>
        </div>

        {/* Center: Speed Levels */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 hidden lg:inline">
            掉落速度:
          </span>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
            {(
              [
                { key: 'slow', label: '慢速', desc: '入门' },
                { key: 'medium', label: '中速', desc: '标准' },
                { key: 'fast', label: '快速', desc: '挑战' },
              ] as const
            ).map((s) => (
              <button
                key={s.key}
                id={`speed-btn-${s.key}`}
                onClick={() => onSpeedChange(s.key)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  speedLevel === s.key
                    ? 'bg-white text-slate-800 font-bold shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Scores & Teacher Utility Actions */}
        <div className="flex items-center gap-3">
          {/* Streak & Score Counter */}
          <div className="flex items-center gap-3 bg-amber-50/70 border border-amber-200/70 px-3 py-1 rounded-xl">
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="font-kids text-base font-bold text-amber-900">
                {stats.score}
              </span>
              <span className="text-[11px] text-amber-700 font-medium">分</span>
            </div>

            {stats.streak > 1 && (
              <div className="flex items-center gap-0.5 bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold font-kids animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-white" />
                <span>{stats.streak}连击!</span>
              </div>
            )}
          </div>

          {/* Teacher Tool Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Flashcard button */}
            <button
              id="open-flashcard-btn"
              onClick={onOpenCardModal}
              title="查看单词教学卡片 / Word Cards"
              className="p-1.5 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Pause / Resume */}
            <button
              id="pause-resume-btn"
              onClick={onTogglePause}
              title={isPaused ? '继续游戏 Resume' : '暂停游戏 Pause'}
              className={`p-1.5 rounded-xl border transition-colors ${
                isPaused
                  ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>

            {/* BGM Toggle Button */}
            <button
              id="bgm-toggle-btn"
              onClick={onToggleBgm}
              title={isBgmPlaying ? '关闭背景音乐 Turn off BGM' : '开启轻快背景音乐 Turn on BGM'}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-xl border text-xs font-kids font-bold transition-all ${
                isBgmPlaying
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Music className={`w-3.5 h-3.5 ${isBgmPlaying ? 'text-amber-600 animate-bounce' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isBgmPlaying ? '音乐: 开' : '音乐: 关'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              id="sound-toggle-btn"
              onClick={onToggleSound}
              title={soundMuted ? '开启音效 Unmute SFX' : '静音音效 Mute SFX'}
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              {soundMuted ? (
                <VolumeX className="w-4 h-4 text-red-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              )}
            </button>

            {/* Reset */}
            <button
              id="reset-game-btn"
              onClick={onReset}
              title="重新开始 / Reset Score"
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              id="fullscreen-btn"
              onClick={toggleFullscreen}
              title="全屏显示 / Fullscreen"
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors hidden sm:block"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
