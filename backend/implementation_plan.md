# Phase 4: Frontend Foundation Implementation Plan

This document outlines the foundation for the frontend application. As a Senior Product Designer, I have formulated the **Aurora Copper** design system to guarantee a premium, modern SaaS experience that stands out from generic admin dashboards.

## User Review Required

> [!IMPORTANT]
> Please review the **Design System Specification** below. Once you approve this plan, I will bootstrap the Vite project, configure Tailwind, and implement the complete component library and architecture.

## Design System Specification: Aurora Copper

### 1. Color Palette
The Aurora Copper theme combines the warmth and elegance of polished copper with the deep, professional tones of a dark slate "aurora" night sky.

*   **Primary (Copper)**: A rich, metallic orange-brown scale.
    *   `copper-50`: `#FAF4EF` (Backgrounds)
    *   `copper-100`: `#F4E5D8` (Subtle hover)
    *   `copper-500`: `#C87941` (Base brand color - Buttons, Accents)
    *   `copper-600`: `#A75D2B` (Active states)
    *   `copper-900`: `#4F2B15` (Deep text on copper)
*   **Neutral (Slate)**: Deep, cool grays for contrast.
    *   `slate-50` to `slate-900` (Tailwind defaults, using `slate-900` `#0F172A` for primary text and headings).
*   **Surface**: `#FFFFFF` for cards, `#F8FAFC` (slate-50) for application background.
*   **Error/Success**: Soft, modern variants of red/green to match the premium feel (e.g., Rose and Emerald).

### 2. Typography Scale
We will use modern, highly legible sans-serif fonts to maintain a clean SaaS aesthetic.
*   **Headings**: `Outfit` (Geometric, friendly, highly legible).
*   **Body**: `Inter` (The industry standard for clean UI readability).
*   **Scale**: 
    *   `h1`: `text-4xl` (36px), tracking-tight, font-bold.
    *   `h2`: `text-2xl` (24px), font-semibold.
    *   `body`: `text-base` (16px), text-slate-600.
    *   `small`: `text-sm` (14px), text-slate-500.

### 3. Spacing & Borders
*   **Spacing**: Generous padding to let elements breathe. Minimum `p-6` or `p-8` for card interiors.
*   **Border Radius**: Heavily rounded corners to soften the UI.
    *   Cards & Modals: `rounded-2xl`
    *   Buttons & Inputs: `rounded-xl`
    *   Badges: `rounded-full`
*   **Shadows**: Soft, diffused shadows (`shadow-sm` for standard cards, `shadow-xl` with low opacity for modals/dropdowns).

### 4. Component Guidelines
*   **Glassmorphism**: The Navbar will utilize `backdrop-blur-md` and semi-transparent backgrounds to create a "glass" effect floating above the content.
*   **Interactions**: All clickable elements will have smooth `transition-all duration-200` with subtle transform scaling (`active:scale-95`) or shadow elevation on hover.
*   **Forms**: Inputs will feature subtle borders that illuminate with a `copper-500` ring on focus.

---

## Proposed Technical Implementation

### 1. Project Initialization
*   Bootstrap React + TypeScript using Vite.
*   Configure absolute paths (`@/*` -> `src/*`).

### 2. Architecture & Folder Structure
```text
frontend/
├── src/
│   ├── assets/        # Images, icons
│   ├── components/
│   │   ├── ui/        # Reusable primitives (Button, Input, Badge, etc.)
│   │   ├── layout/    # Navbar, Sidebar, PageWrapper
│   │   └── form/      # React Hook Form wrappers
│   ├── hooks/         # Custom React hooks (e.g., useToast)
│   ├── lib/           # Axios setup, utilities (clsx, tailwind-merge)
│   ├── types/         # Shared TypeScript interfaces
│   ├── App.tsx        # React Router setup
│   └── main.tsx       # Entry point with QueryClientProvider
├── tailwind.config.js # Aurora Copper theme extensions
└── vite.config.ts
```

### 3. Libraries to Install
*   `react-router-dom`: Client-side routing.
*   `axios`: HTTP client with interceptors.
*   `@tanstack/react-query`: Server state management & caching.
*   `react-hook-form` + `@hookform/resolvers` + `zod`: Type-safe form management.
*   `lucide-react`: Clean, premium iconography.
*   `clsx` + `tailwind-merge`: For dynamic class utility management in UI components.

### 4. Code Generation Plan
I will generate:
1.  Vite, Tailwind, and path alias configurations.
2.  `lib/api.ts` (Axios interceptors) and `lib/utils.ts` (styling utilities).
3.  10 Reusable UI components strictly adhering to the design system.
4.  Layout components (Glass Navbar, Sidebar, Layout Shell).
5.  Base routing configuration in `App.tsx` (with placeholders for pages).

## Verification Plan

### Automated Checks
*   Ensure the Vite server starts successfully (`npm run dev`).
*   Ensure TypeScript compilation passes with zero errors (`npm run build`).

### Manual Verification
*   Please review the design decisions above. Let me know if you would like to adjust the "Aurora Copper" hex codes or font choices before I write the code.
