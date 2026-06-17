// Shared slug helper so the sidebar sub-items and the page section headings
// derive the SAME anchor id from the same title text. Clicking a sub-item
// navigates to `<route>#<slug>` and the matching section scrolls into view.
//
// Strips a leading section number ("1. "), turns "&" into "and", and collapses
// everything else to dashes — e.g.:
//   "The Question"          -> "the-question"
//   "L2 / L3 segments"      -> "l2-l3-segments"
//   "Demand & Supply"       -> "demand-and-supply"
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/^\s*\d+\.\s*/, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
