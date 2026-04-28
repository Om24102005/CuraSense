# SuperDesign Ecosystem: Source of Truth

This document outlines the strict UI/UX guidelines for the CuraSense platform, enforcing the SuperDesign ethos.

## 1. Typography & Hierarchy
* **Primary Font:** 'Michroma' for high-impact headings and brand identifiers.
* **Secondary Font:** 'Inter' for highly readable body copy and data tables.
* **Tracking:** Headings must utilize tight tracking (`tracking-tight` or `-0.02em`) to maintain a premium, condensed aesthetic.

## 2. Color Architecture (OKLCH Native)
We rely strictly on the dynamic OKLCH variables defined in `src/styles/theme.css`.
* **Surfaces:** Use `bg-background` and `bg-card`. 
* **Accents:** Gradients should transition between `var(--chart-1)` and `var(--chart-2)` for primary interactive elements.
* **Contrast:** Always use `text-foreground` and `text-muted-foreground` to ensure WCAG compliance across dark and light modes.

## 3. The Glassmorphism Engine
All surface cards and floating nav elements must utilize the standard SuperDesign glassmorphic stack:
* `bg-card/70` or `bg-background/80`
* `backdrop-blur-xl` or `backdrop-blur-2xl`
* `border border-border/50`
* Shadows: Minimal `shadow-xl shadow-black/5` in light mode, deep glowing shadows in dark mode.

## 4. Bento Grid Layouts
* Content must be organized using asymmetrical grid layouts (`grid-cols-1 md:grid-cols-3` or `md:grid-cols-4`).
* Emphasize primary actions by spanning multiple columns (`md:col-span-2`).

## 5. Micro-interactions
* All buttons and cards must feature transform transitions: `transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg`.