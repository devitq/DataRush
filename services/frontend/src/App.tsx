import "./styles/globals.css";

import { Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";

import { AuthLayout } from "./widgets/auth-layout";
import { NavbarLayout } from "./widgets/navbar-layout";
import { Loading } from "./components/ui/loading";

import LoginPage from "./pages/Login";
import CompetitionsPage from "./pages/Competitions";

const CompetitionPage = lazy(() => import("./pages/Competition"));
const SessionPage = lazy(() => import("./pages/CompetitionSession"));
const ReviewPage = lazy(() => import("./pages/Review"));
const ProfilePage = lazy(() => import("./pages/Profile"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Loading />}>
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
      </Suspense>
    </QueryClientProvider>
  );
};

export default App;
