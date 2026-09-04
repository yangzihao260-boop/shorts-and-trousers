import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  GameMode,
  SpeedLevel,
  FallingPantsItem,
  FloatingFeedback,
  GameStats,
} from '../types';
import { getRandomVariant } from '../data/pantsVariants';
import { PantsItem } from './PantsItem';
import { CelebrationPopup } from './CelebrationPopup';
import { sound } from '../utils/sound';
import { Sparkles, Play } from 'lucide-react';

interface GameAreaProps {
  currentMode: GameMode;
  speedLevel: SpeedLevel;
  stats: GameStats;
  setStats: React.Dispatch<React.SetStateAction<GameStats>>;
  isPaused: boolean;
  setIsPaused: (p: boolean) => void;
  showHints: boolean;
}

export const GameArea: React.FC<GameAreaProps> = ({
  currentMode,
  speedLevel,
  stats,
  setStats,
  isPaused,
  setIsPaused,
  showHints,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<FallingPantsItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<FloatingFeedback[]>([]);
  const [screenScale, setScreenScale] = useState<number>(1.0);

  // Keep references for the requestAnimationFrame loop
  const itemsRef = useRef<FallingPantsItem[]>([]);
  itemsRef.current = items;

  const lastSpawnTime = useRef<number>(performance.now());
  const lastFrameTime = useRef<number>(performance.now());
  const isPausedRef = useRef<boolean>(isPaused);
  isPausedRef.current = isPaused;

  const currentModeRef = useRef<GameMode>(currentMode);
  currentModeRef.current = currentMode;

  const speedLevelRef = useRef<SpeedLevel>(speedLevel);
  speedLevelRef.current = speedLevel;

  // Responsive screen size tracking using ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (!containerRef.current) return;
      const height = containerRef.current.clientHeight || 750;
      // Scales gracefully for large displays (1080p, 1440p, 4K electronic whiteboards)
      // Reference standard classroom height ~ 720px
      const scale = Math.min(Math.max(height / 700, 0.9), 2.2);
      setScreenScale(scale);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Speed and interval configuration adapted dynamically to screen height
  const getSpeedConfig = useCallback((level: SpeedLevel, containerHeight: number) => {
    switch (level) {
      case 'slow':
        // Fall duration ~5.8s - 7.2s
        return {
          fallDurationMin: 5.8,
          fallDurationMax: 7.2,
          spawnInterval: 3400,
          maxConcurrent: 20,
        };
      case 'fast':
        // Fast mode is extra brisk: fall duration ~1.1s - 1.6s across screen!
        return {
          fallDurationMin: 1.1,
          fallDurationMax: 1.6,
          spawnInterval: 1400,
          maxConcurrent: 25,
        };
      case 'medium':
      default:
        // Fall duration ~2.8s - 3.8s
        return {
          fallDurationMin: 2.8,
          fallDurationMax: 3.8,
          spawnInterval: 2400,
          maxConcurrent: 25,
        };
    }
  }, []);

  // Spawn a wave of 5 falling pants simultaneously across 5 spaced lanes
  const spawnWaveOfFive = useCallback(() => {
    if (!containerRef.current) return;
    const containerHeight = containerRef.current.clientHeight || 750;
    const config = getSpeedConfig(speedLevelRef.current, containerHeight);

    if (itemsRef.current.length >= config.maxConcurrent) return;

    // 5 horizontal lanes across the screen (percentages: ~11%, ~30%, ~50%, ~70%, ~89%)
    const baseLanes = [11, 30, 50, 70, 89];
    // Shuffle lanes slightly to create visual variety
    const shuffledLanes = [...baseLanes].sort(() => Math.random() - 0.5);

    const newWave: FallingPantsItem[] = [];

    for (let i = 0; i < 5; i++) {
      // Randomly decide trousers or shorts for each item
      // Resulting in random mix: e.g. 3 trousers + 2 shorts, 1 trousers + 4 shorts, etc.
      const itemType = Math.random() < 0.5 ? 'trousers' : 'shorts';
      const variant = getRandomVariant(itemType);

      // Lane position with slight organic jitter (±3.5%)
      const laneX = Math.max(6, Math.min(94, shuffledLanes[i] + (Math.random() - 0.5) * 7));

      // Speed in px/s calculated directly from screen height to guarantee identical timing on big screens
      const fallDuration =
        config.fallDurationMin +
        Math.random() * (config.fallDurationMax - config.fallDurationMin);
      const speed = containerHeight / fallDuration;

      // Varied scale & tilt
      const scale = 0.86 + Math.random() * 0.36;
      const rotation = (Math.random() - 0.5) * 26;

      // Slight vertical stagger so they enter like a flutter of clothes
      const startY = -140 - Math.random() * 80;

      const newItem: FallingPantsItem = {
        id: `${itemType}-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
        type: itemType,
        material: variant.material,
        variant,
        x: laneX,
        y: startY,
        speed,
        scale,
        rotation,
        swayAmp: 16 + Math.random() * 24,
        swayFreq: 1.6 + Math.random() * 1.6,
        swayOffset: Math.random() * Math.PI * 2,
        isCollected: false,
      };

      newWave.push(newItem);
    }

    setItems((prev) => [...prev, ...newWave]);
  }, [getSpeedConfig]);

  // Main game animation loop
  useEffect(() => {
    let animId: number;

    const updateLoop = (now: number) => {
      const delta = (now - lastFrameTime.current) / 1000;
      lastFrameTime.current = now;

      if (!isPausedRef.current && containerRef.current) {
        const containerHeight = containerRef.current.clientHeight || 750;
        const config = getSpeedConfig(speedLevelRef.current, containerHeight);

        // Check if we should spawn the next wave of 5 pants
        if (now - lastSpawnTime.current > config.spawnInterval) {
          spawnWaveOfFive();
          lastSpawnTime.current = now;
        }

        // Move all items down with delta time
        setItems((prevItems) => {
          return prevItems
            .map((item) => {
              if (item.isCollected) {
                return item;
              }
              return {
                ...item,
                y: item.y + item.speed * delta,
              };
            })
            .filter((item) => {
              // Recycle items that have flown past the bottom
              if (item.y > containerHeight + 120) {
                return false;
              }
              return true;
            });
        });
      }

      animId = requestAnimationFrame(updateLoop);
    };

    lastFrameTime.current = performance.now();
    lastSpawnTime.current = performance.now() - 1000; // spawn first wave soon
    animId = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [getSpeedConfig, spawnWaveOfFive]);

  // Handle item click
  const handleItemClick = (item: FallingPantsItem, e: React.MouseEvent) => {
    if (isPaused) return;
    const isTarget = item.type === currentMode;

    if (isTarget) {
      // SUCCESS!
      const rect = containerRef.current?.getBoundingClientRect();
      const clickX = rect ? e.clientX - rect.left : window.innerWidth / 2;
      const clickY = rect ? e.clientY - rect.top : item.y;

      // 1. Play rewarding audio
      const isCombo = stats.streak >= 4;
      sound.playSuccessChime(isCombo);
      sound.playPop();

      // 2. Speak English pronunciation
      sound.speakWord(item.type);

      // 3. Mark item as collected
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, isCollected: true, collectedAt: Date.now() } : it
        )
      );

      // Remove after pop animation finishes
      setTimeout(() => {
        setItems((prev) => prev.filter((it) => it.id !== item.id));
      }, 350);

      // 4. Update stats
      const newStreak = stats.streak + 1;
      const pointBonus = 100 + Math.min(newStreak * 10, 100);

      setStats((prev) => ({
        ...prev,
        score: prev.score + pointBonus,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        trousersCaught: item.type === 'trousers' ? prev.trousersCaught + 1 : prev.trousersCaught,
        shortsCaught: item.type === 'shorts' ? prev.shortsCaught + 1 : prev.shortsCaught,
        totalAttempts: prev.totalAttempts + 1,
      }));

      // 5. Confetti on multiples of 5 streak or milestones
      if (newStreak % 5 === 0) {
        sound.playFanfare();
        confetti({
          particleCount: 55,
          spread: 70,
          origin: {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
          },
          colors: ['#f59e0b', '#38bdf8', '#10b981', '#ec4899'],
        });
      }

      // 6. Add floating text feedback
      const feedbackId = `fb-${Date.now()}-${Math.random()}`;
      const wordText = item.type === 'trousers' ? 'TROUSERS!' : 'SHORTS!';
      const subText = item.type === 'trousers' ? '[ˈtraʊzəz] 长裤' : '[ʃɔːts] 短裤';

      setFeedbacks((prev) => [
        ...prev,
        {
          id: feedbackId,
          x: clickX,
          y: clickY,
          text: wordText,
          subText,
          type: item.type,
          points: pointBonus,
        },
      ]);

      // Remove floating feedback after 1.2s
      setTimeout(() => {
        setFeedbacks((prev) => prev.filter((fb) => fb.id !== feedbackId));
      }, 1200);
    } else {
      // User rule:
      // Mode 1: 点击短裤无反应
      // Mode 2: 点击长裤无反应
      // Absolutely no reward, no sound, no points.
    }
  };

  const isTrousersMode = currentMode === 'trousers';

  return (
    <div
      ref={containerRef}
      id="game-canvas-area"
      className="relative w-full flex-1 overflow-hidden select-none bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50"
    >
      {/* Dynamic Animated Clouds & Sky Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        {/* Sun */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-300 rounded-full blur-2xl opacity-40 animate-pulse" />
        <div className="absolute top-6 right-10 w-16 h-16 bg-amber-200/80 rounded-full border-4 border-amber-300/40 shadow-lg flex items-center justify-center">
          <span className="text-2xl">☀️</span>
        </div>

        {/* Fluffy vector clouds */}
        <div className="absolute top-12 left-10 w-44 h-16 bg-white/75 rounded-full blur-[1px] shadow-sm animate-pulse" />
        <div className="absolute top-28 right-40 w-56 h-20 bg-white/70 rounded-full blur-[1px] shadow-sm" />
        <div className="absolute top-44 left-1/3 w-64 h-20 bg-white/60 rounded-full blur-[1px] shadow-sm" />

        {/* Decorative laundry clothesline at the top */}
        <div className="absolute top-2 left-0 right-0 h-1 bg-amber-700/20 border-b border-dashed border-amber-800/30" />
      </div>

      {/* Mode Instruction Reminder Watermark / Banner */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex flex-col items-center">
        <div
          className={`px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm border font-kids text-sm font-bold flex items-center gap-2 ${
            isTrousersMode
              ? 'bg-amber-100/90 text-amber-900 border-amber-300'
              : 'bg-sky-100/90 text-sky-900 border-sky-300'
          }`}
        >
          <span className="text-base">{isTrousersMode ? '👖' : '🩳'}</span>
          <span>
            {isTrousersMode ? '模式一：点击长裤 (Trousers)' : '模式二：点击短裤 (Shorts)'}
          </span>
          <span className="text-xs opacity-80 font-normal">
            {isTrousersMode ? '• 点击短裤无反应' : '• 点击长裤无反应'}
          </span>
        </div>
      </div>

      {/* Falling Pants Elements */}
      {items.map((item) => (
        <PantsItem
          key={item.id}
          item={item}
          currentMode={currentMode}
          onItemClick={handleItemClick}
          showHints={showHints}
          screenScale={screenScale}
        />
      ))}

      {/* Floating Word & Reward Popups */}
      <CelebrationPopup feedbacks={feedbacks} />

      {/* Bottom Ground with Cute Laundry Baskets & Grass */}
      <div className="absolute bottom-0 left-0 right-0 h-14 sm:h-18 bg-gradient-to-t from-emerald-600 to-emerald-500 border-t-4 border-emerald-400 flex items-center justify-between px-6 z-20 shadow-lg">
        {/* Left basket: Trousers collection */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all ${
            isTrousersMode
              ? 'bg-amber-100 border-amber-400 shadow-md scale-105'
              : 'bg-emerald-700/60 border-emerald-600/60 text-white/80'
          }`}
        >
          <span className="text-2xl">👖</span>
          <div>
            <div className="text-[11px] font-kids font-bold uppercase tracking-wider">
              Trousers 长裤
            </div>
            <div className="font-kids text-base font-extrabold leading-none">
              {stats.trousersCaught} <span className="text-xs font-normal">条</span>
            </div>
          </div>
        </div>

        {/* Center Prompt / Encourage */}
        <div className="hidden md:flex flex-col items-center text-white text-center font-kids">
          <div className="text-xs font-medium flex items-center gap-1 text-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>每次同时飘落 5 条裤子，找准目标快速点击！</span>
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          </div>
          <div className="text-[11px] text-emerald-200">
            Trousers are long • Shorts are short
          </div>
        </div>

        {/* Right basket: Shorts collection */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all ${
            !isTrousersMode
              ? 'bg-sky-100 border-sky-400 shadow-md scale-105'
              : 'bg-emerald-700/60 border-emerald-600/60 text-white/80'
          }`}
        >
          <span className="text-2xl">🩳</span>
          <div>
            <div className="text-[11px] font-kids font-bold uppercase tracking-wider">
              Shorts 短裤
            </div>
            <div className="font-kids text-base font-extrabold leading-none">
              {stats.shortsCaught} <span className="text-xs font-normal">条</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pause Screen Overlay */}
      {isPaused && (
        <div className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border-4 border-amber-300 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center text-3xl mb-4 text-amber-600 shadow-inner">
              ⏸️
            </div>
            <h3 className="font-kids text-2xl font-bold text-slate-800">游戏已暂停</h3>
            <p className="text-sm text-slate-600 mt-2">
              老师可以带领全班同学一起认读并区分当前的裤子款式喔！
            </p>

            <div className="my-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium">
              当前目标：{isTrousersMode ? '👖 Trousers (长裤)' : '🩳 Shorts (短裤)'}
            </div>

            <button
              onClick={() => setIsPaused(false)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-kids font-bold text-base rounded-2xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>继续游戏 (Resume)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
