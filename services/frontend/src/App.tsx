import "./styles/globals.css";

import { Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthLayout } from "./widgets/auth-layout";
import { NavbarLayout } from "./widgets/navbar-layout";

import LoginPage from "./pages/Login";
import CompetitionPage from "./pages/Competition";
import CompetitionsPage from "./pages/Competitions";
import SessionPage from "./pages/CompetitionSession";
import ReviewPage from "./pages/Review";
import ProfilePage from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AuthLayout />}>
          <Route element={<NavbarLayout />}>
            <Route path="/" element={<CompetitionsPage />} />
            <Route path="/competitions/:id" element={<CompetitionPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="/session/:competitionId" element={<SessionPage />} />
          <Route
            path="/session/:competitionId/tasks/:taskId"
            element={<SessionPage />}
          />
        </Route>

        <Route path="/review/:token" element={<ReviewPage />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
