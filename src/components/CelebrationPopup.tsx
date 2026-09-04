import React from 'react';
import { FloatingFeedback } from '../types';
import { Sparkles, Star } from 'lucide-react';

interface CelebrationPopupProps {
  feedbacks: FloatingFeedback[];
}

export const CelebrationPopup: React.FC<CelebrationPopupProps> = ({ feedbacks }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {feedbacks.map((fb) => {
        const isTrousers = fb.type === 'trousers';
        return (
          <div
            key={fb.id}
            className="absolute flex flex-col items-center animate-reward-float transition-transform"
            style={{
              left: `${fb.x}px`,
              top: `${fb.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Pop badge */}
            <div
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl shadow-xl border-2 font-kids backdrop-blur-md transform -translate-y-4 scale-110 ${
                isTrousers
                  ? 'bg-amber-500/95 text-white border-amber-200 shadow-amber-500/40'
                  : 'bg-sky-500/95 text-white border-sky-200 shadow-sky-500/40'
              }`}
            >
              <Star className="w-5 h-5 fill-yellow-300 text-yellow-200 animate-spin" />
              <div className="flex flex-col items-start leading-none">
                <div className="flex items-center gap-1">
                  <span className="text-xl font-black tracking-wider uppercase">
                    {fb.text}
                  </span>
                  <span className="text-xs bg-white/25 px-1.5 py-0.5 rounded-full font-bold">
                    +{fb.points}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-white/90 mt-0.5 font-medium">
                  {fb.subText}
                </span>
              </div>
              <Sparkles className="w-4 h-4 text-yellow-200" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
