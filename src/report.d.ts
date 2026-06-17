// Typed shape of src/data/report.json (the full PCM report bundle).

export interface Meta {
  title: string;
  subtitle: string;
  question: string;
  methodology: string[];
}

export interface Product {
  name: string;
  vendor: string;
  technology_class: string;
  functional_promise: string;
  commodity_functional_promise: string;
  custom_product_group: string;
  features: string[];
  constraints: string[];
  specifications: string[];
}

export interface UniverseScores {
  feature_fit: number;
  constraint_compat: number;
  cost_position: number;
  incumbent_vulnerability: number;
  vn_position: number;
  market_size: number;
}

export interface UniverseMarket {
  rank: number;
  naics: string;
  title: string;
  paths: string[];
  composite: number;
  scores: UniverseScores;
  rationale: string;
}

export interface UniverseStats {
  total: number;
  bom: number;
  process_vn: number;
  both: number;
}

export interface Dimension {
  name: string;
  side: string;
  role: string;
  values: string[];
  sources: string[];
}

export interface DimensionPrimary {
  name: string;
  values: string[];
  sources: string[];
}

export interface L2Market {
  name: string;
  cfj: string;
  l3: string[];
}

export interface DimensionMarket {
  rank: number;
  naics: string;
  title: string;
  job: string;
  activity_scope: string;
  demand_primary: DimensionPrimary;
  supply_primary: DimensionPrimary;
  all_dimensions: Dimension[];
  l2_markets: L2Market[];
}

export interface VnUnit {
  level: string;
  name: string;
  cfj: string;
}

export interface BomUnit {
  name: string;
  function: string;
  level: string;
}

export interface Intersection {
  unit: string;
  path: string;
  fit: string;
  role: string;
  where: string;
  rationale: string;
}

export interface Stakeholder {
  role: string;
  esco: string;
  unit: string;
  decides: string;
}

export interface Stage3Segment {
  segment_id: string;
  naics: string;
  l2: string;
  vn_anchor: string;
  vn_cfj: string;
  vn_units: VnUnit[];
  bom_anchor: string;
  bom_units: BomUnit[];
  intersections: Intersection[];
  stakeholders: Stakeholder[];
}

export interface GlossaryEntry {
  term: string;
  def: string;
}

export interface Report {
  meta: Meta;
  product: Product;
  universe: UniverseMarket[];
  universe_stats: UniverseStats;
  dimension_markets: DimensionMarket[];
  stage3: Stage3Segment[];
  glossary: GlossaryEntry[];
}
