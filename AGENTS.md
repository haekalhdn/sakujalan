# SakuJalan UI Design Standards & Guidelines

## 1. Vector Mascot & Asset Standard (No Generic System Emojis)
- **Do NOT use generic system emojis** as primary feature icons, navigation emblems, or card hero headers. They look generic and AI-generated.
- **Use customized SVG vector illustrations / badges** that share consistent brand tokens:
  - Gojek Green: #00AA13
  - Mint Glow: #00DF82
  - Forest Outline: #007A0E
  - Dark Slate Text: #16261E
- **Mascot Persona Guidelines**:
  - **The Chameleon (ChameleonBadge)**: Represents financial prudence, smart decisions, and the What-If Simulator. Features iconic round eyes, curled tail, and a golden money coin/bag ($).
  - **The Gojek Bird (BirdBadge)**: Represents speed, transit, and daily flow. Features flapping mint wings, head crest, and a green GoPay (GP) chest vest.
  - **Student Avatar (StudentBadge)**: Represents the student user (Nara - Universitas Indonesia benchmark). Features friendly smile, blush cheeks, and a green SakuJalan cap.

## 2. Multi-Device Auto-Fit & Fluid Scaling
- **Container Sizing**: Use .shell with width: 100%, max-width: 1440px, and fluid padding clamp(16px, 3.5vw, 56px) so pages comfortably fill standard 13-inch, 14-inch, and 15-inch laptop screens without looking empty or cramped.
- **Base Typography**: Base body text should be set at 16px with line-height 1.6 to ensure effortless legibility across 1080p and 2K displays.
- **Auto-Fit Grids**: Core interactive cards (Levers, Radar, Ecosystem) must use grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) to naturally re-flow across viewports without horizontal scrollbars.
