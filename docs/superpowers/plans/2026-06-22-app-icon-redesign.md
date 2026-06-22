# App Icon Redesign (Flow Grid / Future Portal) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade SENSEI HUB's default icon to a premium 3D isometric cube network (Future Portal) icon with custom 3D glass spheres, dual-layer neon glow, and laser flow animation, and regenerate favicon PNG assets.

**Architecture:** We will implement an inline React SVG component in the sidebar with glowing radial gradients, a faint base line, and an overlaying animated laser line. We will update the public SVG icon and run the sharp generator script to compile new favicons and touch icons.

**Tech Stack:** React, Next.js, SVG, Sharp, Node.js

---

## Proposed Changes

### [Dashboard Components]
#### [MODIFY] [sidebar.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/components/dashboard/sidebar.tsx)
- Define the premium `<FuturePortalIcon />` component.
- Add animation keyframes for traveling laser light and rotating grid.
- Replace the Lucide `Sparkles` icon with the new component.

### [Static Public Assets]
#### [MODIFY] [icon.svg](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/public/icon.svg)
- Update with the scaled-up geometry and high-contrast gradients/shadows.

---

## Tasks

### Task 1: Update public SVG file
**Files:**
- Modify: `public/icon.svg`

- [ ] **Step 1: Write the updated SVG code to `public/icon.svg`**
  Modify [icon.svg](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/public/icon.svg) to contain the new geometric cube design with 3D glass sphere radial gradients:
  ```xml
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <defs>
      <!-- Core Gradients -->
      <linearGradient id="portal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#22d3ee" />
        <stop offset="50%" stop-color="#a855f7" />
        <stop offset="100%" stop-color="#f472b6" />
      </linearGradient>
      
      <!-- 3D Glass Sphere Gradients -->
      <radialGradient id="cyan-sphere" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="40%" stop-color="#22d3ee" />
        <stop offset="100%" stop-color="#0891b2" />
      </radialGradient>
      <radialGradient id="purple-sphere" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="40%" stop-color="#c084fc" />
        <stop offset="100%" stop-color="#7e22ce" />
      </radialGradient>
      <radialGradient id="pink-sphere" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="40%" stop-color="#f472b6" />
        <stop offset="100%" stop-color="#be185d" />
      </radialGradient>
      <radialGradient id="center-sphere" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="30%" stop-color="#e0f2fe" />
        <stop offset="100%" stop-color="#38bdf8" />
      </radialGradient>
      
      <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <!-- Background -->
    <rect width="32" height="32" rx="8" fill="#030014" />
    
    <!-- Outer Hexagon -->
    <path d="M 16 3 L 27.26 9.5 L 27.26 22.5 L 16 29 L 4.74 22.5 L 4.74 9.5 Z" 
          stroke="url(#portal-grad)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" filter="url(#neon-glow)" />
    
    <!-- Y-Shape Inner Axes -->
    <path d="M 16 3 L 16 16 M 4.74 22.5 L 16 16 M 27.26 22.5 L 16 16" 
          stroke="url(#portal-grad)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" filter="url(#neon-glow)" />
          
    <!-- Node Dots (3D Glass Spheres) -->
    <circle cx="16" cy="3" r="2.2" fill="url(#cyan-sphere)" />
    <circle cx="27.26" cy="9.5" r="2.2" fill="url(#purple-sphere)" />
    <circle cx="27.26" cy="22.5" r="2.2" fill="url(#pink-sphere)" />
    <circle cx="16" cy="29" r="2.2" fill="url(#pink-sphere)" />
    <circle cx="4.74" cy="22.5" r="2.2" fill="url(#cyan-sphere)" />
    <circle cx="4.74" cy="9.5" r="2.2" fill="url(#cyan-sphere)" />
    
    <!-- Center glowing core -->
    <circle cx="16" cy="16" r="4" fill="url(#center-sphere)" filter="url(#neon-glow)" />
  </svg>
  ```

- [ ] **Step 2: Commit Task 1**
  ```bash
  git add public/icon.svg
  git commit -m "style(icon): upgrade public/icon.svg to premium 3D sphere & neon glow portal"
  ```

---

### Task 2: Modify Sidebar Logo Component
**Files:**
- Modify: `components/dashboard/sidebar.tsx`

- [ ] **Step 1: Write the custom `<FuturePortalIcon />` in `sidebar.tsx`**
  Modify [sidebar.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/components/dashboard/sidebar.tsx) to define the new premium design. It includes the rotating background group, faint base lines, and the overlaying white laser lines that pulse and travel around the grid:
  ```tsx
  const FuturePortalIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className="h-6 w-6"
    >
      <defs>
        <!-- Gradients -->
        <linearGradient id="sidebar-portal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
        <radialGradient id="sb-cyan-sphere" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0891b2" />
        </radialGradient>
        <radialGradient id="sb-purple-sphere" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7e22ce" />
        </radialGradient>
        <radialGradient id="sb-pink-sphere" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#be185d" />
        </radialGradient>
        <radialGradient id="sb-center-sphere" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#38bdf8" />
        </radialGradient>
        
        <filter id="sidebar-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <style>{`
        @keyframes laser-flow {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes portal-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .portal-rotate-group {
          transform-origin: 16px 16px;
          animation: portal-spin 35s linear infinite;
        }
        .laser-line {
          stroke-dasharray: 15 85;
          animation: laser-flow 4s linear infinite;
        }
        .laser-line-reverse {
          stroke-dasharray: 20 80;
          animation: laser-flow 3.5s linear infinite reverse;
        }
      `}</style>
      <g className="portal-rotate-group">
        <!-- Faint Base Layer for Visual Continuity -->
        <path
          d="M 16 3 L 27.26 9.5 L 27.26 22.5 L 16 29 L 4.74 22.5 L 4.74 9.5 Z"
          stroke="url(#sidebar-portal-grad)"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M 16 3 L 16 16 M 4.74 22.5 L 16 16 M 27.26 22.5 L 16 16"
          stroke="url(#sidebar-portal-grad)"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.3"
        />
        
        <!-- Glowing Traveling Laser Sparks -->
        <path
          d="M 16 3 L 27.26 9.5 L 27.26 22.5 L 16 29 L 4.74 22.5 L 4.74 9.5 Z"
          stroke="url(#sidebar-portal-grad)"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#sidebar-glow)"
          className="laser-line"
        />
        <path
          d="M 16 3 L 16 16 M 4.74 22.5 L 16 16 M 27.26 22.5 L 16 16"
          stroke="url(#sidebar-portal-grad)"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#sidebar-glow)"
          className="laser-line-reverse"
        />
        
        <!-- Vertex Nodes (3D glass spheres) -->
        <circle cx="16" cy="3" r="2.2" fill="url(#sb-cyan-sphere)" />
        <circle cx="27.26" cy="9.5" r="2.2" fill="url(#sb-purple-sphere)" />
        <circle cx="27.26" cy="22.5" r="2.2" fill="url(#sb-pink-sphere)" />
        <circle cx="16" cy="29" r="2.2" fill="url(#sb-pink-sphere)" />
        <circle cx="4.74" cy="22.5" r="2.2" fill="url(#sb-cyan-sphere)" />
        <circle cx="4.74" cy="9.5" r="2.2" fill="url(#sb-cyan-sphere)" />
      </g>
      <!-- Center glowing core node -->
      <circle cx="16" cy="16" r="4" fill="url(#sb-center-sphere)" filter="url(#sidebar-glow)" className="animate-pulse" />
    </svg>
  );
  ```

- [ ] **Step 2: Commit Task 2**
  ```bash
  git add components/dashboard/sidebar.tsx
  git commit -m "feat(logo): upgrade sidebar logo with 3D sphere nodes and traveling laser animation"
  ```

---

### Task 3: Regenerate PNG Icons
**Files:**
- Modify: `public/icon-light-32x32.png`, `public/icon-dark-32x32.png`, `public/apple-icon.png`

- [ ] **Step 1: Run png generation script**
  Run: `wsl --exec bash -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && node scripts/generate-png-icons.js"`
  Expected: Success logs showing the regenerated icons with updated scaled-up 3D spheres.

- [ ] **Step 2: Commit Task 3**
  ```bash
  git add public/icon-light-32x32.png public/icon-dark-32x32.png public/apple-icon.png
  git commit -m "chore(icons): regenerate PNG icons from updated premium SVG"
  ```

---

## Verification Plan

### Automated Tests
- Run unit tests: `wsl --exec bash -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && pnpm test:unit"`
  - Verify all 46 tests pass.

### Production Build
- Run: `wsl --exec bash -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && pnpm build"`
  - Verify compilation succeeds.
