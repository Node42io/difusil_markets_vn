import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  ConfidenceBadge,
  InfoCard,
  Table,
  Text,
  Toggle,
} from "@node42/ui-kit";
import { AppShell } from "../AppShell";
import report from "../data";
import DemoTree from "../components/DemoTree";
import UnitDetail from "../components/UnitDetail";
import MarketDimensions from "../components/MarketDimensions";
import {
  buildBomTree,
  buildVnTree,
  findStage3,
  intersectionsForName,
  naicsCode,
  pyramidUnitId,
} from "../lib/stage3";
import type { TreeUnit } from "../lib/stage3";
import type { BomUnit, Intersection, VnUnit } from "../report.d";

type View = "vn" | "bom" | "dim";

const RAIL_HEAD: React.CSSProperties = {
  padding: "var(--space-300) var(--space-400)",
  borderBottom: "1px solid var(--border-default-default)",
};

function VnBomViz({ naics }: { naics: string }) {
  const seg = findStage3(naics)!;
  const pyramid = seg.pyramid;
  const productName = report.product.name;

  const { roots, flat } = useMemo(() => buildVnTree(seg.vn_units), [seg]);

  // First connected row — the unit diffusil sells into.
  const firstConnectedId = useMemo(
    () =>
      flat.find(
        (n) => intersectionsForName(n.name, seg.intersections).length > 0,
      )?.id ?? null,
    [flat, seg],
  );

  // Resolve the single stakeholder-bearing row once for the whole tree. The
  // pyramid is VN-anchored at the intersection unit; when its name shares no
  // distinctive tokens with any of the generated rows, anchor the pyramid on
  // the row diffusil actually connects into (the intersection) rather than
  // dropping the stakeholders entirely.
  const pyrId = useMemo(() => {
    if (!pyramid) return null;
    return (
      pyramidUnitId(flat, pyramid.intersection_unit) ?? firstConnectedId
    );
  }, [flat, pyramid, firstConnectedId]);

  // Auto-select the pyramid intersection unit, else the first connected unit,
  // else the first row.
  const initialId = useMemo(
    () => pyrId ?? firstConnectedId ?? flat[0]?.id ?? null,
    [flat, pyrId, firstConnectedId],
  );

  const [selectedId, setSelectedId] = useState<string | null>(initialId);
  const selected = flat.find((n) => n.id === selectedId) ?? flat[0];

  const matches: Intersection[] = selected
    ? intersectionsForName(selected.name, seg.intersections)
    : [];

  return (
    <div
      style={{
        border: "1px solid var(--border-default-default)",
        borderRadius: "var(--radius-md)",
        background: "var(--surface-default-default)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", minHeight: 600 }}>
        <div style={{ borderRight: "1px solid var(--border-default-default)" }}>
          <div style={RAIL_HEAD}>
            <Text variant="b1" weight="medium">
              {seg.vn_anchor}
            </Text>
            <Text
              variant="b3"
              style={{ color: "var(--text-labels)", display: "block", marginTop: 4 }}
            >
              {seg.vn_units.length} value-network units · ▣ connected · ◐
              stakeholders
            </Text>
          </div>
          <DemoTree<VnUnit>
            roots={roots}
            selectedId={selected?.id ?? null}
            onSelect={(n) => setSelectedId(n.id)}
            headerLevels={["L7", "L6"]}
            decorate={(n) => {
              const conn = intersectionsForName(n.name, seg.intersections);
              const isPyr = n.id === pyrId;
              return {
                connectedCount: conn.length,
                hasStakeholders: isPyr,
                stakeholderCount: pyramid?.prototype_roles.length ?? 0,
              };
            }}
          />
        </div>
        <div style={{ padding: "var(--space-500)", overflow: "auto", maxHeight: 660 }}>
          {selected ? (
            <UnitDetail
              kind="vn"
              node={selected as TreeUnit<VnUnit>}
              productName={productName}
              matches={matches}
              pyramid={pyramid}
              isPyramidUnit={selected.id === pyrId}
            />
          ) : (
            <Text variant="b2" style={{ color: "var(--text-labels)" }}>
              Select a value-network unit.
            </Text>
          )}
        </div>
      </div>
    </div>
  );
}

function BomViz({ naics }: { naics: string }) {
  const seg = findStage3(naics)!;
  const productName = report.product.name;
  const { roots, flat } = useMemo(() => buildBomTree(seg.bom_units), [seg]);

  const initialId = useMemo(() => {
    const connected = flat.find(
      (n) => intersectionsForName(n.name, seg.intersections).length > 0,
    );
    return connected?.id ?? flat[0]?.id ?? null;
  }, [flat, seg]);

  const [selectedId, setSelectedId] = useState<string | null>(initialId);
  const selected = flat.find((n) => n.id === selectedId) ?? flat[0];
  const matches: Intersection[] = selected
    ? intersectionsForName(selected.name, seg.intersections)
    : [];

  return (
    <div
      style={{
        border: "1px solid var(--border-default-default)",
        borderRadius: "var(--radius-md)",
        background: "var(--surface-default-default)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", minHeight: 600 }}>
        <div style={{ borderRight: "1px solid var(--border-default-default)" }}>
          <div style={RAIL_HEAD}>
            <Text variant="b1" weight="medium">
              {seg.bom_anchor}
            </Text>
            <Text
              variant="b3"
              style={{ color: "var(--text-labels)", display: "block", marginTop: 4 }}
            >
              {seg.bom_units.length} bill-of-materials units · ▣ connected
            </Text>
          </div>
          <DemoTree<BomUnit>
            roots={roots}
            selectedId={selected?.id ?? null}
            onSelect={(n) => setSelectedId(n.id)}
            headerLevels={["L0", "L1"]}
            decorate={(n) => ({
              connectedCount: intersectionsForName(n.name, seg.intersections)
                .length,
              hasStakeholders: false,
              stakeholderCount: 0,
            })}
          />
        </div>
        <div style={{ padding: "var(--space-500)", overflow: "auto", maxHeight: 660 }}>
          {selected ? (
            <UnitDetail
              kind="bom"
              node={selected as TreeUnit<BomUnit>}
              productName={productName}
              matches={matches}
            />
          ) : (
            <Text variant="b2" style={{ color: "var(--text-labels)" }}>
              Select a component.
            </Text>
          )}
        </div>
      </div>
    </div>
  );
}

// Empty state for the 33 universe markets with no VN — show their scorecard.
function NoVnScorecard({ code }: { code: string }) {
  const market = report.universe.find((m) => naicsCode(m.naics) === code);
  if (!market) {
    return (
      <InfoCard
        title="Market not found"
        text="No ranked universe entry exists for this NAICS code."
      />
    );
  }
  const scoreRows = Object.entries(market.scores);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-500)" }}
    >
      <InfoCard
        badge={<Badge variant="neutral" size="sm">#{market.rank}</Badge>}
        title="Value network not yet built for this market"
        text="This market is ranked in the universe but its Stage-3 value network, BOM, and stakeholder pyramid have not been built. The ranking scorecard below explains why it placed where it did."
      />
      <section
        style={{ display: "flex", flexDirection: "column", gap: "var(--space-300)" }}
      >
        <Text variant="page-chapter">Ranking scorecard</Text>
        <Table striped="rows">
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Dimension</Table.HeaderCell>
              <Table.HeaderCell>Score (0–10)</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {scoreRows.map(([k, v]) => (
              <Table.Row key={k}>
                <Table.Cell>{k.replace(/_/g, " ")}</Table.Cell>
                <Table.Cell>
                  <ConfidenceBadge value={Math.round((v / 10) * 100)} hideIcon />
                </Table.Cell>
              </Table.Row>
            ))}
            <Table.Row>
              <Table.Cell>
                <strong>Composite</strong>
              </Table.Cell>
              <Table.Cell>
                <strong>{market.composite}</strong>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </section>
      <section
        style={{ display: "flex", flexDirection: "column", gap: "var(--space-300)" }}
      >
        <Text variant="page-chapter">Rationale</Text>
        <Text variant="b1" style={{ color: "var(--text-body)" }}>
          {market.rationale}
        </Text>
      </section>
    </div>
  );
}

export default function MarketDrilldown() {
  const navigate = useNavigate();
  const { naics = "" } = useParams();
  const code = naicsCode(naics);

  const seg = findStage3(code);
  const dim = report.dimension_markets.find((m) => naicsCode(m.naics) === code);
  const universe = report.universe.find((m) => naicsCode(m.naics) === code);
  const title = seg?.l2 || dim?.title || universe?.title || code;

  const hasVn = !!seg && seg.vn_units.length > 0;

  // Available sub-views depend on data.
  const viewOptions = useMemo(() => {
    const opts: { value: View; label: string }[] = [];
    if (hasVn) {
      opts.push({ value: "vn", label: "Value Network" });
      opts.push({ value: "bom", label: "BOM" });
    }
    if (dim) opts.push({ value: "dim", label: "Market dimensions" });
    return opts;
  }, [hasVn, dim]);

  const [view, setView] = useState<View>(
    hasVn ? "vn" : dim ? "dim" : "vn",
  );

  const breadcrumb = (
    <span
      style={{
        color: "var(--text-labels)",
        fontSize: 13,
        cursor: "pointer",
      }}
      onClick={() => navigate("/markets")}
    >
      Markets ›{" "}
      <span style={{ color: "var(--text-body)" }}>{title}</span>
    </span>
  );

  const aside = (
    <div style={{ display: "flex", gap: "var(--space-200)", flexWrap: "wrap" }}>
      <Badge variant="information" size="sm">
        NAICS {code}
      </Badge>
      {universe?.paths.map((p) => (
        <Badge key={p} variant="neutral" size="sm">
          {p}
        </Badge>
      ))}
    </div>
  );

  return (
    <AppShell title={title} description={dim?.title} breadcrumb={breadcrumb} titleAside={aside}>
      {viewOptions.length > 1 && (
        <Toggle
          options={viewOptions}
          value={view}
          onChange={(v) => setView(v as View)}
        />
      )}

      {!hasVn && !dim && <NoVnScorecard code={code} />}
      {!hasVn && dim && view === "dim" && <MarketDimensions market={dim} />}
      {!hasVn && dim && view !== "dim" && <NoVnScorecard code={code} />}

      {hasVn && view === "vn" && <VnBomViz naics={code} />}
      {hasVn && view === "bom" && <BomViz naics={code} />}
      {hasVn && view === "dim" && dim && <MarketDimensions market={dim} />}
    </AppShell>
  );
}
