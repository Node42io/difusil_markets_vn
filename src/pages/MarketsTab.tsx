import { useNavigate } from "react-router-dom";
import { Badge, ConfidenceBadge, Table, Text, WidgetCard } from "@node42/ui-kit";
import { AppShell } from "../AppShell";
import report from "../data";
import { naicsCode } from "../lib/stage3";
import type { UniverseMarket } from "../report.d";

const PATH_VARIANT: Record<string, "primary" | "information" | "neutral"> = {
  BOM: "primary",
  "Process-VN": "information",
};

// composite is 0–10; render as a 0–100 confidence-style band.
function compositeBand(composite: number) {
  return Math.round((composite / 10) * 100);
}

export default function MarketsTab() {
  const navigate = useNavigate();
  const { universe, universe_stats, stage3 } = report;

  // NAICS codes that have a full Stage-3 VN + pyramid.
  const vnCodes = new Set(stage3.map((s) => naicsCode(s.naics)));

  return (
    <AppShell
      title="Markets"
      description="The exhaustive NAICS universe, ranked by the separate PCM composite. Markets with a built value network are marked and open the full VN / BOM / stakeholder view."
    >
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "var(--space-300)",
        }}
      >
        <WidgetCard title={String(universe_stats.total)} description="Markets" span={3} />
        <WidgetCard title={String(universe_stats.bom)} description="BOM path" span={3} />
        <WidgetCard
          title={String(universe_stats.process_vn)}
          description="Process-VN path"
          span={3}
        />
        <WidgetCard title={String(universe_stats.both)} description="Both paths" span={3} />
      </section>

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-300)",
        }}
      >
        <Text variant="page-chapter">Ranked universe ({universe.length})</Text>
        <Table striped="rows">
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>NAICS</Table.HeaderCell>
              <Table.HeaderCell>Market</Table.HeaderCell>
              <Table.HeaderCell>Paths</Table.HeaderCell>
              <Table.HeaderCell>Composite</Table.HeaderCell>
              <Table.HeaderCell>VN</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {universe.map((m: UniverseMarket) => {
              const code = naicsCode(m.naics);
              const hasVn = vnCodes.has(code);
              return (
                <Table.Row
                  key={m.naics}
                  onClick={() => navigate(`/markets/${code}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Table.Cell>{m.rank}</Table.Cell>
                  <Table.Cell>
                    <span
                      style={{
                        fontFamily: "var(--mono, ui-monospace, monospace)",
                        color: "var(--text-information)",
                      }}
                    >
                      {code}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{m.title}</Table.Cell>
                  <Table.Cell>
                    <span
                      style={{
                        display: "flex",
                        gap: "var(--space-100)",
                        flexWrap: "wrap",
                      }}
                    >
                      {m.paths.map((p) => (
                        <Badge
                          key={p}
                          variant={PATH_VARIANT[p] ?? "neutral"}
                          size="xs"
                        >
                          {p}
                        </Badge>
                      ))}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <ConfidenceBadge value={compositeBand(m.composite)} hideIcon />
                  </Table.Cell>
                  <Table.Cell>
                    {hasVn ? (
                      <Badge variant="success" size="xs">
                        ▣ VN built
                      </Badge>
                    ) : (
                      <Badge variant="neutral" size="xs">
                        —
                      </Badge>
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </section>
    </AppShell>
  );
}
