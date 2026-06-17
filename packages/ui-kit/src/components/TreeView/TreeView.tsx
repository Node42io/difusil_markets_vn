import { forwardRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { CaretDown, CaretRight } from "@phosphor-icons/react";
import { Badge } from "../Badge/Badge";
import { ProgressBox } from "../ProgressBox/ProgressBox";
import { Text } from "../Text/Text";
import styles from "./TreeView.module.css";

/** A labelled progress box shown under a node (rendered via `ProgressBox`). */
export interface TreeMetric {
  label: ReactNode;
  value: number;
}

export interface TreeNode {
  /** Stable id — drives selection and expand/collapse state. */
  id: string;
  /** Leading level badge (e.g. "L7"), rendered as a `color` Badge. */
  badge: ReactNode;
  /** Row title. */
  text: ReactNode;
  /** Optional progress boxes shown under the row title. */
  metrics?: TreeMetric[];
  /** Nested child nodes. */
  children?: TreeNode[];
}

export interface TreeViewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Root nodes. */
  nodes: TreeNode[];
  /** Optional heading above the tree (rendered as a `label-s`). */
  label?: string;
  /** Id of the currently selected node. */
  selectedId?: string;
  /** Called with the node when a row is clicked. */
  onSelect?: (node: TreeNode) => void;
  /** Ids expanded on first render (default: every root node). */
  defaultExpandedIds?: string[];
}

interface TreeItemProps {
  node: TreeNode;
  /** Nesting level — the root is 0. Drives the elbow + indentation. */
  depth: number;
  /**
   * Continuation flags for the gutter columns left of this node's elbow — one
   * per ancestor below the root. The root is excluded, so the leftmost line is
   * anchored to the edge and stays put as deeper levels open.
   */
  ancestorsLast: boolean[];
  isLast: boolean;
  selectedId?: string;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onSelect?: (node: TreeNode) => void;
}

function TreeItem({
  node,
  depth,
  ancestorsLast,
  isLast,
  selectedId,
  expanded,
  onToggle,
  onSelect,
}: TreeItemProps) {
  const selected = selectedId === node.id;
  const hasChildren = !!node.children?.length;
  const isOpen = expanded.has(node.id);
  const hasMetrics = !!node.metrics?.length;

  return (
    <>
      <div className={styles.row}>
        {/* Continuing vertical guides for each ancestor level. */}
        {ancestorsLast.map((last, i) => (
          <span key={i} className={styles.gutter}>
            {!last ? <span className={`${styles.guide} ${styles.guideFull}`} /> : null}
          </span>
        ))}
        {/* This node's elbow connector (every node except the root). */}
        {depth > 0 ? (
          <span className={styles.gutter}>
            <span
              className={`${styles.guide} ${isLast ? styles.guideLast : styles.guideFull}`}
            />
            <span className={styles.elbow} />
          </span>
        ) : null}
        <div
          className={[styles.body, hasMetrics ? styles.bodyBoxed : ""]
            .filter(Boolean)
            .join(" ")}
        >
          <button
            type="button"
            className={[styles.button, selected ? styles.buttonSelected : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              onSelect?.(node);
              if (hasChildren) onToggle(node.id);
            }}
          >
            {hasChildren ? (
              isOpen ? (
                <CaretDown size={14} weight="regular" className={styles.caret} />
              ) : (
                <CaretRight size={14} weight="regular" className={styles.caret} />
              )
            ) : (
              <span className={styles.caretSpacer} />
            )}
            <Badge variant="color" size="xs">
              {node.badge}
            </Badge>
            <span
              className={[styles.title, selected ? styles.titleSelected : ""]
                .filter(Boolean)
                .join(" ")}
            >
              {node.text}
            </span>
          </button>
          {/* Progress boxes for this node, under its title. */}
          {hasMetrics ? (
            <div className={styles.metrics}>
              {node.metrics!.map((m, i) => (
                <ProgressBox key={i} title={m.label} value={m.value} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {hasChildren && isOpen
        ? node.children!.map((child, i) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              ancestorsLast={depth === 0 ? [] : [...ancestorsLast, isLast]}
              isLast={i === node.children!.length - 1}
              selectedId={selectedId}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))
        : null}
    </>
  );
}

/**
 * A hierarchical tree: each node carries a level badge + title, expands to
 * reveal its children, optionally shows progress boxes under the title, and
 * draws left-edge connector lines (├─ / └─) so the hierarchy stays legible.
 * Expand/collapse is managed internally; selection is controlled by the parent
 * (`selectedId` + `onSelect`) so it can drive a detail panel.
 */
export const TreeView = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    { nodes, label, selectedId, onSelect, defaultExpandedIds, className, ...rest },
    ref,
  ) => {
    const [expanded, setExpanded] = useState<Set<string>>(
      () => new Set(defaultExpandedIds ?? nodes.map((n) => n.id)),
    );
    const toggle = (id: string) =>
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });

    const classes = [styles.tree, className ?? ""].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        {label ? (
          <Text variant="label-s" className={styles.label}>
            {label}
          </Text>
        ) : null}
        {nodes.map((node, i) => (
          <TreeItem
            key={node.id}
            node={node}
            depth={0}
            ancestorsLast={[]}
            isLast={i === nodes.length - 1}
            selectedId={selectedId}
            expanded={expanded}
            onToggle={toggle}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  },
);

TreeView.displayName = "TreeView";
