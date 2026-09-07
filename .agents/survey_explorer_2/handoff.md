# Handoff Report: R2 Layout Scaling & Responsive Auto-Fit Exploration

**Explorer**: `survey_explorer_2` (Layout Scaling Explorer)  
**Date**: 2026-09-07  
**Project Root**: `C:\Users\haekalhdn\Documents\Codex\2026-09-07\d-repository-competition-gojek-bisniscomp-hey\campus-runway`  
**Target Requirement**: R2: Responsive Auto-Fit & Fluid Scaling (All Laptops & Desktops up to 1440px)

---

## 1. Observation

### 1.1 App Shell & Container Width Constraints
- **File**: `app/globals.css` (lines 75–82)
  ```css
  .shell {
    width: 100%;
    max-width: 1440px;
    margin: auto;
    padding: 0 clamp(16px, 3.5vw, 56px) 80px;
    position: relative;
    box-sizing: border-box;
  }
  ```
- **File**: `app/globals.css` (lines 616–624)
  ```css
  @media (max-width: 700px) {
    .shell {
    width: 100%;
    max-width: 1440px;
    margin: auto;
    padding: 0 clamp(16px, 3.5vw, 56px) 80px;
    position: relative;
    box-sizing: border-box;
  }
  ```
- **File**: `app/globals.css` (lines 1108–1141)
  ```css
  /* Fluid Grid System for Wide Laptops & High-DPI screens */
  @media (min-width: 1200px) {
    .shell {
      padding-left: clamp(24px, 4vw, 64px);
      padding-right: clamp(24px, 4vw, 64px);
    }
    .hero-card, .cash-card {
      padding: 36px;
    }
    .what-if-box {
      padding: 32px 36px;
    }
  }

  /* Medium Laptops & Tablets (900px - 1199px) */
  @media (max-width: 1199px) and (min-width: 768px) {
    .shell {
      max-width: 100%;
      padding: 0 24px 60px;
    }
    .levers-grid, .radar-cards-grid, .ecosystem-grid {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    .main-tabs {
      flex-wrap: wrap;
      gap: 6px;
    }
  }

  /* Mobile & Small Screens (<= 767px) */
  @media (max-width: 767px) {
    .shell {
      padding: 0 16px 40px;
    }
  ```
- **Conflict Observed**: `globals.css` has overlapping media queries with conflicting rules. Line 616 uses `@media (max-width: 700px)`, while line 1138 uses `@media (max-width: 767px)`. Furthermore, line 610 uses `@media (max-width: 1000px)`.

### 1.2 Fixed Widths and Overflow-X Hazards
- **Observation A (Mobile Header Overflow)**:
  - **File**: `app/globals.css` (lines 148–152, 1149–1152)
  - In `runway-app.tsx` (lines 470–501), `.targo-app-right` contains:
    - ChameleonBadge (38px) + Telemetry Badge (~160px)
    - "⚙ EDIT BUDGET" button (~115px)
    - Reload icon button (~40px)
    - "← HOME" button (~80px)
  - In `globals.css` line 148:
    ```css
    .top-right, .targo-app-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    ```
  - In `@media (max-width: 767px)` line 1149:
    ```css
    .targo-app-right {
      justify-content: space-between;
      width: 100%;
    }
    ```
  - `flex-wrap: wrap;` is completely missing. Total minimum un-wrapped width is ~450px–472px. On mobile devices <= 450px (e.g. 360px Galaxy, 375px iPhone, 390px iPhone 14), this creates an immediate 50px–110px horizontal overflow outside the screen.
- **Observation B (Body & Shell Missing Overflow-X Prevention)**:
  - **File**: `app/globals.css` (lines 51–59)
    ```css
    body {
      background-color: var(--targo-bg);
      color: var(--targo-body-gray);
      font-family: 'Quantico', 'Arial Narrow', sans-serif;
      font-size: 16px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
    }
    ```
  - While `app/targo-landing.tsx` (line 82) sets `overflow-x: hidden;` on `.targo-root`, `body` and `.shell` in `app/globals.css` do NOT specify `overflow-x: clip;` or `overflow-x: hidden;`. Any child expansion immediately generates a horizontal scrollbar on the cockpit page.
- **Observation C (Inline Grid and Hardcoded Font Size in Tab 1)**:
  - **File**: `app/runway-app.tsx` (lines 662, 671)
    ```tsx
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
    ...
    <div className="big-money" style={{ fontSize: '48px', margin: '12px 0' }}>{rp(f.safe)}</div>
    ```
    - The top 3 cards use an inline `gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'` rather than a CSS class. On 320px screens, `300px + 32px (padding) = 332px > 320px`, causing horizontal overflow.
    - Card 1 overrides the fluid `clamp(2.5rem, 5.2vw, 4.6rem)` font size defined in `globals.css` line 269 with a fixed `fontSize: '48px'`. For amounts like `Rp 1,250,000` or `Rp 850,000`, 48px uppercase bold text measures over 300px wide, overflowing the 28px-padded card on mobile.
- **Observation D (Fixed 3 Columns in Plan Grid)**:
  - **File**: `app/globals.css` (lines 503–507)
    ```css
    .plan-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
    }
    ```
    - This is hardcoded to 3 columns. When only 1 bill exists (e.g. initial state with 1 Kos Rent item), 66% of the container width is empty white space.
    - Between 1001px and 1199px, 3 fixed columns force each card into ~280px width, but the 3 action buttons (`Mark Paid`, `Postpone`, `Cheaper Alt`) wrap awkwardly because `.plan-actions` has no CSS definition.
- **Observation E (Landing Page Tablet Gap in targo-landing.tsx)**:
  - **File**: `app/targo-landing.tsx` (lines 135–140, 171–176, 186–192, 322)
    - `.targo-hero`: `display: grid; grid-template-columns: 55% 45%;`
    - `.targo-staircase-indent`: `margin-left: min(238px, 28vw); white-space: nowrap;`
    - `.targo-about`: `display: grid; grid-template-columns: 58% 42%;`
    - The ONLY media query in `targo-landing.tsx` is `@media (max-width: 700px)`.
    - Between 701px and 1199px, there are no responsive adjustments. At 768px (iPad), the 55% column is 422px wide; the headline with 215px left indent and `white-space: nowrap` collides with the right column. The chameleon mascot and floating chips with negative offsets (`right: -40px`, `right: -32px`) are clipped off at screen edges.

### 1.3 Missing Styles in globals.css
- `globals.css` lacks definitions for:
  - `.plan-actions`: buttons inside commitment cards
  - `.form-grid`: modal form wrapper
  - `.field`: form field label wrapper
  - `.choice`: checkbox wrapper
  - `.dialog-box`: modal dialog content

---

## 2. Logic Chain

1. **Premise 1 (R2 Requirement)**: The app shell must auto-fit seamlessly across 13-inch and 15-inch laptops (1366x768, 1440x900, 1536x864), desktops (1920x1080), tablets (768px–1199px), and mobile (<= 767px), with base font 16px, `max-width: 1440px`, fluid clamp margins/padding, and ZERO horizontal scrollbars.
2. **Step 2 (Deduction from Observation 1.1)**: `.shell` already has `max-width: 1440px` and `margin: auto`, but its media queries conflict:
   - Line 616 (`max-width: 700px`) duplicate definition overrides line 75 with obsolete rules.
   - Line 610 (`max-width: 1000px`) cuts grids prematurely.
   - Line 1122 (`768px - 1199px`) and line 1138 (`<= 767px`) are the newer intended system.
   - Consolidating these to a single, unified breakpoint cascade will ensure predictable, fluid scaling.
3. **Step 3 (Deduction from Observation 1.2 A & B)**: Horizontal scrollbars on mobile are directly caused by:
   - Missing `flex-wrap: wrap` on `.targo-app-right` (472px minimum content forced into <= 360px viewport).
   - Missing `overflow-x: clip;` or `overflow-x: hidden;` on `body` and `.shell`.
   - Adding `flex-wrap: wrap` to `.targo-app-right` and `overflow-x: clip` on `body` and `.shell` will eliminate mobile horizontal scrollbars.
4. **Step 4 (Deduction from Observation 1.2 C)**:
   - The inline style on the Top 3 Cards (`repeat(auto-fit, minmax(300px, 1fr))`) and hardcoded `fontSize: 48px` prevents the cards from reflowing safely on narrow viewports.
   - Extracting this into `.summary-cards-grid` with `grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr))` and using CSS fluid typography `clamp(2rem, 4vw, 3rem)` for `.big-money` allows the numbers to scale proportionally without card overflow.
5. **Step 5 (Deduction from Observation 1.2 D)**:
   - Refactoring `.plan-grid` from `repeat(3, minmax(0, 1fr))` to `repeat(auto-fit, minmax(min(100%, 280px), 1fr))` ensures that 1, 2, or 3+ plan cards always distribute evenly across any laptop/desktop display without empty voids.
   - Adding `.plan-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }` prevents button clipping.
6. **Step 6 (Deduction from Observation 1.2 E)**:
   - Introducing `@media (max-width: 1024px)` to `targo-landing.tsx` that stacks `.targo-hero` and `.targo-about` into single columns, adjusts `.targo-staircase-indent`, and scales character scene mascots eliminates clipping and collisions on medium laptops and tablets.

---

## 3. Caveats

- **No Caveats on Codebase Access**: All 15 files were inspected, linted, and built successfully.
- **Assumptions Made**:
  - The 3D Three.js canvas in `three-runway-hero.tsx` automatically resizes via its `handleResize` listener (`camera.aspect = container.clientWidth / container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(...)`). When the hero container stacks on smaller viewports, hiding the canvas on screens < 768px or constraining its height prevents heavy GPU load on mobile devices.
  - Browser support: Modern Baseline browsers supporting CSS `clamp()`, `minmax()`, `min(100%, 280px)`, and flexbox wrapping.

---

## 4. Conclusion & Proposed Implementation Blueprint

### 4.1 Summary of Files Requiring Adjustment

| Target File | Scope of Change | Rationale |
|---|---|---|
| `app/globals.css` | 1. Consolidate media queries into clean tiers (`>= 1200px`, `768px–1199px`, `<= 767px`, `<= 480px`).<br>2. Add `overflow-x: clip` to `body` and `.shell`.<br>3. Add `.summary-cards-grid` class.<br>4. Update `.plan-grid` to `auto-fit`.<br>5. Add `.plan-actions`, `.form-grid`, `.field`, `.choice` styles.<br>6. Ensure `.targo-app-right` and `.profile-info` wrap cleanly. | Fixes all horizontal scrollbar hazards, removes breakpoint clashes, enables fluid auto-fit grids. |
| `app/runway-app.tsx` | 1. Replace inline grid on Top 3 Cards with `.summary-cards-grid`.<br>2. Remove inline `style={{ fontSize: '48px' }}` from `.big-money`.<br>3. Responsive slider legend for What-If.<br>4. Dialog sizing improvements (`sm:max-w-lg`). | Enables fluid typography and prevents mobile overflow. |
| `app/targo-landing.tsx` | 1. Add tablet/medium laptop breakpoint (`@media (max-width: 1024px)`).<br>2. Stack hero and about sections gracefully.<br>3. Constrain header inner layout to `max-width: 1440px`. | Eliminates text clipping and mascot overflow on 768px–1199px screens. |
| `app/layout.tsx` | Export explicit viewport configuration (`export const viewport: Viewport = { width: 'device-width', initialScale: 1 };`). | Best practice for mobile viewport scaling in Next.js/Vinext. |

### 4.2 Exact Proposed Changes

#### A. In `app/globals.css`:
1. **Body & Shell**:
   ```css
   body {
     background-color: var(--targo-bg);
     color: var(--targo-body-gray);
     font-family: 'Quantico', 'Arial Narrow', sans-serif;
     font-size: 16px;
     line-height: 1.6;
     -webkit-font-smoothing: antialiased;
     min-height: 100vh;
     overflow-x: hidden;
     width: 100%;
   }

   .shell {
     width: 100%;
     max-width: 1440px;
     margin-left: auto;
     margin-right: auto;
     padding: 0 clamp(16px, 3.5vw, 56px) 80px;
     position: relative;
     box-sizing: border-box;
     overflow-x: clip;
   }
   ```
2. **Grids**:
   ```css
   .summary-cards-grid {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
     gap: clamp(14px, 2vw, 20px);
     margin-bottom: 24px;
   }

   .plan-grid {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
     gap: clamp(14px, 2vw, 20px);
   }

   .plan-actions {
     display: flex;
     gap: 8px;
     flex-wrap: wrap;
     margin-top: 14px;
   }

   .levers-grid, .radar-cards-grid, .ecosystem-grid {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
     gap: clamp(14px, 2vw, 20px);
   }
   ```
3. **Form & Dialog Helper Styles**:
   ```css
   .form-grid {
     display: flex;
     flex-direction: column;
     gap: 16px;
     margin-top: 12px;
   }
   .field {
     display: flex;
     flex-direction: column;
     gap: 6px;
   }
   .field span {
     font-size: 13px;
     font-weight: 700;
     color: var(--targo-heading);
   }
   .field small {
     font-size: 11px;
     color: var(--targo-body-gray);
   }
   .choice {
     display: flex;
     align-items: center;
     gap: 10px;
     font-size: 13px;
     cursor: pointer;
   }
   ```
4. **Clean Consolidated Media Queries**:
   ```css
   /* Desktop & Wide Laptops (>= 1200px) */
   @media (min-width: 1200px) {
     .shell {
       padding-left: clamp(24px, 4vw, 64px);
       padding-right: clamp(24px, 4vw, 64px);
     }
     .hero-card, .cash-card { padding: 36px; }
     .what-if-box { padding: 32px 36px; }
   }

   /* Tablet & Medium Laptops (768px - 1199px) */
   @media (max-width: 1199px) and (min-width: 768px) {
     .shell {
       max-width: 100%;
       padding: 0 clamp(18px, 3vw, 32px) 60px;
     }
     .summary-grid, .section-grid {
       grid-template-columns: 1fr;
     }
     .main-tabs {
       flex-wrap: wrap;
       gap: 6px;
     }
   }

   /* Mobile Devices (<= 767px) */
   @media (max-width: 767px) {
     .shell {
       padding: 0 16px 40px;
     }
     .targo-app-header {
       height: auto;
       padding: 12px 0;
       flex-direction: column;
       align-items: stretch;
       gap: 12px;
     }
     .targo-app-right {
       display: flex;
       flex-wrap: wrap;
       justify-content: flex-start;
       gap: 8px;
       width: 100%;
     }
     .profile-bar {
       flex-direction: column;
       align-items: flex-start;
       gap: 12px;
       padding: 12px 14px;
     }
     .profile-info {
       flex-direction: column;
       align-items: flex-start;
       gap: 4px;
     }
     .stats {
       grid-template-columns: 1fr;
     }
     .stats > div {
       border-right: 0;
       border-bottom: 1px solid #DCE2E5;
       padding: 14px 0;
     }
     .stats > div:last-child {
       border-bottom: 0;
     }
     .welcome {
       grid-template-columns: 1fr;
     }
     .what-if-metrics {
       grid-template-columns: 1fr !important;
       gap: 12px;
     }
     .main-tabs {
       overflow-x: auto;
       white-space: nowrap;
       display: flex;
       justify-content: flex-start;
       padding-bottom: 6px;
       -webkit-overflow-scrolling: touch;
       scrollbar-width: none;
     }
     .main-tabs > * {
       flex-shrink: 0;
     }
     .hero-card, .cash-card, .radar-card, .lever-card, .ecosystem-card {
       padding: 20px !important;
     }
   }

   /* Small Mobile (<= 480px) */
   @media (max-width: 480px) {
     .shell {
       padding: 0 12px 32px;
     }
     .targo-app-right {
       gap: 6px;
     }
     .targo-telemetry-badge {
       font-size: 10px;
       padding: 4px 8px;
     }
   }
   ```

#### B. In `app/runway-app.tsx`:
1. Line 662: Replace inline style with `className="summary-cards-grid"`:
   ```tsx
   <div className="summary-cards-grid">
   ```
2. Line 671: Remove fixed inline font size:
   ```tsx
   <div className="big-money">{rp(f.safe)}</div>
   ```
3. Line 776: Make slider legend responsive:
   ```tsx
   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#88998F', marginTop: '6px', flexWrap: 'wrap', gap: '4px' }}>
     <span>Rp 0</span>
     <span>Rp 30k</span>
     <span>Rp 70k</span>
     <span>Rp 150k</span>
   </div>
   ```

#### C. In `app/targo-landing.tsx`:
Add `@media (max-width: 1024px)` to the style block:
```css
@media (max-width: 1024px) {
  .targo-hero {
    grid-template-columns: 1fr;
    padding-top: 100px;
    padding-bottom: 40px;
  }
  .targo-hero-col-right {
    min-height: 280px;
  }
  .targo-staircase-indent {
    margin-left: clamp(0px, 10vw, 120px);
  }
  .targo-about {
    grid-template-columns: 1fr;
    padding: 60px 24px 40px;
    gap: 40px;
  }
  .targo-about-indent {
    margin-left: 0;
  }
}
```

---

## 5. Verification Method

To independently verify these findings and confirm resolution after implementation:

1. **Lint Verification**:
   ```pwsh
   npm run lint
   ```
   *Expected outcome*: 0 warnings and 0 errors across all files.

2. **Build Verification**:
   ```pwsh
   npm run build
   ```
   *Expected outcome*: Successful compilation with code 0 (`vinext build`).

3. **Viewport Inspection (Visual & DOM Checks)**:
   Start dev server:
   ```pwsh
   npm run dev
   ```
   Verify at the following resolutions:
   - **1920x1080 (Desktop)**: App shell centered at 1440px max-width with equal margins, 3 cards per row in summary, levers, and radar.
   - **1440x900 & 1366x768 (Laptops)**: Full comfortable fill, generous padding, zero horizontal scrollbar (`document.documentElement.scrollWidth === window.innerWidth`).
   - **1024x768 & 800x600 (Tablets)**: Grid cards auto-reflow into 2 columns or 1 column gracefully; tabs wrap cleanly.
   - **375x667 & 360x800 (Mobile Phones)**: Header controls wrap without clipping, `document.documentElement.scrollWidth <= window.innerWidth` (no horizontal scroll), cards stack to 1 column with comfortable 20px padding.

4. **Invalidation Conditions**:
   - Any viewport width exhibiting `document.documentElement.scrollWidth > window.innerWidth` invalidates horizontal scrollbar compliance.
   - Any hardcoded pixel widths (`width: >320px` without max-width) on cards or headers invalidates fluid scaling.
