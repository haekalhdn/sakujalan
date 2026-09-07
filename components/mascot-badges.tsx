import type React from 'react';

export interface MascotBadgeProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface MicroIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/* ==========================================================================
   AUTHENTIC GOJEK-THEMED CHARACTER & MASCOT BADGES
   ========================================================================== */

/**
 * Authentic Chameleon Mascot Badge
 * Features curled tail, prominent concentric eye, spine ridge, and gold dollar coin.
 */
export function ChameleonBadge({ size = 48, className, style }: MascotBadgeProps): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0, display: 'inline-block', ...style }}
      aria-label="Chameleon Mascot Badge"
    >
      {/* Outer circular badge */}
      <circle cx="45" cy="45" r="41" fill="#E8F8EE" stroke="#00DF82" strokeWidth="2.5" />

      {/* Chameleon body */}
      <ellipse cx="44" cy="48" rx="24" ry="17" fill="#00AA13" />
      <ellipse cx="42" cy="50" rx="18" ry="11" fill="#00DF82" opacity="0.65" />

      {/* Curled Chameleon Tail */}
      <path d="M22 50 Q12 55 14 65 Q18 72 24 67 Q19 61 24 57 Q30 53 25 50Z" fill="#007A0E" />

      {/* Back ridge dots */}
      <circle cx="34" cy="34" r="3.5" fill="#007A0E" />
      <circle cx="44" cy="32" r="3.5" fill="#007A0E" />
      <circle cx="54" cy="34" r="3.5" fill="#007A0E" />

      {/* Chameleon Head */}
      <ellipse cx="60" cy="44" rx="14" ry="12" fill="#00AA13" />

      {/* Iconic Big Concentric Chameleon Eye */}
      <circle cx="58" cy="38" r="8.5" fill="#16261E" />
      <circle cx="58" cy="38" r="6" fill="#FFFFFF" />
      <circle cx="59" cy="37" r="3.5" fill="#00AA13" />
      <circle cx="60" cy="36" r="1.8" fill="#16261E" />
      <circle cx="61" cy="35" r="0.8" fill="#FFFFFF" />

      {/* Snout */}
      <ellipse cx="73" cy="46" rx="5" ry="3.5" fill="#007A0E" />

      {/* Head Crest */}
      <path d="M52 32 Q56 24 60 30" stroke="#007A0E" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Front Foot */}
      <path d="M50 63 Q52 69 57 71" stroke="#007A0E" strokeWidth="3" strokeLinecap="round" />

      {/* Golden Money Bag / Coin held */}
      <circle cx="67" cy="56" r="8" fill="#FFB800" stroke="#D49000" strokeWidth="1.5" />
      <text x="67" y="60" textAnchor="middle" fill="#5C3B00" fontSize="9" fontWeight="bold" fontFamily="sans-serif">$</text>
    </svg>
  );
}

/**
 * Authentic Gojek Bird Mascot Badge
 * Features flapping mint wing, GoPay chest emblem, crest, and yellow beak.
 */
export function BirdBadge({ size = 48, className, style }: MascotBadgeProps): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0, display: 'inline-block', ...style }}
      aria-label="Bird Mascot Badge"
    >
      {/* Outer circular badge */}
      <circle cx="45" cy="45" r="41" fill="#E6F9F0" stroke="#00AA13" strokeWidth="2.5" />

      {/* Bird body */}
      <ellipse cx="46" cy="50" rx="20" ry="16" fill="#00AA13" />

      {/* Tail feathers */}
      <path d="M26 48 L17 44 L20 52 L16 56 L26 53 Z" fill="#007A0E" />

      {/* Flapping Mint Wing */}
      <ellipse cx="32" cy="46" rx="14" ry="7.5" fill="#00DF82" transform="rotate(-15 32 46)" />

      {/* Bird Head */}
      <circle cx="52" cy="36" r="13" fill="#00AA13" />

      {/* Eye */}
      <circle cx="56" cy="34" r="5" fill="#FFFFFF" />
      <circle cx="57" cy="34" r="2.8" fill="#16261E" />
      <circle cx="58" cy="33" r="1" fill="#FFFFFF" />

      {/* Yellow Beak */}
      <polygon points="62,37 72,35 62,42" fill="#FFB800" stroke="#D49000" strokeWidth="1" />

      {/* Head Crest */}
      <path d="M48 24 Q51 16 54 22" stroke="#007A0E" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* GoPay Logo Badge on chest */}
      <rect x="42" y="47" width="18" height="10" rx="3" fill="#007A0E" />
      <text x="51" y="55" textAnchor="middle" fill="#00DF82" fontSize="7" fontWeight="bold" fontFamily="sans-serif">GP</text>
    </svg>
  );
}

/**
 * Authentic Student Avatar Badge (Nara UI)
 * Features green shirt, skin tone, hair, blushing smile, and SakuJalan cap with gold SJ badge.
 */
export function StudentBadge({ size = 48, className, style }: MascotBadgeProps): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0, display: 'inline-block', ...style }}
      aria-label="Student Avatar Badge"
    >
      {/* Outer circular badge */}
      <circle cx="45" cy="45" r="41" fill="#F0F8F3" stroke="#00AA13" strokeWidth="2.5" />

      {/* Body / Green Shirt */}
      <ellipse cx="45" cy="78" rx="26" ry="16" fill="#00AA13" />
      <polygon points="40,62 45,69 50,62" fill="#007A0E" />

      {/* Neck */}
      <rect x="39" y="54" width="12" height="10" rx="3" fill="#FDBCB4" />

      {/* Head */}
      <circle cx="45" cy="42" r="18" fill="#FDBCB4" />

      {/* Hair */}
      <ellipse cx="45" cy="28" rx="19" ry="10" fill="#2C1A0E" />
      <rect x="27" y="28" width="5" height="11" rx="2" fill="#2C1A0E" />
      <rect x="58" y="28" width="5" height="11" rx="2" fill="#2C1A0E" />

      {/* Eyes with friendly shine */}
      <circle cx="39" cy="41" r="2.6" fill="#16261E" />
      <circle cx="51" cy="41" r="2.6" fill="#16261E" />
      <circle cx="40" cy="40" r="0.8" fill="#FFFFFF" />
      <circle cx="52" cy="40" r="0.8" fill="#FFFFFF" />

      {/* Blush Cheeks */}
      <ellipse cx="34" cy="46" rx="4" ry="2.5" fill="rgba(255,140,90,0.4)" />
      <ellipse cx="56" cy="46" rx="4" ry="2.5" fill="rgba(255,140,90,0.4)" />

      {/* Smile */}
      <path d="M41 48 Q45 53 49 48" stroke="#C47A5C" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* SakuJalan Green Cap */}
      <ellipse cx="45" cy="26" rx="21" ry="5" fill="#00AA13" />
      <rect x="31" y="17" width="28" height="10" rx="3" fill="#00AA13" />
      <rect x="40" y="19" width="10" height="6" rx="1.5" fill="#FFB800" />
      <text x="45" y="24" textAnchor="middle" fill="#16261E" fontSize="5" fontWeight="bold" fontFamily="sans-serif">SJ</text>
    </svg>
  );
}

/* ==========================================================================
   BRANDED VECTOR MICRO-EMBLEMS (CHIPS, BUTTONS, LEVERS & TIPS)
   ========================================================================== */

/**
 * Canteen / Food Quick-Log Micro Emblem
 */
export function FoodChipIcon({ size = 15, className, style }: MicroIconProps = {}): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <path d="M3 8 C3 14 17 14 17 8 Z" fill="#00AA13" />
      <path d="M2 8 L18 8" stroke="#007A0E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 4 Q10 2 13 4" stroke="#00DF82" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Transit / Commute Quick-Log Micro Emblem
 */
export function TransitChipIcon({ size = 15, className, style }: MicroIconProps = {}): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <rect x="4" y="3" width="12" height="13" rx="3" fill="#00AA13" />
      <rect x="6" y="5" width="8" height="5" rx="1" fill="#E6F9F0" />
      <circle cx="7.5" cy="13" r="1.2" fill="#FFFFFF" />
      <circle cx="12.5" cy="13" r="1.2" fill="#FFFFFF" />
      <path d="M5 16 L3 19 M15 16 L17 19" stroke="#007A0E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Coffee / Drink Quick-Log Micro Emblem
 */
export function CoffeeChipIcon({ size = 15, className, style }: MicroIconProps = {}): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <path d="M4 6 L14 6 L13 14 C13 16 7 16 7 14 Z" fill="#00AA13" />
      <path d="M14 7 Q17 7 17 9.5 Q17 12 13.5 12" stroke="#007A0E" strokeWidth="1.4" fill="none" />
      <path d="M7 3 Q8.5 1.5 10 3" stroke="#00DF82" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Tip / Radar Recommendation Micro Emblem
 */
export function TipIcon({ size = 14, className, style }: MicroIconProps = {}): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <path d="M10 2 C6 2 4 5 4 8 C4 11 7 13 8 15 L12 15 C13 13 16 11 16 8 C16 5 14 2 10 2 Z" fill="#E8F8EE" stroke="#00AA13" strokeWidth="1.6" />
      <rect x="8" y="16" width="4" height="2" rx="0.5" fill="#00AA13" />
      <line x1="10" y1="5" x2="10" y2="9" stroke="#00DF82" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Savings / Spend Smarter Micro Emblem (Lever 1)
 */
export function SavingsIcon({ size = 16, className, style }: MicroIconProps = {}): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="8" fill="#FFB800" stroke="#D49000" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="5.5" stroke="#FFE082" strokeWidth="1" />
      <text x="10" y="13" textAnchor="middle" fill="#5C3B00" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Rp</text>
    </svg>
  );
}

/**
 * Protection / Deferral Vault Micro Emblem (Lever 2)
 */
export function ProtectionIcon({ size = 16, className, style }: MicroIconProps = {}): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <path d="M10 2 L4 5 V10 C4 14.5 6.5 17.5 10 18.5 C13.5 17.5 16 14.5 16 10 V5 L10 2 Z" fill="#E8F8EE" stroke="#00AA13" strokeWidth="1.5" />
      <path d="M7 10 L9 12 L13 8" stroke="#00AA13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Growth / Campus Gig Micro Emblem (Lever 3)
 */
export function GrowthIcon({ size = 16, className, style }: MicroIconProps = {}): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="8" fill="#E8F8EE" stroke="#00AA13" strokeWidth="1.5" />
      <path d="M5 14 L8.5 10.5 L11 13 L15 7" stroke="#00AA13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7 H15 V10" stroke="#00AA13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
