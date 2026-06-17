import { useState } from "react";
import {
  Badge,
  CardTable,
  ConfidenceBadge,
  Number,
  ProgressBox,
  Table,
  Tab,
  Text,
  WidgetCard,
} from "@node42/ui-kit";
import { ReportPage, Section } from "../ReportPage";
import report from "../data";
import type { UniverseScores } from "../report.d";

const SCORE_FIELDS: { key: keyof UniverseScores; label: string }[] = [
  { key: "feature_fit", label: "Feature fit" },
  { key: "constraint_compat", label: "Constraint compatibility" },
  { key: "cost_position", label: "Cost position" },
  { key: "incumbent_vulnerability", label: "Incumbent vulnerability" },
  { key: "vn_position", label: "Value-network position" },
  { key: "market_size", label: "Market size" },
];

const LEADER_NAICS = "333242";
const SMARTPHONE_NAICS = "334220";

export default function Ranking() {
  const { universe } = report;
  const ranked = [...universe].sort((a, b) => b.composite - a.composite);

  const [selectedNaics, setSelectedNaics] = useState(ranked[0]?.naics ?? "");
  const selected = ranked.find((m) => m.naics === selectedNaics) ?? ranked[0];

  const leader = ranked.find((m) => m.naics === LEADER_NAICS);
  const phone = ranked.find((m) => m.naics === SMARTPHONE_NAICS);

  return (
    <ReportPage
      title="Ranking Detail"
      description="The PCM composite, broken down into six weighted sub-scores"
    >
      <Section label="Composite explainer">
        <Text variant="b1">
          Each market's composite (0–10) blends six weighted sub-scores: feature fit, constraint
          compatibility, cost position, incumbent vulnerability, value-network position, and market
          size. A high feature fit with a poor cost position can still rank low — the weighting
          rewards markets where diffusil's differentiators are load-bearing and its constraints are
          irrelevant.
        </Text>
      </Section>

      <Section label="Per-market scorecard">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-100)" }}>
          {ranked.slice(0, 8).map((m) => (
            <Tab
              key={m.naics}
              selected={m.naics === selected?.naics}
              onClick={() => setSelectedNaics(m.naics)}
            >
              #{m.rank} {m.naics}
            </Tab>
          ))}
        </div>
        {selected ? (
          <WidgetCard
            title={selected.title}
            description={`NAICS ${selected.naics} · rank ${selected.rank}`}
            span={12}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-400)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-400)",
                  flexWrap: "wrap",
                }}
              >
                <Number unit="score" max={10} numberSize="xl">
                  {selected.composite}
                </Number>
                <ConfidenceBadge value={selected.composite * 10} label="Composite" />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "var(--space-300)",
                }}
              >
                {SCORE_FIELDS.map((f) => (
                  <ProgressBox
                    key={f.key}
                    title={`${f.label} — ${selected.scores[f.key]}/10`}
                    value={selected.scores[f.key] * 10}
                  />
                ))}
              </div>
              <Text variant="b2">{selected.rationale}</Text>
            </div>
          </WidgetCard>
        ) : null}
      </Section>

      <Section label="Smartphone vs leader">
        {leader && phone ? (
          <CardTable
            title="Where smartphone manufacturing landed"
            description={`NAICS ${phone.naics} ranked ${phone.rank} of ${report.universe_stats.total} — its only strength is sheer market size; every diffusil-specific sub-score is weak.`}
            badgeLabel="Contrast"
            badges={
              <>
                <Badge variant="success" size="sm">
                  Leader #{leader.rank} · {leader.naics}
                </Badge>
                <Badge variant="error" size="sm">
                  Smartphone #{phone.rank} · {phone.naics}
                </Badge>
              </>
            }
            ratio="2/5"
          >
            <Table striped="rows">
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>Sub-score</Table.HeaderCell>
                  <Table.HeaderCell align="right">Leader</Table.HeaderCell>
                  <Table.HeaderCell align="right">Smartphone</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {SCORE_FIELDS.map((f) => (
                  <Table.Row key={f.key}>
                    <Table.Cell>{f.label}</Table.Cell>
                    <Table.Cell align="right">{leader.scores[f.key]}</Table.Cell>
                    <Table.Cell align="right">{phone.scores[f.key]}</Table.Cell>
                  </Table.Row>
                ))}
                <Table.Row selected>
                  <Table.Cell>
                    <strong>Composite</strong>
                  </Table.Cell>
                  <Table.Cell align="right">
                    <strong>{leader.composite}</strong>
                  </Table.Cell>
                  <Table.Cell align="right">
                    <strong>{phone.composite}</strong>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </CardTable>
        ) : null}
      </Section>
    </ReportPage>
  );
}
