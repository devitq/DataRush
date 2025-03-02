import "./styles/globals.css";
import { Routes, Route } from "react-router";

import { NavbarLayout } from "./widgets/navbar-layout";

import Competitions from "./pages/Competitions";
import Competition from "./pages/Competition";
import CompetitionSession from "./pages/CompetitionSession";
import LoginPage from "./pages/Login";
import { AuthLayout } from "./widgets/auth-layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReviewPage from "./pages/Review";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AuthLayout />}>
          <Route element={<NavbarLayout />}>
            <Route path="/" element={<Competitions />} />
            <Route path="/competition/:id" element={<Competition />} />
          </Route>

          <Route
            path="/competition/:id/tasks/:taskId"
            element={<CompetitionSession />}
          />

          <Route path="/profile" element={<UserProfile />} />

          <Route path="/review/:token" element={<ReviewPage />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
