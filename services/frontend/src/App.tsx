import { Routes, Route } from "react-router";
import "./styles/globals.css";
import Competitions from "./pages/Competitions";
import CompetitionPreview from './pages/CompetitionPreview'
import CompetitionSession from "./pages/CompetitionSession";
import { NavbarLayout } from "./widgets/navbar-layout";

const App = () => {
  return (
    <Routes>
      <Route element={<NavbarLayout />}>
        <Route path="/" element={<Competitions />} />
        <Route path="/competition/:id" element={<CompetitionPreview />} />
        <Route
          path="/competition/:id/tasks/:taskId"
          element={<CompetitionSession />}
        />
      </Route>
    </Routes>
  );
};

export default App;
