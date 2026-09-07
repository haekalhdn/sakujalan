## 2026-09-07T14:29:15Z

You are m1_worker (Mascot & Assets Worker).
Working directory: C:\Users\haekalhdn\Documents\Codex\2026-09-07\d-repository-competition-gojek-bisniscomp-hey\campus-runway\.agents\m1_worker
Project root: C:\Users\haekalhdn\Documents\Codex\2026-09-07\d-repository-competition-gojek-bisniscomp-hey\campus-runway

Mandatory input: You MUST read:
1. ORIGINAL_REQUEST.md at C:\Users\haekalhdn\Documents\Codex\2026-09-07\d-repository-competition-gojek-bisniscomp-hey\campus-runway\.agents\ORIGINAL_REQUEST.md
2. PROJECT.md at C:\Users\haekalhdn\Documents\Codex\2026-09-07\d-repository-competition-gojek-bisniscomp-hey\campus-runway\.agents\orchestrator\PROJECT.md
3. Survey Explorer 1 report at C:\Users\haekalhdn\Documents\Codex\2026-09-07\d-repository-competition-gojek-bisniscomp-hey\campus-runway\.agents\survey_explorer_1\handoff.md

Exclusive Write Ownership:
- `components/mascot-badges.tsx` (new file)
- `app/runway-app.tsx` (badge extraction, emoji replacement, Tab 4 mascot header)
- `app/targo-landing.tsx` (emoji array replacement, arrow CTA)
- `app/globals.css` (Gojek tokens in `@theme inline`)
DO NOT modify `tests/` or files owned by other milestones.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Objective:
Implement Milestone 1 (M1: Professional Youth-Friendly Mascot & Asset System):
1. Create `components/mascot-badges.tsx`:
   - Export `ChameleonBadge`, `BirdBadge`, `StudentBadge` with full SVG vector art matching requirements (curled tail, gold coin $, flapping mint wing, GP vest badge, Nara student cap with SJ badge).
   - Export branded vector micro-emblems: `FoodChipIcon`, `TransitChipIcon`, `CoffeeChipIcon`, `TipIcon`, `SavingsIcon`, `ProtectionIcon`, `GrowthIcon`.
2. Refactor `app/runway-app.tsx`:
   - Remove inline definitions of `ChameleonBadge`, `BirdBadge`, `StudentBadge`.
   - Import badges and micro-emblems from `@/components/mascot-badges`.
   - Replace all 10 generic emoji call sites:
     - `⚙ EDIT BUDGET` -> `<Sliders size={14} />` or `<Settings size={14} />`
     - `🍲 Lunch (Rp 15k)` -> `<FoodChipIcon /> Lunch (Rp 15k)`
     - `🚆 Transit (Rp 8k)` -> `<TransitChipIcon /> Transit (Rp 8k)`
     - `☕ Coffee (Rp 10k)` -> `<CoffeeChipIcon /> Coffee (Rp 10k)`
     - Levers `💰`, `🛡️`, `📈` -> `<SavingsIcon />`, `<ProtectionIcon />`, `<GrowthIcon />`
     - Radar tips `💡 Tip:` -> `<TipIcon /> Tip:` or Lucide `<Sparkles size={14} color="#00AA13" />`
   - Add `<ChameleonBadge size={44} />` to Tab 4 header so all 5 tabs have consistent mascot emblems.
3. In `app/targo-landing.tsx`:
   - Replace generic emoji array (line 33) with SVG tokens / coin shapes.
   - Replace `▶` with Lucide `<ArrowRight size={16} />`.
4. In `app/globals.css`:
   - Add official Gojek brand tokens to `@theme inline`:
     `--color-gojek-green: #00AA13;`
     `--color-gojek-mint: #00DF82;`
     `--color-gojek-forest: #007A0E;`
     `--color-gojek-dark: #16261E;`
     `--color-gojek-gold: #FFB800;`
5. Verification:
   - Run `npm run lint` — verify 0 errors, 0 warnings across all files.
   - Run `npx tsx tests/runway.test.ts` — verify all rules pass.
   - Run `npm run build` — verify clean production build.
   - Scan for remaining emojis to ensure zero generic emojis remain.

Write your structured report to `C:\Users\haekalhdn\Documents\Codex\2026-09-07\d-repository-competition-gojek-bisniscomp-hey\campus-runway\.agents\m1_worker\handoff.md`.
Send a completion message back to the orchestrator when finished.
