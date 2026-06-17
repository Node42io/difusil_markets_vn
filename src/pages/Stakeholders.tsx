import { useState } from "react";
import {
  Badge,
  ConfidenceBadge,
  Table,
  Tab,
  Text,
  TreeView,
  WidgetCard,
  WidgetItemField,
} from "@node42/ui-kit";
import type { ConfidenceLevel, TreeNode } from "@node42/ui-kit";
import { ReportPage, Section } from "../ReportPage";
import report from "../data";
import type { BomUnit, Intersection, VnUnit } from "../report.d";

const FIT_LEVEL: Record<string, ConfidenceLevel> = {
  direct: "high",
  adjacent: "medium",
  stretch: "low",
};

function vnUnitsToTree(units: VnUnit[]): TreeNode[] {
  return units.map((u, i) => ({
    id: `vn-${i}`,
    badge: u.level,
    text: (
      <span>
        <strong>{u.name}</strong>
        <span style={{ color: "var(--text-body)" }}> — {u.cfj}</span>
      </span>
    ),
  }));
}

function bomUnitsToTree(units: BomUnit[]): TreeNode[] {
  return units.map((u, i) => ({
    id: `bom-${i}`,
    badge: u.level,
    text: (
      <span>
        <strong>{u.name}</strong>
        <span style={{ color: "var(--text-body)" }}> — {u.function}</span>
      </span>
    ),
  }));
}

function IntersectionCard({ x }: { x: Intersection }) {
  const level = FIT_LEVEL[x.fit] ?? "medium";
  const confValue = level === "high" ? 90 : level === "medium" ? 65 : 30;
  return (
    <WidgetCard title={x.path === "bom" ? "BOM intersection" : "Process-VN intersection"} span={4}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-300)" }}>
        <Text variant="b1" weight="medium">
          {x.unit}
        </Text>
        <div style={{ display: "flex", gap: "var(--space-200)", flexWrap: "wrap" }}>
          <Badge variant={x.path === "bom" ? "primary" : "information"} size="sm">
            {x.path}
          </Badge>
          <ConfidenceBadge value={confValue} level={level} label={`Fit (${x.fit})`} />
        </div>
        <WidgetItemField variant="vertical" label="Role">
          {x.role}
        </WidgetItemField>
        <WidgetItemField variant="vertical" label="Where">
          {x.where}
        </WidgetItemField>
        <WidgetItemField variant="vertical" label="Rationale">
          {x.rationale}
        </WidgetItemField>
      </div>
    </WidgetCard>
  );
}

export default function Stakeholders() {
  const { stage3 } = report;
  const [selectedIdx, setSelectedIdx] = useState(0);
  const seg = stage3[selectedIdx];

  return (
    <ReportPage
      title="Stakeholders"
      description="Stage 3 — value-network anchors, BOM anchors, diffusil intersection units, and stakeholder roles"
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-100)" }}>
        {stage3.map((s, i) => (
          <Tab key={s.segment_id} selected={i === selectedIdx} onClick={() => setSelectedIdx(i)}>
            {s.naics.split(" ")[0]} · {s.l2}
          </Tab>
        ))}
      </div>

      <Section label="Anchors">
        <WidgetCard title={`Segment ${seg.segment_id}`} description={seg.l2} span={12}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-300)" }}>
            <WidgetItemField variant="vertical" label="VN anchor">
              {seg.vn_anchor}
            </WidgetItemField>
            <WidgetItemField variant="vertical" label="VN core functional job">
              {seg.vn_cfj}
            </WidgetItemField>
            <WidgetItemField variant="vertical" label="BOM anchor">
              {seg.bom_anchor}
            </WidgetItemField>
          </div>
        </WidgetCard>
      </Section>

      <Section label="Intersection units">
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "var(--space-300)" }}
        >
          {seg.intersections.map((x) => (
            <IntersectionCard key={x.unit} x={x} />
          ))}
        </div>
      </Section>

      <Section label="Unit trees">
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "var(--space-300)" }}
        >
          <div style={{ gridColumn: "span 6" }}>
            <TreeView nodes={vnUnitsToTree(seg.vn_units)} label="Process-VN units" />
          </div>
          <div style={{ gridColumn: "span 6" }}>
            <TreeView nodes={bomUnitsToTree(seg.bom_units)} label="BOM units" />
          </div>
        </div>
      </Section>

      <Section label="Stakeholder roles">
        <Table striped="rows">
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>ESCO occupation</Table.HeaderCell>
              <Table.HeaderCell>Unit</Table.HeaderCell>
              <Table.HeaderCell>Decides</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {seg.stakeholders.map((s) => (
              <Table.Row key={s.role}>
                <Table.Cell>{s.role}</Table.Cell>
                <Table.Cell>{s.esco}</Table.Cell>
                <Table.Cell>{s.unit}</Table.Cell>
                <Table.Cell>{s.decides}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Section>
    </ReportPage>
  );
}
