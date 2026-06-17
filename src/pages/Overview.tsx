import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  ConfidenceBadge,
  ContentCard,
  DonutChart,
  Number,
  Table,
  Text,
  WidgetCard,
  WidgetItemField,
} from "@node42/ui-kit";
import { ArrowRight } from "@phosphor-icons/react";
import { ReportPage, Section } from "../ReportPage";
import report from "../data";

const DONUT_COLORS = ["var(--primary-default)", "var(--secondary-50)", "var(--tertiary-default)"];

export default function Overview() {
  const navigate = useNavigate();
  const { meta, product, universe, universe_stats } = report;

  const top5 = [...universe].sort((a, b) => b.composite - a.composite).slice(0, 5);

  const donutData = [
    { value: universe_stats.bom, label: "BOM", color: DONUT_COLORS[0] },
    { value: universe_stats.process_vn, label: "Process-VN", color: DONUT_COLORS[1] },
    { value: universe_stats.both, label: "Both", color: DONUT_COLORS[2] },
  ];

  return (
    <ReportPage title={meta.title} description={meta.subtitle}>
      <Section label="The Question">
        <Text variant="b1">{meta.question}</Text>
        <ContentCard variant="vertical" button={false}>
          <strong>{product.name}</strong> — {product.functional_promise}
        </ContentCard>
      </Section>

      <Section label="Methodology">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "var(--space-300)",
          }}
        >
          {meta.methodology.map((step, i) => (
            <WidgetCard key={step} span={4} title={`Step ${i + 1}`}>
              <WidgetItemField variant="vertical" label={`0${i + 1}`}>
                {step}
              </WidgetItemField>
            </WidgetCard>
          ))}
        </div>
      </Section>

      <Section label="Discovery split">
        <WidgetCard
          title="Two-path discovery"
          description="How the 39 candidate markets were reached"
          span={12}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "var(--space-700)",
              paddingTop: "var(--space-300)",
            }}
          >
            <DonutChart data={donutData} size={200} title="Discovery path split">
              <div style={{ textAlign: "center" }}>
                <Number numberSize="lg">{universe_stats.total}</Number>
                <Text variant="label-s">markets</Text>
              </div>
            </DonutChart>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-300)" }}>
              <WidgetItemField variant="legend" label="BOM only" swatchColor={DONUT_COLORS[0]}>
                {universe_stats.bom}
              </WidgetItemField>
              <WidgetItemField
                variant="legend"
                label="Process-VN only"
                swatchColor={DONUT_COLORS[1]}
              >
                {universe_stats.process_vn}
              </WidgetItemField>
              <WidgetItemField variant="legend" label="Both paths" swatchColor={DONUT_COLORS[2]}>
                {universe_stats.both}
              </WidgetItemField>
            </div>
          </div>
        </WidgetCard>
      </Section>

      <Section label="Top markets">
        <Table striped="rows">
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell align="right">Rank</Table.HeaderCell>
              <Table.HeaderCell>NAICS</Table.HeaderCell>
              <Table.HeaderCell>Market</Table.HeaderCell>
              <Table.HeaderCell>Paths</Table.HeaderCell>
              <Table.HeaderCell align="right">Composite</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {top5.map((m) => (
              <Table.Row key={m.naics}>
                <Table.Cell align="right">{m.rank}</Table.Cell>
                <Table.Cell>
                  <code>{m.naics}</code>
                </Table.Cell>
                <Table.Cell>{m.title}</Table.Cell>
                <Table.Cell>
                  <span style={{ display: "inline-flex", gap: "var(--space-100)", flexWrap: "wrap" }}>
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
        <div>
          <Button
            variant="secondary"
            rightIcon={<ArrowRight size={16} weight="regular" />}
            onClick={() => navigate("/universe")}
          >
            View full 39-market universe
          </Button>
        </div>
      </Section>
    </ReportPage>
  );
}
