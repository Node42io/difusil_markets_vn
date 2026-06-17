import report from "./data/report.json";
import type { Report } from "./report.d";

// Single typed entry point for the report bundle. The unknown-cast avoids
// structural-typing friction between the raw JSON and our hand-written types.
export default report as unknown as Report;
