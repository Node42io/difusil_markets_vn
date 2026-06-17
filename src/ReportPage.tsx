import type { ReactNode } from "react";
import { PageTemplate, Text } from "@node42/ui-kit";
import type { TextVariant } from "@node42/ui-kit";
import { ReportSidebar } from "./ReportSidebar";
import { slugify } from "./sections";

interface ReportPageProps {
  title: string;
  description?: ReactNode;
  titleAside?: ReactNode;
  children: ReactNode;
}

// Page chrome (navbar + our route-aware sidebar) wrapping the report content.
export function ReportPage({ title, description, titleAside, children }: ReportPageProps) {
  return (
    <PageTemplate
      title={title}
      titleId={slugify(title)}
      description={description}
      titleAside={titleAside}
      sidebar={<ReportSidebar />}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-700)",
          marginTop: "var(--space-600)",
        }}
      >
        {children}
      </div>
    </PageTemplate>
  );
}

interface SectionProps {
  /** Heading text — must match its sidebar sub-item so both slugify equal. */
  label: string;
  /** Heading variant (default page-chapter — the section <h2> anchor). */
  variant?: TextVariant;
  children: ReactNode;
}

// A section block whose heading id is the slug of its label, so the sidebar
// sub-item that shares the same text scrolls here.
export function Section({ label, variant = "page-chapter", children }: SectionProps) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-300)" }}>
      <Text variant={variant} id={slugify(label)} style={{ scrollMarginTop: "var(--space-600)" }}>
        {label}
      </Text>
      {children}
    </section>
  );
}
