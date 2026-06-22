# App Icon Redesign (Flow Grid / Future Portal) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace SENSEI HUB's default Sparkles icon with a custom 3D isometric cube network (Future Portal) icon, and regenerate the public favicon and apple touch assets.

**Architecture:** We will create an inline React SVG component in the sidebar with glowing gradient lines and micro-animations, update the public SVG icon, and write a Node.js script using `sharp` to convert the SVG to PNG favicons and touch icons.

**Tech Stack:** React, Next.js, SVG, Sharp, Node.js

---

## Proposed Changes

### [Dashboard Components]
#### [MODIFY] [sidebar.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/components/dashboard/sidebar.tsx)
- Define a custom `<FuturePortalIcon />` component.
- Add animation keyframes for rotating/pulsating the elements.
- Replace the Lucide `Sparkles` icon with the new component.

### [Static Public Assets]
#### [MODIFY] [icon.svg](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/public/icon.svg)
- Update with the custom SVG geometry and gradients.

#### [NEW] [generate-png-icons.js](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/scripts/generate-png-icons.js)
- Write a Node.js utility script to parse the SVG and output the required light, dark, and apple PNG sizes.

---

## Tasks

### Task 1: Update public SVG file
**Files:**
- Modify: `public/icon.svg`

- [ ] **Step 1: Write the updated SVG code to `public/icon.svg`**
  Modify [icon.svg](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/public/icon.svg) to contain the new geometric cube design:
  ```xml
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <defs>
      <linearGradient id="portal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#22d3ee" />
        <stop offset="50%" stop-color="#a855f7" />
        <stop offset="100%" stop-color="#f472b6" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <!-- Background -->
    <rect width="32" height="32" rx="8" fill="#030014" />
    
    <!-- Outer Hexagon -->
    <path d="M 16 6 L 24.66 11 L 24.66 21 L 16 26 L 7.34 21 L 7.34 11 Z" 
          stroke="url(#portal-grad)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" filter="url(#glow)" />
    
    <!-- Y-Shape Inner Axes -->
    <path d="M 16 6 L 16 16 M 7.34 21 L 16 16 M 24.66 21 L 16 16" 
          stroke="url(#portal-grad)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" filter="url(#glow)" />
          
    <!-- Node Dots -->
    <circle cx="16" cy="6" r="1.8" fill="#22d3ee" />
    <circle cx="24.66" cy="11" r="1.8" fill="#a855f7" />
    <circle cx="24.66" cy="21" r="1.8" fill="#f472b6" />
    <circle cx="16" cy="26" r="1.8" fill="#f472b6" />
    <circle cx="7.34" cy="21" r="1.8" fill="#22d3ee" />
    <circle cx="7.34" cy="11" r="1.8" fill="#22d3ee" />
    
    <!-- Center glowing core -->
    <circle cx="16" cy="16" r="3.2" fill="#ffffff" filter="url(#glow)" />
  </svg>
  ```

- [ ] **Step 2: Commit Task 1**
  ```bash
  git add public/icon.svg
  git commit -m "style(icon): update public/icon.svg with 3D network portal design"
  ```

---

### Task 2: Modify Sidebar Logo Component
**Files:**
- Modify: `components/dashboard/sidebar.tsx`

- [ ] **Step 1: Replace Sparkles with custom FuturePortalIcon component**
  Open [sidebar.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/components/dashboard/sidebar.tsx) and insert the `<FuturePortalIcon />` definition and replace `<Sparkles className="h-5 w-5 text-white" />` inside the link container.
  
  Add CSS Keyframes and styling to `components/dashboard/sidebar.tsx` or inline React style. We will define the icon component inside the same file:
  ```tsx
  const FuturePortalIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className="h-6 w-6"
    >
      <defs>
        <linearGradient id="sidebar-portal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
        <filter id="sidebar-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <style>{`
        @keyframes portal-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .portal-rotate-group {
          transform-origin: 16px 16px;
          animation: portal-spin 25s linear infinite;
        }
      `}</style>
      <g className="portal-rotate-group">
        <path
          d="M 16 6 L 24.66 11 L 24.66 21 L 16 26 L 7.34 21 L 7.34 11 Z"
          stroke="url(#sidebar-portal-grad)"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#sidebar-glow)"
        />
        <path
          d="M 16 6 L 16 16 M 7.34 21 L 16 16 M 24.66 21 L 16 16"
          stroke="url(#sidebar-portal-grad)"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#sidebar-glow)"
        />
        <circle cx="16" cy="6" r="1.8" fill="#22d3ee" />
        <circle cx="24.66" cy="11" r="1.8" fill="#a855f7" />
        <circle cx="24.66" cy="21" r="1.8" fill="#f472b6" />
        <circle cx="16" cy="26" r="1.8" fill="#f472b6" />
        <circle cx="7.34" cy="21" r="1.8" fill="#22d3ee" />
        <circle cx="7.34" cy="11" r="1.8" fill="#22d3ee" />
      </g>
      <circle cx="16" cy="16" r="3.2" fill="#ffffff" filter="url(#sidebar-glow)" className="animate-pulse" />
    </svg>
  );
  ```
  
  In the JSX rendering code of `sidebar.tsx`:
  ```tsx
  {/* Logo */}
  <Link href="/" onClick={onNavigate} className="flex items-center gap-3 p-6">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 blur-xl opacity-60" />
      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/40">
        <FuturePortalIcon />
      </div>
      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
    </div>
    <div>
      <h1 className="text-lg font-bold tracking-tight text-white">SENSEI</h1>
      <p className="text-xs text-cyan-300/80 font-mono tracking-widest">HUB.</p>
    </div>
  </Link>
  ```

- [ ] **Step 2: Commit Task 2**
  ```bash
  git add components/dashboard/sidebar.tsx
  git commit -m "feat(logo): replace Sparkles icon with custom FuturePortalIcon inside Sidebar"
  ```

---

### Task 3: Generate PNG Favicon and Touch Icons
**Files:**
- Create: `scripts/generate-png-icons.js`
- Modify: `public/icon-light-32x32.png`, `public/icon-dark-32x32.png`, `public/apple-icon.png`

- [ ] **Step 1: Install sharp dependency**
  Run: `wsl --exec bash -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && pnpm add -D sharp"`
  Expected: Successful installation of `sharp` library in package devDependencies.

- [ ] **Step 2: Create generate-png-icons.js script**
  Create [generate-png-icons.js](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/scripts/generate-png-icons.js) with the following content:
  ```javascript
  const fs = require('fs');
  const path = require('path');
  const sharp = require('sharp');

  const svgPath = path.resolve(__dirname, '../public/icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  const targets = [
    { name: 'icon-light-32x32.png', size: 32 },
    { name: 'icon-dark-32x32.png', size: 32 },
    { name: 'apple-icon.png', size: 180 }
  ];

  async function generate() {
    for (const target of targets) {
      const outputPath = path.resolve(__dirname, '../public', target.name);
      await sharp(svgBuffer)
        .resize(target.size, target.size)
        .png()
        .toFile(outputPath);
      console.log(`Generated ${target.name} (${target.size}x${target.size})`);
    }
  }

  generate().catch(err => {
    console.error('Error generating PNG icons:', err);
    process.exit(1);
  });
  ```

- [ ] **Step 3: Run generate-png-icons.js script**
  Run: `wsl --exec bash -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && node scripts/generate-png-icons.js"`
  Expected: Success, prints logs for the three generated PNG files.

- [ ] **Step 4: Commit Task 3**
  ```bash
  git add package.json pnpm-lock.yaml scripts/generate-png-icons.js public/icon-light-32x32.png public/icon-dark-32x32.png public/apple-icon.png
  git commit -m "chore(icons): install sharp and regenerate public PNG favicon/touch icons"
  ```

---

## Verification Plan

### Automated Tests
- Run unit tests: `wsl --exec bash -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && pnpm test:unit"`
  - Verify all 46 tests pass.

### Production Build
- Run: `wsl --exec bash -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && pnpm build"`
  - Verify compilation succeeds.
