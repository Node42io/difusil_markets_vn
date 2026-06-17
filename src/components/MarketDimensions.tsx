import { Badge, Sources, Text } from "@node42/ui-kit";
import type { Dimension, DimensionMarket } from "../report.d";

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: "var(--mono, ui-monospace, monospace)",
  fontSize: 11,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "var(--text-labels)",
  margin: "var(--space-500) 0 var(--space-300)",
};

function DimCard({ d }: { d: Dimension }) {
  const primary = d.role === "primary";
  return (
    <div
      style={{
        border: primary
          ? "2px solid var(--border-success)"
          : "1px solid var(--border-default-default)",
        background: primary
          ? "var(--surface-default-success)"
          : "var(--surface-default-default)",
        borderRadius: "var(--radius-sm)",
        padding: "var(--space-400)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-200)",
        }}
      >
        <Text variant="b1" weight="medium">
          {d.name}
        </Text>
        {primary && (
          <Badge variant="success" size="sm">
            primary
          </Badge>
        )}
      </div>
      <Text
        variant="b3"
        style={{
          textTransform: "uppercase",
          color: "var(--text-labels)",
          display: "block",
          marginTop: "var(--space-100)",
        }}
      >
        {d.side} · {d.role}
      </Text>
      <ul
        style={{
          margin: "var(--space-200) 0 0",
          paddingLeft: "var(--space-500)",
          color: "var(--text-body)",
          fontSize: 13,
          lineHeight: "19px",
        }}
      >
        {d.values.map((v) => (
          <li key={v}>{v}</li>
        ))}
      </ul>
      {d.sources.length > 0 && (
        <div
          style={{
            marginTop: "var(--space-200)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-100)",
          }}
        >
          {d.sources.map((s, i) => (
            <Sources key={s} index={i + 1} linkText={s} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MarketDimensions({ market }: { market: DimensionMarket }) {
  const demand = market.all_dimensions.filter((d) => d.side === "demand");
  const supply = market.all_dimensions.filter((d) => d.side === "supply");

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "var(--space-300)",
  };

  return (
    <div style={{ padding: "var(--space-500)" }}>
      {(market.job || market.activity_scope) && (
        <Text variant="b1" style={{ color: "var(--text-body)" }}>
          {market.job && <strong>{market.job}</strong>}
          {market.activity_scope ? ` — ${market.activity_scope}` : ""}
        </Text>
      )}

      <div style={SECTION_LABEL}>Demand dimensions</div>
      <div style={grid}>
        {demand.map((d) => (
          <DimCard key={`d-${d.name}`} d={d} />
        ))}
      </div>

      <div style={SECTION_LABEL}>Supply dimensions</div>
      <div style={grid}>
        {supply.map((d) => (
          <DimCard key={`s-${d.name}`} d={d} />
        ))}
      </div>

      <div style={SECTION_LABEL}>L2 / L3 segmentation</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-300)",
        }}
      >
        {market.l2_markets.map((l2) => (
          <div
            key={l2.name}
            style={{
              border: "1px solid var(--border-default-default)",
              borderRadius: "var(--radius-sm)",
              padding: "var(--space-400)",
              background: "var(--surface-default-default)",
            }}
          >
            <Text variant="b1" weight="medium">
              {l2.name}
            </Text>
            {l2.cfj && (
              <div
                style={{
                  marginTop: "var(--space-100)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-100)",
                }}
              >
                <Text
                  variant="b3"
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "var(--text-labels)",
                  }}
                >
                  Core functional job
                </Text>
                <Text variant="b2" style={{ color: "var(--text-body)" }}>
                  {l2.cfj}
                </Text>
              </div>
            )}
            {l2.l3.length > 0 && (
              <div
                style={{
                  marginTop: "var(--space-300)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "var(--space-200)",
                }}
              >
                {l2.l3.map((sub) => (
                  <div
                    key={sub}
                    style={{
                      border: "1px solid var(--border-default-default)",
                      borderRadius: "var(--radius-xs)",
                      padding: "var(--space-200) var(--space-300)",
                      background: "var(--surface-default-default-2)",
                      fontSize: 13,
                    }}
                  >
                    {sub}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
