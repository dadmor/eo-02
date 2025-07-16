// ========================================
// src/pages/operator/index.tsx - Kompletny plik
// ========================================

import React from "react";
import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/RoleGuard";
import {
  BarChart3,
  Users,
  UserPlus,
  Wrench,
  ClipboardList,
} from "lucide-react";

// Import komponentów
import { OperatorDashboard } from "./dashboard";
import { ClientManagement } from "./client-management";
import { ClientDetails } from "./client-details";
import { CreateRequestForClient } from "./create-request-for-client";
import { ClientAdd } from "./client-add";
import { ClientEdit } from "./client-edit";

// Export wszystkich komponentów
export { OperatorDashboard } from "./dashboard";
export { ClientManagement } from "./client-management";
export { ClientDetails } from "./client-details";
export { CreateRequestForClient } from "./create-request-for-client";
export { ClientAdd } from "./client-add";
export { ClientEdit } from "./client-edit";

// Helper function do tworzenia chronionej trasy
const createProtectedRoute = (
  key: string,
  path: string,
  element: React.ReactElement
) => (
  <Route
    key={key}
    path={path}
    element={<RoleGuard allowedRoles={["operator"]}>{element}</RoleGuard>}
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
    create: "/operator/client/new",
    edit: "/operator/client/:id/edit",
    show: "/operator/client/:id",
    meta: {
      label: "Klienci",
      icon: <Users className="h-4 w-4" />,
      roles: ["operator"],
    },
  },
  {
    name: "client_add",
    list: "/operator/client/new",
    meta: {
      label: "Dodaj klienta",
      icon: <UserPlus className="h-4 w-4" />,
      roles: ["operator"],
    },
  },
];

// Routes dla operatorów z RoleGuard
export const operatorRoutes = [
  createProtectedRoute(
    "operator-dashboard",
    "/operator",
    <OperatorDashboard />
  ),
  createProtectedRoute(
    "operator-clients",
    "/operator/clients",
    <ClientManagement />
  ),
  createProtectedRoute(
    "operator-client-add",
    "/operator/client/new",
    <ClientAdd />
  ),
  createProtectedRoute(
    "operator-client-edit",
    "/operator/client/:id/edit",
    <ClientEdit />
  ),
  createProtectedRoute(
    "operator-client-details",
    "/operator/client/:id",
    <ClientDetails />
  ),
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
