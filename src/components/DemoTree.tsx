import { useMemo, useState } from "react";
import { Badge } from "@node42/ui-kit";
import type { TreeUnit } from "../lib/stage3";

// Re-skins the customer-demo's .tree/.trow rail onto kit design tokens. The kit
// TreeView lacks the right-side connected-product / stakeholder pins and the
// selected-band, so a custom rail is the correct choice here.

export interface DemoTreeRow<T> {
  node: TreeUnit<T>;
  // Connected-product hits on this row (drives the green "▣ N" pin).
  connectedCount: number;
  // True when this row is the pyramid's stakeholder-bearing unit ("◐").
  hasStakeholders: boolean;
  stakeholderCount: number;
}

interface DemoTreeProps<T extends { level: string; name: string }> {
  roots: TreeUnit<T>[];
  selectedId: string | null;
  onSelect: (node: TreeUnit<T>) => void;
  // Per-node decorations, keyed by node id.
  decorate: (node: TreeUnit<T>) => {
    connectedCount: number;
    hasStakeholders: boolean;
    stakeholderCount: number;
  };
  // Levels rendered with the "header" pin style (information badge).
  headerLevels: string[];
}

function flattenRoot<T>(n: TreeUnit<T>, acc: string[]) {
  acc.push(n.id);
  n.children.forEach((c) => flattenRoot(c, acc));
}

export default function DemoTree<T extends { level: string; name: string }>({
  roots,
  selectedId,
  onSelect,
  decorate,
  headerLevels,
}: DemoTreeProps<T>) {
  // Expand the first root (L7) and its subtree by default, like the demo.
  const defaultOpen = useMemo(() => {
    const ids = new Set<string>();
    if (roots[0]) {
      const acc: string[] = [];
      flattenRoot(roots[0], acc);
      acc.forEach((id) => ids.add(id));
    }
    return ids;
  }, [roots]);

  const [open, setOpen] = useState<Set<string>>(defaultOpen);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const renderRow = (node: TreeUnit<T>): React.ReactNode => {
    const isOpen = open.has(node.id);
    const hasChildren = node.children.length > 0;
    const selected = selectedId === node.id;
    const deco = decorate(node);
    const isHeader = headerLevels.includes(node.level);

    return (
      <div key={node.id}>
        <div
          onClick={() => onSelect(node)}
          style={{
            display: "flex",
            alignItems: "center",
            minHeight: 46,
            borderBottom: "1px solid var(--border-default-default)",
            cursor: "pointer",
            paddingRight: "var(--space-200)",
            background: selected
              ? "var(--surface-default-information)"
              : "transparent",
          }}
        >
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) toggle(node.id);
            }}
            style={{
              width: 22,
              flex: "0 0 22px",
              textAlign: "center",
              color: "var(--text-labels)",
              userSelect: "none",
            }}
          >
            {hasChildren ? (isOpen ? "▾" : "▸") : ""}
          </span>
          <span
            style={{ width: node.depth * 15, flex: `0 0 ${node.depth * 15}px` }}
          />
          <Badge variant={isHeader ? "information" : "color"} size="xs">
            {node.level}
          </Badge>
          <span
            style={{
              flex: 1,
              padding: "0 var(--space-200)",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: 14,
            }}
            title={node.name}
          >
            {node.name}
          </span>
          <span style={{ display: "flex", gap: "var(--space-100)" }}>
            {deco.connectedCount > 0 && (
              <Badge variant="success" size="xs">
                ▣ {deco.connectedCount}
              </Badge>
            )}
            {deco.hasStakeholders && (
              <Badge variant="warning" size="xs">
                ◐ {deco.stakeholderCount}
              </Badge>
            )}
          </span>
        </div>
        {hasChildren && isOpen && (
          <div>{node.children.map((c) => renderRow(c))}</div>
        )}
      </div>
    );
  };

  return (
    <div style={{ overflow: "auto", maxHeight: 600 }}>
      {roots.map((r) => renderRow(r))}
    </div>
  );
}
