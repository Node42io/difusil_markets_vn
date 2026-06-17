import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import ProductTab from "./pages/ProductTab";
import MarketsTab from "./pages/MarketsTab";
import MarketDrilldown from "./pages/MarketDrilldown";
import Glossary from "./pages/Glossary";
import About from "./pages/About";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Routes>
        {/* Primary structure: two top-level tabs + market drilldown. */}
        <Route path="/" element={<ProductTab />} />
        <Route path="/product" element={<ProductTab />} />
        <Route path="/markets" element={<MarketsTab />} />
        <Route path="/markets/:naics" element={<MarketDrilldown />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/about" element={<About />} />
        {/* Legacy routes redirect into the new flow. */}
        <Route path="/overview" element={<Navigate to="/product" replace />} />
        <Route path="/universe" element={<Navigate to="/markets" replace />} />
        <Route path="/ranking" element={<Navigate to="/markets" replace />} />
        <Route path="/dimensions" element={<Navigate to="/markets" replace />} />
        <Route path="/stakeholders" element={<Navigate to="/markets" replace />} />
        <Route path="*" element={<Navigate to="/product" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
