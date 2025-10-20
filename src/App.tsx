import "./global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home/home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
