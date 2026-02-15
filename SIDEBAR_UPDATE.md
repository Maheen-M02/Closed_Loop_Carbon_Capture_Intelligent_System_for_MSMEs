# Sidebar Update - Calculator and Marketplace

## Changes Made

### 1. Added New Menu Item
- **Label**: "Calculator and Marketplace"
- **Icon**: 🛒 (shopping cart)
- **Position**: Below "Reports" (last item in the menu)
- **Status**: Non-clickable (disabled)
- **Special Feature**: "Coming Soon" badge

### 2. Visual Highlighting

The new menu item has special styling to make it stand out:

#### Background
- Gradient background with orange/amber tones
- Uses `linear-gradient(135deg, rgba(255,184,77,.2), rgba(255,154,61,.2))`
- Different from the green theme of other items

#### Border
- Left border color: `#FFB84D` (amber/orange)
- Matches the "Coming Soon" badge color

#### Animation
- Pulsing glow effect (`comingSoonPulse` animation)
- Subtle shadow that pulses every 3 seconds
- Creates attention-grabbing effect

#### "Coming Soon" Badge
- Small badge next to the label
- Orange gradient background
- Uppercase text
- Pulsing scale animation
- Box shadow for depth

### 3. Behavior

- **Non-clickable**: The item is disabled and won't navigate anywhere
- **Cursor**: Shows "not-allowed" cursor on hover
- **Hover effect**: Slightly brighter background on hover (but still disabled)

### 4. Code Changes

#### Files Modified:
1. `frontend/src/components/Sidebar.jsx`
   - Added new menu item with `disabled: true` and `comingSoon: true` flags
   - Updated `handleNavigation` to check for disabled items
   - Added conditional CSS classes for disabled and coming-soon states
   - Added "Coming Soon" badge rendering

2. `frontend/src/index.css`
   - Added `.nav-item-coming-soon` class with gradient background
   - Added `.nav-item-disabled` class for disabled state
   - Added `.coming-soon-badge` class for the badge
   - Added `@keyframes comingSoonPulse` animation
   - Added `@keyframes badgePulse` animation
   - Updated `.nav-label` to support flex layout for badge

### 5. Visual Preview

```
┌─────────────────────────────────────┐
│  🌱 CarbonSetu                      │
├─────────────────────────────────────┤
│  📊 Dashboard                       │
│  📈 Analytics                       │
│  💡 Recommendations                 │
│  ✓  Compliance                      │
│  ⚡ Optimization                    │
│  🌱 Carbon Capture                  │
│  🔬 Simulator                       │
│  📄 Reports                         │
│  🛒 Calculator and Marketplace      │
│     [COMING SOON] ← Orange badge    │
│     ↑ Orange glow/highlight         │
├─────────────────────────────────────┤
│  ● System Active                    │
└─────────────────────────────────────┘
```

### 6. Testing

The changes have been applied and are live:
- ✅ Frontend hot-reloaded automatically (Vite HMR)
- ✅ New menu item appears at the bottom
- ✅ Special highlighting is visible
- ✅ "Coming Soon" badge is displayed
- ✅ Item is non-clickable
- ✅ Animations are working

### 7. Future Activation

To make this item clickable in the future:

1. Create the Calculator and Marketplace page component
2. Add a route in the router configuration
3. Update the menu item in `Sidebar.jsx`:
   ```javascript
   { 
     id: 'calculator-marketplace', 
     label: 'Calculator and Marketplace', 
     icon: '🛒', 
     path: '/calculator-marketplace',  // Add path
     disabled: false,                   // Change to false
     comingSoon: false                  // Change to false
   }
   ```

### 8. Color Scheme

The new item uses an orange/amber color scheme to differentiate it:
- **Primary**: `#FFB84D` (Amber)
- **Secondary**: `#FF9A3D` (Orange)
- **Contrast**: Works well with the green theme of other items
- **Purpose**: Draws attention as a new/upcoming feature

---

**Status**: ✅ Complete and Live
**Date**: 2026-02-15
**Hot Reload**: Successful
