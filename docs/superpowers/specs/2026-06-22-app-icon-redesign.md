# Spec - App Icon Redesign (Flow Grid / Future Portal)

This document specifies the design and implementation for replacing the standard Lucide `Sparkles` icon in **SENSEI HUB** with a custom-designed, high-fidelity **Flow Grid / Future Portal** icon representing IT engineering, connectivity, and focus.

## 1. Goal & Concept
- **Goal**: Elevate the brand identity of SENSEI HUB by replacing the generic Star icon with a premium, custom tech logo representing system architecture, databases, and connection networks.
- **Concept**: **3D Isometric Cube Network (Premium Cyber-Glow Edition)**
  - Uses an exact mathematical hexagon projection to form a 3D cube wireframe, scaled up to fill the badge space.
  - Plural nodes (circles) represent system components (servers, DBs, clients) stylized as 3D glass spheres connecting to a glowing central core.
  - Employs a dual-layer neon glow and a traveling laser pulse animation along the lines to represent active "Flow".

---

## 2. Icon Design Details

### A. SVG Geometry (32x32 ViewBox)
- **Center Core Node**: `(16, 16)`
- **Hexagon Outer Vertices**:
  1. Top: `(16, 3)`
  2. Top-Right: `(27.26, 9.5)`
  3. Bottom-Right: `(27.26, 22.5)`
  4. Bottom: `(16, 29)`
  5. Bottom-Left: `(4.74, 22.5)`
  6. Top-Left: `(4.74, 9.5)`
- **Line paths**:
  - Outer Hexagon: `M 16 3 L 27.26 9.5 L 27.26 22.5 L 16 29 L 4.74 22.5 L 4.74 9.5 Z`
  - Y-Shape Inner Axes: `M 16 3 L 16 16 M 4.74 22.5 L 16 16 M 27.26 22.5 L 16 16`

### B. Color & Style Spec
- **Gradients**:
  - `#portal-grad`: Linear gradient from Cyan (`#22d3ee`) through Purple (`#a855f7`) to Pink (`#f472b6`).
  - Radial gradients for 3D spheres:
    - `#cyan-sphere`: High-contrast sphere with white specular highlight, Cyan middle, and dark Teal base.
    - `#purple-sphere`: White highlight, Purple middle, dark Violet base.
    - `#pink-sphere`: White highlight, Pink middle, dark Rose base.
    - `#center-sphere`: Concentric white/blue core with soft edges.
- **Line Styling (Dual-Layer Glow)**:
  - Faint Base Line: `stroke-width="1.8"`, `opacity="0.3"` (keeps the network visible).
  - Glowing Laser Line: `stroke-width="2.2"`, `stroke-dasharray="25 75"`, animated with `stroke-dashoffset` to move a bright pulse along the network lines.
- **Vertex Nodes**:
  - Center: circle at `(16, 16)` with `r="4"`, filled with white/glow.
  - Vertices: circles at 6 outer positions with `r="2.2"`, styled with their respective radial sphere gradients.

---

## 3. Proposed Changes

### A. Frontend Components
#### [MODIFY] [sidebar.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/components/dashboard/sidebar.tsx)
- Define the custom `<FuturePortalIcon />` component.
- Add CSS Keyframes for:
  - `laser-flow`: Translating the dashoffset to make the bright pulse flow.
  - `portal-rotate`: Low-speed rotation of the wireframe.
  - `core-pulse`: Breathing pulse for the central core.
- Replace `<FuturePortalIcon />` in the sidebar logo container.

### B. Public Assets
#### [MODIFY] [icon.svg](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/public/icon.svg)
- Update with the clean SVG code (static, high-contrast version).

#### [MODIFY] PNG Asset Regeneration
- Regenerate the PNG icons from the new SVG:
  - `public/apple-icon.png`
  - `public/icon-light-32x32.png`
  - `public/icon-dark-32x32.png`

---

## 4. Verification Plan
1. **Visual Check**:
   - Check the Sidebar render in the web browser, verifying that the gradient, lines, and nodes align perfectly without distortion.
   - Verify that the green indicator dot (`bg-emerald-400`) still sits correctly at the bottom right corner of the icon badge.
2. **Automated Builds**:
   - Run `pnpm test:unit` to ensure no component tests are broken.
   - Run Next.js static rendering/building.
