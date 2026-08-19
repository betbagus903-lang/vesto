# Vesto Buyer Dashboard - Figma Style Guide

## Overview
This style guide provides specifications for recreating the Vesto Buyer Dashboard design in Figma. The design follows a minimalist approach with a Dark Navy and Blue Accent theme.

---

## Color Palette

### Primary Colors
- **Background Dark**: `#0f172a` (Slate 900)
- **Background Card**: `#1e293b` (Slate 800)
- **Background Input**: `#0a1628` (Slate 950)
- **Border**: `#2d4a6f` → Simplified to `#374151` (Gray 700) for minimal design
- **Border Light**: `gray-700` → `#374151`

### Accent Colors
- **Primary Blue**: `#3b82f6` (Blue 500)
- **Primary Blue Hover**: `#2563eb` (Blue 600)
- **Primary Blue Light**: `#60a5fa` (Blue 400)

### Status Colors
- **Success**: `#22c55e` (Green 500)
- **Warning**: `#eab308` (Yellow 500)
- **Error**: `#ef4444` (Red 500)
- **Info**: `#a855f7` (Purple 500)

### Text Colors
- **Primary Text**: `#ffffff` (White)
- **Secondary Text**: `#9ca3af` (Gray 400)
- **Tertiary Text**: `#6b7280` (Gray 500)
- **Disabled Text**: `#4b5563` (Gray 600)

---

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: System sans-serif

### Font Sizes
- **XL Heading**: 20px / 1.25rem (text-xl)
- **LG Heading**: 18px / 1.125rem (text-lg)
- **MD Heading**: 16px / 1rem (text-base)
- **SM Heading**: 14px / 0.875rem (text-sm)
- **XS Text**: 12px / 0.75rem (text-xs)

### Font Weights
- **Bold**: 600 (font-semibold)
- **Medium**: 500 (font-medium)
- **Regular**: 400 (font-normal)

### Line Heights
- **Tight**: 1.25
- **Normal**: 1.5
- **Relaxed**: 1.75

---

## Spacing System

### Base Unit: 4px
- **XS**: 4px (1)
- **SM**: 8px (2)
- **MD**: 12px (3)
- **LG**: 16px (4)
- **XL**: 24px (6)
- **2XL**: 32px (8)
- **3XL**: 48px (12)

### Component Spacing
- **Card Padding**: 16px (p-4)
- **Section Margin**: 24px (mb-6)
- **Element Gap**: 12px (gap-3)
- **Input Padding**: 8px vertical, 12px horizontal (px-3 py-2)

---

## Border Radius

### Rounded Corners
- **Small**: 4px (rounded)
- **Medium**: 8px (rounded-lg)
- **Large**: 12px (rounded-xl)
- **Extra Large**: 16px (rounded-2xl)

---

## Component Specifications

### 1. Sidebar (AccountSidebar)

**Dimensions:**
- Width: 288px (72 * 4px)
- Height: 100vh

**Structure:**
```
┌─────────────────────────┐
│ Logo Area (64px height) │
├─────────────────────────┤
│ User Info (80px)        │
├─────────────────────────┤
│ Navigation Menu         │
│ - Dashboard (active)    │
│ - Orders                │
│ - Wishlist              │
│ - Addresses             │
│ - Payment Methods       │
│ - Coupons               │
│ - Notifications         │
│ - Reviews               │
│ - Profile               │
│ - Security              │
│ - Settings              │
├─────────────────────────┤
│ Logout (48px)           │
└─────────────────────────┘
```

**Menu Item:**
- Height: 48px
- Padding: 12px 16px
- Icon: 20px × 20px
- Text: 14px, font-medium
- Active state: Blue background, white text
- Hover state: Gray background

**User Info:**
- Avatar: 40px × 40px circle
- Name: 14px, font-semibold, white
- Email: 12px, gray-400

---

### 2. Dashboard Page

**Layout:**
- Main Content: 100vh - 288px sidebar
- Padding: 24px (px-6 py-6)

**Welcome Section:**
- Height: Auto
- Title: 20px, font-semibold, white
- Margin bottom: 24px

**Stats Cards:**
- Grid: 3 columns
- Card size: Auto height, equal width
- Padding: 16px
- Background: #1e293b
- Border: 1px solid #374151
- Border radius: 8px
- Number: 20px, font-semibold, white
- Label: 12px, gray-400

**Recent Orders:**
- Card: Background #1e293b, padding 16px, border radius 8px
- Header: 14px, font-medium, white
- Order Item: Background #0f172a, padding 12px, border radius 8px
- Order ID: 14px, white
- Order Date: 12px, gray-500
- Order Total: 14px, white
- Status Badge: 12px, text-only (no background)

---

### 3. Profile Page

**Profile Completion Card:**
- Width: 100%
- Height: Auto
- Background: #1e293b
- Padding: 16px
- Border radius: 8px
- Progress bar: Height 6px, background #0f172a, fill white

**Profile Form:**
- Grid: 2 columns
- Input fields: 12px labels, 14px text, 8px padding
- Photo upload: 64px × 64px circle

---

### 4. Addresses Page

**Address Card:**
- Width: 50% (2-column grid)
- Height: Auto
- Background: #1e293b
- Padding: 16px
- Border radius: 8px
- Default badge: 12px, background #374151, text gray-300

**Add Address Form:**
- Same as Profile form
- Button: 12px, white background, black text

---

### 5. Payment Methods Page

**Payment Method Card:**
- Width: 100%
- Height: 56px
- Background: #1e293b
- Padding: 16px
- Border radius: 8px
- Icon: 40px × 40px square
- Default badge: 12px, background #374151

---

### 6. My Orders Page

**Order Card:**
- Width: 100%
- Height: Auto
- Background: #1e293b
- Padding: 16px
- Border radius: 8px

**Order Item:**
- Image: 48px × 48px square
- Product name: 14px, white
- Variant: 12px, gray-500
- Price: 14px, white

---

### 7. Welcome Dialog

**Dialog:**
- Width: 400px (max)
- Height: Auto
- Background: #1e293b
- Padding: 24px
- Border radius: 12px
- Overlay: Black 50% opacity

**Content:**
- Icon: 64px × 64px circle, blue background
- Title: 20px, font-bold, white
- Description: 14px, gray-400
- Buttons: 12px, medium font weight

---

### 8. Profile Completion Banner

**Banner:**
- Width: 100%
- Height: 64px
- Background: Blue 10% (#3b82f6/10)
- Border: 1px solid Blue 30% (#3b82f6/30)
- Padding: 16px
- Border radius: 8px

**Content:**
- Icon: 40px × 40px square
- Title: 14px, font-semibold, white
- Description: 12px, gray-400
- Buttons: 12px, medium font weight

---

### 9. Checkout Page

**Address Selection:**
- Saved address cards: 2-column grid
- Each card: 12px padding, border 2px
- Selected: Black border, gray background
- Unselected: Gray border, hover state

**Form Fields:**
- Same styling as Profile page
- Labels: 12px, font-semibold
- Inputs: 14px text, 8px padding

---

## Icon Specifications

### Icon Sizes
- **Small**: 16px × 16px (w-4 h-4)
- **Medium**: 20px × 20px (w-5 h-5)
- **Large**: 24px × 24px (w-6 h-6)

### Icon Colors
- **Primary**: #3b82f6 (Blue)
- **Secondary**: #9ca3af (Gray 400)
- **Hover**: #ffffff (White)
- **Active**: #ffffff (White)

---

## Button Specifications

### Primary Button
- Background: #3b82f6
- Text: White
- Padding: 8px 16px (px-4 py-2)
- Border radius: 8px
- Font size: 12px
- Font weight: 500
- Hover: #2563eb

### Secondary Button
- Background: #374151
- Text: White
- Padding: 8px 16px
- Border radius: 8px
- Font size: 12px
- Font weight: 500
- Hover: #4b5563

### Tertiary Button (White)
- Background: White
- Text: Black
- Padding: 8px 16px
- Border radius: 8px
- Font size: 12px
- Font weight: 500
- Hover: #e5e7eb

---

## Input Field Specifications

### Text Input
- Background: #0f172a
- Border: 1px solid #374151
- Padding: 8px 12px (px-3 py-2)
- Border radius: 8px
- Font size: 14px
- Text color: White
- Placeholder: Gray-400
- Focus border: #4b5563

### Select Dropdown
- Same as text input
- Background: White for dropdown options

---

## Layout Guidelines

### Container Widths
- **Full Width**: 100%
- **Sidebar**: 288px fixed
- **Main Content**: calc(100% - 288px)
- **Max Content**: 1200px (optional)

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## Shadow Effects

### Card Shadow
- None (flat design for minimalism)

### Dialog Shadow
- Optional: 0 25px 50px -12px rgba(0, 0, 0, 0.25)

---

## Animation Specifications

### Transitions
- **Duration**: 150ms
- **Easing**: ease-in-out
- **Properties**: color, background-color, border-color

### Hover States
- **Buttons**: Background color change
- **Links**: Color change
- **Cards**: Border color change

---

## Figma Component Structure

### Recommended Auto Layout
1. **Sidebar Component**
   - Auto Layout: Vertical, 0 gap
   - Logo section: Fixed height
   - Menu section: Auto height
   - Logout section: Fixed height

2. **Card Component**
   - Auto Layout: Vertical, 16px gap
   - Header section: Auto height
   - Content section: Auto height
   - Footer section: Auto height (if needed)

3. **Form Component**
   - Auto Layout: Vertical, 16px gap
   - Grid: 2 columns, 16px gap
   - Input fields: Auto height

### Variants
- **Sidebar**: Collapsed/Expanded
- **Card**: With/Without header
- **Button**: Primary/Secondary/Tertiary
- **Input**: Text/Select/Textarea
- **Status Badge**: Success/Warning/Error/Info

---

## Export Settings

### Image Export
- **Format**: PNG
- **Scale**: 2x (Retina)
- **Compression**: 75%

### Icon Export
- **Format**: SVG
- **Stroke**: 1.5px
- **Color**: Current color

---

## Notes for Figma Implementation

1. **Use Auto Layout** for all components to ensure consistency
2. **Create Component Variants** for different states (hover, active, disabled)
3. **Use Variables** for colors and spacing to maintain consistency
4. **Set up Design Tokens** for typography and spacing
5. **Create Styles** for text and colors to ensure reusability
6. **Use Constraints** to ensure responsive behavior
7. **Prototype Interactions** for hover states and button clicks

---

## Page-by-Page Layout Reference

### Dashboard
- Sidebar (288px) + Main Content (Auto)
- Main Content: Welcome + Stats (3 cols) + Recent Orders

### Profile
- Sidebar + Main Content
- Main Content: Profile Completion + Form (2 cols)

### Addresses
- Sidebar + Main Content
- Main Content: Add Button + Address Grid (2 cols)

### Payment Methods
- Sidebar + Main Content
- Main Content: Add Button + Payment List (vertical)

### My Orders
- Sidebar + Main Content
- Main Content: Order List (vertical)

---

This style guide provides all the specifications needed to recreate the Vesto Buyer Dashboard design in Figma. Use these values as exact measurements for your Figma components.
