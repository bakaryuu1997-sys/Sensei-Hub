# Spec - App Icon Redesign (Flow Grid / Future Portal)

This document specifies the design and implementation for replacing the standard Lucide `Sparkles` icon in **SENSEI HUB** with a custom-designed, high-fidelity **Flow Grid / Future Portal** icon representing IT engineering, connectivity, and focus.

## 1. Goal & Concept
- **Goal**: Elevate the brand identity of SENSEI HUB by replacing the generic Star icon with a premium, custom tech logo representing system architecture, databases, and connection networks.
- **Concept**: **3D Isometric Cube Network**
  - Uses an exact mathematical hexagon projection to form a 3D cube wireframe.
  - Plural nodes (circles) represent system components (servers, DBs, clients) connecting to a glowing central core (the Hub).
  - Employs a vibrant cyan-to-pink gradient with subtle glow effects and slow animations to represent the "Flow" learning state.

---

## 2. Icon Design Details

### A. SVG Geometry (32x32 ViewBox)
- **Center Core Node**: `(16, 16)`
- **Hexagon Outer Vertices**:
  1. Top: `(16, 6)`
  2. Top-Right: `(24.66, 11)`
  3. Bottom-Right: `(24.66, 21)`
  4. Bottom: `(16, 26)`
  5. Bottom-Left: `(7.34, 21)`
  6. Top-Left: `(7.34, 11)`
- **Line segments**:
  - Hexagon border: `M 16 6 L 24.66 11 L 24.66 21 L 16 26 L 7.34 21 L 7.34 11 Z`
  - 3D Cube Inner Axes:
    - Vertical: `M 16 6 L 16 16`
    - Left Axis: `M 7.34 21 L 16 16`
    - Right Axis: `M 24.66 21 L 16 16`
- **Vertex Nodes**:
  - Center: circle at `(16, 16)` with `r="3.5"`, filled with white/glow.
  - Vertices: circles at all 6 outer positions with `r="1.8"`, filled with cyan/pink.

### B. Color & Style Spec
- **Stroke**: Linear gradient (`#portal-grad`) starting from Cyan (`#22d3ee`) through Purple (`#a855f7`) to Pink (`#f472b6`).
- **Stroke Width**: `1.8px`, with `stroke-linecap="round"` and `stroke-linejoin="round"`.
- **Glow Filter**: A CSS drop-shadow/glow or radial background gradient to make the icon pop.
- **Micro-Animation**: Subtly spin the network background lines or pulsate the opacity of the nodes (using CSS keyframes).

---

## 3. Proposed Changes

### A. Frontend Components
#### [MODIFY] [sidebar.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/components/dashboard/sidebar.tsx)
- Replace `<Sparkles className="h-5 w-5 text-white" />` inside the logo wrapper with the inline custom `<FuturePortalIcon />` SVG.
- Add CSS styles/animations for the pulse/glow effect inside the component.

### B. Public Assets
#### [MODIFY] [icon.svg](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/public/icon.svg)
- Update with the clean SVG code.

#### [NEW] PNG Asset Regeneration
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
