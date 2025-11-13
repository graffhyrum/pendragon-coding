---
"pendragon-coding": minor
---

Add light and dark mode toggle with sliding animation

Implemented a theme toggle component that allows users to switch between light and dark modes with a smooth sliding animation. The theme preference is persisted in localStorage and respects system preferences on first visit.

**New Features:**
- Theme toggle button with sliding animation positioned at the right edge of the header
- Sun and moon icons that smoothly transition based on the selected theme
- localStorage persistence to remember user's theme preference across sessions
- System preference detection on first visit (respects `prefers-color-scheme`)
- Smooth color transitions throughout the site when switching themes (300ms duration)

**Improvements:**
- Light mode uses a clean gray-50 background with dark text for improved readability during daytime
- Dark mode maintains the existing green-950 background with light text optimized for low-light environments
- Navigation underlines adapt to theme: green-600 in light mode, green-400 in dark mode
- Footer links have theme-aware hover states for better visual feedback
- Accessible implementation with proper ARIA attributes and keyboard focus states

**Technical Details:**
- Created ThemeToggle.astro component with inline script for theme management
- Configured Tailwind CSS with class-based dark mode strategy
- Added tailwind.config.js with dark mode enabled
- Updated BaseLayout, Header, Navigation, and Footer components with dark mode variants
- Theme toggle uses CSS transitions for smooth visual changes
- Focus ring styling for keyboard navigation accessibility
