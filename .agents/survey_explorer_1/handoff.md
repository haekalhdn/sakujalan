# Handoff Report: R1 Professional Youth-Friendly Mascot & Asset System Survey

**Agent**: `survey_explorer_1` (Mascot Assets Explorer)  
**Date**: 2026-09-07  
**Working Directory**: `campus-runway/.agents/survey_explorer_1`  
**Target Milestone**: R1 Mascot & Asset System Investigation  
**Type**: Hard Handoff (Task Complete)

---

## 1. Observation

### 1.1 Existing Mascot References & Image Artwork
- **`public/` Directory**:
  - Contains only `public/favicon.svg` (712 bytes), a single green circle with white inner dot.
  - Zero PNG, JPG, or SVG mascot files exist in `public/` or `assets/`.
- **`components/` Directory**:
  - Only contains `components/ui/` (shadcn primitive components like button, dialog, tabs, card).
  - No custom mascot components or badge files exist yet in `components/`.
- **`app/runway-app.tsx` (Lines 75–203)**:
  - Three circular SVG badge components are defined inline:
    1. `ChameleonBadge({ size = 48 })` (lines 80–122):
       - Circular badge container: `circle cx="45" cy="45" r="41" fill="#E8F8EE" stroke="#00DF82" strokeWidth="2.5"`
       - Body & belly: `ellipse cx="44" cy="48" rx="24" ry="17" fill="#00AA13"`, overlay `fill="#00DF82" opacity="0.65"`
       - Curled tail: `path d="M22 50 Q12 55 14 65 Q18 72 24 67 Q19 61 24 57 Q30 53 25 50Z" fill="#007A0E"`
       - Spine ridge dots: three green dots (`#007A0E`) at `cx=34, 44, 54`
       - Concentric chameleon eye: outer socket (`#16261E`), white iris, green ring (`#00AA13`), dark pupil (`#16261E`), specular white highlight
       - Snout & head crest: `#007A0E`
       - Gold coin / money bag: `circle cx="67" cy="56" r="8" fill="#FFB800" stroke="#D49000" strokeWidth="1.5"` with bold dark brown `$` symbol (`fill="#5C3B00"`)
    2. `BirdBadge({ size = 48 })` (lines 125–159):
       - Circular badge container: `circle cx="45" cy="45" r="41" fill="#E6F9F0" stroke="#00AA13" strokeWidth="2.5"`
       - Body: `ellipse cx="46" cy="50" rx="20" ry="16" fill="#00AA13"`
       - Tail feathers: triple-feather wedge `fill="#007A0E"`
       - Flapping wing: tilted ellipse (`rx="14" ry="7.5" fill="#00DF82" transform="rotate(-15 32 46)"`)
       - Head & crest: `#00AA13` head with `#007A0E` crest curve
       - Eye: white sclera, dark pupil (`#16261E`), white catchlight
       - Yellow beak: `polygon points="62,37 72,35 62,42" fill="#FFB800"`
       - GoPay vest badge: `rect x="42" y="47" width="18" height="10" rx="3" fill="#007A0E"` with `"GP"` in `#00DF82`
    3. `StudentBadge({ size = 48 })` (lines 162–203):
       - Circular badge container: `circle cx="45" cy="45" r="41" fill="#F0F8F3" stroke="#00AA13" strokeWidth="2.5"`
       - Nara student representation: green shirt (`#00AA13`), collar (`#007A0E`), skin (`#FDBCB4`), hair (`#2C1A0E`)
       - Cheeks & smile: peach blush (`rgba(255,140,90,0.4)`), smile (`#C47A5C`)
       - SakuJalan cap: green cap (`#00AA13`) with gold badge (`#FFB800`) bearing `"SJ"` initials
- **`app/targo-landing.tsx` (Lines 367–393 and 510–625)**:
  - Lines 367–393: Floating bird mascot (`.targo-bird`) in hero section with GoPay ("GP") chest emblem and flapping mint wings.
  - Lines 510–583: Full-body student character (Nara) with Gojek green shirt, "GP" badge, phone showing Rp 28k, gold coin, and "SJ" cap.
  - Lines 589–625: Full chameleon mascot (`.targo-chameleon`) standing alongside Nara with curled tail, prominent concentric eye, and holding a gold money bag ($).
- **`work/casebook_pages/` (Official Gojek Champointship Case Book - 10 Pages)**:
  - `page-01.png` to `page-10.png` display official Gojek Champointship materials supported by AIESEC UI.
  - Case problem: 70% of university students face recurring allowance deficits.
  - Mascot aesthetics in casebook: A playful white cat mascot wearing a graduation cap, Gojek badge, gold medal/coins, and a squeaky hammer.
  - Official color palette: Primary Gojek Green (`#00AA13`), Bright Mint (`#00DF82`), Forest (`#007A0E`), Dark Slate (`#16261E`), Gold Coin (`#FFB800`).
- **`AGENTS.md`**:
  - Section 1 states: "Do NOT use generic system emojis as primary feature icons, navigation emblems, or card hero headers. They look generic and AI-generated. Use customized SVG vector illustrations / badges that share consistent brand tokens."

---

### 1.2 Inventory of Emojis and Placeholder Icons Across Codebase
Scanned all `.tsx`, `.ts`, `.css`, and `.html` files in the repository. Exact occurrences:

| File | Line | Verbatim Line Content | Character(s) | Category / Purpose | Recommended Replacement |
|---|---|---|---|---|---|
| `app/runway-app.tsx` | 484 | `⚙ EDIT BUDGET` | `⚙` (U+2699) | Action button icon | Lucide `<Sliders size={14} />` or `<Settings size={14} />` |
| `app/runway-app.tsx` | 623 | `🍲 Lunch (Rp 15k)` | `🍲` (U+1F372) | Quick-Log Chip | Branded vector `<FoodChipIcon />` or Lucide `<Utensils size={14} />` |
| `app/runway-app.tsx` | 630 | `🚆 Transit (Rp 8k)` | `🚆` (U+1F686) | Quick-Log Chip | Branded vector `<TransitChipIcon />` or mini `BirdBadge` / `<Bus size={14} />` |
| `app/runway-app.tsx` | 637 | `☕ Coffee (Rp 10k)` | `☕` (U+2615) | Quick-Log Chip | Branded vector `<CoffeeChipIcon />` or Lucide `<Coffee size={14} />` |
| `app/runway-app.tsx` | 863 | `💰 Saves ~Rp 20,000 per meal order.` | `💰` (U+1F4B0) | Lever 1 Impact Callout | Mini `ChameleonBadge` / `<SavingsIcon />` or Lucide `<Sparkles size={14} />` |
| `app/runway-app.tsx` | 883 | `🛡️ Instantly frees ~Rp 55,000 back into daily cash.` | `🛡️` (U+1F6E1) | Lever 2 Impact Callout | Branded `<ProtectionIcon />` or Lucide `<ShieldCheck size={14} />` |
| `app/runway-app.tsx` | 903 | `📈 Injects +Rp 45,000 to +Rp 200,000 upon completion.` | `📈` (U+1F4C8) | Lever 3 Impact Callout | Branded `<GrowthIcon />` or Lucide `<Award size={14} />` |
| `app/runway-app.tsx` | 968 | `<div className="lever-impact">💡 Tip: Bikun + GoTransit saves you Rp 15,000 every single trip.</div>` | `💡` (U+1F4A1) | Radar Commute Tip | Lucide `<Sparkles size={14} />` in `#00AA13` or `<TipIcon />` |
| `app/runway-app.tsx` | 986 | `<div className="lever-impact">💡 Tip: Eating at campus canteens cuts food cost in half.</div>` | `💡` (U+1F4A1) | Radar Meal Tip | Lucide `<Sparkles size={14} />` in `#00AA13` or `<TipIcon />` |
| `app/runway-app.tsx` | 1004 | `<div className="lever-impact">💡 Tip: Studying at UI library saves Rp 45,000 minimum cafe spend.</div>` | `💡` (U+1F4A1) | Radar Study Tip | Lucide `<Sparkles size={14} />` in `#00AA13` or `<TipIcon />` |
| `app/targo-landing.tsx` | 33 | `const emojis = ['💰','💵','🪙','📈','💳','🏦','💎','✨','🎓','📚'];` | 10 financial emojis | Floating Background Particles | Light SVG coin/star particles or geometric tokens |
| `app/targo-landing.tsx` | 457 | `▶ LAUNCH NAVIGATOR` | `▶` (U+25B6) | Hero CTA Button | Lucide `<ArrowRight size={16} />` |

---

### 1.3 Current Badge Call Sites in `app/runway-app.tsx`
- **Line 472**: `<ChameleonBadge size={38} />` — Header Cockpit Telemetry badge (paired with "UI STUDENT COCKPIT").
- **Line 507**: `<StudentBadge size={44} />` — Profile Switcher Bar (paired with "STUDENT PROFILE: NARA (UI)").
- **Line 603**: `<BirdBadge size={46} />` — Daily Student Flow banner ("1. Check Safe Limit → 2. Tap 1-Click Log → 3. Use Lever if Tight").
- **Line 746**: `<ChameleonBadge size={44} />` — What-If Spend Tester header.
- **Line 841**: `<ChameleonBadge size={44} />` — Tab 2: 3 Action Levers header.
- **Line 916**: `<BirdBadge size={44} />` — Tab 3: UI Campus Alternatives Radar header.
- **Line 1015**: Tab 4: Fixed Bills & Commitments header — **MISSING BADGE!** Only plain text `<h2>`. Should feature `<ChameleonBadge size={44} />` (protecting rent/commitments with prudence).
- **Line 1050**: `<ChameleonBadge size={44} />` — Tab 5: GoPay Sync & Activity History header.
- **Line 1207**: `<ChameleonBadge size={28} />` — Footer badge beside Universitas Indonesia Pilot text.

---

### 1.4 Verification of Official Gojek Design Tokens & Tailwind Setup
- **Design Tokens Specified**:
  - Primary Gojek Green: `#00AA13`
  - Mint Glow: `#00DF82`
  - Forest Outline: `#007A0E`
  - Dark Slate Text: `#16261E`
  - Additional Gold Accent: `#FFB800` (stroke: `#D49000`, text: `#5C3B00`)
- **Tailwind Version & Config**:
  - Uses Tailwind CSS v4 (`tailwindcss: 4.2.1` with `@tailwindcss/postcss: 4.2.1`).
  - No `tailwind.config.js` exists; configuration is defined via `@theme` in `app/globals.css`.
  - In `app/globals.css`:
    - `:root` currently declares:
      ```css
      --background: #F3F6F3;
      --foreground: #16261E;
      --targo-bg: #F3F6F3;
      --targo-accent: #00AA13;
      --targo-accent-hover: #00DF82;
      --targo-accent-border: #007A0E;
      --targo-heading: #16261E;
      --targo-nav-link: #2C3E33;
      --targo-body-gray: #54665C;
      ```
    - `@theme inline` currently only maps background, foreground, and font families.
    - Adding Gojek color tokens to `@theme inline` enables first-class Tailwind classes: `bg-gojek-green`, `text-gojek-mint`, `border-gojek-forest`, `text-gojek-dark`, `bg-gojek-gold`.

---

### 1.5 Quality Checks & Baseline Verification
- Command: `npm run lint` (`oxlint app lib db tests`)
  - **Result**: `Found 0 warnings and 0 errors. Finished in 1.8s on 15 files with 208 rules using 16 threads.`
- Command: `npm run build` (`vinext build`)
  - **Result**: Build passed completely with 0 errors. Chunks built in 2.73s.
- Command: `npx tsx tests/runway.test.ts`
  - **Result**: `15 aturan inti lolos.` (Code 0).
- Command: `npx tsc --noEmit`
  - **Result**: 0 TypeScript errors.

---

## 2. Logic Chain

1. **Premise 1 (Requirement R1)**: Acceptance criteria demand that "No generic AI emoji icons are used as main feature emblems; all key sections use the custom circular vector badges" and "Mascot design accurately reflects the reference images (Chameleon with gold coin, Bird with GoPay vest)."
2. **Observation Connection**:
   - The SVG vectors for `ChameleonBadge`, `BirdBadge`, and `StudentBadge` already exist inside `app/runway-app.tsx` and match the exact requirements (curled tail, gold coin, flapping wing, GP vest, Nara cap).
   - However, they are defined inline in a 1,222-line file rather than in a reusable component module.
   - 10 distinct emoji instances still exist in `app/runway-app.tsx` (e.g. `🍲`, `🚆`, `☕`, `⚙`, `💰`, `🛡️`, `📈`, `💡`).
   - Tab 4 (Fixed Bills & Commitments) is missing a mascot badge in its header, breaking visual consistency with Tabs 1, 2, 3, and 5.
   - `app/targo-landing.tsx` still uses an array of 10 generic finance emojis for floating background particles.
3. **Deduction for Architecture**:
   - Creating a clean, standalone component module `components/mascot-badges.tsx` decouples the visual asset system from page logic.
   - Providing lightweight vector chip emblems (`FoodChipIcon`, `TransitChipIcon`, `CoffeeChipIcon`, `TipIcon`) in that module will systematically replace the remaining emojis without introducing bulky code.
   - Registering tokens (`--color-gojek-green: #00AA13`, etc.) in `@theme inline` inside `app/globals.css` guarantees that all Tailwind styling matches official Gojek branding.

---

## 3. Caveats

- **No Caveats**: All relevant files, assets, call sites, and build/lint commands were inspected and verified against the official project requirements and casebook artwork.
- **Asset Format**: Pure SVG vector React components were verified as superior to raster PNGs because they guarantee sharp rendering across all laptop/Retina resolutions with zero HTTP asset load latency.

---

## 4. Conclusion & Action Plan

### 4.1 Files to Create
1. **`campus-runway/components/mascot-badges.tsx`**:
   - Exports:
     - `ChameleonBadge({ size = 48, className, style }: MascotBadgeProps)`
     - `BirdBadge({ size = 48, className, style }: MascotBadgeProps)`
     - `StudentBadge({ size = 48, className, style }: MascotBadgeProps)`
     - Micro-emblems for quick-log chips & tips: `FoodChipIcon`, `TransitChipIcon`, `CoffeeChipIcon`, `TipIcon`, `SavingsIcon`, `ProtectionIcon`, `GrowthIcon`.

### 4.2 Files to Modify
1. **`campus-runway/app/runway-app.tsx`**:
   - Remove inline definitions of `ChameleonBadge`, `BirdBadge`, and `StudentBadge` (lines 80–203).
   - Import badges and micro-emblems from `@/components/mascot-badges`.
   - Line 484: Replace `⚙` with `<Sliders size={14} />` or `<Settings size={14} />`.
   - Lines 623, 630, 637: Replace `🍲 Lunch`, `🚆 Transit`, `☕ Coffee` with `<FoodChipIcon /> Lunch`, `<TransitChipIcon /> Transit`, `<CoffeeChipIcon /> Coffee`.
   - Lines 863, 883, 903: Replace `💰`, `🛡️`, `📈` in Lever descriptions with `<SavingsIcon />`, `<ProtectionIcon />`, `<GrowthIcon />`.
   - Lines 968, 986, 1004: Replace `💡` in Radar tips with `<TipIcon />` (or Lucide `<Sparkles size={14} color="#00AA13" />`).
   - Line 1015: Add `<ChameleonBadge size={44} />` to Tab 4 header to complete badge coverage across all 5 main tabs.
2. **`campus-runway/app/targo-landing.tsx`**:
   - Line 33: Replace emoji array with SVG token glyphs or financial shapes.
   - Line 457: Replace `▶` with Lucide `<ArrowRight size={16} />`.
3. **`campus-runway/app/globals.css`**:
   - Add official Gojek brand tokens to `@theme inline` (`--color-gojek-green: #00AA13;`, `--color-gojek-mint: #00DF82;`, `--color-gojek-forest: #007A0E;`, `--color-gojek-dark: #16261E;`, `--color-gojek-gold: #FFB800;`).

---

## 5. Verification Method

To independently verify the survey findings and subsequent implementation:
1. **Linting Check**:
   ```pwsh
   npm run lint
   ```
   *Expected*: Passes with 0 errors and 0 warnings across all 15 files.
2. **Type Check**:
   ```pwsh
   npx tsc --noEmit
   ```
   *Expected*: Passes with 0 errors.
3. **Core Logic Unit Tests**:
   ```pwsh
   npx tsx tests/runway.test.ts
   ```
   *Expected*: Prints `15 aturan inti lolos.` and exits with code 0.
4. **Production Build**:
   ```pwsh
   npm run build
   ```
   *Expected*: Production bundle completes cleanly without build errors.
5. **Zero Emoji Scan**:
   ```pwsh
   node -e "const fs = require('fs'); const regex = /\p{Extended_Pictographic}/u; ['campus-runway/app/runway-app.tsx'].forEach(f => { fs.readFileSync(f, 'utf8').split('\n').forEach((l, i) => { if (regex.test(l)) console.log(f + ':' + (i+1) + ': ' + l.trim()); }); });"
   ```
   *Expected*: 0 matches in UI button/chip text after R1 implementation.
