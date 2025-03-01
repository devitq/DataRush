import { Routes, Route } from "react-router";
import "./styles/globals.css";

import { NavbarLayout } from "./widgets/navbar-layout";

import Competitions from "./pages/Competitions";
import CompetitionPreview from "./pages/CompetitionPreview";
import CompetitionSession from "./pages/CompetitionSession";
import LoginPage from "./pages/Login";
import { AuthLayout } from "./widgets/auth-layout";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AuthLayout />}>
        <Route element={<NavbarLayout />}>
          <Route path="/" element={<Competitions />} />
          <Route path="/competition/:id" element={<CompetitionPreview />} />
        </Route>

        <Route
          path="/competition/:id/tasks/:taskId"
          element={<CompetitionSession />}
        />
      </Route>
    </Routes>
  );
};

export default App;
