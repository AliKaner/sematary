import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Section from "./pages/Section";
import Grave from "./pages/Grave";
import Add from "./pages/Add";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bolum/:section" element={<Section />} />
      <Route path="/mezar/:id" element={<Grave />} />
      <Route path="/ekle" element={<Add />} />
    </Routes>
  );
}
