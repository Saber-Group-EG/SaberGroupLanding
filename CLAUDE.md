# Notes for Claude

## Project page layouts

- The project page is `src/pages/ProjectDetail.jsx`. Its current design is the **default layout**.
- Numbered layouts live in `src/components/projectLayouts/` and are registered in its `index.js`
  as `{ 1: Layout1, 2: Layout2, ... }`. A project uses one when its `internalLayout` (picked in
  the dashboard) matches; otherwise it gets the default.
- When the user approves a layout designed in chat, add it as `LayoutN.jsx` with the next free
  number, register it, and tell the user the number to pick in the dashboard. Never renumber or
  change an existing layout; projects already point at those numbers.
- Each layout receives `{ project, relatedProjects, isArabic, t }` and must support Arabic (RTL)
  and English.
