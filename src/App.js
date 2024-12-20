import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Encode from "./pages/Encode";
import Decode from "./pages/Decode";
import "./styles.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/encode/:type" element={<Encode />} />
        <Route path="/decode/:type" element={<Decode />} />
      </Routes>
    </Router>
  );
}

export default App;
