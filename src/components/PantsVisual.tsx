import React from 'react';
import { PantsVariant } from '../types';

interface PantsVisualProps {
  variant: PantsVariant;
  className?: string;
  showBadge?: boolean;
}

export const PantsVisual: React.FC<PantsVisualProps> = ({ variant, className = '' }) => {
  const isTrousers = variant.type === 'trousers';
  const pId = `pattern-${variant.id}`;

  if (isTrousers) {
    // Trousers: Tall aspect ratio (viewBox: 0 0 100 145)
    // Waist at y=15..28, legs reach down to y=140! Very long legs!
    return (
      <svg
        viewBox="0 0 100 148"
        className={`drop-shadow-md select-none transition-transform ${className}`}
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          {/* Subtle 3D shadow/gradient */}
          <linearGradient id={`grad-${variant.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={variant.secondaryColor} stopOpacity="0.9" />
            <stop offset="25%" stopColor={variant.primaryColor} />
            <stop offset="75%" stopColor={variant.primaryColor} />
            <stop offset="100%" stopColor={variant.secondaryColor} stopOpacity="0.9" />
          </linearGradient>

          {/* Plaid pattern */}
          {variant.patternType === 'plaid-grid' && (
            <pattern id={pId} width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill={variant.primaryColor} />
              <line x1="0" y1="8" x2="16" y2="8" stroke={variant.accentColor} strokeWidth="2" strokeOpacity="0.7" />
              <line x1="8" y1="0" x2="8" y2="16" stroke={variant.accentColor} strokeWidth="2" strokeOpacity="0.7" />
              <line x1="0" y1="0" x2="16" y2="16" stroke={variant.secondaryColor} strokeWidth="1" strokeOpacity="0.5" />
            </pattern>
          )}

          {/* Striped pattern */}
          {variant.patternType === 'pin-stripes' && (
            <pattern id={pId} width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill={variant.primaryColor} />
              <line x1="4" y1="0" x2="4" y2="8" stroke={variant.accentColor} strokeWidth="1.5" strokeOpacity="0.6" />
            </pattern>
          )}

          {/* Camo pattern */}
          {variant.patternType === 'cargo-pocket' && (
            <pattern id={pId} width="24" height="24" patternUnits="userSpaceOnUse">
              <rect width="24" height="24" fill={variant.primaryColor} />
              <circle cx="6" cy="6" r="4" fill={variant.secondaryColor} opacity="0.6" />
              <ellipse cx="18" cy="14" rx="5" ry="3" fill={variant.accentColor} opacity="0.6" />
              <ellipse cx="8" cy="19" rx="4" ry="3" fill={variant.secondaryColor} opacity="0.5" />
            </pattern>
          )}
        </defs>

        {/* Outer Trousers Body (Long legs extending to y=140) */}
        <g id={`trousers-body-${variant.id}`}>
          <path
            d="
              M 22 18
              Q 50 20 78 18
              L 82 45
              L 80 138
              Q 70 141 60 138
              L 54 62
              Q 50 56 46 62
              L 40 138
              Q 30 141 20 138
              L 18 45
              Z
            "
            fill={
              variant.patternType === 'plaid-grid' ||
              variant.patternType === 'pin-stripes' ||
              variant.patternType === 'cargo-pocket'
                ? `url(#${pId})`
                : `url(#grad-${variant.id})`
            }
            stroke={variant.secondaryColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Sport Side Stripes */}
          {variant.patternType === 'side-stripe' && (
            <>
              {/* Left outer double stripe */}
              <path d="M 21 24 L 17 50 L 19 138" stroke={variant.accentColor} strokeWidth="2.5" fill="none" />
              <path d="M 24 24 L 20 50 L 22 138" stroke={variant.accentColor} strokeWidth="1.5" fill="none" />
              {/* Right outer double stripe */}
              <path d="M 79 24 L 83 50 L 81 138" stroke={variant.accentColor} strokeWidth="2.5" fill="none" />
              <path d="M 76 24 L 80 50 L 78 138" stroke={variant.accentColor} strokeWidth="1.5" fill="none" />
            </>
          )}

          {/* Denim Stitch Lines & Accents */}
          {variant.patternType === 'denim-stitch' && (
            <>
              {/* Inseam / Outer stitch */}
              <path d="M 23 20 L 20 48 L 22 137" stroke={variant.accentColor} strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
              <path d="M 77 20 L 80 48 L 78 137" stroke={variant.accentColor} strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
              {/* Fly J-curve */}
              <path d="M 50 24 L 50 44 Q 50 50 45 52" stroke={variant.accentColor} strokeWidth="1.5" fill="none" />
              {/* Front Curved Pockets */}
              <path d="M 25 24 Q 38 27 34 40" stroke={variant.accentColor} strokeWidth="1.5" fill="none" />
              <path d="M 75 24 Q 62 27 66 40" stroke={variant.accentColor} strokeWidth="1.5" fill="none" />
              {/* Coin pocket */}
              <path d="M 68 28 L 74 29" stroke={variant.accentColor} strokeWidth="1.5" fill="none" />
              {/* Knee stress marks */}
              <path d="M 27 88 Q 33 87 35 90" stroke={variant.secondaryColor} strokeWidth="1.5" fill="none" opacity="0.6" />
              <path d="M 65 88 Q 71 87 73 90" stroke={variant.secondaryColor} strokeWidth="1.5" fill="none" opacity="0.6" />
            </>
          )}

          {/* Khaki Crease lines */}
          {variant.patternType === 'crease' && (
            <>
              <line x1="30" y1="36" x2="30" y2="136" stroke={variant.secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="70" y1="36" x2="70" y2="136" stroke={variant.secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
              {/* Slash side pockets */}
              <line x1="24" y1="26" x2="32" y2="44" stroke={variant.accentColor} strokeWidth="1.8" />
              <line x1="76" y1="26" x2="68" y2="44" stroke={variant.accentColor} strokeWidth="1.8" />
            </>
          )}

          {/* Cargo Pockets */}
          {variant.patternType === 'cargo-pocket' && (
            <>
              {/* Left thigh cargo pocket */}
              <rect x="17" y="68" width="14" height="22" rx="2" fill={variant.secondaryColor} stroke="#27272a" strokeWidth="1.2" opacity="0.85" />
              <path d="M 16 68 L 32 68 L 24 74 Z" fill={variant.accentColor} stroke="#27272a" strokeWidth="1" />
              {/* Right thigh cargo pocket */}
              <rect x="69" y="68" width="14" height="22" rx="2" fill={variant.secondaryColor} stroke="#27272a" strokeWidth="1.2" opacity="0.85" />
              <path d="M 68 68 L 84 68 L 76 74 Z" fill={variant.accentColor} stroke="#27272a" strokeWidth="1" />
            </>
          )}

          {/* Sweatpants / Joggers Ribbed Cuffs & Drawstring */}
          {variant.patternType === 'jogger-cuff' && (
            <>
              {/* Ankle ribbed cuff bands */}
              <rect x="19" y="132" width="22" height="9" rx="2" fill={variant.secondaryColor} stroke="#334155" strokeWidth="1" />
              <rect x="59" y="132" width="22" height="9" rx="2" fill={variant.secondaryColor} stroke="#334155" strokeWidth="1" />
              {/* Cuff ribbing lines */}
              <line x1="25" y1="132" x2="25" y2="141" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="30" y1="132" x2="30" y2="141" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="35" y1="132" x2="35" y2="141" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="65" y1="132" x2="65" y2="141" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="70" y1="132" x2="70" y2="141" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="75" y1="132" x2="75" y2="141" stroke="#cbd5e1" strokeWidth="1" />
              {/* Front Drawstring Strings */}
              <path d="M 48 24 Q 46 34 43 40" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M 52 24 Q 54 34 57 39" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="50" cy="23" r="2.5" fill="#f8fafc" />
            </>
          )}

          {/* Waistband for all trousers */}
          <path
            d="M 21 16 Q 50 19 79 16 L 79 26 Q 50 28 21 26 Z"
            fill={variant.secondaryColor}
            stroke={variant.secondaryColor}
            strokeWidth="1.5"
          />

          {/* Belt Loops */}
          <rect x="28" y="16" width="3" height="10" rx="1" fill="#fef08a" opacity="0.8" />
          <rect x="42" y="17" width="3" height="10" rx="1" fill="#fef08a" opacity="0.8" />
          <rect x="55" y="17" width="3" height="10" rx="1" fill="#fef08a" opacity="0.8" />
          <rect x="69" y="16" width="3" height="10" rx="1" fill="#fef08a" opacity="0.8" />

          {/* Waist Button */}
          <circle cx="50" cy="21" r="3" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
          <circle cx="50" cy="21" r="1.5" fill="#fef3c7" />

          {/* Ankle Hem Fold Lines for other trousers */}
          {variant.patternType !== 'jogger-cuff' && (
            <>
              <line x1="20" y1="134" x2="40" y2="134" stroke={variant.secondaryColor} strokeWidth="1.5" />
              <line x1="60" y1="134" x2="80" y2="134" stroke={variant.secondaryColor} strokeWidth="1.5" />
            </>
          )}
        </g>
      </svg>
    );
  }

  // Shorts: Compact/Wide aspect ratio (viewBox: 0 0 100 80)
  // Waist at y=14..24, legs end at y=68! Extremely short, distinctive cut!
  return (
    <svg
      viewBox="0 0 100 85"
      className={`drop-shadow-md select-none transition-transform ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        {/* Subtle 3D shadow/gradient */}
        <linearGradient id={`grad-s-${variant.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={variant.secondaryColor} stopOpacity="0.9" />
          <stop offset="25%" stopColor={variant.primaryColor} />
          <stop offset="75%" stopColor={variant.primaryColor} />
          <stop offset="100%" stopColor={variant.secondaryColor} stopOpacity="0.9" />
        </linearGradient>

        {/* Polka dots pattern */}
        {variant.patternType === 'polka-dots' && (
          <pattern id={pId} width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill={variant.primaryColor} />
            <circle cx="7" cy="7" r="3" fill="#ffffff" opacity="0.9" />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" opacity="0.9" />
            <circle cx="14" cy="0" r="1.5" fill="#ffffff" opacity="0.9" />
            <circle cx="0" cy="14" r="1.5" fill="#ffffff" opacity="0.9" />
            <circle cx="14" cy="14" r="1.5" fill="#ffffff" opacity="0.9" />
          </pattern>
        )}

        {/* Bold vertical stripes pattern */}
        {variant.patternType === 'bold-stripes' && (
          <pattern id={pId} width="12" height="12" patternUnits="userSpaceOnUse">
            <rect width="12" height="12" fill={variant.primaryColor} />
            <rect x="0" y="0" width="6" height="12" fill="#ffffff" opacity="0.85" />
          </pattern>
        )}

        {/* Tropical Hawaiian pattern */}
        {variant.patternType === 'tropical-print' && (
          <pattern id={pId} width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill={variant.primaryColor} />
            {/* Little tropical flower */}
            <circle cx="10" cy="10" r="2.5" fill="#fef08a" />
            <circle cx="10" cy="6" r="2" fill="#fb7185" opacity="0.9" />
            <circle cx="10" cy="14" r="2" fill="#fb7185" opacity="0.9" />
            <circle cx="6" cy="10" r="2" fill="#fb7185" opacity="0.9" />
            <circle cx="14" cy="10" r="2" fill="#fb7185" opacity="0.9" />
          </pattern>
        )}

        {/* Checkered pattern */}
        {variant.patternType === 'check-pattern' && (
          <pattern id={pId} width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill={variant.primaryColor} />
            <rect x="0" y="0" width="7" height="7" fill={variant.secondaryColor} opacity="0.7" />
            <rect x="7" y="7" width="7" height="7" fill={variant.secondaryColor} opacity="0.7" />
          </pattern>
        )}
      </defs>

      {/* Shorts Body (Short, wide legs ending at y=68) */}
      <g id={`shorts-body-${variant.id}`}>
        <path
          d="
            M 18 16
            Q 50 18 82 16
            L 87 36
            L 85 68
            Q 72 72 58 68
            L 52 46
            Q 50 42 48 46
            L 42 68
            Q 28 72 15 68
            L 13 36
            Z
          "
          fill={
            variant.patternType === 'polka-dots' ||
            variant.patternType === 'bold-stripes' ||
            variant.patternType === 'tropical-print' ||
            variant.patternType === 'check-pattern'
              ? `url(#${pId})`
              : `url(#grad-s-${variant.id})`
          }
          stroke={variant.secondaryColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Athletic running curved split trim */}
        {variant.patternType === 'curved-trim' && (
          <>
            {/* Curved side seam and bottom piping */}
            <path d="M 86 32 Q 88 56 78 68" stroke="#ffffff" strokeWidth="2.5" fill="none" />
            <path d="M 14 32 Q 12 56 22 68" stroke="#ffffff" strokeWidth="2.5" fill="none" />
            <path d="M 22 68 Q 32 71 42 68" stroke="#ffffff" strokeWidth="2" fill="none" />
            <path d="M 58 68 Q 68 71 78 68" stroke="#ffffff" strokeWidth="2" fill="none" />
          </>
        )}

        {/* Denim rolled-up cuff */}
        {variant.patternType === 'cuff-denim' && (
          <>
            {/* Rolled cuff at bottom of legs */}
            <path d="M 15 62 L 42 62 L 42 68 L 15 68 Z" fill="#93c5fd" stroke={variant.secondaryColor} strokeWidth="1.5" />
            <path d="M 58 62 L 85 62 L 85 68 L 58 68 Z" fill="#93c5fd" stroke={variant.secondaryColor} strokeWidth="1.5" />
            {/* Stitching */}
            <line x1="16" y1="64" x2="41" y2="64" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" />
            <line x1="59" y1="64" x2="84" y2="64" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" />
            {/* Fly J-curve */}
            <path d="M 50 20 L 50 34 Q 50 39 46 41" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
            {/* Rivets */}
            <circle cx="21" cy="24" r="1.5" fill="#f59e0b" />
            <circle cx="79" cy="24" r="1.5" fill="#f59e0b" />
          </>
        )}

        {/* Soccer short side contrast */}
        {variant.patternType === 'side-split' && (
          <>
            <path d="M 14 26 L 16 66 L 22 67 L 20 27 Z" fill={variant.accentColor} />
            <path d="M 86 26 L 84 66 L 78 67 L 80 27 Z" fill={variant.accentColor} />
          </>
        )}

        {/* Bermuda crease & pockets */}
        {variant.patternType === 'bermuda-crease' && (
          <>
            <line x1="28" y1="26" x2="28" y2="66" stroke={variant.secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="72" y1="26" x2="72" y2="66" stroke={variant.secondaryColor} strokeWidth="1.5" strokeOpacity="0.4" />
          </>
        )}

        {/* Elastic Waistband */}
        <path
          d="M 17 14 Q 50 17 83 14 L 83 23 Q 50 25 17 23 Z"
          fill={variant.secondaryColor}
          stroke={variant.secondaryColor}
          strokeWidth="1.5"
        />

        {/* Elastic waistband ridges */}
        <line x1="25" y1="15" x2="25" y2="23" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
        <line x1="33" y1="16" x2="33" y2="24" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
        <line x1="41" y1="16" x2="41" y2="24" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
        <line x1="59" y1="16" x2="59" y2="24" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
        <line x1="67" y1="16" x2="67" y2="24" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
        <line x1="75" y1="15" x2="75" y2="23" stroke="#ffffff" strokeWidth="1" opacity="0.4" />

        {/* Cute Beach Drawstring Tied Knot */}
        <circle cx="50" cy="20" r="2.5" fill="#f8fafc" />
        <path d="M 48 21 Q 45 28 42 32" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 52 21 Q 55 28 58 32" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
};
