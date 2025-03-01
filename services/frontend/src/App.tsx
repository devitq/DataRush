import { Routes, Route } from "react-router";
import "./styles/globals.css";
import CompetitionsPage from "./pages/CompetitionsPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<CompetitionsPage/>} />
    </Routes>

  );
};

export default App;