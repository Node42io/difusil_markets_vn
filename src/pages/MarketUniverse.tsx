import {
  Badge,
  ConfidenceBadge,
  Number,
  Table,
  Text,
  WidgetCard,
  WidgetItemField,
} from "@node42/ui-kit";
import { ReportPage, Section } from "../ReportPage";
import report from "../data";

const SMARTPHONE_NAICS = "334220";

export default function MarketUniverse() {
  const { universe, universe_stats } = report;
  const ranked = [...universe].sort((a, b) => b.composite - a.composite);

  const stats = [
    { label: "BOM path", value: universe_stats.bom, hint: "ships in the final product" },
    {
      label: "Process-VN path",
      value: universe_stats.process_vn,
      hint: "sits in the production/measurement equipment",
    },
    { label: "Both paths", value: universe_stats.both, hint: "reachable via either route" },
  ];

  return (
    <ReportPage
      title="Market Universe"
      description={`${universe_stats.total} exhaustively discovered NAICS markets, PCM-ranked`}
    >
      <Section label="Two-path concept">
        <Text variant="b1">
          diffusil reaches a market through one of two structurally different paths. On the{" "}
          <strong>BOM path</strong> it ships inside the final product's bill of materials. On the{" "}
          <strong>Process-VN path</strong> it sits in the equipment or process of the
          production/measurement/treatment value network — it enables the output without shipping in
          it. Markets reachable through either are flagged as <strong>Both</strong>.
        </Text>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "var(--space-300)",
          }}
        >
          {stats.map((s) => (
            <WidgetCard key={s.label} span={4} title={s.label} description={s.hint}>
              <Number numberSize="xl">{s.value}</Number>
            </WidgetCard>
          ))}
        </div>
      </Section>

      <Section label="Ranked universe">
        <Table striped="rows">
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell align="right">Rank</Table.HeaderCell>
              <Table.HeaderCell>NAICS</Table.HeaderCell>
              <Table.HeaderCell>Market</Table.HeaderCell>
              <Table.HeaderCell>Paths</Table.HeaderCell>
              <Table.HeaderCell
                align="right"
                info
                infoTooltip="Weighted PCM composite of six sub-scores (0–10), shown as a 0–100 confidence band."
              >
                Composite
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {ranked.map((m) => (
              <Table.Row key={m.naics} selected={m.naics === SMARTPHONE_NAICS}>
                <Table.Cell align="right">{m.rank}</Table.Cell>
                <Table.Cell>
                  <code>{m.naics}</code>
                </Table.Cell>
                <Table.Cell>{m.title}</Table.Cell>
                <Table.Cell>
                  <span
                    style={{ display: "inline-flex", gap: "var(--space-100)", flexWrap: "wrap" }}
                  >
                    {m.paths.map((p) => (
                      <Badge key={p} variant={p === "BOM" ? "primary" : "information"} size="xs">
                        {p}
                      </Badge>
                    ))}
                  </span>
                </Table.Cell>
                <Table.Cell align="right">
                  <ConfidenceBadge value={m.composite * 10} label="Composite" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Section>

      <Section label="Smartphone call-out">
        {(() => {
          const phone = ranked.find((m) => m.naics === SMARTPHONE_NAICS);
          if (!phone) return null;
          return (
            <WidgetCard title="Smartphone manufacturing" description={`NAICS ${phone.naics}`} span={12}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-300)" }}>
                <WidgetItemField variant="short-title" label="Market">
                  {phone.title}
                </WidgetItemField>
                <WidgetItemField variant="short-title" label="Rank">
                  {phone.rank} of {universe_stats.total}
                </WidgetItemField>
                <Text variant="b2">{phone.rationale}</Text>
              </div>
            </WidgetCard>
          );
        })()}
      </Section>
    </ReportPage>
  );
}
