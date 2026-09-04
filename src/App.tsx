/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, SpeedLevel, GameStats } from './types';
import { HeaderBar } from './components/HeaderBar';
import { GameArea } from './components/GameArea';
import { WordFlashcard } from './components/WordFlashcard';
import { sound } from './utils/sound';
import { HelpCircle, Eye, EyeOff } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('trousers');
  const [speedLevel, setSpeedLevel] = useState<SpeedLevel>('medium');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(true);

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    bestStreak: 0,
    trousersCaught: 0,
    shortsCaught: 0,
    totalAttempts: 0,
  });

  // Switch mode handler
  const handleModeChange = (mode: GameMode) => {
    setCurrentMode(mode);
    sound.playPop();
    sound.speakWord(mode);
  };

  // Switch speed handler
  const handleSpeedChange = (speed: SpeedLevel) => {
    setSpeedLevel(speed);
    sound.playPop();
  };

  // Toggle sound mute (SFX + Speech)
  const handleToggleSound = () => {
    const newMuted = !soundMuted;
    setSoundMuted(newMuted);
    sound.isMuted = newMuted;
  };

  // Toggle Background Music
  const handleToggleBgm = useCallback(() => {
    const newState = sound.toggleBGM();
    setIsBgmPlaying(newState);
  }, []);

  // Reset scores and game round
  const handleReset = () => {
    setStats({
      score: 0,
      streak: 0,
      bestStreak: 0,
      trousersCaught: 0,
      shortsCaught: 0,
      totalAttempts: 0,
    });
    sound.playPop();
  };

  // Optional: Auto start BGM on first user interaction if they haven't manually toggled yet
  useEffect(() => {
    const startAudioOnFirstInteraction = () => {
      sound.initCtx();
      window.removeEventListener('click', startAudioOnFirstInteraction);
      window.removeEventListener('keydown', startAudioOnFirstInteraction);
    };

    window.addEventListener('click', startAudioOnFirstInteraction);
    window.addEventListener('keydown', startAudioOnFirstInteraction);
    return () => {
      window.removeEventListener('click', startAudioOnFirstInteraction);
      window.removeEventListener('keydown', startAudioOnFirstInteraction);
    };
  }, []);

  // Keyboard accessibility for classroom whiteboards / keyboard remotes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      } else if (e.key === '1') {
        handleModeChange('trousers');
      } else if (e.key === '2') {
        handleModeChange('shorts');
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleBgm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleBgm]);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-amber-50 select-none">
      {/* Top Navigation & Controls */}
      <HeaderBar
        currentMode={currentMode}
        onModeChange={handleModeChange}
        speedLevel={speedLevel}
        onSpeedChange={handleSpeedChange}
        stats={stats}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused((prev) => !prev)}
        onReset={handleReset}
        onOpenCardModal={() => setShowCardModal(true)}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
        isBgmPlaying={isBgmPlaying}
        onToggleBgm={handleToggleBgm}
        showHints={showHints}
        onToggleHints={() => setShowHints((prev) => !prev)}
      />

      {/* Main Falling Game Area */}
      <GameArea
        currentMode={currentMode}
        speedLevel={speedLevel}
        stats={stats}
        setStats={setStats}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        showHints={showHints}
      />

      {/* Teacher Floating Helper / Hint Toggle Pill */}
      <div className="absolute bottom-16 sm:bottom-20 right-4 z-30 flex flex-col gap-2">
        <button
          onClick={() => setShowHints((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-kids font-semibold shadow-md border transition-all ${
            showHints
              ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
          }`}
          title={showHints ? '隐藏裤子底部名称标签 (测验模式)' : '显示裤子底部名称标签 (学习模式)'}
        >
          {showHints ? (
            <>
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              <span>提示文字: 开启</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
              <span>提示文字: 关闭 (盲测)</span>
            </>
          )}
        </button>

        <button
          onClick={() => setShowCardModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-kids font-semibold bg-white/90 text-amber-900 border border-amber-300 hover:bg-amber-100 shadow-md transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>单词闪卡</span>
        </button>
      </div>

      {/* Teacher Vocabulary Instruction Modal */}
      <WordFlashcard
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
      />
    </div>
  );
}
