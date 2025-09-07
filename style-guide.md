## 🌟 SoulCodes Style Guide

*Aesthetic Blueprint for Frequency-Aligned Components*

### 🎨 Color Palette

| Purpose | Color Code | Description |
| --- | --- | --- |
| Primary Gradient | `#8b5cf6 → #fbbf24` | Cosmic blend of intuition and abundance |
| Background | `#0f0f23 → #581c87` | Deep space gradient for sacred immersion |
| Accent Purple | `#8b5cf6` | Intuition, mysticism, spiritual flow |
| Accent Gold | `#fbbf24` | Manifestation, clarity, divine power |
| Text Light Purple | `#d6bcfa` | Soft guidance and emotional resonance |

### 🧬 Typography

- **Font Family**: `Inter` (via Google Fonts)
- **Headings**:
    - Class: `text-yellow-300 font-bold text-2xl+`
    - Use for archetype names, section titles, and ritual headers
- **Body Text**:
    - Class: `text-purple-300` or `text-purple-200`
    - Use for descriptions, prompts, and affirmations

### 🧩 Core Components

### 🔮 `.cosmic-card`

- Glassmorphic container with blur and border glow
- Use for widgets, quiz panels, dashboards, and downloads

### ✨ `.cosmic-button`

- Gradient button with hover animation and shimmer effect
- Use for calls to action, ritual triggers, and navigation

### 🧠 `.elemental-card`

- Interactive selection cards (used in quizzes and schema builder)
- Hover and selected states for energetic feedback

### 🌙 `.moon-phase`

- Circular widget with glowing animation
- Use for lunar alignment and ritual timing

### 📊 Utility Classes

| Class Name | Purpose |
| --- | --- |
| `text-glow` | Adds ethereal glow to headings |
| `quiz-progress-bar` | Animated progress indicator |
| `energy-fill` | Dynamic energy meter fill |
| `nav-button` | Navigation styling with hover states |

### 🌀 Animations

- `cosmicShift`: Background gradient movement
- `dnaFloat`: Floating DNA strand overlay
- `floatOrb`: Orb drift animation
- `moonGlow`: Pulsing moon phase aura
- `sparkleFloat`: Periodic sparkle bursts

### 🧪 Ritual Integration Tips

- Wrap tools in `<div class="cosmic-card rounded-3xl p-8">`
- Use `<h3 class="text-2xl font-bold text-yellow-300 mb-4">` for section headers
- Buttons: `<button class="cosmic-button px-6 py-3 rounded-full font-bold text-white">`
- Inputs:
    
    html
    
    `<input class="w-full px-4 py-3 rounded bg-purple-900/50 border border-purple-600 text-white">`
    

### 🛠️ Embedding New Tools

When adding a new widget or ritual:

1. Use existing page containers like `#calculatorPage` or `#dashboardPage`
2. Match layout using Tailwind grid and spacing utilities
3. Apply SoulCodes classes for visual harmony
4. Commit with messages like:
    - `feat: embed soul purpose calculator with cosmic styling`
    - `chore: align manifestation tracker with portal aesthetic`
