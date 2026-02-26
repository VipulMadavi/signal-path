# Design System Document
## SignalPath — Premium Venture Intelligence Interface

---

# 1. Design Philosophy

SignalPath is designed as a high-signal, premium intelligence tool. The UI must feel:

- Professional
- Data-dense but readable
- Fast and responsive
- Dark-first and modern
- Subtly animated
- Clean and consistent

The design should communicate:
Precision. Intelligence. Control.

The interface is inspired by modern venture platforms, trading dashboards, and AI-native SaaS tools.

---

# 2. Design Principles

1. Intelligence First  
   Data hierarchy must be clear and structured.

2. Dark Premium Aesthetic  
   Use depth and contrast to highlight signal over noise.

3. Explainability Through UI  
   Scores and insights must visually communicate reasoning.

4. Workflow-Centric  
   Layouts should guide user from discovery → enrichment → action.

5. Minimal Visual Noise  
   Avoid unnecessary gradients, shadows, and clutter.

6. Subtle Motion  
   Animation supports clarity, never distraction.

---

# 3. Color System

## 3.1 Core Background Palette

Primary Background:
#0B0F14

Secondary Surface:
#111827

Card Surface:
#0F172A

Border:
rgba(255, 255, 255, 0.06)

---

## 3.2 Accent Colors

Primary Accent (Teal):
#00E6A8

Secondary Accent (Purple):
#8B5CF6

Blue Accent:
#3B82F6

Warning:
#F59E0B

Error:
#EF4444

Success:
#10B981

Muted Text:
#6B7280

Primary Text:
#E5E7EB

---

# 4. Typography System

Font Family:
Inter or Geist

Font Weight Usage:
- Headings: 600
- Subheadings: 500
- Body: 400
- Metadata: 400 uppercase small

---

## 4.1 Type Scale

H1: 32px / 36px line-height  
H2: 24px / 28px  
H3: 18px / 24px  
Body Large: 16px  
Body: 14px  
Meta: 12px uppercase  

Letter spacing:
- Slight increase for metadata
- Default for body

---

# 5. Layout System

---

## 5.1 App Shell Layout

Left Sidebar:
- Fixed width (240px)
- Dark background
- Section dividers
- Active nav highlight

Top Bar:
- Global search input
- Notification icon
- Workspace switcher
- User avatar

Content Area:
- Max width 1280px
- Padding 24px–32px
- Grid-based sections

---

## 5.2 Grid System

- 12-column grid
- Profile layout:
  - Main content: 8 columns
  - Sidebar panel: 4 columns
- Lists page:
  - 3-column card layout
- Companies table:
  - Full width

---

# 6. Component System

---

## 6.1 Buttons

Primary Button:
- Background: #00E6A8
- Text: #0B0F14
- Rounded-lg
- Hover: slight glow

Secondary Button:
- Border: rgba white 10%
- Transparent background
- Hover: subtle fill

Ghost Button:
- No border
- Text accent
- Underline or soft glow on hover

Danger Button:
- Red accent
- Used for delete only

---

## 6.2 Cards

Card Style:
- Background: #0F172A
- Border: rgba white 5%
- Rounded-xl
- Padding 20–24px
- Slight shadow

Card Variants:
- Signal Card
- Score Card
- Enrichment Card
- List Card

---

## 6.3 Table Design

Table Headers:
- Uppercase
- Muted text
- Slight spacing

Rows:
- Hover highlight
- Subtle divider
- Score badge aligned right

Score Badge:
- Circular ring
- Accent color fill
- Numeric center

Stage Badge:
- Pill shape
- Color-coded
- Small uppercase

Signal Badge:
- Icon + colored label

---

## 6.4 Sidebar Navigation

Active state:
- Accent border left
- Slight background highlight

Sections:
- Primary navigation
- Reports section
- Settings section

Icons:
- Outline icons
- Minimal style

---

## 6.5 Timeline Component

Used in profile page.

Structure:
- Vertical line
- Dot markers
- Colored based on signal type
- Date aligned right
- Signal category label
- Description text

Signal Types:
- Product Launch (blue)
- Hiring (teal)
- Funding (purple)
- Patent (yellow)
- Press (green)

---

## 6.6 Score Breakdown Bars

Horizontal progress bars.

Each row:
- Label
- Numeric value
- Colored bar
- Updated indicator

Bar Colors:
- Signal Strength: teal
- Market Timing: blue
- Thesis Fit: purple
- Team: yellow

---

## 6.7 Enrichment Section

States:

Idle:
- Large CTA button
- Subtle explanation

Loading:
- Skeleton shimmer
- Spinner
- “Analyzing…”

Success:
- AI Summary card
- What They Do list
- Keywords chips
- Derived Signals list
- Sources with timestamp

Error:
- Warning card
- Retry button

---

# 7. Motion System

Duration:
150–250ms ease-in-out

Animations:
- Button hover glow
- Row hover fade
- Page transitions (fade)
- Skeleton shimmer
- Toast slide-in

Avoid:
- Overly complex animations
- Parallax effects
- Distracting motion

---

# 8. Spacing System

Base spacing unit: 4px

Common spacing:
- Section gap: 32px
- Card padding: 24px
- Row spacing: 16px
- Inline gap: 8px

---

# 9. Iconography

Use:
- Lucide icons
- Minimal outline style
- Consistent size (16px–20px)

Icons used:
- Search
- Plus
- Bookmark
- Filter
- Refresh
- Alert
- Check
- Download
- Settings

---

# 10. UI States

Each interactive component must support:

- Default
- Hover
- Active
- Disabled
- Loading
- Error

All states must be visually distinct.

---

# 11. Accessibility

- Minimum contrast ratio 4.5:1
- Focus states visible
- Keyboard navigation supported
- Buttons accessible via Enter/Space
- ARIA labels for icons

---

# 12. Responsive Design

Breakpoints:

Desktop: ≥ 1280px  
Tablet: 768px–1279px  
Mobile: ≤ 767px  

Behavior:

- Sidebar collapses on mobile
- Table becomes scrollable
- Cards stack vertically
- Timeline compresses

---

# 13. Design Consistency Rules

- Never mix rounded sizes inconsistently
- Never use multiple accent colors in same component
- Maintain consistent badge styles
- Avoid gradients unless subtle
- Maintain spacing rhythm across pages

---

# 14. Visual Tone Summary

SignalPath should feel like:

- A Bloomberg terminal for startups
- An AI-native intelligence engine
- A serious internal VC tool
- High precision, low noise

---