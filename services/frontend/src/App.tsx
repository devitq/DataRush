import { Routes, Route } from "react-router";
import "./styles/globals.css";
import CompetitionsPage from "./pages/Competitions";
import CompetitionPage from "./pages/Competition";
import CompetitionRunnerPage from "./pages/CompetitionSession";
import { NavbarLayout } from "./widgets/navbar-layout";

const App = () => {
  return (
    <Routes>
      <Route element={<NavbarLayout />}>
        <Route path="/" element={<CompetitionsPage />} />
        <Route path="/competitions/:id" element={<CompetitionPage />} />
        <Route
          path="/competitions/:id/tasks/:taskId"
          element={<CompetitionRunnerPage />}
        />
      </Route>
    </Routes>
  );
};

export default App;
