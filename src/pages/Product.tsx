import { ContentCard, Table, Text, WidgetCard, WidgetItemField } from "@node42/ui-kit";
import { ReportPage, Section } from "../ReportPage";
import report from "../data";

// Split a "Key: Value" specification string on the first ": ".
function splitSpec(spec: string): [string, string] {
  const idx = spec.indexOf(": ");
  if (idx === -1) return [spec, ""];
  return [spec.slice(0, idx), spec.slice(idx + 2)];
}

export default function Product() {
  const { product } = report;

  return (
    <ReportPage
      title={product.name}
      description={`${product.technology_class} · by ${product.vendor}`}
    >
      <Section label="Identity">
        <WidgetCard title="Product identity" span={12}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-300)" }}>
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
      </Section>

      <Section label="Functional Promise">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-300)" }}>
          <div>
            <Text variant="label-s">Functional promise</Text>
            <ContentCard variant="vertical" button={false}>
              {product.functional_promise}
            </ContentCard>
          </div>
          <div>
            <Text variant="label-s">Commodity functional promise</Text>
            <ContentCard variant="vertical" button={false}>
              {product.commodity_functional_promise}
            </ContentCard>
          </div>
        </div>
      </Section>

      <Section label="Features">
        <Table striped="rows">
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Feature</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {product.features.map((f) => (
              <Table.Row key={f}>
                <Table.Cell>{f}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Section>

      <Section label="Specifications">
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
      </Section>

      <Section label="Constraints">
        <Table striped="rows">
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Constraint</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {product.constraints.map((c) => (
              <Table.Row key={c}>
                <Table.Cell>{c}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Section>
    </ReportPage>
  );
}
