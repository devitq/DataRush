import { Routes, Route } from "react-router";
import "./styles/globals.css";
import CompetitionsPage from "./pages/CompetitionsPage";
import CompetitionPreviewPage from "./pages/CompetitionPreviewPage";
import CompetitionRunnerPage from "./pages/CompetitionRunnerPage";
import { NavbarLayout } from "./widgets/navbar-layout";

const App = () => {
  return (
    <Routes>
      <Route element={<NavbarLayout />}>
        <Route path="/" element={<CompetitionsPage />} />
      </Route>
      <Route path="/competition/:id" element={<CompetitionPreviewPage />} />
      <Route
        path="/competition/:id/tasks/:taskId"
        element={<CompetitionRunnerPage />}
      />
    </Routes>
  );
};

export default App;
