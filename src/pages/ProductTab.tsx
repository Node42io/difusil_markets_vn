import {
  Badge,
  ConfidenceBadge,
  ContentCard,
  Table,
  Text,
  WidgetCard,
  WidgetItemField,
} from "@node42/ui-kit";
import { AppShell } from "../AppShell";
import report from "../data";

// Split a "Key: Value" specification string on the first ": ".
function splitSpec(spec: string): [string, string] {
  const idx = spec.indexOf(": ");
  if (idx === -1) return [spec, ""];
  return [spec.slice(0, idx), spec.slice(idx + 2)];
}

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: "var(--mono, ui-monospace, monospace)",
  fontSize: 11,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "var(--text-labels)",
};

// A subtle "In plain terms" plain-language restatement of a technical line.
function PlainTerms({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-100)",
        borderLeft: "2px solid var(--border-information)",
        paddingLeft: "var(--space-300)",
      }}
    >
      <Text
        variant="b3"
        weight="medium"
        style={{
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "var(--text-information)",
        }}
      >
        In plain terms
      </Text>
      <Text variant="b2" style={{ color: "var(--text-body)" }}>
        {text}
      </Text>
    </div>
  );
}

export default function ProductTab() {
  const { product } = report;

  return (
    <AppShell
      title={product.name}
      description={`${product.technology_class} · by ${product.vendor}`}
    >
      {/* Functional promise — the headline of this tab. */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-300)",
        }}
      >
        <Text variant="page-chapter">Functional Promise</Text>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-200)",
          }}
        >
          <div style={SECTION_LABEL}>Functional promise</div>
          <ContentCard variant="vertical" button={false}>
            {product.functional_promise}
          </ContentCard>
          <PlainTerms text={product.functional_promise_easy} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-200)",
          }}
        >
          <div style={SECTION_LABEL}>Commodity-level functional promise</div>
          <ContentCard variant="vertical" button={false}>
            {product.commodity_functional_promise}
          </ContentCard>
          <PlainTerms text={product.commodity_functional_promise_easy} />
        </div>
      </section>

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-300)",
        }}
      >
        <Text variant="page-chapter">Identity</Text>
        <WidgetCard title="Product identity" span={12}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-300)",
            }}
          >
            <WidgetItemField variant="long-title" label="Vendor">
              {product.vendor}
            </WidgetItemField>
            <WidgetItemField variant="long-title" label="Technology class">
              {product.technology_class}
            </WidgetItemField>
            <WidgetItemField variant="long-title" label="Product group">
              {product.custom_product_group}
            </WidgetItemField>
          </div>
        </WidgetCard>
      </section>

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-300)",
        }}
      >
        <Text variant="page-chapter">Features</Text>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-200)",
          }}
        >
          {product.features.map((f) => (
            <Badge key={f} variant="neutral" size="md">
              {f}
            </Badge>
          ))}
        </div>
      </section>

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-300)",
        }}
      >
        <Text variant="page-chapter">Specifications</Text>
        <Table striped="rows">
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Property</Table.HeaderCell>
              <Table.HeaderCell>Value</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {product.specifications.map((spec) => {
              const [key, value] = splitSpec(spec);
              return (
                <Table.Row key={spec}>
                  <Table.Cell>{key}</Table.Cell>
                  <Table.Cell>{value}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </section>

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-300)",
        }}
      >
        <Text variant="page-chapter">Constraints</Text>
        <Table striped="rows">
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Constraint</Table.HeaderCell>
              <Table.HeaderCell>Explanation</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {product.constraints.map((c) => (
              <Table.Row key={c.name}>
                <Table.Cell>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-100)",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text variant="b2">{c.name}</Text>
                    <Badge variant="neutral" size="sm">
                      {c.type}
                    </Badge>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-200)",
                    }}
                  >
                    <Text variant="b2" style={{ color: "var(--text-body)" }}>
                      {c.explanation}
                    </Text>
                    {c.easy && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--space-100)",
                          borderLeft: "2px solid var(--border-information)",
                          paddingLeft: "var(--space-300)",
                        }}
                      >
                        <Text
                          variant="b3"
                          weight="medium"
                          style={{
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            color: "var(--text-information)",
                          }}
                        >
                          In plain terms
                        </Text>
                        <Text
                          variant="b2"
                          style={{ color: "var(--text-body)" }}
                        >
                          {c.easy}
                        </Text>
                      </div>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </section>

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-300)",
        }}
      >
        <Text variant="page-chapter">UNSPSC Commodity</Text>
        <ContentCard variant="vertical" button={false}>
          {product.unspsc.note}
        </ContentCard>
        <WidgetCard title="Classification" span={12}>
          <WidgetItemField variant="long-title" label="Custom product group">
            {product.unspsc.custom_product_group}
          </WidgetItemField>
        </WidgetCard>
        <div style={SECTION_LABEL}>Closest UNSPSC commodity candidates</div>
        <Table striped="rows">
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>UNSPSC code</Table.HeaderCell>
              <Table.HeaderCell>Commodity</Table.HeaderCell>
              <Table.HeaderCell>Confidence</Table.HeaderCell>
              <Table.HeaderCell>Rationale</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {product.unspsc.candidates.map((u) => (
              <Table.Row key={u.code}>
                <Table.Cell>
                  <span style={{ fontFamily: "var(--font-family-mono)" }}>
                    {u.code}
                  </span>
                </Table.Cell>
                <Table.Cell>{u.name}</Table.Cell>
                <Table.Cell>
                  <ConfidenceBadge value={u.confidence} hideIcon />
                </Table.Cell>
                <Table.Cell>
                  <Text variant="b3" style={{ color: "var(--text-body)" }}>
                    {u.rationale}
                  </Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </section>
    </AppShell>
  );
}
