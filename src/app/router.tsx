import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "@/auth/LoginPage";
import { RequireAuth } from "@/auth/RequireAuth";
import { RequireRole } from "@/auth/RequireRole";
import { MainLayout } from "./MainLayout";
import { DashboardPage } from "@/dashboard/DashboardPage";
import { ExpedientesListPage } from "@/expedientes/ExpedientesListPage";
import { ExpedienteCreatePage } from "@/expedientes/ExpedienteCreatePage";
import { ExpedienteDetailPage } from "@/expedientes/ExpedienteDetailPage";
import { UsersPage } from "@/usuarios/UsersPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "expedientes",
        children: [
          {
            index: true,
            element: <ExpedientesListPage />,
          },
          {
            path: "nuevo",
            element: <ExpedienteCreatePage />,
          },
          {
            path: ":id",
            element: <ExpedienteDetailPage />,
          },
          {
            path: ":id/editar",
            element: <ExpedienteCreatePage />, // Reutilizamos el form
          },
        ],
      },
      {
        path: "usuarios",
        element: (
          <RequireRole allowed={["coordinador"]}>
            <UsersPage />
          </RequireRole>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
