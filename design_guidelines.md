# Design Guidelines: REST API Mock Service

## Design Approach

**Selected Approach:** Design System - Developer Tool Pattern  
**Primary Reference:** Linear, GitHub, Postman  
**Justification:** Utility-focused application requiring efficiency, clarity, and data-dense displays for developer workflows.

## Core Design Principles

1. **Developer-First Experience:** Prioritize speed, clarity, and minimal cognitive load
2. **Information Density:** Maximize useful information while maintaining scanability
3. **Code-Centric Design:** Treat JSON/code as first-class content with appropriate presentation
4. **Immediate Feedback:** Clear visual states for validation, errors, and success

## Typography System

**Font Stack:**
- Primary: `'Inter', system-ui, sans-serif` (via Google Fonts CDN)
- Monospace: `'JetBrains Mono', 'Fira Code', monospace` (for JSON/code)

**Hierarchy:**
- Page titles: text-2xl, font-semibold
- Section headers: text-lg, font-medium
- Body text: text-sm
- Labels: text-xs, font-medium, uppercase tracking-wide
- Code/JSON: text-sm, monospace

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16  
**Container Strategy:**
- Main layout: Full viewport split-pane design
- Sidebar: Fixed width 280px (w-70) for endpoint list
- Main content: Flex-1 with max-w-5xl centered padding
- Forms: max-w-2xl for optimal readability

**Grid Structure:**
- Endpoint cards: Single column stack
- Form layouts: 2-column for path/method pickers (grid-cols-2 gap-4)
- Response preview: Full width with syntax highlighting

## Component Library

### Primary Navigation
- Fixed left sidebar with endpoint list
- Scrollable endpoint cards showing method badge + path
- "New Endpoint" button prominently placed at top
- Search/filter input above endpoint list

### Endpoint Configuration Form
**Layout:** Single column with logical grouping

**Sections:**
1. **Basic Config** - Method dropdown + Path input (grid-cols-3: method takes 1 col, path takes 2)
2. **Validation Schema** - Full-width code editor with JSON syntax highlighting
3. **Mock Response** - Full-width code editor with JSON syntax highlighting
4. **Actions** - Right-aligned button group (Save, Delete, Test)

### Data Display Components
- **Method Badges:** Small pills (px-2 py-1, text-xs, rounded-md) - GET, POST, PUT, DELETE
- **Endpoint Cards:** Hover-able items with method badge, path, and status indicator
- **Code Editors:** Using Monaco-like styling with line numbers, syntax highlighting via Prism.js or highlight.js (CDN)
- **Validation Status:** Inline icons (Heroicons via CDN) - CheckCircle for valid, ExclamationCircle for errors

### Form Elements
- **Inputs:** h-10, px-4, rounded-lg, border with focus ring
- **Dropdowns:** Same height as inputs, chevron-down icon
- **Textareas/Code Editors:** min-h-48, rounded-lg, border
- **Buttons:** 
  - Primary: px-4 py-2, rounded-lg, font-medium
  - Secondary: Same size, border variant
  - Danger: For delete actions

### State Indicators
- **Empty State:** Centered illustration (can use undraw.co illustrations) with "Create your first mock endpoint" message
- **Success Toast:** Top-right notification (fixed, top-4, right-4) with auto-dismiss
- **Error Display:** Inline below invalid fields with icon + message
- **Loading States:** Skeleton loaders for endpoint list, spinner for save actions

## Interaction Patterns

### Endpoint Management
- Click endpoint card → Load in main editor
- Highlight active endpoint in sidebar
- Auto-save draft state to prevent loss
- Confirmation modal for delete (simple centered modal with backdrop)

### JSON Editing
- Syntax highlighting with error indication
- Line numbers visible
- Auto-format button available
- Validate on blur or explicit "Validate" button
- Show validation errors inline with line references

### Testing Flow
- "Test Endpoint" button in action bar
- Opens test modal showing curl command and response preview
- Copy-to-clipboard button for curl command
- Actual response display with formatting

## Layout Specifications

### Overall Structure
```
┌─────────────┬──────────────────────────┐
│   Sidebar   │    Main Content Area     │
│  (280px)    │      (flex-1)            │
│             │                          │
│ [Search]    │  [Endpoint Config Form]  │
│             │                          │
│ [+ New]     │  Method | Path           │
│             │                          │
│ Endpoint 1  │  Validation Schema       │
│ Endpoint 2  │  [Code Editor]           │
│ Endpoint 3  │                          │
│             │  Mock Response           │
│             │  [Code Editor]           │
│             │                          │
│             │  [Save] [Delete] [Test]  │
└─────────────┴──────────────────────────┘
```

### Responsive Behavior
- Desktop (lg+): Side-by-side layout as shown
- Tablet/Mobile: Stack layout with hamburger menu for sidebar
- Sidebar slides over content on mobile, doesn't push

## Asset Requirements

**Icons:** Heroicons via CDN (outline style)
- Common icons: plus, pencil, trash, check-circle, exclamation-circle, clipboard, play

**Code Highlighting:** Prism.js via CDN for JSON syntax highlighting in code editors

**No Images Required:** This is a utility application without hero sections or marketing imagery

## Accessibility Standards

- All form inputs have associated labels (use label elements, not just placeholders)
- Focus management for modals (trap focus, restore on close)
- Keyboard shortcuts: Cmd/Ctrl+S to save, Escape to close modals
- ARIA labels for icon-only buttons
- Status announcements for screen readers on save/delete actions