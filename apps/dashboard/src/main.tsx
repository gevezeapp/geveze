import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import CreateProject from "./pages/project/CreateProject.tsx";

const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    element: <Register />,
  },
  {
    path: "/create-project",
    element: (
      <ProtectedRoute>
        <CreateProject />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute project={true}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </NextUIProvider>
  </StrictMode>
);
