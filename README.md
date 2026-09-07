# SakuJalan: Campus Budget Navigator 🧭💚

> **Empowering Indonesian university students to conquer pocket-money anxiety and master their financial runway through proactive budgeting and Gojek ecosystem synergy.**
> 
> *Built for Gojek Championship / BisnisComp 2026.*

---

## 📌 Executive Summary

University students often struggle with the "End-of-Month Crunch" (*Krisis Akhir Bulan*). Traditional personal finance apps fail them because retrospective expense tracking requires tedious manual categorization and doesn't answer the single question that actually matters every morning:

> **"How much can I safely spend today without running out of money before my next allowance or pay-day?"**

**SakuJalan** transforms student budgeting from passive record-keeping into an active, proactive financial navigation cockpit. Powered by a deterministic runway math engine, SakuJalan calculates a dynamic **Safe-to-Spend Daily Limit**, isolates fixed survival commitments (kos boarding fees, internet, study supplies), and provides instant **Emergency Levers** to safely stretch the month.

---

## 🌟 Key Features

### 1. 🧭 Proactive "Safe Today" Runway Engine
* Computes an invariant daily safe spending ceiling:
  \text{Daily Safe} = \max\left(0, \left\lfloor \frac{\text{Cash} + \text{Spent Today} - \text{Mandatory} - \text{Optional} - \text{Emergency Buffer}}{\text{Remaining Days}} \right\rfloor - \text{Spent Today}\right)
* Prevents double-counting and immediately warns users if current spend trajectories risk a future cash deficit.

### 2. ⚡ 1-Click Campus Quick-Logs
* Zero-friction, sub-second logging for everyday student rituals:
  * 🍛 **Kantin Lunch** (Rp 15,000)
  * 🚆 **Campus Transit / Bikun** (Rp 8,000)
  * ☕ **Kopi Belajar / Library Brew** (Rp 10,000)
* Instant reactive recalculation of daily allowance across all UI panels.

### 3. 🎛️ Emergency Runway Levers
When unexpected expenses occur and your runway tightens, SakuJalan activates tactical adjustments instead of inducing panic:
* **Lever 1 (Food Substitute)**: Swap high-spend café meals for subsidized campus canteen alternatives (+Rp 15,000/day runway).
* **Lever 2 (Defer Optional)**: Postpone flexible social outings or subscriptions (+Rp 50,000 immediate cashflow buffer).
* **Lever 3 (Campus Micro-gig)**: Discover verified student gigs, peer tutoring, and research assistant opportunities.

### 4. 📡 Campus Radar (Peer Benchmarks)
* Real-world contextual spending benchmarks tailored for student ecosystems (e.g., Universitas Indonesia / Salemba & Depok campuses).
* Compare living costs across food, transport, and laundry against real student quartiles.

### 5. 💚 Deep Gojek Ecosystem Integration
* **GoPay Live Sync**: Seamless transaction reconciliation and webhook simulation.
* **GoFood Hemat**: Context-aware meal recommendations matching your exact remaining safe limit.
* **GoTransit Integration**: Multi-modal student route optimization (KRL Commuter Line + GoRide feeder).

### 6. 🎨 Gen-Z Friendly Visual System & 3D Hero
* **Custom Mascot Badges**:
  * 🦎 **Chameleon Badge**: Symbolizing financial agility, prudence, and savings.
  * 🐦 **Gojek Bird Badge**: Dynamic green guide for transit and daily flow.
  * 🎓 **Student Avatar**: Personalized campus identity.
* **Interactive Three.js 3D Hero**: Tactile visual finance elements rendered with WebGL.
* **Fluid Auto-Fit Layout**: Fully responsive across 13", 14", 15" laptops, ultra-wide desktops, tablets, and smartphones.

---

## 🏗️ Architecture & Technology Stack

\                                  ┌─────────────────────────────┐
                                  │      Client Viewports       │
                                  │  (Mobile, Laptop, Desktop)  │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │     Next.js 15 / Vinext     │
                                  │   (React 19, Tailwind v4)   │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │      State API Layer        │
                                  │   (/api/state / route.ts)   │
                                  └──────┬───────────────┬──────┘
                                         │               │
                     Deterministic Math  ▼               ▼  Persistence
                     ┌───────────────────────┐   ┌───────────────────────┐
                     │    lib/runway.ts      │   │     Cloudflare D1     │
                     │  (Pure State Engine)  │   │  (SQLite + Drizzle)   │
                     └───────────────────────┘   └───────────────────────┘
\
| Layer | Technologies |
|---|---|
| **Frontend Framework** | Next.js 15 / Vinext (React 19, RSC, Vite bundler) |
| **Styling & Design Tokens** | Tailwind CSS v4 with custom Gojek color tokens (\#00AA13\, \#00DF82\, \#007A0E\, \#16261E\) |
| **3D & Graphics** | Three.js + SVG Vector Mascot Badge system |
| **Icons & UI Primitives** | Lucide React, @base-ui/react, @shadcn/react |
| **Database & ORM** | Cloudflare D1 (SQLite serverless) via Drizzle ORM |
| **Local Runtime** | Miniflare / Cloudflare Workers environment via Node.js 22 |
| **Linting & Code Quality** | Oxlint & Oxfmt |

---

## 📂 Project Structure

\sakujalan/
├── app/
│   ├── api/
│   │   └── state/
│   │       └── route.ts          # State API: GET snapshot & POST idempotent commands
│   ├── globals.css               # Gojek design tokens, fluid container, responsive grids
│   ├── layout.tsx                # Root layout & typography
│   ├── page.tsx                  # Gateway router (Landing page ↔ Financial Cockpit)
│   ├── runway-app.tsx            # Main Cockpit UI (5 tabs, quick-logs, simulator, modals)
│   ├── targo-landing.tsx         # Product landing page & feature showcases
│   └── three-runway-hero.tsx     # Three.js 3D interactive hero scene
├── components/
│   ├── mascot-badges.tsx         # Custom vector mascots (Chameleon, Bird, Student badges)
│   └── ui/                       # Reusable UI primitives (Button, Dialog, Tabs, Card, etc.)
├── db/
│   └── schema.ts                 # Drizzle schema definitions for accounts & ledgers
├── drizzle/                      # Production database migrations
├── lib/
│   └── runway.ts                 # Core financial logic: balance(), forecast(), apply()
├── public/                       # Static brand assets & illustrations
├── package.json                  # Dependencies and execution scripts
└── README.md                     # Documentation
\
---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: \>= 22.13.0* **npm**: \>= 10.0.0* **Git**

### Installation

1. **Clone the repository**:
   \\ash
   git clone https://github.com/haekalhdn/sakujalan.git
   cd sakujalan
   \
2. **Install dependencies**:
   \\ash
   npm install
   \
3. **Start the local development server**:
   \\ash
   npm run dev
   \   Open your browser and navigate to \http://localhost:3000\.

### Database & Migrations

If modifying database schemas in \db/schema.ts\:
\\ash
# Generate Drizzle migration files
npm run db:generate
\
### Code Quality & Validation

Run linting and type checking before committing:
\\ash
# Fast linting via Oxlint
npm run lint

# Code formatting via Oxfmt
npm run format

# Production build verification
npm run build
\
---

## 🛡️ Security & Student Data Privacy

* **Zero-Credential Direct Bank Access**: SakuJalan operates safely without requiring bank logins, PINs, or OTPs.
* **Idempotency Safeguard**: Every state mutation includes a cryptographic request digest to prevent accidental double-spending or redundant transactions.
* **Optimistic Locking**: Automatic detection and rejection of stale edits across multi-tab sessions.
* **Full Data Ownership**: Students can export their entire financial ledger to JSON or permanently purge their data at any time.

---

## 🏆 Competition Credentials

* **Competition**: Gojek Championship / BisnisComp 2026
* **Track**: Digital Business & Product Innovation
* **Author / Maintainer**: Haekal ([@haekalhdn](https://github.com/haekalhdn))
* **License**: MIT License - see the LICENSE file for details.

---

<p align="center">
  <b>SakuJalan</b> • <i>Navigasi Uang Saku Mahasiswa Cerdas, Bebas Cemas.</i><br>
  Crafted with 💚 for Indonesian university students and the Gojek ecosystem.
</p>
