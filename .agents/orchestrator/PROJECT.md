# Project: SakuJalan - Campus Budget Navigator

## Architecture
- **Framework**: Next.js 15 / Vinext (Vite + Cloudflare Workers / Miniflare SSR/RSC)
- **Styling**: Tailwind CSS v4 with `@theme inline` design tokens + `app/globals.css` fluid grid system
- **State & Storage**: Cloudflare D1 (SQLite) with Drizzle ORM + optimistic React state via `useTransition`
- **Domain Engine**: `lib/runway.ts` — mathematical forecasting of daily safe-to-spend allowances, debt/buffer allocations, and lever scenarios
- **Component Architecture**:
  - `components/ui/`: Primitive UI widgets (Button, Tabs, Dialog, Card)
  - `components/mascot-badges.tsx`: Branded SVG vector badges (`ChameleonBadge`, `BirdBadge`, `StudentBadge`) and micro-emblems
  - `app/runway-app.tsx`: Financial cockpit with 5 navigation tabs, 3-step banner, and quick-log interactions
  - `app/targo-landing.tsx`: Marketing landing page with hero illustration and simulator preview

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Mascot Vector Badges | Standalone vector badges (`BirdBadge`, `ChameleonBadge`, `StudentBadge`) with curled tail, gold coin, flapping wing, GP vest, Nara cap | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Zero Generic Emojis | Replace all 10 placeholder emoji call sites in chips, buttons, levers, and tips with branded vector micro-emblems | M1 | ORIGINAL_REQUEST §R1, AC |
| 3 | Gojek Design Tokens | Map official tokens (`#00AA13`, `#00DF82`, `#007A0E`, `#16261E`, `#FFB800`) into CSS & Tailwind `@theme inline` | M1 | ORIGINAL_REQUEST §R1 |
| 4 | Responsive Auto-Fit Shell | Max-width 1440px container, fluid clamp margins/padding, zero horizontal overflow (`overflow-x: clip`) across viewports | M2 | ORIGINAL_REQUEST §R2, AC |
| 5 | Multi-Device Breakpoints | Consolidated media queries for laptops (1366x768, 1440x900), desktops (1920x1080), tablets (768-1199px), mobile (<=767px, <=480px) | M2 | ORIGINAL_REQUEST §R2, AC |
| 6 | Fluid Grids & Typography | Refactor summary cards, plan cards, and levers to auto-fit grids; replace hardcoded 48px font with fluid clamp typography | M2 | ORIGINAL_REQUEST §R2, AC |
| 7 | 3-Step Banner | Student journey banner (`1. Check Safe Limit → 2. Tap 1-Click Log → 3. Use Lever if Tight`) with BirdBadge | M3 | ORIGINAL_REQUEST §R3 |
| 8 | 1-Click Quick-Log Chips | Fast expense chips (Lunch Rp 15k, Transit Rp 8k, Coffee Rp 10k) directly deducting balance & safe limit | M3 | ORIGINAL_REQUEST §R3 |
| 9 | 5 Core Navigation Tabs | Smooth switching across Summary, Levers, Radar, Plans, Ecosystem with zero dummy-data dependency | M3 | ORIGINAL_REQUEST §R3 |
| 10 | E2E Opaque-Box Test Suite | Comprehensive 4-tier E2E testing suite validating UI rendering, navigation, state mutations, and responsiveness | E2E Track | ORIGINAL_REQUEST §AC, Dual Track |
| 11 | Production Build & Lint Quality | Zero warnings/errors across all 15 files (`npm run lint`), clean production build (`npm run build`), HTTP 200 server response | M4 | ORIGINAL_REQUEST §AC |
| 12 | Adversarial Hardening (Tier 5) | White-box edge-case stress testing and test coverage hardening | M4 | Project Pattern Dual Track |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Design & implement 4-tier opaque-box E2E test suite; produce TEST_READY.md | none | IN_PROGRESS |
| M1 | Mascot & Asset System | `components/mascot-badges.tsx`, Gojek tokens in CSS, replace emojis across app | none | IN_PROGRESS |
| M2 | Responsive Auto-Fit & Fluid Scaling | Fluid container, consolidated breakpoints, mobile header flex-wrap, auto-fit grids, landing page tablet scaling | none | IN_PROGRESS |
| M3 | Student UX & Quick-Log Interactions | 3-step banner polish, quick-log interaction verification, 5-tab flow verification | M1, M2 | PLANNED |
| M4 | Final E2E Pass & Adversarial Hardening | Phase 1: 100% E2E test pass (Tiers 1-4). Phase 2: Adversarial coverage hardening (Tier 5) | E2E, M3 | PLANNED |

## Interface Contracts
### `components/mascot-badges.tsx` ↔ `app/runway-app.tsx` & `app/targo-landing.tsx`
```typescript
export interface MascotBadgeProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ChameleonBadge(props: MascotBadgeProps): React.JSX.Element;
export function BirdBadge(props: MascotBadgeProps): React.JSX.Element;
export function StudentBadge(props: MascotBadgeProps): React.JSX.Element;

export function FoodChipIcon(props: { size?: number; className?: string }): React.JSX.Element;
export function TransitChipIcon(props: { size?: number; className?: string }): React.JSX.Element;
export function CoffeeChipIcon(props: { size?: number; className?: string }): React.JSX.Element;
export function TipIcon(props: { size?: number; className?: string }): React.JSX.Element;
export function SavingsIcon(props: { size?: number; className?: string }): React.JSX.Element;
export function ProtectionIcon(props: { size?: number; className?: string }): React.JSX.Element;
export function GrowthIcon(props: { size?: number; className?: string }): React.JSX.Element;
```

### `app/globals.css` ↔ Layout Components
```css
/* Container contract */
.shell {
  width: 100%;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 clamp(16px, 3.5vw, 56px) 80px;
  overflow-x: clip;
}

/* Fluid Grids */
.summary-cards-grid, .plan-grid, .levers-grid, .radar-cards-grid, .ecosystem-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: clamp(14px, 2vw, 20px);
}
```

## Code Layout
- `components/mascot-badges.tsx` — Vector mascot badges and micro-emblems
- `app/globals.css` — Global stylesheets, design tokens, media queries, and responsive grid classes
- `app/layout.tsx` — Root HTML layout, font setup, viewport configuration
- `app/page.tsx` — Entry router between landing page and cockpit
- `app/runway-app.tsx` — Cockpit UI, 5 navigation tabs, 3-step banner, quick-log interactions
- `app/targo-landing.tsx` — Marketing landing page
- `lib/runway.ts` — Core financial math and forecasting invariants
- `tests/runway.test.ts` — Domain logic unit tests
- `tests/e2e/` — Opaque-box E2E test suite (created by E2E Testing Track)
