import { Table, Text } from "@node42/ui-kit";
import { AppShell } from "../AppShell";
import report from "../data";

export default function Glossary() {
  const { glossary } = report;

  return (
    <AppShell title="Glossary" description="Terms and abbreviations used throughout the report">
      <section
        style={{ display: "flex", flexDirection: "column", gap: "var(--space-300)" }}
      >
        <Text variant="page-chapter">Terms</Text>
        <Table striped="rows">
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Term</Table.HeaderCell>
              <Table.HeaderCell>Definition</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {glossary.map((g) => (
              <Table.Row key={g.term}>
                <Table.Cell>
                  <strong>{g.term}</strong>
                </Table.Cell>
                <Table.Cell>{g.def}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </section>
    </AppShell>
  );
}
