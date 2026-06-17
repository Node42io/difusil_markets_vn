import { Badge, ConfidenceBadge, Divider, Text } from "@node42/ui-kit";
import type { BomUnit, Intersection, Pyramid, VnUnit } from "../report.d";
import type { TreeUnit } from "../lib/stage3";
import { fitBand } from "../lib/fit";
import RoleCard from "./RoleCard";

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--mono, ui-monospace, monospace)",
  fontSize: 11,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "var(--text-labels)",
};

// Green "connected product" band — one per matching diffusil intersection.
function ConnectedProduct({
  productName,
  x,
}: {
  productName: string;
  x: Intersection;
}) {
  const band = fitBand(x.fit);
  return (
    <div
      style={{
        border: "1px solid var(--border-success)",
        background: "var(--surface-default-success)",
        borderRadius: "var(--radius-sm)",
        padding: "var(--space-300)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-200)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-200)",
        }}
      >
        <span style={{ color: "var(--text-success)" }}>◈</span>
        <Text variant="b1" weight="medium" style={{ flex: 1 }}>
          {productName}
        </Text>
        <ConfidenceBadge
          value={band.pct}
          level={band.level}
          hideIcon
          label={`Fit (${x.fit})`}
        />
      </div>
      <Text variant="b3" style={{ color: "var(--text-labels)" }}>
        {band.pct}% — derived from fit ({x.fit})
      </Text>
      {x.role && (
        <div>
          <div style={LABEL_STYLE}>Role</div>
          <Text variant="b2" style={{ color: "var(--text-body)" }}>
            {x.role}
          </Text>
        </div>
      )}
      {x.where && (
        <div>
          <div style={LABEL_STYLE}>Where it sits</div>
          <Text variant="b2" style={{ color: "var(--text-body)" }}>
            {x.where}
          </Text>
        </div>
      )}
      {x.rationale && (
        <div>
          <div style={LABEL_STYLE}>Rationale</div>
          <Text variant="b2" style={{ color: "var(--text-body)" }}>
            {x.rationale}
          </Text>
        </div>
      )}
    </div>
  );
}

interface VnDetailProps {
  kind: "vn";
  node: TreeUnit<VnUnit>;
  productName: string;
  matches: Intersection[];
  // The pyramid is shown only when this node is the intersection unit.
  pyramid?: Pyramid;
  isPyramidUnit: boolean;
}

interface BomDetailProps {
  kind: "bom";
  node: TreeUnit<BomUnit>;
  productName: string;
  matches: Intersection[];
}

type UnitDetailProps = VnDetailProps | BomDetailProps;

export default function UnitDetail(props: UnitDetailProps) {
  const { node } = props;
  const chain = node.chain.map((c) => c.level).join(" › ");

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={LABEL_STYLE}>{chain}</div>
      <Text variant="page-chapter" style={{ marginTop: "var(--space-200)" }}>
        {node.name}
      </Text>
      <div style={{ marginTop: "var(--space-200)" }}>
        <Badge
          variant={props.kind === "vn" ? "information" : "neutral"}
          size="sm"
        >
          {node.level} unit
        </Badge>
      </div>

      <Divider style={{ margin: "var(--space-400) 0" }} />

      <div style={LABEL_STYLE}>
        {props.kind === "vn" ? "Core functional job" : "Function"}
      </div>
      <Text
        variant="b1"
        style={{ marginTop: "var(--space-200)", color: "var(--text-body)" }}
      >
        {props.kind === "vn"
          ? props.node.unit.cfj || "— not specified —"
          : props.node.unit.function || "— not specified —"}
      </Text>

      {props.matches.length > 0 && (
        <>
          <Divider style={{ margin: "var(--space-400) 0" }} />
          <div style={LABEL_STYLE}>
            Connected products ({props.matches.length})
          </div>
          <div
            style={{
              marginTop: "var(--space-200)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-300)",
            }}
          >
            {props.matches.map((x, i) => (
              <ConnectedProduct key={i} productName={props.productName} x={x} />
            ))}
          </div>
        </>
      )}

      {props.kind === "vn" && props.isPyramidUnit && props.pyramid && (
        <>
          <Divider style={{ margin: "var(--space-400) 0" }} />
          <div style={LABEL_STYLE}>
            Stakeholder roles ({props.pyramid.prototype_roles.length})
          </div>
          <div
            style={{
              marginTop: "var(--space-300)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-300)",
            }}
          >
            {props.pyramid.prototype_roles.map((r, i) => (
              <RoleCard key={i} role={r} />
            ))}
          </div>
        </>
      )}

      {props.kind === "bom" && (
        <Text
          variant="b3"
          style={{
            marginTop: "var(--space-400)",
            color: "var(--text-labels)",
          }}
        >
          Stakeholder roles are anchored to the value network — see the Value
          Network view for the pyramid on the intersection unit.
        </Text>
      )}
    </div>
  );
}
