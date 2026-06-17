import { useState } from "react";
import {
  Badge,
  Sources,
  Tab,
  Text,
  TreeView,
  WidgetCard,
  WidgetItemField,
} from "@node42/ui-kit";
import type { TreeNode } from "@node42/ui-kit";
import { ReportPage, Section } from "../ReportPage";
import report from "../data";
import type { Dimension, DimensionPrimary, L2Market } from "../report.d";

function ValueBadges({ values }: { values: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-100)" }}>
      {values.map((v) => (
        <Badge key={v} variant="neutral" size="sm">
          {v}
        </Badge>
      ))}
    </div>
  );
}

function SourceList({ sources }: { sources: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-100)" }}>
      {sources.map((src, i) => (
        <Sources key={src} index={i + 1} linkText={src} />
      ))}
    </div>
  );
}

function PrimaryCard({ label, dim }: { label: string; dim: DimensionPrimary }) {
  return (
    <WidgetCard title={label} description={dim.name} span={6}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-300)" }}>
        <ValueBadges values={dim.values} />
        <SourceList sources={dim.sources} />
      </div>
    </WidgetCard>
  );
}

function l2ToTree(l2: L2Market[]): TreeNode[] {
  return l2.map((m, i) => ({
    id: `l2-${i}`,
    badge: "L2",
    text: (
      <span>
        <strong>{m.name}</strong>
        <span style={{ color: "var(--text-body)" }}> — {m.cfj}</span>
      </span>
    ),
    children: m.l3.map((sub, j) => ({
      id: `l2-${i}-l3-${j}`,
      badge: "L3",
      text: sub,
    })),
  }));
}

export default function Dimensions() {
  const { dimension_markets } = report;
  const [selectedIdx, setSelectedIdx] = useState(0);
  const market = dimension_markets[selectedIdx];

  const demandDims = market.all_dimensions.filter((d: Dimension) => d.side === "demand");
  const supplyDims = market.all_dimensions.filter((d: Dimension) => d.side === "supply");

  const renderDims = (dims: Dimension[]) =>
    dims.map((d) => (
      <WidgetCard
        key={`${d.side}-${d.name}`}
        title={d.name}
        description={`${d.side} · ${d.role}`}
        span={6}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-300)" }}>
          <ValueBadges values={d.values} />
          <SourceList sources={d.sources} />
        </div>
      </WidgetCard>
    ));

  return (
    <ReportPage
      title="Dimensions"
      description="JTBD demand/supply dimensions and L2/L3 segmentation for the six leading markets"
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-100)" }}>
        {dimension_markets.map((m, i) => (
          <Tab key={m.naics} selected={i === selectedIdx} onClick={() => setSelectedIdx(i)}>
            #{m.rank} {m.title}
          </Tab>
        ))}
      </div>

      <Section label="Job and scope">
        <WidgetCard title={market.title} description={`NAICS ${market.naics}`} span={12}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-300)" }}>
            <WidgetItemField variant="long-title" label="Core job">
              {market.job}
            </WidgetItemField>
            <WidgetItemField variant="long-title" label="Activity scope">
              {market.activity_scope}
            </WidgetItemField>
          </div>
        </WidgetCard>
      </Section>

      <Section label="Demand and Supply">
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "var(--space-300)" }}
        >
          <PrimaryCard label="Demand primary" dim={market.demand_primary} />
          <PrimaryCard label="Supply primary" dim={market.supply_primary} />
        </div>
      </Section>

      <Section label="All dimensions">
        <Text variant="label-s">Demand side</Text>
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "var(--space-300)" }}
        >
          {renderDims(demandDims)}
        </div>
        <Text variant="label-s">Supply side</Text>
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "var(--space-300)" }}
        >
          {renderDims(supplyDims)}
        </div>
      </Section>

      <Section label="L2 L3 segments">
        <TreeView nodes={l2ToTree(market.l2_markets)} label="Segmentation" />
      </Section>
    </ReportPage>
  );
}
