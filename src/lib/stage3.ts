import report from "../data";
import type {
  BomUnit,
  Intersection,
  Stage3Segment,
  VnUnit,
} from "../report.d";

// ---------------------------------------------------------------------------
// NAICS matching
// ---------------------------------------------------------------------------
// stage3 naics keys are inconsistent ("333242" vs "333314 — Optical Instrument
// and Lens Manufacturing"), so we always match on the leading 6-digit prefix.

export function naicsCode(raw: string): string {
  const m = (raw || "").match(/\d{4,6}/);
  return m ? m[0] : (raw || "").trim();
}

export function findStage3(naics: string): Stage3Segment | undefined {
  const want = naicsCode(naics);
  return (report.stage3 as Stage3Segment[]).find(
    (s) => naicsCode(s.naics) === want,
  );
}

// ---------------------------------------------------------------------------
// Flat-unit → nested tree
// ---------------------------------------------------------------------------
// vn_units / bom_units are FLAT with NO parent field. We rebuild the hierarchy
// by level nesting via a stack: each unit becomes a child of the most recent
// preceding unit one level up. `depth` drives indentation in the rail.

export interface TreeUnit<T> {
  id: string;
  unit: T;
  level: string;
  name: string;
  depth: number;
  children: TreeUnit<T>[];
  // Full parent chain (root → this), used to rebuild the breadcrumb.
  chain: TreeUnit<T>[];
}

const VN_ORDER = ["L7", "L6", "L6a", "L5", "L4", "L3"];
const BOM_ORDER = ["L0", "L1", "L2", "L3", "L4", "L5"];

function rank(level: string, order: string[]): number {
  const i = order.indexOf(level);
  return i === -1 ? order.length : i;
}

function buildTree<T extends { level: string; name: string }>(
  units: T[],
  order: string[],
  idPrefix: string,
): { roots: TreeUnit<T>[]; flat: TreeUnit<T>[] } {
  const roots: TreeUnit<T>[] = [];
  const flat: TreeUnit<T>[] = [];
  // Stack of currently-open ancestors, shallowest first.
  const stack: TreeUnit<T>[] = [];

  units.forEach((u, i) => {
    const r = rank(u.level, order);
    // Pop ancestors that are at the same or deeper level than this unit.
    while (stack.length && rank(stack[stack.length - 1].level, order) >= r) {
      stack.pop();
    }
    const parent = stack[stack.length - 1];
    const node: TreeUnit<T> = {
      id: `${idPrefix}-${i}`,
      unit: u,
      level: u.level,
      name: u.name,
      depth: stack.length,
      children: [],
      chain: [...stack],
    };
    node.chain = [...stack, node];
    if (parent) parent.children.push(node);
    else roots.push(node);
    stack.push(node);
    flat.push(node);
  });

  return { roots, flat };
}

export function buildVnTree(units: VnUnit[]) {
  return buildTree(units, VN_ORDER, "vn");
}

export function buildBomTree(units: BomUnit[]) {
  return buildTree(units, BOM_ORDER, "bom");
}

// ---------------------------------------------------------------------------
// Intersection matching
// ---------------------------------------------------------------------------
// An intersection.unit embeds BOTH the VN and BOM names (e.g.
// "Diffuse-reflectance reference element (BOM L1) / Reference-diffuser ... (VN L5)").
// A tree row is "connected" when its normalised name is a substring of the
// intersection's unit string.

function norm(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[()]/g, "")
    .trim();
}

// Stop-words + structural tokens (levels, generic nouns) that carry no
// discriminating signal when overlap-matching a unit name to an intersection.
const STOP = new Set([
  "the", "and", "of", "to", "for", "in", "on", "with", "its", "an", "that",
  "which", "vn", "bom", "l0", "l1", "l2", "l3", "l4", "l5", "l6", "l7", "l6a",
  "element", "assembly", "unit", "optics", "system", "station", "module",
  "channel", "cell", "subassembly", "build", "subsystem",
]);

function tokens(s: string): string[] {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

function overlap(a: string, b: string): number {
  const A = new Set(tokens(a));
  const B = new Set(tokens(b));
  let n = 0;
  for (const t of A) if (B.has(t)) n++;
  return n;
}

// The intersection.unit strings reference a finer decomposition than the 16
// generated vn_units, so an exact substring rarely matches. We connect a tree
// row to an intersection when either (a) the row name is a substring of the
// intersection's unit, or (b) the two share enough distinctive tokens.
const OVERLAP_MIN = 2;

function rowMatchesUnit(name: string, unitStr: string): boolean {
  const n = norm(name);
  if (!n) return false;
  if (norm(unitStr).includes(n)) return true;
  return overlap(name, unitStr) >= OVERLAP_MIN;
}

export function intersectionsForName(
  name: string,
  intersections: Intersection[],
): Intersection[] {
  if (!norm(name)) return [];
  return intersections.filter((x) => rowMatchesUnit(name, x.unit));
}

// The pyramid's stakeholder-bearing VN row: the single tree node that best
// matches the pyramid.intersection_unit string (exact substring wins; otherwise
// the highest token overlap above the threshold). Computed once per tree.
export function pyramidUnitId(
  flat: { id: string; name: string }[],
  pyramidUnit: string,
): string | null {
  if (!pyramidUnit) return null;
  // Exact substring first.
  const exact = flat.find((n) => norm(n.name) && norm(pyramidUnit).includes(norm(n.name)));
  if (exact) return exact.id;
  // Else best token overlap.
  let best: string | null = null;
  let bestScore = OVERLAP_MIN - 1;
  for (const n of flat) {
    const s = overlap(n.name, pyramidUnit);
    if (s > bestScore) {
      bestScore = s;
      best = n.id;
    }
  }
  return best;
}
