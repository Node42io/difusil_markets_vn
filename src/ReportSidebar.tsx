import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookOpenText,
  ChartBar,
  Cube,
  GitBranch,
  Info,
  SquaresFour,
  Storefront,
  Users,
} from "@phosphor-icons/react";
import { SidebarItem, SidebarSubItem } from "@node42/ui-kit";
import type { ReactNode } from "react";
import { slugify } from "./sections";

// Sub-section navigation per page. The label text must slugify to the same id
// as the matching page `<h2>` (Text variant="page-chapter").
const subSections: Record<string, string[]> = {
  "/": ["The Question", "Methodology", "Discovery split", "Top markets"],
  "/product": ["Identity", "Functional Promise", "Features", "Specifications", "Constraints"],
  "/universe": ["Two-path concept", "Ranked universe", "Smartphone call-out"],
  "/ranking": ["Composite explainer", "Per-market scorecard", "Smartphone vs leader"],
  "/dimensions": ["Job and scope", "Demand and Supply", "All dimensions", "L2 L3 segments"],
  "/stakeholders": ["Anchors", "Intersection units", "Unit trees", "Stakeholder roles"],
  "/glossary": ["Terms"],
  "/about": ["Methodology recap", "Provenance"],
};

interface NavEntry {
  path: string;
  label: string;
  icon: ReactNode;
}

const nav: NavEntry[] = [
  { path: "/", label: "Overview", icon: <SquaresFour size={16} weight="regular" /> },
  { path: "/product", label: "Product", icon: <Cube size={16} weight="regular" /> },
  { path: "/universe", label: "Market Universe", icon: <Storefront size={16} weight="regular" /> },
  { path: "/ranking", label: "Ranking Detail", icon: <ChartBar size={16} weight="regular" /> },
  { path: "/dimensions", label: "Dimensions", icon: <GitBranch size={16} weight="regular" /> },
  { path: "/stakeholders", label: "Stakeholders", icon: <Users size={16} weight="regular" /> },
  { path: "/glossary", label: "Glossary", icon: <BookOpenText size={16} weight="regular" /> },
  { path: "/about", label: "About", icon: <Info size={16} weight="regular" /> },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Shared report navigation. Route-aware: the active item is derived from the
// current URL, and clicking a top-level item navigates to its page. Clicking a
// sub-item jumps to the matching section (anchored by slug), loading the right
// page first when needed.
export function ReportSidebar() {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  const activeId = hash ? decodeURIComponent(hash.slice(1)) : "";

  // After a cross-page jump, the target section only exists once the new page
  // has mounted. Scroll on the next frame whenever route + hash settle.
  useEffect(() => {
    if (!activeId) return;
    const raf = requestAnimationFrame(() => scrollToId(activeId));
    return () => cancelAnimationFrame(raf);
  }, [pathname, activeId]);

  const goToSection = (path: string, id: string) => {
    if (pathname === path) {
      scrollToId(id);
      window.history.replaceState(window.history.state, "", `${path}#${id}`);
    } else {
      navigate(`${path}#${id}`);
    }
  };

  const renderSubItems = (path: string) =>
    (subSections[path] ?? []).map((label) => {
      const id = slugify(label);
      return (
        <SidebarSubItem
          key={id}
          selected={pathname === path && activeId === id}
          onClick={() => goToSection(path, id)}
        >
          {label}
        </SidebarSubItem>
      );
    });

  return (
    <>
      {nav.map((entry) => (
        <SidebarItem
          key={entry.path}
          label={entry.label}
          icon={entry.icon}
          selected={pathname === entry.path}
          defaultOpen={pathname === entry.path}
          onClick={() => navigate(entry.path)}
        >
          {(subSections[entry.path]?.length ?? 0) > 0 ? renderSubItems(entry.path) : undefined}
        </SidebarItem>
      ))}
    </>
  );
}

export default ReportSidebar;
