import { ConfidenceBadge, Text } from "@node42/ui-kit";
import type { PrototypeRole } from "../report.d";

// Re-skins the demo .role card onto kit tokens. Renders one Burleson prototype
// role (job_executor / job_overseer / purchase_executor / purchase_influencer /
// job_beneficiary) with its ESCO occupations + core / emotional / status jobs.

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--mono, ui-monospace, monospace)",
  fontSize: 11,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "var(--text-labels)",
};

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: "var(--space-300)" }}>
      <div style={LABEL_STYLE}>{label}</div>
      <div style={{ marginTop: "var(--space-100)" }}>{children}</div>
    </div>
  );
}

// Wrapping chips. The kit Badge forces `white-space: nowrap`, which clips long
// incentive-category strings (e.g. "traceability audit pass rate (ISO 17025 /
// NIST chain)") at the detail panel's right edge. These custom chips reuse the
// kit's neutral-badge tokens but let the text wrap (white-space: normal +
// overflow-wrap), so nothing is cut off at 1024 / 1440.
function Chips({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-100)" }}>
      {items.map((c) => (
        <span
          key={c}
          style={{
            display: "inline-flex",
            alignItems: "center",
            maxWidth: "100%",
            borderRadius: "var(--radius-md)",
            background: "var(--surface-default-default-2)",
            color: "var(--text-body)",
            fontFamily: "var(--font-family-mono)",
            fontWeight: "var(--font-weight-regular)",
            fontSize: "var(--font-size-label-s)",
            lineHeight: "var(--line-height-label-s)",
            letterSpacing: "var(--letter-spacing-label-s)",
            padding: "var(--space-50) var(--space-200)",
            whiteSpace: "normal",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

export default function RoleCard({ role }: { role: PrototypeRole }) {
  return (
    <div
      style={{
        border: "1px solid var(--border-default-default)",
        borderRadius: "var(--radius-sm)",
        padding: "var(--space-400)",
        background: "var(--surface-default-default)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header: short Burleson role key as a wrapping information chip, then
          the (often long) human-readable type_label as wrapping body text so it
          can't be clipped at the panel's right edge. */}
      <span
        style={{
          alignSelf: "flex-start",
          maxWidth: "100%",
          borderRadius: "var(--radius-md)",
          background: "var(--surface-default-information)",
          color: "var(--text-body)",
          fontFamily: "var(--font-family-mono)",
          fontSize: "var(--font-size-label-s)",
          lineHeight: "var(--line-height-label-s)",
          letterSpacing: "var(--letter-spacing-label-s)",
          textTransform: "uppercase",
          padding: "var(--space-50) var(--space-200)",
          whiteSpace: "normal",
          overflowWrap: "anywhere",
        }}
      >
        {role.role.replace(/_/g, " ")}
      </span>
      <Text
        variant="b1"
        weight="medium"
        style={{ marginTop: "var(--space-200)", overflowWrap: "anywhere" }}
      >
        {role.type_label}
      </Text>
      <Text
        variant="label-s"
        style={{ marginTop: "var(--space-100)", overflowWrap: "anywhere" }}
      >
        {role.prototype_name}
      </Text>
      <Text
        variant="b2"
        style={{ marginTop: "var(--space-200)", color: "var(--text-body)" }}
      >
        {role.cfj}
      </Text>

      {role.esco.length > 0 && (
        <Section label="ESCO occupations">
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-200)" }}
          >
            {role.esco.map((o) => (
              <div
                key={o.code}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-200)",
                  border: "1px solid var(--border-default-default)",
                  borderRadius: "var(--radius-xs)",
                  padding: "var(--space-100) var(--space-200)",
                  background: "var(--surface-default-default-2)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--mono, ui-monospace, monospace)",
                    color: "var(--text-information)",
                    fontSize: 12,
                  }}
                >
                  {o.code}
                </span>
                <span style={{ fontSize: 12 }}>{o.title}</span>
                <ConfidenceBadge value={o.confidence} size="xs" hideIcon />
              </div>
            ))}
          </div>
        </Section>
      )}

      {role.incentive_categories.length > 0 && (
        <Section label="Incentive categories">
          <Chips items={role.incentive_categories} />
        </Section>
      )}

      {role.core_jobs.length > 0 && (
        <Section label="Core jobs">
          <ul
            style={{
              margin: 0,
              paddingLeft: "var(--space-500)",
              color: "var(--text-body)",
              fontSize: 13,
              lineHeight: "20px",
            }}
          >
            {role.core_jobs.map((j, i) => (
              <li key={i}>
                {j.statement}{" "}
                <span style={{ color: "var(--text-labels)" }}>
                  · {j.category}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {role.emotional_jobs.length > 0 && (
        <Section label="Emotional jobs">
          <ul
            style={{
              margin: 0,
              paddingLeft: "var(--space-500)",
              color: "var(--text-body)",
              fontSize: 13,
              lineHeight: "20px",
            }}
          >
            {role.emotional_jobs.map((j, i) => (
              <li key={i}>{j.feeling}</li>
            ))}
          </ul>
        </Section>
      )}

      {role.status_jobs.length > 0 && (
        <Section label="Status jobs">
          <ul
            style={{
              margin: 0,
              paddingLeft: "var(--space-500)",
              color: "var(--text-body)",
              fontSize: 13,
              lineHeight: "20px",
            }}
          >
            {role.status_jobs.map((j, i) => (
              <li key={i}>
                {j.statement}{" "}
                <span style={{ color: "var(--text-labels)" }}>
                  · {j.identity_kind.replace(/_/g, " ")}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
