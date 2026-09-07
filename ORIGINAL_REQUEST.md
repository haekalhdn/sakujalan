# Original User Request

## 2026-09-07T14:20:50Z

Refine and scale **SakuJalan: Campus Budget Navigator** with authentic youth-friendly vector mascot assets, a fluid auto-fit layout across all laptop/desktop screens, and streamlined student journey interactions.

Working directory: C:\Users\haekalhdn\Documents\Codex\2026-09-07\d-repository-competition-gojek-bisniscomp-hey\campus-runway
Integrity mode: development

## Requirements

### R1. Professional Youth-Friendly Mascot & Asset System
- Replace generic system emojis with custom branded vector mascot badges:
  - **The Gojek Bird (`BirdBadge`)**: Green bird with flapping wing and GoPay chest emblem for transit and daily student flow.
  - **The Chameleon (`ChameleonBadge`)**: Friendly chameleon with curly tail holding a gold money coin/bag for prudence, savings, and what-if simulation.
  - **Student Avatar (`StudentBadge`)**: Nara character badge with SakuJalan cap for profile switcher.
- Ensure consistent color palettes matching official Gojek design tokens (`#00AA13`, `#00DF82`, `#007A0E`, `#16261E`).

### R2. Responsive Auto-Fit & Fluid Scaling (All Laptops & Desktops)
- Expand base container scaling (`max-width: 1440px`, base font `16px`, fluid clamp margins) so the web app comfortably fills and auto-fits 13-inch, 15-inch laptops, and wide monitors without awkward empty gaps or cramped text.
- Maintain responsive break-points for mobile (`<= 767px`) and tablet/medium laptops (`768px - 1199px`).

### R3. Streamlined Student UX & Quick-Log Interactions
- Retain the intuitive 3-step banner: `1. Check Safe Limit → 2. Tap 1-Click Log → 3. Use Lever if Tight`.
- Keep 1-click quick log chips for Canteen Lunch (Rp 15k), Transit (Rp 8k), and Coffee (Rp 10k).
- Ensure all 5 core navigation tabs operate smoothly with zero dummy-data dependency.

## Acceptance Criteria

### Visual Polish & Mascot Integration
- [ ] No generic AI emoji icons are used as main feature emblems; all key sections use the custom circular vector badges.
- [ ] Mascot design accurately reflects the reference images (Chameleon with gold coin, Bird with GoPay vest).

### Layout & Responsiveness
- [ ] App shell auto-fits seamlessly across multiple screen resolutions (1366x768, 1920x1080, and mobile viewports) without horizontal scroll overflow.
- [ ] Font sizing and cards are clearly legible and comfortably proportioned on laptop viewports.

### Build & Code Quality
- [ ] `npm run lint` passes with 0 warnings and 0 errors across all 15 files.
- [ ] `npm run build` generates production assets cleanly.
- [ ] `GET http://localhost:3000/` serves HTTP 200 OK.
