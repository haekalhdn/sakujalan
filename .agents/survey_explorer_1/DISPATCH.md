## 2026-09-07T14:22:19Z

Investigate the codebase for R1: Professional Youth-Friendly Mascot & Asset System.
1. Search for existing mascot references, image files, SVGs, or reference artwork in public/, components/, assets, or documentation. Check for reference images of the Chameleon with gold coin and the Bird with GoPay vest/chest emblem, as well as Student/Nara avatar.
2. Search all components and pages for emojis or placeholder icons currently used as feature emblems (e.g. transit, savings, what-if, profile switcher, etc.).
3. Analyze how custom branded vector mascot badges should be designed and structured:
   - BirdBadge: Green bird with flapping wing and GoPay chest emblem for transit and daily student flow.
   - ChameleonBadge: Friendly chameleon with curly tail holding a gold money coin/bag for prudence, savings, and what-if simulation.
   - StudentBadge: Nara character badge with SakuJalan cap for profile switcher.
4. Verify official Gojek design tokens (#00AA13, #00DF82, #007A0E, #16261E) and how they fit into Tailwind/CSS.
5. Catalog all files that need to be created or modified for R1, and identify exact component call sites.
