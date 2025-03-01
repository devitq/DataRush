import { Routes, Route } from "react-router";
import "./styles/globals.css";
import CompetitionsPage from "./pages/CompetitionsPage";
import CompetitionPreview from "./pages/CompetitionPreview";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<CompetitionsPage/>} />
      <Route path="/competition/:id" element={<CompetitionPreview />} />
    </Routes>

  );
};

export default App;