// Project page layouts, keyed by the project's internalLayout number (set in the dashboard).
// The page in pages/ProjectDetail.jsx is the default layout and is used when a project has
// no number or a number that isn't registered here. Add new layouts as the next number.
const layouts = {
  // 1: Layout1,
};

export const getProjectLayout = (number) => layouts[number] || null;

export default layouts;
