// ========================================
// src/pages/operator/index.tsx - Kompletny plik
// ========================================

import React from "react";
import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/RoleGuard";
import { BarChart3, Users, UserPlus, Wrench, ClipboardList } from "lucide-react";

// Import komponentów
import { OperatorDashboard } from "./dashboard";
import { ClientManagement } from "./client-management";
import { ClientDetails } from "./client-details";
import { CreateRequestForClient } from "./create-request-for-client";

// Export wszystkich komponentów
export { OperatorDashboard } from "./dashboard";
export { ClientManagement } from "./client-management";
export { ClientDetails } from "./client-details";
export { CreateRequestForClient } from "./create-request-for-client";

// Helper function do tworzenia chronionej trasy
const createProtectedRoute = (key: string, path: string, element: React.ReactElement) => (
  <Route
    key={key}
    path={path}
    element={
      <RoleGuard allowedRoles={["operator"]}>
        {element}
      </RoleGuard>
    }
  />
);

// Resource definitions dla Refine
export const operatorResources = [
  {
    name: "dashboard_operator",
    list: "/operator",
    meta: {
      label: "Dashboard",
      icon: <BarChart3 className="h-4 w-4" />,
      roles: ["operator"],
    },
  },
  {
    name: "clients",
    list: "/operator/clients",
    create: "/operator/clients/create",
    show: "/operator/client/:id",
    meta: {
      label: "Klienci",
      icon: <Users className="h-4 w-4" />,
      roles: ["operator"],
    },
  },
];

// Routes dla operatorów z RoleGuard
export const operatorRoutes = [
  createProtectedRoute("operator-dashboard", "/operator", <OperatorDashboard />),
  createProtectedRoute("operator-clients", "/operator/clients", <ClientManagement />),
  createProtectedRoute("operator-client-details", "/operator/client/:id", <ClientDetails />),
  createProtectedRoute(
    "operator-service-request-create", 
    "/operator/service-request/create-for-client/:clientId", 
    <CreateRequestForClient />
  ),
  createProtectedRoute(
    "operator-audit-request-create", 
    "/operator/audit-request/create-for-client/:clientId", 
    <CreateRequestForClient />
  ),
];