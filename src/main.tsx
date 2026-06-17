import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Overview from "./pages/Overview";
import Product from "./pages/Product";
import MarketUniverse from "./pages/MarketUniverse";
import Ranking from "./pages/Ranking";
import Dimensions from "./pages/Dimensions";
import Stakeholders from "./pages/Stakeholders";
import Glossary from "./pages/Glossary";
import About from "./pages/About";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/product" element={<Product />} />
        <Route path="/universe" element={<MarketUniverse />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/dimensions" element={<Dimensions />} />
        <Route path="/stakeholders" element={<Stakeholders />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
