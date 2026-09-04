import React, { useState } from 'react';
import { FallingPantsItem, GameMode } from '../types';
import { PantsVisual } from './PantsVisual';

interface PantsItemProps {
  item: FallingPantsItem;
  currentMode: GameMode;
  onItemClick: (item: FallingPantsItem, event: React.MouseEvent) => void;
  showHints?: boolean;
  screenScale?: number;
}

export const PantsItem: React.FC<PantsItemProps> = ({
  item,
  currentMode,
  onItemClick,
  showHints = true,
  screenScale = 1.0,
}) => {
  const [clickedWrong, setClickedWrong] = useState(false);
  const isTarget = item.type === currentMode;
  const isTrousers = item.type === 'trousers';

  // Proportional sizing scaled dynamically for large screens and electronic whiteboards
  const baseWidth = 86 * item.scale * screenScale;
  const baseHeight = (isTrousers ? 130 : 76) * item.scale * screenScale;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.isCollected) return;

    if (isTarget) {
      onItemClick(item, e);
    } else {
      // User rule:
      // Mode 1: 点击短裤无反应
      // Mode 2: 点击长裤无反应
      // Trigger a silent micro-nudge or do nothing
      setClickedWrong(true);
      setTimeout(() => setClickedWrong(false), 200);
      onItemClick(item, e); // parent knows it wasn't the target
    }
  };

  // Sway offset calculated from item's swayAmp and swayFreq
  const swayX = Math.sin(item.y * 0.015 + item.swayOffset) * item.swayAmp;
  const tilt = item.rotation + Math.cos(item.y * 0.01 + item.swayOffset) * 6;

  if (item.isCollected) {
    return (
      <div
        className="absolute pointer-events-none transition-all duration-300 ease-out transform"
        style={{
          left: `calc(${item.x}% + ${swayX}px)`,
          top: `${item.y}px`,
          transform: `translate(-50%, -50%) scale(1.4) rotate(${tilt + 20}deg)`,
          opacity: 0,
        }}
      >
        <div
          style={{ width: `${baseWidth}px`, height: `${baseHeight}px` }}
          className="filter brightness-125 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]"
        >
          <PantsVisual variant={item.variant} />
        </div>
      </div>
    );
  }

  return (
    <div
      id={`pants-item-${item.id}`}
      onClick={handleClick}
      className={`absolute cursor-pointer transition-transform select-none group touch-manipulation active:scale-95 ${
        clickedWrong ? 'opacity-80' : ''
      }`}
      style={{
        left: `calc(${item.x}% + ${swayX}px)`,
        top: `${item.y}px`,
        transform: `translate(-50%, -50%) rotate(${tilt}deg)`,
        width: `${baseWidth}px`,
        height: `${baseHeight}px`,
        zIndex: Math.round(item.y),
      }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Soft shadow below */}
        <div
          className="absolute -bottom-3 w-4/5 h-2 bg-slate-900/15 rounded-full blur-[3px] pointer-events-none transform group-hover:scale-110 transition-transform"
        />

        {/* The SVG Graphic */}
        <div className="w-full h-full transform transition-transform group-hover:scale-105">
          <PantsVisual variant={item.variant} />
        </div>

        {/* Optional classroom helper badge (shows "长裤 Long" or "短裤 Short") */}
        {showHints && (
          <div
            className={`absolute -bottom-5 px-2 py-0.5 rounded-full text-[11px] font-kids font-medium tracking-wide whitespace-nowrap shadow-sm border transition-opacity pointer-events-none ${
              isTrousers
                ? 'bg-amber-100/95 text-amber-900 border-amber-300'
                : 'bg-sky-100/95 text-sky-900 border-sky-300'
            }`}
          >
            {isTrousers ? '长裤 Trousers' : '短裤 Shorts'}
          </div>
        )}
      </div>
    </div>
  );
};
