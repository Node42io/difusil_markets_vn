import { Table } from "@node42/ui-kit";
import { ReportPage, Section } from "../ReportPage";
import report from "../data";

export default function Glossary() {
  const { glossary } = report;

  return (
    <ReportPage title="Glossary" description="Terms and abbreviations used throughout the report">
      <Section label="Terms">
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
      </Section>
    </ReportPage>
  );
}
